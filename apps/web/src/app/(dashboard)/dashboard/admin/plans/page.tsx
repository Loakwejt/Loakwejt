'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Switch,
  Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Separator,
  cn,
} from '@builderly/ui';
import {
  Settings2,
  Save,
  Loader2,
  Check,
  AlertTriangle,
  Globe,
  FileText,
  HardDrive,
  Users,
  Crown,
  Plug,
  ToggleRight,
  Undo2,
} from 'lucide-react';

interface PlanConfig {
  id: string;
  plan: string;
  displayName: string;
  description: string;
  maxSites: number;
  maxPagesPerSite: number;
  maxStorage: number;
  maxCustomDomains: number;
  maxTeamMembers: number;
  maxFormSubmissionsPerMonth: number;
  customDomains: boolean;
  removeWatermark: boolean;
  prioritySupport: boolean;
  dedicatedSupport: boolean;
  ecommerce: boolean;
  passwordProtection: boolean;
  ssoSaml: boolean;
  whiteLabel: boolean;
  auditLog: boolean;
  slaGuarantee: boolean;
  integrations: string[];
}

const PLAN_ORDER = ['FREE', 'PRO', 'BUSINESS', 'ENTERPRISE'];

const PLAN_COLORS: Record<string, string> = {
  FREE: 'border-gray-200 dark:border-gray-700',
  PRO: 'border-blue-200 dark:border-blue-800',
  BUSINESS: 'border-purple-200 dark:border-purple-800',
  ENTERPRISE: 'border-amber-200 dark:border-amber-800',
};

const PLAN_BADGE_COLORS: Record<string, string> = {
  FREE: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  PRO: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  BUSINESS: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  ENTERPRISE: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
};

const ALL_INTEGRATIONS = [
  'google-analytics', 'plausible-analytics', 'microsoft-clarity',
  'google-search-console', 'google-tag-manager', 'google-recaptcha',
  'google-ads', 'meta-pixel', 'tiktok-pixel', 'linkedin-insight',
  'pinterest-tag', 'hotjar', 'whatsapp-chat', 'crisp-chat', 'calendly',
  'mailchimp', 'brevo', 'zapier', 'make', 'slack-notifications',
  'google-maps', 'schema-markup', 'paypal', 'openai-chatbot',
  'custom-code', 'cookie-consent',
];

