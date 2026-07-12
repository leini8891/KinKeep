# KinKeep
## PRD — OPC Hackathon (amber.ac · Nimbus Agents & Sovereignty)

Version: **1.3 (as-built)** · Date: 2026-07-12 · Supersedes the v1.2 planning baseline
Track: **05 · OPC / Super Individuals** (secondary fit: 01 Autonomous Agents, 02 Sovereignty)
Status: two-surface product shipped and verifiable in this repository. This document describes what exists, then the roadmap. The build timeline is in [BUILD_LOG.md](BUILD_LOG.md).

---

## 1. Brand & One-Line Pitch

**KinKeep** *(hackathon working name)* — from the sociology term *kinkeeper*: the family member who holds the family together — remembers, checks in and coordinates care. Every family has one; that person is already running an unpaid one-person care operation.

> **A family health companion that notices meaningful changes, checks in with your parent, and tells you when you're needed.**
>
> 中文：它不是让你每天查看父母的数据，而是在父母状态真正发生变化时，先替你确认，再告诉你是否需要介入。
>
> **Agents own the execution. Families retain judgment and control.**

### Naming status and guardrail

- Demo/deck/UI spelling is always **KinKeep**. `Kinkeep` and `KinKeeper` are not alternate brand spellings.
- The human family role may still be described generically as a *kinkeeper* (lowercase).
- **KinKeep is not trademark-cleared.** A preliminary collision check found active or recently active family-care products using both KinKeep and KinKeeper, including `kinkeep.com`, `trykinkeep.com`, `kinkeeper.app` and `kinkeeper.co.uk`.
- Therefore this is a **hackathon working name only**. Do not claim exclusivity, register paid brand assets or present it as the final commercial name. Before public launch: run IPOS and relevant international trademark checks, check domains/app stores/social handles, then rename if necessary.

### Positioning (v1.3)

Not "an AI family health dashboard." Apple Health can already share numbers with family — numbers are not care. KinKeep closes the loop from **personal-baseline change → conversational check-in → completed first-round care action → one family decision** — and it knows where autonomy must stop. The hero moment of the demo is the agent **pausing to ask a human**; sovereignty is product architecture, not a disclaimer slide.

---

## 2. What Is Built (as-shipped, this repo)

One product, two connected surfaces, one deployment (vinext / Cloudflare Workers). Bilingual EN / 简体中文 throughout, switchable at runtime. All demo health data is synthetic; every surface carries a non-diagnostic disclaimer.

### 2.1 Parent surface — `/` (conversation-first mobile)

- Opens directly into a warm conversation; no dashboard, no charts for the elder.
- **Apple Watch morning summary embedded in the chat** with a tap-to-sync interaction (sleep −1h, heart rate steady, steps low — vs her own usual; simulated stream today).
- Proactive, baseline-aware greeting (knee + breakfast) answered by quick-reply chips — the elder never has to initiate or type.
- **Multi-step structured check-ins** (deterministic branching):
  - knee pain → duration triage → "shall I ask Elena to call you today?" → family notified;
  - poor sleep → symptom triage → the dizziness path gives safety guidance and starts a care escalation;
  - no appetite → invites a lunch photo.
- **Real meal-photo nutrition analysis**: upload → server route → OpenAI Responses API (vision) → calorie range, macro estimates, fibre/sodium/vegetables, portion, **visible confidence/uncertainty** and one practical suggestion. Deterministic fallback copy when no key is configured.
- **Real voice input**: in-browser recording → server `/api/transcribe` (OpenAI STT, zh/en), with browser speech recognition where supported; graceful degradation when unconfigured.
- "I'm fine" / "I need help" as first-class actions; help starts a **staged care escalation** (§3).
- Medication / lunch / stretch reminder strip.

### 2.2 Family surface — `/family` (responsive: phone answer + desktop workspace)

