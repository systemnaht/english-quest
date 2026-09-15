(()=>{
'use strict';
const SUPABASE_URL='https://tvlphkclmdssazlkwavn.supabase.co';
const SUPABASE_KEY='sb_publishable_Y6oDt4QvOtTnmOu2Z0IWlg_FHv6cD-P';
const VERSION='2.116.0';
const QUEUE_KEY='stormSpeak2CloudQueueV1';
let client=null,learner=null,user=null,readyPromise=null,flushing=false,lastSyncedAt=null,lastError=null;

const uuid=()=>globalThis.crypto?.randomUUID?crypto.randomUUID():'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0,v=c==='x'?r:(r&3|8);return v.toString(16)});
const readQueue=()=>{try{const q=JSON.parse(localStorage.getItem(QUEUE_KEY)||'[]');return Array.isArray(q)?q:[]}catch{return[]}};
const writeQueue=q=>localStorage.setItem(QUEUE_KEY,JSON.stringify(q.slice(-400)));
const emitStatus=()=>{window.dispatchEvent(new CustomEvent('stormspeak-cloud-status',{detail:status()}));renderCard()};
const status=()=>({ready:!!client,paired:!!learner,learner,flushing,lastSyncedAt,lastError,queued:readQueue().length,online:navigator.onLine});

async function init(){
  if(readyPromise)return readyPromise;
  readyPromise=(async()=>{
    const mod=await import(`https://cdn.jsdelivr.net/npm/@supabase/supabase-js@${VERSION}/+esm`);
    client=mod.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});
    let {data:{session}}=await client.auth.getSession();
    if(!session){const s=await client.auth.signInAnonymously();if(s.error)throw s.error;session=s.data.session}
    user=session?.user||null;if(!user)throw new Error('anonymous_auth_failed');
    await refreshLearner();await fetchProgress();lastError=null;emitStatus();if(learner)void flush();return client;
  })().catch(e=>{lastError=String(e.message||e);console.warn('[StormSpeak cloud]',e);emitStatus();return null});
  return readyPromise;
}
async function refreshLearner(){if(!client)return null;const {data,error}=await client.from('learner_profiles').select('id,display_name,cefr_track,curriculum_version').limit(1);if(error)throw error;learner=data?.[0]||null;emitStatus();return learner}
async function fetchProgress(){if(!client||!learner)return[];const {data,error}=await client.from('learner_goal_state').select('goal_id,learning_state,mastery_score,meaningful_attempts,first_try_correct,contexts_seen,task_types_seen,last_practiced_at,next_review_at').eq('learner_id',learner.id);if(error){console.warn('[StormSpeak cloud] progress',error);return[]}window.dispatchEvent(new CustomEvent('stormspeak-cloud-progress',{detail:data||[]}));return data||[]}
async function pair(code){await init();if(!client||!user)throw new Error('cloud_unavailable');const {data:{session}}=await client.auth.getSession();const r=await fetch('/api/stormspeak-pair',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${session.access_token}`},body:JSON.stringify({code,deviceLabel:navigator.userAgent.slice(0,100)})});const out=await r.json().catch(()=>({}));if(!r.ok)throw new Error(out.error||'pairing_failed');await refreshLearner();await fetchProgress();void flush();return learner}
function enqueue(event){const q=readQueue();q.push(event);writeQueue(q);emitStatus();if(navigator.onLine)void flush()}
async function startSession(meta={}){await init();const id=uuid(),at=new Date().toISOString();enqueue({kind:'session_start',id,at,meta});return id}
function recordAttempt(sessionId,p={}){if(!sessionId)return;const at=new Date().toISOString();enqueue({kind:'attempt',id:uuid(),sessionId,at,p})}
function endSession(sessionId,p={}){if(!sessionId)return;enqueue({kind:'session_end',sessionId,at:new Date().toISOString(),p})}
async function flush(){
  if(flushing||!navigator.onLine)return;flushing=true;emitStatus();
  try{await init();if(!client||!learner||!user)return;let q=readQueue();let changed=false;
    while(q.length){const ev=q[0];let error=null;
      if(ev.kind==='session_start')({error}=await client.from('learning_sessions').insert({id:ev.id,learner_id:learner.id,source_auth_user_id:user.id,mode:ev.meta?.mode||'standard',started_at:ev.at,client_created_at:ev.at,metadata:ev.meta||{}}));
      else if(ev.kind==='attempt')({error}=await client.from('attempts').insert({id:ev.id,learner_id:learner.id,session_id:ev.sessionId,exercise_id:null,exercise_key:`${ev.p?.contextKey||'general'}:${ev.p?.goalId||'none'}:${ev.p?.taskType||'practice'}:${ev.id.slice(0,8)}`,goal_id:ev.p?.goalId||null,source_auth_user_id:user.id,task_type:ev.p?.taskType||'practice',context_key:ev.p?.contextKey||null,evidence_kind:ev.p?.evidenceKind||'practice',correct:!!ev.p?.correct,first_try_correct:!!ev.p?.firstTryCorrect,hints_used:Number(ev.p?.hintsUsed)||0,retry_count:Number(ev.p?.retryCount)||0,learner_answer:ev.p?.learnerAnswer||null,expected_answer:ev.p?.expectedAnswer||null,response_ms:Number(ev.p?.responseMs)||null,answered_at:ev.at,client_created_at:ev.at,metadata:ev.p?.metadata||{}}));
      else if(ev.kind==='session_end')({error}=await client.from('learning_sessions').update({ended_at:ev.at,duration_seconds:Number(ev.p?.durationSeconds)||null,metadata:{...ev.p,ended:true}}).eq('id',ev.sessionId).eq('source_auth_user_id',user.id));
      if(error&&error.code!=='23505')throw error;q.shift();writeQueue(q);lastSyncedAt=new Date();lastError=null;changed=true;emitStatus();
    }
    if(changed)await fetchProgress();
  }catch(e){lastError=String(e.message||e);console.warn('[StormSpeak cloud] sync',e)}finally{flushing=false;emitStatus()}
}
function ensureCard(){const host=document.getElementById('cloudCard');if(!host)return null;return host}
function renderCard(){const host=ensureCard();if(!host)return;if(!client){host.innerHTML=`<b>☁️ Cloud wird verbunden …</b><div class="mini">Die App funktioniert währenddessen weiter.</div>`;return}if(learner){const stamp=lastSyncedAt?` · zuletzt ${lastSyncedAt.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}`:'';host.innerHTML=`<b>☁️ Verbunden: ${escapeHtml(learner.display_name||'Lernprofil')}</b><div class="mini">${flushing?'Synchronisiere …':'Cloud Sync aktiv'}${stamp}${readQueue().length?` · ${readQueue().length} ausstehend`:''}</div>`;return}host.innerHTML=`<b>Gerät verbinden</b><div class="mini" style="margin:6px 0 10px">Pairing-Code aus dem Elternbereich eingeben.</div><div class="inputrow"><input id="pairCode" maxlength="9" placeholder="ABCD-EFGH"><button class="secondary" id="pairBtn">Verbinden</button></div><div class="mini" id="pairMsg"></div>`;const input=document.getElementById('pairCode'),btn=document.getElementById('pairBtn'),msg=document.getElementById('pairMsg');if(!btn)return;input.oninput=()=>{let v=input.value.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,8);input.value=v.length>4?`${v.slice(0,4)}-${v.slice(4)}`:v};btn.onclick=async()=>{btn.disabled=true;msg.textContent='Prüfe Code …';try{await pair(input.value);msg.textContent='Verbunden.'}catch{msg.textContent='Verbindung nicht möglich.'}finally{btn.disabled=false;renderCard()}}}
function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
window.StormSpeakCloud={init,status,pair,startSession,recordAttempt,endSession,fetchProgress,flush};
window.addEventListener('online',()=>void flush());window.addEventListener('offline',emitStatus);
const boot=()=>{renderCard();void init()};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();