# KinKeep · OpenAI Build Week 3 分钟路演讲稿（幻灯片版）

当前幻灯片源：`public/presentation.html`。<br>
目标时长：**2:50–3:00**。<br>
推荐方式：**默认不切 live demo**。第 4 页已经内置双端产品流程演示，三分钟内直接讲这一页更稳。

> OpenAI Build Week 的主讲稿与 live-demo 点击路径以 `OPENAI_BUILD_WEEK_3MIN_PITCH.md` 为准。本文件是不用切现场产品时的幻灯片版本；`PITCH_DECK.md` 是早期内容规划。
> 本稿按六个讲述段落组织；HTML 中的产品流程占两页，商业模式与结尾也各占一页，因此视觉上共有八页。

---

## 你到底在 pitch 什么？

你不是在介绍一个“健康 App 功能大全”，也不是在推销“AI 医生”。

你只需要讲清楚三个意思：

1. **我不能每天守着妈妈，但数据本身也不会照顾她。**
2. **KinKeep 会先完成日常确认，到重要决定时停下来问人。**
3. **OpenAI Build Week 期间，我用 Codex 把原型扩展成一个可验证的完整照护闭环。**

一句大白话版本：

> **KinKeep 先替我问妈妈发生了什么，再告诉我需不需要介入；AI 做执行，人保留判断。**

---

# 上台逐页怎么讲

## Slide 1 · 我为什么做 KinKeep（0:00–0:25）

### 你想表达什么

我妈妈住得远，我不能每天都在，但我又会担心她。

### 直接照着讲

> **Hi, I’m Elena. My mum lives far away.**<br>
> In my family, I’m the one who calls and coordinates her care.<br>
> But I cannot always be there.<br>
> **KinKeep is for that day.**<br>
> It checks in with her first, and tells me when I am really needed.

### 中文意思

大家好，我是 Elena。我妈妈住得很远。在我们家，我是那个记得她吃药、打电话、协调照护的人。但我不可能一直都在。KinKeep 就是为这种时候做的：它先去确认妈妈的情况，真正需要我的时候再告诉我。

### 台上动作

- 前三句看评委，不要看屏幕。
- 说到 **“KinKeep is for that day”** 时停半秒。
- 不要解释 Logo，也不要讲功能。

---

## Slide 2 · 为什么有手表数据还不够（0:25–0:52）

### 你想表达什么

手表给了很多数字，但数字不会完成照护。

### 直接照着讲

> Wearables already give us data.<br>
> But **data is not care**.<br>
> These three changes happened on the same morning: less sleep, much less activity, and breakfast not confirmed.<br>
> A dashboard shows the numbers. It does not ask how Mum feels or tell me what to do next.<br>
> **That is the gap KinKeep closes.**

### 中文意思

穿戴设备早就能给我们数据，但数据不等于照护。同一个早晨，妈妈睡少了、活动大幅下降、早餐还没有确认。普通 dashboard 只能显示数字，不会问妈妈感觉怎么样，也不会告诉我接下来怎么办。这就是 KinKeep 要补上的缺口。

### 台上动作

- 手从左到右指一下三个数字，只指一次。
- “data is not care” 放慢。
- 不需要念数字的具体数值。

---

## Slides 3–4 · KinKeep 实际怎么工作（0:52–1:27）

### 你想表达什么

妈妈得到的是一场简单对话，家人得到的是一个明确结论，不是另一堆数据。

### 直接照着讲

> KinKeep has two sides.<br>
> Mum sees a simple conversation, not charts.<br>
> It notices that her morning is different, asks about her knee, and follows up.<br>
> When the pain has lasted for days, it asks permission before contacting me.<br>
> On my side, I get one answer: Mum appears okay, here is the evidence, and here is the one decision that needs me.

### 中文意思

KinKeep 有两个端。妈妈那边没有图表，打开就是简单对话。它发现妈妈今天早上和平时不一样，就询问膝盖情况并继续追问。当妈妈说已经痛了几天，它会问她要不要让 Elena 打电话。我的家属端不会再给我一堆数据，而是直接告诉我：妈妈现在基本安好、判断依据是什么，以及现在有什么决定需要我做。

