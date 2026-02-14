'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Badge,
  Alert,
  AlertDescription,
} from '@builderly/ui';
import { 
  User, Mail, Lock, Bell, Shield, Trash2, Save, CheckCircle,
  Palette, Globe2, Link2, BarChart3, Code, Eye, Flame,
  Search, ShieldCheck, Tag, Megaphone, Cookie, MonitorSmartphone,
  Sun, Moon, Languages, Clock, MapPin,
  Activity, MonitorDot, Music, Briefcase, Pin,
  MessageCircle, MessagesSquare, Calendar, Send, Hash, Workflow,
  FileJson, Wallet, Bot, Zap,
} from 'lucide-react';

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    bio: '',
    website: '',
    company: '',
    location: '',
    phone: '',
  });

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    securityAlerts: true,
    marketingEmails: false,
    weeklyDigest: true,
    billingAlerts: true,
    teamInvites: true,
    sitePublished: true,
    formSubmissions: false,
  });

  const [appearance, setAppearance] = useState({
    theme: 'system' as 'light' | 'dark' | 'system',
    language: 'de' as 'de' | 'en',
    timezone: 'Europe/Berlin',
    dateFormat: 'DD.MM.YYYY' as 'DD.MM.YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD',
    compactMode: false,
    reducedMotion: false,
  });

  const initials = session?.user?.name
    ? session.user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : session?.user?.email?.[0]?.toUpperCase() || 'U';

  const handleSaveProfile = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setIsLoading(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Einstellungen</h1>
        <p className="text-muted-foreground">
          Verwalte dein Konto, Darstellung und Benachrichtigungen
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profil</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Darstellung</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Sicherheit</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Benachrichtigungen</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Link2 className="h-4 w-4" />
            <span className="hidden sm:inline">Integrationen</span>
          </TabsTrigger>
          <TabsTrigger value="danger" className="flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Gefahrenzone</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          {saved && (
            <Alert className="border-green-500 bg-green-50 text-green-700">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>Dein Profil wurde erfolgreich aktualisiert.</AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Profilbild</CardTitle>
              <CardDescription>
                Aktualisiere dein Profilbild. Klicke auf den Avatar um ein neues Bild hochzuladen.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-6">
              <Avatar className="h-24 w-24 cursor-pointer hover:opacity-80 transition-opacity">
                <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || ''} />
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Button variant="outline">Neues Bild hochladen</Button>
                <p className="text-xs text-muted-foreground">
                  JPG, GIF oder PNG. Max. 2 MB.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Persönliche Informationen</CardTitle>
              <CardDescription>
                Aktualisiere deine persönlichen Daten.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Vollständiger Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Dein Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-Mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="deine@email.de"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Erzähle etwas über dich..."
                  className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Unternehmen</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Dein Unternehmen"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://deine-website.de"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Standort</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="z.B. Berlin, Deutschland"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+49 ..."
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} disabled={isLoading}>
                  {isLoading ? (
                    <>Speichern...</>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Änderungen speichern
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-5 w-5" />
                Design & Theme
              </CardTitle>
              <CardDescription>
                Passe das Erscheinungsbild des Dashboards an.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'light' as const, label: 'Hell', icon: <Sun className="h-5 w-5" /> },
                    { value: 'dark' as const, label: 'Dunkel', icon: <Moon className="h-5 w-5" /> },
                    { value: 'system' as const, label: 'System', icon: <MonitorSmartphone className="h-5 w-5" /> },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setAppearance({ ...appearance, theme: option.value })}
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                        appearance.theme === option.value 
                          ? 'border-primary bg-primary/5' 
                          : 'border-muted hover:border-muted-foreground/30'
                      }`}
                    >
                      {option.icon}
                      <span className="text-sm font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="h-5 w-5" />
                Sprache & Region
              </CardTitle>
              <CardDescription>
                Stelle Sprache, Zeitzone und Datumsformat ein.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Sprache</Label>
                  <select
                    value={appearance.language}
                    onChange={(e) => setAppearance({ ...appearance, language: e.target.value as any })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="de">Deutsch</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Zeitzone</Label>
                  <select
                    value={appearance.timezone}
                    onChange={(e) => setAppearance({ ...appearance, timezone: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="Europe/Berlin">Europe/Berlin (CET)</option>
                    <option value="Europe/Vienna">Europe/Vienna (CET)</option>
                    <option value="Europe/Zurich">Europe/Zurich (CET)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                    <option value="America/New_York">America/New York (EST)</option>
                    <option value="America/Los_Angeles">America/Los Angeles (PST)</option>
                    <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Datumsformat</Label>
                  <select
                    value={appearance.dateFormat}
                    onChange={(e) => setAppearance({ ...appearance, dateFormat: e.target.value as any })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="DD.MM.YYYY">DD.MM.YYYY (06.02.2026)</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY (02/06/2026)</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD (2026-02-06)</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Barrierefreiheit</CardTitle>
              <CardDescription>
                Einstellungen für verbesserte Zugänglichkeit.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'compactMode', label: 'Kompakter Modus', desc: 'Reduziert Abstände für mehr Platz auf dem Bildschirm.' },
                { key: 'reducedMotion', label: 'Animationen reduzieren', desc: 'Reduziert Bewegungseffekte und Animationen.' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={appearance[item.key as keyof typeof appearance] as boolean}
                      onChange={(e) => setAppearance({ ...appearance, [item.key]: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                  </label>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Passwort ändern</CardTitle>
              <CardDescription>
                Aktualisiere dein Passwort, um dein Konto zu schützen.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Aktuelles Passwort</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Neues Passwort</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button>Passwort aktualisieren</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Zwei-Faktor-Authentifizierung</CardTitle>
              <CardDescription>
                Füge eine zusätzliche Sicherheitsebene zu deinem Konto hinzu.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-muted">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium">Authenticator App</p>
                  <p className="text-sm text-muted-foreground">
                    Nutze eine Authenticator-App, um Einmalcodes zu generieren.
                  </p>
                </div>
              </div>
              <Badge variant="outline">Bald verfügbar</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Aktive Sitzungen</CardTitle>
              <CardDescription>
                Verwalte deine aktiven Sitzungen auf verschiedenen Geräten.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-green-100">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                  <div>
                    <p className="font-medium">Aktuelle Sitzung</p>
                    <p className="text-sm text-muted-foreground">
                      Windows · Chrome · Deutschland
                    </p>
                  </div>
                </div>
                <Badge variant="success">Aktiv</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Login-Verlauf</CardTitle>
              <CardDescription>
                Letzte Anmeldungen auf deinem Konto.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { date: '06.02.2026, 14:32', device: 'Chrome · Windows', location: 'Berlin, DE', status: 'success' },
                  { date: '05.02.2026, 09:15', device: 'Safari · macOS', location: 'München, DE', status: 'success' },
                  { date: '04.02.2026, 22:47', device: 'Chrome · Android', location: 'Hamburg, DE', status: 'success' },
                ].map((login, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{login.device}</p>
                        <p className="text-xs text-muted-foreground">{login.date} · {login.location}</p>
                      </div>
                    </div>
                    <Badge variant="success" className="text-xs">Erfolgreich</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>E-Mail-Benachrichtigungen</CardTitle>
              <CardDescription>
                Wähle, welche E-Mails du erhalten möchtest.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'emailUpdates', label: 'Produktupdates', desc: 'Werde über neue Features und Verbesserungen informiert.' },
                { key: 'securityAlerts', label: 'Sicherheitswarnungen', desc: 'Erhalte Benachrichtigungen über Sicherheitsereignisse.' },
                { key: 'billingAlerts', label: 'Abrechnungshinweise', desc: 'Benachrichtigungen zu Zahlungen, Rechnungen und Plan-Änderungen.' },
                { key: 'teamInvites', label: 'Team-Einladungen', desc: 'Werde informiert, wenn du zu einem Workspace eingeladen wirst.' },
                { key: 'sitePublished', label: 'Veröffentlichungen', desc: 'Benachrichtigung wenn eine deiner Sites veröffentlicht wird.' },
                { key: 'formSubmissions', label: 'Formular-Einsendungen', desc: 'Erhalte eine E-Mail bei neuen Formular-Einsendungen.' },
                { key: 'marketingEmails', label: 'Marketing-E-Mails', desc: 'Erhalte Tipps, Angebote und Neuigkeiten von uns.' },
                { key: 'weeklyDigest', label: 'Wöchentliche Zusammenfassung', desc: 'Erhalte eine wöchentliche Übersicht deiner Aktivitäten.' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications[item.key as keyof typeof notifications]}
                      onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                  </label>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Verbundene Dienste</CardTitle>
              <CardDescription>
                Verbinde externe Dienste mit deinem Builderly-Konto. Diese Integrationen gelten pro Site und können in den Site-Einstellungen konfiguriert werden.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {[
                // ── Analytics & Tracking (Pro) ──
                { 
                  name: 'Google Analytics', 
                  desc: 'Verfolge Besucher, Seitenaufrufe und Conversions mit GA4.',
                  icon: <BarChart3 className="h-5 w-5" />,
                  minPlan: 'Pro',
                  configKey: 'Measurement ID (G-XXXXXXXXXX)',
                  docsUrl: 'https://analytics.google.com',
                },
                { 
                  name: 'Plausible Analytics', 
                  desc: 'Datenschutzfreundliche Web-Analyse ohne Cookies — EU-gehostet.',
                  icon: <Activity className="h-5 w-5" />,
                  minPlan: 'Pro',
                  configKey: 'Domain (+ optional Self-Host URL)',
                  docsUrl: 'https://plausible.io',
                },
                { 
                  name: 'Microsoft Clarity', 
                  desc: 'Kostenlose Heatmaps, Session Recordings und Behaviour-Insights.',
                  icon: <MonitorDot className="h-5 w-5" />,
                  minPlan: 'Pro',
                  configKey: 'Clarity Project ID',
                  docsUrl: 'https://clarity.microsoft.com',
                },
                { 
                  name: 'Google Search Console', 
                  desc: 'Überwache deine Suchleistung und indexierte Seiten.',
                  icon: <Search className="h-5 w-5" />,
                  minPlan: 'Pro',
                  configKey: 'Verification Meta Tag',
                  docsUrl: 'https://search.google.com/search-console',
                },
                { 
                  name: 'Google reCAPTCHA', 
                  desc: 'Schütze deine Formulare vor Spam und Bots (v3).',
                  icon: <ShieldCheck className="h-5 w-5" />,
                  minPlan: 'Pro',
                  configKey: 'Site Key',
                  docsUrl: 'https://www.google.com/recaptcha',
                },
                { 
                  name: 'Google Maps', 
                  desc: 'Interaktive Karten und Standort-Anzeige auf deiner Website.',
                  icon: <MapPin className="h-5 w-5" />,
                  minPlan: 'Pro',
                  configKey: 'Maps API Key oder Embed-URL',
                  docsUrl: 'https://developers.google.com/maps',
                },
                { 
                  name: 'Schema.org Markup', 
                  desc: 'Strukturierte Daten (JSON-LD) für bessere Google-Rich-Snippets.',
                  icon: <FileJson className="h-5 w-5" />,
                  minPlan: 'Pro',
                  configKey: 'Schema-Typ wählen oder Custom JSON-LD',
                  docsUrl: 'https://schema.org',
                },
                { 
                  name: 'WhatsApp Chat', 
                  desc: 'Floating WhatsApp-Button für direkten Kundenkontakt.',
                  icon: <MessageCircle className="h-5 w-5" />,
                  minPlan: 'Pro',
                  configKey: 'Telefonnummer (+ vordefinierte Nachricht)',
                  docsUrl: 'https://business.whatsapp.com',
                },
                { 
                  name: 'Cookie Consent (DSGVO)', 
                  desc: 'DSGVO-konformer Cookie-Banner mit Klaro oder Cookiebot.',
                  icon: <Cookie className="h-5 w-5" />,
                  minPlan: 'Pro',
                  configKey: 'Provider wählen',
                  docsUrl: '',
                },
                // ── Advertising & Social Pixels (Business) ──
                { 
                  name: 'Google Tag Manager', 
                  desc: 'Verwalte alle deine Marketing-Tags an einem Ort.',
                  icon: <Tag className="h-5 w-5" />,
                  minPlan: 'Business',
                  configKey: 'Container ID (GTM-XXXXXXX)',
                  docsUrl: 'https://tagmanager.google.com',
                },
                { 
                  name: 'Google Ads', 
                  desc: 'Tracke Conversions deiner Google Ads Kampagnen.',
                  icon: <Megaphone className="h-5 w-5" />,
                  minPlan: 'Business',
                  configKey: 'Conversion ID (AW-XXXXXXXXX)',
                  docsUrl: 'https://ads.google.com',
                },
                { 
                  name: 'Meta Pixel', 
                  desc: 'Retargeting und Conversion-Tracking für Facebook & Instagram.',
                  icon: <Eye className="h-5 w-5" />,
                  minPlan: 'Business',
                  configKey: 'Pixel ID',
                  docsUrl: 'https://business.facebook.com',
                },
                { 
                  name: 'TikTok Pixel', 
                  desc: 'Conversion-Tracking und Zielgruppen-Optimierung für TikTok Ads.',
                  icon: <Music className="h-5 w-5" />,
                  minPlan: 'Business',
                  configKey: 'Pixel ID',
                  docsUrl: 'https://ads.tiktok.com',
                },
                { 
                  name: 'LinkedIn Insight Tag', 
                  desc: 'B2B-Conversion-Tracking und Retargeting über LinkedIn.',
                  icon: <Briefcase className="h-5 w-5" />,
                  minPlan: 'Business',
                  configKey: 'Partner ID',
                  docsUrl: 'https://business.linkedin.com/marketing-solutions/insight-tag',
                },
                { 
                  name: 'Pinterest Tag', 
                  desc: 'Conversion-Tracking für Pinterest Ads und Shopping.',
                  icon: <Pin className="h-5 w-5" />,
                  minPlan: 'Business',
                  configKey: 'Tag ID',
                  docsUrl: 'https://business.pinterest.com',
                },
                { 
                  name: 'Hotjar', 
                  desc: 'Heatmaps, Recordings und Feedback von deinen Besuchern.',
                  icon: <Flame className="h-5 w-5" />,
                  minPlan: 'Business',
                  configKey: 'Site ID',
                  docsUrl: 'https://www.hotjar.com',
                },
                // ── Communication & Chat (Business) ──
                { 
                  name: 'Crisp Live Chat', 
                  desc: 'Live-Chat-Widget mit Chatbot, Wissensdatenbank und Inbox.',
                  icon: <MessagesSquare className="h-5 w-5" />,
                  minPlan: 'Business',
                  configKey: 'Website ID',
                  docsUrl: 'https://crisp.chat',
                },
                { 
                  name: 'Calendly', 
                  desc: 'Terminbuchung direkt auf deiner Website einbetten.',
                  icon: <Calendar className="h-5 w-5" />,
                  minPlan: 'Business',
                  configKey: 'Scheduling Link URL',
                  docsUrl: 'https://calendly.com',
                },
                // ── E-Mail Marketing (Business) ──
                { 
                  name: 'Mailchimp', 
                  desc: 'Verbinde Newsletter-Anmeldungen mit deinem Mailchimp-Konto.',
                  icon: <Mail className="h-5 w-5" />,
                  minPlan: 'Business',
                  configKey: 'API Key & Audience ID',
                  docsUrl: 'https://mailchimp.com',
                },
                { 
                  name: 'Brevo (Sendinblue)', 
                  desc: 'E-Mail-Marketing, SMS und Marketing-Automation — DSGVO-konform.',
                  icon: <Send className="h-5 w-5" />,
                  minPlan: 'Business',
                  configKey: 'API Key & List ID',
                  docsUrl: 'https://www.brevo.com',
                },
                // ── Automation (Business) ──
                { 
                  name: 'Zapier', 
                  desc: 'Verbinde Builderly mit 6.000+ Apps via Webhooks.',
                  icon: <Zap className="h-5 w-5" />,
                  minPlan: 'Business',
                  configKey: 'Webhook URL',
                  docsUrl: 'https://zapier.com',
                },
                { 
                  name: 'Make (Integromat)', 
                  desc: 'Visuelle Automations-Workflows mit Webhook-Trigger.',
                  icon: <Workflow className="h-5 w-5" />,
                  minPlan: 'Business',
                  configKey: 'Webhook URL',
                  docsUrl: 'https://www.make.com',
                },
                { 
                  name: 'Slack Benachrichtigungen', 
                  desc: 'Echtzeit-Benachrichtigungen bei Formularen, Bestellungen etc.',
                  icon: <Hash className="h-5 w-5" />,
                  minPlan: 'Business',
                  configKey: 'Incoming Webhook URL & Channel',
                  docsUrl: 'https://api.slack.com/messaging/webhooks',
                },
                // ── Payments (Business) ──
                { 
                  name: 'PayPal', 
                  desc: 'PayPal-Buttons und Checkout direkt auf deiner Website.',
                  icon: <Wallet className="h-5 w-5" />,
                  minPlan: 'Business',
                  configKey: 'Client ID (+ Sandbox-Modus)',
                  docsUrl: 'https://developer.paypal.com',
                },
                // ── Custom Code (Business) ──
                { 
                  name: 'Custom Code', 
                  desc: 'Füge eigene Scripts in Head oder Body deiner Seite ein.',
                  icon: <Code className="h-5 w-5" />,
                  minPlan: 'Business',
                  configKey: 'HTML/JS Code',
                  docsUrl: '',
                },
                // ── AI (Enterprise) ──
                { 
                  name: 'KI-Chatbot (OpenAI)', 
                  desc: 'GPT-basierter Chatbot, der Fragen zu deiner Website beantwortet.',
                  icon: <Bot className="h-5 w-5" />,
                  minPlan: 'Enterprise',
                  configKey: 'OpenAI API Key & Assistant ID',
                  docsUrl: 'https://platform.openai.com',
                },
              ].map((integration) => (
                <div key={integration.name} className="flex items-center justify-between py-4 border-b last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {integration.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{integration.name}</p>
                        <Badge variant="secondary" className="text-xs">ab {integration.minPlan}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{integration.desc}</p>
                      <p className="text-xs text-muted-foreground/70 mt-0.5">
                        Benötigt: {integration.configKey}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {integration.docsUrl && (
                      <a 
                        href={integration.docsUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        Docs
                      </a>
                    )}
                    <Button variant="outline" size="sm">
                      Konfigurieren
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API-Zugang</CardTitle>
              <CardDescription>
                Verwalte deine API-Schlüssel für externe Integrationen.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                <div>
                  <p className="font-medium text-sm">Persönlicher API-Schlüssel</p>
                  <p className="text-xs text-muted-foreground">Erstellt am 15.01.2026</p>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-muted px-2 py-1 rounded">bld_sk_••••••••••••••••</code>
                  <Button variant="outline" size="sm">Anzeigen</Button>
                </div>
              </div>
              <Button variant="outline">
                Neuen API-Schlüssel erstellen
              </Button>
              <p className="text-xs text-muted-foreground">
                API-Schlüssel haben vollen Zugriff auf dein Konto. Teile sie niemals öffentlich.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Danger Zone Tab */}
        <TabsContent value="danger" className="space-y-6">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Konto löschen</CardTitle>
              <CardDescription>
                Lösche dein Konto und alle zugehörigen Daten permanent.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <Trash2 className="h-4 w-4" />
                <AlertDescription>
                  Diese Aktion kann nicht rückgängig gemacht werden. Alle deine Workspaces, Sites und Daten werden permanent gelöscht.
                </AlertDescription>
              </Alert>
              <div className="flex justify-end">
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Konto löschen
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-500">
            <CardHeader>
              <CardTitle className="text-orange-600">Daten exportieren</CardTitle>
              <CardDescription>
                Lade eine Kopie all deiner Daten herunter (DSGVO Art. 20).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Wir erstellen ein ZIP-Archiv mit allen deinen Daten: Profil, Workspaces, Sites, Seiteninhalte und Assets.
                Der Download kann einige Minuten dauern.
              </p>
              <div className="flex justify-end">
                <Button variant="outline">
                  <Globe2 className="mr-2 h-4 w-4" />
                  Daten exportieren
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
