import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { rateLimit } from '@/lib/rate-limit';

// POST - Request data export
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Rate limit: max 1 export request per day
    const rateLimitResult = await rateLimit(`data-export:${session.user.id}`, {
      windowMs: 24 * 60 * 60 * 1000, // 24 hours
      maxRequests: 1,
    });

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'You can only request one data export per day. Please try again tomorrow.' },
        { 
          status: 429,
          headers: {
            'Retry-After': String(rateLimitResult.retryAfter || 86400),
          },
        }
      );
    }

    // Check for pending export request
    const pendingRequest = await prisma.dataExportRequest.findFirst({
      where: {
        userId: session.user.id,
        status: { in: ['PENDING', 'PROCESSING'] },
      },
    });

    if (pendingRequest) {
      return NextResponse.json(
        { error: 'You already have a pending data export request' },
        { status: 400 }
      );
    }

    // Create export request
    const exportRequest = await prisma.dataExportRequest.create({
      data: {
        userId: session.user.id,
        status: 'PENDING',
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'DATA_EXPORT_REQUESTED',
        entity: 'DataExportRequest',
        entityId: exportRequest.id,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        userAgent: request.headers.get('user-agent'),
      },
    });

    // In a production environment, this would trigger a background job
    // For now, we'll process it synchronously (small datasets)
    await processDataExport(exportRequest.id, session.user.id);

    return NextResponse.json({
      success: true,
      message: 'Data export request has been submitted. You will receive an email when it is ready.',
      requestId: exportRequest.id,
    });
  } catch (error) {
    console.error('Data export request error:', error);
    return NextResponse.json(
      { error: 'Failed to create data export request' },
      { status: 500 }
    );
  }
}

// GET - Get export status and download
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const requestId = request.nextUrl.searchParams.get('requestId');

    if (requestId) {
      // Get specific export request
      const exportRequest = await prisma.dataExportRequest.findUnique({
        where: { id: requestId },
      });

      if (!exportRequest || exportRequest.userId !== session.user.id) {
        return NextResponse.json(
          { error: 'Export request not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        request: {
          id: exportRequest.id,
          status: exportRequest.status,
          createdAt: exportRequest.createdAt,
          processedAt: exportRequest.processedAt,
          expiresAt: exportRequest.expiresAt,
          error: exportRequest.error,
        },
      });
    }

    // Get all export requests for user
    const exportRequests = await prisma.dataExportRequest.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        status: true,
        createdAt: true,
        processedAt: true,
        expiresAt: true,
      },
    });

    return NextResponse.json({
      requests: exportRequests,
    });
  } catch (error) {
    console.error('Get data export error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch export requests' },
      { status: 500 }
    );
  }
}

// Process data export (would be a background job in production)
async function processDataExport(requestId: string, userId: string) {
  try {
    await prisma.dataExportRequest.update({
      where: { id: requestId },
      data: { status: 'PROCESSING' },
    });

    // Collect all user data
    const userData = await collectUserData(userId);

    // In production, you would:
    // 1. Create a JSON/ZIP file
    // 2. Upload to secure storage (S3, etc.)
    // 3. Send email with download link
    // 4. Set expiration date

    // For now, we'll store the data temporarily
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await prisma.dataExportRequest.update({
      where: { id: requestId },
      data: {
        status: 'COMPLETED',
        processedAt: new Date(),
        expiresAt,
        // In production, this would be a URL to the file
        fileUrl: JSON.stringify(userData),
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'DATA_EXPORT_COMPLETED',
        entity: 'DataExportRequest',
        entityId: requestId,
      },
    });
  } catch (error) {
    console.error('Process data export error:', error);
    await prisma.dataExportRequest.update({
      where: { id: requestId },
      data: {
        status: 'FAILED',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    });
  }
}

// Collect all user data for GDPR export
async function collectUserData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      accounts: {
        select: {
          provider: true,
          createdAt: true,
        },
      },
      memberships: {
        include: {
          workspace: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      },
      createdPages: {
        select: {
          id: true,
          name: true,
          slug: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      assets: {
        select: {
          id: true,
          name: true,
          fileName: true,
          mimeType: true,
          size: true,
          createdAt: true,
        },
      },
      auditLogs: {
        select: {
          action: true,
          entity: true,
          createdAt: true,
          ipAddress: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 1000, // Limit for performance
      },
    },
  });

  if (!user) return null;

  return {
    exportDate: new Date().toISOString(),
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      emailVerified: user.emailVerified,
      privacyConsentAt: user.privacyConsentAt,
      privacyConsentVersion: user.privacyConsentVersion,
      marketingConsent: user.marketingConsent,
      marketingConsentAt: user.marketingConsentAt,
    },
    accounts: user.accounts,
    workspaces: user.memberships.map(m => ({
      role: m.role,
      workspace: m.workspace,
      joinedAt: m.createdAt,
    })),
    pages: user.createdPages,
    assets: user.assets,
    activityLog: user.auditLogs,
  };
}
