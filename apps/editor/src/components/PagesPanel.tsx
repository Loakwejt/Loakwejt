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
  const { workspaceId, siteId, pageId } = useEditorStore();
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const editorUrl = window.location.origin;

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
    if (!confirm('Are you sure you want to delete this page?')) return;

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

  const openPage = (pageToOpen: Page) => {
    if (!workspaceId || !siteId) return;
    const url = `${editorUrl}?workspaceId=${workspaceId}&siteId=${siteId}&pageId=${pageToOpen.id}`;
    window.location.href = url;
  };

  const handleNameChange = (value: string) => {
    setNewPageName(value);
    setNewPageSlug(value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
  };

  if (!workspaceId || !siteId) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <FolderOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No site loaded</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b flex items-center justify-between">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          Pages
        </h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsCreating(true)}
          className="h-7 w-7 p-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Create New Page Form */}
      {isCreating && (
        <div className="p-3 border-b bg-muted/50 space-y-2">
          <div className="space-y-1">
            <Label className="text-xs">Page Name</Label>
            <Input
              value={newPageName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="About Us"
              className="h-8 text-sm"
              autoFocus
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">URL Slug</Label>
            <Input
              value={newPageSlug}
              onChange={(e) => setNewPageSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              placeholder="about-us"
              className="h-8 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="h-7 flex-1" onClick={handleCreatePage}>
              <Check className="h-3 w-3 mr-1" />
              Create
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="h-7"
              onClick={() => {
                setIsCreating(false);
                setNewPageName('');
                setNewPageSlug('');
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Pages List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center">
            <Loader2 className="h-5 w-5 mx-auto animate-spin text-muted-foreground" />
          </div>
        ) : pages.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No pages yet</p>
            <Button 
              variant="link" 
              size="sm" 
              className="mt-1"
              onClick={() => setIsCreating(true)}
            >
              Create your first page
            </Button>
          </div>
        ) : (
          <div className="py-1">
            {pages.map((page) => (
              <div
                key={page.id}
                className={cn(
                  'group flex items-center justify-between px-3 py-2 hover:bg-muted/50 cursor-pointer transition-colors',
                  page.id === pageId && 'bg-primary/10 border-r-2 border-primary'
                )}
                onClick={() => openPage(page)}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {page.isHomepage ? (
                    <Home className="h-4 w-4 text-primary flex-shrink-0" />
                  ) : (
                    <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{page.name}</p>
                    <p className="text-xs text-muted-foreground truncate">/{page.slug}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {page.publishedRevisionId ? (
                    <Badge variant="success" className="text-[10px] px-1 py-0">Live</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[10px] px-1 py-0">Draft</Badge>
                  )}
                  {page.id !== pageId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePage(page.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
