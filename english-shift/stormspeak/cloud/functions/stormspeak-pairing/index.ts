import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })
}

function secretKey() {
  const keys = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') || '{}')
  return keys.default || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
}

function publishableKey() {
  const keys = JSON.parse(Deno.env.get('SUPABASE_PUBLISHABLE_KEYS') || '{}')
  return keys.default || Deno.env.get('SUPABASE_ANON_KEY') || ''
}

function newPairingCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bytes = crypto.getRandomValues(new Uint8Array(8))
  let out = ''
  for (let i = 0; i < 8; i++) out += alphabet[bytes[i] % alphabet.length]
  return out
}

async function pairingHash(code: string, secret: string) {
  const normalized = String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '')
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(normalized))
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('')
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json(405, { error: 'method' })

  try {
    const url = Deno.env.get('SUPABASE_URL') || ''
    const publishable = publishableKey()
    const secret = secretKey()
    if (!url || !publishable || !secret) return json(500, { error: 'server_config' })

    const authHeader = req.headers.get('Authorization') || ''
    const token = authHeader.match(/^Bearer\s+(.+)$/i)?.[1]
    if (!token) return json(401, { error: 'unauthorized' })

    const userClient = createClient(url, publishable, { global: { headers: { Authorization: authHeader } } })
    const { data: userData, error: userError } = await userClient.auth.getUser(token)
    const user = userData?.user
    if (userError || !user) return json(401, { error: 'unauthorized' })

    const admin = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } })
    const body = await req.json().catch(() => ({}))
    const action = String(body?.action || '')
    const isAnonymous = user.is_anonymous === true

    if (action === 'create_learner') {
      if (isAnonymous) return json(403, { error: 'parent_account_required' })
      const displayName = String(body?.displayName || '').trim().slice(0, 80)
      if (!displayName) return json(400, { error: 'display_name_required' })

      const { error: profileError } = await admin.from('adult_profiles').upsert({
        id: user.id,
        display_name: String(body?.parentDisplayName || '').slice(0, 80) || null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' })
      if (profileError) throw profileError

      const { data, error } = await admin.rpc('stormspeak_create_learner', {
        p_parent_user_id: user.id,
        p_display_name: displayName,
      })
      if (error) throw error
      return json(200, { ok: true, learnerId: data })
    }

    if (action === 'create_pairing') {
      if (isAnonymous) return json(403, { error: 'parent_account_required' })
      const learnerId = String(body?.learnerId || '')
      if (!/^[0-9a-f-]{36}$/i.test(learnerId)) return json(400, { error: 'invalid_learner_id' })

      const raw = newPairingCode()
      const hash = await pairingHash(raw, secret)
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()
      const { error } = await admin.rpc('stormspeak_create_pairing_token', {
        p_token_hash: hash,
        p_learner_id: learnerId,
        p_parent_user_id: user.id,
        p_expires_at: expiresAt,
      })
      if (error) throw error
      return json(200, { ok: true, code: `${raw.slice(0, 4)}-${raw.slice(4)}`, expiresAt })
    }

    if (action === 'redeem_pairing') {
      if (!isAnonymous) return json(403, { error: 'anonymous_child_session_required' })
      const code = String(body?.code || '').toUpperCase().replace(/[^A-Z0-9]/g, '')
      if (code.length !== 8) return json(400, { error: 'invalid_code' })
      const deviceLabel = String(body?.deviceLabel || 'StormSpeak device').trim().slice(0, 120)
      const hash = await pairingHash(code, secret)
      const { data, error } = await admin.rpc('stormspeak_redeem_pairing_token', {
        p_token_hash: hash,
        p_child_auth_user_id: user.id,
        p_device_label: deviceLabel,
      })
      if (error) {
        const msg = String(error.message || '')
        const known = ['pairing_token_invalid', 'pairing_token_used', 'pairing_token_expired'].find(x => msg.includes(x))
        if (known) return json(400, { error: known })
        throw error
      }
      return json(200, { ok: true, learnerId: data })
    }

    return json(400, { error: 'unknown_action' })
  } catch (e) {
    console.error('stormspeak-pairing', e)
    return json(500, { error: 'pairing_function', message: String(e?.message || e).slice(0, 300) })
  }
})
