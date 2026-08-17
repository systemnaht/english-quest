/* English Shift: structured grammar path + personal dictionary */
const GRAMMAR_PATH=[
 {id:'present-now',title:'Present Simple ↔ Present Continuous',short:'Routine oder gerade jetzt?',topics:['Present Simple','Present Continuous'],core:'Present Simple beschreibt Routinen, Gewohnheiten und Fakten. Present Continuous beschreibt etwas, das gerade passiert, vorübergehend ist oder sich entwickelt.',form:'Simple: I/you/we/they work · he/she works. Continuous: am/is/are + verb-ing.',signals:'Simple: usually, often, every day, never. Continuous: now, at the moment, this week, currently.',contrast:'I work from home. = Das ist meine normale Situation. · I’m working from home this week. = Nur vorübergehend.',trap:'Stative verbs wie know, believe, want, need, understand stehen normalerweise nicht im Continuous.',timeline:'ROUTINE  ●──●──●──●     |     NOW  ───[████]───',checks:[
  {type:'mcq',tense:'Present Simple',prompt:'Choose the natural sentence for a routine.',options:['I am usually taking the bus.','I usually take the bus.','I have usually take the bus.','I taking the bus usually.'],answer:1,best:'I usually take the bus.',accepted:[],explain:'Routine → Present Simple.',audio:''},
  {type:'mcq',tense:'Present Continuous',prompt:'This week I ___ from home because the office is being renovated.',options:['work','am working','have worked yesterday','worked usually'],answer:1,best:'This week I am working from home because the office is being renovated.',accepted:[],explain:'Vorübergehende Situation → Present Continuous.',audio:''},
  {type:'mcq',tense:'Present Simple',prompt:'Which sentence is normally correct?',options:['I am knowing the answer.','I know the answer.','I knowing the answer.','I have know the answer.'],answer:1,best:'I know the answer.',accepted:[],explain:'know ist normalerweise ein stative verb und steht nicht im Continuous.',audio:''}
 ]},
 {id:'past-scene',title:'Past Simple ↔ Past Continuous',short:'Ereignis oder Hintergrund?',topics:['Past Simple','Past Continuous'],core:'Past Simple erzählt abgeschlossene Ereignisse. Past Continuous baut die Szene auf: Eine Handlung war gerade im Gang, als etwas anderes geschah.',form:'Simple: verb-ed / 2. Form. Continuous: was/were + verb-ing.',signals:'Simple: yesterday, last week, then, suddenly. Continuous: while, at 8 p.m., when + unterbrechendes Ereignis.',contrast:'I cooked dinner. = abgeschlossen. · I was cooking dinner when he called. = Kochen lief gerade, der Anruf kam dazwischen.',trap:'Nicht jedes „when“ verlangt Past Continuous. Entscheidend ist, ob eine Handlung gerade im Verlauf war.',timeline:'BACKGROUND  ─────[ cooking ]─────  ✦ called',checks:[
  {type:'mcq',tense:'Past Continuous',prompt:'At 9 p.m. yesterday, I ___ a film.',options:['watched','was watching','have watched','watch'],answer:1,best:'At 9 p.m. yesterday, I was watching a film.',accepted:[],explain:'Handlung im Verlauf zu einem vergangenen Zeitpunkt → Past Continuous.',audio:''},
  {type:'mcq',tense:'Past Simple',prompt:'I ___ my keys and then I left the house.',options:['found','was finding','have found yesterday','find'],answer:0,best:'I found my keys and then I left the house.',accepted:[],explain:'Abfolge abgeschlossener Ereignisse → Past Simple.',audio:''},
  {type:'translate',tense:'Past Continuous',prompt:'Übersetze: „Ich fuhr gerade nach Hause, als du angerufen hast.“',options:[],answer:-1,best:'I was driving home when you called.',accepted:['I was driving home when you called.'],explain:'Laufende Hintergrundhandlung + kurzes Ereignis.',audio:''}
 ]},
 {id:'perfect-bridge',title:'Present Perfect ↔ Past Simple',short:'Bezug zu jetzt oder fertige Vergangenheit?',topics:['Present Perfect','Past Simple'],core:'Present Perfect verbindet Vergangenheit mit jetzt. Past Simple setzt ein Ereignis in eine abgeschlossene Vergangenheit.',form:'Perfect: have/has + past participle. Past Simple: 2. Form / -ed.',signals:'Perfect: already, yet, ever, never, just, so far, for, since. Past: yesterday, last year, in 2022, two days ago.',contrast:'I’ve lost my phone. = Es ist jetzt weg. · I lost my phone yesterday. = Ereignis gestern.',trap:'Mit einem abgeschlossenen Zeitpunkt wie yesterday, last week oder in 2024 benutzt man normalerweise kein Present Perfect.',timeline:'PAST  ●──────────────▶ NOW   vs.   PAST ● | abgeschlossen | NOW',checks:[
  {type:'mcq',tense:'Present Perfect',prompt:'Choose the natural sentence.',options:['I have already finished.','I already finished yesterday and have.','I have finished yesterday.','I am already finish.'],answer:0,best:'I have already finished.',accepted:[],explain:'Kein abgeschlossener Zeitpunkt; Ergebnis ist jetzt relevant → Present Perfect.',audio:''},
  {type:'mcq',tense:'Past Simple',prompt:'Which sentence is correct with “last night”?',options:['I’ve seen him last night.','I saw him last night.','I have saw him last night.','I see him last night.'],answer:1,best:'I saw him last night.',accepted:[],explain:'last night = abgeschlossener Zeitpunkt → Past Simple.',audio:''},
  {type:'translate',tense:'Present Perfect',prompt:'Übersetze: „Ich habe ihn noch nicht angerufen.“',options:[],answer:-1,best:'I haven’t called him yet.',accepted:['I have not called him yet.'],explain:'Bis jetzt noch nicht → Present Perfect + yet.',audio:''}
 ]},
 {id:'perfect-duration',title:'Present Perfect ↔ Present Perfect Continuous',short:'Ergebnis oder Aktivität?',topics:['Present Perfect','Present Perfect Continuous'],core:'Present Perfect betont oft Ergebnis, Anzahl oder abgeschlossene Leistung. Present Perfect Continuous betont Dauer oder die laufende Aktivität.',form:'Perfect: have/has + past participle. Continuous: have/has been + verb-ing.',signals:'Perfect: how many, already, finished. Continuous: how long, all day, lately, for/since bei laufender Aktivität.',contrast:'I’ve read three chapters. = Ergebnis/Anzahl. · I’ve been reading for two hours. = Dauer/Aktivität.',trap:'Stative verbs wie know, own, believe oder understand werden normalerweise nicht im Perfect Continuous verwendet.',timeline:'PAST ─────[ activity activity ]────▶ NOW',checks:[
  {type:'mcq',tense:'Present Perfect Continuous',prompt:'I ___ for the bus for forty minutes and it still hasn’t come.',options:['wait','have waited yesterday','have been waiting','was wait'],answer:2,best:'I have been waiting for the bus for forty minutes.',accepted:[],explain:'Laufende Aktivität + Dauer → Present Perfect Continuous.',audio:''},
  {type:'mcq',tense:'Present Perfect',prompt:'She ___ five emails so far this morning.',options:['has written','has been write','wrote yesterday','is writing five'],answer:0,best:'She has written five emails so far this morning.',accepted:[],explain:'Anzahl/Ergebnis steht im Vordergrund → Present Perfect.',audio:''},
  {type:'translate',tense:'Present Perfect Continuous',prompt:'Übersetze: „Ich versuche seit einer Stunde, ihn zu erreichen.“',options:[],answer:-1,best:'I’ve been trying to reach him for an hour.',accepted:['I have been trying to reach him for an hour.'],explain:'Dauer einer bis jetzt laufenden Aktivität → Present Perfect Continuous.',audio:''}
 ]},
 {id:'past-before-past',title:'Past Perfect',short:'Was war schon vorher passiert?',topics:['Past Perfect'],core:'Past Perfect ordnet zwei Vergangenheitsereignisse: Eine Handlung war bereits abgeschlossen, bevor die andere geschah.',form:'had + past participle.',signals:'already, before, by the time, after — aber die zeitliche Logik ist wichtiger als Signalwörter.',contrast:'When I arrived, he had left. = Erst ging er, danach kam ich.',trap:'Wenn die Reihenfolge ohnehin eindeutig ist, ist Past Perfect nicht in jedem Satz zwingend. Benutze es dort, wo die Vorzeitigkeit klar gemacht werden soll.',timeline:'PAST  ● had left ─────▶ ● I arrived ─────▶ NOW',checks:[
  {type:'mcq',tense:'Past Perfect',prompt:'By the time we got to the station, the train ___.',options:['left','had left','has left','was leave'],answer:1,best:'By the time we got to the station, the train had left.',accepted:[],explain:'Der Zug fuhr vor unserer Ankunft ab → Past Perfect.',audio:''},
  {type:'translate',tense:'Past Perfect',prompt:'Übersetze: „Sie hatte schon gegessen, bevor ich ankam.“',options:[],answer:-1,best:'She had already eaten before I arrived.',accepted:['She had already eaten before I arrived.'],explain:'Essen geschah vor dem Ankommen.',audio:''},
  {type:'mcq',tense:'Past Perfect',prompt:'Which sentence makes the order clearest?',options:['I realised I left my wallet at home.','I realised I had left my wallet at home.','I have realised I left my wallet at home yesterday.','I was realise my wallet.'],answer:1,best:'I realised I had left my wallet at home.',accepted:[],explain:'Das Liegenlassen geschah vor dem späteren Realisieren.',audio:''}
 ]},
 {id:'future',title:'Future: will ↔ going to ↔ Present Continuous',short:'Entscheidung, Plan oder Termin?',topics:['Future'],core:'will passt oft zu spontanen Entscheidungen und neutralen Vorhersagen. going to passt zu Absichten und sichtbaren Hinweisen. Present Continuous passt gut zu festen persönlichen Arrangements.',form:'will + infinitive · am/is/are going to + infinitive · am/is/are + verb-ing.',signals:'will: I think, probably, spontaneous decision. going to: plan/intention, evidence now. Continuous: konkreter Termin/Arrangement.',contrast:'I’ll answer the phone. · I’m going to start exercising. · I’m meeting Anna at six.',trap:'Nach when, as soon as, before, after in zukünftigen Zeitsätzen steht normalerweise Present Simple: I’ll call you when I get home — nicht “when I will get home”.',timeline:'NOW → intention/arrangement → FUTURE',checks:[
  {type:'mcq',tense:'Future',prompt:'The phone is ringing. “I ___ it!”',options:['am answering every day','will answer','have answered tomorrow','was answering'],answer:1,best:'I’ll answer it!',accepted:[],explain:'Spontane Entscheidung im Moment → will.',audio:''},
  {type:'mcq',tense:'Future',prompt:'Look at those black clouds. It ___.',options:['is going to rain','will raining','rains yesterday','has rained tomorrow'],answer:0,best:'It is going to rain.',accepted:[],explain:'Sichtbarer Hinweis jetzt → going to.',audio:''},
  {type:'mcq',tense:'Future',prompt:'Choose the natural sentence.',options:['I’ll call you when I will get home.','I’ll call you when I get home.','I call you when I got home tomorrow.','I am call when home.'],answer:1,best:'I’ll call you when I get home.',accepted:[],explain:'Im zukünftigen Zeitsatz nach when steht Present Simple.',audio:''}
 ]},
 {id:'cond01',title:'Conditionals 0 & 1',short:'Regel oder reale Möglichkeit?',topics:['Conditional'],core:'Zero Conditional beschreibt allgemeine Regeln. First Conditional beschreibt eine reale oder gut mögliche Zukunftsbedingung.',form:'Zero: if + Present, Present. First: if + Present, will + infinitive.',signals:'Zero = immer/allgemein. First = mögliche Zukunft, konkrete Folge.',contrast:'If you heat ice, it melts. · If it rains tomorrow, we’ll stay home.',trap:'Im if-Satz des First Conditional steht normalerweise kein will: If it rains — nicht “If it will rain”.',timeline:'IF condition → likely future consequence',checks:[
  {type:'mcq',tense:'Conditional',prompt:'If you don’t water plants, they ___.',options:['die','will died','would die yesterday','have dying'],answer:0,best:'If you don’t water plants, they die.',accepted:[],explain:'Allgemeine Regel → Zero Conditional.',audio:''},
  {type:'mcq',tense:'Conditional',prompt:'If I finish early, I ___ you.',options:['call yesterday','will call','would have called','am called'],answer:1,best:'If I finish early, I will call you.',accepted:[],explain:'Reale Zukunftsmöglichkeit → First Conditional.',audio:''},
  {type:'mcq',tense:'Conditional',prompt:'Which is correct?',options:['If it will rain, we’ll stay home.','If it rains, we’ll stay home.','If it rained tomorrow, we will stayed home.','If rain, stayed.'],answer:1,best:'If it rains, we’ll stay home.',accepted:[],explain:'Nach if im First Conditional → Present Simple.',audio:''}
 ]},
 {id:'cond23',title:'Conditionals 2 & 3',short:'Hypothese oder verpasste Vergangenheit?',topics:['Conditional'],core:'Second Conditional beschreibt eine hypothetische oder eher unwahrscheinliche Gegenwart/Zukunft. Third Conditional beschreibt eine Vergangenheit, die anders hätte verlaufen können.',form:'Second: if + Past, would + infinitive. Third: if + had + participle, would have + participle.',signals:'Second: if I had more time… Third: if I had known…',contrast:'If I had more time, I’d travel more. · If I had known, I would have left earlier.',trap:'Bei “If I were you” ist were auch mit I/he/she die traditionelle und sehr gebräuchliche Form für irreale Situationen.',timeline:'SECOND: imaginary NOW/FUTURE · THIRD: ✕ alternative PAST',checks:[
  {type:'mcq',tense:'Conditional',prompt:'If I had more time, I ___ more often.',options:['travel','would travel','will travel','would have travelled yesterday'],answer:1,best:'If I had more time, I would travel more often.',accepted:[],explain:'Hypothetische Gegenwart → Second Conditional.',audio:''},
  {type:'translate',tense:'Conditional',prompt:'Übersetze: „Wenn ich das gewusst hätte, wäre ich früher gegangen.“',options:[],answer:-1,best:'If I had known that, I would have left earlier.',accepted:['If I’d known that, I would have left earlier.'],explain:'Alternative Vergangenheit → Third Conditional.',audio:''},
  {type:'mcq',tense:'Conditional',prompt:'Choose the standard phrase for advice.',options:['If I was you, I will wait.','If I were you, I’d wait.','If I am you, I waited.','If I had you, I wait.'],answer:1,best:'If I were you, I’d wait.',accepted:[],explain:'Irreale Situation → “If I were you”.',audio:''}
 ]},
 {id:'modals',title:'Modal verbs',short:'Können, Rat, Pflicht, Wahrscheinlichkeit',topics:['Modal verbs'],core:'Modalverben kodieren Haltung statt Zeit: Fähigkeit, Bitte, Rat, Pflicht, Erlaubnis oder Wahrscheinlichkeit.',form:'modal + infinitive ohne to: can go, should call, might be. Ausnahme: have to ist keine echte Modalform und benutzt to.',signals:'can/could = Fähigkeit/Bitte · should = Rat · must/have to = Pflicht · might/may = Möglichkeit.',contrast:'You must wear a seat belt. = starke Pflicht. · You should rest. = Rat. · It might rain. = Möglichkeit.',trap:'mustn’t = verboten. don’t have to = nicht nötig. Diese beiden sind NICHT dasselbe.',timeline:'ATTITUDE → can / should / must / might + base verb',checks:[
  {type:'mcq',tense:'Modal verbs',prompt:'You ___ smoke here. It’s prohibited.',options:['don’t have to','mustn’t','might not need','could to not'],answer:1,best:'You mustn’t smoke here.',accepted:[],explain:'mustn’t = Verbot.',audio:''},
  {type:'mcq',tense:'Modal verbs',prompt:'You ___ come tomorrow if you don’t want to. It’s optional.',options:['mustn’t','don’t have to','shouldn’t ever','can’t to'],answer:1,best:'You don’t have to come tomorrow.',accepted:[],explain:'don’t have to = keine Notwendigkeit.',audio:''},
  {type:'translate',tense:'Modal verbs',prompt:'Übersetze natürlich: „Könntest du mir kurz helfen?“',options:[],answer:-1,best:'Could you give me a hand for a second?',accepted:['Could you help me for a second?','Could you give me a hand for a second?'],explain:'could macht eine Bitte höflicher.',audio:''}
 ]}
];

