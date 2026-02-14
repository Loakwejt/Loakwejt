import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';

// Helper: Get workspace by slug
async function getWorkspace(slug: string) {
  return prisma.workspace.findFirst({
    where: { slug, isPublished: true },
    select: { id: true },
  });
}

// Helper: Get current site user from session
async function getSiteUser(request: NextRequest, workspaceId: string) {
  const cookieName = `site_session_${workspaceId}`;
  const sessionToken = request.cookies.get(cookieName)?.value;
  const authHeader = request.headers.get('authorization');
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const token = sessionToken || bearerToken;

  if (!token) return null;

  const session = await prisma.siteUserSession.findUnique({
    where: { token },
    include: { siteUser: true },
  });

  if (!session || session.expiresAt < new Date()) {
    return null;
  }

  return session.siteUser;
}

// POST /api/runtime/workspaces/[slug]/cart/merge
// Merge guest cart into user cart after login
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const workspace = await getWorkspace(slug);
    if (!workspace) {
      return NextResponse.json({ error: 'Website nicht gefunden.' }, { status: 404 });
    }

    const siteUser = await getSiteUser(request, workspace.id);
    if (!siteUser) {
      return NextResponse.json({ error: 'Nicht angemeldet.' }, { status: 401 });
    }

    // Get guest cart session ID from cookie
    const cartSessionCookie = request.cookies.get(`cart_session_${workspace.id}`)?.value;
    if (!cartSessionCookie) {
      return NextResponse.json({ success: true, message: 'Kein Gast-Warenkorb vorhanden.' });
    }

    // Find guest cart
    const guestCart = await prisma.cart.findFirst({
      where: {
        workspaceId: workspace.id,
        sessionId: cartSessionCookie,
        siteUserId: null, // Only guest carts
        status: 'ACTIVE',
      },
    });

    if (!guestCart || (guestCart.items as any[]).length === 0) {
      return NextResponse.json({ success: true, message: 'Kein Gast-Warenkorb vorhanden.' });
    }

    // Find or create user cart
    let userCart = await prisma.cart.findFirst({
      where: {
        workspaceId: workspace.id,
        siteUserId: siteUser.id,
        status: 'ACTIVE',
      },
    });

    if (!userCart) {
      // No existing user cart - just assign guest cart to user
      userCart = await prisma.cart.update({
        where: { id: guestCart.id },
        data: { siteUserId: siteUser.id },
      });

      return NextResponse.json({
        success: true,
        message: 'Warenkorb übernommen.',
        cart: {
          id: userCart.id,
          items: userCart.items as any[],
          subtotal: userCart.subtotal,
          currency: userCart.currency,
          itemCount: (userCart.items as any[]).reduce((sum: number, item: any) => sum + item.quantity, 0),
        },
      });
    }

    // Merge guest cart items into user cart
    const userItems = (userCart.items as any[]) || [];
    const guestItems = (guestCart.items as any[]) || [];

    for (const guestItem of guestItems) {
      const existingIndex = userItems.findIndex(
        (item) => item.productId === guestItem.productId && item.variantId === guestItem.variantId
      );

      if (existingIndex >= 0) {
        // Add quantities
        userItems[existingIndex].quantity += guestItem.quantity;
      } else {
        // Add new item
        userItems.push(guestItem);
      }
    }

    const subtotal = userItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Update user cart
    const updatedUserCart = await prisma.cart.update({
      where: { id: userCart.id },
      data: { items: userItems, subtotal },
    });

    // Delete guest cart
    await prisma.cart.delete({ where: { id: guestCart.id } });

    return NextResponse.json({
      success: true,
      message: 'Warenkörbe zusammengeführt.',
      cart: {
        id: updatedUserCart.id,
        items: updatedUserCart.items as any[],
        subtotal: updatedUserCart.subtotal,
        currency: updatedUserCart.currency,
        itemCount: userItems.reduce((sum: number, item: any) => sum + item.quantity, 0),
      },
    });
  } catch (error) {
    console.error('Merge cart error:', error);
    return NextResponse.json({ error: 'Fehler beim Zusammenführen der Warenkörbe.' }, { status: 500 });
  }
}
