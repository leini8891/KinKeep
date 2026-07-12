# OpenArena · BUIDL_QUESTS 2026 提交表单草稿（KinKeep）

> 逐字段可直接粘贴。`[ ]` 内为需要你补充/确认的内容。
> 原则：只声称已建成的东西；家属端、粤语语音、真实设备接入一律说成 next milestone，评委核实 demo 时不会翻车。

---

## 01 提交人

**你的姓名**
```
Elena (GitHub: leini8891 / ElenaX)
```

**你的联系方式**
```
leini8891@gmail.com[, Telegram: @你的handle]
```

---

## 02 项目

**项目名称**
```
KinKeep
```

**项目官网 / 演示地址**
```
[部署后的 Sites/Workers URL — 见文末部署备注]
```

**GitHub 仓库**
```
https://github.com/leini8891/KinKeep
```

---

## 03 参赛材料

**项目介绍**
```
KinKeep is a family health companion for ageing parents and the adult children
who care about them from a distance.

It is not another health dashboard. The promise: when something about Mum
meaningfully changes, KinKeep notices it against her own baseline, checks in
with her first — in her language, in a conversation, not a chart — completes
the first round of care, and only then tells the family whether they are needed.

What you can try today (live demo): the parent-facing mobile experience.
It opens straight into a warm bilingual (EN/中文) conversation that already
knows this morning's Apple Watch summary (sleep, heart rate, steps vs her own
usual), proactively asks about her knee and breakfast, walks her through
structured check-ins (pain duration → "shall I ask Elena to call you today?"),
lets her photograph a real Singapore hawker meal for an instant AI nutrition
read, offers voice input, and escalates to family when she taps "I need help."

Agents own the execution. Families retain judgment and control.

中文一句话：它不是让你每天查看父母的数据，而是在父母状态真正发生变化时，
先替你确认，再告诉你是否需要介入。
```

**项目 Logo URL**（可选）
```
[留空，或用 GitHub 头像 https://github.com/leini8891.png]
```

**官方 Twitter / Discord / Telegram**（可选）
```
[留空]
```

**主要联系人**
```
Elena, leini8891@gmail.com, Founder (solo / one-person company)
```

**次要联系人**（可选）
```
[留空]
```

**核心团队成员背景**
```
Solo founder — intentionally so: this is an OPC-track project built the OPC way.

I design the product, write the PRD, and direct a toolchain of coding agents
(OpenAI Codex + Claude Code) that implement, test and deploy. One person
shipped this working product in a single build day.

The build process is intentionally transparent: each functional milestone is
committed and pushed with its original timestamp, with lint, production build,
and rendered-HTML tests used as verification evidence.
```

**项目与 AI 相关的创新点**
```
1. An agentic care loop, not a chatbot. The companion initiates the
   conversation because passive signals deviated from HER personal baseline
   (slept 1h less, steps low, walk missed) — the AI acts first, the elder just
   answers. Detection → check-in → structured triage → escalation is one
   automated loop with a human decision kept in the middle.

2. Deterministic sovereignty, LLM expressiveness. Risk assessment, triage
   branching and escalation rules are auditable code — never model output.
   AI is used where it is genuinely better than rules: natural bilingual
   conversation and vision-based meal understanding. The demo degrades
   gracefully and never depends on a live model to stay safe.

3. Human Sovereignty Gate as product architecture (roadmap surface built on
   the same principle already visible today: "Shall I ask Elena to call you?"
   waits for consent; "I need help" notifies family rather than acting alone).
   Agents may analyse, check in, summarise and suggest autonomously; contacting
   emergency contacts, medical escalation, sharing health data or changing the
   care plan always pauses for a human decision.

4. Local-first vision AI: photograph a real plate of Singapore hawker food and
   get calories, protein/veg balance and portion estimates tuned to how people
   here actually eat — then used as care context ("less appetite + quieter
   morning"), not as a calorie counter.

5. Built BY agents: a one-person company directing coding agents shipped a
   bilingual, voice-enabled, vision-enabled product in one day — the working
   proof of the OPC / Super Individual thesis this track is about.
```

