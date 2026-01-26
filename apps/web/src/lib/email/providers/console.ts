import { EmailProvider, SendEmailOptions, SendEmailResult } from '../types';

/**
 * Console email provider - logs emails to console
 * Useful for development and testing
 */
export class ConsoleEmailProvider implements EmailProvider {
  name = 'console';

  async send(options: SendEmailOptions): Promise<SendEmailResult> {
    const to = Array.isArray(options.to) 
      ? options.to.map(t => typeof t === 'string' ? t : t.email).join(', ')
      : typeof options.to === 'string' ? options.to : options.to.email;

    console.log('📧 ============ EMAIL ============');
    console.log(`To: ${to}`);
    console.log(`From: ${options.from || 'noreply@builderly.dev'}`);
    console.log(`Subject: ${options.subject}`);
    console.log('------- TEXT -------');
    console.log(options.text || '(no text content)');
    console.log('------- HTML -------');
    console.log(options.html ? '(HTML content available)' : '(no HTML content)');
    console.log('📧 ================================');

    return {
      success: true,
      messageId: `console-${Date.now()}`,
    };
  }
}
