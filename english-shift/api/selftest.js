const URL='https://ai-gateway.vercel.sh/v1/chat/completions';
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='GET')return res.status(405).json({ok:false});
  if(!process.env.AI_GATEWAY_API_KEY)return res.status(503).json({ok:false,error:'key missing'});
  try{
    const r=await fetch(URL,{method:'POST',headers:{Authorization:`Bearer ${process.env.AI_GATEWAY_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({model:'openai/gpt-5-mini',messages:[{role:'user',content:'Return only this JSON and nothing else: {"ok":true}'}],stream:false})});
    const text=await r.text();
    if(!r.ok)return res.status(r.status).json({ok:false,status:r.status,message:text.slice(0,800)});
    const out=JSON.parse(text), content=out.choices?.[0]?.message?.content||'';
    return res.status(200).json({ok:true,model:out.model||'openai/gpt-5-mini',content});
  }catch(e){return res.status(500).json({ok:false,error:String(e.message||e)})}
}
