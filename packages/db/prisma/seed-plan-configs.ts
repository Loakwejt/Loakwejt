/**
 * Seed: PlanConfig-Tabelle mit den Standard-Abo-Limits befüllen.
 * Führe aus mit:  pnpm exec tsx prisma/seed-plan-configs.ts
 *
 * Existing rows werden per upsert aktualisiert, damit
 * der Seed beliebig oft laufen kann.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PLAN_CONFIGS = [
  {
    plan: 'FREE' as const,
    displayName: 'Starter',
    description: 'Basis-Features zum Ausprobieren',
    maxSites: 1,
    maxPagesPerSite: 5,
    maxStorage: BigInt(500 * 1024 * 1024), // 500 MB
    maxCustomDomains: 0,
    maxTeamMembers: 1,
    maxFormSubmissionsPerMonth: 50,
    customDomains: false,
    removeWatermark: false,
    prioritySupport: false,
    dedicatedSupport: false,
    ecommerce: false,
    passwordProtection: false,
    ssoSaml: false,
    whiteLabel: false,
    auditLog: false,
    slaGuarantee: false,
    integrations: JSON.stringify([]),
  },
  {
    plan: 'PRO' as const,
    displayName: 'Pro',
    description: 'Erweiterte Features für Freelancer & kleine Projekte',
    maxSites: 3,
    maxPagesPerSite: 25,
    maxStorage: BigInt(2 * 1024 * 1024 * 1024), // 2 GB
    maxCustomDomains: 1,
    maxTeamMembers: 3,
    maxFormSubmissionsPerMonth: 500,
    customDomains: true,
    removeWatermark: true,
    prioritySupport: false,
    dedicatedSupport: false,
    ecommerce: false,
    passwordProtection: false,
    ssoSaml: false,
    whiteLabel: false,
    auditLog: false,
    slaGuarantee: false,
    integrations: JSON.stringify([
      'google-analytics',
      'plausible-analytics',
      'microsoft-clarity',
      'google-search-console',
      'google-recaptcha',
      'google-maps',
      'schema-markup',
      'whatsapp-chat',
      'cookie-consent',
    ]),
  },
  {
    plan: 'BUSINESS' as const,
    displayName: 'Business',
    description: 'Professionelle Features für Teams & Unternehmen',
    maxSites: 10,
    maxPagesPerSite: 100,
    maxStorage: BigInt(10 * 1024 * 1024 * 1024), // 10 GB
    maxCustomDomains: 3,
    maxTeamMembers: 10,
    maxFormSubmissionsPerMonth: 2000,
    customDomains: true,
    removeWatermark: true,
    prioritySupport: true,
    dedicatedSupport: false,
    ecommerce: true,
    passwordProtection: true,
    ssoSaml: false,
    whiteLabel: false,
    auditLog: false,
    slaGuarantee: false,
    integrations: JSON.stringify([
      'google-analytics',
      'plausible-analytics',
      'microsoft-clarity',
      'google-search-console',
      'google-tag-manager',
      'google-recaptcha',
      'google-ads',
      'meta-pixel',
      'tiktok-pixel',
      'linkedin-insight',
      'pinterest-tag',
      'hotjar',
      'whatsapp-chat',
      'crisp-chat',
      'calendly',
      'mailchimp',
      'brevo',
      'zapier',
      'make',
      'slack-notifications',
      'google-maps',
      'schema-markup',
      'paypal',
      'custom-code',
      'cookie-consent',
    ]),
  },
  {
    plan: 'ENTERPRISE' as const,
    displayName: 'Enterprise',
    description: 'Enterprise-Features für Agenturen & große Organisationen',
    maxSites: 999,
    maxPagesPerSite: 999,
    maxStorage: BigInt(50 * 1024 * 1024 * 1024), // 50 GB
    maxCustomDomains: 999,
    maxTeamMembers: 999,
    maxFormSubmissionsPerMonth: 999999,
    customDomains: true,
    removeWatermark: true,
    prioritySupport: true,
    dedicatedSupport: true,
    ecommerce: true,
    passwordProtection: true,
    ssoSaml: true,
    whiteLabel: true,
    auditLog: true,
    slaGuarantee: true,
    integrations: JSON.stringify([
      'google-analytics',
      'plausible-analytics',
      'microsoft-clarity',
      'google-search-console',
      'google-tag-manager',
      'google-recaptcha',
      'google-ads',
      'meta-pixel',
      'tiktok-pixel',
      'linkedin-insight',
      'pinterest-tag',
      'hotjar',
      'whatsapp-chat',
      'crisp-chat',
      'calendly',
      'mailchimp',
      'brevo',
      'zapier',
      'make',
      'slack-notifications',
      'google-maps',
      'schema-markup',
      'paypal',
      'openai-chatbot',
      'custom-code',
      'cookie-consent',
    ]),
  },
];

async function main() {
  console.log('Seeding PlanConfig table …');

  for (const cfg of PLAN_CONFIGS) {
    await prisma.planConfig.upsert({
      where: { plan: cfg.plan },
      create: cfg,
      update: cfg,
    });
    console.log(`  ✔ ${cfg.plan} — ${cfg.displayName}`);
  }

  console.log('Done ✔');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
