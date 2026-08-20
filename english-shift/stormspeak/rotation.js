/* StormSpeak adaptive rotation v1
   Every zone owns an 18-task learning pool.
   Correct tasks leave the active pool while unseen tasks exist.
   Incorrect tasks become due and return in a later round.
   Zone unlocks depend on actual task coverage, not XP grinding.
*/
window.addEventListener('DOMContentLoaded',()=>{
  const MAX_TASKS_PER_MISSION=6;
  const MAX_DUE_PER_MISSION=3;
  const mix=a=>[...a].sort(()=>Math.random()-.5);
  const uniq=a=>[...new Set(a)];

  const responses={
    spawn:{
      'whats-your-name':{prompt:'Ein neuer Mitspieler fragt: „What’s your name?“ Welche Antwort passt am besten?',correct:'My name is Max.',wrong:["I'm ready.","Let's go!",'Are you ready?']},
      'are-you-ready':{prompt:'Dein Team will los. Jemand fragt: „Are you ready?“ Was antwortest du?',correct:"Yes, I'm ready!",wrong:['My name is Max.',"What's your name?","Let's go!"]}
    },
    loot:{
      'i-need-shield':{prompt:'Ein Mitspieler sagt: „I need a shield.“ Du hast einen Schild übrig. Was sagst du?',correct:'Take this.',wrong:['I need a shield.','Where is the chest?','There is a door.']},
      'where-chest':{prompt:'Jemand fragt: „Where is the chest?“ Du weißt, dass die Kiste oben ist. Welche Antwort hilft wirklich?',correct:'It is upstairs.',wrong:['I have a map.','Take this.','There is a door.']}
    },
    squad:{
      'help-me':{prompt:'Dein Mitspieler sagt: „Help me, please.“ Du kannst helfen. Welche Antwort passt?',correct:'Yes, I can help.',wrong:["I can't jump that high.",'Wait for me!','Follow me.']},
      'wait-for-me':{prompt:'Ein Teamkollege ruft: „Wait for me!“ Du willst kurz warten. Was antwortest du?',correct:'Okay, I can wait.',wrong:['Follow me.','Watch out!',"I can't jump that high."]}
    },
    build:{
      'next-to':{prompt:'Die Kiste steht neben der Wand. Jemand fragt, wo sie ist. Was sagst du?',correct:'It is next to the wall.',wrong:['It is under the bridge.','I am building a wall.','He is running.']},
      'he-running':{prompt:'Du siehst einen Jungen, der gerade zum Turm rennt. Welche Beschreibung passt?',correct:'He is running.',wrong:['They are hiding.','I am building a wall.','It is under the bridge.']}
    },
    realworld:{
      'what-time':{prompt:'Jemand fragt: „What time do you start school?“ Du beginnst um acht. Was antwortest du?',correct:'I start at eight.',wrong:['I like English.','After school, I play with my friends.',"I don't like getting up early."]},
      'after-school':{prompt:'Ein Freund fragt, was du nach der Schule machst. Welche Antwort passt?',correct:'After school, I play with my friends.',wrong:['I go to school at eight.','I usually do my homework first.','What time do you start?']}
    },
    story:{
      'we-won':{prompt:'Jemand fragt: „What happened?“ Ihr habt das Spiel gewonnen. Was antwortest du?',correct:'We won the game.',wrong:['Then we went home.','It was fun.','Yesterday I played with my friends.']},
      'then-went':{prompt:'Du erzählst weiter: Erst habt ihr gespielt, danach seid ihr nach Hause gegangen. Welcher Satz passt?',correct:'Then we went home.',wrong:['We won the game.','I found a secret room.','What happened?']}
    }
  };

  const responseFor=(zone,p)=>responses[zone.id]?.[p.id]||null;
  const zoneIndex=z=>STORMSPEAK_ZONES.findIndex(x=>x.id===z.id);
  const englishChoices=(zone,target)=>mix([target.en,...mix(zone.phrases.filter(x=>x.id!==target.id).map(x=>x.en)).slice(0,3)]);
  const germanChoices=(zone,target)=>mix([target.de,...mix(zone.phrases.filter(x=>x.id!==target.id).map(x=>x.de)).slice(0,3)]);
  const extraPiece=words=>['not','now','can','is','a','the','I','we','you'].find(x=>!words.some(w=>clean(w)===clean(x)))||'now';

  function zoneTaskPool(zone){
    return zone.phrases.flatMap((p,i)=>[
      {id:`${zone.id}:${p.id}:understand`,zoneId:zone.id,phraseId:p.id,kind:i%2===0?'meaning':'listen'},
      {id:`${zone.id}:${p.id}:build`,zoneId:zone.id,phraseId:p.id,kind:'build'},
      {id:`${zone.id}:${p.id}:use`,zoneId:zone.id,phraseId:p.id,kind:responseFor(zone,p)?'response':'type'}
    ]);
  }

  state.taskRotation=state.taskRotation||{};
  state.rotationMigrated=state.rotationMigrated||{};

  function history(zoneId){
    state.taskRotation[zoneId]=state.taskRotation[zoneId]||{};
    return state.taskRotation[zoneId];
  }

  function migrateZone(zone){
    if(state.rotationMigrated[zone.id])return;
    const h=history(zone.id),pool=zoneTaskPool(zone);
    zone.phrases.forEach(p=>{
      const m=mastery(p.id),tasks=pool.filter(t=>t.phraseId===p.id);
      const success=Math.min(tasks.length,Number(m.correct)||0);
      for(let i=0;i<success;i++)h[tasks[i].id]={clearedEver:true,due:false,attempts:1,correct:1,wrong:0,last:Number(m.last)||0};
      if((Number(m.seen)||0)>(Number(m.correct)||0)&&success<tasks.length){
        const t=tasks[success];h[t.id]={clearedEver:false,due:true,attempts:1,correct:0,wrong:1,last:Number(m.last)||0};
      }
    });
    state.rotationMigrated[zone.id]=true;
  }
  STORMSPEAK_ZONES.forEach(migrateZone);

  function taskStats(zone){
    const pool=zoneTaskPool(zone),h=history(zone.id);
    const cleared=pool.filter(t=>h[t.id]?.clearedEver).length;
    const due=pool.filter(t=>h[t.id]?.due).length;
    const unseen=pool.filter(t=>!h[t.id]?.clearedEver).length;
    return {total:pool.length,cleared,due,unseen,percent:Math.round(cleared/pool.length*100)};
  }

  zoneProgress=function(zone){return taskStats(zone).percent};
  const isComplete=zone=>taskStats(zone).cleared===taskStats(zone).total;
  const isUnlocked=(zone)=>{const i=zoneIndex(zone);return i===0||STORMSPEAK_ZONES.slice(0,i).every(isComplete)};

  unlockedZones=function(){return STORMSPEAK_ZONES.filter(isUnlocked)};
  currentZone=function(){const open=unlockedZones();return open.find(z=>!isComplete(z))||open.at(-1)||STORMSPEAK_ZONES[0]};

  function chooseTasks(zone){
    const pool=zoneTaskPool(zone),h=history(zone.id);
    const due=pool.filter(t=>h[t.id]?.due).sort((a,b)=>(h[a.id]?.last||0)-(h[b.id]?.last||0));
    const unseen=pool.filter(t=>!h[t.id]?.clearedEver&&!h[t.id]?.due);
    const selected=[];
    due.slice(0,MAX_DUE_PER_MISSION).forEach(t=>selected.push(t));
    mix(unseen).forEach(t=>{if(selected.length<MAX_TASKS_PER_MISSION)selected.push(t)});
    if(!selected.length&&isComplete(zone)){
      pool.slice().sort((a,b)=>(h[a.id]?.last||0)-(h[b.id]?.last||0)).slice(0,MAX_TASKS_PER_MISSION).forEach(t=>selected.push(t));
    }
    return selected;
  }

  function taskToExercise(zone,t){
    const p=zone.phrases.find(x=>x.id===t.phraseId)||zone.phrases[0];
    if(t.kind==='meaning')return {taskId:t.id,type:'meaning',skill:'meaning',phraseId:p.id,prompt:`Im Teamchat steht: „${p.en}“ Was bedeutet das hier?`,options:germanChoices(zone,p),answerText:p.de,best:p.en,context:'Wähle die passende deutsche Bedeutung.'};
    if(t.kind==='listen')return {taskId:t.id,type:'listen',skill:'listening',phraseId:p.id,prompt:'Hör genau hin. Welcher englische Satz wurde gesprochen?',audio:p.en,options:englishChoices(zone,p),answerText:p.en,best:p.en,context:'Hör auf den ganzen Satz, nicht nur auf ein einzelnes Wort.'};
    if(t.kind==='build'){
      const words=p.en.replace(/[.!?]/g,'').split(' '),pieces=words.length>=3?mix([...words,extraPiece(words)]):mix(words);
      return {taskId:t.id,type:'build',skill:'build',phraseId:p.id,prompt:`Du willst sagen: „${p.de}“`,pieces,answerText:clean(p.en),best:p.en,context:words.length>=3?'Baue den Satz. Ein Baustein ist überflüssig.':'Baue den vollständigen englischen Satz.'};
    }
    const r=responseFor(zone,p);
    if(t.kind==='response'&&r){const options=mix([r.correct,...r.wrong]);return {taskId:t.id,type:'response',skill:'response',phraseId:p.id,prompt:r.prompt,context:'Wähle die englische Antwort, die in dieser Situation wirklich Sinn ergibt.',options,answerIndex:options.indexOf(r.correct),answerText:r.correct,best:r.correct};}
    return {taskId:t.id,type:'type',skill:'response',phraseId:p.id,prompt:`Schreibe auf Englisch: „${p.de}“`,answerText:clean(p.en),best:p.en,context:'Formuliere den ganzen Satz selbst — diesmal ohne vorgegebene Wörter.'};
  }

  const originalReward=reward;
  reward=function(correct,skill,phraseId,userAnswer,best){
    const e=mission?.exercises?.[mission.index];
    if(e?.taskId&&mission?.zone?.id){
      const h=history(mission.zone.id),old=h[e.taskId]||{clearedEver:false,due:false,attempts:0,correct:0,wrong:0,last:0};
      old.attempts++;
      old.last=Date.now();
      if(correct){old.correct++;old.clearedEver=true;old.due=false}else{old.wrong++;old.due=true}
      h[e.taskId]=old;
    }
    return originalReward(correct,skill,phraseId,userAnswer,best);
  };

  startZone=function(id){
    const zone=STORMSPEAK_ZONES.find(x=>x.id===id);
    if(!zone||!isUnlocked(zone))return;
    const picked=chooseTasks(zone);
    const exercises=picked.map(t=>taskToExercise(zone,t));
    const retryCount=picked.filter(t=>history(zone.id)[t.id]?.due).length;
    const newCount=picked.filter(t=>!history(zone.id)[t.id]?.clearedEver).length;
    const phraseIds=uniq(picked.map(t=>t.phraseId));
    const chunks=phraseIds.map(id=>zone.phrases.find(p=>p.id===id)).filter(Boolean).slice(0,3);
    zone.phrases.forEach(p=>{if(chunks.length<3&&!chunks.some(x=>x.id===p.id))chunks.push(p)});
    mission={source:'static',title:zone.title,subtitle:isComplete(zone)?'Wiederholungsrunde':`${newCount} neue · ${retryCount} Wiederholung${retryCount===1?'':'en'}`,zone,scene:zone.scene,chunks,exercises};
    openMission();
  };

  renderMap=function(host){
    host.innerHTML='';
    STORMSPEAK_ZONES.forEach((z,i)=>{
      const open=isUnlocked(z),s=taskStats(z),b=document.createElement('button');
      b.className='card zone '+(open?'unlocked':'locked');
      const status=open?(s.percent===100?'✓ abgeschlossen':`${s.cleared}/${s.total} Aufgaben`):(i?`Erst ${STORMSPEAK_ZONES[i-1].title} abschließen`:'Gesperrt');
      b.innerHTML=`<div class="zicon">${z.icon}</div><h3>${z.title}</h3><p>${z.subtitle}</p><div class="pattern">${open?status:'🔒 '+status}</div><div class="lock">${open?s.percent+'%':'🔒'}</div>`;
      if(open)b.onclick=()=>startZone(z.id);
      host.appendChild(b);
    });
  };

  renderRecommend=function(){
    const z=currentZone(),s=taskStats(z),h=history(z.id),pool=zoneTaskPool(z);
    const due=pool.filter(t=>h[t.id]?.due).length;
    const fresh=pool.filter(t=>!h[t.id]?.clearedEver&&!h[t.id]?.due).length;
    $('recommend').innerHTML=`<div><strong>${z.icon} ${z.title}</strong><p>${s.percent}% geschafft · ${fresh} neue Aufgaben · ${due} zur Wiederholung</p></div><button id="recStart" class="primary">${s.percent===100?'Wiederholen':'Weiter'}</button>`;
    $('recStart').onclick=()=>startZone(z.id);
  };

  const originalRenderProgress=renderProgress;
  renderProgress=function(){
    originalRenderProgress();
    const rows=STORMSPEAK_ZONES.map(z=>{const s=taskStats(z),open=isUnlocked(z);return `<div class="skillrow"><span>${z.icon} ${z.title}</span><div class="skillbar"><i style="width:${s.percent}%"></i></div><b>${open?s.percent+'%':'🔒'}</b></div>`}).join('');
    $('progressMain').insertAdjacentHTML('beforeend',`<div style="margin-top:18px;border-top:1px solid #263968;padding-top:14px"><div class="eyebrow">Zonen-Fortschritt</div>${rows}</div>`);
  };

  // Persist migration and immediately redraw the UI with mastery-based zone locks.
  save();
});
