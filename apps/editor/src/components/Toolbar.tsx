import { useState } from 'react';
import { Button, Separator, Badge, cn, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Input, Label } from '@builderly/ui';
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
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ListTree,
  LayoutTemplate,
  Settings,
  Keyboard,
  Component,
  History,
  Clock,
  Globe,
} from 'lucide-react';
import { useEditorStore, type Breakpoint } from '../store/editor-store';
import { TemplatePicker } from './TemplatePicker';

export function Toolbar() {
  const {
    pageName,
    siteName,
    workspaceId,
    siteId,
    pageId,
    tree,
    siteSettings,
    breakpoint,
    zoom,
    setBreakpoint,
    setZoom,
    isPaletteOpen,
    isInspectorOpen,
    isLayerPanelOpen,
    isLeftSidebarOpen,
    isSiteSettingsOpen,
    isPreviewMode,
    togglePalette,
    toggleInspector,
    toggleLayerPanel,
    toggleLeftSidebar,
    toggleSiteSettings,
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
  const [isTemplatePickerOpen, setIsTemplatePickerOpen] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [publishComment, setPublishComment] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');

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
      
      // Save page
      const pageResponse = await fetch(
        `${apiUrl}/api/workspaces/${workspaceId}/sites/${siteId}/pages/${pageId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ builderTree: tree }),
        }
      );

      if (!pageResponse.ok) {
        const errorData = await pageResponse.json().catch(() => ({}));
        console.error('Page save failed:', pageResponse.status, errorData);
        throw new Error(errorData.details || errorData.error || `Failed to save page (${pageResponse.status})`);
      }

      // Save site settings
      const settingsResponse = await fetch(
        `${apiUrl}/api/workspaces/${workspaceId}/sites/${siteId}/settings`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ settings: siteSettings }),
        }
      );

      if (!settingsResponse.ok) {
        const errorData = await settingsResponse.json().catch(() => ({}));
        console.error('Settings save failed:', settingsResponse.status, errorData);
        throw new Error(errorData.error || `Failed to save site settings (${settingsResponse.status})`);
      }

      setLastSaved(new Date());
    } catch (error) {
      console.error('Save error:', error);
      alert(error instanceof Error ? error.message : 'Fehler beim Speichern');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async (schedule?: boolean) => {
    if (!workspaceId || !siteId || !pageId) return;

    // Save first
    await handleSave();

    setIsPublishing(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const body: Record<string, unknown> = { comment: publishComment || 'Veröffentlicht aus dem Editor' };
      if (schedule && scheduledDate) {
        body.scheduledPublishAt = new Date(scheduledDate).toISOString();
      }

      const response = await fetch(
        `${apiUrl}/api/workspaces/${workspaceId}/sites/${siteId}/pages/${pageId}/publish`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        throw new Error('Veröffentlichung fehlgeschlagen');
      }

      const result = await response.json();
      if (result.scheduled) {
        alert(`Seite geplant für: ${new Date(result.scheduledAt).toLocaleString('de-DE')}`);
      } else {
        alert('Seite erfolgreich veröffentlicht!');
      }

      setPublishDialogOpen(false);
      setPublishComment('');
      setScheduledDate('');
    } catch (error) {
      console.error('Publish error:', error);
      alert('Veröffentlichung fehlgeschlagen');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <>
      {/* Preview Mode: Header is shown in Canvas, just show exit button */}
      {isPreviewMode ? (
        <div className="fixed top-4 right-4 z-[100]">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPreviewMode(false)}
            className="shadow-lg h-7 text-[11px]"
          >
            <Eye className="mr-1.5 h-3.5 w-3.5" />
            Vorschau beenden
          </Button>
        </div>
      ) : (
        /* Editor Mode: Photoshop-style compact toolbar */
        <header className="h-10 border-b border-border bg-[hsl(220,10%,16%)] flex items-center px-2 gap-2">
          {/* Logo & Page name */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
              <Layers className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="text-[11px] font-medium text-foreground/90 max-w-[120px] truncate">{pageName}</span>
            {isDirty && (
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" title="Ungespeicherte Änderungen" />
            )}
          </div>

          <div className="w-px h-5 bg-border" />

          {/* Undo/Redo */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={undo}
              disabled={!canUndo()}
              title="Rückgängig (Strg+Z)"
              className="h-7 w-7 rounded-[3px]"
            >
              <Undo2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={redo}
              disabled={!canRedo()}
              title="Wiederholen (Strg+Umschalt+Z)"
              className="h-7 w-7 rounded-[3px]"
            >
              <Redo2 className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="w-px h-5 bg-border" />

          {/* Templates */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsTemplatePickerOpen(true)}
            className="h-7 px-2 text-[11px] rounded-[3px] gap-1.5"
          >
            <LayoutTemplate className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Vorlagen</span>
          </Button>

          <div className="w-px h-5 bg-border" />

          {/* Breakpoint switcher - compact pills */}
          <div className="flex items-center bg-background/50 rounded-[3px] p-0.5">
            {breakpoints.map(({ value, icon: Icon, label }) => (
              <Button
                key={value}
                variant={breakpoint === value ? 'secondary' : 'ghost'}
                size="icon"
                className={cn(
                  "h-6 w-6 rounded-[2px]",
                  breakpoint === value && "bg-primary/20 text-primary"
                )}
                onClick={() => setBreakpoint(value)}
                title={label}
              >
                <Icon className="h-3.5 w-3.5" />
              </Button>
            ))}
          </div>

          <div className="w-px h-5 bg-border" />

          {/* Zoom controls - compact */}
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-[3px]"
              onClick={() => setZoom(zoom - 10)}
              disabled={zoom <= 25}
              title="Verkleinern"
            >
              <ZoomOut className="h-3 w-3" />
            </Button>
            <button
              className="text-[10px] font-medium w-10 text-center hover:bg-accent rounded-[3px] py-0.5"
              onClick={() => setZoom(100)}
              title="Zoom zurücksetzen"
            >
              {zoom}%
            </button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-[3px]"
              onClick={() => setZoom(zoom + 10)}
              disabled={zoom >= 200}
              title="Vergrößern"
            >
              <ZoomIn className="h-3 w-3" />
            </Button>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

      {/* Panel toggles - compact */}
      <div className="flex items-center gap-0.5">
        <Button
          variant={isLeftSidebarOpen ? 'secondary' : 'ghost'}
          size="icon"
          onClick={toggleLeftSidebar}
          title="Navigator-Panel"
          className={cn("h-7 w-7 rounded-[3px]", isLeftSidebarOpen && "bg-primary/20 text-primary")}
        >
          <PanelLeft className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant={isPaletteOpen ? 'secondary' : 'ghost'}
          size="icon"
          onClick={togglePalette}
          title="Komponenten"
          className={cn("h-7 w-7 rounded-[3px]", isPaletteOpen && "bg-primary/20 text-primary")}
        >
          <LayoutTemplate className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            window.dispatchEvent(new CustomEvent('toggle-symbols-panel'));
          }}
          title="Globale Symbole"
          className="h-7 w-7 rounded-[3px]"
        >
          <Component className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            window.dispatchEvent(new CustomEvent('toggle-history-panel'));
          }}
          title="Versionsverlauf"
          className="h-7 w-7 rounded-[3px]"
        >
          <History className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant={isInspectorOpen ? 'secondary' : 'ghost'}
          size="icon"
          onClick={toggleInspector}
          title="Inspektor ein/ausblenden"
          className={cn("h-7 w-7 rounded-[3px]", isInspectorOpen && "bg-primary/20 text-primary")}
        >
          <PanelRight className="h-3.5 w-3.5" />
        </Button>
        <div className="w-px h-5 bg-border mx-1" />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            window.dispatchEvent(new CustomEvent('open-keyboard-shortcuts'));
          }}
          title="Tastenkürzel (? drücken)"
          className="h-7 w-7 rounded-[3px]"
        >
          <Keyboard className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant={isSiteSettingsOpen ? 'secondary' : 'ghost'}
          size="sm"
          onClick={toggleSiteSettings}
          title="Website-Einstellungen"
          className={cn("h-7 px-2 text-[11px] rounded-[3px] gap-1.5", isSiteSettingsOpen && "bg-primary/20 text-primary")}
        >
          <Settings className="h-3.5 w-3.5" />
          <span className="hidden lg:inline">Einstellungen</span>
        </Button>
      </div>

      <div className="w-px h-5 bg-border" />

      {/* Preview */}
      <Button
        variant={isPreviewMode ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => setPreviewMode(!isPreviewMode)}
        className="h-7 px-2 text-[11px] rounded-[3px] gap-1.5"
      >
        <Eye className="h-3.5 w-3.5" />
        <span className="hidden md:inline">Vorschau</span>
      </Button>

      {/* Save */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSave}
        disabled={isSaving || !isDirty}
        className={cn(
          "h-7 px-2 text-[11px] rounded-[3px] gap-1.5",
          isDirty && "text-orange-400 hover:text-orange-300"
        )}
      >
        {isSaving ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : isDirty ? (
          <Save className="h-3.5 w-3.5" />
        ) : (
          <Check className="h-3.5 w-3.5 text-green-500" />
        )}
        <span className="hidden md:inline">{isSaving ? 'Speichern...' : isDirty ? 'Speichern' : 'Gespeichert'}</span>
      </Button>

      {/* Publish - accent button */}
      <Button 
        size="sm" 
        onClick={() => setPublishDialogOpen(true)} 
        disabled={isPublishing}
        className="h-7 px-3 text-[11px] rounded-[3px] gap-1.5 bg-primary hover:bg-primary/90"
      >
        {isPublishing ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Upload className="h-3.5 w-3.5" />
        )}
        <span className="hidden sm:inline">{isPublishing ? 'Wird veröffentlicht...' : 'Veröffentlichen'}</span>
      </Button>

      {/* Publish Dialog */}
      <Dialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Seite veröffentlichen</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Kommentar (optional)</Label>
              <Input
                value={publishComment}
                onChange={(e) => setPublishComment(e.target.value)}
                placeholder="Was wurde geändert?"
              />
            </div>
            <div>
              <Label>Zeitplanung (optional)</Label>
              <Input
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
              {scheduledDate && (
                <p className="text-xs text-muted-foreground mt-1">
                  Wird veröffentlicht am {new Date(scheduledDate).toLocaleString('de-DE')}
                </p>
              )}
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            {scheduledDate ? (
              <Button onClick={() => handlePublish(true)} disabled={isPublishing}>
                <Clock className="w-4 h-4 mr-2" />
                {isPublishing ? 'Planen...' : 'Planen'}
              </Button>
            ) : (
              <Button onClick={() => handlePublish(false)} disabled={isPublishing}>
                <Globe className="w-4 h-4 mr-2" />
                {isPublishing ? 'Veröffentlichen...' : 'Jetzt veröffentlichen'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Template Picker Dialog */}
      <TemplatePicker
        open={isTemplatePickerOpen}
        onOpenChange={setIsTemplatePickerOpen}
      />
        </header>
      )}

      {/* Template Picker Dialog (available in both modes) */}
      {isPreviewMode && (
        <TemplatePicker
          open={isTemplatePickerOpen}
          onOpenChange={setIsTemplatePickerOpen}
        />
      )}
    </>
  );
}
