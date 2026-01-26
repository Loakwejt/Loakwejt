import { EmailProvider, SendEmailOptions, SendEmailResult, EmailAddress } from '../types';

/**
 * Generic SMTP email provider using nodemailer
 * Note: Requires nodemailer to be installed
 */
export class SmtpEmailProvider implements EmailProvider {
  name = 'smtp';
  private config: {
    host: string;
    port: number;
    secure: boolean;
    auth?: {
      user: string;
      pass: string;
    };
    from: string;
  };

  constructor(config: {
    host: string;
    port: number;
    secure?: boolean;
    user?: string;
    pass?: string;
    from?: string;
  }) {
    this.config = {
      host: config.host,
      port: config.port,
      secure: config.secure ?? config.port === 465,
      from: config.from || 'noreply@builderly.dev',
    };

    if (config.user && config.pass) {
      this.config.auth = {
        user: config.user,
        pass: config.pass,
      };
    }
  }

  private formatAddress(addr: EmailAddress | string): string {
    if (typeof addr === 'string') return addr;
    return addr.name ? `"${addr.name}" <${addr.email}>` : addr.email;
  }

  private formatAddresses(addrs: EmailAddress | EmailAddress[] | string | string[]): string {
    if (Array.isArray(addrs)) {
      return addrs.map(a => this.formatAddress(a)).join(', ');
    }
    return this.formatAddress(addrs);
  }

  async send(options: SendEmailOptions): Promise<SendEmailResult> {
    try {
      // Dynamic import to avoid bundling nodemailer if not used
      const nodemailer = await import('nodemailer');
      
      const transporter = nodemailer.createTransport({
        host: this.config.host,
        port: this.config.port,
        secure: this.config.secure,
        auth: this.config.auth,
      });

      const mailOptions: Record<string, unknown> = {
        from: options.from ? this.formatAddress(options.from) : this.config.from,
        to: this.formatAddresses(options.to),
        subject: options.subject,
      };

      if (options.text) mailOptions.text = options.text;
      if (options.html) mailOptions.html = options.html;
      if (options.replyTo) mailOptions.replyTo = this.formatAddress(options.replyTo);
      if (options.cc) mailOptions.cc = this.formatAddresses(options.cc);
      if (options.bcc) mailOptions.bcc = this.formatAddresses(options.bcc);

      if (options.attachments) {
        mailOptions.attachments = options.attachments.map(att => ({
          filename: att.filename,
          content: att.content,
          contentType: att.contentType,
        }));
      }

      const info = await transporter.sendMail(mailOptions);

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      console.error('SMTP send error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send email via SMTP',
      };
    }
  }
}
