import {sendJson,readVerifiedUser,isAnonymousUser,serviceRpc,serviceRest,newPairingCode,pairingHash} from './_stormspeak-cloud.js';

export default async function handler(req,res){
  if(req.method!=='POST') return sendJson(res,405,{error:'method'});
  try{
    const user=await readVerifiedUser(req);
    if(!user) return sendJson(res,401,{error:'unauthorized'});
    if(isAnonymousUser(user)) return sendJson(res,403,{error:'parent_account_required'});

    const body=req.body||{};
    const action=String(body.action||'');

    await serviceRest('adult_profiles?on_conflict=id',{
      method:'POST',
      prefer:'resolution=merge-duplicates,return=minimal',
      body:{id:user.id,display_name:String(body.parentDisplayName||'').slice(0,80)||null,updated_at:new Date().toISOString()}
    });

    if(action==='create_learner'){
      const displayName=String(body.displayName||'').trim().slice(0,80);
      if(!displayName) return sendJson(res,400,{error:'display_name_required'});
      const learnerId=await serviceRpc('stormspeak_create_learner',{p_parent_user_id:user.id,p_display_name:displayName});
      return sendJson(res,200,{ok:true,learnerId});
    }

    if(action==='create_pairing'){
      const learnerId=String(body.learnerId||'');
      if(!/^[0-9a-f-]{36}$/i.test(learnerId)) return sendJson(res,400,{error:'invalid_learner_id'});
      const raw=newPairingCode();
      const hash=pairingHash(raw);
      const expiresAt=new Date(Date.now()+10*60*1000).toISOString();
      await serviceRpc('stormspeak_create_pairing_token',{
        p_token_hash:hash,
        p_learner_id:learnerId,
        p_parent_user_id:user.id,
        p_expires_at:expiresAt
      });
      const code=`${raw.slice(0,4)}-${raw.slice(4)}`;
      return sendJson(res,200,{ok:true,code,expiresAt});
    }

    return sendJson(res,400,{error:'unknown_action'});
  }catch(e){
    return sendJson(res,500,{error:'parent_api',message:String(e.message||e).slice(0,400)});
  }
}
