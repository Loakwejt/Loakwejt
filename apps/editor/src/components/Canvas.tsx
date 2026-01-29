import { useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useEditorStore, Breakpoint } from '../store/editor-store';
import { CanvasNode } from './CanvasNode';
import { useDndState } from './DndProvider';
import { cn } from '@builderly/ui';
import { Smartphone, Tablet, Monitor } from 'lucide-react';
import { generateCssVariables } from '@builderly/core';

// Device frames for responsive preview
const DEVICE_CONFIG: Record<Breakpoint, { width: string; icon: React.ReactNode; label: string }> = {
  desktop: { width: '100%', icon: <Monitor className="h-4 w-4" />, label: 'Desktop' },
  tablet: { width: '768px', icon: <Tablet className="h-4 w-4" />, label: 'Tablet' },
  mobile: { width: '375px', icon: <Smartphone className="h-4 w-4" />, label: 'Mobile' },
};

export function Canvas() {
  const { tree, breakpoint, zoom, isPreviewMode, selectNode, siteSettings } = useEditorStore();
  const { overId, activeId } = useDndState();

  const config = DEVICE_CONFIG[breakpoint];

  // Generate CSS variables from site settings
  const themeStyles = useMemo(() => {
    const cssVars = generateCssVariables(siteSettings);
    const { colors, typography, spacing } = siteSettings.theme;
    
    // Convert CSS variables to inline style object
    return {
      '--color-background': colors.background,
      '--color-foreground': colors.foreground,
      '--color-primary': colors.primary,
      '--color-primary-foreground': colors.primaryForeground,
      '--color-secondary': colors.secondary,
      '--color-secondary-foreground': colors.secondaryForeground,
      '--color-muted': colors.muted,
      '--color-muted-foreground': colors.mutedForeground,
      '--color-accent': colors.accent,
      '--color-accent-foreground': colors.accentForeground,
      '--color-card': colors.card,
      '--color-card-foreground': colors.cardForeground,
      '--color-border': colors.border,
      '--color-destructive': colors.destructive,
      '--color-success': colors.success,
      '--color-warning': colors.warning,
      '--font-family': typography.fontFamily,
      '--font-family-heading': typography.headingFontFamily,
      '--font-size-base': `${typography.baseFontSize}px`,
      '--line-height-base': typography.baseLineHeight,
      '--border-radius': spacing.borderRadius,
      '--container-max-width': spacing.containerMaxWidth,
      backgroundColor: colors.background,
      color: colors.foreground,
      fontFamily: typography.fontFamily,
      fontSize: `${typography.baseFontSize}px`,
      lineHeight: typography.baseLineHeight,
    } as React.CSSProperties;
  }, [siteSettings]);

  // Make canvas a drop target
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-root',
    data: {
      accepts: true,
      nodeId: 'root',
    },
  });

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Deselect when clicking canvas background
    if (e.target === e.currentTarget) {
      selectNode(null);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Device indicator */}
      {!isPreviewMode && (
        <div className="flex items-center justify-center gap-2 py-2 text-xs text-muted-foreground">
          {config.icon}
          <span>{config.label}</span>
          {breakpoint !== 'desktop' && (
            <span className="text-muted-foreground/60">({config.width})</span>
          )}
        </div>
      )}

      {/* Canvas container */}
      <div
        className={cn(
          'flex-1 flex justify-center overflow-auto p-4',
          !isPreviewMode && 'bg-[repeating-linear-gradient(45deg,#f5f5f5_0,#f5f5f5_1px,transparent_0,transparent_50%)] bg-[length:10px_10px]'
        )}
        onClick={handleCanvasClick}
      >
        {/* Device frame */}
        <div
          className={cn(
            'relative shadow-2xl overflow-hidden transition-all duration-300',
            breakpoint === 'mobile' && 'rounded-[2rem] border-[8px] border-gray-800',
            breakpoint === 'tablet' && 'rounded-xl border-[6px] border-gray-700',
            breakpoint === 'desktop' && 'rounded-lg',
            isPreviewMode ? '' : 'ring-1 ring-border',
            isOver && activeId && 'ring-2 ring-primary'
          )}
          style={{
            width: config.width,
            maxWidth: '100%',
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            minHeight: breakpoint === 'mobile' ? '667px' : breakpoint === 'tablet' ? '1024px' : '600px',
            backgroundColor: siteSettings.theme.colors.background,
          }}
        >
          {/* Notch for mobile */}
          {breakpoint === 'mobile' && !isPreviewMode && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-xl z-10" />
          )}

          {/* Content area with theme styles */}
          <div
            ref={setNodeRef}
            className={cn(
              'min-h-full h-full',
              breakpoint === 'mobile' && 'pt-8'
            )}
            style={themeStyles}
          >
            <CanvasNode node={tree.root} isRoot />
          </div>

          {/* Home indicator for mobile */}
          {breakpoint === 'mobile' && !isPreviewMode && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-300 rounded-full" />
          )}
        </div>
      </div>

      {/* Zoom indicator */}
      {zoom !== 100 && (
        <div className="absolute bottom-4 right-4 bg-background border rounded-md px-2 py-1 text-xs text-muted-foreground shadow">
          {zoom}%
        </div>
      )}
    </div>
  );
}
