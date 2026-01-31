import { useEffect, useState } from 'react';
import { TooltipProvider } from '@builderly/ui';
import { Toolbar } from './components/Toolbar';
import { Palette } from './components/Palette';
import { Canvas } from './components/Canvas';
import { Inspector } from './components/Inspector';
import { SidebarLayerPanel } from './components/SidebarLayerPanel';
import { PagesPanel } from './components/PagesPanel';
import { DndProvider } from './components/DndProvider';
import { SiteSettingsPanel } from './components/SiteSettingsPanel';
import { KeyboardShortcutsDialog } from './components/KeyboardShortcutsDialog';
import { SymbolsPanel } from './components/SymbolsPanel';
import { useEditorStore } from './store/editor-store';
import { mergeSiteSettings } from '@builderly/core';

// Initialize component registry
import '@builderly/core/registry';

function App() {
  const [isSymbolsPanelOpen, setIsSymbolsPanelOpen] = useState(false);
  
  const {
    isPaletteOpen,
    isInspectorOpen,
    isLayerPanelOpen,
    isPreviewMode,
    setPageContext,
    setTree,
    setPageName,
    setSiteData,
  } = useEditorStore();

  // Load page data from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const workspaceId = params.get('workspaceId');
    const siteId = params.get('siteId');
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

    if (workspaceId && siteId && pageId) {
      setPageContext(workspaceId, siteId, pageId);
      loadPage(workspaceId, siteId, pageId);
    }

  }, [setPageContext, setTree, setPageName, setSiteData]);

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

  return (
    <TooltipProvider>
      <DndProvider>
        <div className="h-screen flex flex-col bg-muted/30">
          {/* Toolbar */}
          <Toolbar />

          {/* Main editor area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left sidebar - Pages Panel + Palette */}
            {!isPreviewMode && (
              <aside className="w-64 border-r bg-background flex flex-col flex-shrink-0 overflow-hidden">
                {/* Pages Panel */}
                <div className="h-48 border-b overflow-auto flex-shrink-0">
                  <PagesPanel />
                </div>
                {/* Component Palette - scrollable */}
                {isPaletteOpen && (
                  <div className="flex-1 overflow-auto">
                    <Palette />
                  </div>
                )}
              </aside>
            )}

            {/* Center - Canvas */}
            <main className="flex-1 overflow-auto bg-muted/50 relative">
              <Canvas />
            </main>

            {/* Right sidebar - Inspector + Layers */}
            {isInspectorOpen && !isPreviewMode && (
              <aside className="w-80 border-l bg-background flex flex-col flex-shrink-0 overflow-hidden">
                {/* Inspector - top section */}
                <div className="flex-1 overflow-auto">
                  <Inspector />
                </div>
                {/* Layer Panel - bottom section */}
                <div className="h-64 flex-shrink-0">
                  <SidebarLayerPanel />
                </div>
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
        </div>
      </DndProvider>
    </TooltipProvider>
  );
}

export default App;
