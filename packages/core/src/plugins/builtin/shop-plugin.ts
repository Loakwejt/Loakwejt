import { z } from 'zod';
import type { PluginDefinition } from '../plugin-registry';
import type { ComponentDefinition } from '../../registry/component-registry';
import type { CollectionDefinition } from '../../schemas/collection';
import type { ActionDefinition } from '../../schemas/actions';

// ============================================================================
// SHOP PLUGIN COMPONENTS
// ============================================================================

const ProductListComponent: ComponentDefinition = {
  type: 'ProductList',
  displayName: 'Product List',
  description: 'Display a list of products',
  icon: 'shopping-bag',
  category: 'commerce',
  canHaveChildren: true,
  defaultProps: {
    limit: 12,
    showPrice: true,
    columns: 4,
  },
  propsSchema: z.object({
    limit: z.number().min(1).max(50).default(12),
    showPrice: z.boolean().default(true),
    showAddToCart: z.boolean().default(true),
    columns: z.number().min(1).max(6).default(4),
    layout: z.enum(['grid', 'list']).default('grid'),
    category: z.string().optional(),
  }),
  dataBindings: [
    {
      name: 'products',
      description: 'Products from the shop',
      type: 'listRecords',
      collection: 'products',
    },
  ],
  tags: ['commerce', 'products', 'shop', 'store'],
};

const ProductCardComponent: ComponentDefinition = {
  type: 'ProductCard',
  displayName: 'Product Card',
  description: 'Display a single product card',
  icon: 'package',
  category: 'commerce',
  canHaveChildren: false,
  defaultProps: {
    showPrice: true,
    showAddToCart: true,
  },
  propsSchema: z.object({
    showPrice: z.boolean().default(true),
    showAddToCart: z.boolean().default(true),
    showDescription: z.boolean().default(false),
    imageAspect: z.enum(['square', '4:3', '16:9']).default('square'),
  }),
  dataBindings: [
    {
      name: 'product',
      description: 'Current product record',
      type: 'currentRecord',
    },
  ],
  tags: ['commerce', 'product', 'card'],
};

const ProductDetailComponent: ComponentDefinition = {
  type: 'ProductDetail',
  displayName: 'Product Detail',
  description: 'Full product detail view',
  icon: 'package',
  category: 'commerce',
  canHaveChildren: false,
  defaultProps: {},
  propsSchema: z.object({
    showGallery: z.boolean().default(true),
    showDescription: z.boolean().default(true),
    showSku: z.boolean().default(false),
    showInventory: z.boolean().default(false),
  }),
  dataBindings: [
    {
      name: 'product',
      description: 'Current product record',
      type: 'currentRecord',
    },
  ],
  tags: ['commerce', 'product', 'detail'],
};

const AddToCartButtonComponent: ComponentDefinition = {
  type: 'AddToCartButton',
  displayName: 'Add to Cart Button',
  description: 'Button to add product to cart',
  icon: 'shopping-cart',
  category: 'commerce',
  canHaveChildren: false,
  defaultProps: {
    text: 'Add to Cart',
    variant: 'primary',
  },
  propsSchema: z.object({
    text: z.string().default('Add to Cart'),
    variant: z.enum(['primary', 'secondary', 'outline']).default('primary'),
    showQuantity: z.boolean().default(false),
    fullWidth: z.boolean().default(false),
  }),
  dataBindings: [
    {
      name: 'product',
      description: 'Current product to add',
      type: 'currentRecord',
    },
  ],
  tags: ['commerce', 'cart', 'button'],
};

const CartSummaryComponent: ComponentDefinition = {
  type: 'CartSummary',
  displayName: 'Cart Summary',
  description: 'Display shopping cart summary',
  icon: 'shopping-cart',
  category: 'commerce',
  canHaveChildren: false,
  defaultProps: {
    showItems: true,
    showSubtotal: true,
  },
  propsSchema: z.object({
    showItems: z.boolean().default(true),
    showSubtotal: z.boolean().default(true),
    showTax: z.boolean().default(false),
    showShipping: z.boolean().default(false),
    showCheckoutButton: z.boolean().default(true),
  }),
  tags: ['commerce', 'cart', 'summary', 'checkout'],
};

const CartItemsComponent: ComponentDefinition = {
  type: 'CartItems',
  displayName: 'Cart Items',
  description: 'Display cart items with quantities',
  icon: 'list',
  category: 'commerce',
  canHaveChildren: false,
  defaultProps: {
    showImage: true,
    showQuantityControl: true,
  },
  propsSchema: z.object({
    showImage: z.boolean().default(true),
    showQuantityControl: z.boolean().default(true),
    showRemoveButton: z.boolean().default(true),
    showSubtotal: z.boolean().default(true),
  }),
  tags: ['commerce', 'cart', 'items'],
};

const CheckoutButtonComponent: ComponentDefinition = {
  type: 'CheckoutButton',
  displayName: 'Checkout Button',
  description: 'Button to start checkout process',
  icon: 'credit-card',
  category: 'commerce',
  canHaveChildren: false,
  defaultProps: {
    text: 'Checkout',
    variant: 'primary',
  },
  propsSchema: z.object({
    text: z.string().default('Checkout'),
    variant: z.enum(['primary', 'secondary', 'outline']).default('primary'),
    fullWidth: z.boolean().default(false),
    successUrl: z.string().default('/checkout/success'),
    cancelUrl: z.string().default('/cart'),
  }),
  tags: ['commerce', 'checkout', 'button', 'payment'],
};

