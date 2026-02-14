import { useState, useEffect, useCallback } from 'react';
import { useEditorStore } from '../store/editor-store';

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface WorkspaceProduct {
  id: string;
  workspaceId: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  price: number; // in cents
  compareAtPrice: number | null;
  currency: string;
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
  sku: string | null;
  inventory: number;
  categoryId: string | null;
  tags: string[];
  // Dimensions
  weight: number | null; // grams
  length: number | null; // cm
  width: number | null; // cm
  height: number | null; // cm
  // Manufacturer
  manufacturer: string | null;
  manufacturerSku: string | null;
  manufacturerUrl: string | null;
  specifications: ProductSpecification[] | null;
  vendor: string | null;
}

interface UseWorkspaceProductsReturn {
  products: WorkspaceProduct[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const cache = new Map<string, { data: WorkspaceProduct[]; ts: number }>();
const CACHE_TTL = 30_000; // 30s

export function useWorkspaceProducts(): UseWorkspaceProductsReturn {
  const workspaceId = useEditorStore((s) => s.workspaceId);
  const [products, setProducts] = useState<WorkspaceProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    if (!workspaceId) return;

    // Check cache
    const cached = cache.get(workspaceId);
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      setProducts(cached.data);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(
        `${apiUrl}/api/workspaces/${workspaceId}/products?limit=50&status=active`,
        { credentials: 'include' }
      );

      if (res.status === 401) {
        setError('Nicht angemeldet');
        return;
      }
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      const items: WorkspaceProduct[] = (data.products || []).map((p: Record<string, unknown>) => ({
        id: p.id,
        workspaceId: p.workspaceId,
        name: p.name,
        slug: p.slug,
        shortDescription: p.shortDescription ?? null,
        description: p.description ?? null,
        price: p.price as number,
        compareAtPrice: p.compareAtPrice ?? null,
        currency: (p.currency as string) || 'EUR',
        images: Array.isArray(p.images) ? p.images : [],
        isActive: p.isActive ?? true,
        isFeatured: p.isFeatured ?? false,
        sku: p.sku ?? null,
        inventory: (p.inventory as number) || 0,
        categoryId: p.categoryId ?? null,
        tags: Array.isArray(p.tags) ? p.tags : [],
        // Dimensions
        weight: p.weight ?? null,
        length: p.length ?? null,
        width: p.width ?? null,
        height: p.height ?? null,
        // Manufacturer
        manufacturer: p.manufacturer ?? null,
        manufacturerSku: p.manufacturerSku ?? null,
        manufacturerUrl: p.manufacturerUrl ?? null,
        specifications: Array.isArray(p.specifications) ? p.specifications : null,
        vendor: p.vendor ?? null,
      }));

      cache.set(workspaceId, { data: items, ts: Date.now() });
      setProducts(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden');
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  const refetch = useCallback(() => {
    if (workspaceId) cache.delete(workspaceId);
    fetchProducts();
  }, [workspaceId, fetchProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch };
}

/**
 * Format cents to display price (e.g. 4999 → "49,99 €")
 */
export function formatProductPrice(cents: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(cents / 100);
}