- **Mobile view, three tabs**: 安心 *Status* — a direct answer to "Is Mum okay?" in one sentence, with plain-language reasoning; 通知 *Alerts* — only meaningful changes, each with evidence bullets; 待批准 *Approvals* — the high-impact decision queue.
- **Multi-member family model**: Mum (needs attention), Dad (stable), Elena herself (privacy-scoped: shares only schedules and contacts, not her own health details), Brother (care collaborator). Relationship-aware sharing — not one feed for everyone.
- **Desktop workspace, four views**:
  - *Family overview* — who is okay, who needs you, today's family tasks, pending approvals;
  - *Trends & evidence* — 7-day charts of activity / sleep / resting HR / routine-match, each drawn against **her personal range band**, with a "why today was flagged" evidence rail (multi-signal, never one number);
  - *Care schedule* — family + companion tasks on one timeline, weekly role assignments (Elena: primary contact & approvals · Brother: transport/groceries · Companion: routine tasks);
  - *Activity & access* — audit log (who viewed, who decided, what the system did, what the elder consented to share) and per-member permission scopes.
- **Decision panel (sovereignty gate)**: telehealth suggestion paused as HIGH impact, with evidence and the matched policy reason; Approve/Decline both produce honest outcomes ("KinKeep will prepare options, but will not share data or complete a booking automatically").
- **Wandering escalation demo**: one click creates a staged escalation (push → multichannel → backup acknowledged) that **syncs live across the parent and family surfaces** (shared storage + events), with location / heart-rate / battery context and family acknowledgement.

### 2.3 Engineering & verification

- Next.js 16 App Router + React 19 + TypeScript + Tailwind 4 via **vinext on Cloudflare Workers**; OpenAI Responses API (vision) and OpenAI STT — both server-side, keys never reach the browser, both optional at runtime.
- Deterministic care logic in code (branching, escalation stages, gating) — never model output.
- `npm run lint` + `npm test` (production build + SSR assertions covering both surfaces).
- [BUILD_LOG.md](BUILD_LOG.md): timestamped, verifiable commit-by-commit history within the event window; judging evidence is explicitly limited to this repository.

---

## 3. Sovereignty Model (as implemented)

| Agents do autonomously (shipped) | Pauses for a human (shipped) |
|---|---|
| Read wearable summary; compare vs personal baseline | Suggesting medical escalation (telehealth) — approval card with evidence |
| Initiate routine check-ins and follow-ups | Contacting family on the elder's behalf — the elder consents first ("shall I ask Elena to call?") |
| Structured symptom triage and record-keeping | Sharing the elder's reply with the family circle — her authorization is logged |
| Meal understanding + one practical suggestion | Third-party data sharing and care-plan changes (policy, surfaced in approval copy) |
| Family summaries, alerts, audit entries | Emergency response — staged notification ladder with human acknowledgement; never auto-dial |

- **Escalation ladder** (typed stages in code): `primary_push → primary_multichannel → backup_acknowledged`. The system widens *notification* channels; it never takes the consequential action itself. Both surfaces render the same escalation object in real time.
- **Consent runs both directions**: the elder controls what her replies share to the family circle; each family member has a scoped permission level; every action lands in the audit log.
- **Risk framing**: multi-signal *personal change detection* — sleep + activity + resting heart rate + routine-match + reply latency moving together — never a single-number alarm. Language models word nothing that decides: branching, stages and gating are auditable code.

---

## 4. Judge Demo Path (~3 min, two surfaces)

1. `/` parent side (phone width): tap **sync watch** → the morning summary card lands inside the chat → the companion asks about knee and breakfast.
2. Tap 膝盖有点痛 → duration triage → **"需要请 Elena 今天给你打电话吗？"** — *the sovereignty beat: the agent stops and asks.* Confirm → "已经通知 Elena"。
3. Photograph a real Singapore meal → live vision analysis with visible uncertainty + one practical suggestion.
4. Switch to `/family` (phone width): **"妈妈现在基本安好。"** — the answer, not the data; evidence bullets underneath.
5. Desktop width: *Trends* (personal-range band; today clearly outside it) → *Approvals* (telehealth card: evidence + why approval is required → Approve) → *Activity & access* (audit trail including "Mum approved sharing this reply").
6. Optional 20s: **演示走失事件** → staged escalation appears on both surfaces → family acknowledges.

Fallbacks: meal analysis and voice need `OPENAI_API_KEY` configured on the deployment — decide live key vs. prepared screenshots before judging. Everything else is deterministic and network-safe.

---

## 5. OPC Story & Business (hypothesis-labelled)

