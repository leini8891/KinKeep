# KinKeep · 路演 PPT（10 页）+ Gamma 生成 Prompt

用法：
- **A 部分**是每页的内容与讲稿要点（现场演示插在第 5、6 页之间，幻灯片同时充当 demo 失败时的备份）。
- **B 部分**是直接粘贴进 Gamma（New → Paste text → Generate）的完整 prompt。生成后替换两处截图占位，微调即可。

---

## A. 逐页内容（含讲稿提示）

### Slide 1 · 封面
- **KinKeep** — A family health companion that notices meaningful changes, checks in with your parent, and tells you when you're needed.
- 副题：Agents own the execution. Families retain judgment and control.
- 角标：BUIDL_QUESTS 2026 · OPC / Super Individuals · Built by one person + agents in one day
- 讲稿：直接进 hook——"Every family has a kinkeeper…"

### Slide 2 · 问题：kinkeeper 的一天
- 每个家庭都有一位 kinkeeper：记得吃药、打电话问安、协调一切的那个人（通常是女儿）。
- 她的现状：guilt-driven 的每日电话 × 看不懂也看不完的健康数据墙 × 跨境距离（SG⟷MY/CN/IN）。
- 她其实在无偿经营一家"一人照护公司"。
- 讲稿：个人故事收尾——"That's me. Some days I can't."

### Slide 3 · 为什么现有方案不够：Numbers are not care
- Apple Health 已经能把心率共享给家人。**但数字不是照护**：
  - 数字不会问妈妈膝盖疼不疼；
  - 不会发现"睡少 2 小时 + 上午只走了 320 步 + 早餐没确认"是**同一天**发生的；
  - 不会告诉忙碌的女儿：今天是不是需要你的那一天。
- 老人不用仪表盘；家属看不完数据流。有意义的变化总是发现得太晚。

### Slide 4 · 产品：一个闭环，两个端
- **Personal change detection**（对比她自己的基线，多信号）→ **主动对话问候**（她的语言）→ **完成第一轮照护**（记录、建议、安排跟进）→ **只把一个决定交给家人**。
- 两个端：妈妈的手机 = 一场对话；家人的手机/电脑 = 一句回答 +（需要时）一个按钮。
- 金句：You don't need to open this app every day. We'll tell you when you're needed.

### Slide 5 · 妈妈端（截图页 / demo 背板）
- 打开就是对话，没有图表。Apple Watch 晨间摘要直接出现在聊天里（睡眠 −1h · 步数偏少 · 对比她自己的平常）。
- 快捷芯片代替打字：我很好 / 膝盖有点痛 / 昨晚没睡好 / 今天没胃口。
- 拍一张真实的午餐照片 → 实时视觉分析：热量区间、蛋白质/蔬菜、**可见的不确定度**、一条能执行的建议。
- 真语音输入（服务端转写）· 中/英随时切换 · 需要帮助 = 分级照护升级。
- ［截图占位：老人端聊天界面］

### Slide 6 · 主权时刻（全场最重要一页）
- 大字居中：**The agent stops and asks.**
- 妈妈说膝盖疼 → 追问持续几天 → "需要请 Elena 今天给你打电话吗？" —— agent 做完了它能负责做的一切，然后**停下来，把决定交给人**。
- Agents may: 分析基线、发起问候、分诊记录、生成摘要。
- Humans decide: 医疗升级、联系家人、对外分享数据、紧急响应。
- 底注：Branching, escalation stages and gating are deterministic, auditable code — never model output.

### Slide 7 · 家属端（截图页）
- 手机端一句话回答："妈妈现在基本安好。" 下面是证据，不是数据（睡眠 −2h08m · 活动 −87% · 已完成第一轮问候）。
- 桌面端家庭工作台：多成员档案（妈妈/爸爸/自己/弟弟，各自权限范围）· 7 天趋势带个人基线带 · 照护日程与家庭分工 · 审计日志（"08:16 妈妈授权分享本次回复"——**同意是双向的**）。
- 待批准队列：远程问诊建议在高影响闸门暂停，等 Elena 决定。
- ［截图占位：家属端手机 + 桌面］

