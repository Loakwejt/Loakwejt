import {
  EmailProvider,
  SendEmailOptions,
  SendEmailResult,
  EmailTemplateId,
  TemplateVariables,
} from './types';
import { getEmailTemplate, renderCustomTemplate } from './templates';
import { ConsoleEmailProvider } from './providers/console';
import { ResendEmailProvider } from './providers/resend';
import { SmtpEmailProvider } from './providers/smtp';

// Export types
export * from './types';
export { getEmailTemplate, renderCustomTemplate } from './templates';

/**
 * Email service configuration
 */
interface EmailServiceConfig {
  provider: 'console' | 'resend' | 'smtp';
  from?: string;
  resendApiKey?: string;
  smtp?: {
    host: string;
    port: number;
    secure?: boolean;
    user?: string;
    pass?: string;
  };
}

/**
 * Email Service
 */
class EmailService {
  private provider: EmailProvider;
  private defaultFrom: string;

  constructor() {
    // Initialize with console provider by default
    this.provider = new ConsoleEmailProvider();
    this.defaultFrom = 'Builderly <noreply@builderly.dev>';
    
    // Initialize from environment
    this.initFromEnv();
  }

  private initFromEnv(): void {
    const providerType = process.env.EMAIL_PROVIDER || 'console';

    switch (providerType) {
      case 'resend':
        if (process.env.RESEND_API_KEY) {
          this.provider = new ResendEmailProvider(process.env.RESEND_API_KEY);
        } else {
          console.warn('RESEND_API_KEY not set, falling back to console provider');
        }
        break;

      case 'smtp':
        if (process.env.SMTP_HOST && process.env.SMTP_PORT) {
          this.provider = new SmtpEmailProvider({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT, 10),
            secure: process.env.SMTP_SECURE === 'true',
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
            from: process.env.EMAIL_FROM,
          });
        } else {
          console.warn('SMTP settings not configured, falling back to console provider');
        }
        break;

      case 'console':
      default:
        this.provider = new ConsoleEmailProvider();
        break;
    }

    if (process.env.EMAIL_FROM) {
      this.defaultFrom = process.env.EMAIL_FROM;
    }
  }

  /**
   * Set a custom email provider
   */
  setProvider(provider: EmailProvider): void {
    this.provider = provider;
  }

  /**
   * Get current provider name
   */
  getProviderName(): string {
    return this.provider.name;
  }

  /**
   * Send an email using raw options
   */
  async send(options: SendEmailOptions): Promise<SendEmailResult> {
    const emailOptions = {
      ...options,
      from: options.from || this.defaultFrom,
    };

    try {
      const result = await this.provider.send(emailOptions);
      
      if (!result.success) {
        console.error(`Email send failed: ${result.error}`);
      }
      
      return result;
    } catch (error) {
      console.error('Email service error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Send an email using a template
   */
  async sendTemplate(
    templateId: EmailTemplateId,
    to: string | string[],
    variables: TemplateVariables,
    options?: Partial<SendEmailOptions>
  ): Promise<SendEmailResult> {
    const template = getEmailTemplate(templateId, variables);

    return this.send({
      to,
      subject: template.subject,
      text: template.text,
      html: template.html,
      ...options,
    });
  }

  /**
   * Send a custom template email
   */
  async sendCustomTemplate(
    template: { subject: string; text?: string; html?: string },
    to: string | string[],
    variables: TemplateVariables,
    options?: Partial<SendEmailOptions>
  ): Promise<SendEmailResult> {
    const rendered = renderCustomTemplate(template, variables);

    return this.send({
      to,
      subject: rendered.subject,
      text: rendered.text,
      html: rendered.html,
      ...options,
    });
  }
}

// Singleton instance
export const emailService = new EmailService();

// Convenience functions
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  return emailService.send(options);
}

export async function sendTemplateEmail(
  templateId: EmailTemplateId,
  to: string | string[],
  variables: TemplateVariables,
  options?: Partial<SendEmailOptions>
): Promise<SendEmailResult> {
  return emailService.sendTemplate(templateId, to, variables, options);
}