const WHY_BY_TENSE={
 'Present Simple':{title:'Warum Present Simple?',text:'Es geht um Routine, Gewohnheit, Fakt oder einen Zustand — nicht um eine gerade laufende vorübergehende Handlung.',pair:'I work here. ↔ I’m working here this week.'},
 'Present Continuous':{title:'Warum Present Continuous?',text:'Die Handlung läuft gerade, ist vorübergehend oder beschreibt eine aktuelle Entwicklung.',pair:'I work here. ↔ I’m working here this week.'},
 'Past Simple':{title:'Warum Past Simple?',text:'Das Ereignis ist in einer abgeschlossenen Vergangenheit verankert oder wird als fertiges Ereignis erzählt.',pair:'I saw him yesterday. ↔ I’ve seen him before.'},
 'Past Continuous':{title:'Warum Past Continuous?',text:'Die Handlung war zu einem vergangenen Zeitpunkt im Verlauf und bildet oft den Hintergrund für ein kurzes Ereignis.',pair:'I was driving when he called.'},
 'Present Perfect':{title:'Warum Present Perfect?',text:'Etwas geschah vor jetzt, aber Ergebnis, Erfahrung oder Zeitraum reicht gedanklich bis in die Gegenwart.',pair:'I’ve lost my phone. ↔ I lost my phone yesterday.'},
 'Present Perfect Continuous':{title:'Warum Present Perfect Continuous?',text:'Die Dauer oder die bis jetzt laufende Aktivität steht im Vordergrund.',pair:'I’ve read three pages. ↔ I’ve been reading for an hour.'},
 'Past Perfect':{title:'Warum Past Perfect?',text:'Von zwei Vergangenheitsereignissen wird das frühere ausdrücklich als bereits abgeschlossen markiert.',pair:'He had left before I arrived.'},
 'Future':{title:'Warum diese Future-Form?',text:'Englisch wählt die Zukunftsform nach Funktion: spontane Entscheidung, Absicht/Indiz oder feste Verabredung.',pair:'I’ll answer. · I’m going to call him. · I’m meeting him at six.'},
 'Conditional':{title:'Warum dieses Conditional?',text:'Entscheidend ist, wie real die Bedingung ist und ob sie Gegenwart/Zukunft oder eine nicht mehr änderbare Vergangenheit betrifft.',pair:'If I have time, I’ll call. · If I had time, I’d call. · If I’d had time, I would have called.'},
 'Modal verbs':{title:'Warum dieses Modalverb?',text:'Modalverben zeigen die Haltung zur Handlung: Fähigkeit, Höflichkeit, Rat, Pflicht oder Wahrscheinlichkeit.',pair:'mustn’t = verboten · don’t have to = nicht nötig'},
 'Mixed':{title:'Warum klingt das natürlich?',text:'Alltagssprache wird häufig in ganzen Chunks gespeichert. Ein natürlicher Chunk ist oft nützlicher als eine Wort-für-Wort-Übersetzung.',pair:'I’m a bit behind. · I’ll get back to you.'}
};

