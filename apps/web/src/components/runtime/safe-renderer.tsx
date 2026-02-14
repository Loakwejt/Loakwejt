'use client';

import React, { useCallback, useMemo, useRef, useState } from 'react';
import type { BuilderNode, BuilderTree, BuilderStyle } from '@builderly/core';
import { componentRegistry, createClientActionRunner } from '@builderly/core';
import type { ActionResult } from '@builderly/core';
import { cn } from '@builderly/ui';
import { RuntimeAnimationWrapper } from './animation-wrapper';
import {
  LoginFormRuntime,
  RegisterFormRuntime,
  PasswordResetFormRuntime,
  UserProfileRuntime,
  UserAvatarRuntime,
  LogoutButtonRuntime,
  ProtectedContentRuntime,
  MemberListRuntime,
} from './auth-components';
import {
  WishlistButton,
  WishlistDisplay,
  ProductReviews,
  ReviewForm,
  CategoryFilter,
  ProductVariantSelector,
  ColorSwatch,
  SizeSelector,
  StockIndicator,
  CheckoutForm,
  AddressForm,
} from './commerce-components';
import {
  SearchBox,
  SearchResults,
  CookieBanner,
} from './ui-components';

// ============================================================================
// ACTION EXECUTION HELPER — runs node.actions for a given event
// ============================================================================

const actionRunner = createClientActionRunner();

function buildClickHandler(
  node: BuilderNode,
  eventName: string = 'onClick'
): ((e: React.MouseEvent) => void) | undefined {
  const actions = node.actions as
    | Array<{ event: string; action: { type: string; [key: string]: unknown } }>
    | undefined;
  if (!actions || actions.length === 0) return undefined;

  const matching = actions.filter(
    (a) => a.event === eventName || a.event === 'click'
  );
  if (matching.length === 0) return undefined;

  return (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    matching.forEach((binding) => {
      const action = binding.action;
      switch (action.type) {
        case 'navigate': {
          const target = (action.target as string) || '_self';
          const to = action.to as string;
          if (target === '_blank') {
            window.open(to, '_blank');
          } else {
            window.location.href = to;
          }
          break;
        }
        case 'scrollTo': {
          const targetId = action.targetId as string;
          const el =
            document.getElementById(targetId) ||
            document.querySelector(`[data-node-id="${targetId}"]`);
          if (el) {
            el.scrollIntoView({
              behavior: (action.behavior as ScrollBehavior) || 'smooth',
              block: 'start',
            });
          }
          break;
        }
        case 'openModal': {
          const modalId = action.modalId as string;
          const modal = document.getElementById(modalId);
          if (modal) modal.classList.remove('hidden');
          document.dispatchEvent(
            new CustomEvent('builderly:openModal', { detail: { modalId } })
          );
          break;
        }
        case 'closeModal': {
          const modalId = (action.modalId as string) || '';
          if (modalId) {
            const modal = document.getElementById(modalId);
            if (modal) modal.classList.add('hidden');
          }
          document.dispatchEvent(
            new CustomEvent('builderly:closeModal', { detail: { modalId } })
          );
          break;
        }
        case 'submitForm': {
          // Find the closest parent form and submit
          const target2 = e.currentTarget as HTMLElement;
          const form = target2.closest('form');
          if (form) {
            form.requestSubmit();
          }
          break;
        }
        case 'login': {
          const redirectTo =
            (action.redirectTo as string) || window.location.pathname;
          window.location.href = `/login?redirect=${encodeURIComponent(redirectTo)}`;
          break;
        }
        case 'logout': {
          const logoutRedirect = (action.redirectTo as string) || '/';
          // Fire-and-forget logout, then redirect
          fetch('/api/auth/signout', { method: 'POST', credentials: 'include' })
            .finally(() => {
              window.location.href = logoutRedirect;
            });
          break;
        }
        case 'addToCart': {
          const productId = action.productId as string;
          const quantity = (action.quantity as number) || 1;
          const variantId = action.variantId as string | undefined;
          
          // Get workspace slug from URL path (e.g., /s/tetete/...)
          const pathParts = window.location.pathname.split('/');
          const sIndex = pathParts.indexOf('s');
          const slug = sIndex >= 0 && pathParts[sIndex + 1] ? pathParts[sIndex + 1] : '';
          
          if (!productId || !slug) {
            console.error('addToCart: Missing productId or slug');
            break;
          }
          
          fetch(`/api/runtime/workspaces/${slug}/cart`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ productId, quantity, variantId }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.success) {
                // Dispatch custom event for cart update
                document.dispatchEvent(
                  new CustomEvent('builderly:cartUpdated', { detail: data.cart })
                );
                // Show success message
                document.dispatchEvent(
                  new CustomEvent('builderly:toast', { 
                    detail: { type: 'success', message: data.message || 'Zum Warenkorb hinzugefügt.' } 
                  })
                );
              } else {
                document.dispatchEvent(
                  new CustomEvent('builderly:toast', { 
                    detail: { type: 'error', message: data.error || 'Fehler beim Hinzufügen.' } 
                  })
                );
              }
            })
            .catch((err) => {
              console.error('addToCart error:', err);
              document.dispatchEvent(
                new CustomEvent('builderly:toast', { 
                  detail: { type: 'error', message: 'Fehler beim Hinzufügen zum Warenkorb.' } 
                })
              );
            });
          break;
        }
        default:
          console.warn('Unknown runtime action:', action.type);
      }
    });
  };
}

// ============================================================================
// STYLE MAPPING - Convert tokens to Tailwind classes with responsive support
// ============================================================================

/**
 * Converts a style props object to Tailwind classes with optional prefix
 */
function propsToClasses(props: Record<string, any> | undefined, prefix: string = ''): string[] {
  if (!props) return [];
  const classes: string[] = [];
  const p = prefix; // e.g. '' for mobile, 'md:' for desktop

  // Padding
  if (props.padding) classes.push(`${p}p-${mapSpacing(props.padding)}`);
  if (props.paddingX) classes.push(`${p}px-${mapSpacing(props.paddingX)}`);
  if (props.paddingY) classes.push(`${p}py-${mapSpacing(props.paddingY)}`);
  if (props.paddingTop) classes.push(`${p}pt-${mapSpacing(props.paddingTop)}`);
  if (props.paddingBottom) classes.push(`${p}pb-${mapSpacing(props.paddingBottom)}`);
  if (props.paddingLeft) classes.push(`${p}pl-${mapSpacing(props.paddingLeft)}`);
  if (props.paddingRight) classes.push(`${p}pr-${mapSpacing(props.paddingRight)}`);

  // Margin
  if (props.margin) classes.push(`${p}m-${mapSpacing(props.margin)}`);
  if (props.marginX) classes.push(`${p}mx-${mapSpacing(props.marginX)}`);
  if (props.marginY) classes.push(`${p}my-${mapSpacing(props.marginY)}`);
  if (props.marginTop) classes.push(`${p}mt-${mapSpacing(props.marginTop)}`);
  if (props.marginBottom) classes.push(`${p}mb-${mapSpacing(props.marginBottom)}`);

  // Gap
  if (props.gap) classes.push(`${p}gap-${mapSpacing(props.gap)}`);

  // Display
  if (props.display) {
    const displayMap: Record<string, string> = {
      block: 'block',
      inline: 'inline',
      'inline-block': 'inline-block',
      flex: 'flex',
      'inline-flex': 'inline-flex',
      grid: 'grid',
      none: 'hidden',
    };
    if (displayMap[props.display]) {
      classes.push(`${p}${displayMap[props.display]}`);
    }
  }

  // Grid
  if (props.gridColumns) {
    const cols = parseInt(props.gridColumns);
    if (!isNaN(cols) && cols >= 1 && cols <= 12) {
      classes.push(`${p}grid-cols-${cols}`);
    }
  }

  // Background & Text colors (only Tailwind tokens, not hex values)
  if (props.backgroundColor && !props.backgroundColor.includes('#') && !props.backgroundColor.includes('rgb')) {
    classes.push(`${p}bg-${props.backgroundColor}`);
  }
  if (props.color && !props.color.includes('#') && !props.color.includes('rgb')) {
    classes.push(`${p}text-${props.color}`);
  }

  // Text (only Tailwind tokens)
  if (props.textAlign) classes.push(`${p}text-${props.textAlign}`);
  if (props.fontSize && !props.fontSize.includes('px')) classes.push(`${p}text-${props.fontSize}`);
  if (props.fontWeight && !/^\d+$/.test(props.fontWeight)) classes.push(`${p}font-${props.fontWeight}`);

  // Flex
  if (props.flexDirection) {
    const dirMap: Record<string, string> = {
      row: 'flex-row',
      column: 'flex-col',
      'row-reverse': 'flex-row-reverse',
      'column-reverse': 'flex-col-reverse',
    };
    if (dirMap[props.flexDirection]) classes.push(`${p}${dirMap[props.flexDirection]}`);
  }
  if (props.alignItems) {
    const alignMap: Record<string, string> = {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline',
    };
    if (alignMap[props.alignItems]) classes.push(`${p}${alignMap[props.alignItems]}`);
  }
  if (props.justifyContent) {
    const justifyMap: Record<string, string> = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    };
    if (justifyMap[props.justifyContent]) classes.push(`${p}${justifyMap[props.justifyContent]}`);
  }
  if (props.flexWrap) {
    const wrapMap: Record<string, string> = {
      wrap: 'flex-wrap',
      nowrap: 'flex-nowrap',
      'wrap-reverse': 'flex-wrap-reverse',
    };
    if (wrapMap[props.flexWrap]) classes.push(`${p}${wrapMap[props.flexWrap]}`);
  }

  // Border
  if (props.borderRadius && !props.borderRadius.includes('px')) classes.push(`${p}rounded-${props.borderRadius}`);
  if (props.shadow) classes.push(`${p}shadow-${props.shadow}`);

  // NOTE: maxWidth is NOT handled here - it's handled by Container renderer with responsive classes
  // This prevents max-w-xl from breaking desktop layouts

  // Width (Tailwind tokens)
  if (props.width === 'full') classes.push(`${p}w-full`);
  if (props.width === 'auto') classes.push(`${p}w-auto`);
  if (props.width === 'screen') classes.push(`${p}w-screen`);

  // Height (Tailwind tokens)
  if (props.height === 'full') classes.push(`${p}h-full`);
  if (props.height === 'auto') classes.push(`${p}h-auto`);
  if (props.height === 'screen') classes.push(`${p}h-screen`);

  return classes;
}

