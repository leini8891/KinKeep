"use client";

import Link from "next/link";
import {
  CalendarDays,
  ChartNoAxesCombined,
  CheckCircle2,
  ChevronRight,
  Footprints,
  HeartHandshake,
  HeartPulse,
  LayoutDashboard,
  ListChecks,
  MessageCircle,
  Moon,
  Phone,
  ShieldCheck,
  Sparkles,
  UserRound,
  UsersRound,
  Utensils,
} from "lucide-react";
import { useState } from "react";

type Language = "zh" | "en";
type MobileView = "safe" | "alerts" | "approvals";
type DesktopView = "overview" | "trends" | "care" | "records";
type MemberId = "mum" | "dad" | "me";
type MetricId = "activity" | "sleep" | "heart" | "routine";
type Decision = "pending" | "approved" | "declined";

const members = {
  mum: {
    initial: "陈",
    tone: "attention",
    zh: {
      relation: "妈妈",
      name: "陈阿姨",
      status: "需要留意 · 已回复",
      answer: "妈妈现在基本安好。",
      detail: "今早和她平时不太一样，但 08:16 已回复“膝盖有点痛”，暂时没有紧急信号。",
    },
    en: {
      relation: "Mum",
      name: "Mdm Tan",
      status: "Needs attention · replied",
      answer: "Mum appears to be okay right now.",
      detail: "Her morning is different from usual, but she replied at 08:16 that her knee hurts a little. There are no urgent signals right now.",
    },
  },
  dad: {
    initial: "爸",
    tone: "stable",
    zh: {
      relation: "爸爸",
      name: "陈叔叔",
      status: "状态稳定",
      answer: "爸爸今天一切如常。",
      detail: "07:52 已完成晨间散步，活动、心率和日常规律都在他的个人基线内。",
    },
    en: {
      relation: "Dad",
      name: "Mr Tan",
      status: "Stable",
      answer: "Dad is following his usual routine.",
      detail: "He completed his morning walk at 07:52. Activity, heart rate, and routine are all within his personal baseline.",
    },
  },
  me: {
    initial: "E",
    tone: "private",
    zh: {
      relation: "自己",
      name: "Elena",
      status: "共享范围正常",
      answer: "你的家庭照护设置已同步。",
      detail: "你只与家庭圈共享照护日程和紧急联系人，不共享个人健康详情。",
    },
    en: {
      relation: "Me",
      name: "Elena",
      status: "Sharing is up to date",
      answer: "Your family care settings are in sync.",
      detail: "You share only care schedules and emergency contacts with the family circle, not your personal health details.",
    },
  },
} as const;

const metrics = {
  activity: {
    zh: { label: "活动", title: "上午活动步数", summary: "今日 320 步 · 个人基线约 2,400 步", badge: "低于基线 87%" },
    en: { label: "Activity", title: "Morning activity", summary: "320 steps today · personal baseline about 2,400", badge: "87% below baseline" },
    values: [2380, 2510, 2290, 2460, 2350, 2210, 320],
    low: [1950, 2000, 1900, 1980, 1920, 1880, 1850],
    high: [2780, 2850, 2720, 2890, 2810, 2690, 2700],
  },
  sleep: {
    zh: { label: "睡眠", title: "夜间睡眠", summary: "今日 5h 12m · 个人基线约 7h 20m", badge: "少 2h 08m" },
    en: { label: "Sleep", title: "Night-time sleep", summary: "5h 12m today · personal baseline about 7h 20m", badge: "2h 08m less" },
    values: [7.4, 7.2, 7.7, 7.1, 7.5, 7.0, 5.2],
    low: [6.7, 6.7, 6.7, 6.7, 6.7, 6.7, 6.7],
    high: [8, 8, 8, 8, 8, 8, 8],
  },
  heart: {
    zh: { label: "静息心率", title: "静息心率", summary: "今日 78 bpm · 个人基线约 67 bpm", badge: "高于基线 11 bpm" },
    en: { label: "Resting HR", title: "Resting heart rate", summary: "78 bpm today · personal baseline about 67 bpm", badge: "11 bpm above baseline" },
    values: [66, 68, 65, 67, 69, 66, 78],
    low: [62, 62, 62, 62, 62, 62, 62],
    high: [71, 71, 71, 71, 71, 71, 71],
  },
  routine: {
    zh: { label: "日常规律", title: "日常规律吻合度", summary: "今日 42% · 由起床、早餐、活动与回复组成", badge: "低于平时 49%" },
    en: { label: "Routine", title: "Routine match", summary: "42% today · based on waking, breakfast, activity, and replies", badge: "49% below usual" },
    values: [92, 89, 94, 90, 87, 91, 42],
    low: [78, 78, 78, 78, 78, 78, 78],
    high: [100, 100, 100, 100, 100, 100, 100],
  },
} as const;

