const STORMSPEAK_ZONES = [
  {
    id: 'spawn', icon: '🛰️', title: 'Spawn Island', subtitle: 'Meet your squad', unlockXp: 0,
    scene: 'You land on a bright island. A new teammate waves at you. First mission: say who you are and get moving.',
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
    id: 'loot', icon: '🎒', title: 'Loot Lab', subtitle: 'Say what you have and need', unlockXp: 90,
    scene: 'Your backpack is almost empty. Find useful gear and tell your squad what you have, what you need, and where things are.',
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
    id: 'squad', icon: '🎧', title: 'Squad Comms', subtitle: 'Fast useful team English', unlockXp: 210,
    scene: 'The storm is moving. Your squad must understand you quickly. Short English wins here.',
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
    id: 'build', icon: '🧱', title: 'Build Zone', subtitle: 'Move, place and describe', unlockXp: 360,
    scene: 'You enter a blocky build zone. Put things in the right place and describe what everyone is doing.',
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
    id: 'realworld', icon: '🏫', title: 'Real World Base', subtitle: 'School and everyday English', unlockXp: 540,
    scene: 'Game English is useful. Real-life English is the next upgrade: school, home, hobbies and simple routines.',
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
    id: 'story', icon: '🏆', title: 'Victory Stories', subtitle: 'Tell what happened', unlockXp: 780,
    scene: 'Final zone: tell a tiny story about yesterday. No grammar lecture — just useful story chunks that repeat until they feel normal.',
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

const STORMSPEAK_FEEDBACK = {
  good: ['Nice! Clean hit.', 'Yep — that works.', 'Strong move.', 'Perfect. Keep going.', 'Got it. +XP'],
  retry: ['Almost. Use the hint and try once more.', 'Not yet — one small fix.', 'Close! Look at the sentence chunk.', 'Good attempt. Let’s rebuild it.']
};
