import { useEffect, useState } from 'react';
import { TooltipProvider } from '@builderly/ui';
import { Toolbar } from './components/Toolbar';
import { Canvas } from './components/Canvas';
import { RightSidebar } from './components/RightSidebar';
import { LeftSidebar } from './components/LeftSidebar';
import { DndProvider } from './components/DndProvider';
import { SiteSettingsPanel } from './components/SiteSettingsPanel';
import { KeyboardShortcutsDialog } from './components/KeyboardShortcutsDialog';
import { SymbolsPanel } from './components/SymbolsPanel';
import { HistoryPanel } from './components/HistoryPanel';
import { useEditorStore } from './store/editor-store';
import { mergeSiteSettings } from '@builderly/core';

// Initialize component registry
import '@builderly/core/registry';

function App() {
  const [isSymbolsPanelOpen, setIsSymbolsPanelOpen] = useState(false);
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(false);
  
  const {
    isInspectorOpen,
    isPreviewMode,
    isLeftSidebarOpen,
    toggleLeftSidebar,
    setPageContext,
    setTree,
    setPageName,
    setSiteData,
    setWorkspaceType,
  } = useEditorStore();

  // Load page data from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const workspaceId = params.get('workspaceId');
    const pageId = params.get('pageId');
    const templateId = params.get('templateId');

    // Template-Import per templateId (Port 5173, z.B. aus Admin-Panel)
    if (templateId) {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      fetch(`${apiUrl}/api/templates?templateId=${templateId}`)
        .then(res => res.json())
        .then(data => {
          // Finde das Template (DB-Id oder db-Id)
          const tpl = (data.data || []).find((t: any) => t.id === templateId || t.id === `db-${templateId}`);
          if (tpl && tpl.tree) {
            setTree(tpl.tree);
            setPageName(tpl.name || 'Template');
          }
        })
        .catch(err => {
          console.error('Fehler beim Laden des Templates:', err);
        });
      return; // Wenn Template, laden wir keine Seite
    }

    if (workspaceId && pageId) {
      setPageContext(workspaceId, pageId);
      loadPage(workspaceId, pageId);
      // Fetch workspace products for live data in Canvas
      useEditorStore.getState().fetchWorkspaceProducts();
    }

  }, [setPageContext, setTree, setPageName, setSiteData]);

  const loadPage = async (workspaceId: string, pageId: string) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(
        `${apiUrl}/api/workspaces/${workspaceId}/pages/${pageId}`,
        { credentials: 'include' }
      );

      if (response.status === 401) {
        // Not authenticated — redirect to login with return URL
        const returnUrl = encodeURIComponent(window.location.href);
        window.location.href = `${apiUrl}/login?callbackUrl=${returnUrl}`;
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to load page (${response.status})`);
      }

      const page = await response.json();
      setPageName(page.name);
      
      // Set workspace type for template filtering
      if (page.workspaceType) {
        setWorkspaceType(page.workspaceType);
      }
      
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

      // Undo
      if (isMod && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        useEditorStore.getState().undo();
      }
      // Redo (Ctrl+Shift+Z or Ctrl+Y)
      if (isMod && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        useEditorStore.getState().redo();
      }
      if (isMod && e.key === 'y') {
        e.preventDefault();
        useEditorStore.getState().redo();
      }
      // Delete
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
      // Duplicate (Ctrl+D)
      if (isMod && e.key === 'd') {
        e.preventDefault();
        const { selectedNodeId } = useEditorStore.getState();
        if (selectedNodeId && selectedNodeId !== 'root') {
          useEditorStore.getState().duplicateNode(selectedNodeId);
        }
      }
      // Save (Ctrl+S)
      if (isMod && e.key === 's') {
        e.preventDefault();
        // Trigger save via toolbar
        document.querySelector<HTMLButtonElement>('[data-save-button]')?.click();
      }
      // Escape to deselect
      if (e.key === 'Escape') {
        useEditorStore.getState().selectNode(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Listen for symbols panel toggle event
  useEffect(() => {
    const handleToggleSymbols = () => {
      setIsSymbolsPanelOpen(prev => !prev);
    };
    
    window.addEventListener('toggle-symbols-panel', handleToggleSymbols);
    return () => window.removeEventListener('toggle-symbols-panel', handleToggleSymbols);
  }, []);

  // Listen for history panel toggle event
  useEffect(() => {
    const handleToggleHistory = () => {
      setIsHistoryPanelOpen(prev => !prev);
    };
    
    window.addEventListener('toggle-history-panel', handleToggleHistory);
    return () => window.removeEventListener('toggle-history-panel', handleToggleHistory);
  }, []);

  return (
    <TooltipProvider>
      <DndProvider>
        <div className="h-screen flex flex-col bg-background overflow-hidden">
          {/* Toolbar - Compact Photoshop style */}
          <Toolbar />

          {/* Main editor area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left sidebar - Pages, Layers, Components */}
            {!isPreviewMode && (
              <LeftSidebar 
                isCollapsed={!isLeftSidebarOpen}
                onToggleCollapse={toggleLeftSidebar}
              />
            )}

            {/* Center - Canvas with checkerboard */}
            <main className="flex-1 overflow-auto relative editor-canvas">
              <Canvas />
            </main>

            {/* Right sidebar - Components & Inspector */}
            {!isPreviewMode && (
              <aside 
                className={`flex flex-col flex-shrink-0 overflow-hidden border-l border-border bg-[hsl(220,10%,14%)] transition-all duration-300 ease-in-out ${
                  isInspectorOpen 
                    ? 'w-80 translate-x-0 opacity-100' 
                    : 'w-0 translate-x-full opacity-0 border-l-0 pointer-events-none'
                }`}
              >
                <RightSidebar />
              </aside>
            )}
          </div>

          {/* Site Settings Panel (Sheet/Drawer) */}
          <SiteSettingsPanel />
          
          {/* Keyboard Shortcuts Dialog */}
          <KeyboardShortcutsDialog />
          
          {/* Symbols Panel */}
          <SymbolsPanel 
            isOpen={isSymbolsPanelOpen} 
            onClose={() => setIsSymbolsPanelOpen(false)} 
          />
          
          {/* History Panel */}
          <HistoryPanel 
            isOpen={isHistoryPanelOpen} 
            onClose={() => setIsHistoryPanelOpen(false)} 
          />
        </div>
      </DndProvider>
    </TooltipProvider>
  );
}

export default App;
