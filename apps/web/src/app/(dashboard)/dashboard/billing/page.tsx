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
  Sparkles
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
          _count: { select: { sites: true, members: true, assets: true } },
        },
      },
    },
  });

  const workspaces = memberships.map(m => ({ ...m.workspace, role: m.role }));

  // Plan limits
  const planLimits = {
    FREE: { sites: 1, members: 1, storage: 100, pages: 5 },
    PRO: { sites: 5, members: 5, storage: 1000, pages: 50 },
    BUSINESS: { sites: 999, members: 999, storage: 10000, pages: 999 },
  };

  const planPrices = {
    FREE: 0,
    PRO: 19,
    BUSINESS: 49,
  };

  const planFeatures = {
    FREE: ['1 Site', '1 Team Member', '100MB Storage', '5 Pages per Site', 'Builderly Branding'],
    PRO: ['5 Sites', '5 Team Members', '1GB Storage', '50 Pages per Site', 'Custom Domain', 'No Branding', 'Priority Support'],
    BUSINESS: ['Unlimited Sites', 'Unlimited Members', '10GB Storage', 'Unlimited Pages', 'Custom Domain', 'White Label', 'Dedicated Support', 'SSO'],
  };

  // Mock invoice data
  const invoices = [
    { id: 'INV-001', date: '2025-01-15', amount: 19, status: 'paid' },
    { id: 'INV-002', date: '2024-12-15', amount: 19, status: 'paid' },
    { id: 'INV-003', date: '2024-11-15', amount: 19, status: 'paid' },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Billing & Plans</h1>
        <p className="text-muted-foreground">
          Manage your subscriptions and billing information
        </p>
      </div>

      {/* Workspace Plans Overview */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Workspaces</h2>
        
        {workspaces.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <CreditCard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No workspaces to manage</h3>
              <p className="text-muted-foreground">
                You need to be an owner or admin of a workspace to manage billing.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {workspaces.map((workspace) => {
              const limits = planLimits[workspace.plan];
              const sitesUsed = workspace._count.sites;
              const membersUsed = workspace._count.members;
              
              return (
                <Card key={workspace.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          {workspace.plan === 'BUSINESS' ? (
                            <Crown className="h-5 w-5 text-yellow-500" />
                          ) : workspace.plan === 'PRO' ? (
                            <Sparkles className="h-5 w-5 text-primary" />
                          ) : (
                            <Zap className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <CardTitle>{workspace.name}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Badge 
                              variant={workspace.plan === 'FREE' ? 'secondary' : workspace.plan === 'PRO' ? 'default' : 'success'}
                            >
                              {workspace.plan}
                            </Badge>
                            {workspace.plan !== 'FREE' && (
                              <span className="text-sm">
                                ${planPrices[workspace.plan]}/month
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
                        <Button variant="outline">Manage Plan</Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Globe className="h-4 w-4" /> Sites
                          </span>
                          <span>{sitesUsed}/{limits.sites === 999 ? '∞' : limits.sites}</span>
                        </div>
                        <Progress value={(sitesUsed / limits.sites) * 100} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Users className="h-4 w-4" /> Members
                          </span>
                          <span>{membersUsed}/{limits.members === 999 ? '∞' : limits.members}</span>
                        </div>
                        <Progress value={(membersUsed / limits.members) * 100} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <HardDrive className="h-4 w-4" /> Storage
                          </span>
                          <span>0/{limits.storage}MB</span>
                        </div>
                        <Progress value={0} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Pages/Site</span>
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
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Available Plans</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {(['FREE', 'PRO', 'BUSINESS'] as const).map((plan) => (
            <Card 
              key={plan} 
              className={plan === 'PRO' ? 'border-primary shadow-lg scale-105' : ''}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{plan}</CardTitle>
                  {plan === 'PRO' && (
                    <Badge variant="default">Popular</Badge>
                  )}
                </div>
                <CardDescription>
                  <span className="text-3xl font-bold text-foreground">
                    ${planPrices[plan]}
                  </span>
                  {plan !== 'FREE' && <span className="text-muted-foreground">/month</span>}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {planFeatures[plan].map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full" 
                  variant={plan === 'PRO' ? 'default' : 'outline'}
                >
                  {plan === 'FREE' ? 'Current Plan' : 'Upgrade'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      {/* Payment Method */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Method
            </CardTitle>
            <CardDescription>Manage your payment methods</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center text-white text-xs font-bold">
                  VISA
                </div>
                <div>
                  <p className="font-medium">•••• •••• •••• 4242</p>
                  <p className="text-sm text-muted-foreground">Expires 12/26</p>
                </div>
              </div>
              <Badge variant="outline">Default</Badge>
            </div>
            <Button variant="outline" className="w-full">
              Add Payment Method
            </Button>
          </CardContent>
        </Card>

        {/* Billing History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Billing History
            </CardTitle>
            <CardDescription>Download your invoices</CardDescription>
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
                    <span className="text-sm">${invoice.amount}</span>
                    <Badge variant="success" className="text-xs">Paid</Badge>
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
    </div>
  );
}
