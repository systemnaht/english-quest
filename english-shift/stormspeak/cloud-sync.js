/* StormSpeak 2.0 transitional cloud bridge.
   - Keeps the existing localStorage trainer working.
   - Adds anonymous Supabase auth + parent pairing.
   - Syncs the legacy state snapshot for migration/backup only.
   - Does NOT let the client write authoritative mastery.
*/
(()=>{
  const PENDING_KEY='stormSpeakCloudPendingV1';
  const VERSION='2.116.0';
  let client=null,config=null,learner=null,initPromise=null,flushing=false,lastSyncedAt=null,lastError=null;
  const listeners=new Set();

  const emit=()=>{const s=status();listeners.forEach(fn=>{try{fn(s)}catch{}});renderPanel()};
  const status=()=>({enabled:!!config?.enabled,ready:!!client,paired:!!learner,learner,online:navigator.onLine,flushing,lastSyncedAt,lastError});

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
      lastError=null;emit();
      if(learner)setTimeout(()=>void flush(),0);
      return client;
    })().catch(e=>{lastError=String(e.message||e);console.warn('[StormSpeak cloud]',e);emit();return null});
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
    lastError=null;emit();
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
    flushing=true;emit();
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
      lastSyncedAt=new Date();lastError=null;
    }catch(e){lastError=String(e.message||e);console.warn('[StormSpeak cloud] sync',e)}finally{flushing=false;emit()}
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

  function ensurePanel(){
    const progress=document.getElementById('progress');
    if(!progress||document.getElementById('cloudSyncWrap'))return;
    const wrap=document.createElement('div');
    wrap.id='cloudSyncWrap';
    wrap.innerHTML='<div class="sectionhead"><div><h2>Cloud Sync</h2><p>Lernstand sichern und mit dem Elternzugang verbinden.</p></div></div><div id="cloudSyncCard" class="card"></div>';
    progress.appendChild(wrap);
  }

  function renderPanel(){
    ensurePanel();
    const card=document.getElementById('cloudSyncCard');
    if(!card)return;
    if(!config){card.innerHTML='<div class="mini">Cloud wird geprüft…</div>';return}
    if(!config.enabled){card.innerHTML='<div class="mini">Cloud Sync ist für diese Version noch nicht aktiviert.</div>';return}
    if(lastError&&!client){card.innerHTML='<b>Cloud momentan nicht erreichbar</b><div class="mini" style="margin-top:6px">Die App funktioniert lokal weiter.</div>';return}
    if(learner){
      const stamp=lastSyncedAt?` · zuletzt ${lastSyncedAt.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}`:'';
      card.innerHTML=`<b>☁️ Verbunden: ${escapeHtml(learner.display_name||'Lernprofil')}</b><div class="mini" style="margin-top:6px">${flushing?'Synchronisiere…':'Cloud Sync aktiv'}${stamp}</div>`;
      return;
    }
    card.innerHTML='<b>Gerät mit Lernprofil verbinden</b><div class="mini" style="margin:6px 0 10px">Gib den 8-stelligen Code aus dem Elternbereich ein.</div><div class="inputrow"><input id="cloudPairCode" inputmode="text" autocomplete="one-time-code" maxlength="9" placeholder="ABCD-EFGH"><button id="cloudPairBtn" class="secondary">Verbinden</button></div><div id="cloudPairMsg" class="mini" style="margin-top:8px"></div>';
    const input=document.getElementById('cloudPairCode'),btn=document.getElementById('cloudPairBtn'),msg=document.getElementById('cloudPairMsg');
    if(!input||!btn)return;
    input.oninput=()=>{let v=input.value.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,8);input.value=v.length>4?`${v.slice(0,4)}-${v.slice(4)}`:v};
    btn.onclick=async()=>{
      btn.disabled=true;msg.textContent='Verbindung wird geprüft…';
      try{await pair(input.value);msg.textContent='Verbunden. Lernstand wird synchronisiert.'}
      catch(e){const code=String(e.message||e);msg.textContent=code.includes('expired')?'Code ist abgelaufen. Bitte neuen Code erzeugen.':code.includes('used')?'Dieser Code wurde schon verwendet.':code.includes('invalid')?'Code nicht erkannt.':'Verbindung nicht möglich.'}
      finally{btn.disabled=false;renderPanel()}
    };
  }

  function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

  window.StormSpeakCloudBridge={init:ensureClient,status,onStatus,pair,queueSnapshot,flush,refreshLearner};
  window.addEventListener('online',()=>void flush());
  window.addEventListener('offline',emit);
  if(document.readyState==='loading')window.addEventListener('DOMContentLoaded',()=>{ensurePanel();wrapExistingSave();void ensureClient()});
  else {ensurePanel();wrapExistingSave();void ensureClient()}
})();
