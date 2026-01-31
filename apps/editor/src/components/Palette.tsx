import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Input, Separator, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@builderly/ui';
import { Search, GripVertical, Sparkles } from 'lucide-react';
import { componentRegistry, type ComponentDefinition } from '@builderly/core';
import { useEditorStore } from '../store/editor-store';
import { cn } from '@builderly/ui';
import type { DragData } from './DndProvider';

// Icon mapping with colors
const ICON_MAP: Record<string, { icon: string; color: string }> = {
  layout: { icon: '📐', color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30' },
  type: { icon: '📝', color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30' },
  heading: { icon: '🔤', color: 'from-violet-500/20 to-violet-600/10 border-violet-500/30' },
  image: { icon: '🖼️', color: 'from-pink-500/20 to-pink-600/10 border-pink-500/30' },
  square: { icon: '⬜', color: 'from-gray-500/20 to-gray-600/10 border-gray-500/30' },
  layers: { icon: '📚', color: 'from-orange-500/20 to-orange-600/10 border-orange-500/30' },
  grid: { icon: '⊞', color: 'from-teal-500/20 to-teal-600/10 border-teal-500/30' },
  minus: { icon: '➖', color: 'from-gray-500/20 to-gray-600/10 border-gray-500/30' },
  'move-vertical': { icon: '↕️', color: 'from-slate-500/20 to-slate-600/10 border-slate-500/30' },
  smile: { icon: '😊', color: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30' },
  'credit-card': { icon: '💳', color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30' },
  tag: { icon: '🏷️', color: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30' },
  'alert-circle': { icon: '⚠️', color: 'from-amber-500/20 to-amber-600/10 border-amber-500/30' },
  'file-text': { icon: '📄', color: 'from-stone-500/20 to-stone-600/10 border-stone-500/30' },
  'text-cursor-input': { icon: '✏️', color: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/30' },
  'align-left': { icon: '≡', color: 'from-slate-500/20 to-slate-600/10 border-slate-500/30' },
  'chevron-down': { icon: '⌄', color: 'from-zinc-500/20 to-zinc-600/10 border-zinc-500/30' },
  'check-square': { icon: '☑️', color: 'from-green-500/20 to-green-600/10 border-green-500/30' },
  send: { icon: '📤', color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30' },
  menu: { icon: '☰', color: 'from-neutral-500/20 to-neutral-600/10 border-neutral-500/30' },
  'panel-bottom': { icon: '▬', color: 'from-stone-500/20 to-stone-600/10 border-stone-500/30' },
  link: { icon: '🔗', color: 'from-sky-500/20 to-sky-600/10 border-sky-500/30' },
  list: { icon: '📋', color: 'from-rose-500/20 to-rose-600/10 border-rose-500/30' },
  'chevrons-left-right': { icon: '⟷', color: 'from-fuchsia-500/20 to-fuchsia-600/10 border-fuchsia-500/30' },
  shield: { icon: '🛡️', color: 'from-red-500/20 to-red-600/10 border-red-500/30' },
  play: { icon: '▶️', color: 'from-red-500/20 to-red-600/10 border-red-500/30' },
  'map-pin': { icon: '📍', color: 'from-green-500/20 to-green-600/10 border-green-500/30' },
  share: { icon: '📱', color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30' },
  folder: { icon: '📁', color: 'from-amber-500/20 to-amber-600/10 border-amber-500/30' },
  file: { icon: '📄', color: 'from-gray-500/20 to-gray-600/10 border-gray-500/30' },
  loader: { icon: '⏳', color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30' },
  star: { icon: '⭐', color: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30' },
  hash: { icon: '#️⃣', color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30' },
  quote: { icon: '💬', color: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/30' },
  'message-circle': { icon: '💭', color: 'from-pink-500/20 to-pink-600/10 border-pink-500/30' },
  user: { icon: '👤', color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30' },
  megaphone: { icon: '📢', color: 'from-orange-500/20 to-orange-600/10 border-orange-500/30' },
  'chevron-right': { icon: '›', color: 'from-gray-500/20 to-gray-600/10 border-gray-500/30' },
  table: { icon: '📊', color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30' },
  code: { icon: '💻', color: 'from-zinc-500/20 to-zinc-600/10 border-zinc-500/30' },
  'git-branch': { icon: '🌿', color: 'from-green-500/20 to-green-600/10 border-green-500/30' },
  circle: { icon: '⚪', color: 'from-gray-500/20 to-gray-600/10 border-gray-500/30' },
  clock: { icon: '⏰', color: 'from-red-500/20 to-red-600/10 border-red-500/30' },
  'arrow-right': { icon: '→', color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30' },
};

// Component descriptions for tooltips
const COMPONENT_DESCRIPTIONS: Record<string, string> = {
  // Layout
  Section: 'Ein Container für große Seitenabschnitte. Perfekt für Hero-Bereiche, Features, oder Testimonials.',
  Container: 'Begrenzt den Inhalt auf eine maximale Breite und zentriert ihn. Ideal für lesbare Textbereiche.',
  Stack: 'Ordnet Elemente vertikal oder horizontal an mit flexiblem Abstand. Grundbaustein für Layouts.',
  Grid: 'Erstellt ein Raster-Layout mit Spalten. Perfekt für Karten, Galerien oder Feature-Listen.',
  Divider: 'Horizontale Trennlinie zwischen Inhalten.',
  Spacer: 'Unsichtbarer Abstandshalter für vertikalen Raum.',
  Accordion: 'Ausklappbare Inhaltsabschnitte zum Ein-/Ausklappen.',
  AccordionItem: 'Einzelnes ausklappbares Element innerhalb eines Accordions.',
  Tabs: 'Tab-Container für verschiedene Inhalte.',
  Tab: 'Einzelner Tab-Inhalt innerhalb von Tabs.',
  Carousel: 'Bildergalerie oder Inhalts-Slider mit Navigation.',
  Timeline: 'Vertikale Zeitleiste für Chronologie oder Prozesse.',
  TimelineItem: 'Einzelner Punkt auf der Timeline.',
  Marquee: 'Horizontal scrollender Text oder Logo-Band.',

  // Content
  Heading: 'Überschrift von H1 bis H6. Wichtig für SEO und Seitenstruktur.',
  Text: 'Normaler Fließtext für Absätze und Beschreibungen.',
  Link: 'Klickbarer Textlink für Navigation.',
  Icon: 'Dekoratives Icon aus der Lucide-Bibliothek.',
  Badge: 'Kleines Label für Tags, Status oder Kategorien.',
  Quote: 'Stilisiertes Zitat mit optionalem Autor.',
  Counter: 'Animierte Zahlenanzeige für Statistiken.',
  Progress: 'Fortschrittsbalken mit Prozentwert.',
  Rating: 'Sternebewertung für Rezensionen.',
  CodeBlock: 'Formatierter Code-Block mit Syntax-Highlighting.',
  Table: 'Tabelle für strukturierte Daten.',
  List: 'Aufzählungs- oder nummerierte Liste.',
  
  // UI
  Button: 'Interaktiver Button für Aktionen wie Links, Formulare oder Scroll-Navigation.',
  Card: 'Eine Box mit Rahmen und Schatten. Ideal für Produkte, Team-Mitglieder oder Features.',
  Alert: 'Hervorgehobene Nachricht für Warnungen oder Hinweise.',
  Avatar: 'Rundes Profilbild für Benutzer oder Team.',
  TrustBadge: 'Vertrauens-Symbol mit Icon und Text.',

  // Cards
  PricingCard: 'Preiskarte mit Features und CTA-Button.',
  FeatureCard: 'Feature-Box mit Icon, Titel und Beschreibung.',
  TestimonialCard: 'Kundenbewertung mit Bild, Text und Name.',
  TeamMember: 'Team-Mitglied mit Foto, Name und Rolle.',

  // Media
  Image: 'Zeigt Bilder an mit anpassbarer Größe und Objektanpassung.',
  Video: 'Eingebettetes Video (YouTube, Vimeo, oder lokal).',
  Map: 'Interaktive Karte mit Standort-Marker.',

  // Navigation
  Navigation: 'Navigationsmenü mit Links.',
  Header: 'Seitenkopf mit Logo und Navigation.',
  Footer: 'Seitenfuß mit Links und Copyright.',
  Breadcrumb: 'Brotkrumen-Navigation für Unterseiten.',

  // Social & Marketing
  SocialLinks: 'Social-Media Links mit Icons.',
  LogoCloud: 'Logo-Sammlung für Kunden oder Partner.',
  CTA: 'Call-to-Action Block mit Titel, Text und Button.',
  Countdown: 'Countdown-Timer für Events oder Angebote.',

  // Forms
  Input: 'Texteingabefeld für Formulare.',
  Textarea: 'Mehrzeiliges Textfeld für längere Eingaben.',
  Select: 'Dropdown-Auswahlfeld für Optionen.',
  Checkbox: 'Ankreuzfeld für Ja/Nein-Optionen.',
  Form: 'Formular-Container der Eingaben gruppiert.',
};

interface DraggableComponentProps {
  component: ComponentDefinition;
  onAddComponent: (component: ComponentDefinition) => void;
}

function DraggableComponent({ component, onAddComponent }: DraggableComponentProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${component.type}`,
    data: {
      type: 'new-component',
      componentType: component.type,
    } as DragData,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const iconData = ICON_MAP[component.icon] || { icon: '📦', color: 'from-gray-500/20 to-gray-600/10 border-gray-500/30' };
  const description = COMPONENT_DESCRIPTIONS[component.type] || component.description || `Füge ${component.displayName} hinzu`;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={cn(
              'group relative flex items-center gap-2 px-2 py-1.5 rounded-md border text-left',
              'bg-gradient-to-r transition-all duration-150',
              'hover:scale-[1.02] hover:shadow-md',
              'cursor-grab active:cursor-grabbing',
              iconData.color,
              isDragging && 'opacity-50 ring-2 ring-primary'
            )}
            onClick={() => onAddComponent(component)}
          >
            <span className="text-sm shrink-0">
              {iconData.icon}
            </span>
            <span className="text-[11px] font-medium truncate">
              {component.displayName}
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent 
          side="right" 
          className="max-w-[220px] p-2.5 bg-popover/95 backdrop-blur-sm border shadow-xl"
          sideOffset={5}
        >
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <span>{iconData.icon}</span>
              <span className="font-semibold text-sm">{component.displayName}</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {description}
            </p>
            {component.tags && component.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {component.tags.slice(0, 3).map((tag) => (
                  <span 
                    key={tag} 
                    className="text-[9px] px-1 py-0.5 rounded bg-muted text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Category icons and colors
const CATEGORY_STYLES: Record<string, { icon: string; color: string }> = {
  layout: { icon: '🏗️', color: 'text-blue-400' },
  content: { icon: '✍️', color: 'text-purple-400' },
  typography: { icon: '✍️', color: 'text-purple-400' },
  media: { icon: '📸', color: 'text-pink-400' },
  forms: { icon: '📝', color: 'text-green-400' },
  navigation: { icon: '🧭', color: 'text-orange-400' },
  feedback: { icon: '💬', color: 'text-yellow-400' },
  data: { icon: '📊', color: 'text-cyan-400' },
  advanced: { icon: '⚡', color: 'text-indigo-400' },
  ui: { icon: '🎨', color: 'text-rose-400' },
  cards: { icon: '🃏', color: 'text-emerald-400' },
  marketing: { icon: '📢', color: 'text-amber-400' },
  social: { icon: '📱', color: 'text-sky-400' },
};

export function Palette() {
  const [search, setSearch] = useState('');
  const { selectedNodeId, addNode, tree } = useEditorStore();

  const groupedComponents = componentRegistry.getGroupedByCategory();

  const filteredGroups = search
    ? new Map(
        Array.from(groupedComponents.entries()).map(([category, components]) => [
          category,
          components.filter(
            (c) =>
              c.displayName.toLowerCase().includes(search.toLowerCase()) ||
              c.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
          ),
        ])
      )
    : groupedComponents;

  const handleAddComponent = (component: ComponentDefinition) => {
    // Determine where to add the component
    let targetParentId = selectedNodeId || 'root';
    
    // If selected node can't have children, add to its parent (root)
    if (selectedNodeId) {
      const selectedDef = componentRegistry.get(
        findNodeType(tree.root, selectedNodeId) || ''
      );
      if (selectedDef && !selectedDef.canHaveChildren) {
        targetParentId = 'root';
      }
    }

    addNode(targetParentId, component.type);
  };

  // Find node type by ID
  const findNodeType = (
    node: { id: string; type: string; children: Array<{ id: string; type: string; children: unknown[] }> },
    id: string
  ): string | null => {
    if (node.id === id) return node.type;
    for (const child of node.children) {
      const found = findNodeType(child as typeof node, id);
      if (found) return found;
    }
    return null;
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-xl">🧩</span>
        <h2 className="font-semibold">Komponenten</h2>
      </div>
      
      {/* Drag hint */}
      <p className="text-xs text-muted-foreground">
        Hover für Info • Klicken oder ziehen zum Hinzufügen
      </p>
      
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Komponenten suchen..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-muted/50 border-muted-foreground/20 focus:bg-background transition-colors"
        />
      </div>

      {/* Component groups */}
      <div className="space-y-5">
        {Array.from(filteredGroups.entries()).map(([category, components]) => {
          if (components.length === 0) return null;
          
          const categoryStyle = CATEGORY_STYLES[category.id] || { icon: '📦', color: 'text-muted-foreground' };
          
          return (
            <div key={category.id}>
              <div className="flex items-center gap-2 mb-3">
                <span className={cn("text-sm", categoryStyle.color)}>{categoryStyle.icon}</span>
                <h3 className="text-sm font-semibold">
                  {category.name}
                </h3>
                <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                  {components.length}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {components.map((component) => (
                  <DraggableComponent
                    key={component.type}
                    component={component}
                    onAddComponent={handleAddComponent}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
