import { EmailTemplate, TemplateVariables, EmailTemplateId } from './types';

/**
 * Simple template string interpolation
 */
function interpolate(template: string, variables: TemplateVariables): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const value = variables[key];
    return value !== undefined ? String(value) : match;
  });
}

/**
 * Base HTML template wrapper
 */
function htmlWrapper(content: string, preheader = ''): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Builderly</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .card {
      background: white;
      border-radius: 8px;
      padding: 32px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 24px;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #7c3aed;
    }
    .button {
      display: inline-block;
      background: #7c3aed;
      color: white !important;
      padding: 12px 24px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 500;
      margin: 16px 0;
    }
    .footer {
      text-align: center;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #eee;
      color: #666;
      font-size: 14px;
    }
    .preheader {
      display: none !important;
      visibility: hidden;
      opacity: 0;
      color: transparent;
      height: 0;
      width: 0;
    }
  </style>
</head>
<body>
  <div class="preheader">${preheader}</div>
  <div class="container">
    <div class="card">
      <div class="header">
        <div class="logo">Builderly</div>
      </div>
      ${content}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Builderly. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`.trim();
}

/**
 * Email templates
 */
const templates: Record<EmailTemplateId, (vars: TemplateVariables) => EmailTemplate> = {
  'welcome': (vars) => ({
    subject: `Welcome to Builderly, ${vars.name || 'there'}!`,
    text: `
Welcome to Builderly!

Hi ${vars.name || 'there'},

Thank you for signing up for Builderly. We're excited to have you on board!

Get started by creating your first workspace:
${vars.dashboardUrl || 'https://app.builderly.dev/dashboard'}

If you have any questions, reply to this email - we're here to help.

Best,
The Builderly Team
    `.trim(),
    html: htmlWrapper(`
      <h1>Welcome to Builderly!</h1>
      <p>Hi ${vars.name || 'there'},</p>
      <p>Thank you for signing up for Builderly. We're excited to have you on board!</p>
      <p>Get started by creating your first workspace:</p>
      <p><a href="${vars.dashboardUrl || 'https://app.builderly.dev/dashboard'}" class="button">Go to Dashboard</a></p>
      <p>If you have any questions, just reply to this email - we're here to help.</p>
      <p>Best,<br>The Builderly Team</p>
    `, `Welcome to Builderly - Start building your website today!`),
  }),

  'password-reset': (vars) => ({
    subject: 'Reset your Builderly password',
    text: `
Reset your password

Hi ${vars.name || 'there'},

We received a request to reset your password. Click the link below to choose a new password:

${vars.resetUrl}

This link will expire in ${vars.expiresIn || '1 hour'}.

If you didn't request a password reset, you can safely ignore this email.

Best,
The Builderly Team
    `.trim(),
    html: htmlWrapper(`
      <h1>Reset your password</h1>
      <p>Hi ${vars.name || 'there'},</p>
      <p>We received a request to reset your password. Click the button below to choose a new password:</p>
      <p><a href="${vars.resetUrl}" class="button">Reset Password</a></p>
      <p style="color: #666; font-size: 14px;">This link will expire in ${vars.expiresIn || '1 hour'}.</p>
      <p>If you didn't request a password reset, you can safely ignore this email.</p>
      <p>Best,<br>The Builderly Team</p>
    `, `Reset your password`),
  }),

  'email-verification': (vars) => ({
    subject: 'Verify your email address',
    text: `
Verify your email address

Hi ${vars.name || 'there'},

Please verify your email address by clicking the link below:

${vars.verifyUrl}

This link will expire in ${vars.expiresIn || '24 hours'}.

