/**
 * Email service types and interfaces
 */

export interface EmailAddress {
  email: string;
  name?: string;
}

export interface EmailAttachment {
  filename: string;
  content: Buffer | string;
  contentType?: string;
}

export interface SendEmailOptions {
  to: EmailAddress | EmailAddress[] | string | string[];
  from?: EmailAddress | string;
  replyTo?: EmailAddress | string;
  subject: string;
  text?: string;
  html?: string;
  cc?: EmailAddress | EmailAddress[] | string | string[];
  bcc?: EmailAddress | EmailAddress[] | string | string[];
  attachments?: EmailAttachment[];
  tags?: Record<string, string>;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface EmailProvider {
  name: string;
  send(options: SendEmailOptions): Promise<SendEmailResult>;
}

export interface EmailTemplate {
  subject: string;
  text: string;
  html: string;
}

export type TemplateVariables = Record<string, string | number | boolean | undefined>;

/**
 * Email template IDs
 */
export type EmailTemplateId =
  | 'welcome'
  | 'password-reset'
  | 'email-verification'
  | 'workspace-invitation'
  | 'form-submission-notification'
  | 'form-submission-confirmation';
