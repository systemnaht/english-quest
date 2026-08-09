// English Quest content file.
// Neue Schulvokabeln können später hier ergänzt werden, ohne das ganze Portal umzubauen.

// Reihenfolge und Beschriftung der Wortkategorien für die Oberfläche.
// Neue Kategorien hier eintragen und anschließend im VOCAB_BANK mit derselben ID anlegen.
const VOCAB_CATEGORIES = [
  {id:"gaming", label:"Gaming"},
  {id:"everyday", label:"Alltag"},
  {id:"school", label:"Schule"},
  {id:"creator", label:"Creator"}
];

const VOCAB_BANK = {
  gaming: [
    {en:"shield",de:"Schild",ru:"щит",icon:"🛡️",s:"I need a shield.",s_de:"Ich brauche einen Schild.",s_ru:"Мне нужен щит."},
    {en:"enemy",de:"Gegner",ru:"враг / противник",icon:"👾",s:"The enemy is behind you.",s_de:"Der Gegner ist hinter dir.",s_ru:"Враг позади тебя."},
    {en:"build",de:"bauen",ru:"строить",icon:"🧱",s:"Let's build a tower.",s_de:"Lass uns einen Turm bauen.",s_ru:"Давай построим башню."},
    {en:"sword",de:"Schwert",ru:"меч",icon:"⚔️",s:"I found a sword.",s_de:"Ich habe ein Schwert gefunden.",s_ru:"Я нашёл меч."},
    {en:"chest",de:"Truhe",ru:"сундук",icon:"📦",s:"Open the chest.",s_de:"Öffne die Truhe.",s_ru:"Открой сундук."},
    {en:"cave",de:"Höhle",ru:"пещера",icon:"🕳️",s:"We are inside a cave.",s_de:"Wir sind in einer Höhle.",s_ru:"Мы внутри пещеры."},
    {en:"torch",de:"Fackel",ru:"факел",icon:"🔥",s:"Take a torch.",s_de:"Nimm eine Fackel.",s_ru:"Возьми факел."},
    {en:"pickaxe",de:"Spitzhacke",ru:"кирка",icon:"⛏️",s:"Use the pickaxe.",s_de:"Benutze die Spitzhacke.",s_ru:"Используй кирку."},
    {en:"jump",de:"springen",ru:"прыгать",icon:"⬆️",s:"Jump over the wall.",s_de:"Spring über die Mauer.",s_ru:"Перепрыгни через стену."},
    {en:"teammate",de:"Teamkollege",ru:"товарищ по команде",icon:"🤝",s:"My teammate needs help.",s_de:"Mein Teamkollege braucht Hilfe.",s_ru:"Моему товарищу по команде нужна помощь."}
  ],
  everyday: [
    {en:"hungry",de:"hungrig",ru:"голодный",icon:"🍔",s:"I am hungry.",s_de:"Ich bin hungrig.",s_ru:"Я голоден."},
    {en:"thirsty",de:"durstig",ru:"испытывающий жажду",icon:"🥤",s:"I am thirsty.",s_de:"Ich bin durstig.",s_ru:"Я хочу пить."},
    {en:"breakfast",de:"Frühstück",ru:"завтрак",icon:"🥣",s:"Breakfast is ready.",s_de:"Das Frühstück ist fertig.",s_ru:"Завтрак готов."},
    {en:"jacket",de:"Jacke",ru:"куртка",icon:"🧥",s:"Take your jacket.",s_de:"Nimm deine Jacke.",s_ru:"Возьми свою куртку."},
    {en:"water",de:"Wasser",ru:"вода",icon:"💧",s:"Can I have some water?",s_de:"Kann ich etwas Wasser haben?",s_ru:"Можно мне воды?"},
    {en:"friend",de:"Freund",ru:"друг",icon:"🙂",s:"He is my friend.",s_de:"Er ist mein Freund.",s_ru:"Он мой друг."}
  ],
  school: [
    {en:"teacher",de:"Lehrer/in",ru:"учитель",icon:"👩‍🏫",s:"The teacher is here.",s_de:"Die Lehrerin ist hier.",s_ru:"Учитель здесь."},
    {en:"homework",de:"Hausaufgaben",ru:"домашнее задание",icon:"📚",s:"I finished my homework.",s_de:"Ich habe meine Hausaufgaben fertig.",s_ru:"Я закончил домашнее задание."},
    {en:"question",de:"Frage",ru:"вопрос",icon:"❓",s:"I have a question.",s_de:"Ich habe eine Frage.",s_ru:"У меня есть вопрос."},
    {en:"answer",de:"Antwort",ru:"ответ",icon:"✅",s:"I know the answer.",s_de:"Ich kenne die Antwort.",s_ru:"Я знаю ответ."},
    {en:"school",de:"Schule",ru:"школа",icon:"🏫",s:"I go to school.",s_de:"Ich gehe zur Schule.",s_ru:"Я хожу в школу."},
    {en:"read",de:"lesen",ru:"читать",icon:"📖",s:"Read the sentence.",s_de:"Lies den Satz.",s_ru:"Прочитай предложение."},
    {en:"favorite",de:"Lieblings- / am liebsten",ru:"любимый",icon:"⭐",s:"Blue is my favorite color.",s_de:"Blau ist meine Lieblingsfarbe.",s_ru:"Синий — мой любимый цвет."},
    {en:"their",de:"ihr / ihre",ru:"их",icon:"👫",s:"Their dog is happy.",s_de:"Ihr Hund ist glücklich.",s_ru:"Их собака счастлива."},
    {en:"together",de:"zusammen",ru:"вместе",icon:"🤝",s:"We play together.",s_de:"Wir spielen zusammen.",s_ru:"Мы играем вместе."},
    {en:"hair",de:"Haare",ru:"волосы",icon:"💇",s:"Her hair is long.",s_de:"Ihre Haare sind lang.",s_ru:"У неё длинные волосы."},
    {en:"towels",de:"Handtücher",ru:"полотенца",icon:"🧻",s:"The towels are clean.",s_de:"Die Handtücher sind sauber.",s_ru:"Полотенца чистые."},
    {en:"always",de:"immer",ru:"всегда",icon:"🔁",s:"I always smile.",s_de:"Ich lächle immer.",s_ru:"Я всегда улыбаюсь."},
    {en:"new",de:"neu",ru:"новый",icon:"✨",s:"My bag is new.",s_de:"Meine Tasche ist neu.",s_ru:"Моя сумка новая."},
    {en:"looking for",de:"suchen nach",ru:"искать",icon:"🔎",s:"I am looking for my book.",s_de:"Ich suche mein Buch.",s_ru:"Я ищу свою книгу."},
    {en:"smart",de:"schlau / klug",ru:"умный",icon:"🧠",s:"She is smart.",s_de:"Sie ist schlau.",s_ru:"Она умная."},
    {en:"with",de:"mit",ru:"с",icon:"🫶",s:"Come with me.",s_de:"Komm mit mir.",s_ru:"Идём со мной."},
    {en:"suddenly",de:"plötzlich",ru:"вдруг",icon:"⚡",s:"Suddenly, it is dark.",s_de:"Plötzlich ist es dunkel.",s_ru:"Вдруг стало темно."},
    {en:"shoes",de:"Schuhe",ru:"обувь",icon:"👟",s:"My shoes are blue.",s_de:"Meine Schuhe sind blau.",s_ru:"Моя обувь синяя."},
    {en:"castles",de:"Burgen / Schlösser",ru:"замки",icon:"🏰",s:"The castles are big.",s_de:"Die Burgen sind groß.",s_ru:"Замки большие."},
    {en:"colorful",de:"bunt / farbenfroh",ru:"разноцветный / красочный",icon:"🌈",s:"The picture is colorful.",s_de:"Das Bild ist bunt.",s_ru:"Картина красочная."},
    {en:"touches",de:"berührt",ru:"касается",icon:"👆",s:"She touches the ball.",s_de:"Sie berührt den Ball.",s_ru:"Она касается мяча."}
  ],
  creator: [
    {en:"challenge",de:"Challenge / Aufgabe",ru:"челлендж / задание",icon:"🏆",s:"This challenge is difficult.",s_de:"Diese Challenge ist schwierig.",s_ru:"Этот челлендж сложный."},
    {en:"video",de:"Video",ru:"видео",icon:"🎥",s:"This video is funny.",s_de:"Dieses Video ist lustig.",s_ru:"Это видео смешное."},
    {en:"crazy",de:"verrückt",ru:"сумасшедший",icon:"🤯",s:"That was crazy!",s_de:"Das war verrückt!",s_ru:"Это было безумно!"},
    {en:"winner",de:"Gewinner",ru:"победитель",icon:"🥇",s:"You are the winner.",s_de:"Du bist der Gewinner.",s_ru:"Ты победитель."},
    {en:"ready",de:"bereit",ru:"готов",icon:"⚡",s:"Are you ready?",s_de:"Bist du bereit?",s_ru:"Ты готов?"},
    {en:"watch",de:"anschauen",ru:"смотреть",icon:"👀",s:"Watch this!",s_de:"Schau dir das an!",s_ru:"Посмотри на это!"}
  ]
};