**Three layers.**
1. *The founder is an OPC* — one person directing coding agents shipped this bilingual, two-surface product in a single build day, with a verifiable commit log.
2. *Every family kinkeeper is an unpaid OPC* — KinKeep gives her an agent workforce and keeps her in charge of the decisions that matter.
3. *The endgame creates OPCs* — a Care Provider Console where one professional, supported by the same agents, coordinates wellness support for dozens of seniors. Ratios and pricing are hypotheses to validate, not demonstrated outcomes.

| Phase | Model | Draft pricing | Notes |
|---|---|---|---|
| 1. Family subscription (B2C, BYOD) | Free daily digest · Pro per elder | ≈ S$29/mo | Proactive check-ins, escalation chain, multi-caregiver sharing, weekly summaries. Comparables (Daily OK, Getwello, BoundaryCare) prove monthly willingness-to-pay for simpler loops. Wedge: cross-border families SG⟷MY/CN/IN |
| 2. Hardware partnership / white-label (B2B2C) | Device bundle + subscription | ≈ S$199 + S$39/mo | Telco/insurer distribution; a late-detected fall costs an insurer far more than a year of subscription |
| 3. Care Provider Console (B2B SaaS) | Seat fee per senior | hypothesis ≈ S$25/senior/mo | Validate capacity, liability and willingness-to-pay before any 1:50 or ARR claim |

**Why now**: ~1 in 4 Singaporeans will be 65+ by 2030; care workforce shortage (agents multiply scarce carers, not replace them); wearable ubiquity; collapsing agent inference cost; sovereignty-gated autonomy is the trust architecture families and regulators will demand.

---

## 6. Roadmap (post-hackathon)

1. **Real push + notification infrastructure** — replace in-app alert fixtures with true mobile push and the staged multichannel ladder (clearly-labelled stubs → real integrations with consent).
2. **Real wearable ingestion** — HealthKit / ring APIs feeding the same personal-baseline change detection; today's summary stream is simulated.
3. **Language & dialect validation** — co-design Cantonese / Hokkien / Teochew / Tamil voice with real elders; ship only after usability, consent and transcription reliability are proven.
4. **Local nutrition depth** — Singapore hawker ontology, dish-level guesses with one-tap correction, advice kept within validated nutrition boundaries.
5. **Care Provider Console** — approval queues, caseload triage, professional audit exports; validate safe coordinator ratios before scale claims.
6. Production auth and storage (D1/R2 bindings currently unused), and a trademark-cleared commercial brand.

---

## 7. Pitch Script (4 min)

| Time | Beat |
|---|---|
| 0:00–0:30 | **Hook**: "Every family has a kinkeeper — the one who checks in. That's me, and my mum lives far away. Some days I can't. KinKeep is for that day." Promise sentence + "Agents own the execution; families retain judgment." |
| 0:30–2:10 | **Parent-side live demo**: watch sync → knee triage → *pause* at "shall I ask Elena to call you today?" — "Notice: it stopped and asked. That's not a prompt. That's architecture." → meal photo, live vision analysis. |
| 2:10–3:10 | **Family-side live demo**: "Is Mum okay?" answered in one sentence → trends vs her own range → approve the paused telehealth card → audit log ("Mum approved sharing this reply" — consent runs both directions). Optional wandering click. |
| 3:10–4:00 | **OPC close**: three layers; hypothesis-labelled business phases; "An OPC, built by agents, that creates more OPCs." |

Q&A prep: **vs Apple Health sharing** — numbers vs completed care actions; **liability** — non-diagnostic, deterministic branching, human approval on every consequential step; **privacy** — consent-scoped sharing per member, audit log, keys server-side, synthetic data; **moat** — local workflows + sovereignty UX as product, not feature; **coordinator economics** — explicitly hypotheses.

---

## 8. Submission Checklist

- [ ] Deployed URL verified in a fresh browser (decide: live `OPENAI_API_KEY` vs. fallback screenshots for meal/voice)
- [ ] Tag the judged commit; record the final URL in BUILD_LOG.md
- [ ] OpenArena form (draft: [SUBMISSION_OpenArena.md](SUBMISSION_OpenArena.md)), track 05 · OPC / Super Individuals
- [ ] 90-sec video: parent check-in beat → family answer + approval beat → close line
- [ ] README current (it is, as of v1.3)