/**
 * Maps BuilderStyle to responsive Tailwind classes
 * Uses Tailwind's default desktop-first approach:
 * - base styles apply to ALL screen sizes (no prefix)
 * - mobile styles apply only below md: breakpoint via max-md: or explicit overrides
 * 
 * Since Tailwind is mobile-first by default (sm:, md:, lg: = "and up"),
 * we need to output base styles without prefix and let component-level
 * responsive classes (like grid-cols-1 md:grid-cols-4) handle the rest.
 */
function mapStyleToClasses(style: BuilderStyle, _breakpoint?: 'base' | 'mobile' | 'tablet' | 'desktop'): string {
  if (!style) return '';

  const classes: string[] = [];
  
  // Base styles apply to all screen sizes (no prefix)
  if (style.base && Object.keys(style.base).length > 0) {
    classes.push(...propsToClasses(style.base, ''));
  }

  // Mobile styles - these are handled via CSS media queries in extractInlineStyles
  // For Tailwind classes, we can't easily do "below md:" so we skip them here
  // The mapStyleToInlineCss function handles mobile-specific overrides

  // If there are tablet-specific styles, add them
  if (style.tablet && Object.keys(style.tablet).length > 0) {
    classes.push(...propsToClasses(style.tablet, 'sm:'));
  }

  // If there are desktop-specific styles (separate from base), add them
  if (style.desktop && Object.keys(style.desktop).length > 0) {
    classes.push(...propsToClasses(style.desktop, 'lg:'));
  }

  return classes.filter(Boolean).join(' ');
}

function mapSpacing(token: string): string {
  const map: Record<string, string> = {
    none: '0',
    xs: '1',
    sm: '2',
    md: '4',
    lg: '6',
    xl: '8',
    '2xl': '12',
    '3xl': '16',
    '4xl': '24',
  };
  return map[token] || '4';
}

// ============================================================================
// INLINE STYLE EXTRACTION - For CSS values that can't be mapped to Tailwind
// ============================================================================

/**
 * Extracts CSS properties from a style props object
 */
function propsToInlineStyles(props: Record<string, any> | undefined): React.CSSProperties {
  if (!props) return {};
  const inlineStyles: React.CSSProperties = {};

  // Background (supports gradients and colors)
  if (props.background && typeof props.background === 'string') {
    inlineStyles.background = props.background;
  }
  if (props.gradient && typeof props.gradient === 'string') {
    inlineStyles.background = props.gradient;
  }
  if (props.backgroundColor && typeof props.backgroundColor === 'string') {
    if (props.backgroundColor.includes('#') || props.backgroundColor.includes('rgb') || props.backgroundColor.includes('hsl')) {
      inlineStyles.backgroundColor = props.backgroundColor;
    }
  }
  if (props.bgColor && typeof props.bgColor === 'string') {
    if (props.bgColor.includes('#') || props.bgColor.includes('rgb') || props.bgColor.includes('hsl')) {
      inlineStyles.backgroundColor = props.bgColor;
    }
  }

  // Color
  if (props.color && typeof props.color === 'string') {
    if (props.color.includes('#') || props.color.includes('rgb') || props.color.includes('hsl') || props.color.includes('rgba')) {
      inlineStyles.color = props.color;
    }
  }

  // Typography
  if (props.fontSize && typeof props.fontSize === 'string' && props.fontSize.includes('px')) {
    inlineStyles.fontSize = props.fontSize;
  }
  if (props.fontWeight && typeof props.fontWeight === 'string' && /^\d+$/.test(props.fontWeight)) {
    inlineStyles.fontWeight = parseInt(props.fontWeight) as React.CSSProperties['fontWeight'];
  }
  if (props.lineHeight && typeof props.lineHeight === 'string') {
    inlineStyles.lineHeight = props.lineHeight;
  }
  if (props.letterSpacing && typeof props.letterSpacing === 'string') {
    inlineStyles.letterSpacing = props.letterSpacing;
  }

  // Spacing with px values
  if (props.padding && typeof props.padding === 'string' && (props.padding.includes('px') || props.padding.includes('%'))) {
    inlineStyles.padding = props.padding;
  }
  if (props.margin && typeof props.margin === 'string' && (props.margin.includes('px') || props.margin.includes('%'))) {
    inlineStyles.margin = props.margin;
  }
  if (props.marginBottom && typeof props.marginBottom === 'string') {
    inlineStyles.marginBottom = props.marginBottom;
  }
  if (props.marginTop && typeof props.marginTop === 'string') {
    inlineStyles.marginTop = props.marginTop;
  }

  // Borders
  if (props.border && typeof props.border === 'string') {
    inlineStyles.border = props.border;
  }
  if (props.borderBottom && typeof props.borderBottom === 'string') {
    inlineStyles.borderBottom = props.borderBottom;
  }
  if (props.borderTop && typeof props.borderTop === 'string') {
    inlineStyles.borderTop = props.borderTop;
  }
  if (props.borderRadius && typeof props.borderRadius === 'string' && props.borderRadius.includes('px')) {
    inlineStyles.borderRadius = props.borderRadius;
  }

  // Layout
  if (props.minHeight && typeof props.minHeight === 'string') {
    inlineStyles.minHeight = props.minHeight;
  }
  if (props.maxWidth && typeof props.maxWidth === 'string' && (props.maxWidth.includes('px') || props.maxWidth.includes('%'))) {
    inlineStyles.maxWidth = props.maxWidth;
  }
  if (props.width && typeof props.width === 'string' && (props.width.includes('px') || props.width.includes('%'))) {
    inlineStyles.width = props.width;
  }
  if (props.height && typeof props.height === 'string' && (props.height.includes('px') || props.height.includes('%'))) {
    inlineStyles.height = props.height;
  }

  // Flexbox - but only if not already handled by Tailwind classes
  // We skip display, flexDirection, justifyContent, alignItems here as they're handled by Tailwind
  if (props.gap && typeof props.gap === 'string' && props.gap.includes('px')) {
    inlineStyles.gap = props.gap;
  }
  if (props.flex && typeof props.flex === 'string') {
    inlineStyles.flex = props.flex;
  }

  // Position
  if (props.position && typeof props.position === 'string') {
    inlineStyles.position = props.position as React.CSSProperties['position'];
  }
  if (props.top && typeof props.top === 'string') {
    inlineStyles.top = props.top;
  }
  if (props.left && typeof props.left === 'string') {
    inlineStyles.left = props.left;
  }
  if (props.right && typeof props.right === 'string') {
    inlineStyles.right = props.right;
  }
  if (props.zIndex && typeof props.zIndex === 'number') {
    inlineStyles.zIndex = props.zIndex;
  }

  // Object fit for images
  if (props.objectFit && typeof props.objectFit === 'string') {
    inlineStyles.objectFit = props.objectFit as React.CSSProperties['objectFit'];
  }

  // Text - only if not handled by Tailwind
  if (props.textDecoration && typeof props.textDecoration === 'string') {
    inlineStyles.textDecoration = props.textDecoration;
  }
  if (props.whiteSpace && typeof props.whiteSpace === 'string') {
    inlineStyles.whiteSpace = props.whiteSpace as React.CSSProperties['whiteSpace'];
  }

  // Cursor
  if (props.cursor && typeof props.cursor === 'string') {
    inlineStyles.cursor = props.cursor as React.CSSProperties['cursor'];
  }

  return inlineStyles;
}

