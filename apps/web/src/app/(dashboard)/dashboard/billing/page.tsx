import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Progress,
  Separator,
} from '@builderly/ui';
import { 
  CreditCard, 
  CheckCircle, 
  Clock, 
  Zap, 
  Globe,
  Users, 
  HardDrive,
  ArrowUpRight,
  Receipt,
  Download,
  Crown,
  Sparkles,
  X,
  Rocket,
  Building2,
  FileText,
  Shield,
  BarChart3,
  Code,
  Mail,
  ShoppingCart,
  Lock,
  Activity,
  MonitorDot,
  Music,
  Briefcase,
  Pin,
  MessageCircle,
  MessagesSquare,
  Calendar,
  Send,
  Hash,
  Workflow,
  MapPin,
  FileJson,
  Wallet,
  Bot,
  Eye,
  Megaphone,
  Flame,
  Tag,
  ShieldCheck,
  Cookie,
  Search,
} from 'lucide-react';

export default async function BillingPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  // Get user's workspaces with billing info
  const memberships = await prisma.workspaceMember.findMany({
    where: { 
      userId: session.user.id,
      role: { in: ['OWNER', 'ADMIN'] }
    },
    include: {
      workspace: {
        include: {
          _count: { select: { pages: true, members: true, assets: true } },
        },
      },
    },
  });

  const workspaces = memberships.map(m => ({ ...m.workspace, role: m.role }));

  // Plan limits
  const planLimits = {
    FREE: { members: 1, storage: 500, pages: 5 },
    PRO: { members: 3, storage: 2000, pages: 25 },
    BUSINESS: { members: 10, storage: 10000, pages: 100 },
    ENTERPRISE: { members: 999, storage: 50000, pages: 999 },
  };

  const planPrices: Record<string, number> = {
    FREE: 0,
    PRO: 9,
    BUSINESS: 29,
    ENTERPRISE: 79,
  };

  const planNames: Record<string, string> = {
    FREE: 'Starter',
    PRO: 'Pro',
    BUSINESS: 'Business',
    ENTERPRISE: 'Enterprise',
  };

  const planDescriptions: Record<string, string> = {
    FREE: 'Perfekt zum Ausprobieren',
    PRO: 'Für Freelancer & kleine Projekte',
    BUSINESS: 'Für Teams & wachsende Unternehmen',
    ENTERPRISE: 'Für Agenturen & große Organisationen',
  };

  type PlanFeature = {
    label: string;
    included: boolean;
    detail?: string;
  };

  const planFeatures: Record<string, PlanFeature[]> = {
    FREE: [
      { label: '1 Website', included: true },
      { label: '5 Seiten pro Site', included: true },
      { label: '500 MB Speicher', included: true },
      { label: 'Builderly-Subdomain', included: true },
      { label: 'SSL-Zertifikat', included: true },
      { label: 'Basis SEO', included: true },
      { label: '50 Formular-Einsendungen/Monat', included: true },
      { label: 'Community Support', included: true },
      { label: 'Builderly-Branding', included: true },
      { label: 'Custom Domain', included: false },
      { label: 'Integrationen', included: false },
      { label: 'E-Commerce', included: false },
    ],
    PRO: [
      { label: '3 Websites', included: true },
      { label: '25 Seiten pro Site', included: true },
      { label: '2 GB Speicher', included: true },
      { label: '1 Custom Domain', included: true },
      { label: 'SSL-Zertifikat', included: true },
      { label: 'Erweiterte SEO-Tools', included: true },
      { label: '500 Formular-Einsendungen/Monat', included: true },
      { label: '3 Team-Mitglieder', included: true },
      { label: 'Kein Branding', included: true },
      { label: 'Google Analytics', included: true },
      { label: 'Plausible Analytics', included: true },
      { label: 'Microsoft Clarity', included: true },
      { label: 'Google Search Console', included: true },
      { label: 'Google reCAPTCHA', included: true },
      { label: 'WhatsApp Chat', included: true },
      { label: 'Google Maps', included: true },
      { label: 'Schema.org Markup', included: true },
      { label: 'Cookie Consent (DSGVO)', included: true },
      { label: 'E-Mail Support', included: true },
      { label: 'E-Commerce', included: false },
      { label: 'Custom Code', included: false },
      { label: 'Social Pixels', included: false },
    ],
    BUSINESS: [
      { label: '10 Websites', included: true },
      { label: '100 Seiten pro Site', included: true },
      { label: '10 GB Speicher', included: true },
      { label: '3 Custom Domains', included: true },
      { label: '10 Team-Mitglieder', included: true },
      { label: '2.000 Formular-Einsendungen/Monat', included: true },
      { label: 'Alle Pro-Features', included: true },
      { label: 'Google Tag Manager', included: true },
      { label: 'Google Ads Tracking', included: true },
      { label: 'Meta Pixel (Facebook)', included: true },
      { label: 'TikTok Pixel', included: true },
      { label: 'LinkedIn Insight Tag', included: true },
      { label: 'Pinterest Tag', included: true },
      { label: 'Hotjar Heatmaps', included: true },
      { label: 'Crisp Live Chat', included: true },
      { label: 'Calendly Terminbuchung', included: true },
      { label: 'Mailchimp & Brevo', included: true },
      { label: 'Zapier & Make Automation', included: true },
      { label: 'Slack Benachrichtigungen', included: true },
      { label: 'PayPal Checkout', included: true },
      { label: 'Custom Code (Head/Body)', included: true },
      { label: 'E-Commerce / Shop', included: true },
      { label: 'Passwortgeschützte Seiten', included: true },
      { label: 'Prioritäts-Support', included: true },
    ],
    ENTERPRISE: [
      { label: 'Unbegrenzte Websites', included: true },
      { label: 'Unbegrenzte Seiten', included: true },
      { label: '50 GB Speicher', included: true },
      { label: 'Unbegrenzte Custom Domains', included: true },
      { label: 'Unbegrenzte Team-Mitglieder', included: true },
      { label: 'Unbegrenzte Formular-Einsendungen', included: true },
      { label: 'Alle Business-Features', included: true },
      { label: 'KI-Chatbot (OpenAI)', included: true },
      { label: 'SSO / SAML Login', included: true },
      { label: 'White Label', included: true },
      { label: 'Audit Log', included: true },
      { label: 'SLA 99.9% Uptime', included: true },
      { label: 'Dedizierter Account Manager', included: true },
      { label: 'Onboarding & Schulung', included: true },
      { label: 'API-Zugang (erweitert)', included: true },
    ],
  };

  // Mock invoice data
  const invoices = [
    { id: 'INV-001', date: '2026-01-15', amount: 29, status: 'paid' as const },
    { id: 'INV-002', date: '2025-12-15', amount: 29, status: 'paid' as const },
    { id: 'INV-003', date: '2025-11-15', amount: 29, status: 'paid' as const },
  ];

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'ENTERPRISE': return <Crown className="h-5 w-5 text-yellow-500" />;
      case 'BUSINESS': return <Building2 className="h-5 w-5 text-purple-500" />;
      case 'PRO': return <Sparkles className="h-5 w-5 text-primary" />;
      default: return <Zap className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Abrechnung & Pläne</h1>
        <p className="text-muted-foreground">
          Verwalte deine Abonnements und Zahlungsinformationen
        </p>
      </div>

      {/* Workspace Plans Overview */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Deine Workspaces</h2>
        
        {workspaces.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <CreditCard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Keine Workspaces zu verwalten</h3>
              <p className="text-muted-foreground">
                Du musst Owner oder Admin eines Workspace sein, um die Abrechnung zu verwalten.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {workspaces.map((workspace) => {
              const limits = planLimits[workspace.plan as keyof typeof planLimits];
              const pagesUsed = workspace._count.pages;
              const membersUsed = workspace._count.members;
              
              return (
                <Card key={workspace.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          {getPlanIcon(workspace.plan)}
                        </div>
                        <div>
                          <CardTitle>{workspace.name}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Badge 
                              variant={workspace.plan === 'FREE' ? 'secondary' : workspace.plan === 'ENTERPRISE' ? 'success' : 'default'}
                            >
                              {planNames[workspace.plan]}
                            </Badge>
                            {workspace.plan !== 'FREE' && (
                              <span className="text-sm">
                                €{planPrices[workspace.plan]}/Monat
                              </span>
                            )}
                          </CardDescription>
                        </div>
                      </div>
                      {workspace.plan === 'FREE' ? (
                        <Button>
                          <ArrowUpRight className="mr-2 h-4 w-4" />
                          Upgrade
                        </Button>
                      ) : (
                        <Button variant="outline">Plan verwalten</Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <FileText className="h-4 w-4" /> Seiten
                          </span>
                          <span>{pagesUsed}/{limits.pages === 999 ? '∞' : limits.pages}</span>
                        </div>
                        <Progress value={limits.pages === 999 ? Math.min(pagesUsed, 5) : (pagesUsed / limits.pages) * 100} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Users className="h-4 w-4" /> Mitglieder
                          </span>
                          <span>{membersUsed}/{limits.members === 999 ? '∞' : limits.members}</span>
                        </div>
                        <Progress value={limits.members === 999 ? Math.min(membersUsed, 5) : (membersUsed / limits.members) * 100} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <HardDrive className="h-4 w-4" /> Speicher
                          </span>
                          <span>0/{limits.storage >= 1000 ? `${limits.storage / 1000} GB` : `${limits.storage} MB`}</span>
                        </div>
                        <Progress value={0} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <FileText className="h-4 w-4" /> Seiten/Site
                          </span>
                          <span>{limits.pages === 999 ? '∞' : limits.pages}</span>
                        </div>
                        <Progress value={0} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Separator />

      {/* Available Plans */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Wähle deinen Plan</h2>
          <p className="text-muted-foreground mt-1">
            Starte kostenlos, upgrade wenn du mehr brauchst. Alle Preise in EUR, monatlich kündbar.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(['FREE', 'PRO', 'BUSINESS', 'ENTERPRISE'] as const).map((plan) => {
            const isPopular = plan === 'BUSINESS';
            return (
              <Card 
                key={plan} 
                className={isPopular ? 'border-primary shadow-lg relative' : 'relative'}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="default" className="shadow-md">
                      <Sparkles className="h-3 w-3 mr-1" /> Beliebt
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    {getPlanIcon(plan)}
                    <CardTitle className="text-lg">{planNames[plan]}</CardTitle>
                  </div>
                  <CardDescription className="text-sm">
                    {planDescriptions[plan]}
                  </CardDescription>
                  <div className="pt-2">
                    <span className="text-4xl font-bold text-foreground">
                      €{planPrices[plan]}
                    </span>
                    {plan !== 'FREE' && <span className="text-muted-foreground">/Monat</span>}
                    {plan === 'FREE' && <span className="text-muted-foreground ml-1">für immer</span>}
                  </div>
                  {plan !== 'FREE' && (
                    <p className="text-xs text-muted-foreground">
                      €{Math.round((planPrices[plan] ?? 0) * 10 * 0.8) / 10}/Mo bei jährlicher Zahlung
                    </p>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {(planFeatures[plan] ?? []).map((feature) => (
                      <li key={feature.label} className="flex items-start gap-2 text-sm">
                        {feature.included ? (
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground/40 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={feature.included ? '' : 'text-muted-foreground/60'}>
                          {feature.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={isPopular ? 'default' : 'outline'}
                    size="lg"
                  >
                    {plan === 'FREE' ? 'Aktueller Plan' : plan === 'ENTERPRISE' ? 'Vertrieb kontaktieren' : 'Jetzt upgraden'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Feature Comparison Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Feature-Vergleich</h2>
        <Card>
          <CardContent className="pt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 pr-4 font-medium">Feature</th>
                  <th className="text-center py-3 px-4 font-medium">Starter</th>
                  <th className="text-center py-3 px-4 font-medium">Pro</th>
                  <th className="text-center py-3 px-4 font-medium text-primary">Business</th>
                  <th className="text-center py-3 px-4 font-medium">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  // Grundlagen
                  { feature: 'Websites', free: '1', pro: '3', business: '10', enterprise: 'Unbegrenzt' },
                  { feature: 'Seiten pro Site', free: '5', pro: '25', business: '100', enterprise: 'Unbegrenzt' },
                  { feature: 'Speicher', free: '500 MB', pro: '2 GB', business: '10 GB', enterprise: '50 GB' },
                  { feature: 'Custom Domains', free: '—', pro: '1', business: '3', enterprise: 'Unbegrenzt' },
                  { feature: 'Team-Mitglieder', free: '1', pro: '3', business: '10', enterprise: 'Unbegrenzt' },
                  { feature: 'Formular-Einsendungen', free: '50/Mo', pro: '500/Mo', business: '2.000/Mo', enterprise: 'Unbegrenzt' },
                  { feature: 'SSL-Zertifikat', free: true, pro: true, business: true, enterprise: true },
                  { feature: 'Branding entfernen', free: false, pro: true, business: true, enterprise: true },
                  // Analytics & Tracking (ab Pro)
                  { feature: 'Google Analytics', free: false, pro: true, business: true, enterprise: true },
                  { feature: 'Plausible Analytics', free: false, pro: true, business: true, enterprise: true },
                  { feature: 'Microsoft Clarity', free: false, pro: true, business: true, enterprise: true },
                  { feature: 'Google Search Console', free: false, pro: true, business: true, enterprise: true },
                  { feature: 'Google reCAPTCHA', free: false, pro: true, business: true, enterprise: true },
                  { feature: 'Google Maps', free: false, pro: true, business: true, enterprise: true },
                  { feature: 'Schema.org Markup (SEO)', free: false, pro: true, business: true, enterprise: true },
                  { feature: 'WhatsApp Chat', free: false, pro: true, business: true, enterprise: true },
                  { feature: 'Cookie Consent (DSGVO)', free: false, pro: true, business: true, enterprise: true },
                  // Business-Integrationen
                  { feature: 'Google Tag Manager', free: false, pro: false, business: true, enterprise: true },
                  { feature: 'Google Ads Tracking', free: false, pro: false, business: true, enterprise: true },
                  { feature: 'Meta Pixel (Facebook)', free: false, pro: false, business: true, enterprise: true },
                  { feature: 'TikTok Pixel', free: false, pro: false, business: true, enterprise: true },
                  { feature: 'LinkedIn Insight Tag', free: false, pro: false, business: true, enterprise: true },
                  { feature: 'Pinterest Tag', free: false, pro: false, business: true, enterprise: true },
                  { feature: 'Hotjar Heatmaps', free: false, pro: false, business: true, enterprise: true },
                  { feature: 'Crisp Live Chat', free: false, pro: false, business: true, enterprise: true },
                  { feature: 'Calendly', free: false, pro: false, business: true, enterprise: true },
                  { feature: 'Mailchimp', free: false, pro: false, business: true, enterprise: true },
                  { feature: 'Brevo (Sendinblue)', free: false, pro: false, business: true, enterprise: true },
                  { feature: 'Zapier Webhooks', free: false, pro: false, business: true, enterprise: true },
                  { feature: 'Make (Integromat)', free: false, pro: false, business: true, enterprise: true },
                  { feature: 'Slack Benachrichtigungen', free: false, pro: false, business: true, enterprise: true },
                  { feature: 'PayPal Checkout', free: false, pro: false, business: true, enterprise: true },
                  { feature: 'Custom Code', free: false, pro: false, business: true, enterprise: true },
                  { feature: 'E-Commerce', free: false, pro: false, business: true, enterprise: true },
                  { feature: 'Passwortschutz', free: false, pro: false, business: true, enterprise: true },
                  // Enterprise-only
                  { feature: 'KI-Chatbot (OpenAI)', free: false, pro: false, business: false, enterprise: true },
                  { feature: 'SSO / SAML', free: false, pro: false, business: false, enterprise: true },
                  { feature: 'White Label', free: false, pro: false, business: false, enterprise: true },
                  { feature: 'Audit Log', free: false, pro: false, business: false, enterprise: true },
                  { feature: 'SLA 99.9%', free: false, pro: false, business: false, enterprise: true },
                  { feature: 'Support', free: 'Community', pro: 'E-Mail', business: 'Priorität', enterprise: 'Dediziert' },
                ].map((row) => (
                  <tr key={row.feature} className="hover:bg-muted/50">
                    <td className="py-3 pr-4 font-medium">{row.feature}</td>
                    {(['free', 'pro', 'business', 'enterprise'] as const).map((plan) => (
                      <td key={plan} className="text-center py-3 px-4">
                        {typeof row[plan] === 'boolean' ? (
                          row[plan] ? (
                            <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-4 w-4 text-muted-foreground/40 mx-auto" />
                          )
                        ) : (
                          <span className={plan === 'business' ? 'font-medium text-primary' : ''}>
                            {row[plan]}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Integrations Overview */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Verfügbare Integrationen</h2>
        <p className="text-muted-foreground text-sm">
          Verbinde deine Website mit den beliebtesten Tools und Services.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            // Analytics & Tracking (Pro)
            { name: 'Google Analytics', desc: 'Traffic-Analyse & Besucher-Insights mit GA4', icon: <BarChart3 className="h-5 w-5" />, minPlan: 'Pro' },
            { name: 'Plausible Analytics', desc: 'Datenschutzfreundliche Analyse ohne Cookies', icon: <Activity className="h-5 w-5" />, minPlan: 'Pro' },
            { name: 'Microsoft Clarity', desc: 'Kostenlose Heatmaps & Session Recordings', icon: <MonitorDot className="h-5 w-5" />, minPlan: 'Pro' },
            { name: 'Google Search Console', desc: 'SEO-Monitoring & Indexierung', icon: <Search className="h-5 w-5" />, minPlan: 'Pro' },
            { name: 'Google reCAPTCHA', desc: 'Spam-Schutz für Formulare', icon: <ShieldCheck className="h-5 w-5" />, minPlan: 'Pro' },
            { name: 'Google Maps', desc: 'Interaktive Karten & Standorte', icon: <MapPin className="h-5 w-5" />, minPlan: 'Pro' },
            { name: 'Schema.org Markup', desc: 'Structured Data für Google Rich Snippets', icon: <FileJson className="h-5 w-5" />, minPlan: 'Pro' },
            { name: 'WhatsApp Chat', desc: 'Floating Chat-Button für Kundenkontakt', icon: <MessageCircle className="h-5 w-5" />, minPlan: 'Pro' },
            { name: 'Cookie Consent', desc: 'DSGVO-konformer Cookie-Banner', icon: <Cookie className="h-5 w-5" />, minPlan: 'Pro' },
            // Advertising (Business)
            { name: 'Google Tag Manager', desc: 'Alle Marketing-Tags verwalten', icon: <Tag className="h-5 w-5" />, minPlan: 'Business' },
            { name: 'Google Ads', desc: 'Conversion-Tracking für Kampagnen', icon: <Megaphone className="h-5 w-5" />, minPlan: 'Business' },
            { name: 'Meta Pixel', desc: 'Facebook & Instagram Retargeting', icon: <Eye className="h-5 w-5" />, minPlan: 'Business' },
            { name: 'TikTok Pixel', desc: 'Conversion-Tracking für TikTok Ads', icon: <Music className="h-5 w-5" />, minPlan: 'Business' },
            { name: 'LinkedIn Insight Tag', desc: 'B2B-Retargeting über LinkedIn', icon: <Briefcase className="h-5 w-5" />, minPlan: 'Business' },
            { name: 'Pinterest Tag', desc: 'Conversion-Tracking für Pinterest Ads', icon: <Pin className="h-5 w-5" />, minPlan: 'Business' },
            { name: 'Hotjar', desc: 'Heatmaps & Besucher-Feedback', icon: <Flame className="h-5 w-5" />, minPlan: 'Business' },
            // Communication (Business)
            { name: 'Crisp Live Chat', desc: 'Live-Chat, Chatbot & Wissensdatenbank', icon: <MessagesSquare className="h-5 w-5" />, minPlan: 'Business' },
            { name: 'Calendly', desc: 'Terminbuchung direkt einbetten', icon: <Calendar className="h-5 w-5" />, minPlan: 'Business' },
            // E-Mail Marketing (Business)
            { name: 'Mailchimp', desc: 'Newsletter & E-Mail-Kampagnen', icon: <Mail className="h-5 w-5" />, minPlan: 'Business' },
            { name: 'Brevo (Sendinblue)', desc: 'E-Mail, SMS & Marketing-Automation', icon: <Send className="h-5 w-5" />, minPlan: 'Business' },
            // Automation (Business)
            { name: 'Zapier', desc: 'Webhooks zu 6.000+ Apps', icon: <Zap className="h-5 w-5" />, minPlan: 'Business' },
            { name: 'Make (Integromat)', desc: 'Visuelle Automation-Workflows', icon: <Workflow className="h-5 w-5" />, minPlan: 'Business' },
            { name: 'Slack', desc: 'Echtzeit-Benachrichtigungen in Slack', icon: <Hash className="h-5 w-5" />, minPlan: 'Business' },
            // Payments (Business)
            { name: 'PayPal', desc: 'PayPal-Buttons & Checkout', icon: <Wallet className="h-5 w-5" />, minPlan: 'Business' },
            { name: 'E-Commerce', desc: 'Shop, Warenkorb & Stripe Checkout', icon: <ShoppingCart className="h-5 w-5" />, minPlan: 'Business' },
            // Other (Business)
            { name: 'Custom Code', desc: 'Eigene Scripts in Head/Body', icon: <Code className="h-5 w-5" />, minPlan: 'Business' },
            { name: 'Passwortschutz', desc: 'Seiten mit Passwort schützen', icon: <Lock className="h-5 w-5" />, minPlan: 'Business' },
            // Enterprise
            { name: 'KI-Chatbot (OpenAI)', desc: 'GPT-basierter Chatbot für deine Website', icon: <Bot className="h-5 w-5" />, minPlan: 'Enterprise' },
          ].map((integration) => (
            <Card key={integration.name} className="hover:shadow-md transition-shadow">
              <CardContent className="flex items-start gap-4 pt-6">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  {integration.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-sm">{integration.name}</h3>
                    <Badge variant="secondary" className="text-xs shrink-0">
                      ab {integration.minPlan}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{integration.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      {/* Payment Method & Billing History */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Zahlungsmethode
            </CardTitle>
            <CardDescription>Verwalte deine Zahlungsmethoden</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center text-white text-xs font-bold">
                  VISA
                </div>
                <div>
                  <p className="font-medium">•••• •••• •••• 4242</p>
                  <p className="text-sm text-muted-foreground">Läuft ab 12/27</p>
                </div>
              </div>
              <Badge variant="outline">Standard</Badge>
            </div>
            <Button variant="outline" className="w-full">
              Zahlungsmethode hinzufügen
            </Button>
          </CardContent>
        </Card>

        {/* Billing History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Rechnungsverlauf
            </CardTitle>
            <CardDescription>Lade deine Rechnungen herunter</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {invoices.map((invoice) => (
                <div 
                  key={invoice.id} 
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{invoice.id}</p>
                      <p className="text-xs text-muted-foreground">{invoice.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm">€{invoice.amount}</span>
                    <Badge variant="success" className="text-xs">Bezahlt</Badge>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Häufige Fragen</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              q: 'Kann ich jederzeit kündigen?',
              a: 'Ja, du kannst dein Abo jederzeit zum Ende der Abrechnungsperiode kündigen. Es gibt keine langfristigen Verträge.',
            },
            {
              q: 'Was passiert mit meinen Daten nach dem Downgrade?',
              a: 'Deine Daten bleiben erhalten. Wenn du Limits überschreitest, kannst du keine neuen Inhalte hinzufügen, aber bestehende bleiben zugänglich.',
            },
            {
              q: 'Gibt es einen Jahresrabatt?',
              a: 'Ja! Bei jährlicher Zahlung sparst du 20% gegenüber der monatlichen Abrechnung.',
            },
            {
              q: 'Welche Zahlungsmethoden werden akzeptiert?',
              a: 'Wir akzeptieren alle gängigen Kreditkarten (Visa, Mastercard, Amex) sowie SEPA-Lastschrift über Stripe.',
            },
          ].map((faq) => (
            <Card key={faq.q}>
              <CardContent className="pt-6">
                <h3 className="font-medium mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
