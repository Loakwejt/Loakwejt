'use client';

import React, { createContext, useContext, useCallback, useEffect, useState, useMemo } from 'react';

// ============================================================================
// TYPES
// ============================================================================

export interface CartItem {
  productId: string;
  variantId: string | null;
  variantName: string;
  name: string;
  image: string | null;
  price: number; // in cents
  quantity: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number; // in cents
  currency: string;
  itemCount: number;
}

interface CartContextValue {
  cart: Cart | null;
  loading: boolean;
  adding: boolean;
  slug: string;
  addToCart: (productId: string, quantity?: number, variantId?: string) => Promise<{ success: boolean; error?: string }>;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => Promise<{ success: boolean; error?: string }>;
  removeItem: (productId: string, variantId?: string) => Promise<{ success: boolean; error?: string }>;
  clearCart: () => Promise<{ success: boolean; error?: string }>;
  mergeCart: () => Promise<{ success: boolean; error?: string }>;
  refreshCart: () => Promise<void>;
  formatPrice: (cents: number) => string;
}

const CartContext = createContext<CartContextValue>({
  cart: null,
  loading: true,
  adding: false,
  slug: '',
  addToCart: async () => ({ success: false }),
  updateQuantity: async () => ({ success: false }),
  removeItem: async () => ({ success: false }),
  clearCart: async () => ({ success: false }),
  mergeCart: async () => ({ success: false }),
  refreshCart: async () => {},
  formatPrice: () => '',
});

// ============================================================================
// PROVIDER
// ============================================================================

interface CartProviderProps {
  slug: string;
  children: React.ReactNode;
  currency?: string;
  locale?: string;
}

export function CartProvider({ 
  slug, 
  children,
  currency = 'EUR',
  locale = 'de-DE',
}: CartProviderProps) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const baseUrl = `/api/runtime/workspaces/${slug}/cart`;

  const formatPrice = useCallback((cents: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(cents / 100);
  }, [locale, currency]);

  const refreshCart = useCallback(async () => {
    try {
      const res = await fetch(baseUrl, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setCart(data.cart);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = useCallback(
    async (productId: string, quantity = 1, variantId?: string) => {
      setAdding(true);
      try {
        const res = await fetch(baseUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, quantity, variantId }),
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok) {
          setCart(data.cart);
          return { success: true };
        }
        return { success: false, error: data.error };
      } catch (error) {
        console.error('Error adding to cart:', error);
        return { success: false, error: 'Fehler beim Hinzufügen zum Warenkorb.' };
      } finally {
        setAdding(false);
      }
    },
    [baseUrl]
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number, variantId?: string) => {
      try {
        const res = await fetch(baseUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, quantity, variantId }),
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok) {
          setCart(data.cart);
          return { success: true };
        }
        return { success: false, error: data.error };
      } catch (error) {
        console.error('Error updating cart:', error);
        return { success: false, error: 'Fehler beim Aktualisieren des Warenkorbs.' };
      }
    },
    [baseUrl]
  );

  const removeItem = useCallback(
    async (productId: string, variantId?: string) => {
      return updateQuantity(productId, 0, variantId);
    },
    [updateQuantity]
  );

  const clearCart = useCallback(async () => {
    try {
      const res = await fetch(baseUrl, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        setCart(data.cart);
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (error) {
      console.error('Error clearing cart:', error);
      return { success: false, error: 'Fehler beim Leeren des Warenkorbs.' };
    }
  }, [baseUrl]);

  const mergeCart = useCallback(async () => {
    try {
      const res = await fetch(`${baseUrl}/merge`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        if (data.cart) {
          setCart(data.cart);
        }
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (error) {
      console.error('Error merging cart:', error);
      return { success: false, error: 'Fehler beim Zusammenführen der Warenkörbe.' };
    }
  }, [baseUrl]);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      loading,
      adding,
      slug,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      mergeCart,
      refreshCart,
      formatPrice,
    }),
    [cart, loading, adding, slug, addToCart, updateQuantity, removeItem, clearCart, mergeCart, refreshCart, formatPrice]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ============================================================================
// HOOK
// ============================================================================

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// ============================================================================
// COMPONENTS
// ============================================================================

interface AddToCartButtonProps {
  productId: string;
  variantId?: string;
  quantity?: number;
  text?: string;
  loadingText?: string;
  successText?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function AddToCartButton({
  productId,
  variantId,
  quantity = 1,
  text = 'In den Warenkorb',
  loadingText = 'Wird hinzugefügt...',
  successText = 'Hinzugefügt!',
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className = '',
  onSuccess,
  onError,
}: AddToCartButtonProps) {
  const { addToCart, adding } = useCart();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleClick = async () => {
    const result = await addToCart(productId, quantity, variantId);
    if (result.success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      onSuccess?.();
    } else {
      onError?.(result.error || 'Fehler');
    }
  };

  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4',
    lg: 'h-12 px-6 text-lg',
  };

  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input bg-background hover:bg-accent',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
  };

  return (
    <button
      onClick={handleClick}
      disabled={adding || showSuccess}
      className={`inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors disabled:opacity-50 ${sizeClasses[size]} ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {showSuccess ? (
        <>
          <Check className="h-4 w-4" />
          {successText}
        </>
      ) : adding ? (
        <>
          <Loader className="h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4" />
          {text}
        </>
      )}
    </button>
  );
}

// Simple loader icon
function Loader({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

function Check({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ShoppingCart({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

// Cart badge for header
interface CartBadgeProps {
  showZero?: boolean;
  className?: string;
}

export function CartBadge({ showZero = false, className = '' }: CartBadgeProps) {
  const { cart, loading } = useCart();
  const count = cart?.itemCount || 0;

  if (loading || (!showZero && count === 0)) {
    return null;
  }

  return (
    <span className={`inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium min-w-[1.25rem] h-5 px-1.5 ${className}`}>
      {count > 99 ? '99+' : count}
    </span>
  );
}

// Mini cart for header
interface MiniCartProps {
  className?: string;
}

export function MiniCart({ className = '' }: MiniCartProps) {
  const { cart, loading, formatPrice, removeItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  if (loading) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-accent rounded-md"
      >
        <ShoppingCart className="h-5 w-5" />
        <CartBadge className="absolute -top-1 -right-1" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-80 bg-background border rounded-lg shadow-lg z-50 p-4">
            <h3 className="font-semibold mb-4">Warenkorb</h3>
            
            {!cart || cart.items.length === 0 ? (
              <p className="text-muted-foreground text-sm">Dein Warenkorb ist leer.</p>
            ) : (
              <>
                <div className="space-y-3 max-h-64 overflow-auto">
                  {cart.items.map((item, index) => (
                    <div key={`${item.productId}-${item.variantId || index}`} className="flex gap-3">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="h-12 w-12 object-cover rounded" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        {item.variantName && (
                          <p className="text-xs text-muted-foreground">{item.variantName}</p>
                        )}
                        <p className="text-sm">
                          {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId, item.variantId || undefined)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border-t mt-4 pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Zwischensumme</span>
                    <span>{formatPrice(cart.subtotal)}</span>
                  </div>
                  <a
                    href="/checkout"
                    className="block w-full mt-4 bg-primary text-primary-foreground text-center py-2 rounded-md font-medium hover:bg-primary/90"
                  >
                    Zur Kasse
                  </a>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
