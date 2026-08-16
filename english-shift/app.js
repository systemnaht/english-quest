const BASE=[
 {type:'mcq',tense:'Past Simple',prompt:'Which is natural with “yesterday”?',options:['I have seen him yesterday.','I saw him yesterday.','I have saw him yesterday.','I was seeing him yesterday.'],answer:1,best:'I saw him yesterday.',accepted:[],explain:'Finished past time → Past Simple.',audio:''},
 {type:'translate',tense:'Future',prompt:'Übersetze natürlich: „Ich schaffe es wahrscheinlich nicht vor sechs.“',options:[],answer:-1,best:'I probably won’t make it before six.',accepted:['I probably won’t make it before six.','I probably won’t be able to make it before six.'],explain:'make it = es schaffen.',audio:''},
 {type:'mcq',tense:'Present Perfect',prompt:'Best answer to “Have you been here before?”',options:['Yes, I was here twice.','Yes, I’ve been here a couple of times.','Yes, I am here before.','Yes, I have been yesterday.'],answer:1,best:'Yes, I’ve been here a couple of times.',accepted:[],explain:'Experience without a finished past time → Present Perfect.',audio:''},
 {type:'mcq',tense:'Modal verbs',prompt:'Your neighbour is too loud. Choose the natural phrase.',options:['You must be quiet.','Could you keep it down a little, please?','Stop noises.','You should silence yourself.'],answer:1,best:'Could you keep it down a little, please?',accepted:[],explain:'keep it down = leiser sein.',audio:''},
 {type:'translate',tense:'Conditional',prompt:'Übersetze: „Wenn ich das gewusst hätte, wäre ich früher losgefahren.“',options:[],answer:-1,best:'If I’d known that, I would have left earlier.',accepted:['If I’d known that, I would have left earlier.','If I had known that, I would have left earlier.'],explain:'Third conditional.',audio:''},
 {type:'mcq',tense:'Mixed',prompt:'You are running late. Which text sounds most natural?',options:['I’m a bit behind. I’ll be there in ten.','I have lateness. Ten minutes.','I come later after ten.','I am delayed myself.'],answer:0,best:'I’m a bit behind. I’ll be there in ten.',accepted:[],explain:'A natural everyday way to say you are late.',audio:''},
 {type:'translate',tense:'Present Perfect',prompt:'Übersetze: „Ich habe mein Handy seit zwei Stunden nicht finden können.“',options:[],answer:-1,best:'I haven’t been able to find my phone for two hours.',accepted:['I haven’t been able to find my phone for two hours.','I have not been able to find my phone for two hours.'],explain:'Present Perfect + for bei einer Zeitdauer.',audio:''},
 {type:'mcq',tense:'Present Continuous',prompt:'Choose the natural sentence for something happening now.',options:['I wait for the bus.','I am waiting for the bus.','I have waited the bus.','I waiting for the bus.'],answer:1,best:'I am waiting for the bus.',accepted:[],explain:'Now / temporary action → Present Continuous.',audio:''},
 {type:'translate',tense:'Past Perfect',prompt:'Übersetze: „Als ich ankam, war er schon gegangen.“',options:[],answer:-1,best:'When I arrived, he had already left.',accepted:['When I arrived, he had already left.','By the time I arrived, he had already left.'],explain:'Earlier past event → Past Perfect.',audio:''},
 {type:'mcq',tense:'Present Simple',prompt:'Every morning Mark ___ coffee before work.',options:['drinks','is drinking','has drunk','drank'],answer:0,best:'Every morning Mark drinks coffee before work.',accepted:[],explain:'Routine → Present Simple.',audio:''}
];

const LISTEN=[
 {type:'listen',tense:'Present Perfect Continuous',prompt:'Listen and type what you hear.',options:[],answer:-1,audio:'I’ve been trying to reach customer service all morning.',best:'I’ve been trying to reach customer service all morning.',accepted:['I have been trying to reach customer service all morning.'],explain:'Ongoing activity up to now.'},
 {type:'listen',tense:'Future',prompt:'Listen and type what you hear.',options:[],answer:-1,audio:'I’ll get back to you as soon as I hear anything.',best:'I’ll get back to you as soon as I hear anything.',accepted:['I will get back to you as soon as I hear anything.'],explain:'get back to someone = sich zurückmelden.'},
 {type:'listen',tense:'Past Simple',prompt:'Listen and type what you hear.',options:[],answer:-1,audio:'I missed the train, so I took a taxi instead.',best:'I missed the train, so I took a taxi instead.',accepted:[],explain:'Two finished past events.'},
 {type:'listen',tense:'Modal verbs',prompt:'Listen and type what you hear.',options:[],answer:-1,audio:'Could you give me a hand with this for a second?',best:'Could you give me a hand with this for a second?',accepted:[],explain:'give me a hand = mir kurz helfen.'},
 {type:'listen',tense:'Present Perfect',prompt:'Listen and type what you hear.',options:[],answer:-1,audio:'We haven’t decided where to go yet.',best:'We haven’t decided where to go yet.',accepted:['We have not decided where to go yet.'],explain:'yet is common with Present Perfect negatives.'},
 {type:'listen',tense:'Mixed',prompt:'Listen and type what you hear.',options:[],answer:-1,audio:'I’m a bit tied up right now, but I can call you later.',best:'I’m a bit tied up right now, but I can call you later.',accepted:['I am a bit tied up right now, but I can call you later.'],explain:'tied up = beschäftigt / verhindert.'}
];