function ensureEnhancedState(){
 S.grammarPath=S.grammarPath&&typeof S.grammarPath==='object'?S.grammarPath:{completed:{},selected:null};
 S.grammarPath.completed=S.grammarPath.completed&&typeof S.grammarPath.completed==='object'?S.grammarPath.completed:{};
 S.learnedWords=Array.isArray(S.learnedWords)?S.learnedWords:[];
 if(!SEED_WORDS.some(w=>norm(w.en)==='be able to'))SEED_WORDS.push({en:'be able to',de:'können / in der Lage sein',ex:'I haven’t been able to reach him.'});
 for(const w of SEED_WORDS){if(S.vocab[w.en]&&!S.learnedWords.some(x=>norm(x.en)===norm(w.en)))S.learnedWords.push({...w,source:'Früheres Training',firstSeen:Date.now(),lastSeen:Date.now(),encounters:1})}
 save();
}
ensureEnhancedState();

let PATH_SESSION=null,LAST_PATH_RESULT=null;
function currentPathIndex(){const x=GRAMMAR_PATH.findIndex(l=>!S.grammarPath.completed[l.id]?.passed);return x<0?GRAMMAR_PATH.length-1:x}
function currentLesson(){return GRAMMAR_PATH[currentPathIndex()]}
function passedLessons(){return GRAMMAR_PATH.filter(l=>S.grammarPath.completed[l.id]?.passed)}
function pathPercent(){return Math.round(passedLessons().length/GRAMMAR_PATH.length*100)}
function allowedGrammarTopics(extra=''){
 const idx=currentPathIndex(),arr=[];
 GRAMMAR_PATH.slice(0,idx+1).forEach(l=>arr.push(...l.topics));
 if(extra&&T.includes(extra))arr.push(extra);
 return [...new Set(arr)];
}
function pathStatus(l,n){const r=S.grammarPath.completed[l.id];if(r?.passed)return`✓ ${Math.round((r.score||0)*100)}%`;if(n===currentPathIndex())return'Jetzt';return n<currentPathIndex()?'Wiederholen':'Später'}

