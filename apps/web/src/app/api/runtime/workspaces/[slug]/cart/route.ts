import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';
import crypto from 'crypto';

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

  // Update last active
  await prisma.siteUserSession.update({
    where: { id: session.id },
    data: { lastActiveAt: new Date() },
  });

  return session.siteUser;
}

// Helper: Get or create cart
async function getOrCreateCart(
  workspaceId: string,
  siteUserId: string | null,
  sessionId: string
) {
  // First try to find user's cart if logged in
  if (siteUserId) {
    const userCart = await prisma.cart.findFirst({
      where: {
        workspaceId,
        siteUserId,
        status: 'ACTIVE',
      },
    });
    if (userCart) return userCart;
  }

  // Try to find guest cart by session
  const guestCart = await prisma.cart.findFirst({
    where: {
      workspaceId,
      sessionId,
      status: 'ACTIVE',
    },
  });

  if (guestCart) {
    // If user is now logged in, link the cart to them
    if (siteUserId && !guestCart.siteUserId) {
      return prisma.cart.update({
        where: { id: guestCart.id },
        data: { siteUserId },
      });
    }
    return guestCart;
  }

  // Create new cart
  return prisma.cart.create({
    data: {
      workspaceId,
      siteUserId,
      sessionId,
      items: [],
      subtotal: 0,
    },
  });
}

// Helper: Get cart session ID from cookie
function getCartSessionId(request: NextRequest, workspaceId: string): string {
  const cookieName = `cart_session_${workspaceId}`;
  return request.cookies.get(cookieName)?.value || crypto.randomBytes(16).toString('hex');
}

// GET /api/runtime/workspaces/[slug]/cart
// Get current cart
export async function GET(
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
    const sessionId = getCartSessionId(request, workspace.id);
    const cart = await getOrCreateCart(workspace.id, siteUser?.id || null, sessionId);

    const response = NextResponse.json({
      success: true,
      cart: {
        id: cart.id,
        items: cart.items as any[],
        subtotal: cart.subtotal,
        currency: cart.currency,
        itemCount: (cart.items as any[]).reduce((sum: number, item: any) => sum + (item.quantity || 0), 0),
      },
    });

    // Set cart session cookie
    response.cookies.set(`cart_session_${workspace.id}`, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Get cart error:', error);
    return NextResponse.json({ error: 'Fehler beim Laden des Warenkorbs.' }, { status: 500 });
  }
}

// POST /api/runtime/workspaces/[slug]/cart
// Add item to cart
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

    const body = await request.json();
    const { productId, quantity = 1, variantId } = body;

    if (!productId) {
      return NextResponse.json({ error: 'Produkt-ID erforderlich.' }, { status: 400 });
    }

    // Get product
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        workspaceId: workspace.id,
        isActive: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Produkt nicht gefunden.' }, { status: 404 });
    }

    // Get price (variants are handled via options JSON, for simplicity use base price)
    const price = product.price;
    const variantName = variantId || '';
    
    // Get first image from images array
    const images = product.images as string[] | null;
    const image = images && images.length > 0 ? images[0] : null;

    const siteUser = await getSiteUser(request, workspace.id);
    const sessionId = getCartSessionId(request, workspace.id);
    const cart = await getOrCreateCart(workspace.id, siteUser?.id || null, sessionId);

    // Add or update item in cart
    const items = (cart.items as any[]) || [];
    const existingIndex = items.findIndex(
      (item) => item.productId === productId && item.variantId === (variantId || null)
    );

    if (existingIndex >= 0) {
      items[existingIndex].quantity += quantity;
    } else {
      items.push({
        productId,
        variantId: variantId || null,
        variantName,
        name: product.name,
        image,
        price,
        quantity,
      });
    }

    // Calculate subtotal
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const updatedCart = await prisma.cart.update({
      where: { id: cart.id },
      data: { items, subtotal },
    });

    const response = NextResponse.json({
      success: true,
      message: 'Produkt zum Warenkorb hinzugefügt.',
      cart: {
        id: updatedCart.id,
        items: updatedCart.items as any[],
        subtotal: updatedCart.subtotal,
        currency: updatedCart.currency,
        itemCount: items.reduce((sum: number, item: any) => sum + item.quantity, 0),
      },
    });

    response.cookies.set(`cart_session_${workspace.id}`, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json({ error: 'Fehler beim Hinzufügen zum Warenkorb.' }, { status: 500 });
  }
}

// PUT /api/runtime/workspaces/[slug]/cart
// Update cart item quantity
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const workspace = await getWorkspace(slug);
    if (!workspace) {
      return NextResponse.json({ error: 'Website nicht gefunden.' }, { status: 404 });
    }

    const body = await request.json();
    const { productId, variantId, quantity } = body;

    if (!productId || typeof quantity !== 'number') {
      return NextResponse.json({ error: 'Produkt-ID und Menge erforderlich.' }, { status: 400 });
    }

    const siteUser = await getSiteUser(request, workspace.id);
    const sessionId = getCartSessionId(request, workspace.id);
    const cart = await getOrCreateCart(workspace.id, siteUser?.id || null, sessionId);

    const items = (cart.items as any[]) || [];
    const existingIndex = items.findIndex(
      (item) => item.productId === productId && item.variantId === (variantId || null)
    );

    if (existingIndex < 0) {
      return NextResponse.json({ error: 'Produkt nicht im Warenkorb.' }, { status: 404 });
    }

    if (quantity <= 0) {
      // Remove item
      items.splice(existingIndex, 1);
    } else {
      items[existingIndex].quantity = quantity;
    }

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const updatedCart = await prisma.cart.update({
      where: { id: cart.id },
      data: { items, subtotal },
    });

    return NextResponse.json({
      success: true,
      cart: {
        id: updatedCart.id,
        items: updatedCart.items as any[],
        subtotal: updatedCart.subtotal,
        currency: updatedCart.currency,
        itemCount: items.reduce((sum: number, item: any) => sum + item.quantity, 0),
      },
    });
  } catch (error) {
    console.error('Update cart error:', error);
    return NextResponse.json({ error: 'Fehler beim Aktualisieren des Warenkorbs.' }, { status: 500 });
  }
}

// DELETE /api/runtime/workspaces/[slug]/cart
// Clear cart
export async function DELETE(
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
    const sessionId = getCartSessionId(request, workspace.id);
    const cart = await getOrCreateCart(workspace.id, siteUser?.id || null, sessionId);

    await prisma.cart.update({
      where: { id: cart.id },
      data: { items: [], subtotal: 0 },
    });

    return NextResponse.json({
      success: true,
      message: 'Warenkorb geleert.',
      cart: {
        id: cart.id,
        items: [],
        subtotal: 0,
        currency: cart.currency,
        itemCount: 0,
      },
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    return NextResponse.json({ error: 'Fehler beim Leeren des Warenkorbs.' }, { status: 500 });
  }
}
