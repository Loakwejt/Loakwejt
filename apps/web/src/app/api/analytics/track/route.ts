import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';

// POST — track a page view (called from published sites, no auth needed)
export async function POST(req: NextRequest) {
  try {
    const { siteId, pageId, path, referrer } = await req.json();
    if (!siteId || !path) {
      return NextResponse.json({ error: 'siteId and path required' }, { status: 400 });
    }

    const ua = req.headers.get('user-agent') || '';
    const device = /Mobile|Android/i.test(ua) ? 'mobile' : /Tablet|iPad/i.test(ua) ? 'tablet' : 'desktop';
    const browser = /Firefox/i.test(ua) ? 'Firefox'
      : /Edg/i.test(ua) ? 'Edge'
      : /Chrome/i.test(ua) ? 'Chrome'
      : /Safari/i.test(ua) ? 'Safari'
      : 'Other';
    const os = /Windows/i.test(ua) ? 'Windows'
      : /Mac/i.test(ua) ? 'macOS'
      : /Linux/i.test(ua) ? 'Linux'
      : /Android/i.test(ua) ? 'Android'
      : /iPhone|iPad/i.test(ua) ? 'iOS'
      : 'Other';

    await prisma.pageView.create({
      data: {
        siteId,
        pageId: pageId || null,
        path,
        referrer: referrer || null,
        userAgent: ua.slice(0, 500),
        device,
        browser,
        os,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Analytics track error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
