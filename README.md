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

[![Event](https://img.shields.io/badge/BUIDL__QUESTS_2026-OPC_·_Super_Individuals-E8A13D)](https://openarena.to/en/events/buidl-quests-2026)
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

## ✨ One product, two surfaces

**Try it live:** [kinkeep-family-health.leini9591.chatgpt.site](https://kinkeep-family-health.leini9591.chatgpt.site/) — parent at `/`, family at `/family`. Bilingual (EN / 简体中文) everywhere, switchable at runtime.

### 📱 `/` — the parent's side: it opens talking

| | |
|---|---|
| 💬 **Conversation-first** | No dashboard, no charts. Quick-reply chips instead of typing — she answers, she never has to initiate |
| ⌚ **Watch summary in the chat** | Tap-to-sync Apple Watch morning card: sleep −1h · steps low · vs *her own* usual (simulated stream today) |
| 🩺 **Structured check-ins** | Knee pain → duration triage → *"Shall I ask Elena to call you today?"* → family notified. Poor sleep → symptom triage, with a safety path for dizziness |
| 🍜 **Real meal-photo analysis** | Server-side OpenAI vision: calorie range, macros, fibre/sodium/veg, portion, **visible uncertainty**, one practical suggestion |
| 🎙️ **Real voice input** | In-browser recording → server-side transcription (zh/en), browser speech recognition where supported |
| 🆘 **"I need help"** | Starts a staged care escalation — notification channels widen; nothing is ever auto-dialled |

### 👨‍👩‍👧 `/family` — the family's side: an answer, not a feed

| | |
|---|---|
| ✅ **"Is Mum okay?" answered** | One sentence with plain-language reasoning — evidence bullets, not raw data |
| 👥 **Relationship-aware profiles** | Mum · Dad · self · brother — each with a scoped permission level, not one feed for everyone |
| 📈 **Trends & evidence** | 7-day activity / sleep / resting HR / routine-match, each drawn against her **personal range band**, with "why today was flagged" |
| 🤝 **Approval gate** | High-impact actions (e.g. suggesting telehealth) pause with evidence + the matched policy reason; approve/decline both produce honest outcomes |
| 🗓️ **Care schedule & roles** | Family + companion tasks on one timeline; weekly assignments across Elena, brother, and the companion |
| 📜 **Audit & access** | Who viewed, who decided, what the system did — including *"Mum approved sharing this reply"*: **consent runs both directions** |
| 🚨 **Wandering escalation demo** | One click: staged escalation (push → multichannel → acknowledged) syncing **live across both surfaces**, with location/HR/battery context |

## 🛡️ The sovereignty model

The hackathon theme is *Agents & Sovereignty*. Most agent demos show autonomy; KinKeep shows **where autonomy must stop**.

| Agents do autonomously | Pauses for a human |
|---|---|
| Read wearable summary; compare vs personal baseline | Suggesting medical escalation — approval card with evidence |
| Initiate routine check-ins and follow-ups | Contacting family on the elder's behalf — she consents first |
| Structured symptom triage and record-keeping | Sharing the elder's reply with the family circle — logged authorization |
| Meal understanding + one practical suggestion | Third-party data sharing, care-plan changes |
| Family summaries, alerts, audit entries | Emergency response — staged notifications, human acknowledgement, never auto-dial |

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
```

No key? Everything else is deterministic and works offline — the demo never depends on a model to stay safe.

## ✅ Validation

```bash
npm run lint
npm test     # production build + server-rendered assertions for both surfaces
```

## 🧠 How it's built

- **Stack**: Next.js 16 (App Router) · React 19 · TypeScript · Tailwind 4, running through **vinext on Cloudflare Workers**.
- **AI, scoped deliberately**: OpenAI Responses API (vision) for meal photos and OpenAI STT for voice — both server-side, keys never reach the browser, both optional at runtime. Everything consequential — branching, escalation stages, gating — is deterministic code.
- **Build transparency**: built by one person directing coding agents in a single event day. Commit-by-commit timeline with original timestamps: [docs/BUILD_LOG.md](docs/BUILD_LOG.md).

## 📚 Documentation

The event build timeline and validation evidence are recorded in [docs/BUILD_LOG.md](docs/BUILD_LOG.md).

## 🗺️ Roadmap

Real mobile push & notification ladder → real wearable ingestion (HealthKit / rings) → dialect voice (Cantonese · Hokkien · Teochew · Tamil) validated with real elders → Singapore hawker-food nutrition depth → **Care Provider Console**: one care professional, supported by agents, coordinating wellness for dozens of seniors.

---

<div align="center">

**BUIDL_QUESTS 2026 · OPC / Super Individuals**

_Synthetic demo data · Non-diagnostic · Consent-first · Humans decide high-impact actions_

**KinKeep** — *notices the change, checks in first, tells you when you're needed.*

</div>
