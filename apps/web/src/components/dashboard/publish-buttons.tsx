'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@builderly/ui';
import { Globe, Loader2, Check, Rocket } from 'lucide-react';

interface PublishButtonProps {
  workspaceId: string;
  pageId: string;
  pageName: string;
  isDraft: boolean;
}

export function PublishPageButton({ workspaceId, pageId, pageName, isDraft }: PublishButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePublish = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/workspaces/${workspaceId}/pages/${pageId}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: `${pageName} veröffentlicht` }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Fehler beim Veröffentlichen');
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        router.refresh();
      }, 1500);
    } catch (error) {
      console.error('Publish error:', error);
      alert(error instanceof Error ? error.message : 'Fehler beim Veröffentlichen');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Button size="sm" variant="outline" disabled className="text-green-600 border-green-600">
        <Check className="mr-1 h-3 w-3" />
        Veröffentlicht
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      variant={isDraft ? 'default' : 'outline'}
      onClick={handlePublish}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
      ) : (
        <Globe className="mr-1 h-3 w-3" />
      )}
      {isDraft ? 'Veröffentlichen' : 'Aktualisieren'}
    </Button>
  );
}

interface PublishAllButtonProps {
  workspaceId: string;
  pages: { id: string; name: string }[];
}

export function PublishAllButton({ workspaceId, pages }: PublishAllButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);

  const handlePublishAll = async () => {
    if (!confirm(`Alle ${pages.length} Seiten veröffentlichen und Website online stellen?`)) return;
    
    setLoading(true);
    setProgress(0);

    try {
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i]!;
        const res = await fetch(`/api/workspaces/${workspaceId}/pages/${page.id}/publish`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ comment: `${page.name} veröffentlicht (Batch)` }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(`Fehler bei "${page.name}": ${data.error}`);
        }

        setProgress(i + 1);
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        router.refresh();
      }, 2000);
    } catch (error) {
      console.error('Publish all error:', error);
      alert(error instanceof Error ? error.message : 'Fehler beim Veröffentlichen');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Button disabled className="bg-green-600 text-white">
        <Check className="mr-2 h-4 w-4" />
        Alle Seiten veröffentlicht!
      </Button>
    );
  }

  return (
    <Button onClick={handlePublishAll} disabled={loading || pages.length === 0}>
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {progress}/{pages.length} Seiten...
        </>
      ) : (
        <>
          <Rocket className="mr-2 h-4 w-4" />
          Website veröffentlichen
        </>
      )}
    </Button>
  );
}
