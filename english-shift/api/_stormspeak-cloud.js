import crypto from 'node:crypto';

export function cloudEnv({requireService=true}={}) {
  const url=String(process.env.STORMSPEAK_SUPABASE_URL||'').replace(/\/$/,'');
  const publishable=String(process.env.STORMSPEAK_SUPABASE_PUBLISHABLE_KEY||'');
  const service=String(process.env.STORMSPEAK_SUPABASE_SERVICE_ROLE_KEY||'');
  const pairingSecret=String(process.env.STORMSPEAK_PAIRING_SECRET||'');
  if(!url||!publishable) throw new Error('stormspeak_cloud_not_configured');
  if(requireService&&(!service||!pairingSecret)) throw new Error('stormspeak_cloud_server_not_configured');
  return {url,publishable,service,pairingSecret};
}

export function sendJson(res,status,payload){
  res.status(status).setHeader('Cache-Control','no-store').json(payload);
}

export async function readVerifiedUser(req){
  const {url,publishable}=cloudEnv({requireService:false});
  const header=String(req.headers.authorization||'');
  const token=header.match(/^Bearer\s+(.+)$/i)?.[1];
  if(!token) return null;
  const r=await fetch(`${url}/auth/v1/user`,{headers:{apikey:publishable,Authorization:`Bearer ${token}`}});
  if(!r.ok) return null;
  return await r.json();
}

export function pairingHash(code){
  const {pairingSecret}=cloudEnv();
  const normalized=String(code||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
  return crypto.createHmac('sha256',pairingSecret).update(normalized).digest('hex');
}

export function newPairingCode(){
  const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes=crypto.randomBytes(8);
  let out='';
  for(let i=0;i<8;i++) out+=alphabet[bytes[i]%alphabet.length];
  return out;
}

export async function serviceRpc(name,args){
  const {url,service}=cloudEnv();
  const r=await fetch(`${url}/rest/v1/rpc/${encodeURIComponent(name)}`,{
    method:'POST',
    headers:{apikey:service,Authorization:`Bearer ${service}`,'Content-Type':'application/json'},
    body:JSON.stringify(args||{})
  });
  const raw=await r.text();
  if(!r.ok) throw new Error(`rpc_${name}_${r.status}:${raw.slice(0,300)}`);
  try{return JSON.parse(raw)}catch{return raw}
}

export async function serviceRest(path,{method='GET',body,prefer}={}){
  const {url,service}=cloudEnv();
  const headers={apikey:service,Authorization:`Bearer ${service}`};
  if(body!==undefined) headers['Content-Type']='application/json';
  if(prefer) headers.Prefer=prefer;
  const r=await fetch(`${url}/rest/v1/${path}`,{method,headers,body:body===undefined?undefined:JSON.stringify(body)});
  const raw=await r.text();
  if(!r.ok) throw new Error(`rest_${r.status}:${raw.slice(0,300)}`);
  if(!raw)return null;
  try{return JSON.parse(raw)}catch{return raw}
}

export function isAnonymousUser(user){
  return user?.is_anonymous===true;
}
