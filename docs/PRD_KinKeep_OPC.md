# KinKeep
## PRD — OPC Hackathon (amber.ac · Nimbus Agents & Sovereignty)

Version: 1.2 · Date: 2026-07-12 (Singapore OPC Hackathon build day)
Track at submission: **05 · OPC / Super Individuals** (secondary fit: 01 Autonomous Agents, 02 Sovereignty)
Deadline today: **18:00 SGT demo-ready** · Submission window closes 2026-08-12 on OpenArena

---

## 1. Brand & One-Line Pitch

**KinKeep** *(hackathon working name)* — inspired by the sociology term *kinkeeper*: the family member who holds the family together — remembers, checks in and coordinates care. Every family has one; that person is already running an unpaid one-person care operation.

> **"I don't have time to be with Mum today — but I want to know she's OK. If something's off, run the first round of checks for me, and tell me what to do next."**
>
> Keep my ageing parent safe, active and connected while I'm away.
> **Agents own the execution. Families retain judgment and control.**

KinKeep is an agentic care loop: passive wearable signals → a pipeline of care agents that detect, check in, assess and act — pausing at a **hard human-sovereignty gate** before any high-impact action.

### Naming status and guardrail

- Demo/deck/UI spelling is always **KinKeep**. `Kinkeep` and `KinKeeper` are not alternate brand spellings.
- The human family role may still be described generically as a *kinkeeper* (lowercase).
- **KinKeep is not trademark-cleared.** A preliminary collision check found active or recently active family-care products using both KinKeep and KinKeeper, including `kinkeep.com`, `trykinkeep.com`, `kinkeeper.app` and `kinkeeper.co.uk`.
- Therefore this is a **hackathon working name only**. Do not claim exclusivity, register paid brand assets or present it as the final commercial name. Before public launch: run IPOS and relevant international trademark checks, check domains/app stores/social handles, then rename if necessary.

### Why this wins on this theme

The hackathon theme is *Agents & Sovereignty*. Most agent demos show autonomy; almost none show **where autonomy must stop**. Our hero moment is the pipeline **pausing** — an agent that has done everything it responsibly can, handing a decision card to a human. Sovereignty isn't a disclaimer slide; it's a first-class product surface (`/sovereignty` policy matrix + approval inbox).

---

## 2. The OPC Story (three layers, one narrative)

**Layer 1 — The founder is an OPC.** One person + coding agents built KinKeep in a single build day. The pitch opens and closes on this: *I'm a one-person company, building with agents, for people like me.*

**Layer 2 — The family kinkeeper is an unpaid OPC.** A sandwich-generation family member already runs a one-person care operation on top of work and life. KinKeep gives that person an agent workforce: agents monitor, check in and prepare the first-round response; the family keeps the decisions that matter.

**Layer 3 — The endgame creates OPCs.** The Care Provider Console turns independent care coordinators into true one-person companies: *one care professional, supported by KinKeep agents, coordinates wellness support for dozens of seniors.* The 1:10 → 1:50 service ratio is a roadmap hypothesis to validate, not a demonstrated outcome; the product thesis is that agents absorb monitoring and routine follow-up while professionals retain judgment.

### Monetization

| Phase | Model | Price point (draft) | Notes |
|---|---|---|---|
| **1. Family subscription (now)** | B2C SaaS, BYOD (Apple Watch / smart ring) | Working hypothesis — Free: daily digest · **Pro S$29/mo per elder**: proactive check-ins, future dialect companion, sovereignty gate, multi-caregiver | Potential wedge: **cross-border care** — children in SG, parents in MY/CN/IN. Validate demand for dialect check-ins (粤/闽/潮/Tamil) before calling localization a moat |
| **2. Hardware partnership / white-label** | Device bundle + subscription, B2B2C | ~S$199 device + S$39/mo bundle | Distribution via telcos & insurers (eldercare riders) — falls and late escalations cost insurers far more than a subscription |
| **3. Care Provider Console** | B2B SaaS seat fee per senior | **Working hypothesis:** S$25/senior/mo; coordinator may charge ~S$150/mo | Illustrative model only: 50 seniors × S$150 = S$7.5k/mo coordinator gross revenue; 1,000 coordinators × 50 seniors × S$25 = S$15M ARR. Validate capacity, willingness to pay and service liability before using externally. |

### Why now
- Ageing curve: ~1 in 4 Singaporeans will be 65+ by 2030; regional cross-border diaspora care is far larger.
- Care workforce shortage: agents don't replace scarce carers — they multiply them.
- Wearable penetration is high; agent inference cost is collapsing.
- Sovereignty-gated autonomy is exactly the trust architecture families and regulators will demand.

---

## 3. Scope Discipline (4-hour re-baselined build)

