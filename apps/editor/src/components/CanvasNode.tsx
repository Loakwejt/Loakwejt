import React from 'react';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import type { BuilderNode, BuilderStyle } from '@builderly/core';
import { componentRegistry } from '@builderly/core';
import { useEditorStore } from '../store/editor-store';
import { useDndState } from './DndProvider';
import { cn } from '@builderly/ui';
import type { DragData } from './DndProvider';

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

  const { activeId, overId } = useDndState();
  const definition = componentRegistry.get(node.type);
  const canHaveChildren = definition?.canHaveChildren ?? false;

  const isSelected = selectedNodeId === node.id;
  const isHovered = hoveredNodeId === node.id && !isSelected;
  const isDropTarget = overId === node.id && activeId && (canHaveChildren || isRoot);

  // Make this node draggable (unless it's root)
  const { attributes, listeners, setNodeRef: setDragRef, isDragging } = useDraggable({
    id: `node-${node.id}`,
    data: {
      type: 'existing-node',
      nodeId: node.id,
    } as DragData,
    disabled: isRoot || isPreviewMode,
  });

  // Make container nodes droppable
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: node.id,
    data: {
      accepts: canHaveChildren || isRoot,
      nodeId: node.id,
    },
    disabled: !canHaveChildren && !isRoot,
  });

  // Combine refs
  const setRefs = (element: HTMLElement | null) => {
    setDragRef(element);
    setDropRef(element);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isPreviewMode) return;
    e.stopPropagation();
    selectNode(node.id);
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (isPreviewMode) return;
    e.stopPropagation();
    hoverNode(node.id);
  };

  const handleMouseLeave = () => {
    if (isPreviewMode) return;
    hoverNode(null);
  };

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
      ref={setRefs}
      className={cn(
        'relative group',
        !isRoot && 'min-h-[24px]',
        isSelected && 'outline outline-2 outline-primary outline-offset-1',
        isHovered && !isSelected && 'outline outline-2 outline-primary/50 outline-offset-1',
        isDragging && 'opacity-40',
        isDropTarget && 'bg-primary/5 outline-dashed outline-2 outline-primary'
      )}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-node-id={node.id}
      data-node-type={node.type}
      {...attributes}
      {...listeners}
    >
      {/* Selection label */}
      {isSelected && !isRoot && (
        <div className="absolute -top-6 left-0 z-20 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded shadow-sm flex items-center gap-1">
          <span>{definition?.displayName || node.type}</span>
        </div>
      )}

      {/* Drop indicator for empty containers */}
      {canHaveChildren && node.children.length === 0 && !isPreviewMode && (
        <div className={cn(
          'min-h-[60px] border-2 border-dashed rounded-md flex items-center justify-center text-xs text-muted-foreground',
          isDropTarget ? 'border-primary bg-primary/10' : 'border-muted-foreground/30'
        )}>
          {isDropTarget ? 'Drop here' : `Drop components in ${definition?.displayName || node.type}`}
        </div>
      )}

      {/* Actual content */}
      {(node.children.length > 0 || !canHaveChildren) && content}
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
      const maxWidthMap: Record<string, string> = {
        sm: 'max-w-screen-sm',
        md: 'max-w-screen-md',
        lg: 'max-w-screen-lg',
        xl: 'max-w-screen-xl',
        full: 'max-w-full',
      };
      return (
        <div className={cn('mx-auto w-full', maxWidthMap[maxWidth] || 'max-w-screen-lg', styleClasses)}>
          {children}
        </div>
      );

    case 'Stack':
      const direction = (node.props.direction as string) || 'column';
      const gap = (node.props.gap as string) || 'md';
      const justify = (node.props.justify as string) || 'start';
      const align = (node.props.align as string) || 'stretch';
      const dirClass = direction === 'row' ? 'flex-row' : 'flex-col';
      const justifyMap: Record<string, string> = {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
        around: 'justify-around',
      };
      const alignMap: Record<string, string> = {
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
        stretch: 'items-stretch',
      };
      return (
        <div className={cn(
          'flex',
          dirClass,
          `gap-${mapSpacing(gap)}`,
          justifyMap[justify],
          alignMap[align],
          styleClasses
        )}>
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
      const btnSize = (node.props.size as string) || 'default';
      const variantClasses: Record<string, string> = {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border border-input bg-background hover:bg-accent',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      };
      const sizeClasses: Record<string, string> = {
        sm: 'h-8 px-3 text-xs',
        default: 'h-10 px-4',
        lg: 'h-12 px-6 text-lg',
      };
      return (
        <button className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          variantClasses[variant],
          sizeClasses[btnSize],
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
          {React.Children.count(children) > 0 && (
            <div className="p-6 pt-0">{children}</div>
          )}
        </div>
      );

    case 'Image':
      const src = (node.props.src as string) || 'https://placehold.co/600x400?text=Image';
      const alt = (node.props.alt as string) || 'Image';
      return (
        <img 
          src={src} 
          alt={alt} 
          className={cn('max-w-full h-auto rounded', styleClasses)} 
        />
      );

    case 'Divider':
      return <hr className={cn('border-t border-border my-4', styleClasses)} />;

    case 'Spacer':
      const size = (node.props.size as string) || 'md';
      const heightMap: Record<string, string> = {
        xs: 'h-2', sm: 'h-4', md: 'h-8', lg: 'h-12', xl: 'h-16', '2xl': 'h-24',
      };
      return <div className={cn(heightMap[size] || 'h-8', styleClasses)} aria-hidden="true" />;

    case 'Form':
      return (
        <form className={cn('space-y-4', styleClasses)} onSubmit={(e) => e.preventDefault()}>
          {children}
        </form>
      );

    case 'Input':
      const inputLabel = (node.props.label as string) || '';
      const placeholder = (node.props.placeholder as string) || '';
      const inputType = (node.props.type as string) || 'text';
      return (
        <div className={cn('space-y-2', styleClasses)}>
          {inputLabel && <label className="text-sm font-medium">{inputLabel}</label>}
          <input
            type={inputType}
            placeholder={placeholder}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
        </div>
      );

    case 'Textarea':
      const textareaLabel = (node.props.label as string) || '';
      const textareaPlaceholder = (node.props.placeholder as string) || '';
      return (
        <div className={cn('space-y-2', styleClasses)}>
          {textareaLabel && <label className="text-sm font-medium">{textareaLabel}</label>}
          <textarea
            placeholder={textareaPlaceholder}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
        </div>
      );

    case 'Link':
      const linkText = (node.props.text as string) || 'Link';
      const linkHref = (node.props.href as string) || '#';
      return (
        <a href={linkHref} className={cn('text-primary hover:underline cursor-pointer', styleClasses)}>
          {linkText}
        </a>
      );

    case 'Badge':
      const badgeText = (node.props.text as string) || 'Badge';
      const badgeVariant = (node.props.variant as string) || 'default';
      const badgeVariants: Record<string, string> = {
        default: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        outline: 'border border-input bg-background',
        destructive: 'bg-destructive text-destructive-foreground',
      };
      return (
        <span className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
          badgeVariants[badgeVariant],
          styleClasses
        )}>
          {badgeText}
        </span>
      );

    case 'Alert':
      const alertTitle = (node.props.title as string) || '';
      const alertDesc = (node.props.description as string) || '';
      const alertVariant = (node.props.variant as string) || 'default';
      const alertVariants: Record<string, string> = {
        default: 'bg-background border',
        destructive: 'bg-destructive/10 border-destructive/50 text-destructive',
        success: 'bg-green-50 border-green-200 text-green-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      };
      return (
        <div className={cn('rounded-lg border p-4', alertVariants[alertVariant], styleClasses)}>
          {alertTitle && <h5 className="font-medium mb-1">{alertTitle}</h5>}
          {alertDesc && <p className="text-sm opacity-90">{alertDesc}</p>}
        </div>
      );

    case 'Icon':
      const iconName = (node.props.name as string) || 'star';
      const iconSize = (node.props.size as string) || 'md';
      const iconSizes: Record<string, string> = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
      return (
        <span className={cn('inline-block', iconSizes[iconSize], styleClasses)}>
          ⭐
        </span>
      );

    default:
      // Unknown component - show placeholder
      return (
        <div className={cn(
          'p-4 border border-dashed border-amber-400 rounded bg-amber-50 text-amber-700',
          styleClasses
        )}>
          <p className="text-sm font-medium">Unknown: {node.type}</p>
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
  if (props.marginLeft) classes.push(`ml-${mapSpacing(props.marginLeft)}`);
  if (props.marginRight) classes.push(`mr-${mapSpacing(props.marginRight)}`);

  // Gap
  if (props.gap) classes.push(`gap-${mapSpacing(props.gap)}`);

  // Colors
  if (props.backgroundColor) classes.push(`bg-${props.backgroundColor}`);
  if (props.color) classes.push(`text-${props.color}`);

  // Typography
  if (props.textAlign) classes.push(`text-${props.textAlign}`);
  if (props.fontSize) classes.push(`text-${props.fontSize}`);
  if (props.fontWeight) classes.push(`font-${props.fontWeight}`);

  // Border
  if (props.borderRadius) classes.push(`rounded-${props.borderRadius}`);

  // Display
  if (props.display) {
    const displayMap: Record<string, string> = {
      flex: 'flex',
      block: 'block',
      inline: 'inline',
      'inline-block': 'inline-block',
      grid: 'grid',
      hidden: 'hidden',
    };
    if (displayMap[props.display]) classes.push(displayMap[props.display]);
  }

  return classes.join(' ');
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
  };
  return map[token] || '4';
}
