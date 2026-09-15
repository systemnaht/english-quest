import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.116.0/+esm';
const Q='stormspeakV2Queue',INSTALL='stormspeakV2Installation';
const read=()=>{try{const x=JSON.parse(localStorage.getItem(Q)||'[]');return Array.isArray(x)?x:[]}catch{return[]}};
const write=q=>localStorage.setItem(Q,JSON.stringify(q.slice(-500)));
const id=()=>globalThis.crypto?.randomUUID?.()||'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0,v=c==='x'?r:(r&3|8);return v.toString(16)});
const installationId=()=>{let v=localStorage.getItem(INSTALL);if(!v){v=id();localStorage.setItem(INSTALL,v)}return v};
class StormCloud{
  constructor(){this.client=null;this.user=null;this.learner=null;this.goalStates=new Map();this.stats={attempts:0,correct:0,sessions:0};this.error=null;this.ready=false;this.listeners=new Set()}
  on(fn){this.listeners.add(fn);return()=>this.listeners.delete(fn)}
  emit(){const s=this.status();for(const fn of this.listeners){try{fn(s)}catch{}}}
  status(){return{ready:this.ready,learner:this.learner,error:this.error,queued:read().length,stats:this.stats,goalStates:this.goalStates}}
  async cleanup(){try{if('serviceWorker'in navigator){const rs=await navigator.serviceWorker.getRegistrations();await Promise.all(rs.filter(r=>String(r.scope).includes('/stormspeak/')).map(r=>r.unregister()))}if('caches'in window){const ks=await caches.keys();await Promise.all(ks.filter(k=>k.startsWith('stormspeak-shell-')).map(k=>caches.delete(k)))}}catch{}}
  async init(){
    try{
      await this.cleanup();const cr=await fetch('/api/stormspeak-cloud-config',{cache:'no-store'}),cfg=await cr.json();if(!cr.ok||!cfg.enabled)throw new Error('Cloud-Konfiguration nicht erreichbar');
      this.client=createClient(cfg.supabaseUrl,cfg.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});
      let {data:{session}}=await this.client.auth.getSession();if(!session){const s=await this.client.auth.signInAnonymously();if(s.error)throw s.error;session=s.data.session}
      this.user=session?.user||null;if(!this.user)throw new Error('Keine Gerätesitzung');
      try{await this.client.from('device_checkins').insert({auth_user_id:this.user.id,installation_id:installationId(),app_version:'stormspeak-2.0-prod'})}catch{}
      const {data,error}=await this.client.from('learner_profiles').select('id,display_name,cefr_track,curriculum_version').limit(1);if(error)throw error;
      this.learner=data?.[0]||null;this.ready=!!this.learner;if(this.ready){await this.refresh();await this.flush()}this.error=null;this.emit();return this.status();
    }catch(e){this.error=String(e?.message||e);this.ready=false;this.emit();return this.status()}
  }
  async refresh(){
    if(!this.ready)return;const [gs,ats,ses]=await Promise.all([
      this.client.from('learner_goal_state').select('goal_id,learning_state,mastery_score,meaningful_attempts,first_try_correct,contexts_seen,task_types_seen,last_practiced_at,next_review_at').eq('learner_id',this.learner.id),
      this.client.from('attempts').select('correct').eq('learner_id',this.learner.id).limit(1000),this.client.from('learning_sessions').select('id,ended_at').eq('learner_id',this.learner.id).limit(500)]);
    if(!gs.error)this.goalStates=new Map((gs.data||[]).map(x=>[x.goal_id,x]));const a=ats.data||[],s=ses.data||[];this.stats={attempts:a.length,correct:a.filter(x=>x.correct).length,sessions:s.filter(x=>x.ended_at).length};this.emit();
  }
  state(goalId){return this.goalStates.get(goalId)||{learning_state:'NEW',mastery_score:0,meaningful_attempts:0}}
  queue(ev){const q=read();q.push(ev);write(q);this.emit();void this.flush()}
  startSession(mode,metadata={}){const sid=id(),at=new Date().toISOString();this.queue({kind:'session_start',id:sid,mode,at,metadata});return sid}
  attempt(sessionId,x){this.queue({kind:'attempt',id:id(),sessionId,at:new Date().toISOString(),...x})}
  endSession(sessionId,durationSeconds){this.queue({kind:'session_end',sessionId,at:new Date().toISOString(),durationSeconds})}
  async flush(){
    if(!this.ready||!this.client||!this.user||!navigator.onLine)return;let q=read();
    while(q.length){const ev=q[0];let error=null;try{
      if(ev.kind==='session_start')({error}=await this.client.from('learning_sessions').insert({id:ev.id,learner_id:this.learner.id,source_auth_user_id:this.user.id,mode:ev.mode,started_at:ev.at,client_created_at:ev.at,metadata:ev.metadata||{}}));
      else if(ev.kind==='attempt')({error}=await this.client.from('attempts').insert({id:ev.id,learner_id:this.learner.id,session_id:ev.sessionId,exercise_id:null,exercise_key:ev.exerciseKey,goal_id:ev.goalId,source_auth_user_id:this.user.id,task_type:ev.taskType,context_key:ev.contextKey,evidence_kind:ev.evidenceKind||'practice',correct:!!ev.correct,first_try_correct:!!ev.correct,hints_used:ev.hintsUsed||0,retry_count:0,learner_answer:ev.answer||null,expected_answer:ev.expected||null,response_ms:ev.responseMs||null,answered_at:ev.at,client_created_at:ev.at,metadata:ev.metadata||{}}));
      else if(ev.kind==='session_end')({error}=await this.client.from('learning_sessions').update({ended_at:ev.at,duration_seconds:ev.durationSeconds}).eq('id',ev.sessionId).eq('source_auth_user_id',this.user.id));
    }catch(e){error=e}if(error&&error.code!=='23505'){this.error=String(error.message||error);this.emit();break}q.shift();write(q);this.emit()}
    if(!q.length){this.error=null;await this.refresh()}
  }
}
const cloud=new StormCloud();window.addEventListener('online',()=>cloud.flush());export default cloud;
