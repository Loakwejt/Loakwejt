'use client';

import React from 'react';
import type { BuilderNode, BuilderTree, BuilderStyle } from '@builderly/core';
import { componentRegistry } from '@builderly/core';
import { cn } from '@builderly/ui';

// ============================================================================
// STYLE MAPPING - Convert tokens to Tailwind classes
// ============================================================================

function mapStyleToClasses(style: BuilderStyle, breakpoint: 'base' | 'mobile' | 'tablet' | 'desktop' = 'base'): string {
  const props = style[breakpoint] || style.base;
  if (!props) return '';

  const classes: string[] = [];

  // Padding
  if (props.padding) classes.push(`p-${mapSpacing(props.padding)}`);
  if (props.paddingX) classes.push(`px-${mapSpacing(props.paddingX)}`);
  if (props.paddingY) classes.push(`py-${mapSpacing(props.paddingY)}`);
  if (props.paddingTop) classes.push(`pt-${mapSpacing(props.paddingTop)}`);
  if (props.paddingBottom) classes.push(`pb-${mapSpacing(props.paddingBottom)}`);
  if (props.paddingLeft) classes.push(`pl-${mapSpacing(props.paddingLeft)}`);
  if (props.paddingRight) classes.push(`pr-${mapSpacing(props.paddingRight)}`);

  // Margin
  if (props.margin) classes.push(`m-${mapSpacing(props.margin)}`);
  if (props.marginX) classes.push(`mx-${mapSpacing(props.marginX)}`);
  if (props.marginY) classes.push(`my-${mapSpacing(props.marginY)}`);
  if (props.marginTop) classes.push(`mt-${mapSpacing(props.marginTop)}`);
  if (props.marginBottom) classes.push(`mb-${mapSpacing(props.marginBottom)}`);

  // Gap
  if (props.gap) classes.push(`gap-${mapSpacing(props.gap)}`);

  // Background & Text colors
  if (props.backgroundColor) classes.push(`bg-${props.backgroundColor}`);
  if (props.color) classes.push(`text-${props.color}`);

  // Text
  if (props.textAlign) classes.push(`text-${props.textAlign}`);
  if (props.fontSize) classes.push(`text-${props.fontSize}`);
  if (props.fontWeight) classes.push(`font-${props.fontWeight}`);

  // Flex
  if (props.flexDirection) {
    const dirMap: Record<string, string> = {
      row: 'flex-row',
      column: 'flex-col',
      'row-reverse': 'flex-row-reverse',
      'column-reverse': 'flex-col-reverse',
    };
    classes.push(dirMap[props.flexDirection] || '');
  }
  if (props.alignItems) {
    const alignMap: Record<string, string> = {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline',
    };
    classes.push(alignMap[props.alignItems] || '');
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
    classes.push(justifyMap[props.justifyContent] || '');
  }

  // Border
  if (props.borderRadius) classes.push(`rounded-${props.borderRadius}`);
  if (props.shadow) classes.push(`shadow-${props.shadow}`);

  // Max width
  if (props.maxWidth) classes.push(`max-w-${props.maxWidth}`);

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
// COMPONENT RENDERERS - Whitelist-based safe rendering
// ============================================================================

interface RenderContext {
  siteId?: string;
  pageId?: string;
  currentRecord?: Record<string, unknown>;
  user?: {
    id: string;
    email?: string | null;
    name?: string | null;
  } | null;
}

type ComponentRenderer = (
  node: BuilderNode,
  children: React.ReactNode,
  context: RenderContext
) => React.ReactNode;

const COMPONENT_RENDERERS: Record<string, ComponentRenderer> = {
  // Layout
  Section: (node, children) => (
    <section className={cn('w-full', mapStyleToClasses(node.style))}>
      {children}
    </section>
  ),

  Container: (node, children) => {
    const maxWidth = (node.props.maxWidth as string) || 'lg';
    return (
      <div className={cn('mx-auto w-full', `max-w-${maxWidth}`, mapStyleToClasses(node.style))}>
        {children}
      </div>
    );
  },

  Stack: (node, children) => {
    const direction = (node.props.direction as string) || 'column';
    const gap = (node.props.gap as string) || 'md';
    const align = (node.props.align as string) || 'stretch';
    const justify = (node.props.justify as string) || 'start';

    const dirClass = direction === 'row' ? 'flex-row' : 'flex-col';
    const alignMap: Record<string, string> = {
      start: 'items-start', center: 'items-center', end: 'items-end', 
      stretch: 'items-stretch', baseline: 'items-baseline',
    };
    const justifyMap: Record<string, string> = {
      start: 'justify-start', center: 'justify-center', end: 'justify-end',
      between: 'justify-between', around: 'justify-around', evenly: 'justify-evenly',
    };

    return (
      <div className={cn(
        'flex',
        dirClass,
        `gap-${mapSpacing(gap)}`,
        alignMap[align],
        justifyMap[justify],
        mapStyleToClasses(node.style)
      )}>
        {children}
      </div>
    );
  },

  Grid: (node, children) => {
    const columns = (node.props.columns as number) || 3;
    const gap = (node.props.gap as string) || 'md';

    return (
      <div className={cn(
        'grid',
        `grid-cols-1 md:grid-cols-${Math.min(columns, 4)} lg:grid-cols-${columns}`,
        `gap-${mapSpacing(gap)}`,
        mapStyleToClasses(node.style)
      )}>
        {children}
      </div>
    );
  },

  Divider: (node) => (
    <hr className={cn('border-t border-border', mapStyleToClasses(node.style))} />
  ),

  Spacer: (node) => {
    const size = (node.props.size as string) || 'md';
    const heightMap: Record<string, string> = {
      xs: 'h-2', sm: 'h-4', md: 'h-8', lg: 'h-12', xl: 'h-16', '2xl': 'h-24', '3xl': 'h-32',
    };
    return <div className={cn(heightMap[size] || 'h-8', mapStyleToClasses(node.style))} />;
  },

  // Content
  Text: (node) => {
    const text = (node.props.text as string) || '';
    return (
      <p className={cn('text-base', mapStyleToClasses(node.style))}>
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
      <Tag className={cn(sizeMap[level] || sizeMap[2], mapStyleToClasses(node.style))}>
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
        src={src}
        alt={alt}
        className={cn('max-w-full h-auto', `object-${objectFit}`, mapStyleToClasses(node.style))}
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

    return (
      <button className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        variantClasses[variant] || variantClasses.primary,
        sizeClasses[size] || sizeClasses.md,
        mapStyleToClasses(node.style)
      )}>
        {text}
      </button>
    );
  },

  Card: (node, children) => {
    const title = (node.props.title as string) || '';
    const description = (node.props.description as string) || '';

    return (
      <div className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', mapStyleToClasses(node.style))}>
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
      <span className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        variantClasses[variant] || variantClasses.default,
        mapStyleToClasses(node.style)
      )}>
        {text}
      </span>
    );
  },

  Alert: (node) => {
    const title = (node.props.title as string) || '';
    const description = (node.props.description as string) || '';

    return (
      <div className={cn('rounded-lg border p-4', mapStyleToClasses(node.style))}>
        {title && <h5 className="font-medium mb-1">{title}</h5>}
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
    );
  },

  // Navigation
  Link: (node) => {
    const text = (node.props.text as string) || '';
    const href = (node.props.href as string) || '#';

    return (
      <a 
        href={href}
        className={cn('text-primary hover:underline', mapStyleToClasses(node.style))}
      >
        {text}
      </a>
    );
  },

  // Forms (read-only in runtime, but show structure)
  Form: (node, children) => (
    <form className={cn('space-y-4', mapStyleToClasses(node.style))} onSubmit={(e) => e.preventDefault()}>
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
  AuthGate: (node, children, context) => {
    const showWhen = (node.props.showWhen as string) || 'authenticated';
    const isAuthenticated = !!context.user;
    
    // Check if we should show content based on auth state
    const shouldShow = showWhen === 'authenticated' ? isAuthenticated : !isAuthenticated;
    
    if (!shouldShow) {
      return null;
    }
    
    return <>{children}</>;
  },

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
};

// ============================================================================
// SAFE RENDERER COMPONENT
// ============================================================================

interface SafeRendererProps {
  tree: BuilderTree;
  context?: RenderContext;
}

export function SafeRenderer({ tree, context = {} }: SafeRendererProps) {
  return <NodeRenderer node={tree.root} context={context} />;
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
    return <>{renderer(node, children, context)}</>;
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
