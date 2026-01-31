import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';
import { getCurrentUser } from '@/lib/permissions';
import { z } from 'zod';

// Schema for updating templates
const UpdateTemplateSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().optional().nullable(),
  thumbnail: z.string().url().optional().nullable(),
  category: z.enum([
    'HERO', 'FEATURES', 'PRICING', 'TESTIMONIALS', 'CTA', 'CONTACT',
    'TEAM', 'FAQ', 'FOOTER', 'HEADER', 'GALLERY', 'STATS', 'BLOG',
    'ECOMMERCE', 'CONTENT', 'FULL_PAGE'
  ]).optional(),
  style: z.string().optional().nullable(),
  websiteType: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  tree: z.any().optional(),
  isPro: z.boolean().optional(),
  isPublished: z.boolean().optional(),
});

async function isAdminUser(userId: string): Promise<boolean> {
  const adminMembership = await prisma.workspaceMember.findFirst({
    where: {
      userId,
      role: { in: ['OWNER', 'ADMIN'] },
    },
  });
  return !!adminMembership;
}

// GET /api/admin/templates/[templateId] - Get a single template
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = await isAdminUser(user.id);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const { templateId } = await params;

    const template = await prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json({ data: template });
  } catch (error) {
    console.error('Error fetching template:', error);
    return NextResponse.json({ error: 'Failed to fetch template' }, { status: 500 });
  }
}

// PUT /api/admin/templates/[templateId] - Update a template
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = await isAdminUser(user.id);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const { templateId } = await params;
    const body = await request.json();
    const validated = UpdateTemplateSchema.parse(body);

    // Check if template exists
    const existing = await prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    // If changing slug, check uniqueness
    if (validated.slug && validated.slug !== existing.slug) {
      const slugExists = await prisma.template.findUnique({
        where: { slug: validated.slug },
      });
      if (slugExists) {
        return NextResponse.json(
          { error: 'A template with this slug already exists' },
          { status: 400 }
        );
      }
    }

    const template = await prisma.template.update({
      where: { id: templateId },
      data: validated,
    });

    return NextResponse.json({ data: template });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error updating template:', error);
    return NextResponse.json({ error: 'Failed to update template' }, { status: 500 });
  }
}

// DELETE /api/admin/templates/[templateId] - Delete a template
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = await isAdminUser(user.id);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const { templateId } = await params;

    const existing = await prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    // Don't allow deleting system templates
    if (existing.isSystem) {
      return NextResponse.json(
        { error: 'Cannot delete system templates' },
        { status: 400 }
      );
    }

    await prisma.template.delete({
      where: { id: templateId },
    });

    return NextResponse.json({ message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Error deleting template:', error);
    return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 });
  }
}
