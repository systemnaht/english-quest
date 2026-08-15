const URL='https://ai-gateway.vercel.sh/v1/chat/completions';

function deterministicError(answer){
  const a=String(answer||'').trim();
  const duration='(?:\\d+|a|an|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|several|many|few|a\\s+couple\\s+of|couple\\s+of)\\s+(?:seconds?|minutes?|hours?|days?|weeks?|months?|years?)';
  if(new RegExp('\\bsince\\s+(?:about\\s+|almost\\s+|nearly\\s+)?'+duration+'\\b','i').test(a)){
    return {correct:false,feedback:'Bei einer Zeitdauer benutzt man „for“, nicht „since“: for two hours. „Since“ braucht einen Startzeitpunkt, z. B. since 6 o’clock.',better:a.replace(/\\bsince\\s+/i,'for ')};
  }
  if(/\\bfor\\s+(?:yesterday|today|monday|tuesday|wednesday|thursday|friday|saturday|sunday|\\d{4}|\\d{1,2}(?::\\d{2})?\\s*(?:am|pm|o['’]?clock))\\b/i.test(a)){
    return {correct:false,feedback:'Bei einem Startzeitpunkt benutzt man „since“, nicht „for“.',better:a.replace(/\\bfor\\s+/i,'since ')};
  }
  return null;
}

export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST')return res.status(405).json({error:'method'});
  if(!process.env.AI_GATEWAY_API_KEY)return res.status(503).json({error:'key missing'});
  const {exercise={},answer='',level='B1+'}=req.body||{};
  if(!String(answer).trim())return res.status(400).json({error:'answer missing'});

  const hard=deterministicError(answer);
  if(hard)return res.status(200).json(hard);

  const prompt=`You are a strict but fair English teacher grading a German-speaking learner at ${level}.
Decide whether the learner's answer is grammatically correct, semantically faithful to the exercise, and natural enough for standard everyday English.
IMPORTANT GRADING RULES:
- If there is ANY real grammar error, mark correct=false, even if the meaning is understandable.
- Do not forgive wrong tense, auxiliary, agreement, article, preposition, word order, or since/for usage.
- Punctuation, capitalization and harmless spelling slips may be ignored if they do not create a grammar/meaning error.
- Natural equivalent wording is allowed only when it is fully grammatical and preserves the meaning.
- For durations use "for" (for two hours); for starting points use "since" (since 6 o'clock / since Monday).
Exercise: ${JSON.stringify(exercise).slice(0,3500)}
Learner answer: ${JSON.stringify(answer)}
Return ONLY valid JSON: {"correct":true|false,"feedback":"brief, specific German feedback; name the error if there is one","better":"best natural English version"}. No markdown.`;
  try{
    const r=await fetch(URL,{method:'POST',headers:{Authorization:`Bearer ${process.env.AI_GATEWAY_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({model:'openai/gpt-5-mini',messages:[{role:'user',content:prompt}],stream:false})});
    const t=await r.text();
    if(!r.ok)return res.status(r.status).json({error:'gateway',message:t.slice(0,1200)});
    const out=JSON.parse(t), c=out.choices?.[0]?.message?.content||'{}';
    const clean=c.replace(/^```json\\s*/i,'').replace(/^```\\s*/,'').replace(/```$/,'').trim();
    const j=JSON.parse(clean);
    return res.status(200).json({correct:j.correct===true,feedback:String(j.feedback||''),better:String(j.better||exercise.best||'')});
  }catch(e){return res.status(500).json({error:'evaluation',message:String(e.message||e)})}
}
