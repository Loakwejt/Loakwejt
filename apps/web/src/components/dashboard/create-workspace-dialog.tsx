'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Textarea,
  Separator,
  cn,
} from '@builderly/ui';
import {
  Folder,
  Building2,
  ChevronRight,
  ChevronLeft,
  Check,
  Loader2,
  Image as ImageIcon,
  Rocket,
  Globe,
  ShoppingCart,
  FileText,
  MessageSquare,
  BookOpen,
  Briefcase,
  Megaphone,
  LayoutGrid,
} from 'lucide-react';

/* ================================================================== */
/* TYPES                                                               */
/* ================================================================== */

interface WorkspaceFormData {
  name: string;
  slug: string;
  description: string;
  type: string;
  logoUrl: string;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  companyVatId: string;
  companyWebsite: string;
}

const INITIAL_DATA: WorkspaceFormData = {
  name: '',
  slug: '',
  description: '',
  type: 'WEBSITE',
  logoUrl: '',
  companyName: '',
  companyEmail: '',
  companyPhone: '',
  companyAddress: '',
  companyVatId: '',
  companyWebsite: '',
};

const WORKSPACE_TYPES = [
  { value: 'WEBSITE', label: 'Website', icon: Globe, description: 'Klassische Website mit Seiten' },
  { value: 'SHOP', label: 'Online-Shop', icon: ShoppingCart, description: 'Produkte, Bestellungen & Zahlungen' },
  { value: 'BLOG', label: 'Blog', icon: FileText, description: 'Artikel & Beiträge veröffentlichen' },
  { value: 'FORUM', label: 'Forum', icon: MessageSquare, description: 'Community & Diskussionen' },
  { value: 'WIKI', label: 'Wiki', icon: BookOpen, description: 'Wissensdatenbank & Dokumentation' },
  { value: 'PORTFOLIO', label: 'Portfolio', icon: Briefcase, description: 'Projekte & Arbeiten präsentieren' },
  { value: 'LANDING', label: 'Landing Page', icon: Megaphone, description: 'Marketing- & Kampagnenseiten' },
] as const;

const STEPS = [
  { id: 'type', label: 'Art', icon: LayoutGrid, description: 'Workspace-Typ' },
  { id: 'basics', label: 'Grundlagen', icon: Folder, description: 'Name & Branding' },
  { id: 'company', label: 'Firma', icon: Building2, description: 'Optional' },
] as const;

/* ================================================================== */
/* MAIN COMPONENT                                                      */
/* ================================================================== */

interface Props {
  children: React.ReactNode;
}