### 台上动作

- 说 Mum’s side 时指左边手机截图。
- 说 my side 时指右边家属端截图。
- **默认不要在这里切 live demo。** 截图已经足够证明产品存在。

---

## Slide 5 · 全场最重要的一页（1:27–2:00）

### 你想表达什么

KinKeep 的创新不是让 agent 什么都做，而是明确知道什么时候必须停下来问人。

### 直接照着讲

> **This is the most important idea in KinKeep.**<br>
> The agent noticed the change, asked questions, and prepared the next step.<br>
> **Then it stopped and asked Mum for permission.**<br>
> 〔停一秒〕<br>
> In family care, more autonomy is not always better.<br>
> Agents do routine work. Humans decide who to contact, what to share, and when to escalate.<br>
> These boundaries are deterministic rules, not AI guesses.

### 中文意思

这是 KinKeep 最重要的设计。Agent 发现变化、询问情况、准备下一步，然后它停下来，先征得妈妈同意。在家庭照护里，自主程度并不是越高越好。Agent 可以做日常执行，但联系谁、分享什么、什么时候升级，应该由人决定。这些边界是确定性规则，不是 AI 猜出来的。

### 台上动作

- **“Then it stopped” 是整场最重要的四个词。**
- 说完后真的停一秒。
- 不要再增加医疗、隐私、合规的长解释。

---

## Slide 6 · OpenAI Build Week 新增了什么（2:00–2:31）

### 你想表达什么

明确区分原有原型与 Build Week 新增工作，并说明 Codex 如何加速交付，但产品判断仍由你负责。

### 直接照着讲

> KinKeep existed before OpenAI Build Week.<br>
> During Build Week, I used Codex to complete the Care Episode Loop, shared parent-and-family state, consent-led family contact, safer check-ins, and expanded verification.<br>
> Codex accelerated implementation. **I stayed responsible** for product scope, safety, review, and integration.<br>
> The result is verifiable through Git history, the deployed product, and twelve passing tests.

### 中文意思

KinKeep 在 OpenAI Build Week 之前已经有原型。Build Week 期间，我用 Codex 完成了 Care Episode Loop、老人端与家属端的共享状态、基于同意的家属联系、更安全的问候流程和更完整的验证。Codex 加速实现，我仍对产品范围、安全、审查和整合负责。结果可以通过 Git 历史、正式部署和十二项通过的测试验证。

### 台上动作

- 时间线只扫一眼，不逐个解释五个 commit。
- 重音放在 **“I stayed responsible”**。
- 评委要听到的是：agent 做执行，你承担判断和责任。

---

## Slides 7–8 · 商业模式和收尾（2:31–2:58）

### 你想表达什么

先从为远距离照护家庭减少担忧开始；最后回到“AI 执行，人判断”。

### 直接照着讲

> Our first customer is an adult child caring from another home or country.<br>
> Our first business hypothesis is a family subscription, around twenty-nine Singapore dollars per elder each month, for proactive check-ins and family coordination.<br>
> We earn trust at home before expanding through partners or professional care workflows.<br>
> **The agent does the checking. The human keeps the judgment.**<br>
> Thank you.

### 中文意思

我们的第一类用户，是住在另一个家、甚至另一个国家照顾父母的成年子女。第一个商业假设是家庭订阅，每位老人每月约 29 新币，提供主动问候和家庭协作。我们先在家庭场景建立信任，再考虑合作伙伴和专业照护流程。Agent 负责确认，人保留判断。谢谢。

### 台上动作

- S$29 要说成 **“twenty-nine Singapore dollars”**，不要说 “S dollar twenty-nine”。
- 最后一句放慢。
- “Thank you” 后停住，看评委，不要继续补充功能。

---

# 完整英文稿（连续练习版）