const PRONUNCIATION_TRAPS = [
  {en:"three",de:"drei",ru:"три",icon:"3️⃣",hint_ru:"Слегка высунь кончик языка между зубами. Не говори «сри».",s:"I have three blocks.",s_de:"Ich habe drei Blöcke.",s_ru:"У меня есть три блока."},
  {en:"this",de:"dies / das",ru:"это / этот",icon:"👉",hint_ru:"Слегка высунь язык между зубами и добавь голос. Не говори «дис».",s:"This is my house.",s_de:"Das ist mein Haus.",s_ru:"Это мой дом."},
  {en:"world",de:"Welt",ru:"мир",icon:"🌍",hint_ru:"Начни с округлённых губ, затем быстро соедини звуки «р» и «л».",s:"This is my world.",s_de:"Das ist meine Welt.",s_ru:"Это мой мир."},
  {en:"water",de:"Wasser",ru:"вода",icon:"💧",hint_ru:"Начни с округлённых губ. Не произноси начало как немецкое w.",s:"I need water.",s_de:"Ich brauche Wasser.",s_ru:"Мне нужна вода."},
  {en:"school",de:"Schule",ru:"школа",icon:"🏫",hint_ru:"В начале говори «ск», а не немецкое «ш».",s:"I go to school.",s_de:"Ich gehe zur Schule.",s_ru:"Я хожу в школу."},
  {en:"game",de:"Spiel",ru:"игра",icon:"🎮",hint_ru:"Буква a звучит как «эй», почти как в слове name.",s:"This game is fun.",s_de:"Dieses Spiel macht Spaß.",s_ru:"Эта игра весёлая."},
  {en:"build",de:"bauen",ru:"строить",icon:"🧱",hint_ru:"Гласный звук короткий, похож на «и». Не произноси u как немецкое «у».",s:"Let's build a house.",s_de:"Lass uns ein Haus bauen.",s_ru:"Давай построим дом."},
  {en:"sword",de:"Schwert",ru:"меч",icon:"⚔️",hint_ru:"Буква w здесь молчит. Начинай слово сразу со звука «с».",s:"I have a sword.",s_de:"Ich habe ein Schwert.",s_ru:"У меня есть меч."},
  {en:"favorite",de:"Lieblings- / am liebsten",ru:"любимый",icon:"⭐",hint_ru:"Первая a звучит как «эй». Произнеси слово тремя короткими частями: «фэй-вэ-рит».",s:"Blue is my favorite color.",s_de:"Blau ist meine Lieblingsfarbe.",s_ru:"Синий — мой любимый цвет."},
  {en:"their",de:"ihr / ihre",ru:"их",icon:"👫",hint_ru:"Слегка высунь язык между зубами и добавь голос. Не говори немецкое «дэр».",s:"Their dog is happy.",s_de:"Ihr Hund ist glücklich.",s_ru:"Их собака счастлива."},
  {en:"together",de:"zusammen",ru:"вместе",icon:"🤝",hint_ru:"Для th слегка высунь язык между зубами. Не заменяй этот звук на «т» или «д».",s:"We play together.",s_de:"Wir spielen zusammen.",s_ru:"Мы играем вместе."},
  {en:"towels",de:"Handtücher",ru:"полотенца",icon:"🧻",hint_ru:"В середине плавно скажи «ау», а конец произнеси легко и быстро.",s:"The towels are clean.",s_de:"Die Handtücher sind sauber.",s_ru:"Полотенца чистые."},
  {en:"with",de:"mit",ru:"с",icon:"🫶",hint_ru:"В конце слегка высунь язык между зубами. Не добавляй немецкий звук «т».",s:"Come with me.",s_de:"Komm mit mir.",s_ru:"Идём со мной."},
  {en:"shoes",de:"Schuhe",ru:"обувь",icon:"👟",hint_ru:"Сочетание oo произносится как долгое «у». В конце s звучит звонко, как «з».",s:"My shoes are blue.",s_de:"Meine Schuhe sind blau.",s_ru:"Моя обувь синяя."},
  {en:"castles",de:"Burgen / Schlösser",ru:"замки",icon:"🏰",hint_ru:"Буква t не произносится. Говори примерно «каслз», а не «кастэлс».",s:"The castles are big.",s_de:"Die Burgen sind groß.",s_ru:"Замки большие."},
  {en:"touches",de:"berührt",ru:"касается",icon:"👆",hint_ru:"Буква u звучит коротко, как «а». Окончание произноси как «из»: «тач-из».",s:"She touches the ball.",s_de:"Sie berührt den Ball.",s_ru:"Она касается мяча."}
];

