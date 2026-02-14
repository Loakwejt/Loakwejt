import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';

// GET - List all sessions for current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const sessions = await prisma.session.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        ipAddress: true,
        userAgent: true,
        deviceType: true,
        lastActive: true,
        createdAt: true,
        expires: true,
      },
      orderBy: { lastActive: 'desc' },
    });

    // Get current session token from cookie to identify current session
    const currentSessionToken = request.cookies.get('next-auth.session-token')?.value
      || request.cookies.get('__Secure-next-auth.session-token')?.value;

    // Mark current session
    const sessionsWithCurrent = await Promise.all(
      sessions.map(async (s) => {
        const dbSession = await prisma.session.findUnique({
          where: { id: s.id },
          select: { sessionToken: true },
        });
        return {
          ...s,
          isCurrent: dbSession?.sessionToken === currentSessionToken,
        };
      })
    );

    return NextResponse.json({
      sessions: sessionsWithCurrent,
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}

// DELETE - Revoke a specific session or all other sessions
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { sessionId, revokeAll } = body;

    if (revokeAll) {
      // Get current session token
      const currentSessionToken = request.cookies.get('next-auth.session-token')?.value
        || request.cookies.get('__Secure-next-auth.session-token')?.value;

      // Delete all sessions except current
      const deleted = await prisma.session.deleteMany({
        where: {
          userId: session.user.id,
          sessionToken: { not: currentSessionToken },
        },
      });

      // Create audit log
      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: 'ALL_SESSIONS_REVOKED',
          entity: 'Session',
          details: { count: deleted.count },
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
          userAgent: request.headers.get('user-agent'),
        },
      });

      return NextResponse.json({
        success: true,
        message: `Revoked ${deleted.count} session(s)`,
      });
    }

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Find the session
    const targetSession = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!targetSession || targetSession.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Delete the session
    await prisma.session.delete({
      where: { id: sessionId },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'SESSION_REVOKED',
        entity: 'Session',
        entityId: sessionId,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        userAgent: request.headers.get('user-agent'),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Session revoked successfully',
    });
  } catch (error) {
    console.error('Delete session error:', error);
    return NextResponse.json(
      { error: 'Failed to revoke session' },
      { status: 500 }
    );
  }
}
