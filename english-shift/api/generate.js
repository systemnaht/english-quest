const URL='https://ai-gateway.vercel.sh/v1/chat/completions';
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST')return res.status(405).json({error:'method'});
  if(!process.env.AI_GATEWAY_API_KEY)return res.status(503).json({error:'key missing'});
  const b=req.body||{};
  const level=b.profile?.estimatedLevel||b.profile?.level||b.level||'B1+';
  const weak=Array.isArray(b.weakTenses)?b.weakTenses:Array.isArray(b.weak)?b.weak:[];
  const length=Math.max(5,Math.min(10,Number(b.length)||8));
  const prompt=`Create ${length} adaptive everyday-English exercises for a German-speaking learner at ${level}. Weak areas: ${weak.join(', ')||'mixed grammar'}. Return ONLY valid JSON with this exact top-level shape: {"exercises":[...]}. Each item must contain: type (mcq|translate|listen), tense, prompt, options, answer, best, accepted, explain, audio. For mcq: exactly 4 options and answer is an integer 0-3. For translate/listen: options=[], answer=-1. Use natural spoken English, mixed tenses, useful everyday chunks and concise German explanations. No markdown.`;
  try{
    const r=await fetch(URL,{method:'POST',headers:{Authorization:`Bearer ${process.env.AI_GATEWAY_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({model:'openai/gpt-5-mini',messages:[{role:'user',content:prompt}],stream:false})});
    const t=await r.text();
    if(!r.ok)return res.status(r.status).json({error:'gateway',message:t.slice(0,1200)});
    const out=JSON.parse(t);
    const c=out.choices?.[0]?.message?.content||'{}';
    const clean=c.replace(/^```json\s*/i,'').replace(/^```\s*/,'').replace(/```$/,'').trim();
    const j=JSON.parse(clean);
    if(!Array.isArray(j.exercises)||!j.exercises.length)throw new Error('no exercises');
    const exercises=j.exercises.slice(0,length).map(e=>({
      type:['mcq','translate','listen'].includes(e.type)?e.type:'translate',
      tense:String(e.tense||'Mixed'),prompt:String(e.prompt||''),
      options:Array.isArray(e.options)?e.options.slice(0,4).map(String):[],
      answer:Number.isInteger(e.answer)?e.answer:-1,best:String(e.best||''),
      accepted:Array.isArray(e.accepted)?e.accepted.map(String):[],
      explain:String(e.explain||''),audio:String(e.audio||'')
    }));
    return res.status(200).json({exercises,model:out.model||'openai/gpt-5-mini'});
  }catch(e){return res.status(500).json({error:'generation',message:String(e.message||e)})}
}
