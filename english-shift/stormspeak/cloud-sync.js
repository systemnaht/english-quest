/* StormSpeak 2.0 transitional cloud bridge.
   - Keeps the existing localStorage trainer working.
   - Adds anonymous Supabase auth + parent pairing.
   - Syncs the legacy state snapshot for migration/backup only.
   - Does NOT let the client write authoritative mastery.
*/
(()=>{
  const PENDING_KEY='stormSpeakCloudPendingV1';
  const VERSION='2.116.0';
  let client=null,config=null,learner=null,initPromise=null,flushing=false;
  const listeners=new Set();

  const emit=()=>{const s=status();listeners.forEach(fn=>{try{fn(s)}catch{}})};
  const status=()=>({enabled:!!config?.enabled,ready:!!client,paired:!!learner,learner,online:navigator.onLine});

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
      client=mod.createClient(config.supabaseUrl,config.publishableKey,{
        auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}
      });
      let {data:{session}}=await client.auth.getSession();
      if(!session){
        const signed=await client.auth.signInAnonymously();
        if(signed.error)throw signed.error;
        session=signed.data.session;
      }
      if(!session)throw new Error('anonymous_session_failed');
      await refreshLearner();
      emit();
      if(learner)await flush();
      return client;
    })().catch(e=>{console.warn('[StormSpeak cloud]',e);emit();return null});
    return initPromise;
  }

  async function refreshLearner(){
    if(!client)return null;
    const {data,error}=await client.from('learner_profiles').select('id,display_name,cefr_track,curriculum_version').limit(2);
    if(error){
      if(error.code!=='PGRST116')console.warn('[StormSpeak cloud] learner lookup',error);
      learner=null;return null;
    }
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
    const r=await fetch('/api/stormspeak-pair',{
      method:'POST',
      headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},
      body:JSON.stringify({code,deviceLabel:deviceLabel||navigator.userAgent.slice(0,100)})
    });
    const out=await r.json().catch(()=>({}));
    if(!r.ok)throw new Error(out.error||'pairing_failed');
    await refreshLearner();
    emit();
    queueSnapshot();
    await flush();
    return learner;
  }

  function currentState(){
    try{return JSON.parse(localStorage.getItem('stormSpeakV1')||'null')}catch{return null}
  }

  function queueSnapshot(explicitState){
    const stateValue=explicitState===undefined?currentState():explicitState;
    if(!stateValue)return;
    const pending={clientUpdatedAt:new Date().toISOString(),state:stateValue};
    localStorage.setItem(PENDING_KEY,JSON.stringify(pending));
    if(navigator.onLine)void flush();
  }

  async function flush(){
    if(flushing||!navigator.onLine)return;
    flushing=true;
    try{
      await ensureClient();
      if(!client||!learner)return;
      const raw=localStorage.getItem(PENDING_KEY);
      if(!raw)return;
      const pending=JSON.parse(raw);
      const {data:{user}}=await client.auth.getUser();
      if(!user)throw new Error('cloud_user_missing');
      const {error}=await client.from('legacy_state_snapshots').upsert({
        learner_id:learner.id,
        source_auth_user_id:user.id,
        state_json:pending.state,
        client_updated_at:pending.clientUpdatedAt,
        server_updated_at:new Date().toISOString()
      },{onConflict:'learner_id'});
      if(error)throw error;
      localStorage.removeItem(PENDING_KEY);
      emit();
    }catch(e){console.warn('[StormSpeak cloud] sync',e)}finally{flushing=false}
  }

  function onStatus(fn){listeners.add(fn);try{fn(status())}catch{};return()=>listeners.delete(fn)}

  function wrapExistingSave(){
    try{
      if(typeof save!=='function'||save.__stormSpeakCloudWrapped)return;
      const original=save;
      const wrapped=function(){
        const result=original.apply(this,arguments);
        try{queueSnapshot(typeof state!=='undefined'?state:undefined)}catch{}
        return result;
      };
      wrapped.__stormSpeakCloudWrapped=true;
      save=wrapped;
      queueSnapshot(typeof state!=='undefined'?state:undefined);
    }catch(e){console.warn('[StormSpeak cloud] save hook',e)}
  }

  window.StormSpeakCloudBridge={init:ensureClient,status,onStatus,pair,queueSnapshot,flush,refreshLearner};
  window.addEventListener('online',()=>void flush());
  if(document.readyState==='loading')window.addEventListener('DOMContentLoaded',()=>{wrapExistingSave();void ensureClient()});
  else {wrapExistingSave();void ensureClient()}
})();