const dayLabels = {
  zh: ["一", "二", "三", "四", "五", "六", "日"],
  en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
} as const;

function text(language: Language, zh: string, en: string) {
  return language === "zh" ? zh : en;
}

function chartGeometry(metric: MetricId, language: Language) {
  const data = metrics[metric];
  const allValues = [...data.values, ...data.low, ...data.high];
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const padding = Math.max((max - min) * 0.18, 1);
  const lowBound = min - padding;
  const highBound = max + padding;
  const x = (index: number) => 52 + index * 90;
  const y = (value: number) => 225 - ((value - lowBound) / (highBound - lowBound)) * 170;
  const toPath = (points: [number, number][], close = false) =>
    `${points.map(([px, py], index) => `${index ? "L" : "M"} ${px.toFixed(1)} ${py.toFixed(1)}`).join(" ")}${close ? " Z" : ""}`;
  const upper = data.high.map((value, index) => [x(index), y(value)] as [number, number]);
  const lower = data.low.map((value, index) => [x(index), y(value)] as [number, number]).reverse();

  return {
    band: toPath([...upper, ...lower], true),
    line: toPath(data.values.map((value, index) => [x(index), y(value)] as [number, number])),
    points: data.values.map((value, index) => ({ x: x(index), y: y(value), label: dayLabels[language][index] })),
  };
}

