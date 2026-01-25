import { useEditorStore } from '../store/editor-store';
import { CanvasNode } from './CanvasNode';
import { cn } from '@builderly/ui';

export function Canvas() {
  const { tree, breakpoint, zoom, isPreviewMode, selectNode } = useEditorStore();

  const breakpointWidth = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Deselect when clicking canvas background
    if (e.target === e.currentTarget) {
      selectNode(null);
    }
  };

  return (
    <div
      className="flex justify-center min-h-full"
      onClick={handleCanvasClick}
    >
      <div
        className={cn(
          'bg-background shadow-lg rounded-lg overflow-hidden transition-all',
          isPreviewMode ? '' : 'ring-1 ring-border'
        )}
        style={{
          width: breakpointWidth[breakpoint],
          maxWidth: '100%',
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'top center',
        }}
      >
        <CanvasNode node={tree.root} isRoot />
      </div>
    </div>
  );
}
