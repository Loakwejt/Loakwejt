import { NextRequest, NextResponse } from 'next/server';
import { prisma, Prisma } from '@builderly/db';
import { requireWorkspacePermission } from '@/lib/permissions';
import { createAuditLog } from '@/lib/audit';
import { SiteSettingsSchema, mergeSiteSettings } from '@builderly/core';
import { z } from 'zod';

interface RouteContext {
  params: Promise<{ workspaceId: string }>;
}

// GET /api/workspaces/[workspaceId]/settings
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { workspaceId } = await params;
    await requireWorkspacePermission(workspaceId, 'view');

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        faviconUrl: true,
        settings: true,
        customDomain: true,
        isPublished: true,
        enableUserAuth: true,
        companyName: true,
        companyEmail: true,
        companyPhone: true,
        companyAddress: true,
        companyVatId: true,
        companyWebsite: true,
      },
    });

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    // Merge with defaults to ensure all fields are present
    const settings = mergeSiteSettings((workspace.settings as Record<string, unknown>) || {});

    return NextResponse.json({
      ...workspace,
      settings,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error fetching workspace settings:', error);
    return NextResponse.json({ error: 'Failed to fetch workspace settings' }, { status: 500 });
  }
}

// PATCH /api/workspaces/[workspaceId]/settings
export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { workspaceId } = await params;
    const { userId } = await requireWorkspacePermission(workspaceId, 'edit');

    const body = await request.json();

    // Get current workspace
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    // Validate settings if provided
    let newSettings = workspace.settings;
    if (body.settings !== undefined) {
      try {
        // Deep merge current settings with new settings
        const currentSettings = (workspace.settings as Record<string, unknown>) || {};
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

    // Update workspace
    const updatedWorkspace = await prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.faviconUrl !== undefined && { faviconUrl: body.faviconUrl }),
        ...(body.customDomain !== undefined && { customDomain: body.customDomain || null }),
        ...(body.enableUserAuth !== undefined && { enableUserAuth: body.enableUserAuth }),
        ...(body.isPublished !== undefined && { isPublished: body.isPublished }),
        ...(body.companyName !== undefined && { companyName: body.companyName }),
        ...(body.companyEmail !== undefined && { companyEmail: body.companyEmail }),
        ...(body.companyPhone !== undefined && { companyPhone: body.companyPhone }),
        ...(body.companyAddress !== undefined && { companyAddress: body.companyAddress }),
        ...(body.companyVatId !== undefined && { companyVatId: body.companyVatId }),
        ...(body.companyWebsite !== undefined && { companyWebsite: body.companyWebsite }),
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
        enableUserAuth: true,
        companyName: true,
        companyEmail: true,
        companyPhone: true,
        companyAddress: true,
        companyVatId: true,
        companyWebsite: true,
      },
    });

    await createAuditLog({
      userId,
      action: 'WORKSPACE_SETTINGS_UPDATED',
      entity: 'Workspace',
      entityId: workspaceId,
      details: { changedFields: Object.keys(body) },
    });

    return NextResponse.json(updatedWorkspace);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error updating workspace settings:', error);
    return NextResponse.json({ error: 'Failed to update workspace settings' }, { status: 500 });
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
