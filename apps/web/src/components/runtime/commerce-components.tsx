'use client';

import { useState, useEffect } from 'react';
import { Heart, Search, X, Star, ShoppingCart, Check, MapPin, CreditCard } from 'lucide-react';
import { Button, Input, Card, Badge, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Checkbox } from '@builderly/ui';

// ============================================================================
// WISHLIST COMPONENTS
// ============================================================================

interface WishlistButtonProps {
  productId?: string;
  variant?: 'icon' | 'button' | 'text';
  size?: 'sm' | 'md' | 'lg';
  addText?: string;
  removeText?: string;
  showCount?: boolean;
  className?: string;
}

export function WishlistButton({
  productId,
  variant = 'icon',
  size = 'md',
  addText = 'Zur Wunschliste',
  removeText = 'Von Wunschliste entfernen',
  className = '',
}: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check localStorage for wishlist
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setIsInWishlist(wishlist.includes(productId));
  }, [productId]);

  const toggleWishlist = async () => {
    setIsLoading(true);
    try {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      let newWishlist: string[];
      
      if (isInWishlist) {
        newWishlist = wishlist.filter((id: string) => id !== productId);
      } else {
        newWishlist = [...wishlist, productId];
      }
      
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      setIsInWishlist(!isInWishlist);
      
      // TODO: Sync with backend if user is logged in
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={toggleWishlist}
        disabled={isLoading}
        className={`${sizeClasses[size]} flex items-center justify-center rounded-full border transition-colors ${
          isInWishlist 
            ? 'bg-red-50 border-red-200 text-red-500' 
            : 'bg-white border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200'
        } ${className}`}
        title={isInWishlist ? removeText : addText}
      >
        <Heart className={`${size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'} ${isInWishlist ? 'fill-current' : ''}`} />
      </button>
    );
  }

  if (variant === 'button') {
    return (
      <Button
        variant={isInWishlist ? 'default' : 'outline'}
        onClick={toggleWishlist}
        disabled={isLoading}
        className={className}
      >
        <Heart className={`mr-2 h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
        {isInWishlist ? removeText : addText}
      </Button>
    );
  }

  return (
    <button
      onClick={toggleWishlist}
      disabled={isLoading}
      className={`text-sm underline hover:no-underline ${isInWishlist ? 'text-red-500' : 'text-gray-500'} ${className}`}
    >
      {isInWishlist ? removeText : addText}
    </button>
  );
}

interface WishlistDisplayProps {
  layout?: 'grid' | 'list';
  columns?: number;
  showRemoveButton?: boolean;
  showAddToCart?: boolean;
  emptyText?: string;
  className?: string;
}

export function WishlistDisplay({
  layout = 'grid',
  columns = 4,
  showRemoveButton = true,
  showAddToCart = true,
  emptyText = 'Deine Wunschliste ist leer',
  className = '',
}: WishlistDisplayProps) {
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlistItems(wishlist);
  }, []);

  if (wishlistItems.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <Heart className="mx-auto h-12 w-12 text-gray-300 mb-4" />
        <p className="text-gray-500">{emptyText}</p>
      </div>
    );
  }

  return (
    <div 
      className={`${layout === 'grid' ? `grid gap-4` : 'flex flex-col gap-4'} ${className}`}
      style={layout === 'grid' ? { gridTemplateColumns: `repeat(${columns}, 1fr)` } : undefined}
    >
      {wishlistItems.map((productId) => (
        <Card key={productId} className="p-4">
          <p className="text-sm text-gray-500">Produkt: {productId}</p>
          <div className="flex gap-2 mt-4">
            {showAddToCart && (
              <Button size="sm" className="flex-1">
                <ShoppingCart className="mr-2 h-4 w-4" />
                In den Warenkorb
              </Button>
            )}
            {showRemoveButton && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {
                  const newWishlist = wishlistItems.filter(id => id !== productId);
                  localStorage.setItem('wishlist', JSON.stringify(newWishlist));
                  setWishlistItems(newWishlist);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}

// ============================================================================
// PRODUCT REVIEWS
// ============================================================================

interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  authorName: string;
  createdAt: string;
  helpful: number;
  verified: boolean;
}

interface ProductReviewsProps {
  productId?: string;
  showSummary?: boolean;
  showWriteReview?: boolean;
  showAvatar?: boolean;
  sortBy?: 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful';
  limit?: number;
  emptyText?: string;
  writeReviewText?: string;
  className?: string;
}

export function ProductReviews({
  productId,
  showSummary = true,
  showWriteReview = true,
  sortBy = 'newest',
  limit = 10,
  emptyText = 'Noch keine Bewertungen vorhanden',
  writeReviewText = 'Bewertung schreiben',
  className = '',
}: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // TODO: Fetch reviews from API
    setLoading(false);
  }, [productId, sortBy, limit]);

  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length 
    : 0;

  if (loading) {
    return <div className="animate-pulse h-40 bg-gray-100 rounded-lg" />;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Summary */}
      {showSummary && (
        <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
            <div className="flex gap-0.5 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`h-4 w-4 ${star <= averageRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <div className="text-sm text-gray-500 mt-1">{reviews.length} Bewertungen</div>
          </div>
          {showWriteReview && (
            <Button onClick={() => setShowForm(true)}>
              {writeReviewText}
            </Button>
          )}
        </div>
      )}

      {/* Review Form */}
      {showForm && (
        <ReviewForm 
          productId={productId} 
          onClose={() => setShowForm(false)}
          onSubmit={(review) => {
            setReviews([review, ...reviews]);
            setShowForm(false);
          }}
        />
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Star className="mx-auto h-8 w-8 text-gray-300 mb-2" />
          <p>{emptyText}</p>
          {showWriteReview && !showForm && (
            <Button variant="outline" className="mt-4" onClick={() => setShowForm(true)}>
              {writeReviewText}
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`h-4 w-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                {review.verified && (
                  <Badge variant="secondary" className="text-xs">
                    <Check className="h-3 w-3 mr-1" />
                    Verifizierter Kauf
                  </Badge>
                )}
              </div>
              <h4 className="font-medium">{review.title}</h4>
              <p className="text-gray-600 text-sm mt-1">{review.content}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <span>{review.authorName}</span>
                <span>{new Date(review.createdAt).toLocaleDateString('de-DE')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface ReviewFormProps {
  productId?: string;
  onClose: () => void;
  onSubmit: (review: Review) => void;
  showRating?: boolean;
  showTitle?: boolean;
  showContent?: boolean;
  submitText?: string;
  titlePlaceholder?: string;
  contentPlaceholder?: string;
  successMessage?: string;
}

export function ReviewForm({
  productId,
  onClose,
  onSubmit,
  showRating = true,
  showTitle = true,
  showContent = true,
  submitText = 'Bewertung absenden',
  titlePlaceholder = 'Titel deiner Bewertung',
  contentPlaceholder = 'Teile deine Erfahrung mit diesem Produkt...',
  successMessage = 'Vielen Dank für deine Bewertung!',
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);
    try {
      // TODO: Submit to API
      const newReview: Review = {
        id: Date.now().toString(),
        rating,
        title,
        content,
        authorName: 'Kunde',
        createdAt: new Date().toISOString(),
        helpful: 0,
        verified: false,
      };
      
      onSubmit(newReview);
      setSuccess(true);
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="p-6 bg-green-50 rounded-lg text-center">
        <Check className="mx-auto h-12 w-12 text-green-500 mb-2" />
        <p className="text-green-700">{successMessage}</p>
        <Button variant="outline" className="mt-4" onClick={onClose}>
          Schließen
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Bewertung schreiben</h3>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>
      </div>

      {showRating && (
        <div>
          <Label>Bewertung *</Label>
          <div className="flex gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none"
              >
                <Star 
                  className={`h-8 w-8 transition-colors ${
                    star <= (hoverRating || rating) 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : 'text-gray-300'
                  }`} 
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {showTitle && (
        <div>
          <Label htmlFor="review-title">Titel</Label>
          <Input
            id="review-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={titlePlaceholder}
          />
        </div>
      )}

      {showContent && (
        <div>
          <Label htmlFor="review-content">Bewertung</Label>
          <textarea
            id="review-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={contentPlaceholder}
            rows={4}
            className="w-full border rounded-md p-2 text-sm"
          />
        </div>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting || rating === 0}>
          {isSubmitting ? 'Wird gesendet...' : submitText}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Abbrechen
        </Button>
      </div>
    </form>
  );
}

// ============================================================================
// CATEGORY FILTER
// ============================================================================

interface Category {
  id: string;
  name: string;
  slug: string;
  count?: number;
  icon?: string;
}

interface CategoryFilterProps {
  categories?: Category[];
  layout?: 'horizontal' | 'vertical' | 'dropdown';
  showCount?: boolean;
  showAllOption?: boolean;
  allText?: string;
  showIcons?: boolean;
  multiSelect?: boolean;
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  className?: string;
}

export function CategoryFilter({
  categories = [],
  layout = 'horizontal',
  showCount = true,
  showAllOption = true,
  allText = 'Alle Kategorien',
  showIcons = false,
  multiSelect = false,
  value,
  onChange,
  className = '',
}: CategoryFilterProps) {
  const [selected, setSelected] = useState<string[]>(
    Array.isArray(value) ? value : value ? [value] : []
  );

  const handleSelect = (categoryId: string) => {
    let newSelected: string[];
    
    if (categoryId === 'all') {
      newSelected = [];
    } else if (multiSelect) {
      newSelected = selected.includes(categoryId)
        ? selected.filter(id => id !== categoryId)
        : [...selected, categoryId];
    } else {
      newSelected = [categoryId];
    }
    
    setSelected(newSelected);
    onChange?.(multiSelect ? newSelected : newSelected[0] || '');
  };

  if (layout === 'dropdown') {
    return (
      <Select
        value={selected[0] || 'all'}
        onValueChange={handleSelect}
      >
        <SelectTrigger className={className}>
          <SelectValue placeholder={allText} />
        </SelectTrigger>
        <SelectContent>
          {showAllOption && (
            <SelectItem value="all">{allText}</SelectItem>
          )}
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.name} {showCount && cat.count !== undefined && `(${cat.count})`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  const isHorizontal = layout === 'horizontal';

  return (
    <div className={`flex ${isHorizontal ? 'flex-row flex-wrap gap-2' : 'flex-col gap-1'} ${className}`}>
      {showAllOption && (
        <button
          onClick={() => handleSelect('all')}
          className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
            selected.length === 0 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {allText}
        </button>
      )}
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleSelect(cat.id)}
          className={`px-3 py-1.5 rounded-full text-sm transition-colors flex items-center gap-1 ${
            selected.includes(cat.id)
              ? 'bg-primary text-primary-foreground'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {cat.name}
          {showCount && cat.count !== undefined && (
            <span className="opacity-60">({cat.count})</span>
          )}
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// PRODUCT VARIANT SELECTORS
// ============================================================================

interface VariantOption {
  value: string;
  label: string;
  inStock?: boolean;
  priceModifier?: number;
  hex?: string; // for color swatches
}

interface ProductVariantSelectorProps {
  options: VariantOption[];
  label?: string;
  layout?: 'buttons' | 'dropdown' | 'swatches';
  showLabel?: boolean;
  showStock?: boolean;
  showPrice?: boolean;
  outOfStockBehavior?: 'disable' | 'hide' | 'show';
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function ProductVariantSelector({
  options = [],
  label = 'Option',
  layout = 'buttons',
  showLabel = true,
  showStock = true,
  outOfStockBehavior = 'disable',
  value,
  onChange,
  className = '',
}: ProductVariantSelectorProps) {
  const [selected, setSelected] = useState(value || '');

  const handleSelect = (optionValue: string) => {
    setSelected(optionValue);
    onChange?.(optionValue);
  };

  const filteredOptions = outOfStockBehavior === 'hide'
    ? options.filter(opt => opt.inStock !== false)
    : options;

  if (layout === 'dropdown') {
    return (
      <div className={className}>
        {showLabel && <Label className="mb-1 block">{label}</Label>}
        <Select value={selected} onValueChange={handleSelect}>
          <SelectTrigger>
            <SelectValue placeholder={`${label} wählen`} />
          </SelectTrigger>
          <SelectContent>
            {filteredOptions.map((opt) => (
              <SelectItem 
                key={opt.value} 
                value={opt.value}
                disabled={outOfStockBehavior === 'disable' && opt.inStock === false}
              >
                {opt.label}
                {showStock && opt.inStock === false && ' (Ausverkauft)'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className={className}>
      {showLabel && <Label className="mb-2 block">{label}</Label>}
      <div className="flex flex-wrap gap-2">
        {filteredOptions.map((opt) => {
          const isDisabled = outOfStockBehavior === 'disable' && opt.inStock === false;
          const isSelected = selected === opt.value;

          return (
            <button
              key={opt.value}
              onClick={() => !isDisabled && handleSelect(opt.value)}
              disabled={isDisabled}
              className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                isSelected
                  ? 'border-primary bg-primary text-primary-foreground'
                  : isDisabled
                    ? 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed line-through'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-primary'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface ColorSwatchProps {
  colors: VariantOption[];
  size?: 'sm' | 'md' | 'lg';
  shape?: 'circle' | 'square' | 'rounded';
  showLabel?: boolean;
  showSelected?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function ColorSwatch({
  colors = [],
  size = 'md',
  shape = 'circle',
  showLabel = false,
  showSelected = true,
  value,
  onChange,
  className = '',
}: ColorSwatchProps) {
  const [selected, setSelected] = useState(value || '');

  const handleSelect = (colorValue: string) => {
    setSelected(colorValue);
    onChange?.(colorValue);
  };

  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  };

  const shapeClasses = {
    circle: 'rounded-full',
    square: 'rounded-none',
    rounded: 'rounded-md',
  };

  const selectedColor = colors.find(c => c.value === selected);

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color.value}
            onClick={() => handleSelect(color.value)}
            title={color.label}
            className={`${sizeClasses[size]} ${shapeClasses[shape]} border-2 transition-all ${
              selected === color.value
                ? 'border-primary ring-2 ring-primary ring-offset-2'
                : 'border-gray-300 hover:border-gray-400'
            } ${color.inStock === false ? 'opacity-40' : ''}`}
            style={{ backgroundColor: color.hex }}
          />
        ))}
      </div>
      {showLabel && showSelected && selectedColor && (
        <p className="mt-2 text-sm text-gray-600">{selectedColor.label}</p>
      )}
    </div>
  );
}

interface SizeSelectorProps {
  sizes: VariantOption[];
  layout?: 'buttons' | 'dropdown';
  showSizeGuide?: boolean;
  sizeGuideText?: string;
  sizeGuideUrl?: string;
  showStock?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function SizeSelector({
  sizes = [],
  layout = 'buttons',
  showSizeGuide = true,
  sizeGuideText = 'Größentabelle',
  sizeGuideUrl,
  showStock = true,
  value,
  onChange,
  className = '',
}: SizeSelectorProps) {
  const [selected, setSelected] = useState(value || '');

  const handleSelect = (sizeValue: string) => {
    setSelected(sizeValue);
    onChange?.(sizeValue);
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <Label>Größe</Label>
        {showSizeGuide && (
          <a 
            href={sizeGuideUrl || '#'} 
            className="text-sm text-primary hover:underline"
            onClick={(e) => !sizeGuideUrl && e.preventDefault()}
          >
            {sizeGuideText}
          </a>
        )}
      </div>
      
      {layout === 'dropdown' ? (
        <Select value={selected} onValueChange={handleSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Größe wählen" />
          </SelectTrigger>
          <SelectContent>
            {sizes.map((size) => (
              <SelectItem 
                key={size.value} 
                value={size.value}
                disabled={size.inStock === false}
              >
                {size.label}
                {showStock && size.inStock === false && ' (Ausverkauft)'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size.value}
              onClick={() => size.inStock !== false && handleSelect(size.value)}
              disabled={size.inStock === false}
              className={`min-w-[3rem] px-3 py-2 border rounded-md text-sm font-medium transition-colors ${
                selected === size.value
                  ? 'border-primary bg-primary text-primary-foreground'
                  : size.inStock === false
                    ? 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed line-through'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-primary'
              }`}
            >
              {size.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// STOCK INDICATOR
// ============================================================================

interface StockIndicatorProps {
  stock?: number;
  showExactCount?: boolean;
  lowStockThreshold?: number;
  inStockText?: string;
  lowStockText?: string;
  outOfStockText?: string;
  showIcon?: boolean;
  className?: string;
}

export function StockIndicator({
  stock = 0,
  showExactCount = false,
  lowStockThreshold = 5,
  inStockText = 'Auf Lager',
  lowStockText = 'Nur noch wenige verfügbar',
  outOfStockText = 'Ausverkauft',
  showIcon = true,
  className = '',
}: StockIndicatorProps) {
  let status: 'in-stock' | 'low-stock' | 'out-of-stock';
  let text: string;
  let colorClass: string;

  if (stock <= 0) {
    status = 'out-of-stock';
    text = outOfStockText;
    colorClass = 'text-red-600';
  } else if (stock <= lowStockThreshold) {
    status = 'low-stock';
    text = showExactCount ? `Nur noch ${stock} Stück` : lowStockText;
    colorClass = 'text-amber-600';
  } else {
    status = 'in-stock';
    text = showExactCount ? `${stock} Stück auf Lager` : inStockText;
    colorClass = 'text-green-600';
  }

  return (
    <div className={`flex items-center gap-1.5 text-sm ${colorClass} ${className}`}>
      {showIcon && (
        <span className={`h-2 w-2 rounded-full ${
          status === 'in-stock' ? 'bg-green-500' :
          status === 'low-stock' ? 'bg-amber-500' : 'bg-red-500'
        }`} />
      )}
      <span>{text}</span>
    </div>
  );
}

// ============================================================================
// CHECKOUT FORM
// ============================================================================

interface CheckoutFormProps {
  showBillingAddress?: boolean;
  showShippingAddress?: boolean;
  showPaymentMethods?: boolean;
  showOrderSummary?: boolean;
  showCouponField?: boolean;
  showTermsCheckbox?: boolean;
  submitText?: string;
  termsText?: string;
  termsLinkUrl?: string;
  guestCheckout?: boolean;
  onSubmit?: (data: Record<string, unknown>) => void;
  className?: string;
}

export function CheckoutForm({
  showBillingAddress = true,
  showShippingAddress = true,
  showPaymentMethods = true,
  showOrderSummary = true,
  showCouponField = true,
  showTermsCheckbox = true,
  submitText = 'Jetzt kaufen',
  termsText = 'Ich akzeptiere die AGB und Datenschutzbestimmungen',
  termsLinkUrl = '/terms',
  guestCheckout = true,
  onSubmit,
  className = '',
}: CheckoutFormProps) {
  const [sameAddress, setSameAddress] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted && showTermsCheckbox) {
      alert('Bitte akzeptiere die AGB');
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Process checkout
      onSubmit?.({});
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-8 ${className}`}>
      {/* Billing Address */}
      {showBillingAddress && (
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Rechnungsadresse
          </h2>
          <AddressForm type="billing" />
        </section>
      )}

      {/* Shipping Address */}
      {showShippingAddress && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Checkbox 
              id="same-address" 
              checked={sameAddress}
              onCheckedChange={(checked) => setSameAddress(checked as boolean)}
            />
            <Label htmlFor="same-address">Lieferadresse entspricht Rechnungsadresse</Label>
          </div>
          {!sameAddress && <AddressForm type="shipping" />}
        </section>
      )}

      {/* Payment Methods */}
      {showPaymentMethods && (
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Zahlungsmethode
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {['Kreditkarte', 'PayPal', 'Klarna'].map((method) => (
              <button
                key={method}
                type="button"
                className="p-4 border rounded-lg hover:border-primary text-center"
              >
                {method}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Coupon */}
      {showCouponField && (
        <section>
          <Label htmlFor="coupon">Gutscheincode</Label>
          <div className="flex gap-2 mt-1">
            <Input id="coupon" placeholder="Code eingeben" />
            <Button type="button" variant="outline">Einlösen</Button>
          </div>
        </section>
      )}

      {/* Terms */}
      {showTermsCheckbox && (
        <div className="flex items-start gap-2">
          <Checkbox 
            id="terms" 
            checked={termsAccepted}
            onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
          />
          <Label htmlFor="terms" className="text-sm leading-relaxed">
            {termsText}{' '}
            <a href={termsLinkUrl} className="text-primary hover:underline">
              Mehr erfahren
            </a>
          </Label>
        </div>
      )}

      {/* Submit */}
      <Button 
        type="submit" 
        size="lg" 
        className="w-full"
        disabled={isSubmitting || (showTermsCheckbox && !termsAccepted)}
      >
        {isSubmitting ? 'Wird verarbeitet...' : submitText}
      </Button>
    </form>
  );
}

interface AddressFormProps {
  type?: 'billing' | 'shipping';
  showCompanyField?: boolean;
  showPhoneField?: boolean;
  countries?: string[];
  defaultCountry?: string;
  className?: string;
}

export function AddressForm({
  type = 'billing',
  showCompanyField = false,
  showPhoneField = true,
  defaultCountry = 'DE',
  className = '',
}: AddressFormProps) {
  const prefix = type === 'billing' ? 'billing' : 'shipping';

  return (
    <div className={`grid grid-cols-2 gap-4 ${className}`}>
      <div>
        <Label htmlFor={`${prefix}-firstName`}>Vorname *</Label>
        <Input id={`${prefix}-firstName`} required />
      </div>
      <div>
        <Label htmlFor={`${prefix}-lastName`}>Nachname *</Label>
        <Input id={`${prefix}-lastName`} required />
      </div>
      {showCompanyField && (
        <div className="col-span-2">
          <Label htmlFor={`${prefix}-company`}>Firma</Label>
          <Input id={`${prefix}-company`} />
        </div>
      )}
      <div className="col-span-2">
        <Label htmlFor={`${prefix}-street`}>Straße und Hausnummer *</Label>
        <Input id={`${prefix}-street`} required />
      </div>
      <div className="col-span-2">
        <Label htmlFor={`${prefix}-address2`}>Adresszusatz</Label>
        <Input id={`${prefix}-address2`} placeholder="Apartment, Suite, etc." />
      </div>
      <div>
        <Label htmlFor={`${prefix}-zip`}>PLZ *</Label>
        <Input id={`${prefix}-zip`} required />
      </div>
      <div>
        <Label htmlFor={`${prefix}-city`}>Stadt *</Label>
        <Input id={`${prefix}-city`} required />
      </div>
      <div className="col-span-2">
        <Label htmlFor={`${prefix}-country`}>Land *</Label>
        <Select defaultValue={defaultCountry}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DE">Deutschland</SelectItem>
            <SelectItem value="AT">Österreich</SelectItem>
            <SelectItem value="CH">Schweiz</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {showPhoneField && (
        <div className="col-span-2">
          <Label htmlFor={`${prefix}-phone`}>Telefon</Label>
          <Input id={`${prefix}-phone`} type="tel" />
        </div>
      )}
    </div>
  );
}
