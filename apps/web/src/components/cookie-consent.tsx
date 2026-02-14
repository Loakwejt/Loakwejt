'use client';

import { useState, useEffect } from 'react';
import { cn } from '@builderly/ui';

interface CookieConsent {
  necessary: boolean; // Always true, required for functionality
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

const COOKIE_CONSENT_KEY = 'builderly-cookie-consent';
const COOKIE_CONSENT_VERSION = '1.0';

function getCookieConsent(): CookieConsent | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    if (parsed.version !== COOKIE_CONSENT_VERSION) return null;
    
    return parsed.consent;
  } catch {
    return null;
  }
}

function setCookieConsent(consent: CookieConsent): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
    version: COOKIE_CONSENT_VERSION,
    consent,
    timestamp: new Date().toISOString(),
  }));
  
  // Dispatch event for other components to react
  window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: consent }));
}

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [consent, setConsent] = useState<CookieConsent>({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    const existingConsent = getCookieConsent();
    if (!existingConsent) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
    setConsent(existingConsent);
  }, []);

  const handleAcceptAll = () => {
    const fullConsent: CookieConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    setCookieConsent(fullConsent);
    setConsent(fullConsent);
    setIsVisible(false);
  };

  const handleAcceptNecessary = () => {
    const minimalConsent: CookieConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    setCookieConsent(minimalConsent);
    setConsent(minimalConsent);
    setIsVisible(false);
  };

  const handleSaveSettings = () => {
    setCookieConsent(consent);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-lg border bg-background shadow-lg">
          <div className="p-4 sm:p-6">
            {!showSettings ? (
              <>
                <h2 className="text-lg font-semibold mb-2">
                  🍪 Wir verwenden Cookies
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Wir nutzen Cookies und ähnliche Technologien, um Ihnen ein optimales 
                  Nutzererlebnis zu bieten. Einige Cookies sind technisch notwendig, 
                  andere helfen uns, unsere Website zu verbessern und Ihnen personalisierte 
                  Inhalte anzuzeigen.{' '}
                  <a href="/datenschutz" className="text-primary hover:underline">
                    Mehr erfahren
                  </a>
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleAcceptAll}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-medium"
                  >
                    Alle akzeptieren
                  </button>
                  <button
                    onClick={handleAcceptNecessary}
                    className="px-4 py-2 border border-input bg-background rounded-md hover:bg-accent font-medium"
                  >
                    Nur notwendige
                  </button>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="px-4 py-2 text-muted-foreground hover:text-foreground"
                  >
                    Einstellungen
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold mb-4">
                  Cookie-Einstellungen
                </h2>
                <div className="space-y-4 mb-4">
                  <CookieCategory
                    title="Notwendige Cookies"
                    description="Diese Cookies sind für die Grundfunktionen der Website erforderlich."
                    checked={consent.necessary}
                    disabled
                    onChange={() => {}}
                  />
                  <CookieCategory
                    title="Analyse-Cookies"
                    description="Helfen uns zu verstehen, wie Besucher unsere Website nutzen."
                    checked={consent.analytics}
                    onChange={(checked) => setConsent({ ...consent, analytics: checked })}
                  />
                  <CookieCategory
                    title="Marketing-Cookies"
                    description="Werden verwendet, um Ihnen relevante Werbung anzuzeigen."
                    checked={consent.marketing}
                    onChange={(checked) => setConsent({ ...consent, marketing: checked })}
                  />
                  <CookieCategory
                    title="Präferenz-Cookies"
                    description="Speichern Ihre Einstellungen wie Sprache und Region."
                    checked={consent.preferences}
                    onChange={(checked) => setConsent({ ...consent, preferences: checked })}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleSaveSettings}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-medium"
                  >
                    Einstellungen speichern
                  </button>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="px-4 py-2 text-muted-foreground hover:text-foreground"
                  >
                    Zurück
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface CookieCategoryProps {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

function CookieCategory({ title, description, checked, disabled, onChange }: CookieCategoryProps) {
  return (
    <label className={cn(
      "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
      disabled ? "bg-muted cursor-not-allowed" : "hover:bg-accent"
    )}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 rounded border-input accent-primary"
      />
      <div>
        <div className="font-medium text-sm">{title}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
    </label>
  );
}

// Hook to check cookie consent
export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsent | null>(null);

  useEffect(() => {
    setConsent(getCookieConsent());

    const handleUpdate = (event: CustomEvent<CookieConsent>) => {
      setConsent(event.detail);
    };

    window.addEventListener('cookie-consent-updated', handleUpdate as EventListener);
    return () => {
      window.removeEventListener('cookie-consent-updated', handleUpdate as EventListener);
    };
  }, []);

  return consent;
}

// Check if specific consent is given
export function hasConsent(type: keyof CookieConsent): boolean {
  const consent = getCookieConsent();
  return consent?.[type] ?? false;
}