function DecisionPanel({ decision, language, onDecision }: { decision: Decision; language: Language; onDecision: (decision: Decision) => void }) {
  const t = (zh: string, en: string) => text(language, zh, en);

  if (decision !== "pending") {
    const approved = decision === "approved";
    return (
      <section className="family-decision decided" aria-live="polite">
        <CheckCircle2 size={24} />
        <div>
          <strong>{approved ? t("已批准建议", "Suggestion approved") : t("已记录：暂不安排", "Decision saved: not now")}</strong>
          <p>{approved ? t("系统会准备问诊选项，但仍不会自动分享资料或完成预约。", "KinKeep will prepare consultation options, but it will not share data or complete a booking automatically.") : t("下午问候仍会继续；如情况变化，将再次通知你。", "The afternoon check-in will continue. You will be notified again if anything changes.")}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="family-decision">
      <div className="family-between"><span className="family-badge warning">{t("高影响 · 已暂停", "High impact · paused")}</span><span>08:20</span></div>
      <h3>{t("是否建议妈妈今天进行远程问诊？", "Should Mum be offered a telehealth consultation today?")}</h3>
      <p>{t("助手认为膝痛已连续出现，需要家属判断是否继续安排。现在尚未联系任何诊所。", "Her knee pain has continued for several days, so a family decision is needed. No clinic has been contacted.")}</p>
      <ul>
        <li>{t("妈妈：“这几天膝盖都有点痛。”", "Mum: ‘My knee has hurt a little for the past few days.’")}</li>
        <li>{t("今天活动低于个人基线 87%", "Activity is 87% below her personal baseline today")}</li>
        <li>{t("没有跌倒、胸闷或严重疼痛信号", "No fall, chest tightness, or severe pain signals")}</li>
      </ul>
      <p className="family-policy"><strong>{t("为什么需要你批准：", "Why your approval is required: ")}</strong>{t("医疗升级与向第三方分享信息均属于高影响行动。", "Medical escalation and third-party data sharing are high-impact actions.")}</p>
      <div className="family-actions">
        <button className="family-button primary" onClick={() => onDecision("approved")}>{t("批准建议", "Approve suggestion")}</button>
        <button className="family-button" onClick={() => onDecision("declined")}>{t("暂不安排", "Not now")}</button>
      </div>
    </section>
  );
}

function TrendChart({ metric, language }: { metric: MetricId; language: Language }) {
  const geometry = chartGeometry(metric, language);
  const metricCopy = metrics[metric][language];

  return (
    <svg className="family-chart" viewBox="0 0 640 285" role="img" aria-labelledby="trend-title trend-description">
      <title id="trend-title">{text(language, `妈妈最近七天的${metricCopy.title}`, `Mum's ${metricCopy.title.toLowerCase()} over the past seven days`)}</title>
      <desc id="trend-description">{text(language, "实际记录与陈阿姨个人正常范围的比较，今天的记录明显偏离。", "Actual readings compared with Mdm Tan's personal range. Today's reading is clearly outside that range.")}</desc>
      {[55, 140, 225].map((y) => <line key={y} className="chart-grid" x1="52" x2="592" y1={y} y2={y} />)}
      <path className="chart-band" d={geometry.band} />
      <path className="chart-line" d={geometry.line} />
      {geometry.points.map((point, index) => (
        <g key={point.label}>
          <circle className={index === geometry.points.length - 1 ? "chart-dot today" : "chart-dot"} cx={point.x} cy={point.y} r={index === geometry.points.length - 1 ? 6 : 4} />
          <text x={point.x} y="260" textAnchor="middle">{point.label}</text>
        </g>
      ))}
    </svg>
  );
}

function LanguageSwitch({ language, onChange }: { language: Language; onChange: (language: Language) => void }) {
  return (
    <div className="language-switch family-language" aria-label="Language">
      <button className={language === "en" ? "selected" : ""} onClick={() => onChange("en")} aria-pressed={language === "en"}>EN</button>
      <button className={language === "zh" ? "selected" : ""} onClick={() => onChange("zh")} aria-pressed={language === "zh"}>中文</button>
    </div>
  );
}

export function FamilyCareDashboard() {
  const [language, setLanguage] = useState<Language>("zh");
  const [mobileView, setMobileView] = useState<MobileView>("safe");
  const [desktopView, setDesktopView] = useState<DesktopView>("overview");
  const [member, setMember] = useState<MemberId>("mum");
  const [metric, setMetric] = useState<MetricId>("activity");
  const [decision, setDecision] = useState<Decision>("pending");
  const [alertRead, setAlertRead] = useState(false);
  const [calling, setCalling] = useState(false);
  const t = (zh: string, en: string) => text(language, zh, en);
  const selectedMember = members[member][language];
  const callLabel = calling ? t("正在拨打妈妈…", "Calling Mum…") : t("联系妈妈", "Call Mum");

  const callMum = () => {
    setCalling(true);
    window.setTimeout(() => setCalling(false), 1400);
  };

  return (
    <main className="family-stage" lang={language === "zh" ? "zh-CN" : "en-SG"}>
      <section className="family-mobile-shell" aria-label={t("KinKeep 家属端手机版", "KinKeep family mobile") }>
        <header className="family-mobile-header">
          <div className="family-between">
            <div className="family-brand"><span><HeartHandshake size={22} /></span><div><strong>KinKeep</strong><small>{t("上午好，Elena", "Good morning, Elena")}</small></div></div>
            <div className="family-mobile-actions"><Link className="family-button compact" href="/">{t("用户端", "User view")}</Link><LanguageSwitch language={language} onChange={setLanguage} /></div>
          </div>
          <nav className="family-mobile-tabs" aria-label={t("家属端页面", "Family views")}>
            <button className={mobileView === "safe" ? "selected" : ""} onClick={() => setMobileView("safe")} aria-pressed={mobileView === "safe"}>{t("安心", "Status")}</button>
            <button className={mobileView === "alerts" ? "selected" : ""} onClick={() => setMobileView("alerts")} aria-pressed={mobileView === "alerts"}>{t("通知", "Alerts")} <span>1</span></button>
            <button className={mobileView === "approvals" ? "selected" : ""} onClick={() => setMobileView("approvals")} aria-pressed={mobileView === "approvals"}>{t("待批准", "Approvals")} <span>1</span></button>
          </nav>
        </header>

        <div className="family-mobile-content">
          {mobileView === "safe" && (
            <>
              <section className="family-mobile-hero">
                <small>{selectedMember.relation} · {selectedMember.name}</small>
                <span className={`family-badge ${members[member].tone}`}>{selectedMember.status}</span>
                <h1>{selectedMember.answer}</h1>
                <p>{selectedMember.detail}</p>
                {member === "mum" && <div className="family-actions"><button className="family-button primary" onClick={callMum}><Phone size={17} />{callLabel}</button><button className="family-button" onClick={() => setMobileView("alerts")}><ListChecks size={17} />{t("查看依据", "View evidence")}</button></div>}
              </section>
              <section className="family-mobile-section">
                <h2>{member === "mum" ? t("为什么需要留意", "Why she needs attention") : t("今天的关键信息", "Today's key information")}</h2>
                {member === "mum" ? (
                  <div className="family-signal-list">
                    <div className="family-signal"><span><Moon size={18} /></span><div><strong>{t("睡眠比个人基线少 2 小时", "Sleep was 2 hours below her baseline")}</strong><small>{t("5 小时 12 分 · 平时约 7 小时 20 分", "5h 12m · usually about 7h 20m")}</small></div></div>
                    <div className="family-signal"><span><Footprints size={18} /></span><div><strong>{t("上午活动明显偏少", "Morning activity is much lower")}</strong><small>{t("320 步 · 平时此时约 2,400 步", "320 steps · usually about 2,400 by now")}</small></div></div>
                    <div className="family-signal"><span><MessageCircle size={18} /></span><div><strong>{t("已完成第一轮问候", "First check-in completed")}</strong><small>{t("确认在家，提到膝盖轻微不适", "She is at home and mentioned mild knee pain")}</small></div></div>
                  </div>
                ) : member === "dad" ? (
                  <div className="family-signal-list">
                    <div className="family-signal"><span><Footprints size={18} /></span><div><strong>{t("晨间散步已完成", "Morning walk completed")}</strong><small>{t("2,680 步 · 在个人正常范围内", "2,680 steps · within his personal range")}</small></div></div>
                    <div className="family-signal"><span><HeartPulse size={18} /></span><div><strong>{t("静息心率稳定", "Resting heart rate is steady")}</strong><small>{t("65 bpm · 与个人基线一致", "65 bpm · in line with his baseline")}</small></div></div>
                  </div>
                ) : (
                  <div className="family-signal-list">
                    <div className="family-signal"><span><ShieldCheck size={18} /></span><div><strong>{t("共享范围已确认", "Sharing scope confirmed")}</strong><small>{t("家人只能看到你授权的日程和联系人", "Family can only see schedules and contacts you approved")}</small></div></div>
                    <div className="family-signal"><span><UsersRound size={18} /></span><div><strong>{t("你是主要联系人", "You are the primary contact")}</strong><small>{t("负责高影响行动批准与紧急联络", "You approve high-impact actions and receive emergency updates")}</small></div></div>
                  </div>
                )}
              </section>
            </>
          )}

          {mobileView === "alerts" && (
            <section className="family-mobile-section family-stack">
              <div className="family-between"><div><h1>{t("即时通知", "Alerts")}</h1><p>{t("只推送真正需要你知道的变化", "Only meaningful changes that need your attention")}</p></div><span className="family-badge warning">{alertRead ? t("已处理", "Handled") : t("1 未处理", "1 new")}</span></div>
              <article className={`family-alert ${alertRead ? "resolved" : ""}`}>
                <div className="family-between"><strong>{t("妈妈今早偏离个人基线", "Mum is outside her morning baseline")}</strong><small>08:18</small></div>
                <p>{t("多信号同时变化，助手已完成第一轮问候。妈妈回复膝盖有点痛，没有报告头晕或胸闷。", "Several signals changed together. The companion completed a first check-in; Mum reported mild knee pain and no dizziness or chest tightness.")}</p>
                <ul><li>{t("睡眠 −2h 08m", "Sleep −2h 08m")}</li><li>{t("上午活动 −87%", "Morning activity −87%")}</li><li>{t("静息心率 +11 bpm", "Resting heart rate +11 bpm")}</li><li>{t("早餐未确认", "Breakfast not confirmed")}</li></ul>
                <div className="family-actions"><button className="family-button primary" onClick={callMum}><Phone size={17} />{callLabel}</button><button className="family-button" onClick={() => setAlertRead(true)} disabled={alertRead}>{alertRead ? t("已读", "Read") : t("我知道了", "Got it")}</button></div>
              </article>
              <article className="family-alert resolved"><div className="family-between"><strong>{t("爸爸晨间散步已完成", "Dad completed his morning walk")}</strong><small>07:52</small></div><p>{t("活动、心率和日常规律都在个人基线内。", "Activity, heart rate, and routine are all within his personal baseline.")}</p></article>
            </section>
          )}

          {mobileView === "approvals" && (
            <section className="family-mobile-section family-stack">
              <div><h1>{t("待批准行动", "Actions awaiting approval")}</h1><p>{t("高影响行动永远先交给家人决定", "High-impact actions always pause for a family decision")}</p></div>
              <DecisionPanel decision={decision} language={language} onDecision={setDecision} />
            </section>
          )}
        </div>

        <nav className="family-member-nav" aria-label={t("家庭成员", "Family members")}>
          {(Object.keys(members) as MemberId[]).map((id) => (
            <button key={id} className={member === id ? "selected" : ""} onClick={() => { setMember(id); setMobileView("safe"); }} aria-pressed={member === id}>
              {id === "mum" ? <HeartHandshake size={18} /> : id === "dad" ? <UserRound size={18} /> : <ShieldCheck size={18} />}
              {members[id][language].relation}
            </button>
          ))}
        </nav>
      </section>

      <section className="family-desktop-shell" aria-label={t("KinKeep 家属端电脑版", "KinKeep family desktop")}>
        <aside className="family-sidebar">
          <div className="family-brand"><span><HeartHandshake size={22} /></span><div><strong>KinKeep</strong><small>{t("家庭照护空间", "Family care space")}</small></div></div>
          <LanguageSwitch language={language} onChange={setLanguage} />
          <nav aria-label={t("家属端页面", "Family views")}>
            <button className={desktopView === "overview" ? "selected" : ""} onClick={() => setDesktopView("overview")} aria-pressed={desktopView === "overview"}><LayoutDashboard size={18} />{t("家庭总览", "Family overview")}</button>
            <button className={desktopView === "trends" ? "selected" : ""} onClick={() => setDesktopView("trends")} aria-pressed={desktopView === "trends"}><ChartNoAxesCombined size={18} />{t("趋势与证据", "Trends & evidence")}</button>
            <button className={desktopView === "care" ? "selected" : ""} onClick={() => setDesktopView("care")} aria-pressed={desktopView === "care"}><CalendarDays size={18} />{t("照护日程", "Care schedule")}</button>
            <button className={desktopView === "records" ? "selected" : ""} onClick={() => setDesktopView("records")} aria-pressed={desktopView === "records"}><ShieldCheck size={18} />{t("操作与权限", "Activity & access")}</button>
          </nav>
          <div className="family-household"><small>{t("当前家庭", "Current family")}</small><strong>{t("陈家 · 3 位成员", "Tan family · 3 members")}</strong><span>{t("你是主要联系人", "You are the primary contact")}</span></div>
          <Link className="family-button" href="/">{t("返回用户端", "Back to user view")}</Link>
        </aside>

        <div className="family-desktop-main">
          {desktopView === "overview" && (
            <>
              <header className="family-page-header"><div><h1>{t("家庭总览", "Family overview")}</h1><p>{t("今天 08:30 · 一眼看清谁安好、谁需要你", "Today, 08:30 · See who is okay and who needs you")}</p></div><button className="family-button" onClick={() => setDesktopView("care")}><CalendarDays size={17} />{t("查看本周日程", "View this week")}</button></header>
              <div className="family-overview-grid">
                <section className="family-panel"><h2>{t("家人状态", "Family status")}</h2><div className="family-member-list">
                  <button className="family-member-row" onClick={() => setDesktopView("trends")}><span className="family-avatar attention">陈</span><span><strong>{t("妈妈 · 陈阿姨", "Mum · Mdm Tan")}</strong><small>{t("已回复 · 在家 · 08:16 更新", "Replied · at home · updated 08:16")}</small></span><span className="family-badge attention">{t("需要留意", "Needs attention")}</span><ChevronRight size={17} /></button>
                  <div className="family-member-row"><span className="family-avatar">爸</span><span><strong>{t("爸爸 · 陈叔叔", "Dad · Mr Tan")}</strong><small>{t("晨间散步完成 · 07:52 更新", "Morning walk complete · updated 07:52")}</small></span><span className="family-badge stable">{t("状态稳定", "Stable")}</span></div>
                  <div className="family-member-row"><span className="family-avatar">E</span><span><strong>{t("自己 · Elena", "Me · Elena")}</strong><small>{t("仅共享照护日程与紧急联系人", "Shares only care schedule and emergency contacts")}</small></span><span className="family-badge private">{t("权限受限", "Limited access")}</span></div>
                </div></section>
                <section className="family-panel"><div className="family-between"><h2>{t("今天的家庭任务", "Today's family tasks")}</h2><span>2 / 3</span></div><div className="family-task-list"><div><CheckCircle2 size={18} /><span><strong>{t("爸爸晨间散步", "Dad's morning walk")}</strong><small>{t("07:52 已完成", "Completed at 07:52")}</small></span></div><div><Phone size={18} /><span><strong>{t("联系妈妈", "Call Mum")}</strong><small>{t("Elena · 午餐前", "Elena · before lunch")}</small></span></div><div><Utensils size={18} /><span><strong>{t("爸爸复诊交通", "Transport for Dad's follow-up")}</strong><small>{t("弟弟 · 周四 14:30", "Brother · Thu 14:30")}</small></span></div></div></section>
              </div>
              <div className="family-story-grid">
                <section className="family-panel family-story"><span className="family-badge attention">{t("妈妈 · 需要留意", "Mum · needs attention")}</span><h2>{t("不是单一心率报警，而是今早整体规律变了。", "This is not a single heart-rate alert. Her whole morning pattern changed.")}</h2><p>{t("睡眠、活动、静息心率和早餐规律同时偏离个人基线；她已回复并确认在家，因此当前是“需要家人跟进”，不是紧急状态。", "Sleep, activity, resting heart rate, and breakfast routine all moved away from her baseline. She replied and confirmed she is at home, so this needs family follow-up rather than emergency action.")}</p><div className="family-actions"><button className="family-button primary" onClick={() => setDesktopView("trends")}>{t("查看异常证据", "View evidence")}</button><button className="family-button" onClick={callMum}><Phone size={17} />{callLabel}</button></div></section>
                <section className="family-panel"><div className="family-between"><h2>{t("待批准", "Awaiting approval")}</h2><span className="family-badge warning">1</span></div><p>{t("远程问诊建议已在高影响行动闸门暂停，等待你的决定。", "A telehealth suggestion is paused at the high-impact action gate, waiting for your decision.")}</p><button className="family-button" onClick={() => setDesktopView("records")}>{t("前往处理", "Review action")} <ChevronRight size={17} /></button></section>
              </div>
            </>
          )}

          {desktopView === "trends" && (
            <>
              <header className="family-page-header"><div><h1>{t("趋势与证据", "Trends & evidence")}</h1><p>{t("妈妈 · 最近 7 天，与她自己的日常基线比较", "Mum · past 7 days compared with her personal baseline")}</p></div><div className="family-segmented" aria-label={t("趋势指标", "Trend metric")}>{(Object.keys(metrics) as MetricId[]).map((id) => <button key={id} className={metric === id ? "selected" : ""} onClick={() => setMetric(id)} aria-pressed={metric === id}>{metrics[id][language].label}</button>)}</div></header>
              <div className="family-trend-grid">
                <section className="family-panel family-chart-panel"><div className="family-between"><div><h2>{metrics[metric][language].title}</h2><p>{metrics[metric][language].summary}</p></div><span className="family-badge warning">{metrics[metric][language].badge}</span></div><TrendChart metric={metric} language={language} /><div className="family-chart-legend"><span><i className="baseline" />{t("个人正常范围", "Personal range")}</span><span><i />{t("实际记录", "Actual")}</span></div></section>
                <aside className="family-panel family-evidence"><div><h2>{t("今天为何被标记", "Why today was flagged")}</h2><p>{t("风险来自多信号一起变化，不由任何单个数字决定。", "The flag comes from several signals changing together, not any single number.")}</p></div><div><strong>{t("睡眠", "Sleep")}</strong><small>{t("5h 12m，对比个人基线 −2h 08m", "5h 12m, 2h 08m below personal baseline")}</small></div><div><strong>{t("活动", "Activity")}</strong><small>{t("上午 320 步，对比基线 −87%", "320 morning steps, 87% below baseline")}</small></div><div><strong>{t("静息心率", "Resting heart rate")}</strong><small>{t("78 bpm，对比基线 +11 bpm", "78 bpm, 11 bpm above baseline")}</small></div><div><strong>{t("回复与规律", "Replies & routine")}</strong><small>{t("延迟 26 分钟回复；早餐尚未确认", "Reply was 26 minutes later than usual; breakfast not confirmed")}</small></div><button className="family-button primary" onClick={callMum}><Phone size={17} />{callLabel}</button></aside>
              </div>
            </>
          )}

          {desktopView === "care" && (
            <>
              <header className="family-page-header"><div><h1>{t("照护日程", "Care schedule")}</h1><p>{t("把家庭分工放在同一个清楚的时间线上", "Keep the family's care responsibilities on one clear timeline")}</p></div></header>
              <div className="family-week-strip">{[12, 13, 14, 15, 16, 17, 18].map((date, index) => <span key={date} className={index === 0 ? "selected" : ""}><small>{dayLabels[language][index]}</small><strong>{date}</strong></span>)}</div>
              <div className="family-care-grid"><section className="family-panel"><h2>{t("今天", "Today")}</h2><div className="family-care-list"><div><span><Phone size={18} /></span><div><strong>{t("10:30 · 联系妈妈", "10:30 · Call Mum")}</strong><small>{t("确认膝盖与早餐情况", "Check her knee and breakfast")}</small></div><em>Elena</em></div><div><span><Utensils size={18} /></span><div><strong>{t("12:00 · 午餐提醒", "12:00 · Lunch reminder")}</strong><small>{t("由陪伴助手自动跟进", "Companion follows up automatically")}</small></div><em>{t("助手", "Companion")}</em></div><div><span><MessageCircle size={18} /></span><div><strong>{t("15:00 · 再次问候", "15:00 · Follow-up check-in")}</strong><small>{t("如仍不适，再通知家属", "Notify family if she still feels unwell")}</small></div><em>{t("助手", "Companion")}</em></div><div><span><CalendarDays size={18} /></span><div><strong>{t("18:30 · 送杂货", "18:30 · Grocery delivery")}</strong><small>{t("牛奶、鸡蛋、豆腐", "Milk, eggs, tofu")}</small></div><em>{t("弟弟", "Brother")}</em></div></div></section><aside className="family-panel family-assignments"><h2>{t("本周家庭分工", "This week's roles")}</h2><div><strong>Elena</strong><span>{t("3 项", "3 tasks")}</span><small>{t("主要联系、批准高影响行动", "Primary contact and high-impact approvals")}</small></div><div><strong>{t("弟弟", "Brother")}</strong><span>{t("2 项", "2 tasks")}</span><small>{t("交通、杂货与周末探访", "Transport, groceries, and weekend visits")}</small></div><div><strong>{t("陪伴助手", "Companion")}</strong><span>{t("7 项", "7 tasks")}</span><small>{t("提醒、日常问候、摘要", "Reminders, routine check-ins, and summaries")}</small></div></aside></div>
            </>
          )}

          {desktopView === "records" && (
            <>
              <header className="family-page-header"><div><h1>{t("操作与权限", "Activity & access")}</h1><p>{t("谁看过、谁决定、系统做了什么，都有清楚记录", "See who viewed, who decided, and what KinKeep did")}</p></div></header>
              <div className="family-record-grid"><section className="family-panel"><h2>{t("今天的操作记录", "Today's activity")}</h2><div className="family-record-list"><div><time>08:20</time><span><strong>{t("远程问诊建议已暂停", "Telehealth suggestion paused")}</strong><small>{t("高影响行动 · 等待 Elena 决定", "High-impact action · waiting for Elena")}</small></span></div><div><time>08:18</time><span><strong>{t("Elena 收到异常通知", "Elena received an alert")}</strong><small>{t("包含 4 项基线变化与妈妈的回复摘要", "Included four baseline changes and Mum's reply summary")}</small></span></div><div><time>08:16</time><span><strong>{t("妈妈授权分享本次回复", "Mum approved sharing this reply")}</strong><small>{t("仅家庭圈 · 未分享给第三方", "Family circle only · not shared with third parties")}</small></span></div><div><time>08:05</time><span><strong>{t("陪伴助手发起日常问候", "Companion started a routine check-in")}</strong><small>{t("常规行动 · 无需家属批准", "Routine action · no family approval required")}</small></span></div></div></section><aside className="family-panel family-permissions"><h2>{t("家庭权限", "Family access")}</h2><div><strong>{t("Elena · 主要联系人", "Elena · primary contact")}</strong><small>{t("查看全部摘要、异常证据、批准行动", "Can view summaries and evidence and approve actions")}</small></div><div><strong>{t("弟弟 · 协作家属", "Brother · family collaborator")}</strong><small>{t("查看日程与任务；不看详细健康数据", "Can view schedules and tasks, not detailed health data")}</small></div><div><strong>{t("陈阿姨 · 本人", "Mdm Tan · account owner")}</strong><small>{t("可随时调整共享范围与联系人", "Can change sharing scope and contacts at any time")}</small></div></aside></div>
              <DecisionPanel decision={decision} language={language} onDecision={setDecision} />
            </>
          )}
        </div>
      </section>

      <footer className="family-disclaimer"><Sparkles size={15} />{t("演示数据 · 非医疗诊断 · 高影响行动由家人决定", "Demo data · not medical diagnosis · family decides high-impact actions")}</footer>
    </main>
  );
}
