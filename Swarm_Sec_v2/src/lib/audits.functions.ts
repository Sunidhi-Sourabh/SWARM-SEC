import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { z } from 'zod';
const payload = z.object({ environment: z.enum(['Python', 'Cisco IOS CLI', 'Terraform AWS VPC', 'Docker Compose']), findings: z.array(z.object({ code: z.string().max(100), line: z.number().int().min(1), severity: z.enum(['CRITICAL', 'HIGH']), title: z.string().max(500), compliance: z.string().max(1000) })).max(2000), sourceLines: z.number().int().min(1).max(100001), structure: z.array(z.string().max(100000)).max(100000), tests: z.string().max(500000), remediated: z.string().max(500000), generatedAt: z.string().max(100), elapsedMs: z.number().nonnegative(), input: z.string().max(100000) });
function encode(bytes: Uint8Array) { return btoa(Array.from(bytes, x => String.fromCharCode(x)).join('')); }
function decode(value: string) { return Uint8Array.from(atob(value), x => x.charCodeAt(0)); }
async function keyFor(secret: string, userId: string) { const material = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(secret + ':' + userId)); return crypto.subtle.importKey('raw', material, 'AES-GCM', false, ['encrypt', 'decrypt']); }
export const saveAudit = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator(input => payload.parse(input)).handler(async ({ data, context }) => {
  const secret = process.env['AUDIT_ENCRYPTION_KEY']; if (!secret) throw new Error('Encrypted audit storage is unavailable.');
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: new TextEncoder().encode(context.userId) }, await keyFor(secret, context.userId), new TextEncoder().encode(JSON.stringify(data)));
  const { data: row, error } = await context.supabase.from('saved_audits').insert({ user_id: context.userId, ciphertext: encode(new Uint8Array(encrypted)), iv: encode(iv) }).select('id').single();
  if (error) throw new Error(error.message); return row;
});
export const listAudits = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const secret = process.env['AUDIT_ENCRYPTION_KEY']; if (!secret) throw new Error('Encrypted audit storage is unavailable.');
  const data: { id: string; created_at: string; iv: string; ciphertext: string }[] = [];
  for (let offset = 0; ; offset += 100) {
    const { data: batch, error } = await context.supabase.from('saved_audits').select('id, created_at, iv, ciphertext').eq('user_id', context.userId).order('created_at', { ascending: false }).order('id').range(offset, offset + 99);
    if (error) throw new Error(error.message);
    data.push(...(batch ?? []));
    if (!batch || batch.length < 100) break;
  }
  const key = await keyFor(secret, context.userId);
  return Promise.all((data ?? []).map(async row => {
    const clear = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: decode(row.iv), additionalData: new TextEncoder().encode(context.userId) }, key, decode(row.ciphertext));
    return { id: row.id, createdAt: row.created_at, audit: payload.parse(JSON.parse(new TextDecoder().decode(clear))) };
  }));
});
export const deleteAudit = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator(input => z.object({ id: z.string().uuid().optional() }).parse(input)).handler(async ({ data, context }) => {
  let query = context.supabase.from('saved_audits').delete().eq('user_id', context.userId);
  if (data.id) query = query.eq('id', data.id);
  const { error } = await query; if (error) throw new Error(error.message); return { success: true };
});
