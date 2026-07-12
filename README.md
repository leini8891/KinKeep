# KinKeep

KinKeep is a family health companion for older adults and the relatives who care about them from a distance.

KinKeep now ships as one product with two connected surfaces:

- `/` — the parent-facing mobile experience, opening directly into a bilingual conversation;
- `/family` — a responsive family experience that presents a focused mobile view on phones and a broader care workspace on desktop.

The parent experience includes:

- an Apple Watch health summary embedded in the chat;
- medication, meal, and activity reminders;
- multi-step wellness check-ins and help escalation;
- real meal-photo upload with server-side OpenAI vision analysis, calorie range, macro estimates, visible uncertainty, and a practical nutrition suggestion;
- typed messages and browser speech recognition when supported;
- English and Simplified Chinese.

The family experience includes:

- family profiles for Mum, Dad, and Elena with relationship-aware sharing;
- a direct answer to “Is Mum okay?” on mobile;
- multi-signal personal-baseline evidence across sleep, activity, resting heart rate, routine, and replies;
- immediate alerts and a human approval gate for high-impact actions;
- desktop family overview, trends, care schedule, assignments, audit history, and permissions.

The current risk and caregiver-escalation responses are deterministic demo fixtures. Meal analysis uses the OpenAI Responses API when `OPENAI_API_KEY` is configured. All guidance is intentionally non-diagnostic and does not contact real caregivers or emergency services.

The current product scope, sovereignty model, demo scenarios, and OPC roadmap are documented in [docs/PRD_KinKeep_OPC.md](docs/PRD_KinKeep_OPC.md).

The event build timeline and validation evidence are recorded in [docs/BUILD_LOG.md](docs/BUILD_LOG.md).

## Local development

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Use any available local port. The parent and family experiences run from the same server and deployment.

Create an ignored `.env.local` before testing meal analysis:

```text
OPENAI_API_KEY=your-key
# Optional override; defaults to gpt-5.6-terra
OPENAI_MODEL=gpt-5.6-terra
```

## Validation

```bash
npm run lint
npm test
```

All current health signals, calls, and care actions are deterministic product-demo fixtures. No real caregiver, clinic, or emergency service is contacted.
