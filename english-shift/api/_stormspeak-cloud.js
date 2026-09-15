const DEFAULT_URL='https://tvlphkclmdssazlkwavn.supabase.co';
const DEFAULT_PUBLISHABLE='sb_publishable_Y6oDt4QvOtTnmOu2Z0IWlg_FHv6cD-P';

export function cloudEnv(){
  const url=String(process.env.STORMSPEAK_SUPABASE_URL||DEFAULT_URL).replace(/\/$/,'');
  const publishable=String(process.env.STORMSPEAK_SUPABASE_PUBLISHABLE_KEY||DEFAULT_PUBLISHABLE);
  if(!url||!publishable) throw new Error('stormspeak_cloud_not_configured');
  return {url,publishable};
}

export function sendJson(res,status,payload){
  res.status(status).setHeader('Cache-Control','no-store').json(payload);
}

export async function forwardPairingAction(req,payload){
  const {url,publishable}=cloudEnv();
  const authorization=String(req.headers.authorization||'');
  if(!/^Bearer\s+.+/i.test(authorization)) return {status:401,payload:{error:'unauthorized'}};

  const r=await fetch(`${url}/functions/v1/stormspeak-pairing`,{
    method:'POST',
    headers:{
      apikey:publishable,
      Authorization:authorization,
      'Content-Type':'application/json'
    },
    body:JSON.stringify(payload||{})
  });
  const raw=await r.text();
  let body;
  try{body=JSON.parse(raw)}catch{body={error:'edge_response',message:raw.slice(0,300)}}
  return {status:r.status,payload:body};
}
