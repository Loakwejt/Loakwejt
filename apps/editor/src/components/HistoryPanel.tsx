import { useState, useEffect, useCallback } from 'react';
import { useEditorStore } from '../store/editor-store';
import type { BuilderTree } from '@builderly/core';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  ScrollArea,
  Separator,
  Badge,
  cn,
} from '@builderly/ui';
import { 
  History, 
  RotateCcw, 
  Eye, 
  X, 
  ChevronRight,
  Loader2,
  Clock,
  User,
  AlertCircle,
} from 'lucide-react';

interface Revision {
  id: string;
  version: number;
  comment?: string;
  createdAt: string;
  createdBy: {
    id: string;
    name?: string;
    email: string;
  };
}

interface RevisionDetail extends Revision {
  builderTree: BuilderTree;
}

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HistoryPanel({ isOpen, onClose }: HistoryPanelProps) {
  const { 
    workspaceId, 
    pageId, 
    setTree, 
    tree 
  } = useEditorStore();
  
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRevision, setSelectedRevision] = useState<Revision | null>(null);
  const [previewRevision, setPreviewRevision] = useState<RevisionDetail | null>(null);
  const [restoring, setRestoring] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  
  // Store original tree for preview reset
  const [originalTree, setOriginalTree] = useState<BuilderTree | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);

  // Fetch revisions
  const fetchRevisions = useCallback(async () => {
    if (!workspaceId || !pageId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(
        `${apiUrl}/api/workspaces/${workspaceId}/pages/${pageId}/revisions`,
        { credentials: 'include' }
      );
      
      if (!response.ok) {
        throw new Error('Fehler beim Laden der Versionen');
      }
      
      const data = await response.json();
      setRevisions(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
    } finally {
      setLoading(false);
    }
  }, [workspaceId, pageId]);

  useEffect(() => {
    if (isOpen) {
      fetchRevisions();
      setOriginalTree(tree);
    } else {
      // Reset preview when closing
      if (isPreviewing && originalTree) {
        setTree(originalTree);
        setIsPreviewing(false);
      }
      setSelectedRevision(null);
      setPreviewRevision(null);
    }
  }, [isOpen, fetchRevisions]);

  // Preview a revision
  const handlePreview = async (revision: Revision) => {
    if (!workspaceId || !pageId) return;
    
    setSelectedRevision(revision);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(
        `${apiUrl}/api/workspaces/${workspaceId}/pages/${pageId}/revisions/${revision.id}`,
        { credentials: 'include' }
      );
      
      if (!response.ok) {
        throw new Error('Fehler beim Laden der Version');
      }
      
      const data = await response.json();
      const revisionDetail = data.data as RevisionDetail;
      setPreviewRevision(revisionDetail);
      
      // Store original tree before first preview
      if (!isPreviewing) {
        setOriginalTree(tree);
      }
      
      // Apply preview
      setTree(revisionDetail.builderTree);
      setIsPreviewing(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
    }
  };

  // Reset to current version
  const handleResetPreview = () => {
    if (originalTree) {
      setTree(originalTree);
      setIsPreviewing(false);
      setSelectedRevision(null);
      setPreviewRevision(null);
    }
  };

  // Restore a revision
  const handleRestore = async () => {
    if (!workspaceId || !pageId || !selectedRevision) return;
    
    setRestoring(true);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(
        `${apiUrl}/api/workspaces/${workspaceId}/pages/${pageId}/rollback`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ revisionId: selectedRevision.id }),
        }
      );
      
      if (!response.ok) {
        throw new Error('Fehler beim Wiederherstellen');
      }
      
      // The tree is already set from preview, update original
      setOriginalTree(tree);
      setIsPreviewing(false);
      setConfirmDialogOpen(false);
      
      // Refresh revisions list
      await fetchRevisions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
    } finally {
      setRestoring(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Gerade eben';
    if (diffMins < 60) return `vor ${diffMins} Min.`;
    if (diffHours < 24) return `vor ${diffHours} Std.`;
    if (diffDays < 7) return `vor ${diffDays} Tagen`;
    return formatDate(dateString);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed right-0 top-12 bottom-0 w-80 bg-background border-l shadow-lg z-50 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Versionsverlauf</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {isPreviewing && (
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="flex-1 justify-center">
                <Eye className="h-3 w-3 mr-1" />
                Vorschau: v{selectedRevision?.version}
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleResetPreview}
                className="shrink-0"
              >
                Zurücksetzen
              </Button>
            </div>
          )}
        </div>

        {/* Revisions list */}
        <ScrollArea className="flex-1">
          <div className="p-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <AlertCircle className="h-8 w-8 mx-auto text-destructive mb-2" />
                <p className="text-destructive text-sm">{error}</p>
                <Button variant="ghost" size="sm" onClick={fetchRevisions} className="mt-2">
                  Erneut versuchen
                </Button>
              </div>
            ) : revisions.length === 0 ? (
              <div className="text-center py-8">
                <History className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground text-sm">
                  Noch keine Versionen gespeichert
                </p>
                <p className="text-muted-foreground text-xs mt-1">
                  Versionen werden beim Veröffentlichen erstellt
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {revisions.map((revision, index) => (
                  <div
                    key={revision.id}
                    className={cn(
                      'p-3 rounded-lg border transition-colors cursor-pointer',
                      selectedRevision?.id === revision.id
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-accent/50',
                      index === 0 && 'border-green-500/50 bg-green-500/5'
                    )}
                    onClick={() => handlePreview(revision)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">v{revision.version}</span>
                          {index === 0 && (
                            <Badge variant="outline" className="text-green-600 border-green-500/50 text-xs">
                              Aktuell
                            </Badge>
                          )}
                        </div>
                        
                        {revision.comment && (
                          <p className="text-sm text-muted-foreground truncate mt-0.5">
                            {revision.comment}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatRelativeTime(revision.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {revision.createdBy.name || revision.createdBy.email.split('@')[0]}
                          </span>
                        </div>
                      </div>
                      
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer with restore button */}
        {selectedRevision && selectedRevision.id !== revisions[0]?.id && (
          <div className="p-4 border-t bg-muted/30">
            <Button 
              className="w-full"
              onClick={() => setConfirmDialogOpen(true)}
              disabled={restoring}
            >
              {restoring ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RotateCcw className="h-4 w-4 mr-2" />
              )}
              Version v{selectedRevision.version} wiederherstellen
            </Button>
          </div>
        )}
      </div>

      {/* Confirm Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Version wiederherstellen?</DialogTitle>
            <DialogDescription>
              Möchten Sie wirklich Version v{selectedRevision?.version} wiederherstellen? 
              Die aktuelle Version wird überschrieben.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setConfirmDialogOpen(false)}
              disabled={restoring}
            >
              Abbrechen
            </Button>
            <Button 
              onClick={handleRestore}
              disabled={restoring}
            >
              {restoring ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RotateCcw className="h-4 w-4 mr-2" />
              )}
              Wiederherstellen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