export function CreateWorkspaceDialog({ children }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<WorkspaceFormData>(INITIAL_DATA);

  // Reset on close
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setStep(0);
        setDirection('forward');
        setData(INITIAL_DATA);
        setError('');
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  const updateData = useCallback((partial: Partial<WorkspaceFormData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  }, []);

  const handleNameChange = useCallback(
    (value: string) => {
      const generatedSlug = value
        .toLowerCase()
        .replace(/ä/g, 'ae')
        .replace(/ö/g, 'oe')
        .replace(/ü/g, 'ue')
        .replace(/ß/g, 'ss')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      updateData({ name: value, slug: generatedSlug });
    },
    [updateData],
  );

  const goNext = useCallback(() => {
    if (step === 1 && (!data.name.trim() || !data.slug.trim())) return;
    setDirection('forward');
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  }, [step, data.name, data.slug]);

  const goBack = useCallback(() => {
    setDirection('backward');
    setStep((s) => Math.max(0, s - 1));
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    try {
      const body: Record<string, unknown> = {
        name: data.name,
        slug: data.slug,
        description: data.description || undefined,
        type: data.type,
      };
      if (data.logoUrl) body.logoUrl = data.logoUrl;
      if (data.companyName) body.companyName = data.companyName;
      if (data.companyEmail) body.companyEmail = data.companyEmail;
      if (data.companyPhone) body.companyPhone = data.companyPhone;
      if (data.companyAddress) body.companyAddress = data.companyAddress;
      if (data.companyVatId) body.companyVatId = data.companyVatId;
      if (data.companyWebsite) body.companyWebsite = data.companyWebsite;

      const response = await fetch('/api/workspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const d = await response.json();
        throw new Error(d.error || 'Fehler beim Erstellen des Workspace');
      }
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setIsLoading(false);
    }
  };

  const isStep1Valid = data.name.trim().length > 0 && data.slug.trim().length > 0;
  const isLastStep = step === STEPS.length - 1;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden">
        {/* ---- Header ---- */}
        <div className="px-6 pt-6 pb-4">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl">Neuen Workspace erstellen</DialogTitle>
            <DialogDescription>
              Ein Workspace ist dein Arbeitsbereich für Websites und Zusammenarbeit.
            </DialogDescription>
          </DialogHeader>

          {/* Step indicators */}
          <div className="flex items-center gap-1">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isActive = i === step;
              const isDone = i < step;
              return (
                <div key={s.id} className="flex items-center flex-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (i < step) {
                        setDirection('backward');
                        setStep(i);
                      }
                    }}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 w-full',
                      isActive && 'bg-primary/10 text-primary shadow-sm',
                      isDone && 'text-primary cursor-pointer hover:bg-primary/5',
                      !isActive && !isDone && 'text-muted-foreground',
                    )}
                    disabled={i > step}
                  >
                    <div
                      className={cn(
                        'h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 shrink-0',
                        isActive && 'bg-primary text-primary-foreground scale-110',
                        isDone && 'bg-primary/20 text-primary',
                        !isActive && !isDone && 'bg-muted text-muted-foreground',
                      )}
                    >
                      {isDone ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-medium leading-none">{s.label}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        {s.description}
                      </div>
                    </div>
                  </button>
                  {i < STEPS.length - 1 && (
                    <div
                      className={cn(
                        'h-px w-6 shrink-0 transition-colors duration-500',
                        i < step ? 'bg-primary' : 'bg-border',
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="mt-3 h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        <Separator />

        {/* ---- Step Content ---- */}
        <div className="relative min-h-[340px] overflow-hidden">
          {error && (
            <div className="absolute top-0 left-0 right-0 z-10 mx-6 mt-4">
              <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm animate-in slide-in-from-top-2 duration-300">
                {error}
              </div>
            </div>
          )}

          <div
            className={cn(
              'px-6 py-5 transition-all duration-400 ease-out',
              direction === 'forward'
                ? 'animate-in slide-in-from-right-8 fade-in'
                : 'animate-in slide-in-from-left-8 fade-in',
            )}
            key={step}
          >
            {step === 0 && (
              <StepType
                data={data}
                onUpdate={updateData}
                disabled={isLoading}
              />
            )}
            {step === 1 && (
              <StepBasics
                data={data}
                onNameChange={handleNameChange}
                onUpdate={updateData}
                disabled={isLoading}
              />
            )}
            {step === 2 && (
              <StepCompany data={data} onUpdate={updateData} disabled={isLoading} />
            )}
          </div>
        </div>

        <Separator />

        {/* ---- Footer ---- */}
        <div className="flex items-center justify-between px-6 py-4">
          <Button
            type="button"
            variant="ghost"
            onClick={step === 0 ? () => setOpen(false) : goBack}
            disabled={isLoading}
            className="gap-1"
          >
            {step === 0 ? (
              'Abbrechen'
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                Zurück
              </>
            )}
          </Button>

          <div className="flex items-center gap-2">
            {!isLastStep && (
              <span className="text-xs text-muted-foreground mr-2">
                Schritt {step + 1} von {STEPS.length}
              </span>
            )}
            {isLastStep ? (
              <Button
                onClick={handleSubmit}
                disabled={isLoading || !isStep1Valid}
                className="gap-2 min-w-[180px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Wird erstellt…
                  </>
                ) : (
                  <>
                    <Rocket className="h-4 w-4" />
                    Workspace erstellen
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={goNext}
                disabled={(step === 0 && !data.type) || (step === 1 && !isStep1Valid)}
                className="gap-1"
              >
                Weiter
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ================================================================== */
/* STEP 0 — TYPE SELECTION                                             */
/* ================================================================== */

function StepType({
  data,
  onUpdate,
  disabled,
}: {
  data: WorkspaceFormData;
  onUpdate: (p: Partial<WorkspaceFormData>) => void;
  disabled: boolean;
}) {
  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <LayoutGrid className="h-5 w-5" />
          Art des Workspace
        </h3>
        <p className="text-sm text-muted-foreground">
          Wähle den Typ deines Workspace. Dieser bestimmt die verfügbaren Funktionen und
          die Navigation im Dashboard.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {WORKSPACE_TYPES.map((t) => {
          const Icon = t.icon;
          const isSelected = data.type === t.value;
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => onUpdate({ type: t.value })}
              disabled={disabled}
              className={cn(
                'flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200',
                isSelected
                  ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20'
                  : 'border-muted hover:border-muted-foreground/25 hover:bg-muted/30',
              )}
            >
              <div
                className={cn(
                  'h-10 w-10 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200',
                  isSelected
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="font-medium text-sm flex items-center gap-2">
                  {t.label}
                  {isSelected && (
                    <Check className="h-3.5 w-3.5 text-primary" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {t.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ================================================================== */
/* STEP 1 — BASICS                                                     */
/* ================================================================== */

function StepBasics({
  data,
  onNameChange,
  onUpdate,
  disabled,
}: {
  data: WorkspaceFormData;
  onNameChange: (v: string) => void;
  onUpdate: (p: Partial<WorkspaceFormData>) => void;
  disabled: boolean;
}) {
  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <h3 className="text-lg font-semibold">Grundlagen</h3>
        <p className="text-sm text-muted-foreground">
          Gib deinem Workspace einen Namen und konfiguriere die Basis-Einstellungen.
        </p>
      </div>

      {/* Logo */}
      <div className="space-y-2">
        <Label>Logo</Label>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-xl border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/30 shrink-0 transition-colors hover:border-primary/50 hover:bg-primary/5 cursor-pointer group">
            {data.logoUrl ? (
              <img
                src={data.logoUrl}
                alt="Logo"
                className="h-14 w-14 rounded-lg object-contain"
              />
            ) : (
              <ImageIcon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
            )}
          </div>
          <div className="flex-1 space-y-1">
            <Input
              placeholder="https://example.com/logo.png"
              value={data.logoUrl}
              onChange={(e) => onUpdate({ logoUrl: e.target.value })}
              disabled={disabled}
              className="text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Logo-URL eingeben oder später in den Einstellungen hochladen.
            </p>
          </div>
        </div>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="ws-name">Workspace-Name *</Label>
        <Input
          id="ws-name"
          placeholder="Mein Workspace"
          value={data.name}
          onChange={(e) => onNameChange(e.target.value)}
          required
          disabled={disabled}
          className="text-sm"
          autoFocus
        />
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <Label htmlFor="ws-slug">Slug *</Label>
        <Input
          id="ws-slug"
          placeholder="mein-workspace"
          value={data.slug}
          onChange={(e) =>
            onUpdate({
              slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
            })
          }
          required
          disabled={disabled}
          className="text-sm"
        />
        <p className="text-xs text-muted-foreground">
          Wird in URLs verwendet. Nur Kleinbuchstaben, Zahlen und Bindestriche.
        </p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="ws-desc">Beschreibung</Label>
        <Textarea
          id="ws-desc"
          placeholder="Wofür wird dieser Workspace genutzt?"
          value={data.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          disabled={disabled}
          rows={2}
          className="text-sm resize-none"
        />
      </div>
    </div>
  );
}

/* ================================================================== */
/* STEP 2 — COMPANY                                                    */
/* ================================================================== */

function StepCompany({
  data,
  onUpdate,
  disabled,
}: {
  data: WorkspaceFormData;
  onUpdate: (p: Partial<WorkspaceFormData>) => void;
  disabled: boolean;
}) {
  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Firmendaten
        </h3>
        <p className="text-sm text-muted-foreground">
          Optional — für Impressum, Rechnungen und rechtliche Angaben. Du kannst dies
          jederzeit in den Workspace-Einstellungen ergänzen.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Firmenname</Label>
          <Input
            placeholder="Muster GmbH"
            value={data.companyName}
            onChange={(e) => onUpdate({ companyName: e.target.value })}
            disabled={disabled}
            className="text-sm"
          />
        </div>
        <div className="space-y-2">
          <Label>USt-IdNr.</Label>
          <Input
            placeholder="DE123456789"
            value={data.companyVatId}
            onChange={(e) => onUpdate({ companyVatId: e.target.value })}
            disabled={disabled}
            className="text-sm"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>E-Mail-Adresse</Label>
          <Input
            type="email"
            placeholder="kontakt@firma.de"
            value={data.companyEmail}
            onChange={(e) => onUpdate({ companyEmail: e.target.value })}
            disabled={disabled}
            className="text-sm"
          />
        </div>
        <div className="space-y-2">
          <Label>Telefon</Label>
          <Input
            type="tel"
            placeholder="+49 123 456 789"
            value={data.companyPhone}
            onChange={(e) => onUpdate({ companyPhone: e.target.value })}
            disabled={disabled}
            className="text-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Adresse</Label>
        <Textarea
          placeholder={'Musterstraße 1\n12345 Berlin\nDeutschland'}
          value={data.companyAddress}
          onChange={(e) => onUpdate({ companyAddress: e.target.value })}
          disabled={disabled}
          rows={3}
          className="text-sm resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label>Firmen-Website</Label>
        <Input
          type="url"
          placeholder="https://firma.de"
          value={data.companyWebsite}
          onChange={(e) => onUpdate({ companyWebsite: e.target.value })}
          disabled={disabled}
          className="text-sm"
        />
      </div>

      {/* Summary */}
      {data.name && (
        <div className="rounded-xl bg-muted/50 border p-4 space-y-3 animate-in fade-in duration-300">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Zusammenfassung
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Workspace</span>
              <span className="font-medium">{data.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Typ</span>
              <span className="font-medium">
                {WORKSPACE_TYPES.find((t) => t.value === data.type)?.label || data.type}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Slug</span>
              <span className="font-mono text-xs">{data.slug}</span>
            </div>
            {data.companyName && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Firma</span>
                <span>{data.companyName}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Skip hint */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-md px-3 py-2">
        <ChevronRight className="h-3 w-3 shrink-0" />
        Du kannst diesen Schritt überspringen und die Firmendaten jederzeit in den
        Workspace-Einstellungen nachholen.
      </div>
    </div>
  );
}