function injectEnhancementStyles(){
 const s=document.createElement('style');s.textContent=`
 .pathhero{background:linear-gradient(145deg,#fff,#f5f6ff);border:1px solid #dfe3f5}.pathhead{display:grid;grid-template-columns:1fr auto;gap:12px;align-items:center}.pathpct{font-size:30px;font-weight:900}.pathlist{display:grid;gap:7px;margin-top:12px}.pathstep{display:grid;grid-template-columns:34px 1fr auto;gap:9px;align-items:center;text-align:left;padding:10px;border-radius:14px}.pathstep.current{border-color:var(--brand);background:var(--brand2)}.pathstep.done{background:#eef9f5;border-color:#d6eee5}.pathnum{width:30px;height:30px;border-radius:10px;display:grid;place-items:center;background:#eef0f6;font-weight:900}.pathstep.current .pathnum{background:var(--brand);color:#fff}.lessonbox{margin-top:12px;padding:16px;border:1px solid var(--line);border-radius:17px;background:#fff}.grammargrid{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:12px}.grammarmini{padding:12px;border-radius:13px;background:#f7f8fc;border:1px solid #e8eaf1}.contrastbox{margin-top:10px;padding:12px;border-radius:13px;background:#eef8ff;border:1px solid #d7eaf7}.trapbox{margin-top:10px;padding:12px;border-radius:13px;background:#fff8e8;border:1px solid #f0dfb0}.timeline{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;overflow:auto;white-space:nowrap;padding:10px;border-radius:12px;background:#f8f9fc;margin-top:10px}.whybox{margin-top:9px;padding:12px;border-radius:13px;background:#f3f5ff;border:1px solid #dfe3f5}.dictmeta{margin-top:7px;font-size:12px;color:var(--muted)}.sourcebadge{display:inline-block;padding:4px 7px;border-radius:999px;background:#f0f2f8;margin-right:5px}.dictempty{text-align:center;padding:25px}.pathhome{margin-top:12px}.pathbar{height:8px;border-radius:99px;background:#e9ebf2;overflow:hidden;margin-top:9px}.pathbar i{display:block;height:100%;background:var(--brand)}
 @media(max-width:560px){.grammargrid{grid-template-columns:1fr}.pathstep{grid-template-columns:32px 1fr}.pathstep span:last-child{grid-column:2}.pathhead{grid-template-columns:1fr}.pathpct{font-size:24px}}
 `;document.head.appendChild(s)
}

