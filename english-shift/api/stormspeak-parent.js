import {sendJson,forwardPairingAction} from './_stormspeak-cloud.js';

export default async function handler(req,res){
  if(req.method!=='POST') return sendJson(res,405,{error:'method'});
  try{
    const body=req.body||{};
    const action=String(body.action||'');
    if(!['create_learner','create_pairing'].includes(action)) return sendJson(res,400,{error:'unknown_action'});
    const result=await forwardPairingAction(req,body);
    return sendJson(res,result.status,result.payload);
  }catch(e){
    return sendJson(res,500,{error:'parent_api',message:String(e.message||e).slice(0,300)});
  }
}
