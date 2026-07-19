<div align="center">

# KinKeep

### A family health companion that notices meaningful changes, checks in with your parent, and tells you when you're needed.

_Agents own the execution. Families retain judgment and control._

<br/>

[![Live Demo](https://img.shields.io/badge/▶_Live_Demo-kinkeep--family--health-0F4C4C?style=for-the-badge)](https://kinkeep-family-health.leini9591.chatgpt.site/)

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare_Workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)

[![OpenAI Build Week](https://img.shields.io/badge/OpenAI_Build_Week-2026-111111?logo=openai&logoColor=white)](https://openai.devpost.com/)
[![Project origin](https://img.shields.io/badge/Origin-BUIDL__QUESTS_2026-E8A13D)](https://openarena.to/en/events/buidl-quests-2026)
[![Languages](https://img.shields.io/badge/Bilingual-English_·_简体中文-7FA98F)](#)
[![Non-diagnostic](https://img.shields.io/badge/⚕️-Non--diagnostic_·_synthetic_demo_data-64748B)](#)

</div>

> [!IMPORTANT]
> KinKeep is **not a medical diagnostic tool**. All health signals, calls, and care actions in this demo are deterministic synthetic fixtures. Care branching, escalation stages and approval gating are **auditable code — never model output**. No real caregiver, clinic, or emergency service is contacted.

---

## 🎯 The idea

Every family has a *kinkeeper* — the one who remembers the pills, makes the daily call, coordinates everything. Apple Health can already share Mum's heart rate with her. But **numbers are not care**: they don't ask how Mum's knee feels, don't notice that she slept two hours less *and* walked only 320 steps *and* skipped breakfast on the same morning, and don't tell a busy daughter whether *today* is a day that needs her.

KinKeep closes that loop:

```
Personal change detection        Conversational check-in       One decision for the family
multi-signal, vs HER own    →    in her language, she just  →  first round of care completed;
baseline — never one number      answers, never initiates      humans keep the judgment
```

The elder gets a companion that talks like a person. The family gets silence when all is well — and a completed first round of checks plus **one clear decision** when it is not.

## 🧭 Project evolution and OpenAI Build Week scope

KinKeep is an existing project that began at **BUIDL_QUESTS 2026** on July 12. OpenAI Build Week explicitly allows builders to extend an existing project, so this repository preserves a clear before-and-after boundary instead of presenting the whole product as new.

### What existed before Build Week

- A bilingual parent conversation and family dashboard
- A simulated Apple Watch morning summary and personal-baseline trends
- Basic symptom check-ins, consent prompts, approval/audit UI, and a synthetic wandering/escalation demo
- Optional server-side OpenAI companion replies, meal-photo analysis, and voice transcription
- The vinext/Cloudflare deployment scaffold, production build, lint, and SSR tests

### What I added during Build Week

- **A complete Care Episode Loop**: visible health-data review → proactive bilingual inquiry → evidence and uncertainty → three care options → family approval → named owners and deadlines → follow-up → recorded outcome
- **Shared cross-surface episode state** so the parent's consent and check-in become the family's notification, decision, task plan, and resolved follow-up
- **Consent-led family contact** that asks the parent who to contact, creates one clear alert for that person, and lets the family acknowledge and call back
- **Safer, more accessible check-ins** with time-aware meal prompts, knee/stomach/dizziness danger checks, Singapore emergency and NurseFirst guidance, and optional read-aloud advice
- **Submission-quality consistency and verification**: unified synthetic fixtures, responsive card fixes, expanded rendered-output assertions, and end-to-end demo rehearsal

I used **Codex** to implement, refactor, debug, test, and prepare the working demo. I remained responsible for product scope, safety rules, review, integration, and every consequential care boundary.

### Verifiable new-vs-existing boundary

| Evidence | Reference |
|---|---|
| Last commit before OpenAI Build Week opened | [`10970be`](https://github.com/leini8891/KinKeep/commit/10970be52e575f86bd9968462caf159817dd2c31) |
| Pushed Build Week Care Episode Loop increment | [`d1d1c74`](https://github.com/leini8891/KinKeep/commit/d1d1c746238d13c71ec03a9dedaa0f45c3770e8c) |
| Full Build Week diff (updates with the final `main` push) | [`10970be...main`](https://github.com/leini8891/KinKeep/compare/10970be52e575f86bd9968462caf159817dd2c31...main) |
| Original BUIDL_QUESTS judged snapshot | [`judged-2026-07-12`](https://github.com/leini8891/KinKeep/releases/tag/judged-2026-07-12) |
| Original build-day timeline | [`docs/BUILD_LOG.md`](docs/BUILD_LOG.md) |

## ✨ One product, two surfaces

**Try it live:** [kinkeep-family-health.leini9591.chatgpt.site](https://kinkeep-family-health.leini9591.chatgpt.site/) — parent at `/`, family at `/family`. Bilingual (EN / 简体中文) everywhere, switchable at runtime.

### 📱 `/` — the parent's side: it opens talking

| | |
|---|---|
| 💬 **Conversation-first** | No dashboard, no charts. Quick-reply chips instead of typing — she answers, she never has to initiate |
| ⌚ **Watch summary in the chat** | Tap-to-sync Apple Watch morning card: sleep −1h · steps low · vs *her own* usual (simulated stream today) |
| 🩺 **Structured check-ins** | Time-aware bilingual prompts for knee pain, stomach pain, sleep, appetite, and dizziness, with danger-sign checks before routine follow-up |
| 🔊 **Accessible safety guidance** | Read-aloud Singapore guidance plus explicit choices for whether and how a family member should be contacted |
| 🍜 **Real meal-photo analysis** | Server-side OpenAI vision: calorie range, macros, fibre/sodium/veg, portion, **visible uncertainty**, one practical suggestion |
| 🎙️ **Real voice input** | In-browser recording → server-side transcription (zh/en), browser speech recognition where supported |
| 🆘 **"I need help"** | Offers immediate guidance, then lets the parent choose the nearby responder David, Elena, or no family contact |

### 👨‍👩‍👧 `/family` — the family's side: an answer, not a feed

| | |
|---|---|
| ✅ **"Is Mum okay?" answered** | One sentence with plain-language reasoning — evidence bullets, not raw data |
| 👥 **Relationship-aware profiles** | Mum · Dad · self · brother — each with a scoped permission level, not one feed for everyone |
| 📈 **Trends & evidence** | 7-day activity / sleep / resting HR / routine-match, each drawn against her **personal range band**, with "why today was flagged" |
| 🤝 **Approval gate** | High-impact actions (e.g. suggesting telehealth) pause with evidence + the matched policy reason; approve/decline both produce honest outcomes |
| 🗓️ **Care schedule & roles** | Family + companion tasks on one timeline; weekly assignments across Elena, brother, and the companion |
| 📜 **Audit & access** | Who viewed, who decided, what the system did — including *"Mum approved sharing this reply"*: **consent runs both directions** |
| 🚨 **Escalation awareness** | The selected channel and acknowledgement state sync across both surfaces, with synthetic location/HR/battery context for the wandering fixture |

## 🛡️ The sovereignty model

The hackathon theme is *Agents & Sovereignty*. Most agent demos show autonomy; KinKeep shows **where autonomy must stop**.

| Agents do autonomously | Pauses for a human |
|---|---|
| Read wearable summary; compare vs personal baseline | Choosing whether and which family member to contact — the elder decides |
| Initiate routine check-ins and prepare follow-ups | Contacting a family member — the parent chooses who receives the alert |
| Structured symptom triage and record-keeping | Sharing the elder's reply with the family circle — logged authorization |
| Meal understanding + one practical suggestion | Third-party data sharing, care-plan changes |
| Family summaries, options, tasks, and audit entries | Care-plan approval and emergency response — human acknowledgement, never auto-dial |

## 🚀 Quick start

Requires Node.js ≥ 22.13.

```bash
npm install
npm run dev
```

Parent and family experiences run from the same server. Optional — for live meal vision and voice transcription, create an ignored `.env.local`:

```text
OPENAI_API_KEY=your-key
# Optional override; defaults to gpt-5.6-terra
OPENAI_MODEL=gpt-5.6-terra

# Optional: international-format digits only, used to open the selected family chat
KINKEEP_ELENA_WHATSAPP=6591234567
KINKEEP_DAVID_WHATSAPP=6597654321
```

If a family WhatsApp number is not configured, KinKeep still opens WhatsApp with
the message pre-filled, but the elder must select the recipient. The browser
cannot press WhatsApp's final Send button on the user's behalf.

No OpenAI key? Everything else is deterministic and works offline — the demo never depends on a model to stay safe.

## ✅ Validation

```bash
npm run lint
npm test     # production build + server-rendered assertions for both surfaces
```

## 🧠 Built with + technical implementation

- **Application**: Next.js 16 App Router · React 19 · TypeScript · Tailwind 4
- **Runtime and deployment**: vinext/Vite on Cloudflare Workers, deployed through OpenAI Sites
- **GPT-5.6**: OpenAI Responses API with `gpt-5.6-terra` for short, grounded companion replies and schema-constrained meal-photo understanding; requests are server-side with `store: false`
- **Voice**: OpenAI Audio Transcriptions with `gpt-4o-mini-transcribe`; optional browser speech synthesis reads safety guidance aloud
- **Deterministic safety layer**: typed state machines control symptom branching, consent, escalation channels, approvals, owners, deadlines, and follow-up status — model output cannot bypass them
- **Cross-surface demo state**: typed `CareEpisode` and `CareEscalation` records persist in local storage and dispatch browser events so parent and family views stay aligned without pretending the demo has production clinical infrastructure
- **Structured uncertainty**: meal analysis uses strict JSON Schema output with confidence and assumptions instead of false precision
- **Codex development workflow**: milestone planning, code generation and refactoring, regression tests, debugging, responsive verification, and deployment preparation, with human review and final product judgment

## 📚 Documentation and evidence

- OpenAI Build Week scope and evidence: this README and the [`10970be...main`](https://github.com/leini8891/KinKeep/compare/10970be52e575f86bd9968462caf159817dd2c31...main) diff
- Original BUIDL_QUESTS timeline: [docs/BUILD_LOG.md](docs/BUILD_LOG.md)
- Product requirements and safety architecture: [docs/PRD_KinKeep_OPC.md](docs/PRD_KinKeep_OPC.md)

## 🗺️ Roadmap

Real mobile push & notification ladder → real wearable ingestion (HealthKit / rings) → dialect voice (Cantonese · Hokkien · Teochew · Tamil) validated with real elders → Singapore hawker-food nutrition depth → **Care Provider Console**: one care professional, supported by agents, coordinating wellness for dozens of seniors.

---

<div align="center">

**OpenAI Build Week 2026 · built with Codex + GPT-5.6**

_Project origin: BUIDL_QUESTS 2026 · OPC / Super Individuals_

_Synthetic demo data · Non-diagnostic · Consent-first · Humans decide high-impact actions_

**KinKeep** — *notices the change, checks in first, tells you when you're needed.*

</div>