function enhanceDOM(){
 injectEnhancementStyles();
 const learn=$('#learn');const mode=learn.querySelector('.modegrid');
 const path=document.createElement('div');path.id='grammarPathBox';path.className='card pathhero';mode.before(path);
 const free=document.createElement('h2');free.textContent='Freies Training';mode.before(free);
 const oldH2=learn.querySelector('h2');if(oldH2&&oldH2!==free)oldH2.textContent='Dein Lernpfad';
 const tabs=$('#words .tabs');tabs.innerHTML='<button class="tab active" data-filter="dictionary">Mein Wörterbuch</button><button class="tab" data-filter="due">Fällig</button><button class="tab" data-filter="learned">Automatisch gelernt</button><button class="tab" data-filter="own">Eigene</button><button class="tab" data-filter="basis">Basis</button>';
 WORD_FILTER='dictionary';
 const p=$('#progress');const gh=[...p.querySelectorAll('h3')].find(x=>x.textContent.includes('Grammar Radar'));if(gh){const d=document.createElement('div');d.id='pathProgress';gh.before(d)}
 const stats=$('.stats');if(stats){const d=document.createElement('div');d.id='pathHome';d.className='card pathhome';stats.after(d)}
 const cards=[...$('#learn').querySelectorAll('.mode')];
 if(cards[0])cards[0].querySelector('p').textContent='8 kurze Aufgaben aus bereits eingeführtem Stoff plus fällige Wiederholungen. Kein Grammatik-Lotto mehr.';
 if(cards[1])cards[1].querySelector('p').textContent='Neue Aufgaben passend zu deinem Lernpfad, Niveau, Schwächen und bisherigen Fehlern.';
 bindDictionaryTabs();
}

enhanceDOM();

