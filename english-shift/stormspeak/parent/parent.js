(()=>{
  const VERSION='2.116.0';
  let supabase=null,currentUser=null;
  const $=id=>document.getElementById(id);
  const show=(id,on)=>$(id).classList.toggle('hide',!on);
  const msg=(id,text)=>{$(id).textContent=text||''};

  async function config(){
    const r=await fetch('/api/stormspeak-cloud-config',{cache:'no-store'});
    if(!r.ok)throw new Error('Cloud-Konfiguration nicht erreichbar.');
    return r.json();
  }

  async function init(){
    try{
      const c=await config();
      if(!c.enabled){$('statusText').textContent='Cloud ist für diese Version noch nicht aktiviert.';return}
      const mod=await import(`https://cdn.jsdelivr.net/npm/@supabase/supabase-js@${VERSION}/+esm`);
      supabase=mod.createClient(c.supabaseUrl,c.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
      supabase.auth.onAuthStateChange((_event,session)=>{void applySession(session)});
      const {data:{session}}=await supabase.auth.getSession();
      await applySession(session);
    }catch(e){$('statusText').textContent='Cloud momentan nicht erreichbar.';console.warn(e)}
  }

  async function applySession(session){
    currentUser=session?.user||null;
    show('loginCard',!currentUser);show('accountCard',!!currentUser);
    $('statusText').textContent=currentUser?'Elternkonto verbunden.':'Noch nicht angemeldet.';
    if(currentUser){$('accountMail').textContent=currentUser.email||'Elternkonto';await loadLearners()}
  }

  async function accessToken(){
    const {data:{session}}=await supabase.auth.getSession();
    return session?.access_token||null;
  }

  async function callParent(body){
    const token=await accessToken();
    if(!token)throw new Error('Bitte erneut anmelden.');
    const r=await fetch('/api/stormspeak-parent',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify(body)});
    const out=await r.json().catch(()=>({}));
    if(!r.ok)throw new Error(out.error||'Aktion fehlgeschlagen.');
    return out;
  }

  async function loadLearners(){
    const {data,error}=await supabase.from('learner_profiles').select('id,display_name,cefr_track,curriculum_version').order('created_at',{ascending:true});
    if(error){msg('parentMsg','Lernprofile konnten nicht geladen werden.');return}
    const host=$('learners');host.innerHTML='';
    if(!data?.length)host.innerHTML='<div class="mini">Noch kein Lernprofil. Lege unten das erste Profil an.</div>';
    (data||[]).forEach(l=>{
      const row=document.createElement('div');row.className='learner';
      const info=document.createElement('div');
      const strong=document.createElement('b');strong.textContent=l.display_name;
      const small=document.createElement('div');small.className='mini';small.textContent=`${l.cefr_track} · ${l.curriculum_version}`;
      info.append(strong,small);
      const btn=document.createElement('button');btn.textContent='Gerät verbinden';
      btn.onclick=()=>void createPairing(l,btn);
      row.append(info,btn);host.appendChild(row);
    });
  }

  async function createPairing(learner,btn){
    btn.disabled=true;msg('parentMsg','Erzeuge Verbindungscode…');
    try{
      const out=await callParent({action:'create_pairing',learnerId:learner.id});
      $('pairCode').textContent=out.code;
      $('pairExpiry').textContent=`Gültig bis ${new Date(out.expiresAt).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}. Der Code funktioniert nur einmal.`;
      show('pairCard',true);msg('parentMsg','');
      $('pairCard').scrollIntoView({behavior:'smooth',block:'start'});
    }catch(e){msg('parentMsg',String(e.message||e))}finally{btn.disabled=false}
  }

  $('login').onclick=async()=>{
    const email=$('email').value.trim();if(!email){msg('loginMsg','Bitte E-Mail eingeben.');return}
    $('login').disabled=true;msg('loginMsg','Sende Anmeldelink…');
    try{
      const {error}=await supabase.auth.signInWithOtp({email,options:{emailRedirectTo:`${location.origin}/stormspeak-parent.html`}});
      if(error)throw error;
      msg('loginMsg','Link gesendet. Öffne die E-Mail auf diesem Gerät.');
    }catch(e){msg('loginMsg','Anmeldung konnte nicht gestartet werden.');console.warn(e)}finally{$('login').disabled=false}
  };

  $('logout').onclick=async()=>{await supabase.auth.signOut();show('pairCard',false)};

  $('createLearner').onclick=async()=>{
    const displayName=$('learnerName').value.trim();
    if(!displayName){msg('parentMsg','Bitte Name oder Spitzname eingeben.');return}
    $('createLearner').disabled=true;msg('parentMsg','Lege Lernprofil an…');
    try{
      await callParent({action:'create_learner',displayName});
      $('learnerName').value='';msg('parentMsg','Profil angelegt.');await loadLearners();
    }catch(e){msg('parentMsg',String(e.message||e))}finally{$('createLearner').disabled=false}
  };

  void init();
})();