### Slide 8 · Built the OPC way（赛道证明页）
- 这个产品本身就是赛道命题的证明：**一个人 + coding agents，一个 build day**。
- 时间线（来自可审计的 BUILD_LOG + 原始 commit 时间戳）：14:17 老人端上线 → 14:53 家属端 + 视觉营养 → 15:21 双语同步 + 响应式 → …
- 工程口径：确定性规则决定一切后果性行为；模型只负责视觉理解、语音转写和措辞；无 key 时优雅降级，demo 永不翻车。
- lint + production build + SSR 测试全绿。

### Slide 9 · 商业：三阶段（全部标注为假设）
- **P1 家庭订阅**（现在）：免费每日摘要；Pro ≈ S$29/月/位老人 = 主动问候 + 升级链 + 多家属协作 + 每周变化摘要。可比产品（Daily OK / Getwello / BoundaryCare）证明"减少持续担忧"存在按月付费市场。切入点：跨境家庭。
- **P2 硬件白标**（B2B2C）：≈ S$199 设备 + S$39/月，走电信商/保险渠道——晚发现一次跌倒的赔付远超一年订阅。
- **P3 Care Provider Console**（B2B SaaS）：按老人席位收费（假设 ≈ S$25/月）——让一位独立照护协调员安全地照护数倍的老人。
- Why now：2030 年新加坡 1/4 人口 65+ · 照护人力短缺 · 穿戴设备普及 · agent 成本坍塌。

### Slide 10 · 收尾：OPC 飞轮
- 三层递进（三行大字）：
  1. An OPC — one person + agents built this today.
  2. For OPCs — every family kinkeeper runs one, unpaid.
  3. Creating OPCs — care professionals building businesses on agents.
- 收束句：**An OPC, built by agents, that creates more OPCs.**
- Demo URL + GitHub + 联系方式。

---

## B. Gamma 生成 Prompt（整段复制粘贴）

