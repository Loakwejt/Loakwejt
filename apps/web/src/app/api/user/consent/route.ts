import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { z } from 'zod';

// GET - Get current consent status
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        privacyConsentAt: true,
        privacyConsentVersion: true,
        marketingConsent: true,
        marketingConsentAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      consent: {
        privacy: {
          accepted: !!user.privacyConsentAt,
          acceptedAt: user.privacyConsentAt,
          version: user.privacyConsentVersion,
        },
        marketing: {
          accepted: user.marketingConsent,
          acceptedAt: user.marketingConsentAt,
        },
      },
    });
  } catch (error) {
    console.error('Get consent error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch consent status' },
      { status: 500 }
    );
  }
}

const updateConsentSchema = z.object({
  marketingConsent: z.boolean().optional(),
  privacyConsent: z.boolean().optional(),
});

// PUT - Update consent preferences
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { marketingConsent, privacyConsent } = updateConsentSchema.parse(body);

    // Get current user state for audit log
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        marketingConsent: true,
        privacyConsentAt: true,
      },
    });

    const updateData: Record<string, unknown> = {};

    if (marketingConsent !== undefined) {
      updateData.marketingConsent = marketingConsent;
      updateData.marketingConsentAt = marketingConsent ? new Date() : null;
    }

    if (privacyConsent !== undefined && privacyConsent === true) {
      // Privacy consent can only be accepted, not revoked (requires account deletion)
      updateData.privacyConsentAt = new Date();
      updateData.privacyConsentVersion = '1.0';
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        privacyConsentAt: true,
        privacyConsentVersion: true,
        marketingConsent: true,
        marketingConsentAt: true,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'CONSENT_UPDATED',
        entity: 'User',
        entityId: session.user.id,
        details: {
          changes: {
            marketingConsent: marketingConsent !== undefined ? {
              from: currentUser?.marketingConsent,
              to: marketingConsent,
            } : undefined,
            privacyConsent: privacyConsent !== undefined ? {
              from: !!currentUser?.privacyConsentAt,
              to: privacyConsent,
            } : undefined,
          },
        },
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        userAgent: request.headers.get('user-agent'),
      },
    });

    return NextResponse.json({
      success: true,
      consent: {
        privacy: {
          accepted: !!user.privacyConsentAt,
          acceptedAt: user.privacyConsentAt,
          version: user.privacyConsentVersion,
        },
        marketing: {
          accepted: user.marketingConsent,
          acceptedAt: user.marketingConsentAt,
        },
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Validation error' },
        { status: 400 }
      );
    }

    console.error('Update consent error:', error);
    return NextResponse.json(
      { error: 'Failed to update consent' },
      { status: 500 }
    );
  }
}
