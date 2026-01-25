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

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Layers className="h-6 w-6 text-primary" />
              <span className="font-bold">Builderly</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="#features" className="transition-colors hover:text-foreground/80">
                Features
              </Link>
              <Link href="#pricing" className="transition-colors hover:text-foreground/80">
                Pricing
              </Link>
            </nav>
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

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
          <div className="mx-auto max-w-[980px]">
            <h2 className="text-3xl font-bold text-center mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              Start free, upgrade when you need more
            </p>
            <div className="grid gap-8 md:grid-cols-3">
              <PricingCard
                name="Free"
                price="$0"
                description="For personal projects"
                features={[
                  '1 site',
                  '5 pages per site',
                  '100MB storage',
                  'Builderly subdomain',
                  'Community support',
                ]}
                cta="Get Started"
                ctaHref="/register"
              />
              <PricingCard
                name="Pro"
                price="$19"
                description="For professionals"
                features={[
                  '5 sites',
                  '50 pages per site',
                  '1GB storage',
                  'Custom domains',
                  'Remove watermark',
                  'Priority support',
                ]}
                cta="Start Free Trial"
                ctaHref="/register?plan=pro"
                highlighted
              />
              <PricingCard
                name="Business"
                price="$49"
                description="For teams & agencies"
                features={[
                  '20 sites',
                  '200 pages per site',
                  '10GB storage',
                  'Custom domains',
                  'Remove watermark',
                  'Priority support',
                  'Team collaboration',
                ]}
                cta="Contact Sales"
                ctaHref="/register?plan=business"
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
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <span className="font-semibold">Builderly</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Builderly. All rights reserved.
          </p>
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
        {price !== '$0' && <span className="text-muted-foreground">/month</span>}
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
