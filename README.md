# StormSpeak · English Battle Quest

StormSpeak is an adaptive English trainer for a grade-5 beginner (A1). It learns through short contextual missions instead of isolated vocabulary drilling.

## Learning model

- Context first: every mission begins with a tiny scene.
- Phrase chunks: useful language such as `I need …`, `Can you …?`, `I am …-ing`.
- Retrieval practice: meaning, listening, phrase building, typed production and quick responses.
- Gentle adaptation: weak phrases repeat more often; strong performance raises difficulty slowly.
- One small new step at a time.
- Browser speech synthesis for listening.
- Progress stays local in the browser (`stormSpeakV1`). Existing XP/streak from the former English Quest state are migrated on first launch.

## AI Drop

`/api/coach.js` creates fresh missions with Vercel AI Gateway. The server expects:

`AI_GATEWAY_API_KEY`

The current model is `openai/gpt-5.4-mini`. If the key is missing or AI is unavailable, all built-in missions still work offline.

The AI prompt is intentionally child-safe: it does not ask for personal data, avoids open-ended social chat and uses original battle-royale / block-world contexts without copying protected game assets.

## Vercel deployment

Create a second Vercel project from this repository with the repository root as the Root Directory. Keep the existing `english-shift` Vercel project pointed at the `english-shift` subdirectory.

Add `AI_GATEWAY_API_KEY` to the new StormSpeak project environment and deploy.
