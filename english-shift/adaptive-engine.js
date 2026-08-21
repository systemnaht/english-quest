/* English Shift adaptive engine v2: rotate tasks, keep grammar alive after the foundation path. */
(function(){
  const seen = new Set(Array.isArray(S.seenExercises) ? S.seenExercises : []);
  S.seenExercises = Array.isArray(S.seenExercises) ? S.seenExercises : [];
  S.mastery = S.mastery && typeof S.mastery==='object' ? S.mastery : {};
  function key(e){ return `${e.tense||'Mixed'}|${norm(e.prompt||e.audio||e.best).slice(0,140)}`; }
  function remember(e){
    const k=key(e); seen.add(k);
    S.seenExercises.push(k);
    if(S.seenExercises.length>180) S.seenExercises=S.seenExercises.slice(-180);
  }
  function foundationDone(){ return passedLessons().length===GRAMMAR_PATH.length; }
  function topicMastery(t){
    const g=S.grammar[t]||{c:0,n:0};
    if(!g.n) return {label:'neu',score:0};
    const p=g.c/g.n;
    if(g.n>=12&&p>=.88) return {label:'sicher',score:p};
    if(g.n>=6&&p>=.78) return {label:'stabil',score:p};
    if(p>=.65) return {label:'gelernt',score:p};
    return {label:'üben',score:p};
  }
  function unseen(pool){
    const fresh=pool.filter(e=>!seen.has(key(e)));
    return fresh.length?fresh:pool;
  }
  const coreRecord=record;
  record=function(e,user,mastered,feedback,better,helpLevel,revealed){
    remember(e);
    const out=coreRecord(e,user,mastered,feedback,better,helpLevel,revealed);
    if(e.tense&&e.tense!=='Vocabulary'){
      const m=S.mastery[e.tense]||{streak:0,last:0};
      m.streak=mastered?Math.min(20,(m.streak||0)+1):0; m.last=Date.now(); S.mastery[e.tense]=m; save();
    }
    return out;
  };

  dailyMix=function(){
    if(AI){ return aiSession('adaptive'); }
    const allowed=allowedGrammarTopics(),reviews=reviewExercises(2);
    const pool=[...BASE,...GRAMMAR_EXTRA].filter(e=>allowed.includes(e.tense)||e.tense==='Mixed');
    const lp=LISTEN.filter(e=>allowed.includes(e.tense)||e.tense==='Mixed');
    const core=shuffled(unseen(pool)).slice(0,Math.max(4,6-reviews.length));
    const listen=shuffled(unseen(lp.length?lp:LISTEN)).slice(0,2);
    start(shuffled([...reviews,...core,...listen]).slice(0,8),reviews.length?'review':'local','learn');
  };

  const oldAi=aiSession;
  aiSession=async function(mode='adaptive',focus=''){
    /* The API already receives recentErrors. Add correctly solved recent prompts as explicit anti-repeat context. */
    const originalErrors=S.errors;
    const avoid=S.seenExercises.slice(-24).map(k=>({tense:'AVOID_REPEAT',prompt:k.split('|').slice(1).join('|'),user:'already mastered',best:'Generate a different situation and wording'}));
    S.errors=[...originalErrors,...avoid].slice(-30);
    try{return await oldAi(mode,focus)}finally{S.errors=originalErrors}
  };

  renderGrammarPath=function(){
    const box=$('#grammarPathBox');if(!box)return;
    const done=foundationDone(),cur=currentLesson(),idx=currentPathIndex();
    const status=done?'Adaptive Mastery':`Grundlagen · ${idx+1}/${GRAMMAR_PATH.length}`;
    const headline=done?'Grundlagen geschafft — jetzt wird Englisch offen weitertrainiert':`${escapeHtml(cur.title)}`;
    const sub=done?'Keine Endstation: neue Situationen, neue Formulierungen, alte Schwächen kommen gezielt zurück. Schwierigkeit und Wortschatz steigen mit deiner Leistung.':`${escapeHtml(cur.short)} · kompakt lernen → gezielt üben → später mischen.`;
    box.innerHTML=`<div class="pathhead"><div><div class="eyebrow">${status}</div><h3 style="margin:5px 0">${headline}</h3><div class="muted">${sub}</div></div><div class="pathpct">${done?'∞':pathPercent()+'%'}</div></div><div class="pathbar"><i style="width:${done?'100':pathPercent()}%"></i></div><div class="row" style="margin-top:12px"><button id="openCurrentLesson" class="primary">${done?'Adaptive Session starten':'Lektion öffnen'}</button><span class="tiny muted">Richtige Aufgaben werden durch neue Varianten ersetzt; Fehler kommen später in neuer Form zurück.</span></div><div class="pathlist">${GRAMMAR_PATH.map((l,n)=>{const m=l.topics.map(topicMastery);const worst=m.sort((a,b)=>a.score-b.score)[0]||{label:'neu',score:0};return `<button class="pathstep ${S.grammarPath.completed[l.id]?.passed?'done':''} ${!done&&n===idx?'current':''}" data-lesson="${l.id}"><span class="pathnum">${S.grammarPath.completed[l.id]?.passed?'✓':n+1}</span><span><b>${escapeHtml(l.title)}</b><br><span class="tiny muted">${escapeHtml(l.short)}</span></span><span class="tiny">${done?worst.label:pathStatus(l,n)}</span></button>`}).join('')}</div><div id="lessonDetail"></div>`;
    $('#openCurrentLesson').onclick=()=>done?aiSession('adaptive'):showLesson(cur.id);
    $$('[data-lesson]').forEach(b=>b.onclick=()=>showLesson(b.dataset.lesson));
    if(!done){const selected=S.grammarPath.selected||cur.id;showLesson(selected,false)}
    else $('#lessonDetail').innerHTML='<div class="lessonbox"><b>Was jetzt passiert</b><div class="tiny muted" style="margin-top:7px">Der Trainer mischt bekannte Grammatik mit neuen Alltagssituationen, gewichtet schwache Bereiche stärker und hält sichere Themen mit größeren Abständen aktiv. Es gibt bewusst kein „fertig“ mehr.</div></div>';
  };

  renderPathHome=function(){
    const host=$('#pathHome');if(!host)return;const done=foundationDone(),l=currentLesson();
    host.innerHTML=done?`<div class="eyebrow">Adaptive Mastery</div><div class="focuscard"><div><b>Grundlagen abgeschlossen · jetzt offen weiter</b><div class="tiny muted">Neue Aufgaben statt Wiederholung derselben Sätze. Schwächen bestimmen den nächsten Shift.</div><div class="pathbar"><i style="width:100%"></i></div></div><button id="goPath">Starten</button></div>`:`<div class="eyebrow">Grammatik-Pfad</div><div class="focuscard"><div><b>${escapeHtml(l.title)}</b><div class="tiny muted">${escapeHtml(l.short)}</div><div class="pathbar"><i style="width:${pathPercent()}%"></i></div></div><button id="goPath">Öffnen</button></div>`;
    $('#goPath').onclick=()=>done?aiSession('adaptive'):(view('learn'),setTimeout(()=>$('#grammarPathBox')?.scrollIntoView({behavior:'smooth'}),80));
  };

  renderPathProgress=function(){
    const host=$('#pathProgress');if(!host)return;const done=foundationDone();
    host.innerHTML=`<h3>${done?'Adaptive Mastery':'Grammatik-Lernpfad'}</h3><div class="card"><b>${done?'Grundlagen abgeschlossen — Training läuft weiter':passedLessons().length+'/'+GRAMMAR_PATH.length+' Lektionen stabil'}</b><span style="float:right">${done?'∞':pathPercent()+'%'}</span><div class="pathbar"><i style="width:${done?'100':pathPercent()}%"></i></div><div class="tiny muted" style="margin-top:8px">${done?'Themen werden nicht abgehakt und vergessen: sicher → stabil → gelernt → üben wird aus deiner laufenden Trefferquote neu bewertet.':'Nach der letzten Grundlagenlektion wechselt English Shift automatisch in den offenen adaptiven Modus.'}</div></div>`;
  };

  rebindCoreActions(); dash(); renderLearn();
})();