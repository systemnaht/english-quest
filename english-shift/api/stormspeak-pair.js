import {sendJson,forwardPairingAction} from './_stormspeak-cloud.js';

export default async function handler(req,res){
  if(req.method!=='POST') return sendJson(res,405,{error:'method'});
  try{
    const body=req.body||{};
    const code=String(body.code||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
    if(code.length!==8) return sendJson(res,400,{error:'invalid_code'});
    const result=await forwardPairingAction(req,{
      action:'redeem_pairing',
      code,
      deviceLabel:String(body.deviceLabel||'StormSpeak device').trim().slice(0,120)
    });
    return sendJson(res,result.status,result.payload);
  }catch(e){
    return sendJson(res,500,{error:'pairing_api',message:String(e.message||e).slice(0,300)});
  }
}
