'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Textarea,
} from '@builderly/ui';
import { Loader2, Plus } from 'lucide-react';

/* ================================================================== */
/* MAIN COMPONENT                                                      */
/* ================================================================== */

interface Props {
  workspaceId: string;
  children: React.ReactNode;
}

export function CreateSiteDialog({ workspaceId, children }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');

  // Reset on close
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setName('');
        setSlug('');
        setDescription('');
        setError('');
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  const handleNameChange = useCallback((value: string) => {
    const generatedSlug = value
      .toLowerCase()
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setName(value);
    setSlug(generatedSlug);
  }, []);

  const handleSubmit = async () => {
    if (!name.trim() || !slug.trim()) return;
    setIsLoading(true);
    setError('');
    try {
      const body: Record<string, unknown> = {
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim() || undefined,
      };

      const response = await fetch(`/api/workspaces/${workspaceId}/sites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const d = await response.json();
        throw new Error(d.error || 'Fehler beim Erstellen der Site');
      }
      const site = await response.json();
      setOpen(false);
      router.push(`/dashboard/workspaces/${workspaceId}/sites/${site.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setIsLoading(false);
    }
  };

  const isValid = name.trim().length > 0 && slug.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Neue Site erstellen</DialogTitle>
          <DialogDescription>
            Eine Site ist ein eigenständiges Design — eine visuelle Seite für deine
            Workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {error && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="site-name">Name *</Label>
            <Input
              id="site-name"
              placeholder="z. B. Startseite, Landingpage, Shop-Design"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              disabled={isLoading}
              autoFocus
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="site-slug">URL-Slug *</Label>
            <div className="flex items-center">
              <span className="px-3 py-2 bg-muted border border-r-0 rounded-l-md text-sm text-muted-foreground whitespace-nowrap">
                /s/
              </span>
              <Input
                id="site-slug"
                placeholder="meine-site"
                value={slug}
                onChange={(e) =>
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
                }
                required
                disabled={isLoading}
                className="rounded-l-none"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Erreichbar unter{' '}
              <span className="font-mono text-foreground">
                /s/{slug || 'dein-slug'}
              </span>
            </p>
          </div>

          {/* Description (optional) */}
          <div className="space-y-2">
            <Label htmlFor="site-desc">Beschreibung</Label>
            <Textarea
              id="site-desc"
              placeholder="Optional — kurze Beschreibung der Site"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              rows={2}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Abbrechen
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !isValid}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Wird erstellt…
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Site erstellen
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
