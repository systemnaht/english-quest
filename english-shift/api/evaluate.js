const URL='https://ai-gateway.vercel.sh/v1/chat/completions';
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST')return res.status(405).json({error:'method'});
  if(!process.env.AI_GATEWAY_API_KEY)return res.status(503).json({error:'key missing'});
  const {exercise={},answer='',level='B1+'}=req.body||{};
  if(!answer)return res.status(400).json({error:'answer missing'});
  const prompt=`Evaluate this English learner answer at ${level}. Be tolerant of natural equivalent wording while checking meaning and grammar. Exercise: ${JSON.stringify(exercise).slice(0,3500)} Learner answer: ${JSON.stringify(answer)}. Return ONLY valid JSON: {"correct":true|false,"feedback":"brief German feedback","better":"best natural English version"}. No markdown.`;
  try{
    const r=await fetch(URL,{method:'POST',headers:{Authorization:`Bearer ${process.env.AI_GATEWAY_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({model:'openai/gpt-5-mini',messages:[{role:'user',content:prompt}],stream:false})});
    const t=await r.text();
    if(!r.ok)return res.status(r.status).json({error:'gateway',message:t.slice(0,1200)});
    const out=JSON.parse(t), c=out.choices?.[0]?.message?.content||'{}';
    const clean=c.replace(/^```json\s*/i,'').replace(/^```\s*/,'').replace(/```$/,'').trim();
    const j=JSON.parse(clean);
    return res.status(200).json({correct:!!j.correct,feedback:String(j.feedback||''),better:String(j.better||exercise.best||'')});
  }catch(e){return res.status(500).json({error:'evaluation',message:String(e.message||e)})}
}