> Hi, I’m Elena. My mum lives far away. In my family, I’m the one who calls and coordinates her care. But I cannot always be there. KinKeep is for that day. It checks in with her first, and tells me when I am really needed.
>
> Wearables already give us data. But data is not care. These three changes happened on the same morning: less sleep, much less activity, and breakfast not confirmed. A dashboard shows the numbers. It does not ask how Mum feels or tell me what to do next. That is the gap KinKeep closes.
>
> KinKeep has two sides. Mum sees a simple conversation, not charts. It notices that her morning is different, asks about her knee, and follows up. When the pain has lasted for days, it asks permission before contacting me. On my side, I get one answer: Mum appears okay, here is the evidence, and here is the one decision that needs me.
>
> This is the most important idea in KinKeep. The agent noticed the change, asked questions, and prepared the next step. Then it stopped and asked Mum for permission. In family care, more autonomy is not always better. Agents do routine work. Humans decide who to contact, what to share, and when to escalate. These boundaries are deterministic rules, not AI guesses.
>
> KinKeep existed before OpenAI Build Week. During Build Week, I used Codex to complete the Care Episode Loop, shared parent-and-family state, consent-led family contact, safer check-ins, and expanded verification. Codex accelerated implementation. I stayed responsible for product scope, safety, review, and integration. The result is verifiable through Git history, the deployed product, and twelve passing tests.
>
> Our first customer is an adult child caring from another home or country. Our first business hypothesis is a family subscription, around twenty-nine Singapore dollars per elder each month, for proactive check-ins and family coordination. We earn trust at home before expanding through partners or professional care workflows. The agent does the checking. The human keeps the judgment. Thank you.

---

# 如果评委明确要求 live demo

不要在完整讲稿之外再加 40 秒。Live demo 必须**替换 Slides 3–4 的部分讲稿**。

## 25 秒版本

提前准备：

- 老人端已经同步完成，并停在“需要请 Elena 今天给你打电话吗？”
- 家属端在另一个已打开的 tab。
- 不从连接 Apple Watch 开始，不演示语音，不演示餐食分析。

现场说：

> “Here is Mum’s side. The agent has checked her knee, and now it asks for permission before contacting me.”

点击“好的，请联系”，切家属端：

> “And this is my side: one answer, the evidence, and one decision—not another feed.”

马上回到 Slide 5：

> “The important part is what happened before the notification: the agent stopped and asked.”

如果切换或加载失败，直接说：

> “The screenshots show the same verified flow, so I’ll continue with the decision boundary.”

然后继续 Slide 5，不道歉，不排查网络。

---

# 最容易记住的六句话

如果来不及背全文，只背每页这一句：

1. **KinKeep is for that day.**
2. **Data is not care.**
3. **Mum gets a conversation. I get one answer.**
4. **Then it stopped and asked Mum for permission.**
5. **Codex accelerated implementation. I stayed responsible.**
6. **The agent does the checking. The human keeps the judgment.**

---

# 评委 Q&A 简单回答

## 和 Apple Health 有什么不同？

> Apple Health shares readings. KinKeep completes the first check-in and prepares one family decision.

## 这是医疗诊断吗？

> No. KinKeep is non-diagnostic. Deterministic rules control the care flow, and people approve every consequential action.

## 为什么需要 AI？

> AI makes the interaction natural and accessible. It helps with conversation, transcription, and meal understanding. It does not decide the risk level or the high-impact action.

## 数据和隐私怎么办？

> The demo uses synthetic data. The product design requires consent before sharing replies or contacting family, with an audit trail.

## 你真的一个人做的吗？

> Yes. I owned the product decisions and used Codex to implement, test, and integrate the product. The Git history shows the build process.

## 商业模式验证了吗？

> Not yet. S$29 is a pricing hypothesis. The next step is to validate willingness to pay and retention with cross-border families.

---

# 不要说这些

- 不要说已经接入真实 Apple Watch / HealthKit；当前是 simulated data。
- 不要说 KinKeep 会自动发送 WhatsApp、SMS、拨号或联系急救；当前 WhatsApp 路径只会打开预填消息，仍由用户选择联系人并按下 Send。
- 不要说 KinKeep 会诊断疾病或判断治疗方案。
- 不要说已经有真实用户、收入、医院或保险合作。
- 不要把 S$29 说成已经验证的价格；它是 hypothesis。
- 不要说 agent “fully autonomous”。你的核心恰恰是它知道何时停下来。