function renderGrammarPath(){
 const box=$('#grammarPathBox');if(!box)return;const cur=currentLesson(),idx=currentPathIndex();
 box.innerHTML=`<div class="pathhead"><div><div class="eyebrow">Mein Grammatik-Pfad</div><h3 style="margin:5px 0">Schritt ${idx+1} von ${GRAMMAR_PATH.length}: ${escapeHtml(cur.title)}</h3><div class="muted">${escapeHtml(cur.short)} · kompakt lernen → gezielt üben → später mischen.</div></div><div class="pathpct">${pathPercent()}%</div></div><div class="pathbar"><i style="width:${pathPercent()}%"></i></div><div class="row" style="margin-top:12px"><button id="openCurrentLesson" class="primary">Lektion öffnen</button><span class="tiny muted">Adaptive AI und Daily Mix testen nur eingeführten Stoff; ein freier Grammar Drill bleibt jederzeit möglich.</span></div><div class="pathlist">${GRAMMAR_PATH.map((l,n)=>`<button class="pathstep ${S.grammarPath.completed[l.id]?.passed?'done':''} ${n===idx?'current':''}" data-lesson="${l.id}"><span class="pathnum">${S.grammarPath.completed[l.id]?.passed?'✓':n+1}</span><span><b>${escapeHtml(l.title)}</b><br><span class="tiny muted">${escapeHtml(l.short)}</span></span><span class="tiny">${pathStatus(l,n)}</span></button>`).join('')}</div><div id="lessonDetail"></div>`;
 $('#openCurrentLesson').onclick=()=>showLesson(cur.id);
 $$('[data-lesson]').forEach(b=>b.onclick=()=>showLesson(b.dataset.lesson));
 const selected=S.grammarPath.selected||cur.id;showLesson(selected,false)
}
function showLesson(id,scroll=true){
 const l=GRAMMAR_PATH.find(x=>x.id===id)||currentLesson();S.grammarPath.selected=l.id;save();const host=$('#lessonDetail');if(!host)return;
 const result=S.grammarPath.completed[l.id];
 host.innerHTML=`<div class="lessonbox"><div class="eyebrow">3–5 Minuten · Mini-Lehrbuch</div><h3 style="margin:6px 0">${escapeHtml(l.title)}</h3><div class="grammargrid"><div class="grammarmini"><b>Kernidee</b><div class="tiny" style="margin-top:5px">${escapeHtml(l.core)}</div></div><div class="grammarmini"><b>Form</b><div class="tiny" style="margin-top:5px">${escapeHtml(l.form)}</div></div><div class="grammarmini"><b>Typische Signale</b><div class="tiny" style="margin-top:5px">${escapeHtml(l.signals)}</div></div><div class="grammarmini"><b>Merksatz</b><div class="tiny" style="margin-top:5px">Erst die Bedeutung wählen, dann die Form — Signalwörter sind nur Hinweise.</div></div></div><div class="contrastbox"><b>Kontrast</b><div style="margin-top:5px">${escapeHtml(l.contrast)}</div></div><div class="trapbox"><b>⚠ Typische Falle / Ausnahme</b><div style="margin-top:5px">${escapeHtml(l.trap)}</div></div><div class="timeline">${escapeHtml(l.timeline)}</div><div class="row" style="margin-top:12px"><button id="lessonSpeak">🔊 Beispiele vorlesen</button><button id="lessonDrill" class="primary">3-Fragen-Mini-Check →</button>${result?`<span class="pill">Bester Check: ${Math.round((result.score||0)*100)}%</span>`:''}</div></div>`;
 $('#lessonSpeak').onclick=()=>speak(l.contrast.replace(/ · /g,'. '));$('#lessonDrill').onclick=()=>startLesson(l.id);if(scroll)host.scrollIntoView({behavior:'smooth',block:'start'})
}
function startLesson(id){const l=GRAMMAR_PATH.find(x=>x.id===id);if(!l)return;PATH_SESSION={id,c:0,n:0};LAST_PATH_RESULT=null;const q=l.checks.map(x=>({...x,pathLesson:id}));start(q,'lesson','learn',[])}

function renderPathHome(){const host=$('#pathHome');if(!host)return;const l=currentLesson(),idx=currentPathIndex();host.innerHTML=`<div class="eyebrow">Grammatik-Pfad</div><div class="focuscard"><div><b>Schritt ${idx+1}: ${escapeHtml(l.title)}</b><div class="tiny muted">${escapeHtml(l.short)}</div><div class="pathbar"><i style="width:${pathPercent()}%"></i></div></div><button id="goPath">Öffnen</button></div>`;$('#goPath').onclick=()=>{view('learn');setTimeout(()=>$('#grammarPathBox')?.scrollIntoView({behavior:'smooth'}),80)}}
function renderPathProgress(){const host=$('#pathProgress');if(!host)return;host.innerHTML=`<h3>Grammatik-Lernpfad</h3><div class="card"><b>${passedLessons().length}/${GRAMMAR_PATH.length} Lektionen stabil</b><span style="float:right">${pathPercent()}%</span><div class="pathbar"><i style="width:${pathPercent()}%"></i></div><div class="tiny muted" style="margin-top:8px">Nächster strukturierter Schritt: ${escapeHtml(currentLesson().title)}. Die freie Statistik darunter zeigt zusätzlich deine tatsächliche Trefferquote pro Zeitform.</div></div>`}

const CORE_RENDER_LEARN=renderLearn;
renderLearn=function(){CORE_RENDER_LEARN();renderGrammarPath()};
const CORE_DASH=dash;
dash=function(){CORE_DASH();renderPathHome()};
const CORE_PROGRESS=progress;
progress=function(){CORE_PROGRESS();renderPathProgress()};

const CORE_RENDER=render;
render=function(){CORE_RENDER();if(i>=Q.length&&LAST_PATH_RESULT){const p=$('#host .prompt'),m=$('#host .muted');if(p)p.textContent=LAST_PATH_RESULT.passed?'✓ Lektion sitzt fürs Erste':'↻ Noch einmal kurz festigen';if(m)m.textContent=LAST_PATH_RESULT.passed?`Mini-Check ${Math.round(LAST_PATH_RESULT.score*100)}%. Diese Lektion zählt jetzt als eingeführt und darf in gemischten Sessions auftauchen.`:`Mini-Check ${Math.round(LAST_PATH_RESULT.score*100)}%. Sie bleibt dein aktueller Pfad-Schritt und kommt erneut.`;LAST_PATH_RESULT=null}}

