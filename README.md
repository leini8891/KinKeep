# KinKeep

KinKeep is a family health companion for older adults and the relatives who care about them from a distance.

This first implementation is the parent-facing mobile experience. It opens directly into a bilingual conversation and includes:

- an Apple Watch health summary embedded in the chat;
- medication, meal, and activity reminders;
- multi-step wellness check-ins and help escalation;
- real local meal-photo selection with a demo nutrition response;
- typed messages and browser speech recognition when supported;
- English and Simplified Chinese.

The current risk and nutrition responses are deterministic demo fixtures. They are intentionally non-diagnostic and do not contact real caregivers or emergency services.

The current product scope, sovereignty model, demo scenarios, and OPC roadmap are documented in [docs/PRD_KinKeep_OPC.md](docs/PRD_KinKeep_OPC.md).

## Local development

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Validation

```bash
npm run lint
npm test
```

## Next product surface

The next planned surface is the family experience: mobile notifications plus a desktop care overview for shared health trends, alerts, and follow-up actions.