Best,
The Builderly Team
    `.trim(),
    html: htmlWrapper(`
      <h1>Verify your email address</h1>
      <p>Hi ${vars.name || 'there'},</p>
      <p>Please verify your email address by clicking the button below:</p>
      <p><a href="${vars.verifyUrl}" class="button">Verify Email</a></p>
      <p style="color: #666; font-size: 14px;">This link will expire in ${vars.expiresIn || '24 hours'}.</p>
      <p>Best,<br>The Builderly Team</p>
    `, `Verify your email address`),
  }),

  'workspace-invitation': (vars) => ({
    subject: `You've been invited to join ${vars.workspaceName} on Builderly`,
    text: `
You've been invited to join a workspace

Hi ${vars.name || 'there'},

${vars.inviterName || 'Someone'} has invited you to join the "${vars.workspaceName}" workspace on Builderly.

Click the link below to accept the invitation:

${vars.inviteUrl}

This invitation will expire in ${vars.expiresIn || '7 days'}.

Best,
The Builderly Team
    `.trim(),
    html: htmlWrapper(`
      <h1>You've been invited!</h1>
      <p>Hi ${vars.name || 'there'},</p>
      <p><strong>${vars.inviterName || 'Someone'}</strong> has invited you to join the <strong>"${vars.workspaceName}"</strong> workspace on Builderly.</p>
      <p><a href="${vars.inviteUrl}" class="button">Accept Invitation</a></p>
      <p style="color: #666; font-size: 14px;">This invitation will expire in ${vars.expiresIn || '7 days'}.</p>
      <p>Best,<br>The Builderly Team</p>
    `, `Join ${vars.workspaceName} on Builderly`),
  }),

  'form-submission-notification': (vars) => ({
    subject: `New form submission: ${vars.formName}`,
    text: `
New Form Submission

You received a new submission on "${vars.formName}".

Site: ${vars.siteName}
Submitted at: ${vars.submittedAt}

Submission data:
${vars.submissionData}

View submission:
${vars.submissionUrl}

Best,
The Builderly Team
    `.trim(),
    html: htmlWrapper(`
      <h1>New Form Submission</h1>
      <p>You received a new submission on <strong>"${vars.formName}"</strong>.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Site</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${vars.siteName}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Submitted at</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${vars.submittedAt}</td>
        </tr>
      </table>
      <div style="background: #f5f5f5; padding: 16px; border-radius: 4px; margin: 16px 0;">
        <h3 style="margin-top: 0;">Submission Data</h3>
        <pre style="white-space: pre-wrap; word-break: break-word; margin: 0;">${vars.submissionData}</pre>
      </div>
      <p><a href="${vars.submissionUrl}" class="button">View Submission</a></p>
      <p>Best,<br>The Builderly Team</p>
    `, `New form submission on ${vars.formName}`),
  }),

  'form-submission-confirmation': (vars) => ({
    subject: `Thank you for your submission - ${vars.formName}`,
    text: `
Thank you for your submission!

Hi ${vars.name || 'there'},

We received your submission on "${vars.formName}". We'll get back to you as soon as possible.

${vars.customMessage || ''}

Best,
${vars.siteName}
    `.trim(),
    html: htmlWrapper(`
      <h1>Thank you for your submission!</h1>
      <p>Hi ${vars.name || 'there'},</p>
      <p>We received your submission on <strong>"${vars.formName}"</strong>. We'll get back to you as soon as possible.</p>
      ${vars.customMessage ? `<p>${vars.customMessage}</p>` : ''}
      <p>Best,<br>${vars.siteName}</p>
    `, `Thank you for your submission`),
  }),
};

/**
 * Get rendered email template
 */
export function getEmailTemplate(
  templateId: EmailTemplateId,
  variables: TemplateVariables
): EmailTemplate {
  const templateFn = templates[templateId];
  if (!templateFn) {
    throw new Error(`Unknown email template: ${templateId}`);
  }
  return templateFn(variables);
}

/**
 * Render custom template
 */
export function renderCustomTemplate(
  template: { subject: string; text?: string; html?: string },
  variables: TemplateVariables
): EmailTemplate {
  return {
    subject: interpolate(template.subject, variables),
    text: template.text ? interpolate(template.text, variables) : '',
    html: template.html ? interpolate(template.html, variables) : '',
  };
}
