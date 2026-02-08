'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  cn,
} from '@builderly/ui';
import {
  Plus,
  Trash2,
  Check,
  Loader2,
  GripVertical,
  ExternalLink,
} from 'lucide-react';

/* ================================================================== */
/* PLATFORM DEFINITIONS                                                */
/* ================================================================== */

interface PlatformDef {
  id: string;
  label: string;
  placeholder: string;
  color: string;
  icon: React.ReactNode;
}

const PLATFORMS: PlatformDef[] = [
  {
    id: 'facebook',
    label: 'Facebook',
    placeholder: 'https://facebook.com/dein-unternehmen',
    color: 'bg-[#1877F2]/10 text-[#1877F2] border-[#1877F2]/20',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    id: 'instagram',
    label: 'Instagram',
    placeholder: 'https://instagram.com/dein-unternehmen',
    color: 'bg-[#E4405F]/10 text-[#E4405F] border-[#E4405F]/20',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    id: 'x',
    label: 'X (Twitter)',
    placeholder: 'https://x.com/dein-unternehmen',
    color: 'bg-[#000]/10 text-[#000] dark:bg-white/10 dark:text-white border-[#000]/20 dark:border-white/20',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    placeholder: 'https://linkedin.com/company/dein-unternehmen',
    color: 'bg-[#0A66C2]/10 text-[#0A66C2] border-[#0A66C2]/20',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    id: 'youtube',
    label: 'YouTube',
    placeholder: 'https://youtube.com/@dein-kanal',
    color: 'bg-[#FF0000]/10 text-[#FF0000] border-[#FF0000]/20',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    placeholder: 'https://tiktok.com/@dein-unternehmen',
    color: 'bg-[#000]/10 text-[#000] dark:bg-white/10 dark:text-white border-[#000]/20 dark:border-white/20',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
  {
    id: 'pinterest',
    label: 'Pinterest',
    placeholder: 'https://pinterest.com/dein-unternehmen',
    color: 'bg-[#E60023]/10 text-[#E60023] border-[#E60023]/20',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
      </svg>
    ),
  },
  {
    id: 'github',
    label: 'GitHub',
    placeholder: 'https://github.com/dein-unternehmen',
    color: 'bg-[#181717]/10 text-[#181717] dark:bg-white/10 dark:text-white border-[#181717]/20 dark:border-white/20',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  {
    id: 'xing',
    label: 'Xing',
    placeholder: 'https://xing.com/companies/dein-unternehmen',
    color: 'bg-[#006567]/10 text-[#006567] border-[#006567]/20',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.188 0c-.517 0-.741.325-.927.66 0 0-7.455 13.224-7.702 13.657.015.024 4.919 9.023 4.919 9.023.17.308.436.66.967.66h3.454c.211 0 .375-.078.463-.22.089-.151.089-.346-.009-.536l-4.879-8.916c-.004-.006-.004-.016 0-.022L22.139.756c.095-.191.097-.387.006-.535C22.056.078 21.894 0 21.686 0h-3.498zM3.648 4.74c-.211 0-.385.074-.473.216-.09.149-.078.339.02.531l2.34 4.05c.004.01.004.016 0 .021L3.17 13.694c-.09.187-.09.383 0 .536.09.15.264.22.478.22h3.438c.518 0 .739-.321.93-.66 0 0 2.296-4.068 2.377-4.208-.033-.044-2.383-4.128-2.383-4.128-.17-.305-.441-.66-.971-.66H3.648v-.054z" />
      </svg>
    ),
  },
  {
    id: 'threads',
    label: 'Threads',
    placeholder: 'https://threads.net/@dein-unternehmen',
    color: 'bg-[#000]/10 text-[#000] dark:bg-white/10 dark:text-white border-[#000]/20 dark:border-white/20',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.187.408-2.26 1.33-3.017.88-.724 2.107-1.127 3.461-1.137.96-.007 1.856.124 2.678.392-.043-1.22-.322-2.143-.84-2.773-.595-.723-1.533-1.1-2.788-1.12h-.04c-.952.012-1.749.293-2.374.84l-1.342-1.545C8.349 4.504 9.573 4.013 11.02 4h.062c1.725.027 3.097.628 4.076 1.786.9 1.062 1.374 2.534 1.41 4.375.449.222.856.484 1.217.79 1.07.91 1.737 2.143 1.931 3.569.247 1.818-.235 3.836-1.86 5.427-1.786 1.749-4.06 2.627-7.384 2.053h-.002zM12.268 13.74c-.922.007-1.667.234-2.157.657-.492.423-.71.964-.676 1.607.043.774.467 1.328 1.193 1.755.562.33 1.28.487 1.987.487.094 0 .189-.003.284-.009 1.085-.059 1.905-.455 2.437-1.175.361-.488.633-1.136.797-1.928-.556-.248-1.19-.425-1.9-.508a8.92 8.92 0 00-.965-.053h-.001l-.999.167z" />
      </svg>
    ),
  },
];

