import { createServerFn } from '@tanstack/react-start';
import { contactSchema } from './contact-schema';
export const submitInquiry = createServerFn({ method: 'POST' }).inputValidator(input => contactSchema.parse(input)).handler(async ({ data }) => {
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(data.email.toLowerCase()));
  const rateKey = Array.from(new Uint8Array(hash), x => x.toString(16).padStart(2, '0')).join('');
  const { data: allowed, error: rateError } = await supabaseAdmin.rpc('allow_contact_submission', { rate_key: rateKey });
  if (rateError || !allowed) throw new Error('Too many inquiries. Please try again later.');
  const { data: row, error } = await supabaseAdmin.from('contact_submissions').insert({ name: data.name, org: data.org, email: data.email, subject: data.subject, query_type: data.type, message: data.message }).select('id').single();
  if (error) throw new Error('Your inquiry could not be stored. Please try again.');
  let sent = false;
  try {
    const response = await fetch('https://formspree.io/f/sunidhi11s.gdg@gmail.com', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data), signal: AbortSignal.timeout(12000) });
    const result = await response.json() as { ok?: boolean };
    sent = response.ok && result.ok === true;
  } catch { /* Inquiry remains stored even if external delivery fails. */ }
  await supabaseAdmin.from('contact_submissions').update({ delivery_status: sent ? 'accepted' : 'delivery_failed' }).eq('id', row.id);
  return { id: row.id, sent };
});
