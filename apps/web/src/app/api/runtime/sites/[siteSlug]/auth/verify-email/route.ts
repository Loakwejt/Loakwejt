import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';
import { createAuditLog } from '@/lib/audit';

// GET /api/runtime/sites/[siteSlug]/auth/verify-email?token=...
// Bestätigt die E-Mail-Adresse eines Website-Benutzers
export async function GET(
  request: NextRequest,
  { params }: { params: { siteSlug: string } }
) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return new NextResponse(errorPage('Ungültiger Verifizierungslink.'), {
        status: 400,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    // Find published site
    const site = await prisma.site.findFirst({
      where: { slug: params.siteSlug, isPublished: true },
      select: { id: true, name: true },
    });

    if (!site) {
      return new NextResponse(errorPage('Website nicht gefunden.'), {
        status: 404,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    // Find user with this verification token
    const siteUser = await prisma.siteUser.findFirst({
      where: {
        siteId: site.id,
        verificationToken: token,
      },
    });

    if (!siteUser) {
      return new NextResponse(errorPage('Ungültiger oder bereits verwendeter Verifizierungslink.'), {
        status: 400,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    if (siteUser.emailVerified) {
      return new NextResponse(successPage('Deine E-Mail-Adresse wurde bereits bestätigt.', params.siteSlug), {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    // Verify the email
    await prisma.siteUser.update({
      where: { id: siteUser.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null, // Invalidate the token
      },
    });

    await createAuditLog({
      action: 'SITE_USER_EMAIL_VERIFIED',
      entity: 'SiteUser',
      entityId: siteUser.id,
      details: { siteSlug: params.siteSlug, email: siteUser.email },
    });

    return new NextResponse(successPage('E-Mail erfolgreich bestätigt! Du kannst dich jetzt anmelden.', params.siteSlug), {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch (error) {
    console.error('Email verification error:', error);
    return new NextResponse(errorPage('Ein unerwarteter Fehler ist aufgetreten.'), {
      status: 500,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }
}

// Simple HTML pages for the verification response
function successPage(message: string, siteSlug: string) {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>E-Mail bestätigt</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #f9fafb; }
    .card { background: white; border-radius: 12px; padding: 2rem; max-width: 400px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .icon { width: 48px; height: 48px; margin: 0 auto 1rem; background: #d1fae5; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
    .icon svg { width: 24px; height: 24px; color: #059669; }
    h1 { font-size: 1.25rem; margin: 0 0 0.5rem; color: #111; }
    p { color: #666; margin: 0 0 1.5rem; font-size: 0.9rem; }
    a { background: #111; color: white; padding: 0.6rem 1.5rem; border-radius: 8px; text-decoration: none; font-size: 0.875rem; font-weight: 500; }
    a:hover { background: #333; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg></div>
    <h1>Geschafft!</h1>
    <p>${message}</p>
    <a href="/s/${siteSlug}">Zur Website</a>
  </div>
</body>
</html>`;
}

function errorPage(message: string) {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Verifizierung fehlgeschlagen</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #f9fafb; }
    .card { background: white; border-radius: 12px; padding: 2rem; max-width: 400px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .icon { width: 48px; height: 48px; margin: 0 auto 1rem; background: #fee2e2; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
    .icon svg { width: 24px; height: 24px; color: #dc2626; }
    h1 { font-size: 1.25rem; margin: 0 0 0.5rem; color: #111; }
    p { color: #666; margin: 0; font-size: 0.9rem; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></div>
    <h1>Fehler</h1>
    <p>${message}</p>
  </div>
</body>
</html>`;
}
