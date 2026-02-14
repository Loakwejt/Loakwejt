import React from 'react';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import type { BuilderNode, BuilderStyle } from '@builderly/core';
import { componentRegistry } from '@builderly/core';
import { useEditorStore } from '../store/editor-store';
import { useDndState } from './DndProvider';
import { cn } from '@builderly/ui';
import type { DragData } from './DndProvider';
import { AnimatedWrapper } from './AnimatedWrapper';

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
    breakpoint,
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

  // Render based on component type (pass breakpoint for responsive styles)
  const content = renderComponent(node, children, definition, isPreviewMode, breakpoint);

  if (isPreviewMode) {
    // Wrap in AnimatedWrapper for preview mode
    return (
      <AnimatedWrapper 
        animation={node.animation} 
        isPreviewMode={true}
      >
        {content}
      </AnimatedWrapper>
    );
  }

  // Determine if this is an inline/non-full-width element
  // These elements' width should be controlled by their own style, not forced to w-full
  const isInlineElement = ['Button', 'Badge', 'Link', 'Text', 'Heading', 'Input', 'Textarea', 'Stack', 'Container'].includes(node.type);
  // Only force w-full if explicitly set to 100% AND no maxWidth is set
  const hasMaxWidth = !!node.style?.base?.maxWidth;
  const isFullWidth = (node.props.fullWidth === true || node.style?.base?.width === '100%') && !hasMaxWidth;

  return (
    <div
      ref={setRefs}
      className={cn(
        'relative group',
        // Only use w-full for container types and elements with fullWidth
        (!isInlineElement || isFullWidth) && 'w-full',
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
      {isSelected && (
        <div className="absolute -top-6 left-0 z-20 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded shadow-sm flex items-center gap-1">
          <span>{isRoot ? 'Seite (Root)' : definition?.displayName || node.type}</span>
        </div>
      )}

      {/* Drop indicator for empty containers */}
      {canHaveChildren && node.children.length === 0 && !isPreviewMode && (
        <div className={cn(
          'min-h-[40px] border border-dashed flex items-center justify-center text-xs text-muted-foreground/50',
          isDropTarget ? 'border-primary bg-primary/10' : 'border-muted-foreground/20'
        )}>
          {isDropTarget ? 'Drop here' : '+'}
        </div>
      )}

      {/* Actual content */}
      {(node.children.length > 0 || !canHaveChildren) && content}
    </div>
  );
}

// Execute action based on type
function executeAction(action: { type: string; [key: string]: unknown }) {
  switch (action.type) {
    case 'scrollTo': {
      const targetId = action.targetId as string;
      const behavior = (action.behavior as ScrollBehavior) || 'smooth';
      const element = document.getElementById(targetId) || document.querySelector(`[data-node-id="${targetId}"]`);
      if (element) {
        element.scrollIntoView({ behavior, block: 'start' });
      }
      break;
    }
    case 'navigate': {
      const url = action.to as string;
      const target = action.target as string || '_self';
      if (target === '_blank') {
        window.open(url, '_blank');
      } else {
        window.location.href = url;
      }
      break;
    }
    case 'navigatePage': {
      const pageSlug = action.pageSlug as string;
      window.location.href = pageSlug;
      break;
    }
    case 'toggleMobileSidebar': {
      // Toggle mobile sidebar using the store
      useEditorStore.getState().toggleMobileSidebar();
      break;
    }
    default:
      console.log('Action not implemented:', action.type);
  }
}

// Create click handler for actions
function createActionHandler(actions: Array<{ event: string; action: { type: string; [key: string]: unknown } }>, isPreviewMode: boolean) {
  if (!isPreviewMode || !actions || actions.length === 0) return undefined;
  
  const clickActions = actions.filter(a => a.event === 'onClick' || a.event === 'click');
  if (clickActions.length === 0) return undefined;
  
  return (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    clickActions.forEach(a => executeAction(a.action));
  };
}

// Render component based on type
function renderComponent(
  node: BuilderNode,
  children: React.ReactNode,
  definition: ReturnType<typeof componentRegistry.get>,
  isPreviewMode: boolean = false,
  breakpoint: 'desktop' | 'tablet' | 'mobile' = 'desktop'
): React.ReactNode {
  const { classes: styleClasses, inlineStyles } = mapStyles(node.style, breakpoint);
  const actionHandler = createActionHandler(node.actions as Array<{ event: string; action: { type: string; [key: string]: unknown } }>, isPreviewMode);

  switch (node.type) {
    case 'Section': {
      const minHeight = (node.props.minHeight as string) || 'auto';
      const verticalAlign = (node.props.verticalAlign as string) || 'start';
      const backgroundImage = node.props.backgroundImage as string;
      const backgroundSize = (node.props.backgroundSize as string) || 'cover';
      const backgroundPosition = (node.props.backgroundPosition as string) || 'center';
      const backgroundOverlay = node.props.backgroundOverlay as string;
      const backgroundOverlayOpacity = (node.props.backgroundOverlayOpacity as number) ?? 50;

      const minHeightMap: Record<string, string> = {
        auto: 'min-h-0',
        screen: 'min-h-screen',
        half: 'min-h-[50vh]',
        third: 'min-h-[33vh]',
      };
      const alignMap: Record<string, string> = {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
      };

      const sectionStyles: React.CSSProperties = { ...inlineStyles };
      if (backgroundImage) {
        sectionStyles.backgroundImage = `url(${backgroundImage})`;
        sectionStyles.backgroundSize = backgroundSize;
        sectionStyles.backgroundPosition = backgroundPosition;
        sectionStyles.backgroundRepeat = 'no-repeat';
      }

      return (
        <section 
          id={node.id}
          className={cn(
            'w-full relative flex flex-col',
            minHeightMap[minHeight],
            alignMap[verticalAlign],
            styleClasses
          )}
          style={sectionStyles}
        >
          {backgroundImage && backgroundOverlay && (
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: backgroundOverlay,
                opacity: backgroundOverlayOpacity / 100,
              }}
            />
          )}
          {children}
        </section>
      );
    }

    case 'Container': {
      // Default to '7xl' (1280px) which is appropriate for most desktop content
      const maxWidth = (node.props.maxWidth as string) || '7xl';
      const centered = (node.props.centered as boolean) ?? true;
      const minHeight = (node.props.minHeight as string) || 'auto';
      
      // Check if explicit width is set in styles
      const hasExplicitWidth = node.style?.base?.width && node.style.base.width !== '100%';
      
      // Map maxWidth tokens to Tailwind classes - consistent with safe-renderer
      const maxWidthMap: Record<string, string> = {
        'sm': 'max-w-sm',      // 384px
        'md': 'max-w-md',      // 448px
        'lg': 'max-w-lg',      // 512px
        'xl': 'max-w-xl',      // 576px
        '2xl': 'max-w-2xl',    // 672px
        '3xl': 'max-w-3xl',    // 768px
        '4xl': 'max-w-4xl',    // 896px
        '5xl': 'max-w-5xl',    // 1024px
        '6xl': 'max-w-6xl',    // 1152px
        '7xl': 'max-w-7xl',    // 1280px - Good default for most content
        'full': 'max-w-full',
        'none': 'max-w-none',
        'screen-sm': 'max-w-screen-sm',   // 640px
        'screen-md': 'max-w-screen-md',   // 768px
        'screen-lg': 'max-w-screen-lg',   // 1024px
        'screen-xl': 'max-w-screen-xl',   // 1280px
        'screen-2xl': 'max-w-screen-2xl', // 1536px
      };
      const minHeightMap: Record<string, string> = {
        auto: '',
        full: 'min-h-full',
        screen: 'min-h-screen',
      };

      // Check if container has a background color - if so, wrap it in a full-width div
      const hasBackground = inlineStyles.backgroundColor || styleClasses.includes('bg-');
      
      // Extract only background for wrapper, all other styles go on content
      const { backgroundColor, ...layoutStyles } = inlineStyles;
      
      const innerContent = (
        <div 
          className={cn(
            // Only use w-full if no explicit width is set
            !hasExplicitWidth && 'w-full',
            centered && !hasExplicitWidth && 'mx-auto',
            !hasExplicitWidth && (maxWidthMap[maxWidth] || 'max-w-7xl'),
            minHeightMap[minHeight],
            styleClasses // Always apply styleClasses here for flex/align to work
          )}
          style={layoutStyles}
        >
          {children}
        </div>
      );

      // If there's a background, wrap in a full-width container
      if (hasBackground) {
        return (
          <div 
            className="w-full"
            style={{ backgroundColor }}
          >
            {innerContent}
          </div>
        );
      }
      
      return innerContent;
    }

    case 'Stack': {
      // Read layout from style.base (Style Tab) with fallback to props for backwards compatibility
      const styleBase = node.style?.base || {};
      
      // Map CSS flexDirection values to our direction prop values
      const cssFlexDirection = styleBase.flexDirection as string;
      let direction = (node.props.direction as string) || 'column';
      if (cssFlexDirection) {
        direction = cssFlexDirection; // Use CSS value directly (row, column, row-reverse, column-reverse)
      }
      
      // Check if mobile-specific direction is set in styles
      const hasMobileDirection = node.style?.mobile?.flexDirection;
      
      // Responsive: convert row to column on mobile if no mobile-specific style is set
      // This helps Header actions, navigation, etc. to stack vertically on small screens
      const responsiveStack = (node.props.responsiveStack as boolean) !== false; // default true
      let effectiveDirection = direction;
      if (breakpoint === 'mobile' && !hasMobileDirection && responsiveStack && (direction === 'row' || direction === 'row-reverse')) {
        effectiveDirection = 'column';
      }
      
      // Map CSS justifyContent values
      const cssJustify = styleBase.justifyContent as string;
      let justify = (node.props.justify as string) || 'start';
      if (cssJustify) {
        // Map CSS values to our shorthand
        const justifyFromCss: Record<string, string> = {
          'flex-start': 'start',
          'center': 'center',
          'flex-end': 'end',
          'space-between': 'between',
          'space-around': 'around',
          'space-evenly': 'evenly',
        };
        justify = justifyFromCss[cssJustify] || justify;
      }
      
      // Map CSS alignItems values
      const cssAlign = styleBase.alignItems as string;
      let align = (node.props.align as string) || 'stretch';
      if (cssAlign) {
        const alignFromCss: Record<string, string> = {
          'flex-start': 'start',
          'center': 'center',
          'flex-end': 'end',
          'stretch': 'stretch',
          'baseline': 'baseline',
        };
        align = alignFromCss[cssAlign] || align;
      }
      
      // Gap from style or props
      const cssGap = styleBase.gap as string;
      let gap = (node.props.gap as string) || 'md';
      if (cssGap) {
        // If it's a CSS gap value like '1rem', use it directly in inline styles
        gap = cssGap;
      }
      
      // Wrap
      const cssWrap = styleBase.flexWrap as string;
      const wrapProp = node.props.wrap;
      const wrap = cssWrap === 'wrap' || cssWrap === 'wrap-reverse' || wrapProp === true || wrapProp === 'wrap';
      
      const directionMap: Record<string, string> = {
        row: 'flex-row',
        column: 'flex-col',
        'row-reverse': 'flex-row-reverse',
        'column-reverse': 'flex-col-reverse',
      };
      const justifyMap: Record<string, string> = {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
        around: 'justify-around',
        evenly: 'justify-evenly',
      };
      const alignMap: Record<string, string> = {
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
        stretch: 'items-stretch',
        baseline: 'items-baseline',
      };
      
      // Check if gap is a CSS value (contains 'rem', 'px', etc.) or a size token
      const isCssGap = typeof gap === 'string' && (gap.includes('rem') || gap.includes('px') || gap.includes('em'));
      const gapStyle = isCssGap ? { gap } : {};
      const gapClass = isCssGap ? '' : `gap-${mapSpacing(gap)}`;
      
      return (
        <div 
          className={cn(
            'flex',
            directionMap[effectiveDirection],
            gapClass,
            justifyMap[justify],
            alignMap[align],
            wrap && 'flex-wrap',
            styleClasses
          )}
          style={{ ...inlineStyles, ...gapStyle }}
        >
          {children}
        </div>
      );
    }

    case 'Grid': {
      // Read from style.base with fallback to props for backwards compatibility
      const styleBase = node.style?.base || {};
      
      // Check if gridTemplateColumns is set in styles (responsive)
      const hasResponsiveColumns = 
        inlineStyles.gridTemplateColumns || 
        styleBase.gridTemplateColumns ||
        node.style?.mobile?.gridTemplateColumns ||
        node.style?.tablet?.gridTemplateColumns;
      
      // Columns from props (Grid-specific, not a general CSS property)
      const columns = (node.props.columns as number) || 3;
      
      // Gap from style or props
      const cssGap = styleBase.gap as string;
      let gridGap = (node.props.gap as string) || 'md';
      if (cssGap) {
        gridGap = cssGap;
      }
      
      // AlignItems from style or props
      const cssAlign = styleBase.alignItems as string;
      let alignItems = (node.props.alignItems as string) || 'stretch';
      if (cssAlign) {
        const alignFromCss: Record<string, string> = {
          'start': 'start',
          'center': 'center',
          'end': 'end',
          'stretch': 'stretch',
        };
        alignItems = alignFromCss[cssAlign] || alignItems;
      }
      
      const alignMap: Record<string, string> = {
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
        stretch: 'items-stretch',
      };
      
      // Check if gap is a CSS value
      const isCssGap = typeof gridGap === 'string' && (gridGap.includes('rem') || gridGap.includes('px') || gridGap.includes('em'));
      const gapStyle = isCssGap ? { gap: gridGap } : {};
      const gapClass = isCssGap ? '' : `gap-${mapSpacing(gridGap)}`;
      
      // Responsive grid columns - automatically adjust for breakpoints
      // Mobile: max 1 column (for 2+ columns) or original (for 1 column)
      // Tablet: max 2 columns (for 3+ columns) or original (for 1-2 columns)
      // Desktop: original columns
      let effectiveCols = columns;
      if (!hasResponsiveColumns) {
        if (breakpoint === 'mobile') {
          effectiveCols = columns >= 2 ? 1 : columns;
        } else if (breakpoint === 'tablet') {
          effectiveCols = columns >= 3 ? 2 : columns;
        }
      }
      
      // If responsive gridTemplateColumns is set, use CSS grid directly
      // Otherwise use Tailwind classes with responsive adjustments
      const gridColsClass = hasResponsiveColumns ? '' : `grid-cols-${Math.min(effectiveCols, 12)}`;
      
      return (
        <div 
          className={cn(
            'grid',
            gridColsClass,
            gapClass,
            alignMap[alignItems],
            styleClasses
          )}
          style={{ ...inlineStyles, ...gapStyle }}
        >
          {children}
        </div>
      );
    }

    case 'Text':
      return (
        <p className={cn('text-base', styleClasses)} style={inlineStyles}>
          {(node.props.text as string) || 'Enter text...'}
        </p>
      );

    case 'Heading': {
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
      return <Tag className={cn(sizeMap[level], styleClasses)} style={inlineStyles}>{text}</Tag>;
    }

    case 'Button': {
      const btnText = (node.props.text as string) || 'Button';
      const variant = (node.props.variant as string) || 'primary';
      const btnSize = (node.props.size as string) || 'default';
      const fullWidth = (node.props.fullWidth as boolean) || false;
      
      // Check if custom colors are defined - if so, skip variant classes
      const hasCustomBg = inlineStyles.backgroundColor;
      const hasCustomColor = inlineStyles.color;
      const hasCustomBorder = inlineStyles.borderColor;
      
      const variantClasses: Record<string, string> = {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border border-input bg-background hover:bg-accent',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      };
      const sizeClasses: Record<string, string> = {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-lg',
      };
      
      // Build button classes - skip bg/color variants if custom colors defined
      let btnClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors';
      if (!hasCustomBg && !hasCustomColor) {
        btnClasses = cn(btnClasses, variantClasses[variant]);
      } else {
        // Add hover effect even with custom colors
        btnClasses = cn(btnClasses, 'hover:opacity-90');
        // Add border for outline variant
        if (variant === 'outline') {
          btnClasses = cn(btnClasses, 'border');
        }
      }
      
      return (
        <button 
          className={cn(
            btnClasses,
            sizeClasses[btnSize],
            fullWidth && 'w-full',
            actionHandler && 'cursor-pointer',
            styleClasses
          )}
          style={inlineStyles}
          onClick={actionHandler}
        >
          {btnText}
        </button>
      );
    }

    case 'Card': {
      const title = (node.props.title as string) || '';
      const description = (node.props.description as string) || '';
      return (
        <div className={cn('rounded-lg border bg-card shadow-sm', styleClasses)} style={inlineStyles}>
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
    }

    case 'Image': {
      const src = (node.props.src as string) || 'https://placehold.co/600x400?text=Image';
      const alt = (node.props.alt as string) || 'Image';
      const objectFit = (node.props.objectFit as string) || 'cover';
      const imgWidth = node.props.width as string;
      const imgHeight = node.props.height as string;

      const imgStyles: React.CSSProperties = { ...inlineStyles };
      if (imgWidth) imgStyles.width = imgWidth;
      if (imgHeight) imgStyles.height = imgHeight;

      return (
        <img 
          src={src} 
          alt={alt} 
          className={cn('max-w-full h-auto rounded', `object-${objectFit}`, styleClasses)}
          style={imgStyles}
        />
      );
    }

    case 'Divider':
      return <hr className={cn('border-t border-border my-4', styleClasses)} style={inlineStyles} />;

    case 'Spacer': {
      const size = (node.props.size as string) || 'md';
      const heightMap: Record<string, string> = {
        xs: 'h-2', sm: 'h-4', md: 'h-8', lg: 'h-12', xl: 'h-16', '2xl': 'h-24', '3xl': 'h-32',
      };
      return <div className={cn(heightMap[size] || 'h-8', styleClasses)} style={inlineStyles} aria-hidden="true" />;
    }

    case 'Form':
      return (
        <form className={cn('space-y-4', styleClasses)} style={inlineStyles} onSubmit={(e) => e.preventDefault()}>
          {children}
        </form>
      );

    case 'Input': {
      const inputLabel = (node.props.label as string) || '';
      const placeholder = (node.props.placeholder as string) || '';
      const inputType = (node.props.type as string) || 'text';
      
      // If no label, apply styles directly to input
      if (!inputLabel) {
        return (
          <input
            type={inputType}
            placeholder={placeholder}
            className={cn(
              'flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              styleClasses
            )}
            style={inlineStyles}
          />
        );
      }
      
      return (
        <div className={cn('space-y-2', styleClasses)} style={inlineStyles}>
          <label className="text-sm font-medium">{inputLabel}</label>
          <input
            type={inputType}
            placeholder={placeholder}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
        </div>
      );
    }

    case 'Textarea': {
      const textareaLabel = (node.props.label as string) || '';
      const textareaPlaceholder = (node.props.placeholder as string) || '';
      return (
        <div className={cn('space-y-2', styleClasses)} style={inlineStyles}>
          {textareaLabel && <label className="text-sm font-medium">{textareaLabel}</label>}
          <textarea
            placeholder={textareaPlaceholder}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
        </div>
      );
    }

    case 'Link': {
      const linkText = (node.props.text as string) || 'Link';
      const linkHref = (node.props.href as string) || '#';
      return (
        <a 
          href={actionHandler ? undefined : linkHref} 
          className={cn('text-primary hover:underline cursor-pointer', styleClasses)} 
          style={inlineStyles}
          onClick={actionHandler}
        >
          {linkText}
        </a>
      );
    }

    case 'Badge': {
      const badgeText = (node.props.text as string) || 'Badge';
      const badgeVariant = (node.props.variant as string) || 'default';
      const badgeVariants: Record<string, string> = {
        default: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        outline: 'border border-input bg-background',
        destructive: 'bg-destructive text-destructive-foreground',
      };
      return (
        <span 
          className={cn(
            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
            badgeVariants[badgeVariant],
            styleClasses
          )}
          style={inlineStyles}
        >
          {badgeText}
        </span>
      );
    }

    case 'Alert': {
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
        <div className={cn('rounded-lg border p-4', alertVariants[alertVariant], styleClasses)} style={inlineStyles}>
          {alertTitle && <h5 className="font-medium mb-1">{alertTitle}</h5>}
          {alertDesc && <p className="text-sm opacity-90">{alertDesc}</p>}
        </div>
      );
    }

    case 'Icon': {
      const iconSize = (node.props.size as string) || 'md';
      const iconSizes: Record<string, string> = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8', xl: 'w-10 h-10' };
      return (
        <span className={cn('inline-block', iconSizes[iconSize], styleClasses)} style={inlineStyles}>
          ⭐
        </span>
      );
    }

    // ============================================================================
    // NEW COMPONENTS
    // ============================================================================

    case 'Avatar': {
      const avatarSrc = (node.props.src as string) || 'https://i.pravatar.cc/150';
      const avatarAlt = (node.props.alt as string) || 'Avatar';
      const avatarSize = (node.props.size as string) || 'md';
      const sizeMap: Record<string, string> = { sm: 'w-8 h-8', md: 'w-12 h-12', lg: 'w-16 h-16', xl: 'w-20 h-20' };
      return (
        <img 
          src={avatarSrc} 
          alt={avatarAlt}
          className={cn('rounded-full object-cover', sizeMap[avatarSize], styleClasses)}
          style={inlineStyles}
        />
      );
    }

    case 'Video': {
      const videoSrc = (node.props.src as string) || '';
      const videoPoster = (node.props.poster as string) || '';
      const autoplay = (node.props.autoplay as boolean) || false;
      const controls = (node.props.controls as boolean) ?? true;
      
      // Check if it's a YouTube/Vimeo URL
      if (videoSrc.includes('youtube.com') || videoSrc.includes('youtu.be')) {
        const videoId = videoSrc.includes('youtu.be') 
          ? videoSrc.split('/').pop() 
          : new URLSearchParams(new URL(videoSrc).search).get('v');
        return (
          <div className={cn('aspect-video w-full', styleClasses)} style={inlineStyles}>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}${autoplay ? '?autoplay=1' : ''}`}
              className="w-full h-full rounded"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        );
      }
      
      return (
        <video 
          src={videoSrc}
          poster={videoPoster}
          controls={controls}
          autoPlay={autoplay}
          className={cn('w-full rounded', styleClasses)}
          style={inlineStyles}
        />
      );
    }

    case 'Map': {
      const lat = (node.props.lat as number) || 51.505;
      const lng = (node.props.lng as number) || -0.09;
      const zoom = (node.props.zoom as number) || 13;
      const mapHeight = (node.props.height as string) || '300px';
      
      return (
        <div 
          className={cn('w-full rounded overflow-hidden', styleClasses)}
          style={{ ...inlineStyles, height: mapHeight }}
        >
          <iframe
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01}%2C${lat-0.01}%2C${lng+0.01}%2C${lat+0.01}&layer=mapnik&marker=${lat}%2C${lng}`}
            className="w-full h-full border-0"
          />
        </div>
      );
    }

    case 'SocialLinks': {
      const platforms = (node.props.platforms as string[]) || ['facebook', 'twitter', 'instagram'];
      const socialSize = (node.props.size as string) || 'md';
      const sizeClasses: Record<string, string> = { sm: 'w-5 h-5', md: 'w-6 h-6', lg: 'w-8 h-8' };
      
      const icons: Record<string, string> = {
        facebook: '📘', twitter: '🐦', instagram: '📸', linkedin: '💼',
        youtube: '📺', tiktok: '🎵', pinterest: '📌', github: '💻'
      };
      
      return (
        <div className={cn('flex gap-3', styleClasses)} style={inlineStyles}>
          {platforms.map((platform) => (
            <a key={platform} href="#" className={cn('hover:opacity-70 transition-opacity', sizeClasses[socialSize])}>
              {icons[platform] || '🔗'}
            </a>
          ))}
        </div>
      );
    }

    case 'Accordion': {
      return (
        <div className={cn('divide-y border rounded-lg', styleClasses)} style={inlineStyles}>
          {children}
        </div>
      );
    }

    case 'AccordionItem': {
      const itemTitle = (node.props.title as string) || 'Accordion Item';
      const isOpen = (node.props.defaultOpen as boolean) || false;
      return (
        <details className="group" open={isOpen}>
          <summary className="flex cursor-pointer items-center justify-between p-4 font-medium hover:bg-muted/50">
            {itemTitle}
            <span className="transition-transform group-open:rotate-180">▼</span>
          </summary>
          <div className="p-4 pt-0">{children}</div>
        </details>
      );
    }

    case 'Tabs': {
      return (
        <div className={cn('w-full', styleClasses)} style={inlineStyles}>
          {children}
        </div>
      );
    }

    case 'Tab': {
      const tabLabel = (node.props.label as string) || 'Tab';
      return (
        <div className="border rounded-lg p-4">
          <div className="text-sm font-medium text-muted-foreground mb-2">{tabLabel}</div>
          {children}
        </div>
      );
    }

    case 'Carousel': {
      return (
        <div className={cn('relative w-full overflow-hidden', styleClasses)} style={inlineStyles}>
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4">
            {children}
          </div>
          <div className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 cursor-pointer">←</div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 cursor-pointer">→</div>
        </div>
      );
    }

    case 'Progress': {
      const progressValue = (node.props.value as number) || 50;
      const progressMax = (node.props.max as number) || 100;
      const showLabel = (node.props.showLabel as boolean) ?? true;
      const percent = Math.min(100, Math.max(0, (progressValue / progressMax) * 100));
      
      return (
        <div className={cn('w-full', styleClasses)} style={inlineStyles}>
          {showLabel && <div className="text-sm mb-1">{Math.round(percent)}%</div>}
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      );
    }

    case 'Rating': {
      const ratingValue = (node.props.value as number) || 4;
      const ratingMax = (node.props.max as number) || 5;
      const ratingSize = (node.props.size as string) || 'md';
      const sizesMap: Record<string, string> = { sm: 'text-sm', md: 'text-lg', lg: 'text-2xl' };
      
      return (
        <div className={cn('flex gap-0.5', sizesMap[ratingSize], styleClasses)} style={inlineStyles}>
          {Array.from({ length: ratingMax }).map((_, i) => (
            <span key={i} className={i < ratingValue ? 'text-yellow-400' : 'text-gray-300'}>★</span>
          ))}
        </div>
      );
    }

    case 'Counter': {
      const counterValue = (node.props.value as number) || 100;
      const counterPrefix = (node.props.prefix as string) || '';
      const counterSuffix = (node.props.suffix as string) || '';
      
      return (
        <div className={cn('text-4xl font-bold', styleClasses)} style={inlineStyles}>
          {counterPrefix}{counterValue}{counterSuffix}
        </div>
      );
    }

    case 'Quote': {
      const quoteText = (node.props.text as string) || 'Quote text here...';
      const quoteAuthor = (node.props.author as string) || '';
      
      return (
        <blockquote className={cn('border-l-4 border-primary pl-4 italic', styleClasses)} style={inlineStyles}>
          <p className="text-lg">"{quoteText}"</p>
          {quoteAuthor && <footer className="mt-2 text-sm text-muted-foreground">— {quoteAuthor}</footer>}
        </blockquote>
      );
    }

    case 'PricingCard': {
      const planName = (node.props.name as string) || 'Pro';
      const planPrice = (node.props.price as string) || '29';
      const planPeriod = (node.props.period as string) || '/month';
      const planFeatures = (node.props.features as string[]) || ['Feature 1', 'Feature 2', 'Feature 3'];
      const planHighlighted = (node.props.highlighted as boolean) || false;
      
      return (
        <div className={cn(
          'rounded-xl border p-6 text-center',
          planHighlighted && 'border-primary shadow-lg scale-105',
          styleClasses
        )} style={inlineStyles}>
          <h3 className="text-xl font-bold">{planName}</h3>
          <div className="mt-4">
            <span className="text-4xl font-bold">${planPrice}</span>
            <span className="text-muted-foreground">{planPeriod}</span>
          </div>
          <ul className="mt-6 space-y-2">
            {planFeatures.map((feature, i) => (
              <li key={i} className="flex items-center justify-center gap-2">
                <span className="text-green-500">✓</span> {feature}
              </li>
            ))}
          </ul>
          {children}
        </div>
      );
    }

    case 'FeatureCard': {
      const featureIcon = (node.props.icon as string) || '⭐';
      const featureTitle = (node.props.title as string) || 'Feature';
      const featureDesc = (node.props.description as string) || 'Description';
      
      return (
        <div className={cn('text-center p-6', styleClasses)} style={inlineStyles}>
          <div className="text-4xl mb-4">{featureIcon}</div>
          <h3 className="text-lg font-semibold mb-2">{featureTitle}</h3>
          <p className="text-muted-foreground">{featureDesc}</p>
        </div>
      );
    }

    case 'TestimonialCard': {
      const testimonialText = (node.props.text as string) || 'Great product!';
      const testimonialAuthor = (node.props.author as string) || 'John Doe';
      const testimonialRole = (node.props.role as string) || 'Customer';
      const testimonialImage = (node.props.image as string) || 'https://i.pravatar.cc/100';
      
      return (
        <div className={cn('p-6 rounded-xl border', styleClasses)} style={inlineStyles}>
          <p className="italic mb-4">"{testimonialText}"</p>
          <div className="flex items-center gap-3">
            <img src={testimonialImage} alt={testimonialAuthor} className="w-10 h-10 rounded-full" />
            <div>
              <div className="font-medium">{testimonialAuthor}</div>
              <div className="text-sm text-muted-foreground">{testimonialRole}</div>
            </div>
          </div>
        </div>
      );
    }

    case 'TeamMember': {
      const memberName = (node.props.name as string) || 'Team Member';
      const memberRole = (node.props.role as string) || 'Position';
      const memberImage = (node.props.image as string) || 'https://i.pravatar.cc/200';
      
      return (
        <div className={cn('text-center', styleClasses)} style={inlineStyles}>
          <img src={memberImage} alt={memberName} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
          <h3 className="font-semibold">{memberName}</h3>
          <p className="text-muted-foreground">{memberRole}</p>
        </div>
      );
    }

    case 'LogoCloud': {
      const logos = (node.props.logos as string[]) || [
        'https://placehold.co/120x40?text=Logo1',
        'https://placehold.co/120x40?text=Logo2',
        'https://placehold.co/120x40?text=Logo3'
      ];
      
      return (
        <div className={cn('flex flex-wrap items-center justify-center gap-8', styleClasses)} style={inlineStyles}>
          {logos.map((logo, i) => (
            <img key={i} src={logo} alt={`Logo ${i+1}`} className="h-8 opacity-60 hover:opacity-100 transition-opacity" />
          ))}
        </div>
      );
    }

    case 'CTA': {
      const ctaTitle = (node.props.title as string) || 'Ready to get started?';
      const ctaDesc = (node.props.description as string) || 'Join thousands of satisfied customers today.';
      
      return (
        <div className={cn('text-center py-12 px-6', styleClasses)} style={inlineStyles}>
          <h2 className="text-3xl font-bold mb-4">{ctaTitle}</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">{ctaDesc}</p>
          {children}
        </div>
      );
    }

    case 'Breadcrumb': {
      const items = (node.props.items as string[]) || ['Home', 'Products', 'Current'];
      
      return (
        <nav className={cn('flex text-sm', styleClasses)} style={inlineStyles}>
          {items.map((item, i) => (
            <span key={i} className="flex items-center">
              {i > 0 && <span className="mx-2 text-muted-foreground">/</span>}
              <a href="#" className={i === items.length - 1 ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}>
                {item}
              </a>
            </span>
          ))}
        </nav>
      );
    }

    case 'Table': {
      const headers = (node.props.headers as string[]) || ['Column 1', 'Column 2', 'Column 3'];
      const rows = (node.props.rows as string[][]) || [
        ['Cell 1', 'Cell 2', 'Cell 3'],
        ['Cell 4', 'Cell 5', 'Cell 6']
      ];
      
      return (
        <div className={cn('overflow-x-auto', styleClasses)} style={inlineStyles}>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                {headers.map((header, i) => (
                  <th key={i} className="text-left p-3 font-medium">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b last:border-0">
                  {row.map((cell, j) => (
                    <td key={j} className="p-3">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    case 'CodeBlock': {
      const codeContent = (node.props.code as string) || 'console.log("Hello World");';
      const language = (node.props.language as string) || 'javascript';
      
      return (
        <pre className={cn('bg-zinc-900 text-zinc-100 p-4 rounded-lg overflow-x-auto text-sm', styleClasses)} style={inlineStyles}>
          <code className={`language-${language}`}>{codeContent}</code>
        </pre>
      );
    }

    case 'Timeline': {
      return (
        <div className={cn('space-y-4', styleClasses)} style={inlineStyles}>
          {children}
        </div>
      );
    }

    case 'TimelineItem': {
      const itemDate = (node.props.date as string) || '2024';
      const itemTitle = (node.props.title as string) || 'Event';
      
      return (
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 bg-primary rounded-full" />
            <div className="w-0.5 h-full bg-border" />
          </div>
          <div className="pb-4">
            <div className="text-sm text-muted-foreground">{itemDate}</div>
            <div className="font-medium">{itemTitle}</div>
            {children}
          </div>
        </div>
      );
    }

    case 'Countdown': {
      const targetDate = (node.props.targetDate as string) || new Date(Date.now() + 86400000).toISOString();
      
      return (
        <div className={cn('flex gap-4 text-center', styleClasses)} style={inlineStyles}>
          {['Days', 'Hours', 'Min', 'Sec'].map((label) => (
            <div key={label} className="bg-muted rounded-lg p-4 min-w-[80px]">
              <div className="text-3xl font-bold">00</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      );
    }

    case 'Marquee': {
      const marqueeText = (node.props.text as string) || 'Scrolling text here • ';
      const marqueeSpeed = (node.props.speed as string) || 'normal';
      
      return (
        <div className={cn('overflow-hidden whitespace-nowrap', styleClasses)} style={inlineStyles}>
          <div className="inline-block animate-marquee">
            {marqueeText.repeat(10)}
          </div>
        </div>
      );
    }

    case 'List': {
      const listItems = (node.props.items as string[]) || ['Item 1', 'Item 2', 'Item 3'];
      const listType = (node.props.type as string) || 'unordered';
      const ListTag = listType === 'ordered' ? 'ol' : 'ul';
      
      return (
        <ListTag className={cn(
          listType === 'ordered' ? 'list-decimal' : 'list-disc',
          'pl-5 space-y-1',
          styleClasses
        )} style={inlineStyles}>
          {listItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ListTag>
      );
    }

    // ========================================================================
    // COMMERCE / SHOP COMPONENTS
    // ========================================================================

    case 'ProductList': {
      const plLayout = (node.props.layout as string) || 'grid';
      const plColumns = (node.props.columns as number) || 4;
      const plLimit = (node.props.limit as number) || 12;
      // Responsive: reduce columns on mobile/tablet
      const plEffectiveCols = breakpoint === 'mobile' 
        ? Math.min(plColumns, 1) 
        : breakpoint === 'tablet' 
          ? Math.min(plColumns, 2) 
          : plColumns;
      const plColsClass = `grid-cols-${plEffectiveCols}`;

      // Use real workspace products when available and no manual children
      const wsProducts = useEditorStore.getState().workspaceProducts;
      const hasManualChildren = node.children.length > 0;
      const showRealProducts = !hasManualChildren && wsProducts.length > 0;

      // Sort + filter + limit
      const plSortBy = (node.props.sortBy as string) || 'createdAt';
      const plSortOrder = (node.props.sortOrder as string) || 'desc';
      let displayProducts = [...wsProducts];
      if (plSortBy === 'price') {
        displayProducts.sort((a, b) => plSortOrder === 'asc' ? a.price - b.price : b.price - a.price);
      } else if (plSortBy === 'name') {
        displayProducts.sort((a, b) => plSortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
      }
      displayProducts = displayProducts.slice(0, plLimit);

      const formatPrice = (cents: number) => {
        return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(cents / 100);
      };

      return (
        <div className={cn(
          plLayout === 'grid' ? `grid ${plColsClass} gap-4` : 'space-y-4',
          styleClasses
        )} style={inlineStyles}>
          {hasManualChildren ? children : showRealProducts ? (
            displayProducts.map((product) => (
              <div key={product.id} className="rounded-lg border bg-card shadow-sm overflow-hidden">
                <div className="aspect-square bg-muted overflow-hidden relative">
                  {product.images.length > 0 ? (
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                    </div>
                  )}
                  {product.isFeatured && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-red-500 text-white text-xs font-semibold rounded">Beliebt</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-1 truncate">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold">{formatPrice(product.price)}</span>
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <span className="text-sm text-muted-foreground line-through">{formatPrice(product.compareAtPrice)}</span>
                    )}
                  </div>
                  <button className="w-full px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md cursor-default">
                    In den Warenkorb
                  </button>
                </div>
              </div>
            ))
          ) : (
            // Skeleton placeholders when no products loaded
            Array.from({ length: Math.min(plColumns, 4) }).map((_, i) => (
              <div key={i} className="rounded-lg border bg-card shadow-sm overflow-hidden">
                <div className="aspect-square bg-muted flex items-center justify-center text-muted-foreground">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                </div>
                <div className="p-3">
                  <div className="h-3 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                  <div className="h-8 bg-primary/10 rounded w-full" />
                </div>
              </div>
            ))
          )}
        </div>
      );
    }

    case 'ProductCard': {
      const pcShowPrice = node.props.showPrice !== false;
      const pcShowAddToCart = node.props.showAddToCart !== false;
      const pcShowDescription = node.props.showDescription === true;
      const pcShowBadge = node.props.showBadge !== false;
      const pcImageAspect = (node.props.imageAspect as string) || 'square';
      const pcAspectClass = pcImageAspect === '16:9' ? 'aspect-video' : pcImageAspect === '4:3' ? 'aspect-[4/3]' : pcImageAspect === '3:4' ? 'aspect-[3/4]' : 'aspect-square';

      // Check if bound to a real product via productId
      const pcProductId = node.props.productId as string | undefined;
      const pcBoundProduct = pcProductId
        ? useEditorStore.getState().workspaceProducts.find((p) => p.id === pcProductId)
        : undefined;

      const formatCents = (cents: number) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(cents / 100);

      // Use bound product data if available, otherwise fall back to manual props
      const pcName = pcBoundProduct?.name || (node.props.productName as string) || 'Beispielprodukt';
      const pcPrice = pcBoundProduct ? pcBoundProduct.price : ((node.props.productPrice as number) ?? 29.99);
      const pcComparePrice = pcBoundProduct ? pcBoundProduct.compareAtPrice : (node.props.productComparePrice as number | undefined);
      const pcImage = pcBoundProduct?.images?.[0] || (node.props.productImage as string) || '';
      const pcDescription = pcBoundProduct?.description || (node.props.productDescription as string) || '';
      const pcBadge = pcBoundProduct?.isFeatured ? 'Beliebt' : (node.props.productBadge as string) || '';
      // Price display: bound products are in cents, manual props are in euros
      const priceDisplay = pcBoundProduct ? formatCents(pcPrice) : `€${pcPrice.toFixed(2)}`;
      const comparePriceDisplay = pcComparePrice
        ? (pcBoundProduct ? formatCents(pcComparePrice) : `€${pcComparePrice.toFixed(2)}`)
        : null;

      return (
        <div className={cn('group rounded-lg border bg-card shadow-sm overflow-hidden', styleClasses)} style={inlineStyles}>
          {pcBoundProduct && (
            <div className="absolute top-0 right-0 z-10 bg-green-500/90 text-white text-[9px] px-1.5 py-0.5 rounded-bl font-medium">
              Live
            </div>
          )}
          <div className={cn(pcAspectClass, 'overflow-hidden bg-muted relative')}>
            {pcImage ? (
              <img src={pcImage} alt={pcName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              </div>
            )}
            {pcShowBadge && pcBadge && (
              <span className="absolute top-2 left-2 px-2 py-0.5 bg-red-500 text-white text-xs font-semibold rounded">{pcBadge}</span>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-sm mb-1 truncate">{pcName}</h3>
            {pcShowDescription && pcDescription && (
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{pcDescription}</p>
            )}
            {pcShowPrice && (
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold">{priceDisplay}</span>
                {comparePriceDisplay && pcComparePrice && pcComparePrice > pcPrice && (
                  <span className="text-sm text-muted-foreground line-through">{comparePriceDisplay}</span>
                )}
              </div>
            )}
            {pcShowAddToCart && (
              <button className="w-full px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md cursor-default">
                In den Warenkorb
              </button>
            )}
          </div>
        </div>
      );
    }

    case 'ProductDetail': {
      const pdShowGallery = node.props.showGallery !== false;
      const pdShowDesc = node.props.showDescription !== false;
      const pdShowSku = node.props.showSku === true;
      const pdShowInventory = node.props.showInventory === true;
      const pdShowCart = node.props.showAddToCart !== false;
      const pdName = (node.props.productName as string) || 'Beispielprodukt';
      const pdPrice = (node.props.productPrice as number) ?? 49.99;
      const pdCompare = node.props.productComparePrice as number | undefined;
      const pdDesc = (node.props.productDescription as string) || '';
      const pdImages = (node.props.productImages as string[]) || [];
      const pdSku = (node.props.productSku as string) || '';
      const pdInventory = node.props.productInventory as number | undefined;

      // Responsive: single column on mobile, 2 columns on tablet/desktop
      const pdGridCols = breakpoint === 'mobile' ? 'grid-cols-1' : 'grid-cols-2';

      return (
        <div className={cn(`grid ${pdGridCols} gap-8`, styleClasses)} style={inlineStyles}>
          {pdShowGallery && (
            <div className="space-y-2">
              {pdImages.length > 0 ? (
                <>
                  <img src={pdImages[0]} alt={pdName} className="w-full rounded-lg" />
                  {pdImages.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {pdImages.slice(1, 5).map((img, i) => (
                        <img key={i} src={img} alt="" className="w-full aspect-square object-cover rounded" />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                </div>
              )}
            </div>
          )}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">{pdName}</h1>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold">€{pdPrice.toFixed(2)}</span>
              {pdCompare && pdCompare > pdPrice && (
                <span className="text-lg text-muted-foreground line-through">€{pdCompare.toFixed(2)}</span>
              )}
            </div>
            {pdShowDesc && pdDesc && <p className="text-muted-foreground">{pdDesc}</p>}
            {pdShowSku && pdSku && <p className="text-sm text-muted-foreground">SKU: {pdSku}</p>}
            {pdShowInventory && pdInventory !== undefined && (
              <p className={cn('text-sm', pdInventory > 0 ? 'text-green-600' : 'text-red-600')}>
                {pdInventory > 0 ? `${pdInventory} auf Lager` : 'Nicht auf Lager'}
              </p>
            )}
            {pdShowCart && (
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium cursor-default">
                In den Warenkorb
              </button>
            )}
          </div>
        </div>
      );
    }

    case 'AddToCartButton': {
      const atcText = (node.props.text as string) || 'In den Warenkorb';
      const atcVariant = (node.props.variant as string) || 'primary';
      const atcFull = node.props.fullWidth === true;
      const atcVariantClasses: Record<string, string> = {
        primary: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        outline: 'border border-input bg-background',
      };
      return (
        <button className={cn(
          'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium',
          atcVariantClasses[atcVariant] || atcVariantClasses.primary,
          atcFull && 'w-full',
          styleClasses
        )} style={inlineStyles}>
          🛒 {atcText}
        </button>
      );
    }

    case 'CartSummary': {
      const csShowCheckout = node.props.showCheckoutButton !== false;
      const csShowTax = node.props.showTax !== false;
      const csShowShipping = node.props.showShipping !== false;
      return (
        <div className={cn('rounded-lg border bg-card p-6 space-y-4', styleClasses)} style={inlineStyles}>
          <h3 className="font-semibold text-lg">Warenkorb</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Zwischensumme</span><span>€0,00</span></div>
            {csShowTax && <div className="flex justify-between"><span>MwSt. (19%)</span><span>€0,00</span></div>}
            {csShowShipping && <div className="flex justify-between"><span>Versand</span><span>€0,00</span></div>}
            <div className="border-t pt-2 flex justify-between font-bold"><span>Gesamt</span><span>€0,00</span></div>
          </div>
          {csShowCheckout && (
            <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium cursor-default">
              Zur Kasse
            </button>
          )}
        </div>
      );
    }

    case 'CartItems': {
      return (
        <div className={cn('space-y-4', styleClasses)} style={inlineStyles}>
          <p className="text-muted-foreground text-center py-8">🛒 Dein Warenkorb ist leer.</p>
        </div>
      );
    }

    case 'CheckoutButton': {
      const cbText = (node.props.text as string) || 'Zur Kasse';
      const cbVariant = (node.props.variant as string) || 'primary';
      const cbFull = node.props.fullWidth !== false;
      const cbVariantClasses: Record<string, string> = {
        primary: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        outline: 'border border-input bg-background',
      };
      return (
        <button className={cn(
          'inline-flex items-center justify-center rounded-md px-6 py-2 text-sm font-medium',
          cbVariantClasses[cbVariant] || cbVariantClasses.primary,
          cbFull && 'w-full',
          styleClasses
        )} style={inlineStyles}>
          💳 {cbText}
        </button>
      );
    }

    case 'PriceDisplay': {
      const prCurrency = (node.props.currency as string) || '€';
      const prShowCurrency = node.props.showCurrency !== false;
      const prShowOriginal = node.props.showOriginalPrice !== false;
      const prPriceVal = (node.props.price as number) ?? 29.99;
      const prCompareVal = (node.props.comparePrice as number) || 0;
      const prSz = (node.props.size as string) || 'md';
      const prSizeClasses: Record<string, string> = { sm: 'text-sm', md: 'text-base', lg: 'text-lg', xl: 'text-2xl' };
      const prCurr = prShowCurrency ? prCurrency : '';
      return (
        <span className={cn('inline-flex items-center gap-2 font-bold', prSizeClasses[prSz], styleClasses)} style={inlineStyles}>
          <span>{prCurr}{prPriceVal.toFixed(2)}</span>
          {prShowOriginal && prCompareVal > 0 && prCompareVal > prPriceVal && (
            <span className="text-muted-foreground line-through font-normal text-sm">{prCurr}{prCompareVal.toFixed(2)}</span>
          )}
        </span>
      );
    }

    default:
      // Unknown component - show placeholder
      return (
        <div 
          className={cn(
            'p-4 border border-dashed border-amber-400 rounded bg-amber-50 text-amber-700',
            styleClasses
          )}
          style={inlineStyles}
        >
          <p className="text-sm font-medium">Unknown: {node.type}</p>
          {children}
        </div>
      );
  }
}

// ============================================================================
// STYLE MAPPING HELPERS
// ============================================================================

interface StyleResult {
  classes: string;
  inlineStyles: React.CSSProperties;
}

function mapStyleToClasses(style: BuilderStyle, breakpoint: 'desktop' | 'tablet' | 'mobile' = 'desktop'): string {
  return mapStyles(style, breakpoint).classes;
}

/**
 * Maps BuilderStyle to CSS classes and inline styles
 * Merges base styles with breakpoint-specific overrides
 */
function mapStyles(style: BuilderStyle, breakpoint: 'desktop' | 'tablet' | 'mobile' = 'desktop'): StyleResult {
  // Merge base with breakpoint-specific styles
  // For mobile: base + mobile
  // For tablet: base + tablet
  // For desktop: base + desktop (if exists)
  let props = { ...style.base };
  
  if (breakpoint === 'mobile' && style.mobile) {
    props = { ...props, ...style.mobile };
  } else if (breakpoint === 'tablet' && style.tablet) {
    props = { ...props, ...style.tablet };
  } else if (breakpoint === 'desktop' && style.desktop) {
    props = { ...props, ...style.desktop };
  }
  
  if (!props) return { classes: '', inlineStyles: {} };

  const classes: string[] = [];
  const inlineStyles: React.CSSProperties = {};

  // Helper to handle spacing props - use inline style if CSS value, otherwise Tailwind class
  const handleSpacing = (prop: string | undefined, classPrefix: string, styleProp: keyof React.CSSProperties) => {
    if (!prop) return;
    if (isCSSValue(prop)) {
      (inlineStyles as Record<string, string>)[styleProp as string] = prop;
    } else {
      classes.push(`${classPrefix}-${mapSpacing(prop)}`);
    }
  };

  // Padding
  handleSpacing(props.padding, 'p', 'padding');
  handleSpacing(props.paddingX, 'px', 'paddingLeft'); // px maps to both paddingLeft and paddingRight
  if (props.paddingX && isCSSValue(props.paddingX)) {
    inlineStyles.paddingRight = props.paddingX;
  }
  handleSpacing(props.paddingY, 'py', 'paddingTop'); // py maps to both paddingTop and paddingBottom
  if (props.paddingY && isCSSValue(props.paddingY)) {
    inlineStyles.paddingBottom = props.paddingY;
  }
  handleSpacing(props.paddingTop, 'pt', 'paddingTop');
  handleSpacing(props.paddingBottom, 'pb', 'paddingBottom');
  handleSpacing(props.paddingLeft, 'pl', 'paddingLeft');
  handleSpacing(props.paddingRight, 'pr', 'paddingRight');

  // Margin
  handleSpacing(props.margin, 'm', 'margin');
  handleSpacing(props.marginX, 'mx', 'marginLeft');
  if (props.marginX && isCSSValue(props.marginX)) {
    inlineStyles.marginRight = props.marginX;
  }
  handleSpacing(props.marginY, 'my', 'marginTop');
  if (props.marginY && isCSSValue(props.marginY)) {
    inlineStyles.marginBottom = props.marginY;
  }
  handleSpacing(props.marginTop, 'mt', 'marginTop');
  handleSpacing(props.marginBottom, 'mb', 'marginBottom');
  handleSpacing(props.marginLeft, 'ml', 'marginLeft');
  handleSpacing(props.marginRight, 'mr', 'marginRight');

  // Gap
  if (props.gap) {
    if (isCSSValue(props.gap)) {
      inlineStyles.gap = props.gap;
    } else {
      classes.push(`gap-${mapSpacing(props.gap)}`);
    }
  }

  // Theme Colors (Tailwind)
  // Note: 'background' value means "use page background" so we skip it to let the global background show through
  if (props.backgroundColor && props.backgroundColor !== 'background') {
    // Check if it's a hex/rgb color value or a Tailwind class name
    if (props.backgroundColor.startsWith('#') || props.backgroundColor.startsWith('rgb')) {
      inlineStyles.backgroundColor = props.backgroundColor;
    } else {
      classes.push(`bg-${props.backgroundColor}`);
    }
  }
  if (props.color) {
    // Check if it's a hex/rgb color value or a Tailwind class name
    if (props.color.startsWith('#') || props.color.startsWith('rgb')) {
      inlineStyles.color = props.color;
    } else {
      classes.push(`text-${props.color}`);
    }
  }

  // Custom Colors (Inline styles for hex values)
  if (props.bgColor) {
    inlineStyles.backgroundColor = props.bgColor;
  }
  if (props.textColor) {
    inlineStyles.color = props.textColor;
  }
  if (props.borderColor) {
    inlineStyles.borderColor = props.borderColor;
  }

  // Background Image
  if (props.backgroundImage) {
    inlineStyles.backgroundImage = `url(${props.backgroundImage})`;
    inlineStyles.backgroundSize = props.backgroundSize || 'cover';
    inlineStyles.backgroundPosition = (props.backgroundPosition || 'center').replace('-', ' ');
    inlineStyles.backgroundRepeat = props.backgroundRepeat || 'no-repeat';
  }

  // Background (for gradients and other CSS background values)
  if (props.background) {
    inlineStyles.background = props.background;
  }

  // Gradient Background (alias for background)
  if (props.gradient) {
    inlineStyles.background = props.gradient;
  }

  // Backdrop Filter (Glassmorphism)
  if (props.backdropBlur) {
    const blurMap: Record<string, string> = {
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px',
      '2xl': '24px',
      '3xl': '40px',
    };
    const blurValue = blurMap[props.backdropBlur] || props.backdropBlur;
    inlineStyles.backdropFilter = `blur(${blurValue})`;
    inlineStyles.WebkitBackdropFilter = `blur(${blurValue})`;
  }

  // Filter Blur
  if (props.blur) {
    const blurMap: Record<string, string> = {
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px',
    };
    const blurValue = blurMap[props.blur] || props.blur;
    inlineStyles.filter = `blur(${blurValue})`;
  }

  // Transform
  if (props.transform) {
    inlineStyles.transform = props.transform;
  }

  // Transition
  if (props.transition) {
    const transitionMap: Record<string, string> = {
      none: 'none',
      all: 'all 0.3s ease',
      colors: 'color, background-color, border-color 0.3s ease',
      transform: 'transform 0.3s ease',
      opacity: 'opacity 0.3s ease',
    };
    inlineStyles.transition = transitionMap[props.transition] || props.transition;
  }

  // Box Shadow Custom
  if (props.boxShadow) {
    inlineStyles.boxShadow = props.boxShadow;
  }

  // Aspect Ratio
  if (props.aspectRatio) {
    inlineStyles.aspectRatio = props.aspectRatio;
  }

  // Object Fit (for images)
  if (props.objectFit) {
    if (props.objectFit === 'contain' || props.objectFit === 'cover' || props.objectFit === 'fill' || props.objectFit === 'none' || props.objectFit === 'scale-down') {
      inlineStyles.objectFit = props.objectFit as React.CSSProperties['objectFit'];
    } else {
      classes.push(`object-${props.objectFit}`);
    }
  }

  // Typography - support both tokens and CSS values
  if (props.textAlign) {
    inlineStyles.textAlign = props.textAlign as React.CSSProperties['textAlign'];
  }
  if (props.fontSize) {
    if (isCSSValue(props.fontSize)) {
      inlineStyles.fontSize = props.fontSize;
    } else {
      classes.push(`text-${props.fontSize}`);
    }
  }
  if (props.fontWeight) {
    if (/^\d+$/.test(props.fontWeight)) {
      inlineStyles.fontWeight = parseInt(props.fontWeight) as React.CSSProperties['fontWeight'];
    } else {
      classes.push(`font-${props.fontWeight}`);
    }
  }
  if (props.lineHeight) {
    if (isCSSValue(props.lineHeight) || /^[\d.]+$/.test(props.lineHeight)) {
      inlineStyles.lineHeight = props.lineHeight;
    } else {
      classes.push(`leading-${props.lineHeight}`);
    }
  }
  if (props.letterSpacing) {
    if (isCSSValue(props.letterSpacing)) {
      inlineStyles.letterSpacing = props.letterSpacing;
    } else {
      classes.push(`tracking-${props.letterSpacing}`);
    }
  }
  if (props.textDecoration) {
    inlineStyles.textDecoration = props.textDecoration;
  }
  if (props.textTransform) {
    const transformMap: Record<string, string> = {
      uppercase: 'uppercase',
      lowercase: 'lowercase',
      capitalize: 'capitalize',
      none: 'normal-case',
    };
    const transformClass = transformMap[props.textTransform];
    if (transformClass) classes.push(transformClass);
  }

  // Border - support both tokens and CSS values
  if (props.border) {
    inlineStyles.border = props.border;
  }
  if (props.borderBottom) {
    inlineStyles.borderBottom = props.borderBottom;
  }
  if (props.borderTop) {
    inlineStyles.borderTop = props.borderTop;
  }
  if (props.borderWidth) {
    if (isCSSValue(props.borderWidth)) {
      inlineStyles.borderWidth = props.borderWidth;
    } else {
      classes.push(`border-${props.borderWidth}`);
    }
  }
  if (props.borderRadius) {
    if (isCSSValue(props.borderRadius)) {
      inlineStyles.borderRadius = props.borderRadius;
    } else {
      classes.push(`rounded-${props.borderRadius}`);
    }
  }
  if (props.borderStyle) {
    const styleMap: Record<string, string> = {
      solid: 'border-solid',
      dashed: 'border-dashed',
      dotted: 'border-dotted',
      none: 'border-none',
    };
    const styleClass = styleMap[props.borderStyle];
    if (styleClass) classes.push(styleClass);
  }

  // Shadow
  if (props.shadow) {
    if (props.shadow === 'inner') {
      classes.push('shadow-inner');
    } else if (props.shadow === 'none') {
      classes.push('shadow-none');
    } else {
      classes.push(`shadow-${props.shadow}`);
    }
  }

  // Opacity (inline for precise control)
  if (props.opacity !== undefined && props.opacity !== 100) {
    inlineStyles.opacity = props.opacity / 100;
  }

  // Display - support both tokens and CSS values
  if (props.display) {
    // Use inline style for all display values for consistency
    inlineStyles.display = props.display as React.CSSProperties['display'];
  }

  // Position - support both tokens and CSS values
  if (props.position) {
    inlineStyles.position = props.position as React.CSSProperties['position'];
  }
  
  // Position values (top, left, right, bottom)
  if (props.top) {
    inlineStyles.top = props.top;
  }
  if (props.left) {
    inlineStyles.left = props.left;
  }
  if (props.right) {
    inlineStyles.right = props.right;
  }
  if (props.bottom) {
    inlineStyles.bottom = props.bottom;
  }

  // Z-Index (inline for arbitrary values)
  if (props.zIndex !== undefined) {
    inlineStyles.zIndex = props.zIndex;
  }

  // Overflow
  if (props.overflow) {
    classes.push(`overflow-${props.overflow}`);
  }
  if (props.overflowX) {
    classes.push(`overflow-x-${props.overflowX}`);
  }
  if (props.overflowY) {
    classes.push(`overflow-y-${props.overflowY}`);
  }

  // Dimensions (inline for arbitrary values)
  if (props.width) {
    inlineStyles.width = props.width;
  }
  if (props.height) {
    inlineStyles.height = props.height;
  }
  if (props.minWidth) {
    inlineStyles.minWidth = props.minWidth;
  }
  if (props.minHeight) {
    inlineStyles.minHeight = props.minHeight;
  }
  if (props.maxWidth && typeof props.maxWidth === 'string' && !['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', 'full', 'none'].includes(props.maxWidth)) {
    inlineStyles.maxWidth = props.maxWidth;
  } else if (props.maxWidth) {
    classes.push(`max-w-${props.maxWidth}`);
  }
  if (props.maxHeight) {
    inlineStyles.maxHeight = props.maxHeight;
  }

  // Flexbox - support both tokens and CSS values
  if (props.flexDirection) {
    // Direct CSS values like 'row', 'column'
    inlineStyles.flexDirection = props.flexDirection as React.CSSProperties['flexDirection'];
  }
  if (props.alignItems) {
    // Check for CSS values first
    const cssAlignValues = ['flex-start', 'flex-end', 'center', 'stretch', 'baseline'];
    if (cssAlignValues.includes(props.alignItems)) {
      inlineStyles.alignItems = props.alignItems as React.CSSProperties['alignItems'];
    } else {
      const alignMap: Record<string, string> = {
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
        stretch: 'items-stretch',
        baseline: 'items-baseline',
      };
      const alignClass = alignMap[props.alignItems];
      if (alignClass) classes.push(alignClass);
    }
  }
  if (props.justifyContent) {
    // Check for CSS values first
    const cssJustifyValues = ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'];
    if (cssJustifyValues.includes(props.justifyContent)) {
      inlineStyles.justifyContent = props.justifyContent as React.CSSProperties['justifyContent'];
    } else {
      const justifyMap: Record<string, string> = {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
        around: 'justify-around',
        evenly: 'justify-evenly',
      };
      const justifyClass = justifyMap[props.justifyContent];
      if (justifyClass) classes.push(justifyClass);
    }
  }
  if (props.flexWrap) classes.push(`flex-${props.flexWrap}`);
  if (props.flexGrow !== undefined) {
    inlineStyles.flexGrow = props.flexGrow;
  }
  if (props.flexShrink !== undefined) {
    inlineStyles.flexShrink = props.flexShrink;
  }

  // Align Self (for child in flex/grid)
  if (props.alignSelf) {
    const alignSelfMap: Record<string, string> = {
      start: 'self-start',
      center: 'self-center',
      end: 'self-end',
      stretch: 'self-stretch',
      auto: 'self-auto',
    };
    const alignSelfClass = alignSelfMap[props.alignSelf];
    if (alignSelfClass) classes.push(alignSelfClass);
  }

  // Justify Self (for child in grid)
  if (props.justifySelf) {
    const justifySelfMap: Record<string, string> = {
      start: 'justify-self-start',
      center: 'justify-self-center',
      end: 'justify-self-end',
      stretch: 'justify-self-stretch',
      auto: 'justify-self-auto',
    };
    const justifySelfClass = justifySelfMap[props.justifySelf];
    if (justifySelfClass) classes.push(justifySelfClass);
  }

  // Grid
  if (props.gridColumns) classes.push(`grid-cols-${props.gridColumns}`);
  if (props.gridRows) classes.push(`grid-rows-${props.gridRows}`);
  if (props.gridColumnSpan) classes.push(`col-span-${props.gridColumnSpan}`);
  if (props.gridRowSpan) classes.push(`row-span-${props.gridRowSpan}`);
  
  // Grid/Flex place-items (for centering)
  if (props.placeItems) {
    inlineStyles.placeItems = props.placeItems;
  }
  
  // Flex item - flex shorthand
  if (props.flex) {
    inlineStyles.flex = props.flex;
  }

  // Cursor - use inline style for flexibility
  if (props.cursor) {
    inlineStyles.cursor = props.cursor as React.CSSProperties['cursor'];
  }

  // Transition Duration (for hover effects)
  if (props.transitionDuration) {
    inlineStyles.transitionDuration = `${props.transitionDuration}ms`;
    inlineStyles.transitionProperty = 'all';
    inlineStyles.transitionTimingFunction = 'ease';
  }

  // Hover Properties (stored as CSS custom properties for :hover via class)
  const hoverStyles: Record<string, string> = {};
  if (props.hoverBackgroundColor) {
    hoverStyles['--hover-bg'] = props.hoverBackgroundColor;
    classes.push('hover-bg-custom');
  }
  if (props.hoverTextColor) {
    hoverStyles['--hover-color'] = props.hoverTextColor;
    classes.push('hover-color-custom');
  }
  if (props.hoverBorderColor) {
    hoverStyles['--hover-border'] = props.hoverBorderColor;
    classes.push('hover-border-custom');
  }
  if (props.hoverScale) {
    hoverStyles['--hover-scale'] = `${Number(props.hoverScale) / 100}`;
    classes.push('hover-scale-custom');
  }
  if (props.hoverShadow) {
    const shadowMap: Record<string, string> = {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
      glow: '0 0 20px 5px var(--hover-bg, rgba(255,255,255,0.3))',
    };
    hoverStyles['--hover-shadow'] = shadowMap[props.hoverShadow] || props.hoverShadow;
    classes.push('hover-shadow-custom');
  }
  if (props.hoverOpacity !== undefined) {
    hoverStyles['--hover-opacity'] = `${Number(props.hoverOpacity) / 100}`;
    classes.push('hover-opacity-custom');
  }

  // Merge hover styles into inline styles
  Object.assign(inlineStyles, hoverStyles);

  return { classes: classes.join(' '), inlineStyles };
}

function mapSpacing(token: string | undefined): string {
  if (!token) return '4';
  const map: Record<string, string> = {
    none: '0',
    xs: '1',
    sm: '2',
    md: '4',
    lg: '6',
    xl: '8',
    '2xl': '12',
    '3xl': '16',
    auto: 'auto',
  };
  return map[token] || '4';
}

// Check if a value is a CSS value (px, rem, %, etc.) vs a token
function isCSSValue(value: string | undefined): boolean {
  if (!value) return false;
  return value.includes('px') || value.includes('rem') || value.includes('%') || value.includes('em') || value.includes('vh') || value.includes('vw') || /^\d+$/.test(value);
}
