const STORMSPEAK_CURRICULUM = [
  {
    id:'school', icon:'🎒', title:'Schule', subtitle:'Im Unterricht wirklich klarkommen',
    scene:'Du bist in der Schule und brauchst kurze Sätze, die dir im echten Unterricht helfen.',
    goals:[
      {id:'school-page', en:'What page are we on?', de:'Auf welcher Seite sind wir?', pattern:'What ... are we on?'},
      {id:'school-understand', en:"I don't understand.", de:'Ich verstehe das nicht.', pattern:"I don't ..."},
      {id:'school-help', en:'Can you help me, please?', de:'Kannst du mir bitte helfen?', pattern:'Can you ...?'},
      {id:'school-homework', en:'I forgot my homework.', de:'Ich habe meine Hausaufgaben vergessen.', pattern:'I forgot ...'}
    ]
  },
  {
    id:'home', icon:'🏠', title:'Zuhause', subtitle:'Ganz normale Sätze für daheim',
    scene:'Zuhause geht es um Essen, Sachen finden, kleine Wünsche und Alltag.',
    goals:[
      {id:'home-hungry', en:"I'm hungry.", de:'Ich habe Hunger.', pattern:"I'm ..."},
      {id:'home-charger', en:'Where is my charger?', de:'Wo ist mein Ladegerät?', pattern:'Where is ...?'},
      {id:'home-tv', en:'Can I watch TV?', de:'Darf ich fernsehen?', pattern:'Can I ...?'},
      {id:'home-later', en:"I'll do it later.", de:'Ich mache es später.', pattern:"I'll ... later"}
    ]
  },
  {
    id:'friends', icon:'👥', title:'Freunde', subtitle:'Reden, fragen, verabreden',
    scene:'Mit Freunden brauchst du kurze Fragen, Antworten und spontane Reaktionen.',
    goals:[
      {id:'friends-play', en:'Do you want to play?', de:'Willst du spielen?', pattern:'Do you want to ...?'},
      {id:'friends-doing', en:'What are you doing?', de:'Was machst du gerade?', pattern:'What are you ...?'},
      {id:'friends-funny', en:"That's funny!", de:'Das ist lustig!', pattern:"That's ..."},
      {id:'friends-tomorrow', en:'See you tomorrow.', de:'Bis morgen.', pattern:'See you ...'}
    ]
  },
  {
    id:'food', icon:'🍕', title:'Essen & Einkaufen', subtitle:'Bestellen, fragen, bezahlen',
    scene:'Im Café, Laden oder Urlaub helfen dir einfache höfliche Sätze sofort weiter.',
    goals:[
      {id:'food-have', en:'Can I have a water, please?', de:'Kann ich bitte ein Wasser haben?', pattern:'Can I have ...?'},
      {id:'food-howmuch', en:'How much is it?', de:'Wie viel kostet das?', pattern:'How much ...?'},
      {id:'food-like', en:"I'd like a pizza, please.", de:'Ich hätte gern eine Pizza, bitte.', pattern:"I'd like ..."},
      {id:'food-have-you', en:'Do you have sandwiches?', de:'Haben Sie Sandwiches?', pattern:'Do you have ...?'}
    ]
  },
  {
    id:'sport', icon:'⚽', title:'Sport & Hobbys', subtitle:'Was du gern machst',
    scene:'Hier redest du über Fußball, Hobbys, Training und was dir Spaß macht.',
    goals:[
      {id:'sport-football', en:'I play football.', de:'Ich spiele Fußball.', pattern:'I play ...'},
      {id:'sport-like', en:'I like drawing.', de:'Ich zeichne gern.', pattern:'I like ...'},
      {id:'sport-practice', en:"Let's practice.", de:'Lass uns üben.', pattern:"Let's ..."},
      {id:'sport-goodat', en:"I'm good at this.", de:'Ich bin darin gut.', pattern:"I'm good at ..."}
    ]
  },
  {
    id:'routine', icon:'⏰', title:'Zeit & Alltag', subtitle:'Tagesablauf und Uhrzeit',
    scene:'Morgens, Schule, Nachmittage und Termine: Hier trainierst du deinen Alltag.',
    goals:[
      {id:'routine-time', en:'What time is it?', de:'Wie spät ist es?', pattern:'What time ...?'},
      {id:'routine-seven', en:'I get up at seven.', de:'Ich stehe um sieben auf.', pattern:'I ... at ...'},
      {id:'routine-school', en:'School starts at eight.', de:'Die Schule beginnt um acht.', pattern:'... starts at ...'},
      {id:'routine-after', en:'After school, I go home.', de:'Nach der Schule gehe ich nach Hause.', pattern:'After ... I ...'}
    ]
  },
  {
    id:'feelings', icon:'💬', title:'Gefühle & Bedürfnisse', subtitle:'Sagen, was gerade los ist',
    scene:'Du sagst klar, wie es dir geht und was du gerade brauchst.',
    goals:[
      {id:'feelings-tired', en:"I'm tired.", de:'Ich bin müde.', pattern:"I'm ..."},
      {id:'feelings-thirsty', en:"I'm thirsty.", de:'Ich habe Durst.', pattern:"I'm ..."},
      {id:'feelings-sick', en:'I feel sick.', de:'Mir ist schlecht.', pattern:'I feel ...'},
      {id:'feelings-break', en:'I need a break.', de:'Ich brauche eine Pause.', pattern:'I need ...'}
    ]
  },
  {
    id:'plans', icon:'📅', title:'Pläne & Einladungen', subtitle:'Treffen und spontan planen',
    scene:'Du willst dich verabreden, zusagen, absagen oder einen anderen Tag vorschlagen.',
    goals:[
      {id:'plans-free', en:'Are you free today?', de:'Hast du heute Zeit?', pattern:'Are you free ...?'},
      {id:'plans-meet', en:"Let's meet at five.", de:'Treffen wir uns um fünf.', pattern:"Let's meet at ..."},
      {id:'plans-cant', en:"I can't today.", de:'Ich kann heute nicht.', pattern:"I can't ..."},
      {id:'plans-tomorrow', en:'Maybe tomorrow.', de:'Vielleicht morgen.', pattern:'Maybe ...'}
    ]
  },
  {
    id:'travel', icon:'🚌', title:'Unterwegs & Stadt', subtitle:'Orientierung und Verkehr',
    scene:'Bus, Stadt, Urlaub: Du fragst nach dem Weg und verstehst einfache Richtungen.',
    goals:[
      {id:'travel-bus', en:'Where is the bus stop?', de:'Wo ist die Bushaltestelle?', pattern:'Where is ...?'},
      {id:'travel-get', en:'How do I get to the station?', de:'Wie komme ich zum Bahnhof?', pattern:'How do I get to ...?'},
      {id:'travel-left', en:'Turn left here.', de:'Bieg hier links ab.', pattern:'Turn ...'},
      {id:'travel-far', en:'Is it far?', de:'Ist es weit?', pattern:'Is it ...?'}
    ]
  },
  {
    id:'family', icon:'👨‍👩‍👦', title:'Familie', subtitle:'Über dich und deine Familie reden',
    scene:'Du stellst deine Familie vor und erzählst einfache Dinge über euch.',
    goals:[
      {id:'family-mum', en:'This is my mum.', de:'Das ist meine Mutter.', pattern:'This is my ...'},
      {id:'family-brother', en:'I have one brother.', de:'Ich habe einen Bruder.', pattern:'I have ...'},
      {id:'family-live', en:'We live in Germany.', de:'Wir leben in Deutschland.', pattern:'We live in ...'},
      {id:'family-work', en:'My dad is at work.', de:'Mein Vater ist bei der Arbeit.', pattern:'My ... is ...'}
    ]
  },
  {
    id:'gaming', icon:'🎮', title:'Gaming', subtitle:'Kurzes Englisch im Spiel',
    scene:'Gaming bleibt drin — aber als ein Thema unter vielen, nicht als ganzer Lehrplan.',
    goals:[
      {id:'gaming-wait', en:'Wait for me!', de:'Warte auf mich!', pattern:'Wait for ...'},
      {id:'gaming-help', en:'I need help.', de:'Ich brauche Hilfe.', pattern:'I need ...'},
      {id:'gaming-where', en:'Where are you?', de:'Wo bist du?', pattern:'Where are you?'},
      {id:'gaming-go', en:"Let's go!", de:'Los geht’s!', pattern:"Let's ..."}
    ]
  },
  {
    id:'stories', icon:'📖', title:'Erzählen', subtitle:'Gestern und kleine Geschichten',
    scene:'Du erzählst kurz, was passiert ist — ohne Grammatik-Vortrag.',
    goals:[
      {id:'stories-yesterday', en:'Yesterday I played with my friends.', de:'Gestern habe ich mit meinen Freunden gespielt.', pattern:'Yesterday I ...'},
      {id:'stories-then', en:'Then we went home.', de:'Dann sind wir nach Hause gegangen.', pattern:'Then we ...'},
      {id:'stories-fun', en:'It was fun.', de:'Es hat Spaß gemacht.', pattern:'It was ...'},
      {id:'stories-happened', en:'What happened?', de:'Was ist passiert?', pattern:'What happened?'}
    ]
  }
];
const STORMSPEAK_FEEDBACK={good:['Richtig!','Stark — weiter.','Genau so.','Sauber gelöst.','Treffer.'],retry:['Fast. Schau noch einmal hin.','Noch nicht ganz.','Guter Versuch.','Knapp daneben.']};
window.STORMSPEAK_CURRICULUM=STORMSPEAK_CURRICULUM;window.STORMSPEAK_FEEDBACK=STORMSPEAK_FEEDBACK;