import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import type { SessionResponse } from '@builderly/sdk';

/**
 * GET /api/auth/session
 * 
 * Returns the current session with extended context including:
 * - User information
 * - Workspace memberships and roles
 * - Site information (with page counts)
 * - Total workspace and site counts
 * 
 * This endpoint provides comprehensive context about the user's page structure,
 * allowing clients to understand the full hierarchy: User → Workspaces → Sites → Pages
 * 
 * @returns {SessionResponse} Session object with context or null if not authenticated
 */
export async function GET(request: NextRequest) {
  try {
    // Get base session from NextAuth
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ session: null }, { status: 200 });
    }

    // Fetch user's workspace memberships with role information
    const workspaceMemberships = await prisma.workspaceMember.findMany({
      where: { userId: session.user.id },
      include: {
        workspace: {
          include: {
            _count: {
              select: {
                sites: true,
                members: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Fetch sites across all workspaces the user has access to
    const sites = await prisma.site.findMany({
      where: {
        workspaceId: {
          in: workspaceMemberships.map((m) => m.workspaceId),
        },
      },
      include: {
        _count: {
          select: {
            pages: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Build workspace context with sites
    const workspaceContext = workspaceMemberships.map((membership) => {
      const workspaceSites = sites.filter(
        (site) => site.workspaceId === membership.workspaceId
      );

      return {
        id: membership.workspace.id,
        name: membership.workspace.name,
        slug: membership.workspace.slug,
        role: membership.role,
        plan: membership.workspace.plan,
        siteCount: membership.workspace._count.sites,
        memberCount: membership.workspace._count.members,
        sites: workspaceSites.map((site) => ({
          id: site.id,
          name: site.name,
          slug: site.slug,
          customDomain: site.customDomain,
          pageCount: site._count.pages,
          isPublished: site.isPublished,
        })),
      };
    });

    // Return enhanced session with context
    return NextResponse.json({
      session: {
        user: session.user,
        context: {
          workspaces: workspaceContext,
          totalWorkspaces: workspaceMemberships.length,
          totalSites: sites.length,
        },
      },
    });
  } catch (error) {
    console.error('Session context error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch session context' },
      { status: 500 }
    );
  }
}
