import {sendJson,readVerifiedUser,isAnonymousUser,serviceRpc,pairingHash} from './_stormspeak-cloud.js';

export default async function handler(req,res){
  if(req.method!=='POST') return sendJson(res,405,{error:'method'});
  try{
    const user=await readVerifiedUser(req);
    if(!user) return sendJson(res,401,{error:'unauthorized'});
    if(!isAnonymousUser(user)) return sendJson(res,403,{error:'anonymous_child_session_required'});

    const code=String(req.body?.code||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
    if(code.length!==8) return sendJson(res,400,{error:'invalid_code'});
    const deviceLabel=String(req.body?.deviceLabel||'StormSpeak device').trim().slice(0,120);
    const learnerId=await serviceRpc('stormspeak_redeem_pairing_token',{
      p_token_hash:pairingHash(code),
      p_child_auth_user_id:user.id,
      p_device_label:deviceLabel
    });
    return sendJson(res,200,{ok:true,learnerId});
  }catch(e){
    const msg=String(e.message||e);
    const known=['pairing_token_invalid','pairing_token_used','pairing_token_expired'];
    const code=known.find(x=>msg.includes(x));
    return sendJson(res,code?400:500,{error:code||'pairing_api',message:code?undefined:msg.slice(0,300)});
  }
}
