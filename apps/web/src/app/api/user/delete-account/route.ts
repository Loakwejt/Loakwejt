import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Password is required'),
  confirmation: z.literal('DELETE MY ACCOUNT', {
    errorMap: () => ({ message: 'Please type "DELETE MY ACCOUNT" to confirm' }),
  }),
  reason: z.string().optional(),
});

// DELETE - Request account deletion
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
    const { password, confirmation, reason } = deleteAccountSchema.parse(body);

    // Verify password
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // For OAuth users without password, skip password verification
    if (user.passwordHash) {
      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid password' },
          { status: 400 }
        );
      }
    }

    // Check if user owns any workspaces
    const ownedWorkspaces = await prisma.workspaceMember.findMany({
      where: {
        userId: session.user.id,
        role: 'OWNER',
      },
      include: {
        workspace: {
          include: {
            members: true,
          },
        },
      },
    });

    // If user is sole owner of workspaces with other members, they must transfer ownership first
    const workspacesNeedingTransfer = ownedWorkspaces.filter(
      m => m.workspace.members.length > 1
    );

    if (workspacesNeedingTransfer.length > 0) {
      return NextResponse.json({
        error: 'You must transfer ownership of your workspaces before deleting your account',
        workspaces: workspacesNeedingTransfer.map(m => ({
          id: m.workspace.id,
          name: m.workspace.name,
          memberCount: m.workspace.members.length,
        })),
      }, { status: 400 });
    }

    // Create final audit log before deletion
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'ACCOUNT_DELETION_INITIATED',
        entity: 'User',
        entityId: session.user.id,
        details: {
          reason,
          email: user.email,
        },
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        userAgent: request.headers.get('user-agent'),
      },
    });

    // Anonymize user data instead of hard delete (for GDPR compliance - retain audit trail)
    const anonymizedEmail = `deleted-${crypto.randomBytes(8).toString('hex')}@deleted.local`;
    
    await prisma.$transaction(async (tx) => {
      // Delete sole-owner workspaces and all related data
      for (const membership of ownedWorkspaces) {
        if (membership.workspace.members.length === 1) {
          await tx.workspace.delete({
            where: { id: membership.workspace.id },
          });
        }
      }

      // Remove user from other workspaces
      await tx.workspaceMember.deleteMany({
        where: { userId: session.user.id },
      });

      // Delete sessions
      await tx.session.deleteMany({
        where: { userId: session.user.id },
      });

      // Delete accounts (OAuth connections)
      await tx.account.deleteMany({
        where: { userId: session.user.id },
      });

      // Delete password reset tokens
      await tx.passwordResetToken.deleteMany({
        where: { userId: session.user.id },
      });

      // Delete data export requests
      await tx.dataExportRequest.deleteMany({
        where: { userId: session.user.id },
      });

      // Anonymize the user (soft delete)
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          email: anonymizedEmail,
          name: 'Deleted User',
          passwordHash: null,
          image: null,
          deletedAt: new Date(),
          anonymizedAt: new Date(),
          isActive: false,
          // Keep consent records for compliance
          marketingConsent: false,
        },
      });
    });

    // Update audit logs to reference the anonymized user
    await prisma.auditLog.updateMany({
      where: { userId: session.user.id },
      data: {
        details: {
          note: 'User account has been deleted and anonymized',
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Your account has been deleted. You will be logged out shortly.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Validation error' },
        { status: 400 }
      );
    }

    console.error('Delete account error:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}
