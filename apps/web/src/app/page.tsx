import Link from 'next/link';
import { Button } from '@builderly/ui';
import { 
  Layers, 
  Zap, 
  Shield, 
  Globe, 
  ShoppingCart, 
  MessageSquare,
  Check
} from 'lucide-react';
import { LandingHeader } from '@/components/landing-header';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <LandingHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container py-24 md:py-32">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
              Build anything.
              <br />
              <span className="text-primary">Ship everything.</span>
            </h1>
            <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
              The all-in-one website builder platform. Create landing pages, blogs, 
              e-commerce stores, forums, and membership portals — all without writing code.
            </p>
            <div className="flex gap-4 mt-4">
              <Link href="/register">
                <Button size="lg">Start Building Free</Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg">
                  See Features
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container py-24 bg-muted/50">
          <div className="mx-auto max-w-[980px]">
            <h2 className="text-3xl font-bold text-center mb-12">
              Everything you need to build the web
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<Layers className="h-8 w-8" />}
                title="Visual Editor"
                description="Drag and drop components to build beautiful pages. No coding required."
              />
              <FeatureCard
                icon={<Zap className="h-8 w-8" />}
                title="CMS Built-in"
                description="Manage your content with collections. Blog posts, products, anything."
              />
              <FeatureCard
                icon={<ShoppingCart className="h-8 w-8" />}
                title="E-Commerce"
                description="Sell products with built-in cart, checkout, and Stripe payments."
              />
              <FeatureCard
                icon={<MessageSquare className="h-8 w-8" />}
                title="Community Forums"
                description="Build engaged communities with threaded discussions."
              />
              <FeatureCard
                icon={<Shield className="h-8 w-8" />}
                title="Secure by Design"
                description="No code execution. Everything is validated and sandboxed."
              />
              <FeatureCard
                icon={<Globe className="h-8 w-8" />}
                title="Custom Domains"
                description="Connect your own domain. SSL included automatically."
              />
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="container py-24">
          <div className="mx-auto max-w-[1200px]">
            <h2 className="text-3xl font-bold text-center mb-4">
              Einfache, transparente Preise
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              Starte kostenlos, upgrade wenn du mehr brauchst
            </p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <PricingCard
                name="Starter"
                price="€0"
                description="Perfekt zum Ausprobieren"
                features={[
                  '1 Website',
                  '5 Seiten pro Site',
                  '500 MB Speicher',
                  'Builderly-Subdomain',
                  'SSL-Zertifikat',
                  'Basis SEO',
                  'Community Support',
                ]}
                cta="Kostenlos starten"
                ctaHref="/register"
              />
              <PricingCard
                name="Pro"
                price="€9"
                description="Für Freelancer & kleine Projekte"
                features={[
                  '3 Websites',
                  '25 Seiten pro Site',
                  '2 GB Speicher',
                  '1 Custom Domain',
                  '3 Team-Mitglieder',
                  'Kein Branding',
                  'Google Analytics & Plausible',
                  'Microsoft Clarity Heatmaps',
                  'Google Maps & Schema.org',
                  'WhatsApp Chat-Widget',
                  'reCAPTCHA & Cookie Consent',
                  'E-Mail Support',
                ]}
                cta="Jetzt upgraden"
                ctaHref="/register?plan=pro"
              />
              <PricingCard
                name="Business"
                price="€29"
                description="Für Teams & Unternehmen"
                features={[
                  '10 Websites',
                  '100 Seiten pro Site',
                  '10 GB Speicher',
                  '3 Custom Domains',
                  '10 Team-Mitglieder',
                  'Alle Pro-Features',
                  'TikTok, LinkedIn & Pinterest Pixel',
                  'Meta Pixel & Hotjar',
                  'Crisp Live Chat & Calendly',
                  'Mailchimp, Brevo & Custom Code',
                  'Zapier, Make & Slack',
                  'PayPal & E-Commerce',
                  'Passwortschutz',
                  'Prioritäts-Support',
                ]}
                cta="Jetzt upgraden"
                ctaHref="/register?plan=business"
                highlighted
              />
              <PricingCard
                name="Enterprise"
                price="€79"
                description="Für Agenturen & große Organisationen"
                features={[
                  'Unbegrenzte Websites',
                  'Unbegrenzte Seiten',
                  '50 GB Speicher',
                  'Unbegrenzte Domains',
                  'Unbegrenzte Mitglieder',
                  'Alle Business-Features',
                  'KI-Chatbot (OpenAI)',
                  'SSO / SAML Login',
                  'White Label',
                  'Audit Log',
                  'SLA 99.9% Uptime',
                  'Dedizierter Account Manager',
                ]}
                cta="Vertrieb kontaktieren"
                ctaHref="/register?plan=enterprise"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container py-24 bg-primary text-primary-foreground">
          <div className="mx-auto max-w-[600px] text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to build something amazing?
            </h2>
            <p className="mb-8 opacity-90">
              Join thousands of creators building with Builderly
            </p>
            <Link href="/register">
              <Button size="lg" variant="secondary">
                Start Building — It&apos;s Free
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="h-5 w-5 text-primary" />
                <span className="font-semibold text-lg">Builderly</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Der intuitive Website-Builder für kreative Köpfe. Erstelle professionelle Websites ohne Code.
              </p>
            </div>

            {/* Produkt */}
            <div>
              <h4 className="font-semibold text-sm mb-3">Produkt</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Preise</a></li>
                <li><a href="#templates" className="hover:text-foreground transition-colors">Vorlagen</a></li>
              </ul>
            </div>

            {/* Rechtliches */}
            <div>
              <h4 className="font-semibold text-sm mb-3">Rechtliches</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/impressum" className="hover:text-foreground transition-colors">Impressum</a></li>
                <li><a href="/datenschutz" className="hover:text-foreground transition-colors">Datenschutz</a></li>
              </ul>
            </div>

            {/* Kontakt */}
            <div>
              <h4 className="font-semibold text-sm mb-3">Kontakt</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="mailto:info@builderly.de" className="hover:text-foreground transition-colors">info@builderly.de</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-6 flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Builderly. Alle Rechte vorbehalten.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <a href="/impressum" className="hover:text-foreground transition-colors">Impressum</a>
              <a href="/datenschutz" className="hover:text-foreground transition-colors">Datenschutz</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function PricingCard({
  name,
  price,
  description,
  features,
  cta,
  ctaHref,
  highlighted,
}: {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  ctaHref: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-6 ${
        highlighted ? 'border-primary ring-2 ring-primary' : ''
      }`}
    >
      <h3 className="font-semibold text-lg">{name}</h3>
      <div className="mt-2 mb-4">
        <span className="text-4xl font-bold">{price}</span>
        {price !== '€0' && <span className="text-muted-foreground">/Monat</span>}
      </div>
      <p className="text-sm text-muted-foreground mb-6">{description}</p>
      <ul className="space-y-2 mb-6">
        {features.map((feature) => (
          <li key={feature} className="flex items-center text-sm">
            <Check className="h-4 w-4 text-primary mr-2" />
            {feature}
          </li>
        ))}
      </ul>
      <Link href={ctaHref}>
        <Button className="w-full" variant={highlighted ? 'default' : 'outline'}>
          {cta}
        </Button>
      </Link>
    </div>
  );
}