**Hero demo tells ONE story:** `Passive signals → proactive check-in → completed care action (with human approval in the middle)`.

IN scope today:
- Simulated wearable stream (deterministic fixtures — runs with zero API keys)
- 4 care agents + 1 deterministic human-sovereignty gate, with live visual state and one shared event stream
- Elder-side companion interaction in Chinese/English; dialect voice is scripted copy only unless proven working
- Sovereignty approval queue embedded in the demo + a policy/audit page
- Split-screen judge mode (elder phone frame ⟷ family dashboard)
- Two deterministic one-click scenarios: Quiet Morning and Wandering
- Local hawker-meal interaction as a short supporting beat: choose/log a meal, apply a realistic modifier such as “less sauce,” and show the result in the family summary

OUT of scope today (Roadmap only):
- Real HealthKit / device integrations
- Real camera recognition or clinical nutrition assessment; the meal flow uses deterministic SG food fixtures
- Real tele-GP booking, emergency calls/SMS or CARA submission — demo actions are clearly labelled stubs
- Longevity / mental / social / finance domains beyond the two demo stories
- Care Provider multi-senior console (one mock screenshot max)
- Authentication, production database and real personal/health data

Founder note: 安全架构坚持“确定性规则决定风险、AI 只负责措辞”，产品叙事聚焦 agent loop（替你完成第一轮照护），而不是又一个只展示数据的健康仪表盘。

---

## 4. The Agent Pipeline (core domain model)

```
Wearable signals (simulated stream)
        ↓
① Personal Baseline Agent      — compares against THIS elder's baseline, not population
        ↓ (deviation detected: not normal daily variance)
② Companion Agent              — initiates check-in in a supported language
        ↓ (conversation + behavioural signals)
③ Care Assessment Agent        — fuses replies + signals → risk tier 🟢/🟡/🔴 + reasons
        ↓
④ Action Coordinator           — generates today's care task list
        ↓
   ┌────────────────────────────────────┐
   │  ⑤ HUMAN SOVEREIGNTY GATE          │
   │  autonomous tasks → execute        │
   │  high-impact tasks → PAUSE,        │
   │  push decision card to family      │
   └────────────────────────────────────┘
        ↓
High-impact action authorized or declined — stub outcome audit-logged
```

### Sovereignty policy (deterministic, auditable — never decided by the LLM)

| Agents may do autonomously | Must pause for a human |
|---|---|
| Analyse wearable data | Contact emergency contacts |
| Compare vs personal baseline | Propose medical escalation (call GP / clinic) |
| Initiate routine check-ins | Share health data with any third party |
| Generate family summaries | Modify the long-term care plan |
| Suggest movement / meals / social activity | (anything marked `impact: high` in policy) |
| Schedule routine follow-ups | |

Implementation: every `CareTask` carries `impact: 'routine' | 'high'`. Policy lives in one module (`app/lib/sovereignty/policy.ts` or the final equivalent), rendered verbatim on `/sovereignty`. The gate is code, not prompt.

### Risk tiers

- 🟢 Green — within personal baseline → daily summary only
- 🟡 Amber — meaningful deviation → companion check-in, routine tasks
- 🔴 Red — no response / fall / wandering out of safe zone → high-impact tasks queued at the gate
- A language model may word check-in messages and family summaries; **rules decide tier and gating**. No keys or model failure → fixture wording, so the demo never breaks.

---

## 5. Demo Scenarios (both one-click, deterministic)

### Scenario A — Hero: "Quiet morning" (~2.5 min)
1. 07:30 — deterministic signals stream in: 120 steps vs 2,400 personal baseline, sleep 5.2h vs 7.5h, resting HR +11 bpm.
2. Baseline Agent flags 🟡: "Not normal Tuesday variance for Mdm Tan."
3. Companion Agent opens a large-type **Chinese** check-in in the elder phone frame. English is available; Cantonese voice remains a roadmap capability unless it is demonstrably working.
4. Elder replies: knee pain, skipped breakfast.
5. Assessment Agent: 🟡 low-medium; hydration + meal + mobility concerns; reasons listed.
6. Action Coordinator executes routine support: ✅ gentle chair-stretch guidance · ✅ light-lunch suggestion · ✅ afternoon follow-up; it pauses **suggest tele-GP consult for recurring knee pain (HIGH)** at the sovereignty gate.
7. Family dashboard presents one evidence-backed decision card. Daughter taps **Approve** → a clearly labelled booking stub is created → timeline shows "Care action approved" and the follow-up remains scheduled.

