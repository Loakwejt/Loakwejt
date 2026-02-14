'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import {
  Button,
  Card,
  CardContent,
  Badge,
  Input,
  Label,
  Checkbox,
  cn,
} from '@builderly/ui';
import {
  Plus,
  Search,
  Package,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  X,
  ChevronDown,
  ChevronUp,
  Box,
  DollarSign,
  Layers,
  Building2,
  Tag,
  ImagePlus,
  Upload,
  GripVertical,
  Loader2,
  Ruler,
} from 'lucide-react';

/* ── Currency Input ─────────────────────────────────────── */
function CurrencyInput({
  name,
  required,
  defaultValue,
  placeholder,
}: {
  name: string;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
}) {
  const [value, setValue] = useState(defaultValue || '');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(defaultValue || '');
    setError('');
  }, [defaultValue]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;
    raw = raw.replace(',', '.');
    const parts = raw.split('.');
    if (parts.length > 2) {
      raw = parts[0] + '.' + parts.slice(1).join('');
    }
    if (parts.length === 2 && (parts[1] ?? '').length > 2) {
      raw = (parts[0] ?? '') + '.' + (parts[1] ?? '').slice(0, 2);
    }
    raw = raw.replace(/[^\d.]/g, '');
    setValue(raw);
    setError('');
  }, []);

  const handleBlur = useCallback(() => {
    if (!value) {
      setError('');
      return;
    }
    const num = parseFloat(value);
    if (isNaN(num) || num < 0) {
      setError('Ungültiger Betrag');
      return;
    }
    setValue(num.toFixed(2));
    setError('');
  }, [value]);

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          name={name}
          type="text"
          inputMode="decimal"
          required={required}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={cn(
            'flex h-10 w-full rounded-lg border bg-background/50 px-3 py-2 text-sm transition-all',
            'placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
            'disabled:cursor-not-allowed disabled:opacity-50 pr-8 font-mono',
            error ? 'border-red-500 focus:ring-red-500/20' : 'border-input'
          )}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">€</span>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