const PLATFORM_MAP = new Map(PLATFORMS.map((p) => [p.id, p]));

/* ================================================================== */
/* COMPONENT                                                           */
/* ================================================================== */

interface SocialLink {
  platform: string;
  url: string;
}

interface WorkspaceSocialLinksProps {
  workspaceId: string;
  initialLinks: SocialLink[];
  isEditable: boolean;
}

export function WorkspaceSocialLinks({
  workspaceId,
  initialLinks,
  isEditable,
}: WorkspaceSocialLinksProps) {
  const router = useRouter();
  const [links, setLinks] = useState<SocialLink[]>(
    initialLinks.length > 0 ? initialLinks : [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  const usedPlatforms = new Set(links.map((l) => l.platform));
  const availablePlatforms = PLATFORMS.filter((p) => !usedPlatforms.has(p.id));

  const addLink = useCallback((platformId: string) => {
    setLinks((prev) => [...prev, { platform: platformId, url: '' }]);
    setShowPicker(false);
    setSaved(false);
  }, []);

  const updateUrl = useCallback((index: number, url: string) => {
    setLinks((prev) => prev.map((l, i) => (i === index ? { ...l, url } : l)));
    setSaved(false);
  }, []);

  const removeLink = useCallback((index: number) => {
    setLinks((prev) => prev.filter((_, i) => i !== index));
    setSaved(false);
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    setError('');
    setSaved(false);
    try {
      // Only save links that have URLs
      const linksToSave = links.filter((l) => l.url.trim() !== '');
      const res = await fetch(`/api/workspaces/${workspaceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ socialLinks: linksToSave }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Fehler beim Speichern');
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          Social-Media-Links
        </CardTitle>
        <CardDescription>
          Verknüpfe die Social-Media-Profile deines Unternehmens. Diese werden auf
          deinen Websites angezeigt.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing links */}
        {links.length > 0 && (
          <div className="space-y-3">
            {links.map((link, index) => {
              const platform = PLATFORM_MAP.get(link.platform);
              if (!platform) return null;

              return (
                <div
                  key={`${link.platform}-${index}`}
                  className="flex items-center gap-3 group animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  {/* Platform icon */}
                  <div
                    className={cn(
                      'h-9 w-9 rounded-lg border flex items-center justify-center shrink-0 transition-all duration-200',
                      platform.color,
                    )}
                  >
                    {platform.icon}
                  </div>

                  {/* URL input */}
                  <div className="flex-1">
                    <Input
                      placeholder={platform.placeholder}
                      value={link.url}
                      onChange={(e) => updateUrl(index, e.target.value)}
                      disabled={!isEditable || isLoading}
                      className="text-sm"
                    />
                  </div>

                  {/* Preview link */}
                  {link.url && (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}

                  {/* Remove button */}
                  {isEditable && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLink(index)}
                      disabled={isLoading}
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-9 w-9 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {links.length === 0 && !showPicker && (
          <div className="border-2 border-dashed rounded-xl p-6 text-center space-y-2">
            <div className="flex justify-center gap-2 text-muted-foreground">
              {PLATFORMS.slice(0, 5).map((p) => (
                <div key={p.id} className="opacity-40">
                  {p.icon}
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Noch keine Social-Media-Links hinzugefügt.
            </p>
          </div>
        )}

        {/* Platform picker */}
        {showPicker && availablePlatforms.length > 0 && (
          <div className="border rounded-xl p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <p className="text-sm font-medium text-muted-foreground">
              Plattform auswählen:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {availablePlatforms.map((platform) => (
                <button
                  key={platform.id}
                  type="button"
                  onClick={() => addLink(platform.id)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition-all duration-200',
                    'hover:shadow-sm hover:scale-[1.02] active:scale-[0.98]',
                    platform.color,
                  )}
                >
                  {platform.icon}
                  <span className="font-medium">{platform.label}</span>
                </button>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPicker(false)}
              className="w-full text-muted-foreground"
            >
              Abbrechen
            </Button>
          </div>
        )}

        {/* Add + Save */}
        {isEditable && (
          <div className="flex items-center justify-between pt-1">
            {availablePlatforms.length > 0 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPicker(!showPicker)}
                disabled={isLoading}
                className="gap-1.5"
              >
                <Plus className="h-4 w-4" />
                Hinzufügen
              </Button>
            ) : (
              <p className="text-xs text-muted-foreground">
                Alle verfügbaren Plattformen hinzugefügt.
              </p>
            )}

            <div className="flex items-center gap-2">
              {error && (
                <span className="text-sm text-destructive">{error}</span>
              )}
              {saved && (
                <span className="text-sm text-primary flex items-center gap-1 animate-in fade-in duration-200">
                  <Check className="h-4 w-4" />
                  Gespeichert
                </span>
              )}
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isLoading}
                className="gap-1.5"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Speichern…
                  </>
                ) : (
                  'Speichern'
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
