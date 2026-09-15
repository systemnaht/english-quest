const GATEWAY='https://ai-gateway.vercel.sh/v1/chat/completions';
const MODEL='openai/gpt-5.4-mini';
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST')return res.status(405).json({error:'method'});
  if(!process.env.AI_GATEWAY_API_KEY)return res.status(503).json({error:'ai_key_missing'});
  const b=req.body||{},topic=b.topic||{},targets=Array.isArray(b.targets)?b.targets.slice(0,4):[];
  if(!targets.length)return res.status(400).json({error:'targets_required'});
  const ids=targets.map(x=>String(x.id||'')).filter(Boolean),theme=String(b.theme||topic.title||'Alltag').replace(/[<>]/g,'').slice(0,140);
  const prompt=`Erstelle eine kurze Englisch-Lernmission für ein deutschsprachiges Kind (10-12), A1. Thema: ${theme}. Bereich: ${String(topic.title||'Alltag').slice(0,80)}. Zielbausteine: ${JSON.stringify(targets).slice(0,2200)}. Alle Anweisungen/Situationen Deutsch, Lernsprache Englisch. Genau 6 Aufgaben, mindestens 4 Typen aus meaning, listen, build, type, choice. Jede Aufgabe hat goalId aus exakt: ${ids.join(', ')}. Falsche Optionen plausibel und themennah, kein Unsinn. meaning=4 deutsche Optionen; listen=4 englische Optionen; build=pieces; type=selbst schreiben; choice=deutsche Mini-Situation plus 4 englische Antworten. Nur JSON: {"title":"2-5 Wörter","scene":"2 kurze deutsche Sätze","exercises":[{"goalId":"...","type":"meaning|listen|build|type|choice","prompt":"...","context":"...","best":"...","answerText":"...","audio":"...","options":["..."],"pieces":["..."]}]}`;
  try{
    const r=await fetch(GATEWAY,{method:'POST',headers:{Authorization:`Bearer ${process.env.AI_GATEWAY_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({model:MODEL,messages:[{role:'user',content:prompt}],stream:false,temperature:.35,max_tokens:2600})});
    const raw=await r.text();if(!r.ok)return res.status(r.status).json({error:'gateway',message:raw.slice(0,700)});
    const out=JSON.parse(raw),content=out.choices?.[0]?.message?.content||'{}',j=JSON.parse(content.replace(/^```json\s*/i,'').replace(/^```\s*/,'').replace(/```$/,'').trim());
    if(!Array.isArray(j.exercises)||j.exercises.length<6)throw new Error('invalid_exercises');
    const exercises=j.exercises.slice(0,6).map(e=>({goalId:ids.includes(String(e.goalId))?String(e.goalId):ids[0],type:['meaning','listen','build','type','choice'].includes(e.type)?e.type:'type',prompt:String(e.prompt||'').slice(0,240),context:String(e.context||'').slice(0,180),best:String(e.best||'').slice(0,180),answerText:String(e.answerText||e.best||'').slice(0,180),audio:String(e.audio||e.best||'').slice(0,180),options:Array.isArray(e.options)?e.options.slice(0,4).map(x=>String(x).slice(0,160)):[],pieces:Array.isArray(e.pieces)?e.pieces.slice(0,12).map(x=>String(x).slice(0,80)):[]}));
    res.status(200).json({title:String(j.title||'AI Drop').slice(0,70),scene:String(j.scene||'').slice(0,500),exercises,model:out.model||MODEL});
  }catch(e){res.status(500).json({error:'generation',message:String(e.message||e).slice(0,400)})}
}
