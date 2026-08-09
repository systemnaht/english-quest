// English Quest content file.
// Neue Schulvokabeln können später hier ergänzt werden, ohne das ganze Portal umzubauen.

const VOCAB_BANK = {
  gaming: [
    {en:"shield",de:"Schild",ru:"щит",icon:"🛡️",s:"I need a shield."},
    {en:"enemy",de:"Gegner",ru:"враг / противник",icon:"👾",s:"The enemy is behind you."},
    {en:"build",de:"bauen",ru:"строить",icon:"🧱",s:"Let's build a tower."},
    {en:"sword",de:"Schwert",ru:"меч",icon:"⚔️",s:"I found a sword."},
    {en:"chest",de:"Truhe",ru:"сундук",icon:"📦",s:"Open the chest."},
    {en:"cave",de:"Höhle",ru:"пещера",icon:"🕳️",s:"We are inside a cave."},
    {en:"torch",de:"Fackel",ru:"факел",icon:"🔥",s:"Take a torch."},
    {en:"pickaxe",de:"Spitzhacke",ru:"кирка",icon:"⛏️",s:"Use the pickaxe."},
    {en:"jump",de:"springen",ru:"прыгать",icon:"⬆️",s:"Jump over the wall."},
    {en:"teammate",de:"Teamkollege",ru:"товарищ по команде",icon:"🤝",s:"My teammate needs help."}
  ],
  everyday: [
    {en:"hungry",de:"hungrig",ru:"голодный",icon:"🍔",s:"I am hungry."},
    {en:"thirsty",de:"durstig",ru:"испытывающий жажду",icon:"🥤",s:"I am thirsty."},
    {en:"breakfast",de:"Frühstück",ru:"завтрак",icon:"🥣",s:"Breakfast is ready."},
    {en:"jacket",de:"Jacke",ru:"куртка",icon:"🧥",s:"Take your jacket."},
    {en:"water",de:"Wasser",ru:"вода",icon:"💧",s:"Can I have some water?"},
    {en:"friend",de:"Freund",ru:"друг",icon:"🙂",s:"He is my friend."}
  ],
  school: [
    {en:"teacher",de:"Lehrer/in",ru:"учитель",icon:"👩‍🏫",s:"The teacher is here."},
    {en:"homework",de:"Hausaufgaben",ru:"домашнее задание",icon:"📚",s:"I finished my homework."},
    {en:"question",de:"Frage",ru:"вопрос",icon:"❓",s:"I have a question."},
    {en:"answer",de:"Antwort",ru:"ответ",icon:"✅",s:"I know the answer."},
    {en:"school",de:"Schule",ru:"школа",icon:"🏫",s:"I go to school."},
    {en:"read",de:"lesen",ru:"читать",icon:"📖",s:"Read the sentence."}
  ],
  creator: [
    {en:"challenge",de:"Challenge / Aufgabe",ru:"челлендж / задание",icon:"🏆",s:"This challenge is difficult."},
    {en:"video",de:"Video",ru:"видео",icon:"🎥",s:"This video is funny."},
    {en:"crazy",de:"verrückt",ru:"сумасшедший",icon:"🤯",s:"That was crazy!"},
    {en:"winner",de:"Gewinner",ru:"победитель",icon:"🥇",s:"You are the winner."},
    {en:"ready",de:"bereit",ru:"готов",icon:"⚡",s:"Are you ready?"},
    {en:"watch",de:"anschauen",ru:"смотреть",icon:"👀",s:"Watch this!"}
  ]
};

const PRONUNCIATION_TRAPS = [
  {en:"three",de:"drei",ru:"три",icon:"3️⃣",hint:"Zungenspitze leicht zwischen die Zähne. Nicht „sri“.",s:"I have three blocks."},
  {en:"this",de:"dies / das",ru:"это / этот",icon:"👉",hint:"Weiches th. Nicht deutsches „dis“.",s:"This is my house."},
  {en:"world",de:"Welt",ru:"мир",icon:"🌍",hint:"Nicht deutsch lesen. Englisches w, dann r/l eng verbinden.",s:"This is my world."},
  {en:"water",de:"Wasser",ru:"вода",icon:"💧",hint:"Englisches w: Lippen rund starten, nicht deutsches w.",s:"I need water."},
  {en:"school",de:"Schule",ru:"школа",icon:"🏫",hint:"Beginnt mit „sk“, nicht deutschem „sch“.",s:"I go to school."},
  {en:"game",de:"Spiel",ru:"игра",icon:"🎮",hint:"Das a klingt wie im englischen „name“.",s:"This game is fun."},
  {en:"build",de:"bauen",ru:"строить",icon:"🧱",hint:"Kurzes i. Das u wird nicht wie deutsches u gesprochen.",s:"Let's build a house."},
  {en:"sword",de:"Schwert",ru:"меч",icon:"⚔️",hint:"Das w wird nicht gesprochen.",s:"I have a sword."}
];

const SENTENCE_BUILDS = [
  {de:"Ich brauche einen Schild.",ru:"Мне нужен щит.",en:"I need a shield.",help:"Starte mit „I“. Danach kommt das Verb „need“."},
  {de:"Der Gegner ist hinter dir.",ru:"Враг позади тебя.",en:"The enemy is behind you.",help:"Starte mit „The enemy“. Danach brauchst Du „is“."},
  {de:"Wir bauen ein Haus.",ru:"Мы строим дом.",en:"We build a house.",help:"Starte mit „We“. Das Verb steht direkt danach."},
  {de:"Ich bin hungrig.",ru:"Я голоден.",en:"I am hungry.",help:"Bei „I“ benutzt Du hier „am“."},
  {de:"Bist du bereit?",ru:"Ты готов?",en:"Are you ready?",help:"Bei einer Frage steht „Are“ ganz vorne."},
  {de:"Schau dir das an!",ru:"Посмотри на это!",en:"Watch this!",help:"Der Satz beginnt direkt mit dem Verb „Watch“."}
];

const CREATOR_CHALLENGES = [
  {mode:"Speed Challenge",prompt:"Your friend says: “Are you ready?”",audio:"Are you ready?",correct:"Yes, I am!",options:["Yes, I am!","I am a sword.","Blue is hungry.","Yesterday pizza."]},
  {mode:"Creator Challenge",prompt:"You hear: “Watch this!” What does it mean?",audio:"Watch this!",correct:"Schau dir das an! / Посмотри на это!",options:["Schau dir das an! / Посмотри на это!","Mach die Tür zu!","Ich habe Hunger.","Wo ist die Schule?"]},
  {mode:"Twin Challenge",prompt:"Your teammate says: “Do it again!”",audio:"Do it again!",correct:"Noch einmal machen / Сделать ещё раз",options:["Noch einmal machen / Сделать ещё раз","Nach Hause gehen","Etwas essen","Still stehen"]},
  {mode:"Speed Challenge",prompt:"You hear: “That was crazy!”",audio:"That was crazy!",correct:"Das war verrückt! / Это было безумно!",options:["Das war verrückt! / Это было безумно!","Das war langsam.","Ich bin müde.","Das ist mein Lehrer."]}
];
