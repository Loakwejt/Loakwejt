import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@builderly/ui';
import { Keyboard } from 'lucide-react';

interface ShortcutGroup {
  title: string;
  shortcuts: {
    keys: string[];
    description: string;
  }[];
}

const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    title: 'Allgemein',
    shortcuts: [
      { keys: ['?'], description: 'Tastenkürzel anzeigen' },
      { keys: ['Esc'], description: 'Auswahl aufheben' },
      { keys: ['Ctrl', 'S'], description: 'Seite speichern' },
      { keys: ['Ctrl', 'Z'], description: 'Rückgängig' },
      { keys: ['Ctrl', 'Shift', 'Z'], description: 'Wiederholen' },
      { keys: ['Ctrl', 'Y'], description: 'Wiederholen (alternativ)' },
    ],
  },
  {
    title: 'Komponenten',
    shortcuts: [
      { keys: ['Del'], description: 'Auswahl löschen' },
      { keys: ['Backspace'], description: 'Auswahl löschen (alternativ)' },
      { keys: ['Ctrl', 'D'], description: 'Auswahl duplizieren' },
    ],
  },
  {
    title: 'Ansicht',
    shortcuts: [
      { keys: ['Ctrl', '+'], description: 'Vergrößern' },
      { keys: ['Ctrl', '-'], description: 'Verkleinern' },
      { keys: ['Ctrl', '0'], description: 'Zoom zurücksetzen (100%)' },
    ],
  },
  {
    title: 'Panels',
    shortcuts: [
      { keys: ['Ctrl', 'B'], description: 'Palette ein/ausblenden' },
      { keys: ['Ctrl', 'I'], description: 'Inspector ein/ausblenden' },
      { keys: ['Ctrl', 'L'], description: 'Ebenen ein/ausblenden' },
    ],
  },
];

export interface KeyboardShortcutsDialogRef {
  open: () => void;
}

export const KeyboardShortcutsDialog = forwardRef<KeyboardShortcutsDialogRef>((_, ref) => {
  const [open, setOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
  }));

  // Register ? shortcut to open dialog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ? key (Shift + /)
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        // Don't trigger if typing in input
        if (
          document.activeElement?.tagName === 'INPUT' ||
          document.activeElement?.tagName === 'TEXTAREA'
        ) {
          return;
        }
        e.preventDefault();
        setOpen(true);
      }
    };

    // Listen for custom event from toolbar button
    const handleOpenEvent = () => setOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-keyboard-shortcuts', handleOpenEvent);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-keyboard-shortcuts', handleOpenEvent);
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Tastenkürzel
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {SHORTCUT_GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                {group.title}
              </h3>
              <div className="space-y-2">
                {group.shortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50"
                  >
                    <span className="text-sm">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <span key={keyIndex} className="flex items-center gap-1">
                          <kbd className="px-2 py-1 text-xs font-semibold bg-muted border border-border rounded shadow-sm min-w-[24px] text-center">
                            {key}
                          </kbd>
                          {keyIndex < shortcut.keys.length - 1 && (
                            <span className="text-muted-foreground text-xs">+</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <p className="text-xs text-muted-foreground text-center">
            Drücke <kbd className="px-1.5 py-0.5 text-xs bg-muted border rounded">?</kbd> um dieses Menü zu öffnen
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
});

KeyboardShortcutsDialog.displayName = 'KeyboardShortcutsDialog';