**解决的痛点**
```
For the sandwich generation — especially children living apart from ageing
parents (across town or across borders: SG⟷MY/CN/IN) — daily care today is
either a guilt-driven phone-call routine or a wall of wearable data nobody
interprets.

Apple Health can already share heart-rate numbers with family. Numbers are
not care: they don't ask Mum how her knee feels, don't notice she skipped her
morning walk AND slept badly on the same day, don't check whether she has
eaten, and don't tell a busy daughter whether TODAY is a day she needs to act.

Elders won't use dashboards; families can't watch one more feed. So meaningful
changes get noticed late — after a fall, after days of poor eating — when care
is most expensive and most distressing.

KinKeep's answer: the parent gets a companion that talks like a person; the
family gets silence when all is well, and a completed first round of checks
plus one clear decision when it is not.
```

**当前开发进度**
```
Shipped and demoable today (this repo, built in one day):
- Parent-side mobile companion, fully bilingual (EN / 简体中文)
- Apple Watch morning-health summary embedded in the conversation
  (sleep / heart rate / steps vs her own usual; simulated stream today)
- Proactive baseline-aware greeting and multi-step wellness check-ins:
  knee pain → duration triage → optional "ask Elena to call today" →
  family notified; poor sleep → symptom triage with safety guidance
- Real meal-photo nutrition analysis (vision model API) tuned for
  Singapore hawker food, plus deterministic demo fallback
- Voice input (browser speech recognition), medication/meal/activity
  reminders, "I'm fine" / "I need help" escalation
- Deployed on Cloudflare Workers; lint + build + rendered-HTML tests

Next milestones:
1. Family surface: mobile push ("quieter morning — already checked in,
   one decision needs you") + desktop care overview with approval inbox
   and audit log
2. Sovereignty policy page: the autonomous-vs-human-approval matrix
   rendered from the same code that enforces it
3. Wandering / safe-zone safety scenario (proven in our previous
   hackathon build, being re-implemented in this loop)
4. Real wearable ingestion (HealthKit / ring), then dialect voice
   (Cantonese/Hokkien) after usability validation with real elders
```

**预期收入来源**
```
Phase 1 — Family subscription (B2C, BYOD): free tier = daily digest;
Pro ≈ S$29/month per elder = proactive check-ins, escalation chain,
multi-caregiver sharing, weekly change summaries. Comparable products
(Daily OK, Getwello, BoundaryCare) already charge monthly for far simpler
check-in/monitoring loops — "reducing a family's constant low-grade worry"
is a proven willingness-to-pay. Initial wedge: cross-border families
(children in SG, parents in MY/CN/IN).

Phase 2 — Hardware partnership / white-label (B2B2C): elder-friendly device
bundle ≈ S$199 + S$39/month, distributed through telcos and insurers —
a fall detected late costs an insurer far more than a year of subscription.

Phase 3 — Care Provider Console (B2B SaaS): seat fee per senior
(hypothesis ≈ S$25/senior/month) that lets one independent care coordinator
safely support several times more seniors — agents absorb monitoring and
routine follow-ups, professionals keep judgment. The platform that turns
care professionals into one-person companies; illustrative model:
1,000 coordinators × 50 seniors ≈ S$15M ARR. (Ratios and pricing are
stated as hypotheses to validate, not demonstrated outcomes.)
```

**确认并提交**
- 勾选确认框；`finalize --review`。
- 发 X 帖非必须；如发，可用：*"One person + agents built a family care companion in one day. Agents own the execution; families keep the judgment. KinKeep @ BUIDL_QUESTS 2026"* + demo 链接 + 截图。

---

## 部署备注（演示地址）