/* ── Form Section Component ─────────────────────────────── */
function FormSection({ 
  icon: Icon, 
  title, 
  children, 
  defaultOpen = true 
}: { 
  icon: React.ElementType;
  title: string; 
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border border-border/50 rounded-xl overflow-hidden bg-card/30">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <span className="font-medium">{title}</span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {isOpen && (
        <div className="p-4 pt-0 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}

/* ── Form Field Component ───────────────────────────────── */
function FormField({ label, children, span = 1 }: { label: string; children: React.ReactNode; span?: 1 | 2 }) {
  return (
    <div className={span === 2 ? 'col-span-2' : ''}>
      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">{label}</Label>
      {children}
    </div>
  );
}

interface ProductSpecification {
  label: string;
  value: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  sku?: string;
  barcode?: string;
  inventory: number;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  vendor?: string;
  manufacturer?: string;
  manufacturerSku?: string;
  manufacturerUrl?: string;
  specifications?: ProductSpecification[];
  images: string[];
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
}

export default function WorkspaceProductsPage() {
  const params = useParams<{ workspaceId: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const baseUrl = `/api/workspaces/${params.workspaceId}/products`;

  async function loadProducts() {
    if (!baseUrl) return;
    setLoading(true);
    try {
      const qs = new URLSearchParams({ page: String(page), limit: '20', search });
      const res = await fetch(`${baseUrl}?${qs}`);
      if (!res.ok) {
        console.error('Products API error:', res.status, res.statusText);
        return;
      }
      const text = await res.text();
      if (!text) return;
      const data = JSON.parse(text);
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, [page, search]);

  async function handleDelete(id: string) {
    if (!baseUrl || !confirm('Produkt wirklich löschen?')) return;
    await fetch(`${baseUrl}/${id}`, { method: 'DELETE' });
    loadProducts();
  }

  async function handleToggleActive(product: Product) {
    if (!baseUrl) return;
    await fetch(`${baseUrl}/${product.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !product.isActive }),
    });
    loadProducts();
  }

  // Reset images when opening/closing form
  useEffect(() => {
    if (showForm && editProduct) {
      setProductImages(editProduct.images || []);
    } else if (showForm) {
      setProductImages([]);
    }
  }, [showForm, editProduct]);

  // Generate folder name for product images
  function getProductFolder(productName: string, productId?: string): string {
    const slug = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return productId ? `products/${slug}-${productId.slice(-8)}` : `products/${slug}-new`;
  }

  // Auto-scale image to max dimensions while maintaining aspect ratio
  async function resizeImage(file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.85): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        let { width, height } = img;

        // Calculate new dimensions maintaining aspect ratio
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;

        // Draw with high-quality scaling
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
        }

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(resizedFile);
            } else {
              reject(new Error('Failed to resize image'));
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  // Upload images for the product
  async function handleImageUpload(files: FileList) {
    if (!params.workspaceId) return;
    
    setUploadingImages(true);
    const newImages: string[] = [];
    const productName = (document.querySelector('input[name="name"]') as HTMLInputElement)?.value || 'product';
    const folder = getProductFolder(productName, editProduct?.id);

    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) {
          alert(`${file.name} ist kein Bild`);
          continue;
        }

        // Auto-scale image to max 1200x1200 for optimal product display
        let processedFile = file;
        try {
          processedFile = await resizeImage(file, 1200, 1200, 0.85);
        } catch (resizeError) {
          console.warn('Image resize failed, using original:', resizeError);
        }

        const formData = new FormData();
        formData.append('file', processedFile);
        formData.append('folder', folder);

        const response = await fetch(`/api/workspaces/${params.workspaceId}/assets/upload`, {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          if (data.url) {
            newImages.push(data.url);
          }
        } else {
          const error = await response.json();
          alert(`Fehler beim Hochladen von ${file.name}: ${error.error}`);
        }
      }

      setProductImages(prev => [...prev, ...newImages]);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Fehler beim Hochladen der Bilder');
    } finally {
      setUploadingImages(false);
    }
  }

  // Remove image from list
  function removeImage(index: number) {
    setProductImages(prev => prev.filter((_, i) => i !== index));
  }

  // Move image up/down
  function moveImage(index: number, direction: 'up' | 'down') {
    setProductImages(prev => {
      const newImages = [...prev];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= newImages.length) return prev;
      const temp = newImages[index]!;
      newImages[index] = newImages[newIndex]!;
      newImages[newIndex] = temp;
      return newImages;
    });
  }

  async function handleSaveProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!baseUrl) return;
    const form = new FormData(e.currentTarget);
    
    const compareAtPriceValue = form.get('compareAtPrice') as string;
    const weightValue = form.get('weight') as string;
    const lengthValue = form.get('length') as string;
    const widthValue = form.get('width') as string;
    const heightValue = form.get('height') as string;
    const tagsValue = form.get('tags') as string;
    const specificationsValue = form.get('specifications') as string;
    
    // Parse specifications from "Label: Value" format
    const specifications: ProductSpecification[] = specificationsValue
      ? specificationsValue.split('\n').map(line => {
          const [label, ...rest] = line.split(':');
          return { label: label?.trim() || '', value: rest.join(':').trim() };
        }).filter(s => s.label && s.value)
      : [];
    
    const body = {
      name: form.get('name') as string,
      slug: form.get('slug') as string,
      shortDescription: form.get('shortDescription') as string || undefined,
      description: form.get('description') as string,
      price: Math.round(parseFloat(form.get('price') as string) * 100),
      compareAtPrice: compareAtPriceValue ? Math.round(parseFloat(compareAtPriceValue) * 100) : undefined,
      currency: 'EUR',
      sku: form.get('sku') as string || undefined,
      barcode: form.get('barcode') as string || undefined,
      inventory: parseInt(form.get('inventory') as string) || 0,
      weight: weightValue ? parseFloat(weightValue) : undefined,
      length: lengthValue ? parseFloat(lengthValue) : undefined,
      width: widthValue ? parseFloat(widthValue) : undefined,
      height: heightValue ? parseFloat(heightValue) : undefined,
      vendor: form.get('vendor') as string || undefined,
      manufacturer: form.get('manufacturer') as string || undefined,
      manufacturerSku: form.get('manufacturerSku') as string || undefined,
      manufacturerUrl: form.get('manufacturerUrl') as string || undefined,
      specifications: specifications.length > 0 ? specifications : undefined,
      tags: tagsValue ? tagsValue.split(',').map(t => t.trim()).filter(t => t) : [],
      images: productImages,
      isActive: true,
      isFeatured: form.get('isFeatured') === 'on',
    };

    if (editProduct) {
      await fetch(`${baseUrl}/${editProduct.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } else {
      await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    }

    setShowForm(false);
    setEditProduct(null);
    loadProducts();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Produkte</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {total} Produkt{total !== 1 ? 'e' : ''} in deinem Katalog
              </p>
            </div>
            <Button 
              onClick={() => { setEditProduct(null); setShowForm(true); }}
              className="gap-2 shadow-lg shadow-primary/20"
            >
              <Plus className="w-4 h-4" /> Neues Produkt
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative mt-6 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Nach Namen, SKU oder Beschreibung suchen..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-10 bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-primary/20"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Product Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 pb-10 overflow-y-auto">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setShowForm(false); setEditProduct(null); }} />
            <div className="relative bg-background rounded-2xl shadow-2xl w-full max-w-2xl mx-4 border">
              {/* Form Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h2 className="text-xl font-semibold">{editProduct ? 'Produkt bearbeiten' : 'Neues Produkt erstellen'}</h2>
                  <p className="text-sm text-muted-foreground mt-1">Fülle die Produktdetails aus</p>
                </div>
                <button 
                  onClick={() => { setShowForm(false); setEditProduct(null); }}
                  className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Basic Info */}
                <FormSection icon={Box} title="Grundinformationen">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Produktname">
                      <Input name="name" required defaultValue={editProduct?.name || ''} placeholder="z.B. Premium Sneaker" className="bg-background/50" />
                    </FormField>
                    <FormField label="URL-Slug">
                      <Input name="slug" required defaultValue={editProduct?.slug || ''} placeholder="z.B. premium-sneaker" className="bg-background/50 font-mono text-sm" />
                    </FormField>
                    <FormField label="Kurzbeschreibung" span={2}>
                      <Input name="shortDescription" maxLength={500} defaultValue={editProduct?.shortDescription || ''} placeholder="Kurze Beschreibung für Übersichten (max. 500 Zeichen)" className="bg-background/50" />
                    </FormField>
                    <FormField label="Ausführliche Beschreibung" span={2}>
                      <textarea
                        name="description"
                        defaultValue={editProduct?.description || ''}
                        rows={4}
                        placeholder="Detaillierte Produktbeschreibung..."
                        className="flex w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-sm transition-all placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                      />
                    </FormField>
                  </div>
                </FormSection>

                {/* Images */}
                <FormSection icon={ImagePlus} title="Produktbilder">
                  <div className="space-y-4">
                    {/* Image Grid */}
                    {productImages.length > 0 && (
                      <div className="grid grid-cols-4 gap-3">
                        {productImages.map((url, index) => (
                          <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border bg-muted">
                            <img src={url} alt={`Produkt ${index + 1}`} className="w-full h-full object-cover" />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                              {index > 0 && (
                                <button
                                  type="button"
                                  onClick={() => moveImage(index, 'up')}
                                  className="w-7 h-7 rounded bg-white/20 hover:bg-white/40 flex items-center justify-center text-white"
                                  title="Nach vorne"
                                >
                                  <ChevronUp className="w-4 h-4" />
                                </button>
                              )}
                              {index < productImages.length - 1 && (
                                <button
                                  type="button"
                                  onClick={() => moveImage(index, 'down')}
                                  className="w-7 h-7 rounded bg-white/20 hover:bg-white/40 flex items-center justify-center text-white"
                                  title="Nach hinten"
                                >
                                  <ChevronDown className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="w-7 h-7 rounded bg-red-500/80 hover:bg-red-500 flex items-center justify-center text-white"
                                title="Entfernen"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            {/* Badge for first image */}
                            {index === 0 && (
                              <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded font-medium">
                                Hauptbild
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upload Button */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImages}
                      className={cn(
                        "w-full border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-2 transition-colors",
                        uploadingImages 
                          ? "border-primary/50 bg-primary/5" 
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      )}
                    >
                      {uploadingImages ? (
                        <>
                          <Loader2 className="w-8 h-8 text-primary animate-spin" />
                          <span className="text-sm text-muted-foreground">Bilder werden hochgeladen...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Klicken zum Hochladen</span>
                          <span className="text-xs text-muted-foreground/60">PNG, JPG, WEBP bis 10MB</span>
                        </>
                      )}
                    </button>

                    {productImages.length > 0 && (
                      <p className="text-xs text-muted-foreground text-center">
                        Das erste Bild wird als Hauptbild verwendet. Ziehe Bilder zum Sortieren.
                      </p>
                    )}
                  </div>
                </FormSection>

                {/* Pricing */}
                <FormSection icon={DollarSign} title="Preisgestaltung">
                  <div className="grid grid-cols-3 gap-4">
                    <FormField label="Verkaufspreis">
                      <CurrencyInput name="price" required defaultValue={editProduct ? (editProduct.price / 100).toFixed(2) : ''} placeholder="0.00" />
                    </FormField>
                    <FormField label="UVP / Streichpreis">
                      <CurrencyInput name="compareAtPrice" defaultValue={editProduct?.compareAtPrice ? (editProduct.compareAtPrice / 100).toFixed(2) : ''} placeholder="0.00" />
                    </FormField>
                    <FormField label="Lagerbestand">
                      <Input name="inventory" type="number" defaultValue={editProduct?.inventory || 0} className="bg-background/50" />
                    </FormField>
                  </div>
                </FormSection>

                {/* Organization */}
                <FormSection icon={Layers} title="Organisation" defaultOpen={false}>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Artikelnummer (SKU)">
                      <Input name="sku" defaultValue={editProduct?.sku || ''} placeholder="z.B. SNK-001-BLK" className="bg-background/50 font-mono" />
                    </FormField>
                    <FormField label="Barcode (EAN/GTIN)">
                      <Input name="barcode" defaultValue={editProduct?.barcode || ''} placeholder="z.B. 4006381333931" className="bg-background/50 font-mono" />
                    </FormField>
                    <FormField label="Tags" span={2}>
                      <Input name="tags" defaultValue={editProduct?.tags?.join(', ') || ''} placeholder="Sale, Neu, Bestseller (kommagetrennt)" className="bg-background/50" />
                    </FormField>
                    <div className="col-span-2 flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                      <Checkbox id="isFeatured" name="isFeatured" defaultChecked={editProduct?.isFeatured || false} />
                      <div>
                        <Label htmlFor="isFeatured" className="cursor-pointer font-medium">Featured-Produkt</Label>
                        <p className="text-xs text-muted-foreground">Wird auf der Startseite hervorgehoben</p>
                      </div>
                    </div>
                  </div>
                </FormSection>

                {/* Shipping & Dimensions */}
                <FormSection icon={Ruler} title="Versand & Abmessungen" defaultOpen={false}>
                  <div className="grid grid-cols-4 gap-4">
                    <FormField label="Gewicht (g)">
                      <Input name="weight" type="number" step="0.01" defaultValue={editProduct?.weight || ''} placeholder="500" className="bg-background/50" />
                    </FormField>
                    <FormField label="Länge (cm)">
                      <Input name="length" type="number" step="0.1" defaultValue={editProduct?.length || ''} placeholder="30" className="bg-background/50" />
                    </FormField>
                    <FormField label="Breite (cm)">
                      <Input name="width" type="number" step="0.1" defaultValue={editProduct?.width || ''} placeholder="20" className="bg-background/50" />
                    </FormField>
                    <FormField label="Höhe (cm)">
                      <Input name="height" type="number" step="0.1" defaultValue={editProduct?.height || ''} placeholder="12" className="bg-background/50" />
                    </FormField>
                  </div>
                </FormSection>

                {/* Manufacturer */}
                <FormSection icon={Building2} title="Hersteller" defaultOpen={false}>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Marke / Vendor">
                      <Input name="vendor" defaultValue={editProduct?.vendor || ''} placeholder="z.B. Nike" className="bg-background/50" />
                    </FormField>
                    <FormField label="Hersteller">
                      <Input name="manufacturer" defaultValue={editProduct?.manufacturer || ''} placeholder="z.B. Nike Inc." className="bg-background/50" />
                    </FormField>
                    <FormField label="Hersteller-SKU">
                      <Input name="manufacturerSku" defaultValue={editProduct?.manufacturerSku || ''} placeholder="Hersteller-Artikelnummer" className="bg-background/50 font-mono" />
                    </FormField>
                    <FormField label="Hersteller-Website">
                      <Input name="manufacturerUrl" type="url" defaultValue={editProduct?.manufacturerUrl || ''} placeholder="https://nike.com" className="bg-background/50" />
                    </FormField>
                  </div>
                </FormSection>

                {/* Specifications */}
                <FormSection icon={Tag} title="Spezifikationen" defaultOpen={false}>
                  <FormField label="Technische Daten" span={2}>
                    <textarea
                      name="specifications"
                      defaultValue={editProduct?.specifications?.map(s => `${s.label}: ${s.value}`).join('\n') || ''}
                      rows={5}
                      placeholder="Material: Leder&#10;Sohle: Gummi&#10;Verschluss: Schnürung&#10;Herkunft: Italien"
                      className="flex w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-sm font-mono transition-all placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                    />
                    <p className="text-xs text-muted-foreground mt-2">Pro Zeile: Label: Wert</p>
                  </FormField>
                </FormSection>
              </form>

              {/* Form Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t bg-muted/30">
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditProduct(null); }}>
                  Abbrechen
                </Button>
                <Button type="submit" form="product-form" onClick={(e) => {
                  const form = document.querySelector('form');
                  if (form) form.requestSubmit();
                }} className="shadow-lg shadow-primary/20">
                  {editProduct ? 'Änderungen speichern' : 'Produkt erstellen'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Product Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-pulse text-muted-foreground">Laden...</div>
          </div>
        ) : products.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Keine Produkte vorhanden</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                Erstelle dein erstes Produkt, um deinen Online-Shop zu starten.
              </p>
              <Button onClick={() => setShowForm(true)} className="gap-2">
                <Plus className="w-4 h-4" /> Erstes Produkt erstellen
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <Card key={p.id} className={cn(
                "group relative overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20",
                !p.isActive && "opacity-60"
              )}>
                {/* Product Image */}
                <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-12 h-12 text-muted-foreground/30" />
                    </div>
                  )}
                  
                  {/* Status Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {p.isFeatured && (
                      <Badge className="bg-amber-500/90 text-white border-0">Featured</Badge>
                    )}
                    {!p.isActive && (
                      <Badge variant="secondary">Inaktiv</Badge>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleToggleActive(p)}
                      className="w-8 h-8 rounded-lg bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors shadow-sm"
                      title={p.isActive ? 'Deaktivieren' : 'Aktivieren'}
                    >
                      {p.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => { setEditProduct(p); setShowForm(true); }}
                      className="w-8 h-8 rounded-lg bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors shadow-sm"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="w-8 h-8 rounded-lg bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold truncate">{p.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{p.sku || p.slug}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-lg">{(p.price / 100).toFixed(2).replace('.', ',')} €</div>
                      {p.compareAtPrice && (
                        <div className="text-xs text-muted-foreground line-through">
                          {(p.compareAtPrice / 100).toFixed(2).replace('.', ',')} €
                        </div>
                      )}
                    </div>
                  </div>

                  {p.shortDescription && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{p.shortDescription}</p>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      <span>{p.inventory} auf Lager</span>
                    </div>
                    {(p.manufacturer || p.vendor) && (
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" />
                        <span className="truncate">{p.manufacturer || p.vendor}</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {p.tags && p.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {p.tags.slice(0, 3).map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs font-normal">{tag}</Badge>
                      ))}
                      {p.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs font-normal">+{p.tags.length - 3}</Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {total > 20 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
              Zurück
            </Button>
            <span className="text-sm text-muted-foreground px-4">
              Seite {page} von {Math.ceil(total / 20)}
            </span>
            <Button variant="outline" size="sm" disabled={page >= Math.ceil(total / 20)} onClick={() => setPage(p => p + 1)}>
              Weiter
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
