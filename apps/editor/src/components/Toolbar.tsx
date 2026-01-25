import { useState } from 'react';
import { Button, Separator, Badge } from '@builderly/ui';
import {
  Undo2,
  Redo2,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  Save,
  Layers,
  PanelLeft,
  PanelRight,
  Upload,
  Loader2,
  Check,
} from 'lucide-react';
import { useEditorStore, type Breakpoint } from '../store/editor-store';

export function Toolbar() {
  const {
    pageName,
    workspaceId,
    siteId,
    pageId,
    tree,
    breakpoint,
    setBreakpoint,
    isPaletteOpen,
    isInspectorOpen,
    isPreviewMode,
    togglePalette,
    toggleInspector,
    setPreviewMode,
    canUndo,
    canRedo,
    undo,
    redo,
    isDirty,
    isSaving,
    setSaving,
    setLastSaved,
  } = useEditorStore();

  const [isPublishing, setIsPublishing] = useState(false);

  const breakpoints: { value: Breakpoint; icon: typeof Monitor; label: string }[] = [
    { value: 'desktop', icon: Monitor, label: 'Desktop' },
    { value: 'tablet', icon: Tablet, label: 'Tablet' },
    { value: 'mobile', icon: Smartphone, label: 'Mobile' },
  ];

  const handleSave = async () => {
    if (!workspaceId || !siteId || !pageId) return;

    setSaving(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(
        `${apiUrl}/api/workspaces/${workspaceId}/sites/${siteId}/pages/${pageId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ builderTree: tree }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      setLastSaved(new Date());
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!workspaceId || !siteId || !pageId) return;

    // Save first
    await handleSave();

    setIsPublishing(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(
        `${apiUrl}/api/workspaces/${workspaceId}/sites/${siteId}/pages/${pageId}/publish`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ comment: 'Published from editor' }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to publish');
      }

      alert('Page published successfully!');
    } catch (error) {
      console.error('Publish error:', error);
      alert('Failed to publish page');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <header className="h-14 border-b bg-background flex items-center px-4 gap-4">
      {/* Logo & Page name */}
      <div className="flex items-center gap-3">
        <Layers className="h-6 w-6 text-primary" />
        <span className="font-semibold">{pageName}</span>
        {isDirty && (
          <Badge variant="secondary" className="text-xs">
            Unsaved
          </Badge>
        )}
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Undo/Redo */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={undo}
          disabled={!canUndo()}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={redo}
          disabled={!canRedo()}
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo2 className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Breakpoint switcher */}
      <div className="flex items-center gap-1 bg-muted rounded-md p-1">
        {breakpoints.map(({ value, icon: Icon, label }) => (
          <Button
            key={value}
            variant={breakpoint === value ? 'secondary' : 'ghost'}
            size="icon"
            className="h-7 w-7"
            onClick={() => setBreakpoint(value)}
            title={label}
          >
            <Icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Panel toggles */}
      <div className="flex items-center gap-1">
        <Button
          variant={isPaletteOpen ? 'secondary' : 'ghost'}
          size="icon"
          onClick={togglePalette}
          title="Toggle Components Panel"
        >
          <PanelLeft className="h-4 w-4" />
        </Button>
        <Button
          variant={isInspectorOpen ? 'secondary' : 'ghost'}
          size="icon"
          onClick={toggleInspector}
          title="Toggle Inspector Panel"
        >
          <PanelRight className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Preview */}
      <Button
        variant={isPreviewMode ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => setPreviewMode(!isPreviewMode)}
      >
        <Eye className="mr-2 h-4 w-4" />
        Preview
      </Button>

      {/* Save */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleSave}
        disabled={isSaving || !isDirty}
      >
        {isSaving ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : isDirty ? (
          <Save className="mr-2 h-4 w-4" />
        ) : (
          <Check className="mr-2 h-4 w-4" />
        )}
        {isSaving ? 'Saving...' : isDirty ? 'Save' : 'Saved'}
      </Button>

      {/* Publish */}
      <Button size="sm" onClick={handlePublish} disabled={isPublishing}>
        {isPublishing ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Upload className="mr-2 h-4 w-4" />
        )}
        {isPublishing ? 'Publishing...' : 'Publish'}
      </Button>
    </header>
  );
}
