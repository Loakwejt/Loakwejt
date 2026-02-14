'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Switch,
  cn,
} from '@builderly/ui';
import {
  Users,
  Shield,
  Lock,
  Check,
  Loader2,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';

interface SiteAuthToggleProps {
  workspaceId: string;
  enableUserAuth: boolean;
  userAuthEnabledAt: string | null;
}

export function SiteAuthToggle({
  workspaceId,
  enableUserAuth: initialEnabled,
  userAuthEnabledAt,
}: SiteAuthToggleProps) {
  const router = useRouter();
  const [isEnabled, setIsEnabled] = useState(initialEnabled);
  const [showWarning, setShowWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleToggle = (checked: boolean) => {
    if (isEnabled) return; // Already enabled — can't disable
    if (checked) {
      setShowWarning(true);
    }
  };

  const confirmEnable = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch(
        `/api/workspaces/${workspaceId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ enableUserAuth: true }),
        },
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Fehler beim Aktivieren');
      }
      setIsEnabled(true);
      setShowWarning(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler');
    } finally {
      setIsLoading(false);
    }
  };

  const enabledDate = userAuthEnabledAt
    ? new Date(userAuthEnabledAt).toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <Card
      className={cn(
        'transition-all duration-300',
        isEnabled ? 'border-primary/30' : '',
      )}
    >
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Users className="h-4 w-4" />
          Benutzer &amp; Authentifizierung
        </CardTitle>
        <CardDescription>
          Erlaube Besuchern, sich auf deiner Website zu registrieren und anzumelden.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status + Toggle */}
        <div
          className={cn(
            'flex items-center justify-between p-4 rounded-lg border transition-all duration-300',
            isEnabled
              ? 'border-primary/30 bg-primary/5'
              : 'border-muted hover:border-muted-foreground/25',
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'h-10 w-10 rounded-lg flex items-center justify-center transition-all duration-300',
                isEnabled
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground',
              )}
            >
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium flex items-center gap-2">
                Login-System
                {isEnabled && (
                  <Badge
                    variant="default"
                    className="text-xs animate-in zoom-in-50 duration-200"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Aktiv
                  </Badge>
                )}
              </p>
              <p className="text-sm text-muted-foreground">
                {isEnabled
                  ? `Aktiviert am ${enabledDate}`
                  : 'Registrierung und Login für Besucher'}
              </p>
            </div>
          </div>

          {isEnabled ? (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="h-3.5 w-3.5" />
              Permanent aktiv
            </div>
          ) : (
            <Switch checked={false} onCheckedChange={handleToggle} />
          )}
        </div>

        {/* Features list when enabled */}
        {isEnabled && (
          <div className="grid grid-cols-2 gap-2 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
            {[
              'Anmeldeformular',
              'Registrierung',
              'Benutzerprofil',
              'Passwort-Reset',
              'Mitglieder-Liste',
              'Admin-Dashboard',
              'Geschützter Inhalt',
              'Rollenbasierter Zugang',
            ].map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-1.5 text-muted-foreground"
              >
                <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                {feature}
              </div>
            ))}
          </div>
        )}

        {/* Link to user management */}
        {isEnabled && (
          <div className="pt-2">
            <Link
              href={`/dashboard/workspaces/${workspaceId}/users`}
            >
              <Button variant="outline" size="sm" className="gap-2 w-full">
                <Users className="h-4 w-4" />
                Benutzerverwaltung öffnen
                <ExternalLink className="h-3 w-3 ml-auto" />
              </Button>
            </Link>
          </div>
        )}

        {/* Warning dialog */}
        {showWarning && (
          <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50 p-4 space-y-3 animate-in slide-in-from-top-2 fade-in duration-300">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  Dies kann nicht rückgängig gemacht werden
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Sobald das Login-System aktiviert ist, kann es{' '}
                  <strong>nicht mehr deaktiviert</strong> werden. Benutzer-Konten und
                  deren Daten bleiben dauerhaft bestehen.
                </p>
                {error && (
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                )}
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowWarning(false);
                      setError('');
                    }}
                    disabled={isLoading}
                    className="border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900"
                  >
                    Abbrechen
                  </Button>
                  <Button
                    size="sm"
                    onClick={confirmEnable}
                    disabled={isLoading}
                    className="bg-amber-600 hover:bg-amber-700 text-white gap-1.5"
                  >
                    {isLoading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Lock className="h-3.5 w-3.5" />
                    )}
                    Ja, aktivieren
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
