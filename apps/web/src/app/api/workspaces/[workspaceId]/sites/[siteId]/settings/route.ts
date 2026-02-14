import { NextRequest, NextResponse } from 'next/server';
import { prisma, Prisma } from '@builderly/db';
import { requireWorkspacePermission } from '@/lib/permissions';
import { createAuditLog } from '@/lib/audit';
import { SiteSettingsSchema, mergeSiteSettings } from '@builderly/core';
import { z } from 'zod';

// GET /api/workspaces/[workspaceId]/sites/[siteId]/settings
export async function GET(
  request: NextRequest,
  { params }: { params: { workspaceId: string; siteId: string } }
) {
  try {
    await requireWorkspacePermission(params.workspaceId, 'view');

    const site = await prisma.site.findFirst({
      where: {
        id: params.siteId,
        workspaceId: params.workspaceId,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        faviconUrl: true,
        settings: true,
        customDomain: true,
        isPublished: true,
      },
    });

    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    // Merge with defaults to ensure all fields are present
    const settings = mergeSiteSettings((site.settings as Record<string, unknown>) || {});

    return NextResponse.json({
      ...site,
      settings,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error fetching site settings:', error);
    return NextResponse.json({ error: 'Failed to fetch site settings' }, { status: 500 });
  }
}

// PATCH /api/workspaces/[workspaceId]/sites/[siteId]/settings
export async function PATCH(
  request: NextRequest,
  { params }: { params: { workspaceId: string; siteId: string } }
) {
  try {
    const { userId } = await requireWorkspacePermission(params.workspaceId, 'edit');

    const body = await request.json();

    // Get current site
    const site = await prisma.site.findFirst({
      where: {
        id: params.siteId,
        workspaceId: params.workspaceId,
      },
    });

    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    // Validate settings if provided
    let newSettings = site.settings;
    if (body.settings !== undefined) {
      try {
        // Deep merge current settings with new settings
        const currentSettings = (site.settings as Record<string, unknown>) || {};
        const mergedSettings = deepMerge(currentSettings, body.settings);
        newSettings = SiteSettingsSchema.parse(mergedSettings);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return NextResponse.json(
            { error: 'Invalid settings', details: error.errors },
            { status: 400 }
          );
        }
        throw error;
      }
    }

    // Update site
    const updatedSite = await prisma.site.update({
      where: { id: params.siteId },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.faviconUrl !== undefined && { faviconUrl: body.faviconUrl }),
        ...(body.customDomain !== undefined && { customDomain: body.customDomain || null }),
        settings: newSettings as Prisma.InputJsonValue,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        faviconUrl: true,
        settings: true,
        customDomain: true,
        isPublished: true,
      },
    });

    await createAuditLog({ userId, action: 'SITE_SETTINGS_UPDATED', entity: 'Site', entityId: params.siteId, details: { changedFields: Object.keys(body) } });

    return NextResponse.json(updatedSite);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error updating site settings:', error);
    return NextResponse.json({ error: 'Failed to update site settings' }, { status: 500 });
  }
}

/**
 * Deep merge two objects
 */
function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  const result = { ...target };
  
  for (const key of Object.keys(source)) {
    const sourceValue = source[key];
    const targetValue = result[key];
    
    if (
      sourceValue &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      targetValue &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      result[key] = deepMerge(
        targetValue as Record<string, unknown>,
        sourceValue as Record<string, unknown>
      );
    } else {
      result[key] = sourceValue;
    }
  }
  
  return result;
}
