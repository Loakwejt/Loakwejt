'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import {
  Button,
  Input,
  Card,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
  Badge,
} from '@builderly/ui';
import {
  Upload,
  Search,
  Grid,
  List,
  Trash2,
  Download,
  Image as ImageIcon,
  FileVideo,
  FileAudio,
  FileText,
  FolderOpen,
  X,
  Check,
  Loader2,
} from 'lucide-react';

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
  alt: string | null;
  folder: string | null;
  createdAt: string;
  uploadedBy: { id: string; name: string | null };
}

interface AssetsResponse {
  data: Asset[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  folders: string[];
}

export default function AssetsPage() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  const [assets, setAssets] = useState<Asset[]>([]);
  const [folders, setFolders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 0 });

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.set('search', search);
      if (currentFolder) queryParams.set('folder', currentFolder);
      if (typeFilter !== 'all') queryParams.set('mimeType', typeFilter);
      queryParams.set('page', String(pagination.page));
      queryParams.set('limit', '50');

      const response = await fetch(
        `/api/workspaces/${workspaceId}/assets?${queryParams}`,
        { credentials: 'include' }
      );

      if (!response.ok) throw new Error('Failed to fetch assets');

      const data: AssetsResponse = await response.json();
      setAssets(data.data);
      setFolders(data.folders);
      setPagination({
        page: data.pagination.page,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages,
      });
    } catch (error) {
      console.error('Error fetching assets:', error);
    } finally {
      setLoading(false);
    }
  }, [workspaceId, search, currentFolder, typeFilter, pagination.page]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);
        if (currentFolder) formData.append('folder', currentFolder);

        const response = await fetch(`/api/workspaces/${workspaceId}/assets/upload`, {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });

        if (!response.ok) {
          const error = await response.json();
          alert(`Failed to upload ${file.name}: ${error.error}`);
        }
      }
      fetchAssets();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (assetId: string) => {
    if (!confirm('Are you sure you want to delete this asset?')) return;

    try {
      const response = await fetch(`/api/workspaces/${workspaceId}/assets/${assetId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to delete asset');

      fetchAssets();
      setSelectedAsset(null);
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete asset');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <ImageIcon className="h-8 w-8" />;
    if (mimeType.startsWith('video/')) return <FileVideo className="h-8 w-8" />;
    if (mimeType.startsWith('audio/')) return <FileAudio className="h-8 w-8" />;
    return <FileText className="h-8 w-8" />;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Asset Manager</h1>
          <p className="text-muted-foreground">
            Manage your images, videos, and files
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="file"
            id="file-upload"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleUpload(e.target.files)}
          />
          <Button
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Upload Files
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
            <SelectItem value="audio">Audio</SelectItem>
            <SelectItem value="document">Documents</SelectItem>
          </SelectContent>
        </Select>

        {folders.length > 0 && (
          <Select
            value={currentFolder || 'root'}
            onValueChange={(v) => setCurrentFolder(v === 'root' ? null : v)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Folders" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="root">All Folders</SelectItem>
              {folders.map((folder) => (
                <SelectItem key={folder} value={folder}>
                  <FolderOpen className="inline h-4 w-4 mr-2" />
                  {folder}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <div className="flex items-center border rounded-md">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Assets Grid/List */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      ) : assets.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No assets found</h3>
          <p className="text-muted-foreground">
            Upload your first file to get started
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {assets.map((asset) => (
            <button
              key={asset.id}
              onClick={() => setSelectedAsset(asset)}
              className="group relative aspect-square rounded-lg border bg-muted overflow-hidden hover:ring-2 hover:ring-primary transition-all"
            >
              {asset.mimeType.startsWith('image/') ? (
                <img
                  src={asset.thumbnailUrl || asset.url}
                  alt={asset.alt || asset.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  {getFileIcon(asset.mimeType)}
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                <p className="text-white text-xs truncate">{asset.name}</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="border rounded-lg divide-y">
          {assets.map((asset) => (
            <button
              key={asset.id}
              onClick={() => setSelectedAsset(asset)}
              className="w-full flex items-center gap-4 p-4 hover:bg-muted transition-colors text-left"
            >
              <div className="w-12 h-12 rounded bg-muted flex items-center justify-center overflow-hidden">
                {asset.mimeType.startsWith('image/') ? (
                  <img
                    src={asset.thumbnailUrl || asset.url}
                    alt={asset.alt || asset.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getFileIcon(asset.mimeType)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{asset.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(asset.size)} • {asset.mimeType}
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                {new Date(asset.createdAt).toLocaleDateString()}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page <= 1}
            onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
          >
            Next
          </Button>
        </div>
      )}

      {/* Asset Detail Dialog */}
      <Dialog open={!!selectedAsset} onOpenChange={() => setSelectedAsset(null)}>
        <DialogContent className="max-w-2xl">
          {selectedAsset && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedAsset.name}</DialogTitle>
                <DialogDescription>{selectedAsset.fileName}</DialogDescription>
              </DialogHeader>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Preview */}
                <div className="aspect-square rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                  {selectedAsset.mimeType.startsWith('image/') ? (
                    <img
                      src={selectedAsset.url}
                      alt={selectedAsset.alt || selectedAsset.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="text-muted-foreground">
                      {getFileIcon(selectedAsset.mimeType)}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground">File Size</Label>
                    <p>{formatFileSize(selectedAsset.size)}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Type</Label>
                    <p>{selectedAsset.mimeType}</p>
                  </div>
                  {selectedAsset.width && selectedAsset.height && (
                    <div>
                      <Label className="text-muted-foreground">Dimensions</Label>
                      <p>
                        {selectedAsset.width} × {selectedAsset.height} px
                      </p>
                    </div>
                  )}
                  <div>
                    <Label className="text-muted-foreground">Uploaded</Label>
                    <p>{new Date(selectedAsset.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">URL</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={selectedAsset.url}
                        readOnly
                        className="text-xs"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          navigator.clipboard.writeText(selectedAsset.url);
                        }}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" asChild>
                      <a href={selectedAsset.url} download target="_blank">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(selectedAsset.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