const GRAMMAR_EXTRA=[
 {type:'mcq',tense:'Past Continuous',prompt:'At 8 p.m. yesterday, I ___ dinner.',options:['cooked','was cooking','have cooked','had cook'],answer:1,best:'At 8 p.m. yesterday, I was cooking dinner.',accepted:[],explain:'Action in progress at a past moment → Past Continuous.'},
 {type:'mcq',tense:'Present Perfect Continuous',prompt:'She ___ for the exam since Monday.',options:['studies','has studied yesterday','has been studying','was studying'],answer:2,best:'She has been studying for the exam since Monday.',accepted:[],explain:'Ongoing activity from a start point until now.'},
 {type:'mcq',tense:'Conditional',prompt:'If I had more time, I ___ more often.',options:['travel','would travel','will travel','would have travelled'],answer:1,best:'If I had more time, I would travel more often.',accepted:[],explain:'Second conditional.'},
 {type:'mcq',tense:'Future',prompt:'Look at those clouds. It ___.',options:['is going to rain','rains yesterday','has rained','would rain'],answer:0,best:'It is going to rain.',accepted:[],explain:'Evidence now → going to.'}
];

const T=['Present Simple','Present Continuous','Present Perfect','Present Perfect Continuous','Past Simple','Past Continuous','Past Perfect','Future','Conditional','Modal verbs','Mixed'];
const SEED_WORDS=[
 {en:'make it',de:'es schaffen',ex:'I probably won’t make it before six.'},
 {en:'keep it down',de:'leiser sein',ex:'Could you keep it down a little, please?'},
 {en:'be about to',de:'kurz davor sein',ex:'I’m about to leave.'},
 {en:'get back to someone',de:'sich zurückmelden',ex:'I’ll get back to you tomorrow.'},
 {en:'sort it out',de:'etwas klären',ex:'Don’t worry, we’ll sort it out.'},
 {en:'run out of',de:'etwas geht aus',ex:'We’ve run out of milk.'},
 {en:'put off',de:'verschieben',ex:'We had to put the meeting off.'},
 {en:'be tied up',de:'beschäftigt / verhindert sein',ex:'I’m tied up until three.'},
 {en:'a bit behind',de:'etwas spät dran',ex:'I’m a bit behind today.'},
 {en:'work out',de:'klappen / herausfinden',ex:'I’m sure it’ll work out.'}
];

const PREP={
 'Present Simple':{title:'Present Simple',meaning:'Routine, Gewohnheit oder allgemeine Tatsache.',example:'She usually takes the bus to work.'},
 'Present Continuous':{title:'Present Continuous',meaning:'Etwas passiert gerade oder ist vorübergehend.',example:'I’m working from home this week.'},
 'Present Perfect':{title:'Present Perfect',meaning:'Vergangenheit mit Bezug zu jetzt; kein abgeschlossener Zeitpunkt.',example:'I’ve already sent the email.'},
 'Present Perfect Continuous':{title:'Present Perfect Continuous',meaning:'Aktivität läuft seit einiger Zeit bis jetzt.',example:'I’ve been waiting for half an hour.'},
 'Past Simple':{title:'Past Simple',meaning:'Abgeschlossene Handlung in der Vergangenheit.',example:'We met yesterday after work.'},
 'Past Continuous':{title:'Past Continuous',meaning:'Eine Handlung war zu einem Zeitpunkt gerade im Gang.',example:'I was driving when you called.'},
 'Past Perfect':{title:'Past Perfect',meaning:'Etwas war schon vor einem anderen Vergangenheitsereignis passiert.',example:'The train had left before we arrived.'},
 'Future':{title:'Future',meaning:'Will / going to je nach Entscheidung, Vorhersage oder sichtbarem Hinweis.',example:'I’ll call you when I get home.'},
 'Conditional':{title:'Conditionals',meaning:'Wenn-Sätze verbinden Bedingung und Folge.',example:'If I had more time, I’d cook more often.'},
 'Modal verbs':{title:'Modal verbs',meaning:'Can, could, should, must usw. drücken Fähigkeit, Bitte, Rat oder Pflicht aus.',example:'Could you open the window, please?'},
 'Mixed':{title:'Natural English',meaning:'Nicht nur Grammatik: ganze natürliche Chunks helfen schneller.',example:'I’m a bit behind, but I’ll be there soon.'}
};

