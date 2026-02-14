import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';
import { getCurrentUser } from '@/lib/permissions';
import { createAuditLog } from '@/lib/audit';
import { z } from 'zod';

// Schema for creating/updating templates
const TemplateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
  description: z.string().optional(),
  thumbnail: z.string().url().optional().nullable(),
  category: z.enum([
    'HERO', 'FEATURES', 'PRICING', 'TESTIMONIALS', 'CTA', 'CONTACT',
    'TEAM', 'FAQ', 'FOOTER', 'HEADER', 'GALLERY', 'STATS', 'BLOG',
    'ECOMMERCE', 'CONTENT', 'FULL_PAGE'
  ]),
  style: z.string().optional().nullable(),
  websiteType: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  tree: z.any(), // BuilderTree JSON
  isPro: z.boolean().optional(),
  isPublished: z.boolean().optional(),
});

// Check if user is admin (has OWNER or ADMIN role in any workspace)
async function isAdminUser(userId: string): Promise<boolean> {
  const adminMembership = await prisma.workspaceMember.findFirst({
    where: {
      userId,
      role: { in: ['OWNER', 'ADMIN'] },
    },
  });
  return !!adminMembership;
}

// GET /api/admin/templates - List all templates (admin only)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = await isAdminUser(user.id);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const isPublished = searchParams.get('isPublished');

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (isPublished !== null) where.isPublished = isPublished === 'true';

    const templates = await prisma.template.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ data: templates });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
  }
}

// POST /api/admin/templates - Create a new template (admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = await isAdminUser(user.id);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const validated = TemplateSchema.parse(body);

    // Check if slug is unique
    const existing = await prisma.template.findUnique({
      where: { slug: validated.slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'A template with this slug already exists' },
        { status: 400 }
      );
    }

    const template = await prisma.template.create({
      data: {
        name: validated.name,
        slug: validated.slug,
        description: validated.description,
        thumbnail: validated.thumbnail,
        category: validated.category,
        style: validated.style,
        websiteType: validated.websiteType,
        tags: validated.tags || [],
        tree: validated.tree,
        isPro: validated.isPro || false,
        isPublished: validated.isPublished ?? true,
        createdById: user.id,
      },
    });

    await createAuditLog({ userId: user.id, action: 'TEMPLATE_CREATED', entity: 'Template', entityId: template.id, details: { name: validated.name, slug: validated.slug, category: validated.category } });

    return NextResponse.json({ data: template }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating template:', error);
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
  }
}