const SENTENCE_BUILDS = [
  {de:"Ich brauche einen Schild.",ru:"Мне нужен щит.",en:"I need a shield.",help:"Starte mit „I“. Danach kommt das Verb „need“."},
  {de:"Der Gegner ist hinter dir.",ru:"Враг позади тебя.",en:"The enemy is behind you.",help:"Starte mit „The enemy“. Danach brauchst Du „is“."},
  {de:"Wir bauen ein Haus.",ru:"Мы строим дом.",en:"We build a house.",help:"Starte mit „We“. Das Verb steht direkt danach."},
  {de:"Ich bin hungrig.",ru:"Я голоден.",en:"I am hungry.",help:"Bei „I“ benutzt Du hier „am“."},
  {de:"Bist du bereit?",ru:"Ты готов?",en:"Are you ready?",help:"Bei einer Frage steht „Are“ ganz vorne."},
  {de:"Schau dir das an!",ru:"Посмотри на это!",en:"Watch this!",help:"Der Satz beginnt direkt mit dem Verb „Watch“."},
  {de:"Ihre Schuhe sind neu.",ru:"Их обувь новая.",en:"Their shoes are new.",help:"Starte mit „Their shoes“. Danach kommt „are“."},
  {de:"Wir spielen immer zusammen.",ru:"Мы всегда играем вместе.",en:"We always play together.",help:"Starte mit „We“. „Always“ steht vor „play“."},
  {de:"Ich suche meine Handtücher.",ru:"Я ищу свои полотенца.",en:"I am looking for my towels.",help:"„Looking for“ bleibt zusammen. Davor stehen „I am“."},
  {de:"Die Burgen sind bunt.",ru:"Замки разноцветные.",en:"The castles are colorful.",help:"Starte mit „The castles“. Danach kommt „are“."},
  {de:"Sie ist schlau.",ru:"Она умная.",en:"She is smart.",help:"Starte mit „She“. Danach kommt „is“."}
];

const CREATOR_CHALLENGES = [
  {mode:"Speed Challenge",prompt:"Your friend says: “Are you ready?”",audio:"Are you ready?",correct:"Yes, I am!",options:["Yes, I am!","I am a sword.","Blue is hungry.","Yesterday pizza."]},
  {mode:"Creator Challenge",prompt:"You hear: “Watch this!” What does it mean?",audio:"Watch this!",correct:"Schau dir das an! / Посмотри на это!",options:["Schau dir das an! / Посмотри на это!","Mach die Tür zu!","Ich habe Hunger.","Wo ist die Schule?"]},
  {mode:"Twin Challenge",prompt:"Your teammate says: “Do it again!”",audio:"Do it again!",correct:"Noch einmal machen / Сделать ещё раз",options:["Noch einmal machen / Сделать ещё раз","Nach Hause gehen","Etwas essen","Still stehen"]},
  {mode:"Speed Challenge",prompt:"You hear: “That was crazy!”",audio:"That was crazy!",correct:"Das war verrückt! / Это было безумно!",options:["Das war verrückt! / Это было безумно!","Das war langsam.","Ich bin müde.","Das ist mein Lehrer."]}
];
