import nodemailer from 'nodemailer';
import { env }     from '../config/env.js';

function normalizedPassword() {
  return String(env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');
}

function createTransport() {
  const user = String(env.GMAIL_USER || '').trim();
  const pass = normalizedPassword();
  if (!user || !pass) return null;
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
}

export async function verifyMailTransport() {
  const transport = createTransport();
  if (!transport) return { configured: false, verified: false, error: 'GMAIL_USER or GMAIL_APP_PASSWORD is not configured.' };
  try {
    await transport.verify();
    return { configured: true, verified: true };
  } catch (error) {
    return {
      configured: true,
      verified: false,
      code: error?.code || null,
      responseCode: error?.responseCode || null,
      message: error?.message || 'SMTP verification failed',
    };
  } finally {
    transport.close();
  }
}

export async function sendMail({ to, subject, html, replyTo }) {
  const transport = createTransport();
  if (!transport) {
    console.warn('[email] GMAIL_USER or GMAIL_APP_PASSWORD not set — email not sent:', subject);
    return { skipped: true };
  }
  return transport.sendMail({
    from: `"Spandana Care Aid" <${String(env.GMAIL_USER).trim()}>`,
    to,
    subject,
    html,
    ...(replyTo ? { replyTo } : {}),
  });
}

export async function sendContactConfirmation({ name, email, message }) {
  return sendMail({
    to: email,
    subject: 'Thank you for contacting Spandana Care Aid Foundation',
    html: `<p>Dear ${name},</p><p>Thank you for reaching out. We have received your message and will respond within 2 business days.</p><p>Your message: <em>${message}</em></p><p>Warm regards,<br>Spandana Care Aid Foundation</p>`,
  });
}

export async function sendContactAlert({ name, email, phone, message }) {
  if (!env.CONTACT_EMAIL) return;
  return sendMail({
    to: env.CONTACT_EMAIL,
    replyTo: email,
    subject: `New contact form submission from ${name}`,
    html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Phone:</strong> ${phone || 'N/A'}</p><p><strong>Message:</strong></p><p>${message}</p>`,
  });
}

function esc(v) { return String(v ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function list(v) { return Array.isArray(v) ? v.join(', ') : (v || ''); }

export async function sendVolunteerAlert(payload) {
  if (!env.CONTACT_EMAIL) return;
  const rows = [
    ['Name', payload.fullName], ['Main Profession', payload.mainProfession || payload.profession || payload.occupation], ['Main Profession (Other)', payload.mainProfessionOther], ['Additional Professions / Backgrounds', list(payload.additionalProfessions)], ['Additional Professions (Other)', list(payload.additionalProfessionsOther)], ['Specialisation', list(payload.specialization)], ['Specialisation (Other)', list(payload.specializationOther)], ['WhatsApp / Mobile', payload.phone], ['Email', payload.email], ['Location', payload.location || payload.address], ['Date of Birth / Age', payload.dob ? `${payload.dob}${payload.age ? ` / ${payload.age}` : ''}` : payload.age],
    ['Qualification', payload.qualification], ['Organisation / Workplace', payload.organization], ['Current Role', payload.role], ['Years of Professional Experience', payload.yearsExperience], ['Business / Company', payload.businessName], ['Industry', payload.industry], ['Student Course', payload.studentCourse], ['Institution', payload.institution], ['Previous Profession / Service', payload.previousProfession], ['Skills', list(payload.skills) || payload.expertise], ['Skills (Other)', list(payload.skillsOther)], ['Interests', list(payload.interests || payload.areasOfInterest)], ['Interests (Other)', list(payload.interestsOther)], ['Associations / Networks', payload.associations], ['Connection Source', payload.sourceType || payload.connectionSource], ['Connection Source (Other)', payload.connectionOther], ['QR / Source ID', payload.sourceId], ['Connected Through', payload.connectorName], ['Connector Type', payload.connectorType], ['Referrer Name', payload.referralName], ['Referrer Mobile', payload.referralPhone], ['Referrer City', payload.referralCity], ['Source Detail', payload.sourceDetail], ['How I Can Connect / Contribute', list(payload.contributionTypes)], ['Contribution (Other)', list(payload.contributionOther)], ['Help Requested', list(payload.helpRequested)], ['Help Requested (Other)', list(payload.helpRequestedOther)], ['Help Note', payload.helpMessage], ['Future Relationship Interest', list(payload.futureRoles)],
  ];
  const html = `<p>A new Spandana Join Us connection was submitted.</p><table cellpadding="6" cellspacing="0" border="1" style="border-collapse:collapse">${rows.filter(([,v])=>v!==undefined&&v!==null&&String(v)!=='').map(([k,v])=>`<tr><td><strong>${esc(k)}</strong></td><td>${esc(v)}</td></tr>`).join('')}</table>`;
  return sendMail({ to: env.CONTACT_EMAIL, subject: `New Spandana connection from ${payload.fullName || 'visitor'}`, html });
}

export async function sendNewsletterAlert(email, totalCount) {
  if (!env.CONTACT_EMAIL) return;
  return sendMail({
    to: env.CONTACT_EMAIL,
    subject: `New newsletter subscriber: ${email}`,
    html: `<p><strong>${email}</strong> subscribed to the newsletter.</p><p>Total subscribers: <strong>${totalCount}</strong></p>`,
  });
}