### Scenario B — "Wandering" (~1 min, safety)
Safe-zone exit at 21:40 → Companion voice prompt unanswered → 🔴 → gate holds "notify emergency contact + prepare CARA-style handoff packet" → family approves → resolved. (Carried over from last hackathon's most-loved feature; re-implemented in the new pipeline.)

### Supporting beat — "What did Mum eat?" (~30 sec, only after the hero loop works)

Elder selects a familiar hawker meal → chooses a modifier such as “less sauce” → deterministic nutrition estimate is logged → family pane receives a plain-language meal note. This demonstrates Singapore localization and continuity of care; it must not be presented as photo recognition, diagnosis or individualized medical nutrition advice.

---

## 6. Pages & Routes

| # | Route | Audience | Purpose | Build priority |
|---|---|---|---|---|
| 1 | `/` | Judges + family | **Single demo stage**: elder phone, 4-agent pipeline + sovereignty gate, family status/approval pane, A/B scenario picker and play/step/reset controls, all driven by one event stream | P0 |
| 2 | `/sovereignty` | Family + judges | Deterministic policy matrix plus approval/audit history; linked from the demo rather than required for the pitch | P1 |
| 3 | `/roadmap` | Judges | Three-phase OPC business path, localized nutrition story and Care Provider Console mock | P2 |

No standalone `/approvals` or `/companion` route for the hackathon build. Those surfaces live inside `/`; this avoids navigation during judging and prevents duplicate state implementations. Cut order if time runs out: `/roadmap` → standalone `/sovereignty` (retain the policy summary inside `/`).

### Page anatomy (P0 detail)

**`/` demo stage**
- Top bar: scenario picker · Play ▶ / Step ⏭ / Reset ↺ · elapsed clock
- Left 380px: phone frame with companion chat auto-playing (typing indicator, elder replies)
- Center: pipeline rail — 5 agent nodes lighting up in sequence, active node pulses, gate node turns amber and **halts** until approval
- Right: family dashboard live view with big tier chip, one-sentence answer to “Is Mum OK?”, care timeline and an evidence-backed approval card
- This page IS the pitch. Judges never need to navigate.

**Embedded decision card**
- What: "Suggest tele-GP consult for Mdm Tan's recurring knee pain"
- Why: 3 evidence bullets (signal deltas + quote from chat)
- Impact class: HIGH — matched policy rule shown inline ("Medical escalation always requires family approval")
- Actions: Approve · Decline · Modify (modify = edit note, P2)
- After action: outcome appended to audit log with actor + timestamp

---

## 7. Design Direction

- **Mood**: calm, dignified, warm — the opposite of a hospital alarm. The product's emotional job is *reassurance*.
- **Palette**: warm cream background `#FAF6EF`, deep teal primary `#0F4C4C`, sage `#7FA98F`, amber accent `#E8A13D` (gate/pending), soft red `#C4553B` (red tier only). Dark-teal-on-cream, never harsh white.
- **Type**: large, humanist sans (e.g. `Figtree`/system); elder pane minimum 20px body, 1.6 line-height.
- **Agent identity**: each agent gets an icon + consistent color chip (Baseline 📊 teal · Companion 💬 sage · Assessment 🩺 slate · Coordinator 📋 indigo · Gate 🤝 amber) — reused across timeline, pipeline rail, audit log.
- **The gate is the visual hero**: pipeline flows top→down in teal; at the gate node everything stops, the node breathes amber, a card physically slides to the family pane. Approval releases a green pulse through the rest of the rail.
- **Elder phone frame**: rounded device bezel, XL chat bubbles, big voice button — instantly readable as "the other side".
- Non-diagnostic + consent-first badges in footer.

---

## 8. Tech Plan (current repo reality)

- **Build target**: `/KinKeep/` — the current fresh submission repo. At v1.2 it is still a starter with no product commit history; commit the first verified P0 state immediately. Product name is `KinKeep`; repository/package identifiers remain lowercase where tooling requires it.
- **Stack already scaffolded**: Next.js 16.2.6 App Router + React 19 + TypeScript + Tailwind 4, running through **vinext/Vite on Cloudflare Workers** with OpenAI Sites hosting metadata. Keep the implementation aligned with this existing scaffold and its deployment path.
- **Implementation source of truth**: all judged product code, scenario fixtures, safety rules, UI, and tests live directly in `/KinKeep/`. The submission has no external project runtime dependency.
- **Zero-key rule**: the whole judged path runs on deterministic fixtures and scripted conversations. A Nimbus/model call may improve wording if credentials and latency are proven, but risk tier, policy gate and demo completion never depend on an LLM or external API.
- **Single scenario engine** (`app/lib/scenario/engine.tsx` or equivalent): a scenario is an ordered `CareEvent[]`; play/step/reset advances one cursor; phone, pipeline, family summary and approval queue all render from the same state.
- **Core types**: `WearableReading`, `BaselineDelta`, `CareEvent`, `CareTask { impact }`, `ApprovalDecision`, `RiskTier`.
- **Sovereignty policy**: one deterministic policy module, rendered on `/sovereignty` and enforced by the same function before any task status can move from `pending_gate` to `approved` or `declined`.
- **No production DB/auth today.** `.openai/hosting.json` currently declares no D1 or R2 binding; use in-memory state plus `localStorage` only for demo continuity. All records are synthetic.
- **Verification**: build + lint; add focused tests for scenario reset and high-impact gate behavior only if the P0 demo is already stable.

---

## 9. Pitch Script (~4 min)

| Time | Beat |
|---|---|
| 0:00–0:30 | **Hook (personal)**: "I live in Singapore. My mum lives alone, far away. I'm her kinkeeper — the one who checks in. Some days I can't. KinKeep is for that day." State the promise sentence. |
| 0:30–3:00 | **Live demo — Scenario A** on `/`. Narrate the agents by name. **At the gate, stop talking for a beat.** Then: "Notice what just happened — the agent *stopped*. It did everything it responsibly could, and handed the decision to me. Agents own the execution. Families retain judgment." Approve → loop completes. |
| 3:00–3:20 | **Scenario B fast pass** (wandering) — "same architecture handles the scary night-time case." |
| 3:20–4:00 | **OPC close**: three-layer story + explicitly labelled model: "Our hypothesis is that agents can expand a coordinator's capacity from roughly 10 seniors toward 50 while humans keep the consequential decisions. That's the OPC thesis: one person building with agents, for family kinkeeper OPCs, and eventually enabling professional care OPCs." |

Judge Q&A prep:
- **Privacy?** Sovereignty doubles as data sovereignty: sharing health data with any third party is a gated, human-approved action; elder data is family-controlled; provider keys server-side.
- **Liability / medical risk?** Non-diagnostic. Deterministic rules decide risk tiers; every high-impact escalation pauses for human approval; a model may only word messages and summaries.
- **Vs. Big Tech wearables?** Apple tells you the numbers; KinKeep connects a deviation to a check-in and a governed next action — and knows when to stop. Singapore-local workflows plus sovereignty UX are the differentiation hypothesis.
- **Why will coordinators pay?** The hypothesis is that automated monitoring and routine follow-up increase safe caseload capacity. S$25/senior/month is an initial pricing assumption; validate workflow fit, liability, service capacity and willingness to pay before claiming a 5× outcome.

---

## 10. Re-baselined Build Schedule (14:00 → 18:00)

| Time | Deliverable |
|---|---|
| 14:00–14:25 | Confirm `/KinKeep/` runs; replace starter branding; port theme tokens, core types and deterministic policy |
| 14:25–15:20 | Port single scenario engine + Quiet Morning data; render elder phone, pipeline and family pane on `/` |
| 15:20–16:00 | Implement the visible halt at the sovereignty gate and Approve/Decline release; verify Reset returns to a clean state |
| 16:00–16:30 | Add Wandering as the second fixture; add `/sovereignty` only after both scenarios complete end-to-end |
| 16:30–17:00 | Add localized meal beat only if P0 is stable; otherwise use the existing roadmap card |
| 17:00–17:30 | Build/lint, responsive pass, synthetic/non-diagnostic labels, README and 90-sec demo script |
| 17:30–18:00 | Deploy through Sites, run the judge path twice from a fresh browser, capture fallback screenshots/video, submit |

Hard rule: after 16:00, no new architecture or standalone product surface. At 17:00, freeze features and fix only demo blockers.

---

## 11. Submission Checklist

- [ ] OpenArena.to submission, track **OPC / Super Individuals**
- [ ] 90-sec video: cold open on `/` Scenario A, pause at the gate ("this is sovereignty"), approve, done
- [ ] README: pitch, sovereignty table, OPC three-layer story + monetization table, "runs with no API keys"
- [ ] Live Sites URL + fresh-browser verification
- [ ] Roadmap slide: real device/photo ingestion, validated dialect companion, Care Provider Console

---

## 12. Roadmap (post-hackathon, shown on `/roadmap`)

1. **Production Local Nutrition Agent** — move beyond today's deterministic meal picker to consented photo input, three likely SG-dish guesses, one-tap correction and advice that stays within validated nutrition boundaries.
2. **Language and dialect validation** — co-design Chinese, Cantonese, Hokkien/Teochew and Tamil interactions with older adults; add voice only after usability, consent and transcription reliability are tested.
3. **Real device ingestion** — HealthKit and Oura-class rings; partner/white-label hardware only after the passive-signal value proposition is validated.
4. **Care Provider Console** — one coordinator ⟷ dozens of seniors; approval queues and caseload triage. Validate safe coordinator-to-senior ratios before making scale or income claims.
