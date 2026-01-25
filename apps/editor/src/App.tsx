import { useEffect } from 'react';
import { TooltipProvider } from '@builderly/ui';
import { Toolbar } from './components/Toolbar';
import { Palette } from './components/Palette';
import { Canvas } from './components/Canvas';
import { Inspector } from './components/Inspector';
import { useEditorStore } from './store/editor-store';

// Initialize component registry
import '@builderly/core/registry';

function App() {
  const {
    isPaletteOpen,
    isInspectorOpen,
    isPreviewMode,
    setPageContext,
    setTree,
    setPageName,
  } = useEditorStore();

  // Load page data from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const workspaceId = params.get('workspaceId');
    const siteId = params.get('siteId');
    const pageId = params.get('pageId');

    if (workspaceId && siteId && pageId) {
      setPageContext(workspaceId, siteId, pageId);
      loadPage(workspaceId, siteId, pageId);
    }
  }, [setPageContext, setTree, setPageName]);

  const loadPage = async (workspaceId: string, siteId: string, pageId: string) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(
        `${apiUrl}/api/workspaces/${workspaceId}/sites/${siteId}/pages/${pageId}`,
        { credentials: 'include' }
      );

      if (!response.ok) {
        throw new Error('Failed to load page');
      }

      const page = await response.json();
      setPageName(page.name);
      
      if (page.builderTree) {
        setTree(page.builderTree);
      }
    } catch (error) {
      console.error('Error loading page:', error);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for meta/ctrl key
      const isMod = e.metaKey || e.ctrlKey;

      if (isMod && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        useEditorStore.getState().undo();
      }
      if (isMod && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        useEditorStore.getState().redo();
      }
      if (isMod && e.key === 'y') {
        e.preventDefault();
        useEditorStore.getState().redo();
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const { selectedNodeId } = useEditorStore.getState();
        if (selectedNodeId && selectedNodeId !== 'root') {
          // Only delete if not focused on an input
          if (document.activeElement?.tagName !== 'INPUT' && 
              document.activeElement?.tagName !== 'TEXTAREA') {
            e.preventDefault();
            useEditorStore.getState().deleteNode(selectedNodeId);
          }
        }
      }
      if (e.key === 'Escape') {
        useEditorStore.getState().selectNode(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col bg-muted/30">
        {/* Toolbar */}
        <Toolbar />

        {/* Main editor area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left sidebar - Palette */}
          {isPaletteOpen && !isPreviewMode && (
            <aside className="w-64 border-r bg-background overflow-y-auto">
              <Palette />
            </aside>
          )}

          {/* Center - Canvas */}
          <main className="flex-1 overflow-auto bg-muted/50 p-4">
            <Canvas />
          </main>

          {/* Right sidebar - Inspector */}
          {isInspectorOpen && !isPreviewMode && (
            <aside className="w-80 border-l bg-background overflow-y-auto">
              <Inspector />
            </aside>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}

export default App;
