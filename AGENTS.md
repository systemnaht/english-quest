# English Quest – Projektregeln

## Ziel und Zielgruppe

- English Quest ist ein Englischtrainer für ein Kind auf Anfänger-Niveau.
- Übungen sollen kurz, verständlich, motivierend und spielerisch bleiben.
- Der Schwerpunkt liegt auf Hörverständnis und Aussprache.
- Typische deutsche Aussprachefehler sollen gezielt und freundlich trainiert werden.

## Lerninhalte

- Jede Vokabel benötigt eine englische, deutsche und russische Fassung.
- Jeder englische Beispielsatz benötigt eine deutsche und eine russische Satzübersetzung.
- Beispielsätze müssen einfach, kurz und altersgerecht sein.
- Der Themenmix umfasst Schulenglisch, Alltag, Gaming sowie Creator-/Challenge-Inhalte.
- Neue Schulvokabeln sollen bevorzugt in `data.js` ergänzt werden.
- Bestehende Inhalte dürfen nicht ohne sachlichen Grund gelöscht werden.
- Neue Wörter sollen, wenn sinnvoll, auch in Daily Quest, Quiz, Satzbau und Boss Battle einfließen.

## Gestaltung und Technik

- Das bestehende Battle-Royale-inspirierte Design muss erhalten bleiben.
- Inhalte und Konfiguration gehören nach Möglichkeit in `data.js`; `index.html` enthält Darstellung und Anwendungslogik.
- Änderungen dürfen bestehende Übungen, lokale Fortschrittsdaten und die Browser-Sprachausgabe nicht beeinträchtigen.
- Aussprache-Erklärungen in Listen & Repeat werden nur auf Russisch angezeigt.
- Russische Aussprache-Erklärungen müssen durch Anklicken mit russischer Sprachausgabe vorgelesen werden können.
- Russische Aussprache-Erklärungen müssen für TTS optimiert sein.
- In `hint_ru` dürfen Aussprachebeispiele niemals in Anführungszeichen, Guillemets oder Klammern stehen. TTS-relevante Laute müssen als normaler Text ohne Einrahmung geschrieben werden.
- Beim Klick auf „Im Satz hören“ wird der englische Satz gesprochen und gleichzeitig mit deutscher und russischer Übersetzung eingeblendet.
- Beim Wortwechsel wird der eingeblendete Satz wieder verborgen.