const PriceDisplayComponent: ComponentDefinition = {
  type: 'PriceDisplay',
  displayName: 'Price Display',
  description: 'Display formatted price',
  icon: 'dollar-sign',
  category: 'commerce',
  canHaveChildren: false,
  defaultProps: {
    showCurrency: true,
  },
  propsSchema: z.object({
    showCurrency: z.boolean().default(true),
    showOriginalPrice: z.boolean().default(false),
    size: z.enum(['sm', 'md', 'lg', 'xl']).default('md'),
  }),
  dataBindings: [
    {
      name: 'product',
      description: 'Current product for price',
      type: 'currentRecord',
    },
  ],
  tags: ['commerce', 'price', 'money'],
};

// ============================================================================
// SHOP PLUGIN COLLECTIONS
// ============================================================================

const productsCollection: CollectionDefinition = {
  slug: 'products',
  name: 'Products',
  description: 'Products for your online store',
  schema: [
    { name: 'name', type: 'text', required: true, validation: { min: 1, max: 200 } },
    { name: 'slug', type: 'slug', required: true, unique: true },
    { name: 'description', type: 'richtext', required: false },
    { name: 'price', type: 'number', required: true, validation: { min: 0 } },
    { name: 'compareAtPrice', type: 'number', required: false },
    { name: 'sku', type: 'text', required: false },
    { name: 'inventory', type: 'number', required: false, defaultValue: 0 },
    { name: 'images', type: 'json', required: false, defaultValue: [] },
    { name: 'category', type: 'text', required: false },
    { name: 'tags', type: 'multiselect', required: false, validation: {
      options: ['featured', 'sale', 'new', 'bestseller']
    }},
    { name: 'isActive', type: 'boolean', required: false, defaultValue: true },
  ],
  isSystem: false,
  settings: {
    slugField: 'slug',
    titleField: 'name',
    timestamps: true,
  },
};

const ordersCollection: CollectionDefinition = {
  slug: 'orders',
  name: 'Orders',
  description: 'Customer orders',
  schema: [
    { name: 'orderNumber', type: 'text', required: true },
    { name: 'customerEmail', type: 'email', required: true },
    { name: 'customerName', type: 'text', required: false },
    { name: 'items', type: 'json', required: true },
    { name: 'subtotal', type: 'number', required: true },
    { name: 'tax', type: 'number', required: false, defaultValue: 0 },
    { name: 'shipping', type: 'number', required: false, defaultValue: 0 },
    { name: 'total', type: 'number', required: true },
    { name: 'status', type: 'select', required: true, validation: {
      options: ['pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded']
    }},
    { name: 'shippingAddress', type: 'json', required: false },
    { name: 'stripePaymentId', type: 'text', required: false },
  ],
  isSystem: true,
  settings: {
    titleField: 'orderNumber',
    timestamps: true,
  },
};

// ============================================================================
// SHOP PLUGIN ACTIONS
// ============================================================================

const addToCartActionDef: ActionDefinition = {
  type: 'addToCart',
  displayName: 'Add to Cart',
  description: 'Add a product to the shopping cart',
  icon: 'shopping-cart',
  schema: z.object({
    type: z.literal('addToCart'),
    productIdBinding: z.string(),
    quantityBinding: z.string().optional(),
  }),
};

const removeFromCartActionDef: ActionDefinition = {
  type: 'removeFromCart',
  displayName: 'Remove from Cart',
  description: 'Remove a product from the cart',
  icon: 'trash',
  schema: z.object({
    type: z.literal('removeFromCart'),
    productIdBinding: z.string(),
  }),
};

const checkoutActionDef: ActionDefinition = {
  type: 'checkout',
  displayName: 'Start Checkout',
  description: 'Start the Stripe checkout process',
  icon: 'credit-card',
  schema: z.object({
    type: z.literal('checkout'),
    successUrl: z.string(),
    cancelUrl: z.string(),
  }),
};

// ============================================================================
// SHOP PLUGIN DEFINITION
// ============================================================================

export const shopPlugin: PluginDefinition = {
  id: 'shop',
  name: 'Shop',
  version: '1.0.0',
  description: 'Add e-commerce functionality with products, cart, and checkout',
  author: 'Builderly',
  
  components: [
    ProductListComponent,
    ProductCardComponent,
    ProductDetailComponent,
    AddToCartButtonComponent,
    CartSummaryComponent,
    CartItemsComponent,
    CheckoutButtonComponent,
    PriceDisplayComponent,
  ],
  
  collections: [
    productsCollection,
    ordersCollection,
  ],
  
  actions: [
    addToCartActionDef,
    removeFromCartActionDef,
    checkoutActionDef,
  ],
  
  templates: [
    {
      id: 'product-listing',
      name: 'Product Listing Page',
      description: 'A page displaying all products',
      category: 'Commerce',
      tree: {
        builderVersion: 1,
        root: {
          id: 'root',
          type: 'Section',
          props: {},
          style: { base: { padding: 'lg' } },
          actions: [],
          children: [
            {
              id: 'container',
              type: 'Container',
              props: { maxWidth: 'xl' },
              style: { base: {} },
              actions: [],
              children: [
                {
                  id: 'heading',
                  type: 'Heading',
                  props: { level: 1, text: 'Products' },
                  style: { base: { marginBottom: 'lg' } },
                  actions: [],
                  children: [],
                },
                {
                  id: 'products',
                  type: 'ProductList',
                  props: { limit: 12, columns: 4 },
                  style: { base: {} },
                  actions: [],
                  children: [],
                },
              ],
            },
          ],
        },
      },
    },
  ],
  
  onActivate: () => {
    console.log('Shop plugin activated');
  },
  
  onDeactivate: () => {
    console.log('Shop plugin deactivated');
  },
};