const DEFAULT={xp:0,sessions:0,correct:0,total:0,level:'B1+',grammar:{},vocab:{},personalWords:[],errors:[],reviewQueue:[],helpStats:{used:0,solutions:0}};
let raw={};try{raw=JSON.parse(localStorage.getItem('eshift')||'{}')}catch(_){}
let S={...DEFAULT,...raw,grammar:raw.grammar||{},vocab:raw.vocab||{},personalWords:Array.isArray(raw.personalWords)?raw.personalWords:[],errors:Array.isArray(raw.errors)?raw.errors:[],reviewQueue:Array.isArray(raw.reviewQueue)?raw.reviewQueue:[],helpStats:raw.helpStats||{used:0,solutions:0}};
let Q=[],i=0,sel=null,AI=false,AIMODEL='',SESSION_SOURCE='local',RETURN_VIEW='learn',WORD_FILTER='all',SESSION_RECORDED=false,AI_REQUEST_IN_FLIGHT=false;
let SESSION_WARMUP=[],WARMUP_DONE=true,HELP_LEVEL=0,SOLUTION_REVEALED=false;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const norm=s=>String(s||'').toLowerCase().replace(/[’']/g,"'").replace(/[.,!?;:]/g,'').replace(/\s+/g,' ').trim();
const escapeHtml=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
function lev(a,b){a=norm(a);b=norm(b);const m=a.length,n=b.length;if(!m)return n;if(!n)return m;let p=Array.from({length:n+1},(_,k)=>k),c=new Array(n+1);for(let x=1;x<=m;x++){c[0]=x;for(let y=1;y<=n;y++)c[y]=Math.min(c[y-1]+1,p[y]+1,p[y-1]+(a[x-1]===b[y-1]?0:1));[p,c]=[c,p]}return p[n]}
function closeEnough(a,b,limit=.04){const x=norm(a),y=norm(b),d=lev(x,y);return d/Math.max(1,x.length,y.length)<=limit}
function accepted(e,user){const list=[e.best,...(Array.isArray(e.accepted)?e.accepted:[])].filter(Boolean);return list.some(x=>norm(x)===norm(user)||closeEnough(x,user,e.type==='listen'?.05:.04))}
function clientGrammarRule(user){const a=String(user||'');const duration='(?:\\d+|a|an|one|two|three|four|five|six|seven|eight|nine|ten|several|many|few|a\\s+couple\\s+of|couple\\s+of)\\s+(?:seconds?|minutes?|hours?|days?|weeks?|months?|years?)';if(new RegExp('\\bsince\\s+(?:about\\s+|almost\\s+|nearly\\s+)?'+duration+'\\b','i').test(a))return{correct:false,feedback:'Bei einer Zeitdauer heißt es „for“, nicht „since“: for two hours.',better:a.replace(/\\bsince\\s+/i,'for ')};return null}
function save(){recalcLevel();localStorage.setItem('eshift',JSON.stringify(S))}
function recalcLevel(){if(S.total<20)return;const a=S.correct/S.total;if(S.total>=120&&a>=.84)S.level='C1';else if(S.total>=70&&a>=.82)S.level='B2+';else if(S.total>=35&&a>=.78)S.level='B2';else S.level='B1+'}
function weaknessScore(t){const g=S.grammar[t]||{c:0,n:0};return g.n?g.c/g.n:.64}
function weak(){return[...T].sort((a,b)=>weaknessScore(a)-weaknessScore(b))}
function shuffled(a){return[...a].sort(()=>Math.random()-.5)}
function view(v){$$('.view').forEach(x=>x.classList.toggle('on',x.id===v));$$('.nav').forEach(x=>x.classList.toggle('active',x.dataset.v===v));if(v==='home')dash();if(v==='learn')renderLearn();if(v==='words')words();if(v==='progress')progress();window.scrollTo({top:0,behavior:'smooth'})}

function exerciseKey(e){return `${e.tense||'Mixed'}|${norm(e.prompt).slice(0,120)}`}
function dueReviews(){return S.reviewQueue.filter(x=>(x.due||0)<=Date.now()).sort((a,b)=>a.due-b.due)}
function scheduleReview(e,reason,delayMs){const key=exerciseKey(e);const clean={...e,reviewKey:undefined};delete clean.hintState;let item=S.reviewQueue.find(x=>x.key===key);if(!item){item={key,exercise:clean,due:Date.now()+delayMs,reason,attempts:0};S.reviewQueue.push(item)}else{item.exercise=clean;item.due=Math.min(item.due||Infinity,Date.now()+delayMs);item.reason=reason}save()}
function clearReview(e){const key=e.reviewKey||exerciseKey(e);const before=S.reviewQueue.length;S.reviewQueue=S.reviewQueue.filter(x=>x.key!==key);if(before!==S.reviewQueue.length)save()}
function reviewExercises(limit=4){return dueReviews().slice(0,limit).map(x=>({...x.exercise,reviewKey:x.key,isReview:true}))}

function dash(){
 $('#level').textContent=S.level;$('#xp').textContent=S.xp;$('#sessions').textContent=S.sessions;$('#acc').textContent=S.total?Math.round(S.correct/S.total*100)+'%':'—';
 const due=dueReviews().length,w=weak()[0],g=S.grammar[w]||{c:0,n:0};
 $('#todayText').textContent=due?`${due} Aufgabe${due===1?'':'n'} ist jetzt zur Wiederholung fällig. Erst abrufen, dann Neues lernen.`:(g.n?`${w} ist aktuell dein schwächster Bereich (${Math.round(g.c/g.n*100)}%). Die nächste adaptive Session gewichtet ihn stärker.`:`Noch wenig Daten. Starte mit einem gemischten Shift; danach wird die Empfehlung persönlicher.`);
 let banner=due?`<div class="reviewbanner"><b>↻ ${due} Wiederholung${due===1?'':'en'} fällig</b><div class="tiny muted">Fehler, starke Hilfen oder angesehene Lösungen kommen gezielt zurück.</div></div>`:'';
 $('#focus').innerHTML=banner+'<h3>Heute im Fokus</h3>'+weak().slice(0,3).map(t=>{let x=S.grammar[t]||{c:0,n:0},p=x.n?Math.round(x.c/x.n*100):0;return `<div class="card focuscard"><div><b>${t}</b><div class="tiny muted">${x.n?`${x.c}/${x.n} richtig`:'noch keine Daten'}</div><div class="bar" style="margin-top:8px"><i style="width:${p}%"></i></div></div><span>${x.n?p+'%':'neu'}</span></div>`}).join('');
}
function renderLearn(){const f=$('#grammarFocus');const current=f.value;f.innerHTML=weak().map(t=>`<option>${t}</option>`).join('');if(current&&T.includes(current))f.value=current}

function frameFromAnswer(s){const words=String(s||'').split(/\s+/).filter(Boolean);if(!words.length)return 'Baue den Satz Schritt für Schritt.';const keep=new Set(['i','you','he','she','we','they','have','has','had','am','is','are','was','were','will','would','can','could','should','must','for','since','if','when','to','not']);return words.map((w,idx)=>idx===0||keep.has(norm(w))?w:'___').join(' ')}
function blocksFromAnswer(s){const w=String(s||'').replace(/[.!?]$/,'').split(/\s+/).filter(Boolean);if(w.length<=4)return w;const size=Math.ceil(w.length/4),out=[];for(let x=0;x<w.length;x+=size)out.push(w.slice(x,x+size).join(' '));return out.slice(0,6)}
function defaultHints(e){let concept=PREP[e.tense]?.meaning||e.explain||'Überlege zuerst: Welche Zeitbeziehung oder Funktion hat der Satz?';let chunk='Suche zuerst Subjekt, Verb und Zeitangabe. Formuliere dann in kleinen Bausteinen.';const hit=SEED_WORDS.find(w=>norm(e.best).includes(norm(w.en)));if(hit)chunk=`Nützlicher Chunk: “${hit.en}” = ${hit.de}.`;if(/for two hours/i.test(e.best))chunk='Bei einer Dauer: for + Zeitraum. Since braucht einen Startpunkt.';return[concept,chunk,frameFromAnswer(e.best)]}
function normaliseExercise(e){const hints=Array.isArray(e.hints)?e.hints.map(String).filter(Boolean).slice(0,3):[];while(hints.length<3)hints.push(defaultHints(e)[hints.length]);const blocks=Array.isArray(e.blocks)&&e.blocks.length?e.blocks.map(String).slice(0,6):blocksFromAnswer(e.best);return{...e,hints,blocks}}
function localWarmupFor(exercises){const out=[],seen=new Set();for(const e of exercises){const p=PREP[e.tense]||PREP.Mixed;if(p&&!seen.has(p.title)){out.push({...p});seen.add(p.title)}const chunk=SEED_WORDS.find(w=>norm(e.best).includes(norm(w.en)));if(chunk&&!seen.has(chunk.en)){out.push({title:chunk.en,meaning:chunk.de,example:chunk.ex});seen.add(chunk.en)}if(out.length>=3)break}return out.slice(0,3)}

function start(exercises,source='local',returnView='learn',warmup=null){Q=[...exercises].map(normaliseExercise);i=0;sel=null;SESSION_SOURCE=source;RETURN_VIEW=returnView;SESSION_RECORDED=false;HELP_LEVEL=0;SOLUTION_REVEALED=false;SESSION_WARMUP=Array.isArray(warmup)&&warmup.length?warmup.slice(0,4):localWarmupFor(Q);WARMUP_DONE=source==='vocab'||SESSION_WARMUP.length===0;view('train');if(WARMUP_DONE)render();else renderWarmup()}
function renderWarmup(){
 $('#count').textContent='Warm-up';$('#prog').style.width='0%';
 $('#host').innerHTML=`<div class="q warmup"><div class="tag">60–90 SEKUNDEN VORBEREITUNG</div><div class="prompt">Erst Bausteine aktivieren. Dann abrufen.</div><div class="muted">Keine Lösung wird vorweggenommen — du bekommst nur das Material, das du gleich brauchen könntest.</div><div class="warmgrid">${SESSION_WARMUP.map(w=>`<div class="warmitem"><b>${escapeHtml(w.title||w.chunk||'Baustein')}</b><div class="muted">${escapeHtml(w.meaning||w.note||'')}</div>${w.example?`<div class="example"><span class="muted">Beispiel:</span> ${escapeHtml(w.example)}</div>`:''}${w.example?`<button class="tiny" style="margin-top:8px" onclick='speak(${JSON.stringify(w.example)})'>🔊 Anhören</button>`:''}</div>`).join('')}</div><div class="row"><button id="skipWarm">Überspringen</button><button id="startWarm" class="primary">Jetzt selbst versuchen →</button></div></div>`;
 $('#skipWarm').onclick=$('#startWarm').onclick=()=>{WARMUP_DONE=true;render()}
}
function render(){
 if(i>=Q.length){if(!SESSION_RECORDED){S.sessions++;SESSION_RECORDED=true;save()}$('#count').textContent='';$('#prog').style.width='100%';$('#host').innerHTML=`<div class="q" style="text-align:center"><div class="tag">SESSION COMPLETE</div><div class="prompt">✓ Shift geschafft</div><div class="muted">Deine Ergebnisse, Hilfen und Wiederholungen sind gespeichert und beeinflussen die nächsten Empfehlungen.</div><div class="row" style="justify-content:center;margin-top:18px"><button id="again">Noch eine Session</button><button id="done" class="primary">Zur Übersicht</button></div></div>`;$('#done').onclick=()=>view('home');$('#again').onclick=()=>view('learn');return}
 HELP_LEVEL=0;SOLUTION_REVEALED=false;sel=null;const e=Q[i];$('#count').textContent=`${i+1}/${Q.length}`;$('#prog').style.width=`${i/Q.length*100}%`;
 let h=`<div class="q"><div class="tag">${SESSION_SOURCE==='ai'?'AI · ':SESSION_SOURCE==='vocab'?'WORTSCHATZ · ':e.isReview?'WIEDERHOLUNG · ':''}${e.type} · ${e.tense||''}</div><div class="prompt">${escapeHtml(e.prompt)}</div>`;
 if(e.type==='mcq')h+=`<div class="options">${e.options.map((o,n)=>`<button class="option" data-n="${n}">${escapeHtml(o)}</button>`).join('')}</div>`;else{if(e.type==='listen')h+='<button id="listen">🔊 Anhören</button>';h+='<input id="ans" autocomplete="off" placeholder="Your answer…">'}
 h+=`<div class="row" style="margin-top:10px"><button id="help" class="soft">💡 Ich brauche Hilfe</button><span class="scorehint">Ohne Hilfe = volle XP. Hinweise kosten nur etwas XP, nicht den Lernfortschritt.</span></div><div id="hintbox" class="hintbox"></div><div id="fb"></div></div><div class="row" style="justify-content:flex-end;margin-top:10px"><button id="check" class="primary">Check →</button></div>`;$('#host').innerHTML=h;
 $$('.option').forEach(b=>b.onclick=()=>{sel=+b.dataset.n;$$('.option').forEach(x=>x.classList.toggle('sel',x===b))});if($('#listen'))$('#listen').onclick=()=>speak(e.audio);if($('#ans'))$('#ans').addEventListener('keydown',ev=>{if(ev.key==='Enter')$('#check').click()});$('#help').onclick=showHelp;$('#check').onclick=check
}
function showHelp(){const e=Q[i],box=$('#hintbox'),btn=$('#help');S.helpStats.used=(S.helpStats.used||0)+1;HELP_LEVEL++;
 if(HELP_LEVEL<=3){const labels=['Denkhinweis','Wortschatz / Baustein','Satzgerüst'];box.innerHTML+=`<div class="hint"><b>${labels[HELP_LEVEL-1]}:</b><br>${escapeHtml(e.hints[HELP_LEVEL-1])}</div>`;btn.textContent=HELP_LEVEL===3?'🧩 Noch eine Hilfe: Satzbausteine':'💡 Noch ein Hinweis';save();return}
 if(HELP_LEVEL===4){box.innerHTML+=`<div class="hint"><b>Satzbausteine:</b><div class="chips">${shuffled(e.blocks||[]).map(x=>`<span class="chip">${escapeHtml(x)}</span>`).join('')}</div><div class="tiny muted" style="margin-top:7px">Setze sie selbst in die richtige Reihenfolge.</div></div>`;btn.textContent='🛟 Lösung als letzte Hilfe';save();return}
 SOLUTION_REVEALED=true;S.helpStats.solutions=(S.helpStats.solutions||0)+1;box.innerHTML+=`<div class="solution"><b>Letzte Hilfe – vollständige Lösung:</b><br>${escapeHtml(e.best)}</div>`;btn.disabled=true;btn.textContent='Lösung angesehen';if($('#check'))$('#check').textContent='Für später merken →';save()
}
function speak(t){if(!('speechSynthesis'in window))return alert('Sprachausgabe wird von diesem Browser nicht unterstützt.');const u=new SpeechSynthesisUtterance(t);u.lang='en-US';u.rate=.9;speechSynthesis.cancel();speechSynthesis.speak(u)}

async function check(){
 const e=Q[i];let user='',ok=false,feedback='',better=e.best||'';const btn=$('#check');
 if(SOLUTION_REVEALED){if(e.type==='mcq')user=sel===null?'[Lösung angesehen]':e.options[sel];else user=$('#ans')?.value.trim()||'[Lösung angesehen]';ok=false;feedback='Die Lösung wurde angesehen. Das zählt noch nicht als beherrscht und kommt später wieder.'}
 else if(e.type==='mcq'){if(sel===null)return;user=e.options[sel];ok=sel===e.answer}
 else{
  user=$('#ans').value.trim();if(!user)return;
  const hard=clientGrammarRule(user);
  if(hard){ok=false;feedback=hard.feedback;better=hard.better}
  else if(e.type==='translate'&&AI){btn.disabled=true;btn.textContent='AI prüft…';try{const r=await fetch('/api/evaluate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({exercise:e,answer:user,level:S.level})});const j=await r.json();if(r.ok){ok=!!j.correct;feedback=j.feedback||'';better=j.better||better}else ok=accepted(e,user)}catch(_){ok=accepted(e,user)}finally{btn.disabled=false}}
  else ok=accepted(e,user)
 }
 const mastered=ok&&!SOLUTION_REVEALED;const xp=record(e,user,mastered,feedback,better,HELP_LEVEL,SOLUTION_REVEALED);
 if(e.type==='mcq')$$('.option').forEach((x,n)=>{x.classList.remove('sel');if(n===e.answer)x.classList.add('good');else if(n===sel)x.classList.add('bad')});
 $('#help').disabled=true;$('#fb').className='fb '+(mastered?'goodfb':'badfb');let title=mastered?'✓ Richtig.':(SOLUTION_REVEALED?'↻ Für Wiederholung vorgemerkt.':'Nicht ganz.');let extra=mastered?`<br><span class="tiny">${HELP_LEVEL?`Mit ${HELP_LEVEL} Hilfe${HELP_LEVEL===1?'':'n'} · `:''}+${xp} XP</span>`:'';$('#fb').innerHTML=`<b>${title}</b>${feedback?`<br>${escapeHtml(feedback)}`:(e.explain?`<br>${escapeHtml(e.explain)}`:'')}${!mastered&&better&&!SOLUTION_REVEALED?`<br><b>Besser:</b> ${escapeHtml(better)}`:''}${extra}`;btn.textContent=i===Q.length-1?'Finish':'Next →';btn.onclick=()=>{i++;render()}
}
function record(e,user,mastered,feedback,better,helpLevel,revealed){
 S.total++;const xp=mastered?[10,8,6,4,2][Math.min(4,helpLevel)]:(revealed?0:2);if(mastered){S.correct++;S.xp+=xp}else S.xp+=xp;
 if(e.tense&&e.tense!=='Vocabulary'){const g=S.grammar[e.tense]||{c:0,n:0};g.n++;if(mastered)g.c++;S.grammar[e.tense]=g}
 if(e.vocabWord)updateWordMastery(e.vocabWord,mastered);
 if(mastered&&e.isReview)clearReview(e);
 if(revealed)scheduleReview(e,'Lösung angesehen',10*60*1000);else if(!mastered)scheduleReview(e,'Fehler',6*60*60*1000);else if(helpLevel>=2)scheduleReview(e,'Mit starker Hilfe gelöst',24*60*60*1000);
 if(!mastered){S.errors.unshift({date:Date.now(),tense:e.tense||'Mixed',prompt:e.prompt,user,best:better||e.best||'',feedback:feedback||e.explain||'',helpLevel,revealed});S.errors=S.errors.slice(0,20)}
 save();return xp
}

function dailyMix(){const reviews=reviewExercises(2);const pool=shuffled([...BASE,...GRAMMAR_EXTRA]);const need=Math.max(0,6-reviews.length),core=pool.slice(0,need),listen=shuffled(LISTEN).slice(0,2);start(shuffled([...reviews,...core,...listen]),reviews.length?'review':'local','learn')}
function setAiButtonsDisabled(disabled){['#recommended','#ai','#grammarStart','#listeningStart'].forEach(s=>{const b=$(s);if(b)b.disabled=disabled})}
async function aiSession(mode='adaptive',focus=''){
 if(AI_REQUEST_IN_FLIGHT)return;AI_REQUEST_IN_FLIGHT=true;
 if(!AI){await health();if(!AI){AI_REQUEST_IN_FLIGHT=false;alert('AI ist gerade nicht erreichbar. Ich starte stattdessen einen lokalen Daily Mix.');return dailyMix()}}
 const button=mode==='adaptive'?$('#ai'):mode==='grammar'?$('#grammarStart'):$('#listeningStart');const old=button.textContent;setAiButtonsDisabled(true);button.innerHTML='<span class="spin">↻</span> Wird erstellt…';
 try{const payload={profile:{level:S.level,estimatedLevel:S.level},weakTenses:weak().slice(0,5),grammar:S.grammar,recentErrors:S.errors.slice(0,6),length:8,mode,focus};const r=await fetch('/api/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});const j=await r.json();if(!r.ok||!Array.isArray(j.exercises))throw Object.assign(new Error(j.message||j.error||'AI generation failed'),{status:r.status});$('#status').textContent='AI online';start(j.exercises,'ai','learn',j.warmup)}
 catch(err){console.error(err);if(err.status===429){$('#status').textContent='AI kurz gedrosselt';alert('Die KI wurde gerade kurzfristig gedrosselt. Ich starte für diese Session eine lokale Alternative.')}else alert('Die AI-Session konnte gerade nicht erzeugt werden. Ich starte eine lokale Alternative.');if(mode==='listening')start(shuffled(LISTEN).slice(0,6),'local','learn');else if(mode==='grammar')start(localGrammar(focus),'local','learn');else dailyMix()}
 finally{AI_REQUEST_IN_FLIGHT=false;setAiButtonsDisabled(false);button.textContent=old}
}
function localGrammar(focus){const reviews=reviewExercises(1).filter(e=>e.tense===focus),pool=[...BASE,...GRAMMAR_EXTRA].filter(e=>e.tense===focus),fallback=[...BASE,...GRAMMAR_EXTRA].filter(e=>e.type!=='listen');let a=pool.length?pool:fallback;while(a.length<6)a=[...a,...a];return shuffled([...reviews,...a]).slice(0,6)}

function allWords(){return [...SEED_WORDS.map(x=>({...x,own:false})),...S.personalWords.map(x=>({...x,own:true}))]}
function wordState(en){return S.vocab[en]||{m:1,due:0}}
function isDue(en){return (wordState(en).due||0)<=Date.now()}
function updateWordMastery(en,ok){const x=wordState(en);x.m=Math.max(0,Math.min(5,(x.m||1)+(ok?1:-1)));const days=[0,0,1,3,7,14][x.m]||14;x.due=Date.now()+days*86400000;S.vocab[en]=x}
function words(){const all=allWords(),due=all.filter(w=>isDue(w.en));$('#dueCount').textContent=`${due.length} fällig`;let list=WORD_FILTER==='due'?due:WORD_FILTER==='own'?all.filter(w=>w.own):all;$('#wordsbox').innerHTML=list.length?list.map(w=>{const x=wordState(w.en),dots='●'.repeat(x.m)+'○'.repeat(5-x.m);return `<div class="card word"><div><b>${escapeHtml(w.en)}</b><div class="muted">${escapeHtml(w.de)}</div><div class="tiny" style="margin-top:7px">${escapeHtml(w.ex||'')}</div><div class="mastery" style="margin-top:8px">${dots}</div></div><div class="word-actions"><button onclick='speak(${JSON.stringify(w.en)})'>🔊</button>${w.own?`<button class="danger" onclick='deleteWord(${JSON.stringify(w.en)})'>×</button>`:''}</div></div>`}).join(''):'<div class="card muted">Hier ist gerade nichts fällig.</div>'}
function addWord(){const en=$('#newEn').value.trim(),de=$('#newDe').value.trim(),ex=$('#newEx').value.trim();if(!en||!de)return alert('Englisch und Deutsch bitte ausfüllen.');if(allWords().some(w=>norm(w.en)===norm(en)))return alert('Dieses Wort ist schon vorhanden.');S.personalWords.push({en,de,ex});S.vocab[en]={m:1,due:0};save();$('#newEn').value=$('#newDe').value=$('#newEx').value='';words()}
function deleteWord(en){S.personalWords=S.personalWords.filter(w=>w.en!==en);delete S.vocab[en];save();words()}
function vocabReview(){const due=allWords().filter(w=>isDue(w.en)),chosen=shuffled(due.length?due:allWords()).slice(0,Math.min(6,allWords().length)),translations=allWords().map(w=>w.de);const q=chosen.map(w=>{let opts=shuffled([w.de,...shuffled(translations.filter(d=>d!==w.de)).slice(0,3)]);while(opts.length<4)opts.push('—');return{type:'mcq',tense:'Vocabulary',prompt:`Was bedeutet „${w.en}“?`,options:opts,answer:opts.indexOf(w.de),best:w.de,accepted:[],explain:w.ex||'',audio:'',vocabWord:w.en}});start(q,'vocab','words',[])}

function progress(){const levels=['B1+','B2','B2+','C1'],idx=Math.max(0,levels.indexOf(S.level)),next=idx<3?levels[idx+1]:'C1',due=dueReviews().length;$('#levelCard').innerHTML=`<div class="card"><div class="eyebrow">Aktuelles Arbeitsniveau</div><div style="font-size:32px;font-weight:900;margin-top:4px">${S.level}</div><div class="muted tiny">${S.total} Antworten · ${S.total?Math.round(S.correct/S.total*100):0}% korrekt${S.level!=='C1'?` · nächster Marker: ${next}`:''}</div><div class="leveltrack">${levels.map((l,n)=>`<div class="levelstep ${n<=idx?'on':''}"></div>`).join('')}</div><div class="tiny muted" style="margin-top:8px">${due} Wiederholung${due===1?'':'en'} aktuell fällig · ${S.helpStats?.solutions||0}× Lösung als letzte Hilfe angesehen.</div></div>`;$('#grammar').innerHTML=T.map(t=>{const g=S.grammar[t]||{c:0,n:0},p=g.n?Math.round(g.c/g.n*100):0;return `<div class="card"><b>${t}</b><span style="float:right">${g.n?p+'%':'—'}</span><div class="tiny muted">${g.n?`${g.c}/${g.n} richtig`:'noch keine Daten'}</div><div class="bar" style="margin-top:8px"><i style="width:${p}%"></i></div></div>`}).join('');$('#errors').innerHTML=S.errors.length?S.errors.slice(0,10).map(e=>`<div class="card errorcard"><b>${escapeHtml(e.tense)}</b><div class="tiny muted">${new Date(e.date).toLocaleDateString('de-DE')}${e.helpLevel?` · ${e.helpLevel} Hilfe${e.helpLevel===1?'':'n'}`:''}</div><div style="margin-top:7px">${escapeHtml(e.prompt)}</div><div class="answer"><span class="muted">Deine Antwort:</span> ${escapeHtml(e.user||'—')}</div><div class="answer"><span class="muted">Besser:</span> <b>${escapeHtml(e.best||'—')}</b></div>${e.feedback?`<div class="tiny" style="margin-top:6px">${escapeHtml(e.feedback)}</div>`:''}</div>`).join(''):'<div class="card muted">Noch keine gespeicherten Fehler.</div>'}

async function health(){try{const r=await fetch('/api/health',{cache:'no-store'}),j=await r.json();AI=!!j.ai;AIMODEL=j.model||''}catch(_){AI=false}$('#dot').classList.toggle('on',AI);$('#dot').classList.toggle('err',!AI);$('#status').textContent=AI?'AI bereit':'AI offline';$('#aiNote').textContent=AI?`OpenAI · ${AIMODEL.replace('openai/','')} · via Vercel AI Gateway`:'Daily Mix, Grammar und Listening funktionieren lokal weiter.'}

$('#recommended').onclick=()=>{const r=reviewExercises(4);if(r.length)start(r,'review','home');else AI?aiSession('adaptive'):dailyMix()};
$('#daily').onclick=dailyMix;$('#ai').onclick=()=>aiSession('adaptive');
$('#grammarStart').onclick=()=>{const f=$('#grammarFocus').value;AI?aiSession('grammar',f):start(localGrammar(f),'local','learn')};
$('#listeningStart').onclick=()=>AI?aiSession('listening','Listening'):start(shuffled(LISTEN).slice(0,6),'local','learn');
$('#back').onclick=()=>view(RETURN_VIEW);$('#reviewWords').onclick=vocabReview;$('#addWord').onclick=addWord;
$$('.tab').forEach(b=>b.onclick=()=>{$$('.tab').forEach(x=>x.classList.toggle('active',x===b));WORD_FILTER=b.dataset.filter;words()});
$$('.nav').forEach(b=>b.onclick=()=>view(b.dataset.v));
window.deleteWord=deleteWord;window.speak=speak;
save();dash();renderLearn();health();