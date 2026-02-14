import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Skeleton,
} from '@builderly/ui';
import { Search, Upload, Image as ImageIcon, FileVideo, FileAudio, Loader2, X, Check, Folder, FolderOpen, Trash2, Copy } from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl: string | null;
  width: number | null;
  height: number | null;
  folder?: string;
}

interface AssetPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (asset: Asset) => void;
  workspaceId: string;
  siteId?: string;
  accept?: 'image' | 'video' | 'audio' | 'all';
}

const FOLDERS = [
  { id: '', label: 'Alle Dateien', icon: FolderOpen },
  { id: 'images', label: 'Bilder', icon: ImageIcon },
  { id: 'videos', label: 'Videos', icon: FileVideo },
  { id: 'audio', label: 'Audio', icon: FileAudio },
  { id: 'documents', label: 'Dokumente', icon: Folder },
];

export function AssetPicker({
  open,
  onOpenChange,
  onSelect,
  workspaceId,
  siteId,
  accept = 'all',
}: AssetPickerProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [activeFolder, setActiveFolder] = useState('');

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const fetchAssets = useCallback(async () => {
    if (!open) return;
    
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (siteId) params.set('siteId', siteId);
      if (accept !== 'all') params.set('mimeType', accept);
      if (activeFolder === 'images') params.set('mimeType', 'image');
      else if (activeFolder === 'videos') params.set('mimeType', 'video');
      else if (activeFolder === 'audio') params.set('mimeType', 'audio');
      else if (activeFolder === 'documents') params.set('mimeType', 'application');
      params.set('limit', '50');

      const response = await fetch(
        `${apiBase}/api/workspaces/${workspaceId}/assets?${params}`,
        { credentials: 'include' }
      );

      if (!response.ok) throw new Error('Failed to fetch assets');

      const data = await response.json();
      setAssets(data.data || []);
    } catch (error) {
      console.error('Error fetching assets:', error);
    } finally {
      setLoading(false);
    }
  }, [open, workspaceId, siteId, search, accept, apiBase, activeFolder]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);
        if (siteId) formData.append('siteId', siteId);

        const response = await fetch(
          `${apiBase}/api/workspaces/${workspaceId}/assets/upload`,
          {
            method: 'POST',
            body: formData,
            credentials: 'include',
          }
        );

        if (response.ok) {
          const asset = await response.json();
          // Auto-select the uploaded asset
          setSelectedAsset(asset);
        }
      }
      fetchAssets();
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSelect = () => {
    if (selectedAsset) {
      onSelect(selectedAsset);
      onOpenChange(false);
      setSelectedAsset(null);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <ImageIcon className="h-8 w-8" />;
    if (mimeType.startsWith('video/')) return <FileVideo className="h-8 w-8" />;
    if (mimeType.startsWith('audio/')) return <FileAudio className="h-8 w-8" />;
    return <ImageIcon className="h-8 w-8" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getAcceptString = () => {
    switch (accept) {
      case 'image':
        return 'image/*';
      case 'video':
        return 'video/*';
      case 'audio':
        return 'audio/*';
      default:
        return 'image/*,video/*,audio/*,application/pdf';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Datei auswählen</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="library" className="flex-1">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="library">Bibliothek</TabsTrigger>
            <TabsTrigger value="upload">Hochladen</TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Dateien suchen..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Folder filter */}
            <div className="flex gap-1 overflow-x-auto pb-1">
              {FOLDERS.map((f) => {
                const Icon = f.icon;
                return (
                  <Button
                    key={f.id}
                    variant={activeFolder === f.id ? 'default' : 'outline'}
                    size="sm"
                    className="text-xs shrink-0"
                    onClick={() => setActiveFolder(f.id)}
                  >
                    <Icon className="w-3.5 h-3.5 mr-1" />
                    {f.label}
                  </Button>
                );
              })}
            </div>

            {/* Assets Grid */}
            <div className="h-[400px] overflow-y-auto">
              {loading ? (
                <div className="grid grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-square rounded-lg" />
                  ))}
                </div>
              ) : assets.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Keine Dateien gefunden</h3>
                  <p className="text-sm text-muted-foreground">
                    Lade eine Datei hoch, um loszulegen
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-4">
                  {assets.map((asset) => (
                    <button
                      key={asset.id}
                      onClick={() => setSelectedAsset(asset)}
                      className={`relative aspect-square rounded-lg border-2 overflow-hidden transition-all ${
                        selectedAsset?.id === asset.id
                          ? 'border-primary ring-2 ring-primary'
                          : 'border-transparent hover:border-muted-foreground'
                      }`}
                    >
                      {asset.mimeType.startsWith('image/') ? (
                        <img
                          src={asset.thumbnailUrl || asset.url}
                          alt={asset.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                          {getFileIcon(asset.mimeType)}
                        </div>
                      )}
                      {selectedAsset?.id === asset.id && (
                        <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                        <p className="text-white text-xs truncate">{asset.name}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Asset Info */}
            {selectedAsset && (
              <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded bg-muted overflow-hidden">
                    {selectedAsset.mimeType.startsWith('image/') ? (
                      <img
                        src={selectedAsset.thumbnailUrl || selectedAsset.url}
                        alt={selectedAsset.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {getFileIcon(selectedAsset.mimeType)}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{selectedAsset.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(selectedAsset.size)}
                      {selectedAsset.width && selectedAsset.height && (
                        <> • {selectedAsset.width} × {selectedAsset.height}</>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedAsset.url);
                    }}
                    title="URL kopieren"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button onClick={handleSelect}>Auswählen</Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <input
              type="file"
              id="asset-upload"
              multiple
              accept={getAcceptString()}
              className="hidden"
              onChange={(e) => e.target.files && handleUpload(e.target.files)}
            />

            <div
              onClick={() => document.getElementById('asset-upload')?.click()}
              className="h-[400px] border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">Wird hochgeladen...</p>
                </>
              ) : (
                <>
                  <Upload className="h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">
                    Klicken oder Dateien hierher ziehen
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {accept === 'image' && 'PNG, JPG, GIF, WebP bis 10MB'}
                    {accept === 'video' && 'MP4, WebM bis 100MB'}
                    {accept === 'audio' && 'MP3, WAV, OGG bis 50MB'}
                    {accept === 'all' && 'Bilder, Videos, Audio, PDFs'}
                  </p>
                </>
              )}
            </div>

            {selectedAsset && (
              <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded bg-muted overflow-hidden">
                    {selectedAsset.mimeType.startsWith('image/') ? (
                      <img
                        src={selectedAsset.thumbnailUrl || selectedAsset.url}
                        alt={selectedAsset.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {getFileIcon(selectedAsset.mimeType)}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{selectedAsset.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Erfolgreich hochgeladen
                    </p>
                  </div>
                </div>
                <Button onClick={handleSelect}>Diese Datei verwenden</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
