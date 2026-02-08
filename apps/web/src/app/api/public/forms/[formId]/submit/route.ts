import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';
import { createAuditLog } from '@/lib/audit';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { sanitizeObject } from '@/lib/sanitize';

interface FormField {
  name: string;
  type: string;
  label: string;
  required?: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
}

interface FormSchema {
  fields: FormField[];
}

// Simple spam detection
function calculateSpamScore(data: Record<string, unknown>, userAgent: string | null): number {
  let score = 0;

  // Check for honeypot field
  if (data._hp || data.hp || data.honeypot) {
    score += 50;
  }

  // Check for suspicious patterns
  const jsonString = JSON.stringify(data).toLowerCase();
  
  // Excessive URLs
  const urlCount = (jsonString.match(/https?:\/\//g) || []).length;
  if (urlCount > 3) score += 20;
  if (urlCount > 10) score += 30;

  // Suspicious keywords
  const spamKeywords = ['viagra', 'casino', 'lottery', 'winner', 'click here', 'buy now', 'free money'];
  for (const keyword of spamKeywords) {
    if (jsonString.includes(keyword)) {
      score += 10;
    }
  }

  // No user agent or suspicious user agent
  if (!userAgent) {
    score += 20;
  } else if (userAgent.includes('curl') || userAgent.includes('wget') || userAgent.includes('python')) {
    score += 15;
  }

  // Very short submission time (could indicate bot)
  // This would require tracking form load time, skipping for now

  return Math.min(score, 100);
}

// POST /api/public/forms/[formId]/submit
export async function POST(
  request: NextRequest,
  { params }: { params: { formId: string } }
) {
  try {
    // Rate limiting for public submissions
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = await rateLimit(ip, {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 5,
      keyPrefix: 'rl:form:submit',
    });

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { 
          status: 429,
          headers: { 'Retry-After': String(rateLimitResult.retryAfter || 60) },
        }
      );
    }

    // Get form
    const form = await prisma.form.findUnique({
      where: { id: params.formId },
      include: {
        site: {
          select: { id: true, isPublished: true, workspaceId: true, name: true },
        },
      },
    });

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    // Check if form and site are active
    if (!form.isActive) {
      return NextResponse.json({ error: 'Form is not accepting submissions' }, { status: 400 });
    }

    if (!form.site.isPublished) {
      return NextResponse.json({ error: 'Site is not published' }, { status: 400 });
    }

    // Parse and sanitize submission data
    const body = await request.json();
    const sanitizedData = sanitizeObject(body.data || {}, {
      maxStringLength: 10000,
      maxDepth: 5,
    });

    // Validate against form schema if defined
    const schema = form.schema as unknown as FormSchema;
    if (schema?.fields?.length) {
      const validationErrors: { field: string; message: string }[] = [];

      for (const field of schema.fields) {
        const value = sanitizedData[field.name];

        // Required check
        if (field.required && (value === undefined || value === null || value === '')) {
          validationErrors.push({ field: field.name, message: `${field.label} is required` });
          continue;
        }

        // Skip validation if empty and not required
        if (value === undefined || value === null || value === '') {
          continue;
        }

        // Type-specific validation
        if (field.type === 'email' && typeof value === 'string') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            validationErrors.push({ field: field.name, message: 'Invalid email address' });
          }
        }

        if (field.validation) {
          const v = field.validation;

          if (typeof value === 'string') {
            if (v.minLength && value.length < v.minLength) {
              validationErrors.push({ field: field.name, message: `Minimum ${v.minLength} characters required` });
            }
            if (v.maxLength && value.length > v.maxLength) {
              validationErrors.push({ field: field.name, message: `Maximum ${v.maxLength} characters allowed` });
            }
            if (v.pattern && !new RegExp(v.pattern).test(value)) {
              validationErrors.push({ field: field.name, message: 'Invalid format' });
            }
          }

          if (typeof value === 'number') {
            if (v.min !== undefined && value < v.min) {
              validationErrors.push({ field: field.name, message: `Minimum value is ${v.min}` });
            }
            if (v.max !== undefined && value > v.max) {
              validationErrors.push({ field: field.name, message: `Maximum value is ${v.max}` });
            }
          }
        }
      }

      if (validationErrors.length > 0) {
        return NextResponse.json(
          { error: 'Validation failed', details: validationErrors },
          { status: 400 }
        );
      }
    }

    // Calculate spam score
    const userAgent = request.headers.get('user-agent');
    const spamScore = calculateSpamScore(sanitizedData, userAgent);
    const isSpam = spamScore >= 50;

    // Create submission
    const submission = await prisma.formSubmission.create({
      data: {
        formId: params.formId,
        data: sanitizedData,
        ipAddress: ip.slice(0, 45), // Limit IP length
        userAgent: userAgent?.slice(0, 255),
        referrer: request.headers.get('referer')?.slice(0, 500),
        spamScore,
        isSpam,
        status: isSpam ? 'SPAM' : 'NEW',
      },
    });

    // Send notification emails if configured
    if (form.notifyEmails.length > 0 && !isSpam) {
      // Import dynamically to avoid circular dependencies
      const { sendTemplateEmail } = await import('@/lib/email');
      
      // Format submission data for email
      const submissionDataFormatted = Object.entries(sanitizedData)
        .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
        .join('\n');

      await sendTemplateEmail(
        'form-submission-notification',
        form.notifyEmails,
        {
          formName: form.name,
          siteName: form.site.name || 'Unbekannte Website',
          submittedAt: new Date().toLocaleString(),
          submissionData: submissionDataFormatted,
          submissionUrl: `${process.env.NEXTAUTH_URL}/dashboard/workspaces/${form.site.workspaceId}/sites/${form.siteId}/forms/${form.id}/submissions/${submission.id}`,
        }
      ).catch(err => console.error('Failed to send notification email:', err));
    }

    await createAuditLog({ action: 'FORM_SUBMISSION_CREATED', entity: 'FormSubmission', entityId: submission.id, details: { formId: params.formId, isSpam, spamScore } });

    return NextResponse.json({
      success: true,
      message: form.successMessage,
      redirectUrl: form.redirectUrl,
      submissionId: submission.id,
    });
  } catch (error) {
    console.error('Form submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit form. Please try again.' },
      { status: 500 }
    );
  }
}

// Support for GET requests (for forms using GET method)
export async function GET(
  request: NextRequest,
  { params }: { params: { formId: string } }
) {
  // Convert query params to body and use POST handler
  const url = new URL(request.url);
  const data: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    if (key !== 'formId') {
      data[key] = value;
    }
  });

  // Create a new request with the data as body
  const newRequest = new NextRequest(request.url, {
    method: 'POST',
    headers: request.headers,
    body: JSON.stringify({ data }),
  });

  return POST(newRequest, { params });
}
