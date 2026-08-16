const URL='https://ai-gateway.vercel.sh/v1/chat/completions';

export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST')return res.status(405).json({error:'method'});
  if(!process.env.AI_GATEWAY_API_KEY)return res.status(503).json({error:'key missing'});

  const b=req.body||{};
  const level=b.profile?.estimatedLevel||b.profile?.level||b.level||'B1+';
  const weak=Array.isArray(b.weakTenses)?b.weakTenses:Array.isArray(b.weak)?b.weak:[];
  const length=Math.max(5,Math.min(10,Number(b.length)||8));
  const mode=['adaptive','grammar','listening'].includes(b.mode)?b.mode:'adaptive';
  const focus=String(b.focus||weak[0]||'mixed grammar').slice(0,80);

  let modeInstruction='Use a balanced mix of MCQ, German-to-English translation and listening. Prioritise the learner weak areas.';
  if(mode==='grammar') modeInstruction=`This is a focused grammar drill on ${focus}. Use mostly MCQ and German-to-English translation. Every item must genuinely test ${focus}; do not drift into unrelated grammar.`;
  if(mode==='listening') modeInstruction='This is a listening sprint. Every exercise MUST have type="listen". Put one natural spoken-English sentence in audio; prompt should be "Listen and type what you hear." Use contractions and realistic everyday phrases appropriate to the level.';

  const prompt=`Create ${length} English-learning exercises for a German-speaking learner at ${level}.
Mode: ${mode}. Focus: ${focus}. Weak areas: ${weak.join(', ')||'mixed grammar'}.
${modeInstruction}
Return ONLY valid JSON with this exact top-level shape: {"exercises":[...]}.
Each item must contain: type (mcq|translate|listen), tense, prompt, options, answer, best, accepted, explain, audio.
For mcq: exactly 4 options and answer is an integer 0-3.
For translate: options=[], answer=-1, best is the best natural English answer, accepted contains valid alternatives.
For listen: options=[], answer=-1, audio is the exact spoken sentence, best is the transcript, accepted may contain contraction variants.
Use natural current everyday English, useful chunks and concise German explanations. No markdown.`;

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
      tense:String(e.tense||focus||'Mixed'),
      prompt:String(e.prompt||''),
      options:Array.isArray(e.options)?e.options.slice(0,4).map(String):[],
      answer:Number.isInteger(e.answer)?e.answer:-1,
      best:String(e.best||''),
      accepted:Array.isArray(e.accepted)?e.accepted.map(String):[],
      explain:String(e.explain||''),
      audio:String(e.audio||'')
    }));

    return res.status(200).json({exercises,model:out.model||'openai/gpt-5-mini',mode,focus});
  }catch(e){return res.status(500).json({error:'generation',message:String(e.message||e)})}
}
