import React from 'react';
import type { BuilderNode, BuilderStyle } from '@builderly/core';
import { componentRegistry } from '@builderly/core';
import { useEditorStore } from '../store/editor-store';
import { cn } from '@builderly/ui';

interface CanvasNodeProps {
  node: BuilderNode;
  isRoot?: boolean;
}

export function CanvasNode({ node, isRoot }: CanvasNodeProps) {
  const {
    selectedNodeId,
    hoveredNodeId,
    isPreviewMode,
    selectNode,
    hoverNode,
  } = useEditorStore();

  const isSelected = selectedNodeId === node.id;
  const isHovered = hoveredNodeId === node.id && !isSelected;
  const definition = componentRegistry.get(node.type);

  const handleClick = (e: React.MouseEvent) => {
    if (isPreviewMode) return;
    e.stopPropagation();
    selectNode(node.id);
  };

  const handleMouseEnter = () => {
    if (isPreviewMode) return;
    hoverNode(node.id);
  };

  const handleMouseLeave = () => {
    if (isPreviewMode) return;
    hoverNode(null);
  };

  // Convert styles to classes
  const styleClasses = mapStyleToClasses(node.style);

  // Render children
  const children = node.children.map((child) => (
    <CanvasNode key={child.id} node={child} />
  ));

  // Render based on component type
  const content = renderComponent(node, children, definition);

  if (isPreviewMode) {
    return <>{content}</>;
  }

  return (
    <div
      className={cn(
        'relative',
        !isRoot && 'min-h-[20px]',
        isSelected && 'ring-2 ring-primary ring-offset-1',
        isHovered && !isSelected && 'ring-2 ring-primary/50 ring-offset-1'
      )}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-node-id={node.id}
      data-node-type={node.type}
    >
      {/* Selection label */}
      {isSelected && !isRoot && (
        <div className="absolute -top-6 left-0 z-10 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded">
          {definition?.displayName || node.type}
        </div>
      )}
      {content}
    </div>
  );
}

