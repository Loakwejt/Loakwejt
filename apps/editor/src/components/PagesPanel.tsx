'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Label, Badge, Separator, cn } from '@builderly/ui';
import { 
  FileText, 
  Plus, 
  Home, 
  ExternalLink, 
  Trash2, 
  Edit2, 
  Check, 
  X,
  ChevronRight,
  Loader2,
  FolderOpen
} from 'lucide-react';
import { useEditorStore } from '../store/editor-store';

interface Page {
  id: string;
  name: string;
  slug: string;
  isHomepage: boolean;
  publishedRevisionId: string | null;
  isDraft: boolean;
  updatedAt: string;
}

export function PagesPanel() {
  const { workspaceId, siteId, pageId, isLoadingPage } = useEditorStore();
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    if (workspaceId && siteId) {
      loadPages();
    }
  }, [workspaceId, siteId]);

  const loadPages = async () => {
    if (!workspaceId || !siteId) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `${apiUrl}/api/workspaces/${workspaceId}/sites/${siteId}/pages`,
        { credentials: 'include' }
      );
      if (response.ok) {
        const data = await response.json();
        // Handle both array response and object with pages property
        const pagesArray = Array.isArray(data) ? data : (data?.pages || data?.data || []);
        setPages(pagesArray);
      }
    } catch (error) {
      console.error('Error loading pages:', error);
      setPages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePage = async () => {
    if (!newPageName.trim() || !workspaceId || !siteId) return;

    try {
      const response = await fetch(
        `${apiUrl}/api/workspaces/${workspaceId}/sites/${siteId}/pages`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            name: newPageName,
            slug: newPageSlug || newPageName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            isHomepage: pages.length === 0,
          }),
        }
      );

      if (response.ok) {
        setNewPageName('');
        setNewPageSlug('');
        setIsCreating(false);
        loadPages();
      }
    } catch (error) {
      console.error('Error creating page:', error);
    }
  };

  const handleDeletePage = async (pageIdToDelete: string) => {
    if (!workspaceId || !siteId) return;
    if (!confirm('Möchtest du diese Seite wirklich löschen?')) return;

    try {
      const response = await fetch(
        `${apiUrl}/api/workspaces/${workspaceId}/sites/${siteId}/pages/${pageIdToDelete}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      if (response.ok) {
        loadPages();
      }
    } catch (error) {
      console.error('Error deleting page:', error);
    }
  };

  const openPage = async (pageToOpen: Page) => {
    if (!workspaceId || !siteId) return;
    // Smooth page switch using store's loadPage function
    const { loadPage } = useEditorStore.getState();
    await loadPage(workspaceId, siteId, pageToOpen.id);
  };

  const handleNameChange = (value: string) => {
    setNewPageName(value);
    setNewPageSlug(value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
  };

  if (!workspaceId || !siteId) {
    return (
      <div className="h-full flex items-center justify-center p-3 bg-[hsl(220,10%,14%)]">
        <div className="text-center">
          <FolderOpen className="h-6 w-6 mx-auto mb-1 opacity-40" />
          <p className="text-[10px] text-muted-foreground">Keine Website geladen</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[hsl(220,10%,14%)]">
      {/* Header - Photoshop style */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[hsl(220,10%,12%)] border-b border-border flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <FileText className="h-3 w-3 text-primary" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground/80">Seiten</span>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="h-5 w-5 rounded-[2px] hover:bg-accent flex items-center justify-center transition-colors"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>

      {/* Create New Page Form */}
      {isCreating && (
        <div className="p-2 border-b border-border bg-[hsl(220,10%,16%)] space-y-1.5">
          <div>
            <Label className="text-[10px] text-muted-foreground">Name</Label>
            <Input
              value={newPageName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Über uns"
              className="h-6 text-[11px] bg-input border-0 rounded-[3px] mt-0.5"
              autoFocus
            />
          </div>
          <div>
            <Label className="text-[10px] text-muted-foreground">Slug</Label>
            <Input
              value={newPageSlug}
              onChange={(e) => setNewPageSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              placeholder="about-us"
              className="h-6 text-[11px] bg-input border-0 rounded-[3px] mt-0.5"
            />
          </div>
          <div className="flex gap-1.5 pt-1">
            <Button size="sm" className="h-6 flex-1 text-[10px] rounded-[3px]" onClick={handleCreatePage}>
              <Check className="h-2.5 w-2.5 mr-1" />
              Erstellen
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-6 w-6 p-0 rounded-[3px]"
              onClick={() => {
                setIsCreating(false);
                setNewPageName('');
                setNewPageSlug('');
              }}
            >
              <X className="h-2.5 w-2.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Pages List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-3 text-center">
            <Loader2 className="h-4 w-4 mx-auto animate-spin text-muted-foreground" />
          </div>
        ) : pages.length === 0 ? (
          <div className="p-3 text-center">
            <FileText className="h-5 w-5 mx-auto mb-1 opacity-40" />
            <p className="text-[10px] text-muted-foreground">Noch keine Seiten</p>
            <button 
              className="text-[10px] text-primary hover:underline mt-0.5"
              onClick={() => setIsCreating(true)}
            >
              Erste Seite erstellen
            </button>
          </div>
        ) : (
          <div className="py-0.5">
            {pages.map((page) => {
              const isCurrentPage = page.id === pageId;
              const isLoadingThisPage = isLoadingPage && !isCurrentPage;
              
              return (
              <div
                key={page.id}
                className={cn(
                  'group flex items-center justify-between px-2 py-1 hover:bg-accent/50 cursor-pointer transition-all duration-200',
                  isCurrentPage && 'bg-primary/15 border-l-2 border-primary',
                  isLoadingThisPage && 'opacity-50 pointer-events-none'
                )}
                onClick={() => !isLoadingPage && openPage(page)}
              >
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  {isLoadingPage && !isCurrentPage ? (
                    <Loader2 className="h-3 w-3 text-primary animate-spin flex-shrink-0" />
                  ) : page.isHomepage ? (
                    <Home className="h-3 w-3 text-primary flex-shrink-0" />
                  ) : (
                    <FileText className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium truncate text-foreground/90">{page.name}</p>
                    <p className="text-[9px] text-muted-foreground truncate">/{page.slug}</p>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  {page.publishedRevisionId ? (
                    <span className="text-[8px] px-1 py-0.5 rounded-[2px] bg-green-500/20 text-green-400">Live</span>
                  ) : (
                    <span className="text-[8px] px-1 py-0.5 rounded-[2px] bg-muted text-muted-foreground">Entwurf</span>
                  )}
                  {page.id !== pageId && (
                    <button
                      className="h-5 w-5 rounded-[2px] hover:bg-destructive/20 hover:text-destructive flex items-center justify-center transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePage(page.id);
                      }}
                    >
                      <Trash2 className="h-2.5 w-2.5" />
                    </button>
                  )}
                </div>
              </div>
            );})}
          </div>
        )}
      </div>
    </div>
  );
}
