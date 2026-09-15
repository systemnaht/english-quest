/* StormSpeak 2.0 cloud bridge.
   - Keeps the existing localStorage trainer working.
   - Adds anonymous Supabase auth + parent pairing.
   - Keeps a legacy snapshot for migration/backup.
   - Records structured sessions + attempts as learning evidence.
   - Repairs incomplete legacy local state without deleting progress.
   - Authoritative mastery is calculated server-side, never by the child client.
*/
(()=>{
  const PENDING_KEY='stormSpeakCloudPendingV1';
  const EVENT_QUEUE_KEY='stormSpeakCloudEventsV1';
  const VERSION='2.116.0';
  let client=null,config=null,learner=null,initPromise=null,flushing=false,lastSyncedAt=null,lastError=null;
  let eventFlushing=false,activeStructuredSession=null;
  const listeners=new Set();

  const emit=()=>{const s=status();listeners.forEach(fn=>{try{fn(s)}catch{}});renderPanel()};
  const status=()=>({enabled:!!config?.enabled,ready:!!client,paired:!!learner,learner,online:navigator.onLine,flushing,lastSyncedAt,lastError,queuedEvents:readEventQueue().length});

  function repairLegacyState(){
    try{
      if(typeof state==='undefined')return;
      const current=state&&typeof state==='object'?state:{};
      const fixed={...current};
      fixed.xp=Number.isFinite(Number(current.xp))?Number(current.xp):0;
      fixed.streak=Number.isFinite(Number(current.streak))?Number(current.streak):0;
      fixed.sessions=Number.isFinite(Number(current.sessions))?Number(current.sessions):0;
      fixed.answers=Array.isArray(current.answers)?current.answers:[];
      fixed.mastery=current.mastery&&typeof current.mastery==='object'&&!Array.isArray(current.mastery)?current.mastery:{};
      fixed.mistakes=Array.isArray(current.mistakes)?current.mistakes:[];
      const defaults={meaning:45,listening:35,build:35,response:40};
      fixed.skills=current.skills&&typeof current.skills==='object'&&!Array.isArray(current.skills)?{...defaults,...current.skills}:{...defaults};
      fixed.difficulty=Math.max(0,Math.min(4,Number.isFinite(Number(current.difficulty))?Number(current.difficulty):0));
      fixed.lastDate=current.lastDate||null;
      state=fixed;
      localStorage.setItem('stormSpeakV1',JSON.stringify(fixed));
      if(typeof renderAll==='function')renderAll();
    }catch(e){console.warn('[StormSpeak cloud] state repair',e)}
  }

  async function loadConfig(){
    const r=await fetch('/api/stormspeak-cloud-config',{cache:'no-store'});
    if(!r.ok)throw new Error('cloud_config_failed');
    return r.json();
  }

  async function ensureClient(){
    if(initPromise)return initPromise;
    initPromise=(async()=>{
      config=await loadConfig();emit();
      if(!config.enabled)return null;
      const mod=await import(`https://cdn.jsdelivr.net/npm/@supabase/supabase-js@${VERSION}/+esm`);
      client=mod.createClient(config.supabaseUrl,config.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});
      let {data:{session}}=await client.auth.getSession();
      if(!session){
        const signed=await client.auth.signInAnonymously();
        if(signed.error)throw signed.error;
        session=signed.data.session;
      }
      if(!session)throw new Error('anonymous_session_failed');
      await refreshLearner();
      lastError=null;emit();
      if(learner)setTimeout(()=>{void flush();void flushStructuredEvents()},0);
      return client;
    })().catch(e=>{lastError=String(e.message||e);console.warn('[StormSpeak cloud]',e);emit();return null});
    return initPromise;
  }

  async function refreshLearner(){
    if(!client)return null;
    const {data,error}=await client.from('learner_profiles').select('id,display_name,cefr_track,curriculum_version').limit(2);
    if(error){if(error.code!=='PGRST116')console.warn('[StormSpeak cloud] learner lookup',error);learner=null;return null}
    learner=data?.[0]||null;
    return learner;
  }

  async function getAccessToken(){
    await ensureClient();
    if(!client)return null;
    const {data:{session}}=await client.auth.getSession();
    return session?.access_token||null;
  }

  async function pair(code,deviceLabel){
    await ensureClient();
    if(!client)throw new Error('cloud_not_enabled');
    const token=await getAccessToken();
    if(!token)throw new Error('auth_missing');
    const r=await fetch('/api/stormspeak-pair',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify({code,deviceLabel:deviceLabel||navigator.userAgent.slice(0,100)})});
    const out=await r.json().catch(()=>({}));
    if(!r.ok)throw new Error(out.error||'pairing_failed');
    await refreshLearner();lastError=null;emit();queueSnapshot();await flush();await flushStructuredEvents();return learner;
  }

  function currentState(){try{return JSON.parse(localStorage.getItem('stormSpeakV1')||'null')}catch{return null}}

  function queueSnapshot(explicitState){
    const stateValue=explicitState===undefined?currentState():explicitState;
    if(!stateValue)return;
    const pending={clientUpdatedAt:new Date().toISOString(),state:stateValue};
    localStorage.setItem(PENDING_KEY,JSON.stringify(pending));
    if(navigator.onLine)void flush();
  }

  async function flush(){
    if(flushing||!navigator.onLine)return;
    flushing=true;emit();
    try{
      await ensureClient();if(!client||!learner)return;
      const raw=localStorage.getItem(PENDING_KEY);if(!raw)return;
      const pending=JSON.parse(raw);
      const {data:{user}}=await client.auth.getUser();if(!user)throw new Error('cloud_user_missing');
      const {error}=await client.from('legacy_state_snapshots').upsert({learner_id:learner.id,source_auth_user_id:user.id,state_json:pending.state,client_updated_at:pending.clientUpdatedAt,server_updated_at:new Date().toISOString()},{onConflict:'learner_id'});
      if(error)throw error;
      localStorage.removeItem(PENDING_KEY);lastSyncedAt=new Date();lastError=null;
    }catch(e){lastError=String(e.message||e);console.warn('[StormSpeak cloud] snapshot sync',e)}finally{flushing=false;emit()}
  }

  function newId(){
    if(globalThis.crypto?.randomUUID)return globalThis.crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0,v=c==='x'?r:(r&3|8);return v.toString(16)});
  }
  function readEventQueue(){try{const q=JSON.parse(localStorage.getItem(EVENT_QUEUE_KEY)||'[]');return Array.isArray(q)?q:[]}catch{return[]}}
  function writeEventQueue(q){localStorage.setItem(EVENT_QUEUE_KEY,JSON.stringify(q.slice(-250)))}
  function queueStructuredEvent(event){const q=readEventQueue();q.push(event);writeEventQueue(q);emit();if(navigator.onLine)void flushStructuredEvents()}

  function missionSnapshot(){
    try{if(typeof mission==='undefined'||!mission)return{};return{source:String(mission.source||'standard'),title:String(mission.title||'Mission'),zoneId:String(mission.zone?.id||'unknown'),zoneTitle:String(mission.zone?.title||''),exerciseCount:Number(mission.exercises?.length||0)}}catch{return{}}
  }
  function goalExistsLocally(phraseId){if(!phraseId)return false;try{return Array.isArray(STORMSPEAK_ZONES)&&STORMSPEAK_ZONES.some(z=>z.phrases?.some(p=>p.id===phraseId))}catch{return false}}

  function beginStructuredSession(){
    const m=missionSnapshot(),startedAt=new Date().toISOString();
    activeStructuredSession={id:newId(),startedAt,startedMs:Date.now(),closed:false,mission:m};
    queueStructuredEvent({kind:'session_start',session:{id:activeStructuredSession.id,startedAt,mission:m}});
  }
  function ensureStructuredSession(){if(!activeStructuredSession||activeStructuredSession.closed)beginStructuredSession();return activeStructuredSession}

  function recordStructuredAttempt(correct,skill,phraseId,userAnswer,best,seenBefore){
    const s=ensureStructuredSession();let ex=null,index=-1;
    try{index=Number(mission?.index??-1);ex=mission?.exercises?.[index]||null}catch{}
    const answeredAt=new Date().toISOString(),goalId=goalExistsLocally(phraseId)?phraseId:null;
    queueStructuredEvent({kind:'attempt',attempt:{id:newId(),sessionId:s.id,exerciseKey:`${s.mission.zoneId||'unknown'}:${phraseId||'none'}:${ex?.type||skill||'practice'}:${index}`,goalId,taskType:String(ex?.type||skill||'practice'),contextKey:String(s.mission.zoneId||'unknown'),evidenceKind:Number(seenBefore||0)>0?'review':'new',correct:!!correct,firstTryCorrect:!!correct,hintsUsed:0,retryCount:0,learnerAnswer:userAnswer==null?null:String(userAnswer).slice(0,1000),expectedAnswer:best==null?null:String(best).slice(0,1000),answeredAt,metadata:{skill:String(skill||''),phraseId:phraseId||null,missionSource:s.mission.source||'standard',missionTitle:s.mission.title||'',zoneTitle:s.mission.zoneTitle||''}}});
  }

  function closeStructuredSession(){
    if(!activeStructuredSession||activeStructuredSession.closed)return;
    activeStructuredSession.closed=true;
    const endedAt=new Date().toISOString(),durationSeconds=Math.max(0,Math.round((Date.now()-activeStructuredSession.startedMs)/1000));
    queueStructuredEvent({kind:'session_end',session:{id:activeStructuredSession.id,endedAt,durationSeconds}});activeStructuredSession=null;
  }

  async function flushStructuredEvents(){
    if(eventFlushing||!navigator.onLine)return;
    eventFlushing=true;
    try{
      await ensureClient();if(!client||!learner)return;
      const {data:{user}}=await client.auth.getUser();if(!user)return;
      let q=readEventQueue();
      while(q.length){
        const ev=q[0];let error=null;
        if(ev.kind==='session_start'){
          const s=ev.session;({error}=await client.from('learning_sessions').insert({id:s.id,learner_id:learner.id,source_auth_user_id:user.id,mode:s.mission?.source||'standard',started_at:s.startedAt,client_created_at:s.startedAt,metadata:{title:s.mission?.title||'',zone_id:s.mission?.zoneId||'',zone_title:s.mission?.zoneTitle||'',exercise_count:s.mission?.exerciseCount||0}}));
        }else if(ev.kind==='attempt'){
          const a=ev.attempt;({error}=await client.from('attempts').insert({id:a.id,learner_id:learner.id,session_id:a.sessionId,exercise_id:null,exercise_key:a.exerciseKey,goal_id:a.goalId,source_auth_user_id:user.id,task_type:a.taskType,context_key:a.contextKey,evidence_kind:a.evidenceKind,correct:a.correct,first_try_correct:a.firstTryCorrect,hints_used:a.hintsUsed,retry_count:a.retryCount,learner_answer:a.learnerAnswer,expected_answer:a.expectedAnswer,answered_at:a.answeredAt,client_created_at:a.answeredAt,metadata:a.metadata||{}}));
        }else if(ev.kind==='session_end'){
          const s=ev.session;({error}=await client.from('learning_sessions').update({ended_at:s.endedAt,duration_seconds:s.durationSeconds}).eq('id',s.id).eq('source_auth_user_id',user.id));
        }
        if(error&&error.code!=='23505')throw error;
        q.shift();writeEventQueue(q);lastSyncedAt=new Date();lastError=null;emit();
      }
    }catch(e){lastError=String(e.message||e);console.warn('[StormSpeak cloud] structured sync',e)}finally{eventFlushing=false;emit()}
  }

  function onStatus(fn){listeners.add(fn);try{fn(status())}catch{};return()=>listeners.delete(fn)}

  function wrapExistingSave(){
    try{
      if(typeof save!=='function'||save.__stormSpeakCloudWrapped)return;
      const original=save;
      const wrapped=function(){const result=original.apply(this,arguments);try{queueSnapshot(typeof state!=='undefined'?state:undefined)}catch{}return result};
      wrapped.__stormSpeakCloudWrapped=true;save=wrapped;queueSnapshot(typeof state!=='undefined'?state:undefined);
    }catch(e){console.warn('[StormSpeak cloud] save hook',e)}
  }

  function wrapLearningEvents(){
    try{
      if(typeof openMission==='function'&&!openMission.__stormSpeakEventsWrapped){const originalOpen=openMission;const wrappedOpen=function(){beginStructuredSession();return originalOpen.apply(this,arguments)};wrappedOpen.__stormSpeakEventsWrapped=true;openMission=wrappedOpen}
      if(typeof reward==='function'&&!reward.__stormSpeakEventsWrapped){
        const originalReward=reward;
        const wrappedReward=function(correct,skill,phraseId,userAnswer,best){let seenBefore=0;try{seenBefore=phraseId&&typeof mastery==='function'?Number(mastery(phraseId)?.seen||0):0}catch{}const result=originalReward.apply(this,arguments);try{recordStructuredAttempt(correct,skill,phraseId,userAnswer,best,seenBefore)}catch(e){console.warn('[StormSpeak cloud] attempt hook',e)}return result};
        wrappedReward.__stormSpeakEventsWrapped=true;reward=wrappedReward;
      }
      if(typeof renderMissionStep==='function'&&!renderMissionStep.__stormSpeakEventsWrapped){const originalRender=renderMissionStep;const wrappedRender=function(){const result=originalRender.apply(this,arguments);try{if(activeStructuredSession&&typeof mission!=='undefined'&&mission&&mission.index>=mission.exercises.length)closeStructuredSession()}catch{}return result};wrappedRender.__stormSpeakEventsWrapped=true;renderMissionStep=wrappedRender}
      const quit=document.getElementById('quitMission');if(quit&&!quit.dataset.structuredHook){quit.dataset.structuredHook='1';quit.addEventListener('click',()=>closeStructuredSession(),{capture:true})}
    }catch(e){console.warn('[StormSpeak cloud] learning event hooks',e)}
  }

  function ensurePanel(){
    const progress=document.getElementById('progress');if(!progress||document.getElementById('cloudSyncWrap'))return;
    const wrap=document.createElement('div');wrap.id='cloudSyncWrap';wrap.innerHTML='<div class="sectionhead"><div><h2>Cloud Sync</h2><p>Lernstand sichern und mit dem Elternzugang verbinden.</p></div></div><div id="cloudSyncCard" class="card"></div>';progress.appendChild(wrap);
  }

  function renderPanel(){
    ensurePanel();const card=document.getElementById('cloudSyncCard');if(!card)return;
    if(!config){card.innerHTML='<div class="mini">Cloud wird geprüft…</div>';return}
    if(!config.enabled){card.innerHTML='<div class="mini">Cloud Sync ist für diese Version noch nicht aktiviert.</div>';return}
    if(lastError&&!client){card.innerHTML='<b>Cloud momentan nicht erreichbar</b><div class="mini" style="margin-top:6px">Die App funktioniert lokal weiter.</div>';return}
    if(learner){const stamp=lastSyncedAt?` · zuletzt ${lastSyncedAt.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}`:'',queued=readEventQueue().length;card.innerHTML=`<b>☁️ Verbunden: ${escapeHtml(learner.display_name||'Lernprofil')}</b><div class="mini" style="margin-top:6px">${flushing||eventFlushing?'Synchronisiere…':'Cloud Sync aktiv'}${stamp}${queued?` · ${queued} ausstehend`:''}</div>`;return}
    card.innerHTML='<b>Gerät mit Lernprofil verbinden</b><div class="mini" style="margin:6px 0 10px">Gib den 8-stelligen Code aus dem Elternbereich ein.</div><div class="inputrow"><input id="cloudPairCode" inputmode="text" autocomplete="one-time-code" maxlength="9" placeholder="ABCD-EFGH"><button id="cloudPairBtn" class="secondary">Verbinden</button></div><div id="cloudPairMsg" class="mini" style="margin-top:8px"></div>';
    const input=document.getElementById('cloudPairCode'),btn=document.getElementById('cloudPairBtn'),msg=document.getElementById('cloudPairMsg');if(!input||!btn)return;
    input.oninput=()=>{let v=input.value.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,8);input.value=v.length>4?`${v.slice(0,4)}-${v.slice(4)}`:v};
    btn.onclick=async()=>{btn.disabled=true;msg.textContent='Verbindung wird geprüft…';try{await pair(input.value);msg.textContent='Verbunden. Lernstand wird synchronisiert.'}catch(e){const code=String(e.message||e);msg.textContent=code.includes('expired')?'Code ist abgelaufen. Bitte neuen Code erzeugen.':code.includes('used')?'Dieser Code wurde schon verwendet.':code.includes('invalid')?'Code nicht erkannt.':'Verbindung nicht möglich.'}finally{btn.disabled=false;renderPanel()}};
  }

  function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]))}

  window.StormSpeakCloudBridge={init:ensureClient,status,onStatus,pair,queueSnapshot,flush,refreshLearner,flushStructuredEvents};
  window.addEventListener('online',()=>{void flush();void flushStructuredEvents()});window.addEventListener('offline',emit);
  const boot=()=>{repairLegacyState();ensurePanel();wrapExistingSave();wrapLearningEvents();void ensureClient()};
  if(document.readyState==='loading')window.addEventListener('DOMContentLoaded',boot);else boot();
})();