const CORE_RECORD=record;
record=function(e,user,mastered,feedback,better,helpLevel,revealed){const xp=CORE_RECORD(e,user,mastered,feedback,better,helpLevel,revealed);captureChunkFromExercise(e);if(PATH_SESSION&&e.pathLesson===PATH_SESSION.id){PATH_SESSION.n++;if(mastered)PATH_SESSION.c++;if(PATH_SESSION.n>=Q.length){const score=PATH_SESSION.c/Math.max(1,PATH_SESSION.n),old=S.grammarPath.completed[PATH_SESSION.id]||{};S.grammarPath.completed[PATH_SESSION.id]={passed:score>=.67,score:Math.max(old.score||0,score),updated:Date.now()};LAST_PATH_RESULT={passed:score>=.67,score};PATH_SESSION=null;save()}}return xp}

function whyData(e){return WHY_BY_TENSE[e.tense]||WHY_BY_TENSE.Mixed}
const CORE_CHECK=check;
check=async function(){await CORE_CHECK();const fb=$('#fb');if(!fb||!fb.textContent.trim()||$('#whyBtn'))return;const e=Q[i],w=whyData(e);const b=document.createElement('button');b.id='whyBtn';b.className='soft';b.style.marginTop='9px';b.textContent='Warum?';const box=document.createElement('div');box.id='whyBox';box.className='whybox';box.hidden=true;box.innerHTML=`<b>${escapeHtml(w.title)}</b><div style="margin-top:5px">${escapeHtml(w.text)}</div><div class="tiny" style="margin-top:7px"><b>Kontrast:</b> ${escapeHtml(w.pair)}</div>`;b.onclick=()=>box.hidden=!box.hidden;fb.appendChild(document.createElement('br'));fb.appendChild(b);fb.appendChild(box)};

function captureChunk(en,de,ex,source='Training'){
 en=String(en||'').trim();de=String(de||'').trim();ex=String(ex||'').trim();if(!en||!de||en.length>70)return;
 const hit=S.learnedWords.find(w=>norm(w.en)===norm(en));const now=Date.now();
 if(hit){hit.de=hit.de||de;hit.ex=hit.ex||ex;hit.lastSeen=now;hit.encounters=(hit.encounters||1)+1;hit.source=hit.source||source}
 else S.learnedWords.push({en,de,ex,source,firstSeen:now,lastSeen:now,encounters:1});
 if(!S.vocab[en])S.vocab[en]={m:1,due:now+24*60*60*1000};save()
}
function captureChunks(chunks,source='AI Warm-up'){for(const c of Array.isArray(chunks)?chunks:[])captureChunk(c.en||c.chunk,c.de||c.meaning,c.example||c.ex,source)}
function captureChunkFromExercise(e){const best=String(e?.best||'');for(const w of SEED_WORDS)if(norm(best).includes(norm(w.en)))captureChunk(w.en,w.de,w.ex,'Aufgabe')}
function dictionaryWords(){const map=new Map();for(const w of S.learnedWords)map.set(norm(w.en),{...w,own:false,learned:true});for(const w of S.personalWords)map.set(norm(w.en),{...w,own:true,learned:false,source:'Eigenes Wort',firstSeen:w.firstSeen||Date.now(),lastSeen:w.lastSeen||Date.now(),encounters:w.encounters||1});return[...map.values()]}