// Render component based on type
function renderComponent(
  node: BuilderNode,
  children: React.ReactNode,
  definition: ReturnType<typeof componentRegistry.get>
): React.ReactNode {
  const styleClasses = mapStyleToClasses(node.style);

  switch (node.type) {
    case 'Section':
      return (
        <section className={cn('w-full', styleClasses)}>
          {children}
        </section>
      );

    case 'Container':
      const maxWidth = (node.props.maxWidth as string) || 'lg';
      return (
        <div className={cn('mx-auto w-full', `max-w-${maxWidth}`, styleClasses)}>
          {children}
        </div>
      );

    case 'Stack':
      const direction = (node.props.direction as string) || 'column';
      const gap = (node.props.gap as string) || 'md';
      const dirClass = direction === 'row' ? 'flex-row' : 'flex-col';
      return (
        <div className={cn('flex', dirClass, `gap-${mapSpacing(gap)}`, styleClasses)}>
          {children}
        </div>
      );

    case 'Grid':
      const columns = (node.props.columns as number) || 3;
      const gridGap = (node.props.gap as string) || 'md';
      return (
        <div className={cn(
          'grid',
          `grid-cols-${Math.min(columns, 6)}`,
          `gap-${mapSpacing(gridGap)}`,
          styleClasses
        )}>
          {children}
        </div>
      );

    case 'Text':
      return (
        <p className={cn('text-base', styleClasses)}>
          {(node.props.text as string) || 'Enter text...'}
        </p>
      );

    case 'Heading':
      const level = (node.props.level as number) || 2;
      const text = (node.props.text as string) || 'Heading';
      const Tag = `h${level}` as keyof JSX.IntrinsicElements;
      const sizeMap: Record<number, string> = {
        1: 'text-4xl font-bold',
        2: 'text-3xl font-bold',
        3: 'text-2xl font-semibold',
        4: 'text-xl font-semibold',
        5: 'text-lg font-medium',
        6: 'text-base font-medium',
      };
      return <Tag className={cn(sizeMap[level], styleClasses)}>{text}</Tag>;

    case 'Button':
      const btnText = (node.props.text as string) || 'Button';
      const variant = (node.props.variant as string) || 'primary';
      const variantClasses: Record<string, string> = {
        primary: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        outline: 'border border-input bg-background',
        ghost: 'hover:bg-accent',
      };
      return (
        <button className={cn(
          'inline-flex items-center justify-center rounded-md h-10 px-4 font-medium',
          variantClasses[variant],
          styleClasses
        )}>
          {btnText}
        </button>
      );

    case 'Card':
      const title = (node.props.title as string) || '';
      const description = (node.props.description as string) || '';
      return (
        <div className={cn('rounded-lg border bg-card shadow-sm', styleClasses)}>
          {(title || description) && (
            <div className="p-6">
              {title && <h3 className="text-lg font-semibold">{title}</h3>}
              {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
            </div>
          )}
          {children && <div className="p-6 pt-0">{children}</div>}
        </div>
      );

    case 'Image':
      const src = (node.props.src as string) || 'https://placehold.co/600x400';
      const alt = (node.props.alt as string) || '';
      return (
        <img src={src} alt={alt} className={cn('max-w-full h-auto', styleClasses)} />
      );

    case 'Divider':
      return <hr className={cn('border-t border-border', styleClasses)} />;

    case 'Spacer':
      const size = (node.props.size as string) || 'md';
      const heightMap: Record<string, string> = {
        xs: 'h-2', sm: 'h-4', md: 'h-8', lg: 'h-12', xl: 'h-16',
      };
      return <div className={cn(heightMap[size] || 'h-8', styleClasses)} />;

    case 'Form':
      return (
        <form className={cn('space-y-4', styleClasses)} onSubmit={(e) => e.preventDefault()}>
          {children}
        </form>
      );

    case 'Input':
      const inputLabel = (node.props.label as string) || '';
      const placeholder = (node.props.placeholder as string) || '';
      return (
        <div className={cn('space-y-2', styleClasses)}>
          {inputLabel && <label className="text-sm font-medium">{inputLabel}</label>}
          <input
            type="text"
            placeholder={placeholder}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
      );

    case 'Link':
      const linkText = (node.props.text as string) || 'Link';
      return (
        <a className={cn('text-primary hover:underline', styleClasses)}>
          {linkText}
        </a>
      );

    case 'Badge':
      const badgeText = (node.props.text as string) || 'Badge';
      return (
        <span className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary text-primary-foreground',
          styleClasses
        )}>
          {badgeText}
        </span>
      );

    case 'Alert':
      const alertTitle = (node.props.title as string) || '';
      const alertDesc = (node.props.description as string) || '';
      return (
        <div className={cn('rounded-lg border p-4', styleClasses)}>
          {alertTitle && <h5 className="font-medium mb-1">{alertTitle}</h5>}
          {alertDesc && <p className="text-sm text-muted-foreground">{alertDesc}</p>}
        </div>
      );

    default:
      // Unknown component
      return (
        <div className={cn('p-4 border border-dashed border-yellow-500 rounded bg-yellow-50', styleClasses)}>
          <p className="text-yellow-700 text-sm">Unknown: {node.type}</p>
          {children}
        </div>
      );
  }
}

// Style mapping helpers
function mapStyleToClasses(style: BuilderStyle): string {
  const props = style.base;
  if (!props) return '';

  const classes: string[] = [];

  if (props.padding) classes.push(`p-${mapSpacing(props.padding)}`);
  if (props.paddingX) classes.push(`px-${mapSpacing(props.paddingX)}`);
  if (props.paddingY) classes.push(`py-${mapSpacing(props.paddingY)}`);
  if (props.margin) classes.push(`m-${mapSpacing(props.margin)}`);
  if (props.marginX) classes.push(`mx-${mapSpacing(props.marginX)}`);
  if (props.marginY) classes.push(`my-${mapSpacing(props.marginY)}`);
  if (props.marginTop) classes.push(`mt-${mapSpacing(props.marginTop)}`);
  if (props.marginBottom) classes.push(`mb-${mapSpacing(props.marginBottom)}`);
  if (props.gap) classes.push(`gap-${mapSpacing(props.gap)}`);
  if (props.backgroundColor) classes.push(`bg-${props.backgroundColor}`);
  if (props.color) classes.push(`text-${props.color}`);
  if (props.textAlign) classes.push(`text-${props.textAlign}`);
  if (props.borderRadius) classes.push(`rounded-${props.borderRadius}`);

  return classes.join(' ');
}

function mapSpacing(token: string): string {
  const map: Record<string, string> = {
    none: '0', xs: '1', sm: '2', md: '4', lg: '6', xl: '8', '2xl': '12', '3xl': '16',
  };
  return map[token] || '4';
}
