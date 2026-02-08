import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';

// GET /api/templates - Get all published templates (public endpoint)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const websiteType = searchParams.get('websiteType');
    const style = searchParams.get('style');

    const where: Record<string, unknown> = {
      isPublished: true,
    };
    
    if (category) where.category = category;
    if (websiteType) where.websiteType = websiteType;
    if (style) where.style = style;

    const templates = await prisma.template.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        thumbnail: true,
        category: true,
        style: true,
        websiteType: true,
        tags: true,
        tree: true,
        isPro: true,
      },
      orderBy: [
        { category: 'asc' },
        { name: 'asc' },
      ],
    });

    // Transform to match FullPageTemplate / TemplateDefinition format
    const transformed = templates.map(t => {
      const tree = t.tree as { root?: { children?: unknown[] } };
      
      // For section templates (non FULL_PAGE), extract the first child from root
      // as the actual section node
      let node = undefined;
      if (t.category !== 'FULL_PAGE' && tree?.root?.children?.[0]) {
        node = tree.root.children[0];
      }
      
      return {
        id: t.id,
        name: t.name,
        slug: t.slug,
        description: t.description || '',
        thumbnail: t.thumbnail,
        category: t.category.toLowerCase().replace('_', '-'),
        style: t.style || 'modern',
        websiteType: t.websiteType || 'business',
        websiteTypes: t.websiteType ? [t.websiteType] : ['business'],
        tags: t.tags,
        isPro: t.isPro,
        tree: t.tree,
        node: node,
      };
    });

    return NextResponse.json({ data: transformed });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
  }
}