function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(0)} GB`;
  return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
}

function parseBytesInput(value: string): number {
  const num = parseFloat(value);
  if (value.toLowerCase().includes('gb')) return num * 1024 * 1024 * 1024;
  if (value.toLowerCase().includes('mb')) return num * 1024 * 1024;
  return num;
}

export default function AdminPlansPage() {
  const [configs, setConfigs] = useState<PlanConfig[]>([]);
  const [original, setOriginal] = useState<PlanConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [error, setError] = useState('');

  const fetchConfigs = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/plan-configs');
      if (!res.ok) throw new Error('Fehler beim Laden');
      const data = await res.json();
      // Sort by plan order
      data.sort(
        (a: PlanConfig, b: PlanConfig) =>
          PLAN_ORDER.indexOf(a.plan) - PLAN_ORDER.indexOf(b.plan)
      );
      setConfigs(data);
      setOriginal(JSON.parse(JSON.stringify(data)));
    } catch {
      setError('Plan-Konfigurationen konnten nicht geladen werden.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfigs();
  }, [fetchConfigs]);

  const updateField = (plan: string, field: string, value: any) => {
    setConfigs((prev) =>
      prev.map((c) => (c.plan === plan ? { ...c, [field]: value } : c))
    );
  };

  const toggleIntegration = (plan: string, integrationId: string) => {
    setConfigs((prev) =>
      prev.map((c) => {
        if (c.plan !== plan) return c;
        const has = c.integrations.includes(integrationId);
        return {
          ...c,
          integrations: has
            ? c.integrations.filter((i) => i !== integrationId)
            : [...c.integrations, integrationId],
        };
      })
    );
  };

  const hasChanges = (plan: string): boolean => {
    const current = configs.find((c) => c.plan === plan);
    const orig = original.find((c) => c.plan === plan);
    if (!current || !orig) return false;
    return JSON.stringify(current) !== JSON.stringify(orig);
  };

  const resetPlan = (plan: string) => {
    const orig = original.find((c) => c.plan === plan);
    if (!orig) return;
    setConfigs((prev) =>
      prev.map((c) => (c.plan === plan ? JSON.parse(JSON.stringify(orig)) : c))
    );
  };

  const savePlan = async (plan: string) => {
    const config = configs.find((c) => c.plan === plan);
    if (!config) return;

    setSaving(plan);
    setError('');
    setSaved(null);

    try {
      const { id, plan: _plan, ...body } = config;
      const res = await fetch(`/api/admin/plan-configs/${plan}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Speichern fehlgeschlagen');
      }

      const updated = await res.json();
      // Update original to reflect saved state
      setOriginal((prev) =>
        prev.map((c) => (c.plan === plan ? { ...updated } : c))
      );
      setConfigs((prev) =>
        prev.map((c) => (c.plan === plan ? { ...updated } : c))
      );
      setSaved(plan);
      setTimeout(() => setSaved(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler');
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (configs.length === 0) {
    return (
      <div className="max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Plan-Konfiguration</h1>
          <p className="text-muted-foreground">
            Vorhandene Abo-Modelle verwalten und Limits anpassen.
          </p>
        </div>
        <Card>
          <CardContent className="py-12 text-center space-y-3">
            <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto" />
            <p className="font-medium">Keine Plan-Konfigurationen gefunden</p>
            <p className="text-sm text-muted-foreground">
              Führe das Seed-Script aus, um die Standard-Konfigurationen zu erstellen:
            </p>
            <code className="text-xs bg-muted px-3 py-1.5 rounded-md">
              cd packages/db && pnpm exec tsx prisma/seed-plan-configs.ts
            </code>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Plan-Konfiguration</h1>
        <p className="text-muted-foreground">
          Limits, Features und Integrationen pro Abo-Modell verwalten. Änderungen
          werden sofort wirksam.
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <Tabs defaultValue="FREE" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-lg">
          {configs.map((config) => (
            <TabsTrigger
              key={config.plan}
              value={config.plan}
              className="relative"
            >
              {config.displayName || config.plan}
              {hasChanges(config.plan) && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500" />
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {configs.map((config) => (
          <TabsContent key={config.plan} value={config.plan} className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className={`text-sm px-3 py-1 ${PLAN_BADGE_COLORS[config.plan]}`}
                >
                  {config.displayName || config.plan}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {config.description}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {saved === config.plan && (
                  <span className="text-sm text-green-600 flex items-center gap-1 animate-in fade-in duration-200">
                    <Check className="h-4 w-4" />
                    Gespeichert
                  </span>
                )}
                {hasChanges(config.plan) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => resetPlan(config.plan)}
                    className="gap-1.5 text-muted-foreground"
                  >
                    <Undo2 className="h-4 w-4" />
                    Zurücksetzen
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={() => savePlan(config.plan)}
                  disabled={!hasChanges(config.plan) || saving === config.plan}
                  className="gap-1.5"
                >
                  {saving === config.plan ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Speichern…
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Speichern
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Display Info */}
            <Card className={cn('border-2', PLAN_COLORS[config.plan])}>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Settings2 className="h-4 w-4" />
                  Anzeige
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Anzeigename</Label>
                  <Input
                    value={config.displayName}
                    onChange={(e) =>
                      updateField(config.plan, 'displayName', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Beschreibung</Label>
                  <Input
                    value={config.description}
                    onChange={(e) =>
                      updateField(config.plan, 'description', e.target.value)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Numeric Limits */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  Numerische Limits
                </CardTitle>
                <CardDescription>
                  Maximale Anzahl der Ressourcen für diesen Plan.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                    Max. Websites
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    value={config.maxSites}
                    onChange={(e) =>
                      updateField(config.plan, 'maxSites', parseInt(e.target.value) || 0)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                    Max. Seiten/Site
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    value={config.maxPagesPerSite}
                    onChange={(e) =>
                      updateField(config.plan, 'maxPagesPerSite', parseInt(e.target.value) || 0)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <HardDrive className="h-3.5 w-3.5 text-muted-foreground" />
                    Max. Speicher
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={0}
                      value={Math.round(config.maxStorage / (1024 * 1024))}
                      onChange={(e) =>
                        updateField(
                          config.plan,
                          'maxStorage',
                          (parseInt(e.target.value) || 0) * 1024 * 1024
                        )
                      }
                    />
                    <span className="text-sm text-muted-foreground shrink-0">MB</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    = {formatBytes(config.maxStorage)}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                    Max. Custom-Domains
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    value={config.maxCustomDomains}
                    onChange={(e) =>
                      updateField(config.plan, 'maxCustomDomains', parseInt(e.target.value) || 0)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    Max. Team-Mitglieder
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    value={config.maxTeamMembers}
                    onChange={(e) =>
                      updateField(config.plan, 'maxTeamMembers', parseInt(e.target.value) || 0)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                    Max. Formular-Einsendungen/Monat
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    value={config.maxFormSubmissionsPerMonth}
                    onChange={(e) =>
                      updateField(
                        config.plan,
                        'maxFormSubmissionsPerMonth',
                        parseInt(e.target.value) || 0
                      )
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Feature Flags */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <ToggleRight className="h-4 w-4" />
                  Features
                </CardTitle>
                <CardDescription>
                  Welche Features sind in diesem Plan verfügbar?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'customDomains', label: 'Custom-Domains', desc: 'Eigene Domains verwenden' },
                    { key: 'removeWatermark', label: 'Watermark entfernen', desc: '"Built with Builderly" ausblenden' },
                    { key: 'prioritySupport', label: 'Prioritäts-Support', desc: 'Bevorzugte Bearbeitung' },
                    { key: 'dedicatedSupport', label: 'Dedizierter Support', desc: 'Persönlicher Ansprechpartner' },
                    { key: 'ecommerce', label: 'E-Commerce', desc: 'Shop-Funktionalitäten' },
                    { key: 'passwordProtection', label: 'Passwortschutz', desc: 'Seiten mit Passwort schützen' },
                    { key: 'ssoSaml', label: 'SSO / SAML', desc: 'Enterprise Single Sign-On' },
                    { key: 'whiteLabel', label: 'White Label', desc: 'Eigenes Branding' },
                    { key: 'auditLog', label: 'Audit-Log', desc: 'Änderungsprotokoll' },
                    { key: 'slaGuarantee', label: 'SLA-Garantie', desc: 'Verfügbarkeitsgarantie' },
                  ].map((feature) => (
                    <div
                      key={feature.key}
                      className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                    >
                      <div>
                        <p className="text-sm font-medium">{feature.label}</p>
                        <p className="text-xs text-muted-foreground">{feature.desc}</p>
                      </div>
                      <Switch
                        checked={(config as any)[feature.key]}
                        onCheckedChange={(checked) =>
                          updateField(config.plan, feature.key, checked)
                        }
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Integrations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Plug className="h-4 w-4" />
                  Integrationen
                </CardTitle>
                <CardDescription>
                  {config.integrations.length} von {ALL_INTEGRATIONS.length} Integrationen aktiviert.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {ALL_INTEGRATIONS.map((integ) => {
                    const active = config.integrations.includes(integ);
                    return (
                      <button
                        key={integ}
                        type="button"
                        onClick={() => toggleIntegration(config.plan, integ)}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150',
                          active
                            ? 'bg-primary/10 text-primary border-primary/30'
                            : 'bg-muted text-muted-foreground border-transparent hover:border-muted-foreground/30'
                        )}
                      >
                        {integ}
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      updateField(config.plan, 'integrations', [...ALL_INTEGRATIONS])
                    }
                  >
                    Alle aktivieren
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      updateField(config.plan, 'integrations', [])
                    }
                  >
                    Alle deaktivieren
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
