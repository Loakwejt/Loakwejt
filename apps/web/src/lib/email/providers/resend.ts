import { EmailProvider, SendEmailOptions, SendEmailResult, EmailAddress } from '../types';

/**
 * Resend email provider
 * https://resend.com
 */
export class ResendEmailProvider implements EmailProvider {
  name = 'resend';
  private apiKey: string;
  private baseUrl = 'https://api.resend.com';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private formatAddress(addr: EmailAddress | string): string {
    if (typeof addr === 'string') return addr;
    return addr.name ? `${addr.name} <${addr.email}>` : addr.email;
  }

  private formatAddresses(addrs: EmailAddress | EmailAddress[] | string | string[]): string[] {
    if (Array.isArray(addrs)) {
      return addrs.map(a => this.formatAddress(a));
    }
    return [this.formatAddress(addrs)];
  }

  async send(options: SendEmailOptions): Promise<SendEmailResult> {
    try {
      const payload: Record<string, unknown> = {
        from: options.from 
          ? this.formatAddress(options.from) 
          : 'Builderly <noreply@builderly.dev>',
        to: this.formatAddresses(options.to),
        subject: options.subject,
      };

      if (options.text) payload.text = options.text;
      if (options.html) payload.html = options.html;
      if (options.replyTo) payload.reply_to = this.formatAddress(options.replyTo);
      if (options.cc) payload.cc = this.formatAddresses(options.cc);
      if (options.bcc) payload.bcc = this.formatAddresses(options.bcc);
      if (options.tags) payload.tags = Object.entries(options.tags).map(([name, value]) => ({ name, value }));

      if (options.attachments) {
        payload.attachments = options.attachments.map(att => ({
          filename: att.filename,
          content: typeof att.content === 'string' 
            ? att.content 
            : att.content.toString('base64'),
        }));
      }

      const response = await fetch(`${this.baseUrl}/emails`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Failed to send email',
        };
      }

      return {
        success: true,
        messageId: data.id,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
