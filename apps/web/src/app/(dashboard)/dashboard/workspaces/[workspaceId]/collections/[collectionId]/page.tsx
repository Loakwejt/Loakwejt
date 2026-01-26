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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Checkbox,
} from '@builderly/ui';
import {
  ChevronLeft,
  Plus,
  Search,
  Trash2,
  Edit,
  Eye,
  Loader2,
  MoreHorizontal,
  Archive,
  CheckCircle,
  XCircle,
  Filter,
} from 'lucide-react';

interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  schema: { fields: Record<string, FieldDef> };
  _count: { records: number };
}

interface FieldDef {
  type: string;
  label: string;
  required?: boolean;
}

interface Record {
  id: string;
  data: Record<string, unknown>;
  slug: string | null;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  createdBy?: { id: string; name: string | null };
}

interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export default function CollectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspaceId as string;
  const collectionId = params.collectionId as string;

  const [collection, setCollection] = useState<Collection | null>(null);
  const [records, setRecords] = useState<Record[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({ total: 0, page: 1, pageSize: 20, hasMore: false });
  const [loading, setLoading] = useState(true);
  const [loadingRecords, setLoadingRecords] = useState(true);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(new Set());
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Record | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  const fetchCollection = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/workspaces/${workspaceId}/collections/${collectionId}`,
        { credentials: 'include' }
      );

      if (!response.ok) {
        if (response.status === 404) {
          router.push(`/dashboard/workspaces/${workspaceId}/collections`);
          return;
        }
        throw new Error('Failed to fetch collection');
      }

      const data = await response.json();
      setCollection(data);
    } catch (error) {
      console.error('Error fetching collection:', error);
    } finally {
      setLoading(false);
    }
  }, [workspaceId, collectionId, router]);

  const fetchRecords = useCallback(async () => {
    setLoadingRecords(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.set('page', String(pagination.page));
      queryParams.set('pageSize', String(pagination.pageSize));
      if (statusFilter !== 'all') queryParams.set('status', statusFilter);

      const response = await fetch(
        `/api/workspaces/${workspaceId}/collections/${collectionId}/records?${queryParams}`,
        { credentials: 'include' }
      );

      if (!response.ok) throw new Error('Failed to fetch records');

      const data = await response.json();
      setRecords(data.data || []);
      setPagination(prev => ({
        ...prev,
        total: data.meta.total,
        hasMore: data.meta.hasMore,
      }));
    } catch (error) {
      console.error('Error fetching records:', error);
    } finally {
      setLoadingRecords(false);
    }
  }, [workspaceId, collectionId, pagination.page, pagination.pageSize, statusFilter]);

  useEffect(() => {
    fetchCollection();
  }, [fetchCollection]);

  useEffect(() => {
    if (collection) {
      fetchRecords();
    }
  }, [collection, fetchRecords]);

  const handleCreateRecord = async () => {
    if (!collection) return;

    setIsCreating(true);
    try {
      const response = await fetch(
        `/api/workspaces/${workspaceId}/collections/${collectionId}/records`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            data: formData,
            slug: formData.slug as string || null,
            status: 'DRAFT',
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Failed to create record');
        return;
      }

      setIsCreateOpen(false);
      setFormData({});
      fetchRecords();
    } catch (error) {
      console.error('Create error:', error);
      alert('Failed to create record');
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateRecord = async () => {
    if (!editingRecord) return;

    setIsCreating(true);
    try {
      const response = await fetch(
        `/api/workspaces/${workspaceId}/collections/${collectionId}/records/${editingRecord.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            data: formData,
            slug: formData.slug as string || null,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Failed to update record');
        return;
      }

      setEditingRecord(null);
      setFormData({});
      fetchRecords();
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update record');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;

    try {
      const response = await fetch(
        `/api/workspaces/${workspaceId}/collections/${collectionId}/records/${recordId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      if (!response.ok) throw new Error('Failed to delete record');

      fetchRecords();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete record');
    }
  };

  const handleBulkAction = async (action: 'delete' | 'publish' | 'unpublish' | 'archive') => {
    if (selectedRecords.size === 0) return;

    const confirmMessage = action === 'delete'
      ? `Are you sure you want to delete ${selectedRecords.size} records?`
      : `Are you sure you want to ${action} ${selectedRecords.size} records?`;

    if (!confirm(confirmMessage)) return;

    try {
      const response = await fetch(
        `/api/workspaces/${workspaceId}/collections/${collectionId}/records/bulk`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            action,
            recordIds: Array.from(selectedRecords),
          }),
        }
      );

      if (!response.ok) throw new Error('Bulk operation failed');

      setSelectedRecords(new Set());
      fetchRecords();
    } catch (error) {
      console.error('Bulk action error:', error);
      alert('Bulk operation failed');
    }
  };

  const toggleSelectAll = () => {
    if (selectedRecords.size === records.length) {
      setSelectedRecords(new Set());
    } else {
      setSelectedRecords(new Set(records.map(r => r.id)));
    }
  };

  const toggleSelect = (recordId: string) => {
    const newSelected = new Set(selectedRecords);
    if (newSelected.has(recordId)) {
      newSelected.delete(recordId);
    } else {
      newSelected.add(recordId);
    }
    setSelectedRecords(newSelected);
  };

  const getDisplayValue = (record: Record, fieldName: string): string => {
    const value = record.data[fieldName];
    if (value === null || value === undefined) return '-';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'object') return JSON.stringify(value).slice(0, 50);
    return String(value).slice(0, 50);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return <Badge className="bg-green-500">Published</Badge>;
      case 'ARCHIVED':
        return <Badge variant="secondary">Archived</Badge>;
      default:
        return <Badge variant="outline">Draft</Badge>;
    }
  };

  const openEditDialog = (record: Record) => {
    setEditingRecord(record);
    setFormData(record.data);
  };

  const renderFormField = (fieldName: string, fieldDef: FieldDef) => {
    const value = formData[fieldName];

    switch (fieldDef.type) {
      case 'boolean':
        return (
          <div className="flex items-center gap-2">
            <Checkbox
              checked={!!value}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, [fieldName]: checked }))}
            />
            <Label>{fieldDef.label}</Label>
          </div>
        );

      case 'number':
        return (
          <div>
            <Label>{fieldDef.label}{fieldDef.required && ' *'}</Label>
            <Input
              type="number"
              value={value as number || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, [fieldName]: parseFloat(e.target.value) || 0 }))}
            />
          </div>
        );

      case 'richtext':
      case 'textarea':
        return (
          <div>
            <Label>{fieldDef.label}{fieldDef.required && ' *'}</Label>
            <Textarea
              value={value as string || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, [fieldName]: e.target.value }))}
              rows={4}
            />
          </div>
        );

      case 'select':
        return (
          <div>
            <Label>{fieldDef.label}{fieldDef.required && ' *'}</Label>
            <Input
              value={value as string || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, [fieldName]: e.target.value }))}
              placeholder={`Select ${fieldDef.label.toLowerCase()}`}
            />
          </div>
        );

      default:
        return (
          <div>
            <Label>{fieldDef.label}{fieldDef.required && ' *'}</Label>
            <Input
              value={value as string || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, [fieldName]: e.target.value }))}
            />
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!collection) {
    return null;
  }

  const schemaFields = Object.entries(collection.schema?.fields || {});
  const displayFields = schemaFields.slice(0, 4);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/dashboard/workspaces/${workspaceId}/collections`}
          className="text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{collection.name}</h1>
          <p className="text-muted-foreground">
            {collection.description || `Manage ${collection.name.toLowerCase()} records`}
          </p>
        </div>
        <Button onClick={() => { setIsCreateOpen(true); setFormData({}); }}>
          <Plus className="mr-2 h-4 w-4" />
          New Record
        </Button>
      </div>

      {/* Filters & Bulk Actions */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
            <SelectItem value="ARCHIVED">Archived</SelectItem>
          </SelectContent>
        </Select>

        {selectedRecords.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedRecords.size} selected
            </span>
            <Button variant="outline" size="sm" onClick={() => handleBulkAction('publish')}>
              <CheckCircle className="mr-1 h-4 w-4" />
              Publish
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleBulkAction('unpublish')}>
              <XCircle className="mr-1 h-4 w-4" />
              Unpublish
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleBulkAction('archive')}>
              <Archive className="mr-1 h-4 w-4" />
              Archive
            </Button>
            <Button variant="destructive" size="sm" onClick={() => handleBulkAction('delete')}>
              <Trash2 className="mr-1 h-4 w-4" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Records Table */}
      <Card>
        <CardContent className="p-0">
          {loadingRecords ? (
            <div className="p-8 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No records found</h3>
              <p className="text-muted-foreground">Create your first record to get started</p>
              <Button onClick={() => { setIsCreateOpen(true); setFormData({}); }} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Create Record
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedRecords.size === records.length && records.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  {displayFields.map(([fieldName, fieldDef]) => (
                    <TableHead key={fieldName}>{fieldDef.label}</TableHead>
                  ))}
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRecords.has(record.id)}
                        onCheckedChange={() => toggleSelect(record.id)}
                      />
                    </TableCell>
                    {displayFields.map(([fieldName]) => (
                      <TableCell key={fieldName} className="max-w-[200px] truncate">
                        {getDisplayValue(record, fieldName)}
                      </TableCell>
                    ))}
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(record.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(record)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDeleteRecord(record.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.total > pagination.pageSize && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page <= 1}
            onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {pagination.page} of {Math.ceil(pagination.total / pagination.pageSize)}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={!pagination.hasMore}
            onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
          >
            Next
          </Button>
        </div>
      )}

      {/* Create/Edit Record Dialog */}
      <Dialog
        open={isCreateOpen || !!editingRecord}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false);
            setEditingRecord(null);
            setFormData({});
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRecord ? 'Edit Record' : 'Create Record'}
            </DialogTitle>
            <DialogDescription>
              {editingRecord ? 'Update the record data below' : 'Fill in the fields to create a new record'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {schemaFields.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>This collection has no schema defined.</p>
                <p className="text-sm">Add fields to the collection schema to enable record creation.</p>
              </div>
            ) : (
              schemaFields.map(([fieldName, fieldDef]) => (
                <div key={fieldName}>
                  {renderFormField(fieldName, fieldDef)}
                </div>
              ))
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateOpen(false);
                setEditingRecord(null);
                setFormData({});
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={editingRecord ? handleUpdateRecord : handleCreateRecord}
              disabled={isCreating}
            >
              {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingRecord ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
