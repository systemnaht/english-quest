const STORMSPEAK_ZONES = [
  {
    id: 'spawn', icon: '🛰️', title: 'Spawn Island', subtitle: 'Lerne dein Team kennen', unlockXp: 0,
    scene: 'Du landest auf einer hellen Insel. Ein neuer Mitspieler winkt dir zu. Deine erste Mission: Stell dich kurz vor und macht euch gemeinsam auf den Weg.',
    pattern: 'I am … / My name is … / Let’s …',
    phrases: [
      {id:'hi', en:'Hi!', de:'Hi!', ru:'Привет!', example:'Hi! I am Max.'},
      {id:'my-name', en:'My name is Max.', de:'Ich heiße Max.', ru:'Меня зовут Макс.', example:'Hi! My name is Max.'},
      {id:'whats-your-name', en:"What's your name?", de:'Wie heißt du?', ru:'Как тебя зовут?', example:"Hi! What's your name?"},
      {id:'i-am-ready', en:"I'm ready.", de:'Ich bin bereit.', ru:'Я готов.', example:"I'm ready. Let's go!"},
      {id:'lets-go', en:"Let's go!", de:'Los geht’s!', ru:'Пошли!', example:"We're ready. Let's go!"},
      {id:'are-you-ready', en:'Are you ready?', de:'Bist du bereit?', ru:'Ты готов?', example:'Are you ready? Yes, I am!'}
    ]
  },
  {
    id: 'loot', icon: '🎒', title: 'Loot Lab', subtitle: 'Sag, was du hast und brauchst', unlockXp: 90,
    scene: 'Dein Rucksack ist fast leer. Finde nützliche Ausrüstung und sag deinem Team, was du hast, was du brauchst und wo etwas liegt.',
    pattern: 'I have … / I need … / There is …',
    phrases: [
      {id:'i-have-map', en:'I have a map.', de:'Ich habe eine Karte.', ru:'У меня есть карта.', example:'I have a map in my bag.'},
      {id:'i-need-shield', en:'I need a shield.', de:'Ich brauche einen Schild.', ru:'Мне нужен щит.', example:'I need a shield now.'},
      {id:'where-chest', en:'Where is the chest?', de:'Wo ist die Kiste?', ru:'Где сундук?', example:'Where is the chest? It is upstairs.'},
      {id:'there-door', en:'There is a door.', de:'Da ist eine Tür.', ru:'Там есть дверь.', example:'There is a door on the left.'},
      {id:'i-found-it', en:'I found it!', de:'Ich habe es gefunden!', ru:'Я нашёл!', example:'The key! I found it!'},
      {id:'take-this', en:'Take this.', de:'Nimm das.', ru:'Возьми это.', example:'Take this. You need it.'}
    ]
  },
  {
    id: 'squad', icon: '🎧', title: 'Squad Comms', subtitle: 'Kurzes Englisch im Team', unlockXp: 210,
    scene: 'Der Sturm bewegt sich und ihr müsst euch schnell verständigen. Hier trainierst du kurze Sätze, mit denen du im Team wirklich etwas erreichen kannst.',
    pattern: 'Can you …? / I can … / I can’t …',
    phrases: [
      {id:'follow-me', en:'Follow me.', de:'Folge mir.', ru:'Следуй за мной.', example:'Follow me. I know the way.'},
      {id:'help-me', en:'Help me, please.', de:'Hilf mir bitte.', ru:'Помоги мне, пожалуйста.', example:'Help me, please. I am stuck.'},
      {id:'wait-for-me', en:'Wait for me!', de:'Warte auf mich!', ru:'Подожди меня!', example:'Wait for me! I am coming.'},
      {id:'i-can-build', en:'I can build.', de:'Ich kann bauen.', ru:'Я умею строить.', example:'I can build a bridge.'},
      {id:'cant-jump', en:"I can't jump that high.", de:'Ich kann nicht so hoch springen.', ru:'Я не могу так высоко прыгнуть.', example:"I can't jump that high. Can you help?"},
      {id:'watch-out', en:'Watch out!', de:'Pass auf!', ru:'Осторожно!', example:'Watch out! Something is behind you.'}
    ]
  },
  {
    id: 'build', icon: '🧱', title: 'Build Zone', subtitle: 'Bewegen, platzieren, beschreiben', unlockXp: 360,
    scene: 'Du kommst in eine Block-Bauzone. Platziere Dinge richtig und beschreibe, wo etwas ist und was die Figuren gerade machen.',
    pattern: 'Put it … / I am + -ing / He is + -ing',
    phrases: [
      {id:'put-here', en:'Put it here.', de:'Stell es hier hin.', ru:'Поставь это сюда.', example:'Put it here, next to the wall.'},
      {id:'next-to', en:'It is next to the wall.', de:'Es ist neben der Wand.', ru:'Это рядом со стеной.', example:'The box is next to the wall.'},
      {id:'under-bridge', en:'It is under the bridge.', de:'Es ist unter der Brücke.', ru:'Это под мостом.', example:'The key is under the bridge.'},
      {id:'building-wall', en:'I am building a wall.', de:'Ich baue gerade eine Wand.', ru:'Я сейчас строю стену.', example:'I am building a wall now.'},
      {id:'he-running', en:'He is running.', de:'Er rennt gerade.', ru:'Он сейчас бежит.', example:'He is running to the tower.'},
      {id:'they-hiding', en:'They are hiding.', de:'Sie verstecken sich gerade.', ru:'Они сейчас прячутся.', example:'They are hiding behind the house.'}
    ]
  },
  {
    id: 'realworld', icon: '🏫', title: 'Real World Base', subtitle: 'Schule und Alltag', unlockXp: 540,
    scene: 'Jetzt verlässt du die Spielwelt ein Stück. Du trainierst kurze Sätze über Schule, Zuhause, Freunde, Hobbys und deinen normalen Tagesablauf.',
    pattern: 'I usually … / I like … / I go …',
    phrases: [
      {id:'go-school', en:'I go to school at eight.', de:'Ich gehe um acht zur Schule.', ru:'Я иду в школу в восемь.', example:'I go to school at eight.'},
      {id:'like-english', en:'I like English.', de:'Ich mag Englisch.', ru:'Мне нравится английский.', example:'I like English and art.'},
      {id:'after-school', en:'After school, I play with my friends.', de:'Nach der Schule spiele ich mit meinen Freunden.', ru:'После школы я играю с друзьями.', example:'After school, I play with my friends.'},
      {id:'usually-homework', en:'I usually do my homework first.', de:'Normalerweise mache ich zuerst meine Hausaufgaben.', ru:'Обычно я сначала делаю домашнее задание.', example:'I usually do my homework first.'},
      {id:'dont-like', en:"I don't like getting up early.", de:'Ich stehe nicht gern früh auf.', ru:'Я не люблю рано вставать.', example:"I don't like getting up early on Monday."},
      {id:'what-time', en:'What time do you start?', de:'Um wie viel Uhr fängst du an?', ru:'Во сколько ты начинаешь?', example:'What time do you start school?'}
    ]
  },
  {
    id: 'story', icon: '🏆', title: 'Victory Stories', subtitle: 'Erzähle, was passiert ist', unlockXp: 780,
    scene: 'In der letzten Zone erzählst du eine winzige Geschichte über gestern. Keine Grammatik-Vorlesung: Du benutzt kurze Erzählbausteine immer wieder im Zusammenhang.',
    pattern: 'Yesterday I … / We … / Then …',
    phrases: [
      {id:'yesterday-played', en:'Yesterday I played with my friends.', de:'Gestern habe ich mit meinen Freunden gespielt.', ru:'Вчера я играл с друзьями.', example:'Yesterday I played with my friends.'},
      {id:'we-won', en:'We won the game.', de:'Wir haben das Spiel gewonnen.', ru:'Мы выиграли игру.', example:'It was close, but we won the game.'},
      {id:'i-found', en:'I found a secret room.', de:'Ich habe einen geheimen Raum gefunden.', ru:'Я нашёл секретную комнату.', example:'I found a secret room behind the wall.'},
      {id:'then-went', en:'Then we went home.', de:'Dann gingen wir nach Hause.', ru:'Потом мы пошли домой.', example:'Then we went home.'},
      {id:'was-fun', en:'It was fun.', de:'Es hat Spaß gemacht.', ru:'Было весело.', example:'The challenge was hard, but it was fun.'},
      {id:'what-happened', en:'What happened?', de:'Was ist passiert?', ru:'Что случилось?', example:'What happened after that?'}
    ]
  }
];

