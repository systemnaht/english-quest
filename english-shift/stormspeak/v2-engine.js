import cloud from './v2-cloud.js?v=200';
export const curriculum=window.STORMSPEAK_CURRICULUM||[];
export const feedback=window.STORMSPEAK_FEEDBACK||{good:['Richtig!'],retry:['Noch nicht.']};
export const allGoals=curriculum.flatMap(topic=>topic.goals.map(g=>({...g,topicId:topic.id,topicTitle:topic.title,topicIcon:topic.icon})));
export const goalById=Object.fromEntries(allGoals.map(g=>[g.id,g]));
export const topicById=Object.fromEntries(curriculum.map(t=>[t.id,t]));
export const shuffle=a=>[...a].sort(()=>Math.random()-.5);
export const clean=s=>String(s||'').toLowerCase().replace(/[’']/g,"'").replace(/[^a-z0-9' ]/g,'').replace(/\b(i'm)\b/g,'i am').replace(/\b(can't)\b/g,'cannot').replace(/\b(don't)\b/g,'do not').replace(/\b(i'd)\b/g,'i would').replace(/\b(i'll)\b/g,'i will').replace(/\b(let's)\b/g,'let us').replace(/\s+/g,' ').trim();
const LOCAL='stormspeakV2Local';let local=loadLocal();
function loadLocal(){try{return{sessions:0,attempts:0,correct:0,...JSON.parse(localStorage.getItem(LOCAL)||'{}')}}catch{return{sessions:0,attempts:0,correct:0}}}
function save(){localStorage.setItem(LOCAL,JSON.stringify(local))}
export function recordLocalAttempt(ok){local.attempts++;if(ok)local.correct++;save()}
export function recordLocalSession(){local.sessions++;save()}
export function stateFor(id){return cloud.state(id)}
export function topicProgress(t){const s=t.goals.map(g=>Number(stateFor(g.id).mastery_score||0));return Math.round(s.reduce((a,b)=>a+b,0)/Math.max(1,s.length))}
export function accuracy(){const s=cloud.status().ready?cloud.status().stats:local;return s.attempts?Math.round(s.correct/s.attempts*100):null}
export function sessions(){return cloud.status().ready?cloud.status().stats.sessions:local.sessions}
export function xp(){const s=cloud.status().ready?cloud.status().stats:local;return s.correct*10+s.sessions*20}
export function masteredCount(){return allGoals.filter(g=>stateFor(g.id).learning_state==='MASTERED').length}
export function dueCount(){const n=Date.now();return allGoals.filter(g=>{const s=stateFor(g.id);return s.next_review_at&&new Date(s.next_review_at).getTime()<=n}).length}
export function weakest(pool=allGoals){return[...pool].sort((a,b)=>{const sa=stateFor(a.id),sb=stateFor(b.id);const da=sa.next_review_at&&new Date(sa.next_review_at)<=new Date()?0:1,db=sb.next_review_at&&new Date(sb.next_review_at)<=new Date()?0:1;return da-db||Number(sa.mastery_score||0)-Number(sb.mastery_score||0)||Number(sa.meaningful_attempts||0)-Number(sb.meaningful_attempts||0)})}
export function dailyTargets(){const out=[];for(const g of weakest()){if(out.length>=3)break;if(!out.some(x=>x.topicId===g.topicId)||out.length===2)out.push(g)}return out.length?out:allGoals.slice(0,3)}
export function buildLocalMission(targets,mode='daily',title='Daily Drop'){
  const ex=[];targets.forEach((g,i)=>{const topic=topicById[g.topicId],pool=topic.goals;
    if(i===0){ex.push({type:'meaning',goalId:g.id,prompt:`Was bedeutet „${g.en}“?`,options:shuffle([g.de,...pool.filter(x=>x.id!==g.id).map(x=>x.de)]).slice(0,4),answer:g.de,best:g.en,context:'Verstehen'});ex.push({type:'listen',goalId:g.id,prompt:'Hör den Satz. Was wurde gesagt?',options:shuffle([g.en,...pool.filter(x=>x.id!==g.id).map(x=>x.en)]).slice(0,4),answer:g.en,best:g.en,audio:g.en,context:'Hören'})}
    else if(i===1){ex.push({type:'build',goalId:g.id,prompt:`Baue den Satz: „${g.de}“`,pieces:shuffle(g.en.replace(/[.!?]/g,'').split(/\s+/)),answer:clean(g.en),best:g.en,context:'Satzbau'});ex.push({type:'choice',goalId:g.id,prompt:`Du willst sagen: „${g.de}“ Was passt?`,options:shuffle([g.en,...pool.filter(x=>x.id!==g.id).map(x=>x.en)]).slice(0,4),answer:g.en,best:g.en,context:'Anwenden'})}
    else{ex.push({type:'type',goalId:g.id,prompt:`Schreibe auf Englisch: „${g.de}“`,answer:clean(g.en),best:g.en,context:'Selbst formulieren'});ex.push({type:'choice',goalId:g.id,prompt:`Welche Aussage passt zu „${g.de}“?`,options:shuffle([g.en,...pool.filter(x=>x.id!==g.id).map(x=>x.en)]).slice(0,4),answer:g.en,best:g.en,context:'Transfer'})}
  });return{mode,title,scene:'Kurze echte Alltagssprache. Verstehen → hören → bauen → selbst benutzen.',targets,exercises:ex.slice(0,6),index:-1,correct:0,startedMs:0,sessionId:null}
}
export async function buildAiMission(targets,theme){
  const primary=topicById[targets[0]?.topicId]||curriculum[0];
  const r=await fetch('/api/stormspeak-v2-coach',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({theme:theme||primary.title,topic:{id:primary.id,title:primary.title,scene:primary.scene},targets:targets.map(g=>({id:g.id,en:g.en,de:g.de,pattern:g.pattern,topicId:g.topicId})),learner:{cefr:'A1',weak:targets.map(g=>({id:g.id,score:stateFor(g.id).mastery_score||0}))}})});
  if(!r.ok)throw new Error('ai_unavailable');const j=await r.json();if(!Array.isArray(j.exercises)||j.exercises.length<4)throw new Error('ai_shape');
  return{mode:'ai',title:j.title||'AI Drop',scene:j.scene||primary.scene,targets,index:-1,correct:0,startedMs:0,sessionId:null,exercises:j.exercises.slice(0,6).map((e,i)=>normalizeAi(e,targets[i%targets.length]))};
}
function normalizeAi(e,fallback){const g=goalById[e.goalId]||fallback,type=['meaning','listen','build','type','choice'].includes(e.type)?e.type:'type';return{type,goalId:g.id,prompt:String(e.prompt||''),context:String(e.context||'AI Mission'),best:String(e.best||g.en),answer:type==='type'||type==='build'?clean(e.answerText||e.best||g.en):String(e.answerText||e.best||g.en),audio:String(e.audio||e.best||g.en),options:Array.isArray(e.options)?e.options.slice(0,4).map(String):[],pieces:Array.isArray(e.pieces)&&e.pieces.length?e.pieces.slice(0,10).map(String):shuffle(g.en.replace(/[.!?]/g,'').split(/\s+/))}}
export {cloud};