/**
 * Extracts inline styles from BuilderStyle
 * Returns desktop (base) styles as inline, mobile styles are handled via CSS
 */
function extractInlineStyles(style: BuilderStyle): React.CSSProperties {
  return propsToInlineStyles(style.base || {});
}

/**
 * Generates responsive CSS for a node's mobile styles
 * Returns CSS string that uses data-node-id selector with media query
 */
function generateMobileCSS(nodeId: string, style: BuilderStyle): string {
  const mobileProps = style.mobile;
  if (!mobileProps || Object.keys(mobileProps).length === 0) return '';

  const cssProperties: string[] = [];

  // Only include properties that differ from base and are inline styles
  if (mobileProps.fontSize) cssProperties.push(`font-size: ${mobileProps.fontSize}`);
  if (mobileProps.padding) cssProperties.push(`padding: ${mobileProps.padding}`);
  if (mobileProps.margin) cssProperties.push(`margin: ${mobileProps.margin}`);
  if (mobileProps.marginBottom) cssProperties.push(`margin-bottom: ${mobileProps.marginBottom}`);
  if (mobileProps.marginTop) cssProperties.push(`margin-top: ${mobileProps.marginTop}`);
  if (mobileProps.gap && mobileProps.gap.includes && mobileProps.gap.includes('px')) cssProperties.push(`gap: ${mobileProps.gap}`);
  if (mobileProps.lineHeight) cssProperties.push(`line-height: ${mobileProps.lineHeight}`);
  if (mobileProps.letterSpacing) cssProperties.push(`letter-spacing: ${mobileProps.letterSpacing}`);
  if (mobileProps.width) cssProperties.push(`width: ${mobileProps.width}`);
  if (mobileProps.height) cssProperties.push(`height: ${mobileProps.height}`);
  if (mobileProps.maxWidth) cssProperties.push(`max-width: ${mobileProps.maxWidth}`);
  if (mobileProps.minHeight) cssProperties.push(`min-height: ${mobileProps.minHeight}`);
  if (mobileProps.borderRadius && mobileProps.borderRadius.includes && mobileProps.borderRadius.includes('px')) {
    cssProperties.push(`border-radius: ${mobileProps.borderRadius}`);
  }
  if (mobileProps.textAlign) cssProperties.push(`text-align: ${mobileProps.textAlign}`);

  if (cssProperties.length === 0) return '';

  return `[data-node-id="${nodeId}"] { ${cssProperties.join('; ')} }`;
}

// ============================================================================
// COMPONENT RENDERERS - Whitelist-based safe rendering
// ============================================================================

interface RenderContext {
  workspaceId?: string;
  /** @deprecated Use `workspaceId` instead */
  siteId?: string;
  pageId?: string;
  currentRecord?: Record<string, any>;
}

type ComponentRenderer = (
  node: BuilderNode,
  children: React.ReactNode,
  context: RenderContext
) => React.ReactNode;