const STORMSPEAK_FEEDBACK={
  good:['Richtig! Das passt genau.','Stark — weiter.','Genau so.','Sauber gelöst. +XP','Treffer. Weiter zur nächsten Aufgabe.'],
  retry:['Fast. Schau dir den Hinweis an.','Noch nicht ganz — ein kleiner Fehler.','Guter Versuch. Prüfe den Satz noch einmal.','Knapp daneben. Bau die Aussage noch einmal auf.']
};

/* StormSpeak v3 didactic patch: German task instructions + richer A1 reasoning. */
window.addEventListener('DOMContentLoaded',()=>{
  const englishChoices=(zone,target)=>shuffle([target.en,...zone.phrases.filter(x=>x.id!==target.id).map(x=>x.en)]).slice(0,4);
  const germanChoices=(zone,target)=>shuffle([target.de,...zone.phrases.filter(x=>x.id!==target.id).map(x=>x.de)]).slice(0,4);
  const extraPiece=(words)=>['not','now','can','is','a','the','I','we'].find(x=>!words.some(w=>clean(w)===clean(x)))||'now';

  const responseBank={
    spawn:[
      {id:'whats-your-name',prompt:'Ein neuer Mitspieler fragt: „What’s your name?“ Welche Antwort passt am besten?',correct:'My name is Max.',wrong:["I'm ready.","Let's go!",'Are you ready?']},
      {id:'are-you-ready',prompt:'Dein Team will los. Jemand fragt: „Are you ready?“ Was antwortest du?',correct:"Yes, I'm ready!",wrong:['My name is Max.',"What's your name?","Let's go!"]}
    ],
    loot:[
      {id:'i-need-shield',prompt:'Ein Mitspieler sagt: „I need a shield.“ Du hast einen Schild übrig. Was sagst du?',correct:'Take this.',wrong:['I need a shield.','Where is the chest?','There is a door.']},
      {id:'where-chest',prompt:'Jemand fragt: „Where is the chest?“ Du weißt, dass sie oben ist. Welche Antwort hilft wirklich?',correct:'It is upstairs.',wrong:['I have a map.','Take this.','There is a door.']}
    ],
    squad:[
      {id:'help-me',prompt:'Dein Mitspieler sagt: „Help me, please.“ Du kannst helfen. Welche Antwort passt?',correct:'Yes, I can help.',wrong:["I can't jump that high.",'Wait for me!','Follow me.']},
      {id:'wait-for-me',prompt:'Ein Teamkollege ruft: „Wait for me!“ Du willst kurz warten. Was antwortest du?',correct:'Okay, I can wait.',wrong:['Follow me.','Watch out!',"I can't jump that high."]}
    ],
    build:[
      {id:'next-to',prompt:'Die Kiste steht neben der Wand. Jemand fragt, wo sie ist. Was sagst du?',correct:'It is next to the wall.',wrong:['It is under the bridge.','I am building a wall.','He is running.']},
      {id:'he-running',prompt:'Du siehst einen Jungen, der gerade zum Turm rennt. Welche Beschreibung passt?',correct:'He is running.',wrong:['They are hiding.','I am building a wall.','It is under the bridge.']}
    ],
    realworld:[
      {id:'what-time',prompt:'Jemand fragt: „What time do you start school?“ Du beginnst um acht. Was antwortest du?',correct:'I start at eight.',wrong:['I like English.','After school, I play with my friends.',"I don't like getting up early."]},
      {id:'after-school',prompt:'Ein Freund fragt, was du nach der Schule machst. Welche Antwort passt?',correct:'After school, I play with my friends.',wrong:['I go to school at eight.','I usually do my homework first.','What time do you start?']}
    ],
    story:[
      {id:'we-won',prompt:'Jemand fragt: „What happened?“ Ihr habt das Spiel gewonnen. Was antwortest du?',correct:'We won the game.',wrong:['Then we went home.','It was fun.','Yesterday I played with my friends.']},
      {id:'then-went',prompt:'Du erzählst weiter: Erst habt ihr gespielt, danach seid ihr nach Hause gegangen. Welcher Satz passt?',correct:'Then we went home.',wrong:['We won the game.','I found a secret room.','What happened?']}
    ]
  };

  function responseExercise(zone){
    const pool=responseBank[zone.id]||responseBank.spawn;
    const s=random(pool),options=shuffle([s.correct,...s.wrong]);
    return {type:'response',skill:'response',phraseId:s.id,prompt:s.prompt,context:'Wähle die englische Antwort, die in dieser Situation wirklich Sinn ergibt.',options,answerIndex:options.indexOf(s.correct),best:s.correct,answerText:s.correct};
  }

  staticExercises=function(zone,phrases){
    const p0=phrases[0],p1=phrases[1]||p0,p2=phrases[2]||p0,p3=phrases[3]||p1;
    const buildWords=p2.en.replace(/[.!?]/g,'').split(' ');
    const buildPieces=shuffle(buildWords.length>=3?[...buildWords,extraPiece(buildWords)]:buildWords);
    const review=random(phrases);
    return [
      {type:'meaning',skill:'meaning',phraseId:p0.id,prompt:`Im Teamchat steht: „${p0.en}“ Was bedeutet das hier?`,options:germanChoices(zone,p0),answerText:p0.de,best:p0.en,context:'Wähle die passende deutsche Bedeutung. Die falschen Antworten stammen aus derselben Mission.'},
      {type:'listen',skill:'listening',phraseId:p1.id,prompt:'Hör genau hin. Welcher englische Satz wurde gesprochen?',audio:p1.en,options:englishChoices(zone,p1),answerText:p1.en,best:p1.en,context:'Die Antworten sehen ähnlich aus. Hör auf den ganzen Satz, nicht nur auf ein einzelnes Wort.'},
      {type:'build',skill:'build',phraseId:p2.id,prompt:`Du willst sagen: „${p2.de}“`,pieces:buildPieces,answerText:clean(p2.en),best:p2.en,context:buildWords.length>=3?'Baue den vollständigen englischen Satz. Ein Baustein ist überflüssig.':'Baue den vollständigen englischen Satz.'},
      {type:'type',skill:'response',phraseId:p3.id,prompt:`Schreibe auf Englisch: „${p3.de}“`,answerText:clean(p3.en),best:p3.en,context:'Formuliere den ganzen Satz selbst. Du bekommst die Wörter diesmal nicht vorgegeben.'},
      {type:'meaning',skill:'meaning',phraseId:review.id,prompt:`Du möchtest in der Situation sagen: „${review.de}“ Welche englische Aussage passt?`,options:englishChoices(zone,review),answerText:review.en,best:review.en,context:'Achte darauf, welche Aussage zur Bedeutung und zur Situation passt.'},
      responseExercise(zone)
    ];
  };

  missionIntro=function(zone,phrases,source='static'){
    return {source,title:source==='ai'?'AI Drop':zone.title,subtitle:source==='ai'?'Neue adaptive Mission':'6 kurze Aufgaben · etwa 5–8 Minuten',zone,scene:zone.scene,chunks:phrases.slice(0,3),exercises:staticExercises(zone,phrases)};
  };

  renderMissionStep=function(){
    const host=$('missionHost'),total=mission.exercises.length;
    $('missionCount').textContent=`${Math.max(0,mission.index+1)}/${total}`;
    $('missionBar').style.width=`${Math.max(0,mission.index)/total*100}%`;
    if(mission.index===-1){
      host.innerHTML=`<div class="scene"><div class="eyebrow">${mission.zone.icon} Deine Situation</div><h3>${mission.zone.title}</h3><p>${mission.scene}</p><div class="chunks">${mission.chunks.map(c=>`<div class="chunk"><b>${c.en}</b><small>${c.de}</small></div>`).join('')}</div></div><button id="beginExercises" class="primary" style="width:100%">Mission starten →</button>`;
      $('beginExercises').onclick=()=>{mission.index=0;renderMissionStep()};return;
    }
    if(mission.index>=total){
      const missionAcc=Math.round(mission.correct/Math.max(1,total)*100);
      if(missionAcc>=85)state.difficulty=Math.min(4,state.difficulty+1);else if(missionAcc<60)state.difficulty=Math.max(0,state.difficulty-1);
      state.sessions++;state.lastDate=todayKey();state.xp+=20;save();$('missionBar').style.width='100%';
      host.innerHTML=`<div class="scene"><div class="eyebrow">Mission geschafft</div><h3>⚡ ${mission.correct}/${total} richtig</h3><p>+20 Abschluss-XP. Schwierige Sprachbausteine tauchen später automatisch wieder auf.</p></div><div class="questActions"><button id="doneHome" class="primary">Zur Übersicht</button><button id="again">Nochmal</button></div>`;
      $('doneHome').onclick=()=>switchView('home');$('again').onclick=()=>startZone(mission.zone.id);return;
    }
    renderExercise(mission.exercises[mission.index]);
  };

  renderExercise=function(e){
    const labels={listen:'Hörverständnis',build:'Satz bauen',type:'Selbst formulieren',response:'Passende Antwort',meaning:'Verstehen im Kontext'};
    const host=$('missionHost');
    host.innerHTML=`<div class="exercise"><div class="type">${labels[e.type]||'Aufgabe'}</div><div class="prompt">${e.prompt}</div><div class="context">${e.context||''}</div><div id="work"></div><div id="fb"></div></div>`;
    const work=$('work');let locked=false;
    const finish=(correct,user,best=e.best)=>{if(locked)return;locked=true;if(correct)mission.correct++;reward(correct,e.skill||'meaning',e.phraseId,user,best);$('fb').innerHTML=`<div class="feedback ${correct?'good':'retry'}"><b>${random(correct?STORMSPEAK_FEEDBACK.good:STORMSPEAK_FEEDBACK.retry)}</b>${!correct?`<div style="margin-top:5px">Richtige Lösung: <b>${best}</b></div>`:''}</div><div class="questActions"><button id="nextQ" class="primary">Weiter →</button></div>`;$('nextQ').onclick=nextExercise};
    if(e.type==='listen'){
      work.innerHTML=`<button id="audioBtn" class="secondary" style="width:100%;margin-top:12px">🔊 Satz anhören</button><div class="options">${e.options.map((o,i)=>`<button class="option" data-i="${i}">${o}</button>`).join('')}</div>`;
      $('audioBtn').onclick=()=>speak(e.audio||e.best);work.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const ok=clean(b.textContent)===clean(e.answerText);b.classList.add(ok?'good':'bad');finish(ok,b.textContent)});return;
    }
    if(e.type==='meaning'){
      work.innerHTML=`<div class="options">${e.options.map((o,i)=>`<button class="option" data-i="${i}">${o}</button>`).join('')}</div>`;
      work.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const ok=b.textContent===e.answerText;b.classList.add(ok?'good':'bad');finish(ok,b.textContent)});return;
    }
    if(e.type==='response'){
      work.innerHTML=`<div class="options">${e.options.map((o,i)=>`<button class="option" data-i="${i}">${o}</button>`).join('')}</div>`;
      work.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const ok=Number(b.dataset.i)===(e.answerIndex??0);b.classList.add(ok?'good':'bad');finish(ok,b.textContent,e.options[e.answerIndex??0])});return;
    }
    if(e.type==='build'){
      let picked=[];
      const draw=()=>{work.innerHTML=`<div class="answerline">${picked.map((x,i)=>`<button class="piece" data-rm="${i}">${x}</button>`).join('')}</div><div class="pieces">${e.pieces.map((x,i)=>picked.includes(x)?'':`<button class="piece" data-add="${i}">${x}</button>`).join('')}</div><div class="questActions"><button id="buildHint">💡 Hinweis</button><button id="buildCheck" class="secondary">Prüfen</button></div>`;work.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>{picked.push(e.pieces[Number(b.dataset.add)]);draw()});work.querySelectorAll('[data-rm]').forEach(b=>b.onclick=()=>{picked.splice(Number(b.dataset.rm),1);draw()});$('buildHint').onclick=()=>{$('fb').innerHTML=`<div class="hintbox">Der Satz beginnt mit: <b>${e.best.split(' ').slice(0,Math.min(2,e.best.split(' ').length)).join(' ')}</b> …</div>`};$('buildCheck').onclick=()=>finish(clean(picked.join(' '))===clean(e.answerText),picked.join(' '))};draw();return;
    }
    work.innerHTML=`<div class="inputrow"><input id="typed" autocomplete="off" autocapitalize="sentences" placeholder="Auf Englisch schreiben …"><button id="typeCheck" class="secondary">Prüfen</button></div><div class="questActions"><button id="typeHint">💡 Hinweis</button><button id="typeAudio">🔊 Satz hören</button></div>`;
    $('typeCheck').onclick=()=>finish(clean($('typed').value)===clean(e.answerText),$('typed').value);$('typed').onkeydown=ev=>{if(ev.key==='Enter')$('typeCheck').click()};$('typeHint').onclick=()=>{$('fb').innerHTML=`<div class="hintbox">Der Satz beginnt mit: <b>${e.best.split(' ').slice(0,2).join(' ')}</b> …</div>`};$('typeAudio').onclick=()=>speak(e.best);
  };

  normaliseAiExercises=function(list,zone){
    return list.slice(0,6).map(e=>{
      const type=['meaning','listen','build','type','response'].includes(e.type)?e.type:'type';
      const base={type,skill:type==='listen'?'listening':type==='meaning'?'meaning':type==='build'?'build':'response',phraseId:e.phraseId&&phraseMap()[e.phraseId]?e.phraseId:null,prompt:String(e.prompt||''),context:String(e.context||''),best:String(e.best||''),answerText:String(e.answerText||e.answer||e.best||''),audio:String(e.audio||e.best||''),options:Array.isArray(e.options)?e.options.slice(0,4).map(String):[],pieces:Array.isArray(e.pieces)?e.pieces.slice(0,10).map(String):[],answerIndex:Number.isInteger(e.answerIndex)?e.answerIndex:0};
      if(type==='build'&&!base.pieces.length){const w=base.best.replace(/[.!?]/g,'').split(' ');base.pieces=shuffle(w.length>=3?[...w,extraPiece(w)]:w)}
      if(['meaning','listen'].includes(type)&&base.options.length<4){const p=random(zone.phrases);const pool=type==='meaning'?[base.answerText,...zone.phrases.map(x=>x.de)]:[base.answerText,...zone.phrases.map(x=>x.en)];base.options=shuffle([...new Set(pool)]).slice(0,4);while(base.options.length<4)base.options.push(type==='meaning'?p.de:p.en)}
      if(type==='response'&&base.options.length<4)return responseExercise(zone);
      return base;
    });
  };

  $('aiStart').onclick=async()=>{
    const btn=$('aiStart'),msg=$('aiMessage');btn.disabled=true;btn.textContent='✦ Mission wird gebaut…';msg.textContent='Die KI baut eine kurze Mission mit deutschen Anweisungen und englischen Sprachaufgaben.';
    try{
      const r=await fetch('/api/stormspeak-coach',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({theme:$('aiTheme').value.trim().slice(0,120),profile:aiProfile()})}),j=await r.json();if(!r.ok)throw new Error(j.message||j.error||'AI unavailable');
      const zone=currentZone();mission={source:'ai',title:j.title||'AI Drop',subtitle:'Neue adaptive Mission',zone,scene:j.scene||zone.scene,chunks:(j.chunks||[]).slice(0,3).map((c,i)=>({id:`ai-${i}`,en:String(c.en||''),de:String(c.de||'')})),exercises:normaliseAiExercises(j.exercises||[],zone)};
      if(mission.chunks.length<3)mission.chunks=chooseTrainingPhrases(zone).slice(0,3);if(mission.exercises.length<4)throw new Error('Too few exercises');openMission();
    }catch(e){msg.textContent='Die KI ist gerade nicht erreichbar. Die normalen Missionen funktionieren trotzdem vollständig.'}finally{btn.disabled=false;btn.textContent='✦ Neue AI Mission bauen'}
  };
});