仓库是 vinext/Cloudflare Workers 脚手架（`.openai` Sites 元数据）。拿演示 URL：
1. 按项目原本的托管路径发布（Sites），或 `npx wrangler deploy` 到你的 Cloudflare 账号；
2. 部署后用无痕窗口完整跑一遍判定路径（语言切换 → 膝痛流 → 拍照营养 → 需要帮助）；
3. 注意：`/api/analyze-meal` 需要 OPENAI_API_KEY 环境变量在部署端配置，否则演示时走"暂时无法完成营养分析"分支——提前决定用真 key 还是备用截图。

---

# 路演脚本（4 分钟，按实际已建产品）

**开场准备**：手机开好 App（或浏览器手机模拟），语言切到中文；备份：全流程截图/录屏一份在桌面。

## 0:00–0:30 · Hook（个人故事）
> "I live in Singapore. My mum lives far away, alone. In every family there's one person — sociologists call her the *kinkeeper* — who remembers, checks in, coordinates. That's me. But some days I can't. **KinKeep is for that day**: when something about Mum changes, it checks in first, completes the first round of care, and tells me whether I'm needed."

## 0:30–2:40 · Live demo（老人端，边点边讲）
1. **打开即对话**（不是仪表盘）："This is Mum's side. No dashboard, no charts — it opens talking to her."
2. **指健康摘要卡**："Her watch already told it: slept an hour less, steps low, morning walk missing. Not 'HR 91 bpm' — *her* morning vs *her* usual. So the companion speaks first——"
3. **点「膝盖有点痛」→ 持续几天 → 「要不要请 Elena 今天打电话？」** 在这里停一拍：
   > "Notice what just happened. The agent detected, checked in, triaged — everything it responsibly could — and then it **stopped and asked a human**. Agents own the execution; families retain judgment. That's our sovereignty architecture, and it's deterministic code, not a prompt."
4. **点「好的，请联系」→ 已通知 Elena**："That's a completed care action. My phone buzzes once, with a summary and one decision — not a data feed."
5. **拍午餐照片 → 营养卡**："Real vision AI, tuned for how Singaporeans actually eat — and it's care context, not a calorie counter: less appetite + a quiet morning means dinner advice and a follow-up this afternoon."

## 2:40–3:10 · 家属端预告（一页图，不装作已建成）
> "The family side ships next — here's the design. On a quiet day: 'Mum's day looked like her usual self — 168 hours watched, 0 decisions needed you.' On a change day: what she said, what agents already did, and one button-sized decision. **We're proud to tell users: you don't need to open this app every day.**"

（用之前做的三屏设计图：锁屏推送 / 平静日 / 变化日）

## 3:10–4:00 · OPC 收尾（三层，一句一层）
> "Why this track? Three layers.
> **One** — I'm a one-person company: me plus coding agents shipped this working product today.
> **Two** — every family kinkeeper is already an unpaid one-person care operation; we give her an agent workforce.
> **Three** — the endgame: our Care Provider Console aims to let one independent care professional, supported by these same agents, coordinate wellness for dozens of seniors instead of ten. That's the OPC thesis — **an OPC, built by agents, that creates more OPCs.**
> Families subscribe today; hardware partners distribute tomorrow; care professionals build businesses on it after that. Thank you."

## 评委 Q&A 速答
- **和 Apple Health 共享的区别？** "Apple shares numbers; we complete care actions. Numbers don't ask about her knee, don't check she's eaten, don't tell you if today needs you."
- **医疗责任？** "Non-diagnostic. Branching and escalation are deterministic, auditable rules; models only word conversations and read meals. Every consequential step pauses for human consent."
- **隐私？** "Sovereignty doubles as data sovereignty: sharing health data with anyone is itself a gated, human-approved action. Synthetic data in the demo."
- **护城河？** "Localization (hawker food, dialects next, cross-border families) plus the sovereignty UX. Big Tech ships sensors; trust architecture for families is a product, not a feature."
- **为什么现在？** "1 in 4 Singaporeans will be 65+ by 2030, care workers are scarce, wearables are everywhere, agent costs are collapsing. Agents don't replace carers — they multiply them."
