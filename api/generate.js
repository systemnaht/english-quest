const URL='https://ai-gateway.vercel.sh/v1/chat/completions';
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST')return res.status(405).json({error:'method'});
  if(!process.env.AI_GATEWAY_API_KEY)return res.status(503).json({error:'key missing'});
  const b=req.body||{};
  const level=b.profile?.estimatedLevel||b.profile?.level||b.level||'B1+';
  const weak=b.weakTenses||b.weak||[];
  const length=Math.max(5,Math.min(10,Number(b.length)||8));
  const prompt=`Create ${length} adaptive everyday-English exercises for a German-speaking learner at ${level}. Weak areas: ${weak.join(', ')||'mixed grammar'}. Return only JSON: {"exercises":[...]}. Each item: type mcq|translate|listen, tense, prompt, options, answer, best, accepted, explain, audio. MCQ has 4 options and answer 0-3; translate/listen options=[], answer=-1. Natural spoken English, mixed tenses, no markdown.`;
  try{
    const r=await fetch(URL,{method:'POST',headers:{Authorization:`Bearer ${process.env.AI_GATEWAY_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({model:'openai/gpt-5-mini',messages:[{role:'user',content:prompt}],response_format:{type:'json_object'},max_tokens:2200})});
    const t=await r.text();
    if(!r.ok)return res.status(r.status).json({error:'gateway',message:t.slice(0,900)});
    const out=JSON.parse(t), c=out.choices?.[0]?.message?.content||'{}';
    const j=JSON.parse(c.replace(/^```json\s*/i,'').replace(/```$/,'').trim());
    if(!Array.isArray(j.exercises))throw new Error('no exercises');
    return res.status(200).json({exercises:j.exercises.slice(0,length),model:out.model||'openai/gpt-5-mini'});
  }catch(e){return res.status(500).json({error:'generation',message:String(e.message||e)})}
}
