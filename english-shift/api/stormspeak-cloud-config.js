import {cloudEnv,sendJson} from './_stormspeak-cloud.js';

export default async function handler(req,res){
  if(req.method!=='GET') return sendJson(res,405,{error:'method'});
  try{
    const {url,publishable}=cloudEnv();
    return sendJson(res,200,{enabled:true,supabaseUrl:url,publishableKey:publishable,supabaseJsVersion:'2.116.0'});
  }catch{
    return sendJson(res,200,{enabled:false});
  }
}