```
Create a 10-card pitch deck in 16:9 for a hackathon final. Language: English (keep the few Chinese phrases exactly as written — they are intentional product copy).

DESIGN DIRECTION (follow strictly):
Warm, calm, dignified — a consumer family-care brand, NOT a medical or corporate deck. Background warm cream #FAF6EF; primary deep teal #0F4C4C; supporting sage green #7FA98F; single accent amber #E8A13D used ONLY for the "human decision" moments; soft red #C4553B never used except tiny alert details. Large humanist sans-serif headlines, generous whitespace, big statement typography. No stock photos of hospitals, doctors, or stethoscopes. No purple-blue gradients. Prefer simple flat illustration or plain typographic cards. Slide 6 must be the most visually striking card: near-empty, one giant centered line.

CARD 1 — Title
KinKeep
"A family health companion that notices meaningful changes, checks in with your parent, and tells you when you're needed."
Subline: Agents own the execution. Families retain judgment and control.
Footer: BUIDL_QUESTS 2026 · OPC / Super Individuals track · Built by one person + agents in one day

CARD 2 — Every family has a kinkeeper
The one who remembers the pills, makes the daily call, coordinates everything — usually a daughter.
Her reality today: guilt-driven daily phone calls · a wall of wearable data nobody interprets · often across borders (Singapore ⟷ Malaysia / China / India).
She is already running an unpaid one-person care company.

CARD 3 — Numbers are not care
Apple Health can already share Mum's heart rate with the family. But numbers don't ask how her knee feels. Numbers don't notice she slept 2 hours less AND walked only 320 steps AND skipped breakfast — on the same morning. Numbers don't tell a busy daughter whether TODAY needs her.
Elders won't use dashboards. Families can't watch one more feed. So meaningful changes are noticed late — when care is most expensive and most distressing.

CARD 4 — One loop, two sides
Flow (render as a simple horizontal flow diagram): Personal change detection (vs HER own baseline, multiple signals) → Conversational check-in (in her language) → First round of care completed (recorded, advised, follow-up scheduled) → One decision for the family.
Mum's side: a conversation. The family's side: one answer — and, only when needed, one button.
Pull quote: "You don't need to open this app every day. We'll tell you when you're needed."

CARD 5 — Mum's side: it opens talking (screenshot placeholder)
No dashboard, no charts. Her Apple Watch morning summary appears inside the chat: slept 1h less · steps low · compared with her own usual.
Quick-reply chips instead of typing: I'm fine / My knee hurts / Didn't sleep well / No appetite.
She photographs her real lunch → live AI vision analysis: calorie range, protein & veg balance, visible uncertainty, one practical suggestion.
Real voice input (server-side transcription) · English / 中文 · "I need help" starts a staged care escalation.
[Leave a large placeholder frame for a product screenshot]

CARD 6 — THE SOVEREIGNTY MOMENT (hero card, minimal)
Giant centered headline: The agent stops and asks.
Small supporting line: Knee pain → duration triage → "需要请 Elena 今天给你打电话吗？" — the agent did everything it responsibly could, then handed the decision to a human.
Two short columns: AGENTS MAY: analyse her baseline · start check-ins · triage & record · summarise for family. HUMANS DECIDE: medical escalation · contacting family · sharing data with anyone · emergency response.
Footnote: Branching, escalation stages and gating are deterministic, auditable code — never model output.

CARD 7 — The family's side: an answer, not a feed (screenshot placeholder)
On her daughter's phone: "Mum appears to be okay right now." — with evidence underneath (sleep −2h 08m · morning activity −87% · first check-in already completed), not raw data.
On desktop: a family care workspace — member profiles with scoped permissions (Mum, Dad, self, brother) · 7-day trends drawn against her personal range band · shared care schedule and family roles · an audit log including "08:16 Mum approved sharing this reply" — consent runs both directions.
Approvals queue: a telehealth suggestion paused at the high-impact gate, waiting for Elena.
[Leave a large placeholder frame for a product screenshot]

CARD 8 — Built the OPC way
This product is itself the track's thesis, proven: one person directing coding agents shipped a bilingual, two-surface, vision- and voice-enabled product in a single build day.
Timeline (from the auditable build log, original commit timestamps): 14:17 parent companion live → 14:53 family dashboard + meal vision → 15:21 bilingual sync + responsive family workspace.
Engineering stance: deterministic rules decide every consequential step; models only see meals, transcribe voice, and word messages; graceful degradation without API keys — the demo never depends on a model to stay safe.
Verified: lint · production build · server-rendered tests for both surfaces.

CARD 9 — Business: three phases (all pricing stated as hypotheses)
Phase 1 · Family subscription (B2C, bring-your-own-wearable): Free daily digest; Pro ≈ S$29/month per elder — proactive check-ins, escalation chain, multi-caregiver sharing, weekly change summaries. Comparable products (Daily OK, Getwello, BoundaryCare) already charge monthly for simpler loops. Wedge: cross-border families.
Phase 2 · Hardware white-label (B2B2C): ≈ S$199 device + S$39/month via telcos and insurers — one late-detected fall costs an insurer more than a year of subscriptions.
Phase 3 · Care Provider Console (B2B SaaS): seat fee per senior (hypothesis ≈ S$25/month) so one independent care coordinator can safely support several times more seniors.
Why now: 1 in 4 Singaporeans will be 65+ by 2030 · care workforce shortage · wearables everywhere · agent costs collapsing.

CARD 10 — The OPC flywheel (closing card, big type)
Three stacked statements:
1. An OPC — one person + agents built this, today.
2. For OPCs — every family kinkeeper already runs one, unpaid.
3. Creating OPCs — care professionals building real businesses on these agents.
Closing line, largest: "An OPC, built by agents, that creates more OPCs."
Footer: kinkeep-family-health.leini9591.chatgpt.site · github.com/leini8891/KinKeep · Elena · leini8891@gmail.com
```

---

## 生成后手工检查清单

1. **替换两处截图占位**（Card 5、7）：用真机截图——老人端选"膝盖有点痛"对话 + 营养卡那一帧；家属端选手机"妈妈现在基本安好"+ 桌面趋势页各一张。
2. Card 6 如果 Gamma 加了插图，删掉——这页越空越有力。
3. 全文搜一遍拼写：只能出现 **KinKeep**（不能有 Kinkeep / KinKeeper）。
4. Card 10 填上部署 URL。
5. 中文短语（"需要请 Elena 今天给你打电话吗？"等）确认没被 Gamma 翻译掉。
