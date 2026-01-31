import { useState, useEffect, useCallback } from 'react';
import { useEditorStore } from '../store/editor-store';
import { 
  findNodeById, 
  cloneNode, 
  generateNodeId,
  DEFAULT_SYMBOL_CATEGORIES 
} from '@builderly/core';
import type { BuilderNode } from '@builderly/core';
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Textarea,
  cn,
  Separator,
} from '@builderly/ui';
import { 
  Component, 
  Plus, 
  Trash2, 
  Edit3, 
  Download, 
  RefreshCw,
  ChevronRight,
  Package,
  Loader2,
} from 'lucide-react';

interface Symbol {
  id: string;
  name: string;
  description?: string;
  category?: string;
  tree: BuilderNode;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface SymbolsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SymbolsPanel({ isOpen, onClose }: SymbolsPanelProps) {
  const { workspaceId, siteId, selectedNodeId, tree, addNode } = useEditorStore();
  
  const [symbols, setSymbols] = useState<Symbol[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingSymbol, setEditingSymbol] = useState<Symbol | null>(null);
  
  // Form states
  const [symbolName, setSymbolName] = useState('');
  const [symbolDescription, setSymbolDescription] = useState('');
  const [symbolCategory, setSymbolCategory] = useState('other');

  // Fetch symbols
  const fetchSymbols = useCallback(async () => {
    if (!workspaceId || !siteId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `/api/workspaces/${workspaceId}/sites/${siteId}/symbols`
      );
      
      if (!response.ok) {
        throw new Error('Fehler beim Laden der Symbole');
      }
      
      const data = await response.json();
      setSymbols(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
    } finally {
      setLoading(false);
    }
  }, [workspaceId, siteId]);

  useEffect(() => {
    if (isOpen && workspaceId && siteId) {
      fetchSymbols();
    }
  }, [isOpen, workspaceId, siteId, fetchSymbols]);

  // Create symbol from selected node
  const handleCreateSymbol = async () => {
    if (!workspaceId || !siteId || !selectedNodeId || !symbolName.trim()) return;
    
    const selectedNode = findNodeById(tree.root, selectedNodeId);
    if (!selectedNode) return;
    
    // Clone the node to get a clean copy
    const symbolTree = cloneNode(selectedNode, true);
    
    try {
      const response = await fetch(
        `/api/workspaces/${workspaceId}/sites/${siteId}/symbols`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: symbolName.trim(),
            description: symbolDescription.trim() || undefined,
            category: symbolCategory,
            tree: symbolTree,
          }),
        }
      );
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Fehler beim Erstellen');
      }
      
      // Refresh list
      await fetchSymbols();
      
      // Reset form
      setSymbolName('');
      setSymbolDescription('');
      setSymbolCategory('other');
      setCreateDialogOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
    }
  };

  // Insert symbol instance
  const handleInsertSymbol = (symbol: Symbol) => {
    const parentId = selectedNodeId || 'root';
    
    // Create a SymbolInstance node
    const instanceNode: BuilderNode = {
      id: generateNodeId(),
      type: 'SymbolInstance',
      props: {
        symbolId: symbol.id,
        isDetached: false,
      },
      style: { base: {} },
      actions: [],
      children: [],
    };
    
    // For now, we expand the symbol inline (copy the tree)
    // In future, we could render SymbolInstance directly
    const expandedNode = cloneNode(symbol.tree, true);
    expandedNode.meta = {
      ...expandedNode.meta,
      name: `Symbol: ${symbol.name}`,
    };
    
    // Use the store's addNode logic or direct tree manipulation
    // For simplicity, we'll add the expanded node directly
    addNode(parentId, expandedNode.type);
    
    // TODO: Implement proper symbol instance insertion
  };

  // Update symbol
  const handleUpdateSymbol = async () => {
    if (!workspaceId || !siteId || !editingSymbol) return;
    
    try {
      const response = await fetch(
        `/api/workspaces/${workspaceId}/sites/${siteId}/symbols/${editingSymbol.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: symbolName.trim(),
            description: symbolDescription.trim() || undefined,
            category: symbolCategory,
          }),
        }
      );
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Fehler beim Aktualisieren');
      }
      
      await fetchSymbols();
      setEditDialogOpen(false);
      setEditingSymbol(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
    }
  };

  // Delete symbol
  const handleDeleteSymbol = async (symbolId: string) => {
    if (!workspaceId || !siteId) return;
    
    if (!confirm('Möchten Sie dieses Symbol wirklich löschen?')) return;
    
    try {
      const response = await fetch(
        `/api/workspaces/${workspaceId}/sites/${siteId}/symbols/${symbolId}`,
        { method: 'DELETE' }
      );
      
      if (!response.ok) {
        throw new Error('Fehler beim Löschen');
      }
      
      await fetchSymbols();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
    }
  };

  // Open edit dialog
  const openEditDialog = (symbol: Symbol) => {
    setEditingSymbol(symbol);
    setSymbolName(symbol.name);
    setSymbolDescription(symbol.description || '');
    setSymbolCategory(symbol.category || 'other');
    setEditDialogOpen(true);
  };

  // Filter symbols by category
  const filteredSymbols = selectedCategory === 'all'
    ? symbols
    : symbols.filter(s => s.category === selectedCategory);

  // Group symbols by category
  const groupedSymbols = filteredSymbols.reduce((acc, symbol) => {
    const cat = symbol.category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(symbol);
    return acc;
  }, {} as Record<string, Symbol[]>);

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-12 bottom-0 w-80 bg-background border-l shadow-lg z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Component className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Globale Symbole</h2>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={fetchSymbols} title="Aktualisieren">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Create from selection button */}
        <Button
          className="w-full"
          onClick={() => setCreateDialogOpen(true)}
          disabled={!selectedNodeId || selectedNodeId === 'root'}
        >
          <Plus className="h-4 w-4 mr-2" />
          Aus Auswahl erstellen
        </Button>
        
        {!selectedNodeId || selectedNodeId === 'root' ? (
          <p className="text-xs text-muted-foreground mt-2">
            Wählen Sie eine Komponente aus, um ein Symbol zu erstellen
          </p>
        ) : null}
      </div>

      {/* Category filter */}
      <div className="p-4 border-b">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Kategorie filtern" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Kategorien</SelectItem>
            {DEFAULT_SYMBOL_CATEGORIES.map(cat => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Symbol list */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-destructive text-sm">{error}</p>
            <Button variant="ghost" size="sm" onClick={fetchSymbols} className="mt-2">
              Erneut versuchen
            </Button>
          </div>
        ) : symbols.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground text-sm">
              Noch keine Symbole erstellt
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              Wählen Sie eine Komponente aus und klicken Sie auf "Aus Auswahl erstellen"
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedSymbols).map(([category, categorySymbols]) => {
              const categoryInfo = DEFAULT_SYMBOL_CATEGORIES.find(c => c.id === category);
              return (
                <div key={category}>
                  <h3 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                    <span>{categoryInfo?.icon || '📦'}</span>
                    <span>{categoryInfo?.name || category}</span>
                    <span className="ml-auto">{categorySymbols.length}</span>
                  </h3>
                  <div className="space-y-2">
                    {categorySymbols.map(symbol => (
                      <div
                        key={symbol.id}
                        className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{symbol.name}</h4>
                            {symbol.description && (
                              <p className="text-xs text-muted-foreground truncate mt-0.5">
                                {symbol.description}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => openEditDialog(symbol)}
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteSymbol(symbol.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full mt-2"
                          onClick={() => handleInsertSymbol(symbol)}
                        >
                          <Download className="h-3.5 w-3.5 mr-1.5" />
                          Einfügen
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Symbol Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Neues Symbol erstellen</DialogTitle>
            <DialogDescription>
              Erstellen Sie ein wiederverwendbares Symbol aus der ausgewählten Komponente.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="symbol-name">Name</Label>
              <Input
                id="symbol-name"
                value={symbolName}
                onChange={(e) => setSymbolName(e.target.value)}
                placeholder="z.B. Header Navigation"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="symbol-description">Beschreibung (optional)</Label>
              <Textarea
                id="symbol-description"
                value={symbolDescription}
                onChange={(e) => setSymbolDescription(e.target.value)}
                placeholder="Kurze Beschreibung des Symbols..."
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="symbol-category">Kategorie</Label>
              <Select value={symbolCategory} onValueChange={setSymbolCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEFAULT_SYMBOL_CATEGORIES.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleCreateSymbol} disabled={!symbolName.trim()}>
              Symbol erstellen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Symbol Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Symbol bearbeiten</DialogTitle>
            <DialogDescription>
              Ändern Sie die Eigenschaften des Symbols.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-symbol-name">Name</Label>
              <Input
                id="edit-symbol-name"
                value={symbolName}
                onChange={(e) => setSymbolName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-symbol-description">Beschreibung (optional)</Label>
              <Textarea
                id="edit-symbol-description"
                value={symbolDescription}
                onChange={(e) => setSymbolDescription(e.target.value)}
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-symbol-category">Kategorie</Label>
              <Select value={symbolCategory} onValueChange={setSymbolCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEFAULT_SYMBOL_CATEGORIES.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleUpdateSymbol} disabled={!symbolName.trim()}>
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
