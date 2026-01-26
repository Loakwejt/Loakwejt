'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Button,
  Input,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Label,
  Textarea,
  Skeleton,
  Badge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@builderly/ui';
import {
  Database,
  Plus,
  Search,
  MoreVertical,
  Trash2,
  Edit,
  FileText,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { COLLECTION_TEMPLATES } from '@/lib/schema-validator';

interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  schema: Record<string, unknown>;
  siteId: string | null;
  createdAt: string;
  _count: { records: number };
  site?: { id: string; name: string } | null;
}

export default function CollectionsPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspaceId as string;

  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Form state
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('custom');

  const fetchCollections = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/workspaces/${workspaceId}/collections`,
        { credentials: 'include' }
      );

      if (!response.ok) throw new Error('Failed to fetch collections');

      const data = await response.json();
      setCollections(data.data || []);
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const handleCreate = async () => {
    if (!newName || !newSlug) return;

    setIsCreating(true);
    try {
      let schema = { fields: {} };
      if (selectedTemplate !== 'custom' && selectedTemplate in COLLECTION_TEMPLATES) {
        schema = COLLECTION_TEMPLATES[selectedTemplate as keyof typeof COLLECTION_TEMPLATES].schema;
      }

      const response = await fetch(`/api/workspaces/${workspaceId}/collections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: newName,
          slug: newSlug,
          description: newDescription || null,
          schema,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Failed to create collection');
        return;
      }

      const collection = await response.json();
      setIsCreateOpen(false);
      setNewName('');
      setNewSlug('');
      setNewDescription('');
      setSelectedTemplate('custom');
      router.push(`/dashboard/workspaces/${workspaceId}/collections/${collection.id}`);
    } catch (error) {
      console.error('Create error:', error);
      alert('Failed to create collection');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (collectionId: string) => {
    if (!confirm('Are you sure you want to delete this collection? All records will be permanently deleted.')) {
      return;
    }

    try {
      const response = await fetch(
        `/api/workspaces/${workspaceId}/collections/${collectionId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      if (!response.ok) throw new Error('Failed to delete collection');

      fetchCollections();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete collection');
    }
  };

  const filteredCollections = collections.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase())
  );

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Collections</h1>
          <p className="text-muted-foreground">
            Manage your CMS content collections
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Collection
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search collections..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Collections Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-lg" />
          ))}
        </div>
      ) : filteredCollections.length === 0 ? (
        <div className="text-center py-12">
          <Database className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No collections found</h3>
          <p className="text-muted-foreground">
            {search ? 'Try a different search term' : 'Create your first collection to get started'}
          </p>
          {!search && (
            <Button onClick={() => setIsCreateOpen(true)} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Create Collection
            </Button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCollections.map((collection) => (
            <Card key={collection.id} className="hover:border-primary transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{collection.name}</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(collection.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription className="line-clamp-2">
                  {collection.description || `Collection: ${collection.slug}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {collection._count.records} records
                    </span>
                    {collection.site && (
                      <Badge variant="secondary">{collection.site.name}</Badge>
                    )}
                  </div>
                  <Button asChild size="sm">
                    <Link href={`/dashboard/workspaces/${workspaceId}/collections/${collection.id}`}>
                      Manage
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Collection Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Collection</DialogTitle>
            <DialogDescription>
              Create a new content collection for your CMS
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Template</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">Custom (Empty)</SelectItem>
                  {Object.entries(COLLECTION_TEMPLATES).map(([key, template]) => (
                    <SelectItem key={key} value={key}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedTemplate !== 'custom' && selectedTemplate in COLLECTION_TEMPLATES && (
                <p className="text-xs text-muted-foreground mt-1">
                  {COLLECTION_TEMPLATES[selectedTemplate as keyof typeof COLLECTION_TEMPLATES].description}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  if (!newSlug || newSlug === generateSlug(newName.slice(0, -1))) {
                    setNewSlug(generateSlug(e.target.value));
                  }
                }}
                placeholder="Blog Posts"
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
                placeholder="blog-posts"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Used in API endpoints: /api/collections/{newSlug || 'slug'}/records
              </p>
            </div>

            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="A collection for storing blog posts..."
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!newName || !newSlug || isCreating}>
              {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Collection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