allWords=function(){const map=new Map();for(const w of [...dictionaryWords(),...SEED_WORDS.map(x=>({...x,basis:true}))])map.set(norm(w.en),w);return[...map.values()]};
function fmtDate(ts){if(!ts)return'';return new Date(ts).toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit'})}
words=function(){
 const dict=dictionaryWords(),due=dict.filter(w=>isDue(w.en));$('#dueCount').textContent=`${due.length} fällig`;let list=[];
 if(WORD_FILTER==='due')list=due;else if(WORD_FILTER==='learned')list=S.learnedWords.map(w=>({...w,learned:true}));else if(WORD_FILTER==='own')list=S.personalWords.map(w=>({...w,own:true,source:'Eigenes Wort'}));else if(WORD_FILTER==='basis')list=SEED_WORDS.map(w=>({...w,basis:true}));else list=dict;
 $('#wordsbox').innerHTML=list.length?list.map(w=>{const x=wordState(w.en),m=Math.max(0,Math.min(5,x.m||1)),dots='●'.repeat(m)+'○'.repeat(5-m),inDict=dict.some(d=>norm(d.en)===norm(w.en));const meta=w.basis&&!inDict?'Kuratiertes Basiswort · noch nicht in deinem Wörterbuch':`${w.source||'Training'}${w.lastSeen?` · zuletzt ${fmtDate(w.lastSeen)}`:''}${w.encounters?` · ${w.encounters}× gesehen`:''}`;return `<div class="card word"><div><b>${escapeHtml(w.en)}</b><div class="muted">${escapeHtml(w.de)}</div><div class="tiny" style="margin-top:7px">${escapeHtml(w.ex||'')}</div><div class="mastery" style="margin-top:8px">${dots}</div><div class="dictmeta"><span class="sourcebadge">${escapeHtml(meta)}</span>${inDict?'Bleibt dauerhaft im Wörterbuch.':''}</div></div><div class="word-actions"><button onclick='speak(${JSON.stringify(w.en)})'>🔊</button>${w.basis&&!inDict?`<button onclick='addBasisToDictionary(${JSON.stringify(w.en)})'>＋</button>`:''}${w.own?`<button class="danger" onclick='deleteWord(${JSON.stringify(w.en)})'>×</button>`:''}</div></div>`}).join(''):'<div class="card dictempty muted">Noch nichts hier. Neue Chunks aus Warm-ups und Aufgaben landen automatisch in deinem Wörterbuch.</div>'
};
function addBasisToDictionary(en){const w=SEED_WORDS.find(x=>x.en===en);if(w){captureChunk(w.en,w.de,w.ex,'Basiswort');words()}}
window.addBasisToDictionary=addBasisToDictionary;

vocabReview=function(){const dict=dictionaryWords(),due=dict.filter(w=>isDue(w.en)),source=due.length?due:dict.length?dict:SEED_WORDS,chosen=shuffled(source).slice(0,Math.min(6,source.length)),translations=allWords().map(w=>w.de);const q=chosen.map(w=>{let opts=shuffled([w.de,...shuffled(translations.filter(d=>d!==w.de)).slice(0,3)]);while(opts.length<4)opts.push('—');return{type:'mcq',tense:'Vocabulary',prompt:`Was bedeutet „${w.en}“?`,options:opts,answer:opts.indexOf(w.de),best:w.de,accepted:[],explain:w.ex||'',audio:'',vocabWord:w.en}});if(!q.length)return alert('Dein Wörterbuch ist noch leer.');start(q,'vocab','words',[])};

function bindDictionaryTabs(){$$('#words .tab').forEach(b=>b.onclick=()=>{$$('#words .tab').forEach(x=>x.classList.toggle('active',x===b));WORD_FILTER=b.dataset.filter;words()})}

function fillTo(a,n){if(!a.length)return[];const out=[];while(out.length<n)out.push(...shuffled(a));return out.slice(0,n)}
dailyMix=function(){const allowed=allowedGrammarTopics(),reviews=reviewExercises(2),pool=[...BASE,...GRAMMAR_EXTRA].filter(e=>allowed.includes(e.tense)||e.tense==='Mixed'),listenPool=LISTEN.filter(e=>allowed.includes(e.tense)||e.tense==='Mixed');const core=fillTo(pool,Math.max(4,6-reviews.length)),listen=fillTo(listenPool.length?listenPool:LISTEN,2);start(shuffled([...reviews,...core,...listen]).slice(0,8),reviews.length?'review':'local','learn')};

aiSession=async function(mode='adaptive',focus=''){
 if(AI_REQUEST_IN_FLIGHT)return;AI_REQUEST_IN_FLIGHT=true;
 if(!AI){await health();if(!AI){AI_REQUEST_IN_FLIGHT=false;alert('AI ist gerade nicht erreichbar. Ich starte stattdessen einen strukturierten lokalen Mix.');return dailyMix()}}
 const button=mode==='adaptive'?$('#ai'):mode==='grammar'?$('#grammarStart'):$('#listeningStart');const old=button.textContent;setAiButtonsDisabled(true);button.innerHTML='<span class="spin">↻</span> Wird erstellt…';
 try{
  const allowed=mode==='grammar'?[focus]:allowedGrammarTopics(),weakAllowed=weak().filter(t=>allowed.includes(t)).slice(0,5),lesson=currentLesson();
  const payload={profile:{level:S.level,estimatedLevel:S.level},weakTenses:weakAllowed,grammar:S.grammar,recentErrors:S.errors.filter(x=>allowed.includes(x.tense)).slice(0,6),length:8,mode,focus,curriculumAllowed:allowed,curriculumLesson:{title:lesson.title,core:lesson.core,trap:lesson.trap}};
  const r=await fetch('/api/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}),j=await r.json();
  if(!r.ok||!Array.isArray(j.exercises))throw Object.assign(new Error(j.message||j.error||'AI generation failed'),{status:r.status});
  captureChunks(j.chunks,'AI Warm-up');$('#status').textContent='AI online';start(j.exercises,'ai','learn',j.warmup)
 }catch(err){console.error(err);if(err.status===429){$('#status').textContent='AI kurz gedrosselt';alert('Die KI wurde gerade kurzfristig gedrosselt. Ich starte einen lokalen Mix aus deinem aktuellen Lernstoff.')}else alert('Die AI-Session konnte gerade nicht erzeugt werden. Ich starte eine lokale Alternative.');if(mode==='listening'){const a=allowedGrammarTopics(),p=LISTEN.filter(e=>a.includes(e.tense)||e.tense==='Mixed');start(fillTo(p.length?p:LISTEN,6),'local','learn')}else if(mode==='grammar')start(localGrammar(focus),'local','learn');else dailyMix()}
 finally{AI_REQUEST_IN_FLIGHT=false;setAiButtonsDisabled(false);button.textContent=old}
};

function rebindCoreActions(){
 $('#recommended').onclick=()=>{const r=reviewExercises(4);if(r.length)start(r,'review','home');else AI?aiSession('adaptive'):dailyMix()};
 $('#daily').onclick=dailyMix;$('#ai').onclick=()=>aiSession('adaptive');
 $('#grammarStart').onclick=()=>{const f=$('#grammarFocus').value;AI?aiSession('grammar',f):start(localGrammar(f),'local','learn')};
 $('#listeningStart').onclick=()=>AI?aiSession('listening','Listening'):(()=>{const a=allowedGrammarTopics(),p=LISTEN.filter(e=>a.includes(e.tense)||e.tense==='Mixed');start(fillTo(p.length?p:LISTEN,6),'local','learn')})();
 $('#reviewWords').onclick=vocabReview;bindDictionaryTabs()
}
rebindCoreActions();

dash();renderLearn();
