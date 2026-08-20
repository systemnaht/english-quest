# Ciao English!

Ein mobiler 10-Minuten-Alltag-Englischtrainer für absolute Anfängerinnen.

## Enthalten

- 30 Tageslektionen von A0 bis A2
- deutsche Erklärungen und Aussprachehilfen
- englische Sprachausgabe per Browser Speech Synthesis
- optionale Spracheingabe per Browser Speech Recognition
- adaptives Wiederholen mit lokalen Fälligkeitsintervallen
- lokales Profil, Fortschritt, Streak und XP
- italienisch inspirierte Lernreise: Casa → Bar → Mercato → Centro → Ristorante → Hotel → Stazione → Aeroporto → Mare
- AI Conversation Mode für Café, Shopping, Hotel und Smalltalk
- lokaler Dialog-Fallback, falls AI Gateway nicht verfügbar ist

## Vercel

Live: https://ciao-english.vercel.app

Die AI-Route liegt unter `api/chat.js`. Für echte Modellantworten braucht das Vercel-Projekt eine der folgenden Authentifizierungen:

- `AI_GATEWAY_API_KEY`, oder
- eine verfügbare `VERCEL_OIDC_TOKEN`-Authentifizierung für AI Gateway.

Standardmodell: `openai/gpt-5.6-sol`.

Der API-Schlüssel wird ausschließlich serverseitig verwendet und nie an den Browser ausgeliefert.
