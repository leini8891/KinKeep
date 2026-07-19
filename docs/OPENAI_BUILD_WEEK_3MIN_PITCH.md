# KinKeep · OpenAI Build Week 3-minute pitch

Target length: **2:50–3:00**<br>
Recommended format: **short opening → verified live demo → technical boundary → Build Week contribution**

## The one story to tell

KinKeep notices when an ageing parent's day is different, completes the first check-in, and brings the family one decision only when human judgment is needed.

Do not present KinKeep as a health dashboard, an AI doctor, or a list of unrelated features.

## Demo preparation

- Open the parent experience at `/`.
- Open the family experience at `/family` in a second tab.
- Use the English UI for international judges.
- Reset the previous episode before presenting.
- Do not depend on meal-photo analysis, voice input, WhatsApp, or wandering monitoring during the core demo.

Core clicks:

1. `Sync health data`
2. `My knee hurts`
3. `A few days`
4. `None of those`
5. `Yes, please`
6. Switch to `/family`
7. Open `Today's follow-up`
8. Keep `Ask family to call` selected and click `Approve selected plan`

Stop after the owner, deadlines, automatic follow-up, and escalation rule appear. This is the strongest ending for the feature demo.

## Full English script

### 0:00–0:25 · Problem

> Hi, I'm Elena. Many of us care for a parent from another home or country. Wearables share readings, but numbers do not complete care. They do not ask how Mum feels or tell the family what to do next.

### 0:25–0:40 · Product

> KinKeep closes that gap. It notices a change against her personal baseline, checks in, and brings the family one decision when human judgment is needed.

### 0:40–1:35 · Parent-side demo

**Action:** Show the synced health summary.

> This is Mum's side: a conversation, not a dashboard. The data is synthetic. Sleep, activity, and heart rate changed together. No single number is a diagnosis; the pattern starts a check-in.

**Action:** Click `My knee hurts`, `A few days`, and `None of those`.

> KinKeep checks the pain duration and danger signs. This is deterministic code, not a model guessing risk.

**Action:** Pause on the permission question, then click `Yes, please`.

> With no urgent signal, it asks Mum for permission. After she agrees, KinKeep creates a follow-up: Elena calls, and KinKeep checks again.

### 1:35–2:15 · Family-side demo

**Action:** Switch to `/family` and open `Today's follow-up`.

> On the family side, I do not get another feed. I get one answer: is Mum safe, why does she need attention, and what remains uncertain?

**Action:** Point to the three options.

> KinKeep prepares three proportionate options; none contacts a clinic automatically. I will approve the family-call plan.

**Action:** Click `Approve selected plan`.

> The decision becomes accountable work: an owner, deadlines, a follow-up, and an escalation rule.

### 2:15–2:40 · AI and safety architecture

> GPT-5.6 through the Responses API supports bilingual replies and structured meal-photo understanding; voice transcription is optional. The model cannot choose the plan, contact family, or bypass consent. Typed rules control consequential steps, and keys stay server-side.

### 2:40–3:00 · Build Week contribution and close

> KinKeep existed before Build Week. With Codex, I built the complete Care Episode Loop, shared state, consent-led family contact, safer check-ins, and expanded tests. Codex accelerated implementation; I owned scope, safety, review, and integration.
>
> The agent does the checking. The human keeps the judgment. Thank you.

## Chinese speaking cues

- 开场：数据不等于照护。
- 老人端：不是 dashboard，是一场简单对话。
- 安全追问：确定性代码控制，不让模型猜风险。
- 同意节点：**停一下再说** “It stops and asks Mum for permission.”
- 家属端：不是另一条 feed，而是结论、证据、不确定项和一个决定。
- 批准后：决定变成负责人、截止时间、复查和升级条件。
- 技术：GPT-5.6 负责自然交互；模型不能越过同意和审批。
- 收尾：Agent 做确认，人保留判断。

## What to mention, not demonstrate

Use one sentence only:

> KinKeep also supports bilingual voice input, structured meal-photo analysis, a user-confirmed WhatsApp handoff, and a separate wandering-monitoring fixture.

## Claims to avoid

- Do not say the demo uses real Apple Watch or HealthKit data.
- Do not say KinKeep diagnoses conditions or recommends treatment.
- Do not say WhatsApp is sent automatically; the user must choose the recipient and press Send.
- Do not say KinKeep calls a clinic or emergency service.
- Do not say the price, users, revenue, or clinical validation have already been proven.
- Do not describe the system as fully autonomous; its main distinction is knowing where autonomy must stop.