const COMPONENT_RENDERERS: Record<string, ComponentRenderer> = {
  // Layout
  Section: (node, children) => {
    const onClick = buildClickHandler(node);
    return (
      <section 
        data-node-id={node.id}
        className={cn('w-full', mapStyleToClasses(node.style))}
        style={extractInlineStyles(node.style)}
        onClick={onClick}
      >
        {children}
      </section>
    );
  },

  Container: (node, children) => {
    // maxWidth only applies to mobile - on desktop (md:+) containers are full width
    // This prevents narrow containers breaking desktop layouts
    const maxWidth = (node.props.maxWidth as string) || 'full';
    const centered = node.props.centered === true;
    
    // Map maxWidth tokens to Tailwind classes - MOBILE ONLY
    // On desktop (md:+) we use max-w-none to remove all restrictions
    const mobileMaxWidthMap: Record<string, string> = {
      'sm': 'max-w-sm md:max-w-none',
      'md': 'max-w-md md:max-w-none',
      'lg': 'max-w-lg md:max-w-none',
      'xl': 'max-w-xl md:max-w-none',
      '2xl': 'max-w-2xl md:max-w-none',
      '3xl': 'max-w-3xl md:max-w-none',
      '4xl': 'max-w-4xl md:max-w-none',
      '5xl': 'max-w-5xl md:max-w-none',
      '6xl': 'max-w-6xl md:max-w-none',
      '7xl': 'max-w-7xl md:max-w-none',
      'full': '',  // No max-width restrictions
      'none': '',  // No max-width restrictions
      'screen-sm': 'max-w-screen-sm md:max-w-none',
      'screen-md': 'max-w-screen-md md:max-w-none',
      'screen-lg': 'max-w-screen-lg md:max-w-none',
      'screen-xl': 'max-w-screen-xl md:max-w-none',
      'screen-2xl': 'max-w-screen-2xl md:max-w-none',
    };
    
    // Filter out any maxWidth classes from mapStyleToClasses to prevent conflicts
    const styleClasses = mapStyleToClasses(node.style)
      .split(' ')
      .filter(cls => !cls.includes('max-w-'))
      .join(' ');
    
    return (
      <div 
        data-node-id={node.id}
        className={cn(
          'w-full', 
          centered && 'mx-auto',
          mobileMaxWidthMap[maxWidth] || '',
          styleClasses
        )}
        style={extractInlineStyles(node.style)}
      >
        {children}
      </div>
    );
  },

  Stack: (node, children) => {
    // Get direction from style.base.flexDirection (priority) or props.direction
    const baseFlexDir = node.style?.base?.flexDirection as string | undefined;
    const direction = baseFlexDir || (node.props.direction as string) || 'column';
    
    // Get mobile direction from style.mobile.flexDirection
    const mobileFlexDir = node.style?.mobile?.flexDirection as string | undefined;
    
    const gap = (node.props.gap as string) || 'md';
    const align = (node.props.align as string) || 'stretch';
    const justify = (node.props.justify as string) || 'start';

    const dirMap: Record<string, string> = { row: 'flex-row', column: 'flex-col' };
    const mdDirMap: Record<string, string> = { row: 'md:flex-row', column: 'md:flex-col' };
    
    const alignMap: Record<string, string> = {
      start: 'items-start', center: 'items-center', end: 'items-end', 
      stretch: 'items-stretch', baseline: 'items-baseline',
    };
    const justifyMap: Record<string, string> = {
      start: 'justify-start', center: 'justify-center', end: 'justify-end',
      between: 'justify-between', around: 'justify-around', evenly: 'justify-evenly',
    };
    const gapMap: Record<string, string> = {
      none: 'gap-0', xs: 'gap-1', sm: 'gap-2', md: 'gap-4', lg: 'gap-6', xl: 'gap-8', '2xl': 'gap-12',
    };

    // Build responsive direction classes
    // If mobile direction is set, use it as base (mobile-first) and desktop direction with md: prefix
    let dirClasses: string;
    if (mobileFlexDir && mobileFlexDir !== direction) {
      // Mobile: mobileFlexDir, Tablet+: direction
      dirClasses = cn(dirMap[mobileFlexDir] || 'flex-col', mdDirMap[direction] || 'md:flex-row');
    } else {
      // Same direction for all breakpoints
      dirClasses = dirMap[direction] || 'flex-col';
    }

    // Filter flexDirection from mapStyleToClasses output to prevent conflicts
    const styleClasses = mapStyleToClasses(node.style)
      .split(' ')
      .filter(cls => !cls.includes('flex-row') && !cls.includes('flex-col'))
      .join(' ');

    return (
      <div 
        data-node-id={node.id}
        className={cn(
          'flex',
          dirClasses,
          gapMap[gap] || 'gap-4',
          alignMap[align],
          justifyMap[justify],
          styleClasses
        )}
        style={extractInlineStyles(node.style)}
      >
        {children}
      </div>
    );
  },

  Grid: (node, children) => {
    // Get columns from style.base.gridColumns (priority) or props.columns
    const baseGridCols = node.style?.base?.gridColumns;
    const columns = baseGridCols ? parseInt(baseGridCols as string) : ((node.props.columns as number) || 3);
    
    // Get mobile columns from style.mobile.gridColumns (default to 1 for mobile-first)
    const mobileGridCols = node.style?.mobile?.gridColumns;
    const mobileColumns = mobileGridCols ? parseInt(mobileGridCols as string) : 1;
    
    const gap = (node.props.gap as string) || 'md';

    // Map columns to Tailwind classes for JIT compatibility
    const colsMap: Record<number, string> = {
      1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3',
      4: 'grid-cols-4', 5: 'grid-cols-5', 6: 'grid-cols-6',
      7: 'grid-cols-7', 8: 'grid-cols-8', 9: 'grid-cols-9',
      10: 'grid-cols-10', 11: 'grid-cols-11', 12: 'grid-cols-12',
    };
    const mdColsMap: Record<number, string> = {
      1: 'md:grid-cols-1', 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 
      4: 'md:grid-cols-4', 5: 'md:grid-cols-5', 6: 'md:grid-cols-6',
    };
    const lgColsMap: Record<number, string> = {
      1: 'lg:grid-cols-1', 2: 'lg:grid-cols-2', 3: 'lg:grid-cols-3',
      4: 'lg:grid-cols-4', 5: 'lg:grid-cols-5', 6: 'lg:grid-cols-6',
      7: 'lg:grid-cols-7', 8: 'lg:grid-cols-8',
    };
    const gapMap: Record<string, string> = {
      none: 'gap-0', xs: 'gap-1', sm: 'gap-2', md: 'gap-4', lg: 'gap-6', xl: 'gap-8', '2xl': 'gap-12',
    };

    // Filter gridColumns from mapStyleToClasses output to prevent conflicts
    const styleClasses = mapStyleToClasses(node.style)
      .split(' ')
      .filter(cls => !cls.includes('grid-cols-'))
      .join(' ');

    return (
      <div 
        data-node-id={node.id}
        className={cn(
          'grid',
          colsMap[mobileColumns] || 'grid-cols-1',
          mdColsMap[Math.min(columns, 6)] || 'md:grid-cols-3',
          lgColsMap[columns] || 'lg:grid-cols-3',
          gapMap[gap] || 'gap-4',
          styleClasses
        )}
        style={extractInlineStyles(node.style)}
      >
        {children}
      </div>
    );
  },

  Divider: (node) => (
    <hr data-node-id={node.id} className={cn('border-t border-border', mapStyleToClasses(node.style))} />
  ),

  Spacer: (node) => {
    const size = (node.props.size as string) || 'md';
    const heightMap: Record<string, string> = {
      xs: 'h-2', sm: 'h-4', md: 'h-8', lg: 'h-12', xl: 'h-16', '2xl': 'h-24', '3xl': 'h-32',
    };
    return <div data-node-id={node.id} className={cn(heightMap[size] || 'h-8', mapStyleToClasses(node.style))} />;
  },

  // Content
  Text: (node) => {
    const text = (node.props.text as string) || '';
    return (
      <p 
        data-node-id={node.id}
        className={cn('text-base', mapStyleToClasses(node.style))}
        style={extractInlineStyles(node.style)}
      >
        {text}
      </p>
    );
  },

  Heading: (node) => {
    const level = (node.props.level as number) || 2;
    const text = (node.props.text as string) || '';
    const Tag = `h${level}` as keyof JSX.IntrinsicElements;
    
    const sizeMap: Record<number, string> = {
      1: 'text-4xl font-bold',
      2: 'text-3xl font-bold',
      3: 'text-2xl font-semibold',
      4: 'text-xl font-semibold',
      5: 'text-lg font-medium',
      6: 'text-base font-medium',
    };

    return (
      <Tag 
        data-node-id={node.id}
        className={cn(sizeMap[level] || sizeMap[2], mapStyleToClasses(node.style))}
        style={extractInlineStyles(node.style)}
      >
        {text}
      </Tag>
    );
  },

  Image: (node) => {
    const src = (node.props.src as string) || '';
    const alt = (node.props.alt as string) || '';
    const objectFit = (node.props.objectFit as string) || 'cover';

    return (
      <img
        data-node-id={node.id}
        src={src}
        alt={alt}
        className={cn('max-w-full h-auto', `object-${objectFit}`, mapStyleToClasses(node.style))}
        style={extractInlineStyles(node.style)}
      />
    );
  },

  // UI
  Button: (node) => {
    const text = (node.props.text as string) || 'Button';
    const variant = (node.props.variant as string) || 'primary';
    const size = (node.props.size as string) || 'md';

    const variantClasses: Record<string, string> = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      outline: 'border border-input bg-background hover:bg-accent',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    };

    const sizeClasses: Record<string, string> = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-10 px-4',
      lg: 'h-11 px-8',
    };

    const onClick = buildClickHandler(node);

    return (
      <button 
        data-node-id={node.id}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          onClick && 'cursor-pointer',
          variantClasses[variant] || variantClasses.primary,
          sizeClasses[size] || sizeClasses.md,
          mapStyleToClasses(node.style)
        )}
        style={extractInlineStyles(node.style)}
        onClick={onClick}
      >
        {text}
      </button>
    );
  },

  Card: (node, children) => {
    const title = (node.props.title as string) || '';
    const description = (node.props.description as string) || '';

    return (
      <div 
        data-node-id={node.id}
        className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', mapStyleToClasses(node.style))}
        style={extractInlineStyles(node.style)}
      >
        {(title || description) && (
          <div className="p-6">
            {title && <h3 className="text-lg font-semibold">{title}</h3>}
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
          </div>
        )}
        {children && <div className="p-6 pt-0">{children}</div>}
      </div>
    );
  },

  Badge: (node) => {
    const text = (node.props.text as string) || '';
    const variant = (node.props.variant as string) || 'default';

    const variantClasses: Record<string, string> = {
      default: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
      destructive: 'bg-destructive text-destructive-foreground',
      outline: 'border text-foreground',
    };

    return (
      <span 
        data-node-id={node.id}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
          variantClasses[variant] || variantClasses.default,
          mapStyleToClasses(node.style)
        )}
        style={extractInlineStyles(node.style)}
      >
        {text}
      </span>
    );
  },

  Alert: (node) => {
    const title = (node.props.title as string) || '';
    const description = (node.props.description as string) || '';

    return (
      <div 
        data-node-id={node.id}
        className={cn('rounded-lg border p-4', mapStyleToClasses(node.style))}
        style={extractInlineStyles(node.style)}
      >
        {title && <h5 className="font-medium mb-1">{title}</h5>}
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
    );
  },

  // Navigation
  Link: (node) => {
    const text = (node.props.text as string) || '';
    const href = (node.props.href as string) || '#';
    const onClick = buildClickHandler(node);

    return (
      <a 
        data-node-id={node.id}
        href={onClick ? undefined : href}
        className={cn('text-primary hover:underline', mapStyleToClasses(node.style))}
        style={extractInlineStyles(node.style)}
        onClick={onClick}
      >
        {text}
      </a>
    );
  },

  // Forms (read-only in runtime, but show structure)
  Form: (node, children) => (
    <form 
      className={cn('space-y-4', mapStyleToClasses(node.style))} 
      style={extractInlineStyles(node.style)}
      onSubmit={(e) => e.preventDefault()}
    >
      {children}
    </form>
  ),

  Input: (node) => {
    const label = (node.props.label as string) || '';
    const placeholder = (node.props.placeholder as string) || '';

    return (
      <div className={cn('space-y-2', mapStyleToClasses(node.style))}>
        {label && <label className="text-sm font-medium">{label}</label>}
        <input 
          type="text"
          placeholder={placeholder}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          style={extractInlineStyles(node.style)}
          readOnly
        />
      </div>
    );
  },

  Textarea: (node) => {
    const label = (node.props.label as string) || '';
    const placeholder = (node.props.placeholder as string) || '';

    return (
      <div className={cn('space-y-2', mapStyleToClasses(node.style))}>
        {label && <label className="text-sm font-medium">{label}</label>}
        <textarea 
          placeholder={placeholder}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          readOnly
        />
      </div>
    );
  },

  SubmitButton: (node) => {
    const text = (node.props.text as string) || 'Submit';

    return (
      <button 
        type="submit"
        className={cn(
          'inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground h-10 px-4 font-medium',
          mapStyleToClasses(node.style)
        )}
      >
        {text}
      </button>
    );
  },

  // Gates
  AuthGate: (node, children) => {
    // AuthGate renders a client-side component that checks site auth
    const showWhen = (node.props.showWhen as string) || 'authenticated';
    return (
      <AuthGateRuntime showWhen={showWhen as 'authenticated' | 'unauthenticated'}>
        {children}
      </AuthGateRuntime>
    );
  },

  // Auth Components
  LoginForm: (node) => (
    <LoginFormRuntime
      title={node.props.title as string}
      subtitle={node.props.subtitle as string}
      showRemember={node.props.showRemember as boolean}
      showForgotPassword={node.props.showForgotPassword as boolean}
      showRegisterLink={node.props.showRegisterLink as boolean}
      registerUrl={node.props.registerUrl as string}
      forgotPasswordUrl={node.props.forgotPasswordUrl as string}
      redirectAfterLogin={node.props.redirectAfterLogin as string}
      buttonText={node.props.buttonText as string}
      variant={node.props.variant as 'card' | 'inline' | 'minimal'}
      emailLabel={node.props.emailLabel as string}
      passwordLabel={node.props.passwordLabel as string}
    />
  ),

  RegisterForm: (node) => (
    <RegisterFormRuntime
      title={node.props.title as string}
      subtitle={node.props.subtitle as string}
      showName={node.props.showName as boolean}
      showLoginLink={node.props.showLoginLink as boolean}
      loginUrl={node.props.loginUrl as string}
      redirectAfterRegister={node.props.redirectAfterRegister as string}
      buttonText={node.props.buttonText as string}
      variant={node.props.variant as 'card' | 'inline' | 'minimal'}
      showTerms={node.props.showTerms as boolean}
      termsUrl={node.props.termsUrl as string}
      privacyUrl={node.props.privacyUrl as string}
      nameLabel={node.props.nameLabel as string}
      emailLabel={node.props.emailLabel as string}
      passwordLabel={node.props.passwordLabel as string}
      confirmPasswordLabel={node.props.confirmPasswordLabel as string}
      showPasswordStrength={node.props.showPasswordStrength as boolean}
      minPasswordLength={node.props.minPasswordLength as number}
    />
  ),

  PasswordResetForm: (node) => (
    <PasswordResetFormRuntime
      title={node.props.title as string}
      subtitle={node.props.subtitle as string}
      buttonText={node.props.buttonText as string}
      variant={node.props.variant as 'card' | 'inline' | 'minimal'}
      loginUrl={node.props.loginUrl as string}
      showLoginLink={node.props.showLoginLink as boolean}
      emailLabel={node.props.emailLabel as string}
    />
  ),

  UserProfile: (node) => (
    <UserProfileRuntime
      variant={node.props.variant as 'card' | 'inline' | 'sidebar'}
      showAvatar={node.props.showAvatar as boolean}
      showName={node.props.showName as boolean}
      showEmail={node.props.showEmail as boolean}
      showBio={node.props.showBio as boolean}
      editable={node.props.editable as boolean}
      showChangePassword={node.props.showChangePassword as boolean}
      showDeleteAccount={node.props.showDeleteAccount as boolean}
      title={node.props.title as string}
      saveButtonText={node.props.saveButtonText as string}
      avatarSize={node.props.avatarSize as 'sm' | 'md' | 'lg' | 'xl'}
      showJoinDate={node.props.showJoinDate as boolean}
      showRole={node.props.showRole as boolean}
    />
  ),

  UserAvatar: (node) => (
    <UserAvatarRuntime
      size={node.props.size as 'xs' | 'sm' | 'md' | 'lg' | 'xl'}
      showName={node.props.showName as boolean}
      showRole={node.props.showRole as boolean}
      namePosition={node.props.namePosition as 'right' | 'below'}
      showDropdown={node.props.showDropdown as boolean}
      profileUrl={node.props.profileUrl as string}
      logoutRedirect={node.props.logoutRedirect as string}
      showLoginButton={node.props.showLoginButton as boolean}
      loginUrl={node.props.loginUrl as string}
      loginButtonText={node.props.loginButtonText as string}
    />
  ),

  LogoutButton: (node) => (
    <LogoutButtonRuntime
      text={node.props.text as string}
      variant={node.props.variant as 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link'}
      size={node.props.size as 'sm' | 'md' | 'lg'}
      redirectTo={node.props.redirectTo as string}
      confirmLogout={node.props.confirmLogout as boolean}
      confirmMessage={node.props.confirmMessage as string}
      showIcon={node.props.showIcon as boolean}
      fullWidth={node.props.fullWidth as boolean}
    />
  ),

  MemberList: (node) => (
    <MemberListRuntime
      layout={node.props.layout as 'grid' | 'list' | 'compact'}
      columns={node.props.columns as number}
      showAvatar={node.props.showAvatar as boolean}
      showName={node.props.showName as boolean}
      showRole={node.props.showRole as boolean}
      showBio={node.props.showBio as boolean}
      showJoinDate={node.props.showJoinDate as boolean}
      pageSize={node.props.pageSize as number}
      showSearch={node.props.showSearch as boolean}
      filterByRole={node.props.filterByRole as string}
      title={node.props.title as string}
      showPagination={node.props.showPagination as boolean}
      avatarSize={node.props.avatarSize as 'sm' | 'md' | 'lg'}
    />
  ),

  ProtectedContent: (node, children) => (
    <ProtectedContentRuntime
      requiredRole={node.props.requiredRole as 'any' | 'admin' | 'moderator' | 'member' | 'vip'}
      showFallback={node.props.showFallback as boolean}
      fallbackMessage={node.props.fallbackMessage as string}
      showLoginButton={node.props.showLoginButton as boolean}
      loginUrl={node.props.loginUrl as string}
      loginButtonText={node.props.loginButtonText as string}
      hideCompletely={node.props.hideCompletely as boolean}
    >
      {children}
    </ProtectedContentRuntime>
  ),

  // Data components (placeholders)
  CollectionList: (node, children) => (
    <div className={cn('space-y-4', mapStyleToClasses(node.style))}>
      {children || <p className="text-muted-foreground">No items to display</p>}
    </div>
  ),

  RecordFieldText: (node, _children, context) => {
    const field = (node.props.field as string) || '';
    const fallback = (node.props.fallback as string) || '';
    const value = context.currentRecord?.[field];

    return (
      <span className={mapStyleToClasses(node.style)}>
        {String(value ?? fallback)}
      </span>
    );
  },

  // ==========================================================================
  // BLOG PLUGIN COMPONENTS
  // ==========================================================================

  PostList: (node, children) => {
    const layout = (node.props.layout as string) || 'list';
    const columns = (node.props.columns as number) || 3;
    const gridClass = layout === 'grid' ? `grid grid-cols-1 md:grid-cols-${columns} gap-6` : 'space-y-6';
    return (
      <div className={cn(gridClass, mapStyleToClasses(node.style))} style={extractInlineStyles(node.style)}>
        {children || <p className="text-muted-foreground">Keine Beiträge vorhanden.</p>}
      </div>
    );
  },

  PostCard: (node, _children, context) => {
    const record = context.currentRecord || {};
    const showExcerpt = node.props.showExcerpt !== false;
    const showDate = node.props.showDate !== false;
    const showImage = node.props.showImage !== false;
    const imagePosition = (node.props.imagePosition as string) || 'top';
    const isHorizontal = imagePosition === 'left' || imagePosition === 'right';

    return (
      <article
        className={cn(
          'rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden',
          isHorizontal ? 'flex' : '',
          imagePosition === 'right' ? 'flex-row-reverse' : '',
          mapStyleToClasses(node.style),
        )}
        style={extractInlineStyles(node.style)}
      >
        {showImage && record.featuredImage && (
          <div className={cn(isHorizontal ? 'w-1/3 flex-shrink-0' : '')}>
            <img
              src={String(record.featuredImage)}
              alt={String(record.title || '')}
              className="w-full h-48 object-cover"
            />
          </div>
        )}
        <div className="p-4 flex-1">
          <h3 className="text-lg font-semibold mb-1">
            {record.slug ? (
              <a href={`/blog/${record.slug}`} className="hover:underline">{String(record.title || 'Untitled')}</a>
            ) : (
              String(record.title || 'Untitled')
            )}
          </h3>
          {showDate && record.publishedAt && (
            <time className="text-sm text-muted-foreground" dateTime={String(record.publishedAt)}>
              {new Date(String(record.publishedAt)).toLocaleDateString('de-DE')}
            </time>
          )}
          {showExcerpt && record.excerpt && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{String(record.excerpt)}</p>
          )}
        </div>
      </article>
    );
  },

  PostContent: (node, _children, context) => {
    const record = context.currentRecord || {};
    const showTitle = node.props.showTitle !== false;
    const showDate = node.props.showDate !== false;
    const showAuthor = node.props.showAuthor === true;
    const showImage = node.props.showImage !== false;

    return (
      <article className={cn('prose prose-lg max-w-none', mapStyleToClasses(node.style))} style={extractInlineStyles(node.style)}>
        {showImage && record.featuredImage && (
          <img src={String(record.featuredImage)} alt={String(record.title || '')} className="w-full rounded-lg mb-6" />
        )}
        {showTitle && <h1>{String(record.title || 'Untitled')}</h1>}
        <div className="flex gap-4 text-sm text-muted-foreground mb-6">
          {showDate && record.publishedAt && (
            <time dateTime={String(record.publishedAt)}>
              {new Date(String(record.publishedAt)).toLocaleDateString('de-DE')}
            </time>
          )}
          {showAuthor && record.author && <span>von {String(record.author)}</span>}
        </div>
        {record.content ? (
          <div dangerouslySetInnerHTML={{ __html: String(record.content) }} />
        ) : (
          <p className="text-muted-foreground">Kein Inhalt vorhanden.</p>
        )}
      </article>
    );
  },

  PostMeta: (node, _children, context) => {
    const record = context.currentRecord || {};
    const showDate = node.props.showDate !== false;
    const showAuthor = node.props.showAuthor !== false;
    const showCategory = node.props.showCategory === true;
    const showReadTime = node.props.showReadTime === true;

    return (
      <div className={cn('flex flex-wrap gap-3 text-sm text-muted-foreground', mapStyleToClasses(node.style))} style={extractInlineStyles(node.style)}>
        {showDate && record.publishedAt && (
          <time dateTime={String(record.publishedAt)}>
            {new Date(String(record.publishedAt)).toLocaleDateString('de-DE')}
          </time>
        )}
        {showAuthor && record.author && <span>von {String(record.author)}</span>}
        {showCategory && record.category && (
          <span className="px-2 py-0.5 bg-muted rounded-full text-xs">{String(record.category)}</span>
        )}
        {showReadTime && record.content && (
          <span>{Math.max(1, Math.ceil(String(record.content).split(/\s+/).length / 200))} Min. Lesezeit</span>
        )}
      </div>
    );
  },

  // ==========================================================================
  // SHOP PLUGIN COMPONENTS
  // ==========================================================================

  ProductList: (node, children) => {
    const layout = (node.props.layout as string) || 'grid';
    const columns = (node.props.columns as number) || 4;
    const gridClass = layout === 'grid' ? `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns} gap-6` : 'space-y-4';
    return (
      <div className={cn(gridClass, mapStyleToClasses(node.style))} style={extractInlineStyles(node.style)}>
        {children || <p className="text-muted-foreground">Keine Produkte vorhanden.</p>}
      </div>
    );
  },

  ProductCard: (node, _children, context) => {
    // Support both: direct props (from template) and context.currentRecord (from data binding)
    const record = context.currentRecord || {};
    
    // Get values from props first (template-defined), fallback to record (data-bound)
    const name = (node.props.productName as string) || record.name || 'Produkt';
    const price = (node.props.productPrice as number) ?? record.price;
    const comparePrice = (node.props.productComparePrice as number) ?? record.compareAtPrice;
    const image = (node.props.productImage as string) || (Array.isArray(record.images) ? record.images[0] : null);
    const badge = (node.props.productBadge as string) || '';
    const slug = record.slug || '';
    const description = record.description || '';
    
    const showPrice = node.props.showPrice !== false;
    const showAddToCart = node.props.showAddToCart !== false;
    const showDescription = node.props.showDescription === true;
    const showBadge = node.props.showBadge === true && badge;
    const imageAspect = (node.props.imageAspect as string) || 'square';
    const aspectClass = imageAspect === '16:9' ? 'aspect-video' : imageAspect === '4:3' ? 'aspect-[4/3]' : 'aspect-square';

    return (
      <div className={cn('group rounded-lg border bg-card shadow-sm overflow-hidden', mapStyleToClasses(node.style))} style={extractInlineStyles(node.style)}>
        <div className={cn(aspectClass, 'overflow-hidden bg-muted relative')}>
          {image ? (
            <img src={image} alt={String(name)} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          )}
          {showBadge && (
            <span className="absolute top-2 left-2 px-2 py-1 text-xs font-bold rounded bg-red-500 text-white">
              {badge}
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-sm mb-1">
            {slug ? (
              <a href={`/products/${slug}`} className="hover:underline">{String(name)}</a>
            ) : (
              String(name)
            )}
          </h3>
          {showDescription && description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{String(description)}</p>
          )}
          {showPrice && price !== undefined && (
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold">
                {typeof price === 'number' ? `€${price.toFixed(2)}` : '—'}
              </span>
              {comparePrice && typeof comparePrice === 'number' && (
                <span className="text-sm text-muted-foreground line-through">€{comparePrice.toFixed(2)}</span>
              )}
            </div>
          )}
          {showAddToCart && (
            <button className="w-full px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
              In den Warenkorb
            </button>
          )}
        </div>
      </div>
    );
  },

  ProductDetail: (node, _children, context) => {
    const record = context.currentRecord || {};
    const showGallery = node.props.showGallery !== false;
    const showDescription = node.props.showDescription !== false;
    const showSku = node.props.showSku === true;
    const showInventory = node.props.showInventory === true;

    const images = Array.isArray(record.images) ? record.images : [];

    return (
      <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-8', mapStyleToClasses(node.style))} style={extractInlineStyles(node.style)}>
        {showGallery && (
          <div className="space-y-2">
            {images.length > 0 ? (
              <>
                <img src={String(images[0])} alt={String(record.name || '')} className="w-full rounded-lg" />
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {images.slice(1, 5).map((img: unknown, i: number) => (
                      <img key={i} src={String(img)} alt="" className="w-full aspect-square object-cover rounded" />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center text-muted-foreground">Kein Bild</div>
            )}
          </div>
        )}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{String(record.name || 'Produkt')}</h1>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold">
              {typeof record.price === 'number' ? `€${record.price.toFixed(2)}` : '—'}
            </span>
            {record.compareAtPrice && typeof record.compareAtPrice === 'number' && (
              <span className="text-lg text-muted-foreground line-through">€{record.compareAtPrice.toFixed(2)}</span>
            )}
          </div>
          {showDescription && record.description && (
            <div className="prose prose-sm" dangerouslySetInnerHTML={{ __html: String(record.description) }} />
          )}
          {showSku && record.sku && <p className="text-sm text-muted-foreground">SKU: {String(record.sku)}</p>}
          {showInventory && typeof record.inventory === 'number' && (
            <p className={cn('text-sm', record.inventory > 0 ? 'text-green-600' : 'text-red-600')}>
              {record.inventory > 0 ? `${record.inventory} auf Lager` : 'Nicht auf Lager'}
            </p>
          )}
          <button className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-medium">
            In den Warenkorb
          </button>
        </div>
      </div>
    );
  },

  AddToCartButton: (node, _children, context) => {
    const text = (node.props.text as string) || 'In den Warenkorb';
    const variant = (node.props.variant as string) || 'primary';
    const fullWidth = node.props.fullWidth === true;
    
    // Get productId from props or from current record context
    const productId = (node.props.productId as string) || context.currentRecord?.id as string || '';

    const variantClasses: Record<string, string> = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    };

    // If there's an onClick action configured, use it; otherwise create addToCart action
    const hasAction = node.actions?.some((a: any) => a.event === 'onClick' || a.event === 'click');
    const onClick = hasAction 
      ? buildClickHandler(node)
      : (e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          if (!productId) {
            console.warn('AddToCartButton: No productId');
            return;
          }
          // Get workspace slug from URL
          const pathParts = window.location.pathname.split('/');
          const sIndex = pathParts.indexOf('s');
          const slug = sIndex >= 0 && pathParts[sIndex + 1] ? pathParts[sIndex + 1] : '';
          
          fetch(`/api/runtime/workspaces/${slug}/cart`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ productId, quantity: 1 }),
          })
            .then((res) => res.json())
            .then((data) => {
              document.dispatchEvent(new CustomEvent('builderly:cartUpdated', { detail: data.cart }));
              document.dispatchEvent(new CustomEvent('builderly:toast', { 
                detail: { type: data.success ? 'success' : 'error', message: data.message || data.error }
              }));
            })
            .catch(() => {
              document.dispatchEvent(new CustomEvent('builderly:toast', { 
                detail: { type: 'error', message: 'Fehler beim Hinzufügen.' }
              }));
            });
        };

    return (
      <button
        data-node-id={node.id}
        className={cn(
          'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors',
          variantClasses[variant] || variantClasses.primary,
          fullWidth && 'w-full',
          mapStyleToClasses(node.style),
        )}
        style={extractInlineStyles(node.style)}
        onClick={onClick}
      >
        {text}
      </button>
    );
  },

  CartSummary: (node) => {
    const showCheckoutButton = node.props.showCheckoutButton !== false;
    return (
      <div className={cn('rounded-lg border bg-card p-6 space-y-4', mapStyleToClasses(node.style))} style={extractInlineStyles(node.style)}>
        <h3 className="font-semibold text-lg">Warenkorb</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span>Zwischensumme</span><span>€0,00</span></div>
          {!!node.props.showTax && <div className="flex justify-between"><span>MwSt.</span><span>€0,00</span></div>}
          {!!node.props.showShipping && <div className="flex justify-between"><span>Versand</span><span>€0,00</span></div>}
          <div className="border-t pt-2 flex justify-between font-bold"><span>Gesamt</span><span>€0,00</span></div>
        </div>
        {showCheckoutButton && (
          <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-medium" onClick={buildClickHandler(node)}>
            Zur Kasse
          </button>
        )}
      </div>
    );
  },

  CartItems: (node) => {
    return (
      <div className={cn('space-y-4', mapStyleToClasses(node.style))} style={extractInlineStyles(node.style)}>
        <p className="text-muted-foreground text-center py-8">Dein Warenkorb ist leer.</p>
      </div>
    );
  },

  CheckoutButton: (node) => {
    const text = (node.props.text as string) || 'Zur Kasse';
    const variant = (node.props.variant as string) || 'primary';
    const fullWidth = node.props.fullWidth === true;

    const variantClasses: Record<string, string> = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    };

    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md px-6 py-2 text-sm font-medium transition-colors',
          variantClasses[variant] || variantClasses.primary,
          fullWidth && 'w-full',
          mapStyleToClasses(node.style),
        )}
        style={extractInlineStyles(node.style)}
        onClick={buildClickHandler(node)}
      >
        {text}
      </button>
    );
  },

  PriceDisplay: (node, _children, context) => {
    const record = context.currentRecord || {};
    const showCurrency = node.props.showCurrency !== false;
    const showOriginalPrice = node.props.showOriginalPrice === true;
    const size = (node.props.size as string) || 'md';

    const sizeClasses: Record<string, string> = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-2xl',
    };

    const currency = showCurrency ? '€' : '';

    return (
      <span className={cn('inline-flex items-center gap-2 font-bold', sizeClasses[size], mapStyleToClasses(node.style))} style={extractInlineStyles(node.style)}>
        <span>{typeof record.price === 'number' ? `${currency}${record.price.toFixed(2)}` : '—'}</span>
        {showOriginalPrice && record.compareAtPrice && typeof record.compareAtPrice === 'number' && (
          <span className="text-muted-foreground line-through font-normal text-sm">
            {currency}{record.compareAtPrice.toFixed(2)}
          </span>
        )}
      </span>
    );
  },

  // ==========================================================================
  // FORUM PLUGIN COMPONENTS
  // ==========================================================================

  ForumCategoryList: (node, _children, context) => {
    const showDescription = node.props.showDescription !== false;
    const showThreadCount = node.props.showThreadCount !== false;
    const layout = (node.props.layout as string) || 'list';

    // Placeholder when no data bound
    return (
      <div
        className={cn(
          layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-3',
          mapStyleToClasses(node.style),
        )}
        style={extractInlineStyles(node.style)}
      >
        <div className="rounded-lg border bg-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Allgemein</h3>
            {showDescription && <p className="text-sm text-muted-foreground">Allgemeine Diskussionen</p>}
          </div>
          {showThreadCount && <span className="text-sm text-muted-foreground">0 Themen</span>}
        </div>
      </div>
    );
  },

  ThreadList: (node, children) => {
    return (
      <div className={cn('space-y-2', mapStyleToClasses(node.style))} style={extractInlineStyles(node.style)}>
        {children || <p className="text-muted-foreground text-center py-8">Keine Themen vorhanden.</p>}
      </div>
    );
  },

  ThreadCard: (node, _children, context) => {
    const record = context.currentRecord || {};
    const showAuthor = node.props.showAuthor !== false;
    const showDate = node.props.showDate !== false;
    const showReplyCount = node.props.showReplyCount !== false;

    return (
      <div className={cn('rounded-lg border bg-card p-4 hover:bg-accent/50 transition-colors', mapStyleToClasses(node.style))} style={extractInlineStyles(node.style)}>
        <div className="flex items-start gap-3">
          {record.isPinned && (
            <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full font-medium">Angepinnt</span>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">
              {record.slug ? (
                <a href={`/forum/${record.slug}`} className="hover:underline">{String(record.title || 'Unbenannt')}</a>
              ) : (
                String(record.title || 'Unbenannt')
              )}
            </h3>
            <div className="flex gap-3 text-xs text-muted-foreground mt-1">
              {showAuthor && record.authorEmail && <span>{String(record.authorEmail)}</span>}
              {showDate && record.createdAt && (
                <time dateTime={String(record.createdAt)}>
                  {new Date(String(record.createdAt)).toLocaleDateString('de-DE')}
                </time>
              )}
              {showReplyCount && <span>{Number(record.replyCount || 0)} Antworten</span>}
            </div>
          </div>
        </div>
      </div>
    );
  },

  ThreadDetail: (node, children) => {
    const showReplyForm = node.props.showReplyForm !== false;
    return (
      <div className={cn('space-y-6', mapStyleToClasses(node.style))} style={extractInlineStyles(node.style)}>
        <div className="space-y-4">{children}</div>
        {showReplyForm && (
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-3">Antworten</h3>
            <textarea
              className="w-full rounded-md border bg-background p-3 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Schreibe eine Antwort..."
            />
            <button className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90">
              Antwort senden
            </button>
          </div>
        )}
      </div>
    );
  },

  ForumPost: (node, _children, context) => {
    const record = context.currentRecord || {};
    const showAuthor = node.props.showAuthor !== false;
    const showDate = node.props.showDate !== false;

    return (
      <div className={cn('rounded-lg border bg-card p-4', mapStyleToClasses(node.style))} style={extractInlineStyles(node.style)}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
            {String(record.authorEmail || 'A').charAt(0).toUpperCase()}
          </div>
          <div>
            {showAuthor && <span className="font-medium text-sm">{String(record.authorEmail || 'Anonym')}</span>}
            {showDate && record.createdAt && (
              <time className="block text-xs text-muted-foreground" dateTime={String(record.createdAt)}>
                {new Date(String(record.createdAt)).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </time>
            )}
          </div>
        </div>
        {record.content ? (
          <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: String(record.content) }} />
        ) : (
          <p className="text-muted-foreground text-sm">Kein Inhalt.</p>
        )}
      </div>
    );
  },

  NewThreadForm: (node) => {
    return (
      <form className={cn('space-y-4 rounded-lg border bg-card p-6', mapStyleToClasses(node.style))} style={extractInlineStyles(node.style)} onSubmit={(e) => e.preventDefault()}>
        <h3 className="font-semibold text-lg">Neues Thema erstellen</h3>
        <div>
          <label className="block text-sm font-medium mb-1">Titel</label>
          <input type="text" className="w-full rounded-md border bg-background p-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Titel des Themas" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Inhalt</label>
          <textarea className="w-full rounded-md border bg-background p-2 text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Beschreibe dein Thema..." />
        </div>
        <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90">
          Thema erstellen
        </button>
      </form>
    );
  },

  ReplyForm: (node) => {
    const placeholder = (node.props.placeholder as string) || 'Schreibe deine Antwort...';
    const submitText = (node.props.submitText as string) || 'Antwort senden';
    return (
      <form className={cn('space-y-3', mapStyleToClasses(node.style))} style={extractInlineStyles(node.style)} onSubmit={(e) => e.preventDefault()}>
        <textarea
          className="w-full rounded-md border bg-background p-3 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder={placeholder}
        />
        <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90">
          {submitText}
        </button>
      </form>
    );
  },

  // ==========================================================================
  // COMMERCE COMPONENTS
  // ==========================================================================

  WishlistButton: (node) => (
    <WishlistButton
      productId={node.props.productId as string}
      variant={node.props.variant as 'icon' | 'button' | 'text'}
      size={node.props.size as 'sm' | 'md' | 'lg'}
      addText={node.props.addText as string}
      removeText={node.props.removeText as string}
      showCount={node.props.showCount as boolean}
    />
  ),

  WishlistDisplay: (node) => (
    <WishlistDisplay
      layout={node.props.layout as 'grid' | 'list'}
      columns={node.props.columns as number}
      showRemoveButton={node.props.showRemoveButton as boolean}
      showAddToCart={node.props.showAddToCart as boolean}
      emptyText={node.props.emptyText as string}
    />
  ),

  ProductReviews: (node) => (
    <ProductReviews
      productId={node.props.productId as string}
      showSummary={node.props.showSummary as boolean}
      showWriteReview={node.props.showWriteReview as boolean}
      showAvatar={node.props.showAvatar as boolean}
      sortBy={node.props.sortBy as 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful'}
      limit={node.props.limit as number}
      emptyText={node.props.emptyText as string}
      writeReviewText={node.props.writeReviewText as string}
    />
  ),

  ReviewForm: (node) => (
    <ReviewForm
      productId={node.props.productId as string}
      onClose={() => {}}
      onSubmit={() => {}}
      showRating={node.props.showRating as boolean}
      showTitle={node.props.showTitle as boolean}
      showContent={node.props.showContent as boolean}
      submitText={node.props.submitText as string}
      titlePlaceholder={node.props.titlePlaceholder as string}
      contentPlaceholder={node.props.contentPlaceholder as string}
      successMessage={node.props.successMessage as string}
    />
  ),

  CategoryFilter: (node) => (
    <CategoryFilter
      categories={node.props.categories as Array<{ id: string; name: string; slug: string; count?: number }>}
      layout={node.props.layout as 'horizontal' | 'vertical' | 'dropdown'}
      showCount={node.props.showCount as boolean}
      showAllOption={node.props.showAllOption as boolean}
      allText={node.props.allText as string}
      showIcons={node.props.showIcons as boolean}
      multiSelect={node.props.multiSelect as boolean}
    />
  ),

  ProductVariantSelector: (node) => (
    <ProductVariantSelector
      options={node.props.options as Array<{ value: string; label: string; inStock?: boolean; priceModifier?: number }>}
      label={node.props.label as string}
      layout={node.props.layout as 'buttons' | 'dropdown' | 'swatches'}
      showLabel={node.props.showLabel as boolean}
      showStock={node.props.showStock as boolean}
      showPrice={node.props.showPrice as boolean}
      outOfStockBehavior={node.props.outOfStockBehavior as 'disable' | 'hide' | 'show'}
    />
  ),

  ColorSwatch: (node) => (
    <ColorSwatch
      colors={node.props.colors as Array<{ value: string; label: string; hex?: string; inStock?: boolean }>}
      size={node.props.size as 'sm' | 'md' | 'lg'}
      shape={node.props.shape as 'circle' | 'square' | 'rounded'}
      showLabel={node.props.showLabel as boolean}
      showSelected={node.props.showSelected as boolean}
    />
  ),

  SizeSelector: (node) => (
    <SizeSelector
      sizes={node.props.sizes as Array<{ value: string; label: string; inStock?: boolean }>}
      layout={node.props.layout as 'buttons' | 'dropdown'}
      showSizeGuide={node.props.showSizeGuide as boolean}
      sizeGuideText={node.props.sizeGuideText as string}
      sizeGuideUrl={node.props.sizeGuideUrl as string}
      showStock={node.props.showStock as boolean}
    />
  ),

  StockIndicator: (node) => (
    <StockIndicator
      stock={node.props.stock as number}
      showExactCount={node.props.showExactCount as boolean}
      lowStockThreshold={node.props.lowStockThreshold as number}
      inStockText={node.props.inStockText as string}
      lowStockText={node.props.lowStockText as string}
      outOfStockText={node.props.outOfStockText as string}
      showIcon={node.props.showIcon as boolean}
    />
  ),

  CheckoutForm: (node) => (
    <CheckoutForm
      showBillingAddress={node.props.showBillingAddress as boolean}
      showShippingAddress={node.props.showShippingAddress as boolean}
      showPaymentMethods={node.props.showPaymentMethods as boolean}
      showOrderSummary={node.props.showOrderSummary as boolean}
      showCouponField={node.props.showCouponField as boolean}
      showTermsCheckbox={node.props.showTermsCheckbox as boolean}
      submitText={node.props.submitText as string}
      termsText={node.props.termsText as string}
      termsLinkUrl={node.props.termsLinkUrl as string}
      guestCheckout={node.props.guestCheckout as boolean}
    />
  ),

  AddressForm: (node) => (
    <AddressForm
      type={node.props.type as 'billing' | 'shipping'}
      showCompanyField={node.props.showCompanyField as boolean}
      showPhoneField={node.props.showPhoneField as boolean}
      countries={node.props.countries as string[]}
      defaultCountry={node.props.defaultCountry as string}
    />
  ),

  // ==========================================================================
  // UI COMPONENTS
  // ==========================================================================

  SearchBox: (node) => (
    <SearchBox
      placeholder={node.props.placeholder as string}
      showIcon={node.props.showIcon as boolean}
      showClearButton={node.props.showClearButton as boolean}
      autoComplete={node.props.autoComplete as boolean}
      showRecentSearches={node.props.showRecentSearches as boolean}
      instantSearch={node.props.instantSearch as boolean}
      debounceMs={node.props.debounceMs as number}
      minChars={node.props.minChars as number}
      maxResults={node.props.maxResults as number}
      searchEndpoint={node.props.searchEndpoint as string}
    />
  ),

  SearchResults: (node) => (
    <SearchResults
      query={node.props.query as string}
      results={node.props.results as Array<{ id: string; title: string; description?: string; url: string; image?: string; price?: number }>}
      layout={node.props.layout as 'grid' | 'list'}
      columns={node.props.columns as number}
      showFilters={node.props.showFilters as boolean}
      showSort={node.props.showSort as boolean}
      noResultsText={node.props.noResultsText as string}
      searchingText={node.props.searchingText as string}
    />
  ),

  CookieBanner: (node) => (
    <CookieBanner
      title={node.props.title as string}
      description={node.props.description as string}
      acceptText={node.props.acceptText as string}
      declineText={node.props.declineText as string}
      settingsText={node.props.settingsText as string}
      position={node.props.position as 'bottom' | 'top' | 'center'}
      showDecline={node.props.showDecline as boolean}
      showSettings={node.props.showSettings as boolean}
      privacyUrl={node.props.privacyUrl as string}
      privacyText={node.props.privacyText as string}
    />
  ),
};

// ============================================================================
// SAFE RENDERER COMPONENT
// ============================================================================

interface SafeRendererProps {
  tree: BuilderTree;
  context?: RenderContext;
}

/**
 * Collects all mobile CSS rules from a tree recursively
 */
function collectMobileCSS(node: BuilderNode): string[] {
  const rules: string[] = [];
  
  // Generate mobile CSS for this node
  if (node.style) {
    const css = generateMobileCSS(node.id, node.style);
    if (css) rules.push(css);
  }
  
  // Recurse into children
  if (node.children && node.children.length > 0) {
    for (const child of node.children) {
      rules.push(...collectMobileCSS(child));
    }
  }
  
  return rules;
}

export function SafeRenderer({ tree, context = {} }: SafeRendererProps) {
  // Collect mobile CSS rules for all nodes
  const mobileCSSRules = useMemo(() => collectMobileCSS(tree.root), [tree.root]);
  const mobileCSS = mobileCSSRules.length > 0 
    ? `@media (max-width: 767px) { ${mobileCSSRules.join(' ')} }`
    : '';
  
  return (
    <>
      {mobileCSS && <style dangerouslySetInnerHTML={{ __html: mobileCSS }} />}
      <NodeRenderer node={tree.root} context={context} />
    </>
  );
}

interface NodeRendererProps {
  node: BuilderNode;
  context: RenderContext;
}

function NodeRenderer({ node, context }: NodeRendererProps) {
  const renderer = COMPONENT_RENDERERS[node.type];

  // Render children first
  const children = node.children.length > 0 ? (
    <>
      {node.children.map((child) => (
        <NodeRenderer key={child.id} node={child} context={context} />
      ))}
    </>
  ) : null;

  // If we have a registered renderer, use it
  if (renderer) {
    const content = renderer(node, children, context);
    
    // Wrap with animation if present
    if (node.animation && node.animation.type !== 'none') {
      return (
        <RuntimeAnimationWrapper animation={node.animation}>
          {content}
        </RuntimeAnimationWrapper>
      );
    }
    
    return <>{content}</>;
  }

  // Unknown component type - render a placeholder in dev, nothing in prod
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="border-2 border-dashed border-yellow-500 p-4 rounded bg-yellow-50">
        <p className="text-yellow-700 text-sm">
          Unknown component: <code>{node.type}</code>
        </p>
        {children}
      </div>
    );
  }

  // In production, just render children without the unknown wrapper
  return <>{children}</>;
}

export default SafeRenderer;

// ============================================================================
// AUTH GATE RUNTIME HELPER
// ============================================================================

function AuthGateRuntime({ showWhen, children }: { showWhen: 'authenticated' | 'unauthenticated'; children: React.ReactNode }) {
  // Use a dynamic import pattern to access site auth context
  // This component checks site visitor auth state
  const [visible, setVisible] = React.useState(showWhen === 'unauthenticated');
  const [checked, setChecked] = React.useState(false);

  React.useEffect(() => {
    // Check for any site_session cookie
    const cookies = document.cookie.split(';').map(c => c.trim());
    const hasSession = cookies.some(c => c.startsWith('site_session_'));
    
    if (showWhen === 'authenticated') {
      setVisible(hasSession);
    } else {
      setVisible(!hasSession);
    }
    setChecked(true);
  }, [showWhen]);

  if (!checked) return null;
  if (!visible) return null;
  return <>{children}</>;
}
