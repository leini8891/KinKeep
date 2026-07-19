"use client";

import Link from "next/link";
import {
  Bell,
  CalendarDays,
  ChartNoAxesCombined,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Footprints,
  HeartHandshake,
  HeartPulse,
  Home,
  LayoutDashboard,
  ListChecks,
  MessageCircle,
  Moon,
  Phone,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Utensils,
} from "lucide-react";
import { useEffect, useState } from "react";
import { CareEscalationCard } from "../care-escalation-card";
import {
  ESCALATION_EVENT,
  isCareEscalationAcknowledged,
  readCareEscalation,
  saveCareEscalation,
  type CareEscalation,
} from "../care-escalation";
import {
  CARE_EPISODE_EVENT,
  carePlans,
  createCareEpisode,
  readCareEpisode,
  saveCareEpisode,
  type CareEpisode,
  type CarePlanId,
} from "../care-episode";
import { demoScenarioDate, morningHealthFixture } from "../demo-health-data";
import { CareEpisodePanel } from "./care-episode-panel";

type Language = "zh" | "en";
type MobileView = "safe" | "alerts" | "followup" | "family";
type DesktopView = "overview" | "followup" | "alerts" | "trends" | "care" | "records";
type MemberId = "mum" | "dad";
type MetricId = "activity" | "sleep" | "heart" | "routine";

const members = {
  mum: {
    initial: "陈",
    tone: "attention",
    zh: {
      relation: "妈妈",
      name: "陈阿姨",
      status: "需要留意 · 已回复",
      answer: "妈妈现在基本安好。",
      detail: `今早和她平时不太一样，但 ${morningHealthFixture.parentReplyAt} 已回复“膝盖有点痛”，暂时没有紧急信号。`,
    },
    en: {
      relation: "Mum",
      name: "Mdm Tan",
      status: "Needs attention · replied",
      answer: "Mum appears to be okay right now.",
      detail: `Her morning is different from usual, but she replied at ${morningHealthFixture.parentReplyAt} that her knee hurts a little. There are no urgent signals right now.`,
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
} as const;

const demoWanderingEscalation: CareEscalation = {
  id: "care-demo-wandering",
  kind: "wandering",
  initialContact: "david",
  stage: "primary_multichannel",
  reasonZh: "离开安全区域后未回应，可能迷路",
  reasonEn: "Left the safe zone and did not respond; may be lost",
  startedAt: "2026-07-12T08:24:00+08:00",
  lastLocation: "Toa Payoh MRT Exit B",
  heartRate: 95,
  deviceBattery: 85,
};

const metrics = {
  activity: {
    zh: { label: "活动", title: "上午活动步数", summary: `今日 ${morningHealthFixture.steps.value} 步 · 个人基线约 ${morningHealthFixture.steps.baseline.toLocaleString("en-US")} 步`, badge: `低于基线 ${morningHealthFixture.steps.deltaPercent}%` },
    en: { label: "Activity", title: "Morning activity", summary: `${morningHealthFixture.steps.value} steps today · personal baseline about ${morningHealthFixture.steps.baseline.toLocaleString("en-US")}`, badge: `${morningHealthFixture.steps.deltaPercent}% below baseline` },
    values: [2380, 2510, 2290, 2460, 2350, 2210, morningHealthFixture.steps.value],
    low: [1950, 2000, 1900, 1980, 1920, 1880, 1850],
    high: [2780, 2850, 2720, 2890, 2810, 2690, 2700],
  },
  sleep: {
    zh: { label: "睡眠", title: "夜间睡眠", summary: `今日 ${morningHealthFixture.sleep.value} · 个人基线约 ${morningHealthFixture.sleep.baseline}`, badge: `少 ${morningHealthFixture.sleep.deltaEn}` },
    en: { label: "Sleep", title: "Night-time sleep", summary: `${morningHealthFixture.sleep.value} today · personal baseline about ${morningHealthFixture.sleep.baseline}`, badge: `${morningHealthFixture.sleep.deltaEn} less` },
    values: [7.4, 7.2, 7.7, 7.1, 7.5, 7.0, 5.2],
    low: [6.7, 6.7, 6.7, 6.7, 6.7, 6.7, 6.7],
    high: [8, 8, 8, 8, 8, 8, 8],
  },
  heart: {
    zh: { label: "静息心率", title: "静息心率", summary: `今日 ${morningHealthFixture.restingHeartRate.value} bpm · 个人基线约 ${morningHealthFixture.restingHeartRate.baseline} bpm`, badge: `高于基线 ${morningHealthFixture.restingHeartRate.delta} bpm` },
    en: { label: "Resting HR", title: "Resting heart rate", summary: `${morningHealthFixture.restingHeartRate.value} bpm today · personal baseline about ${morningHealthFixture.restingHeartRate.baseline} bpm`, badge: `${morningHealthFixture.restingHeartRate.delta} bpm above baseline` },
    values: [66, 68, 65, 67, 69, 66, morningHealthFixture.restingHeartRate.value],
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
  const [profilePickerOpen, setProfilePickerOpen] = useState(false);
  const [metric, setMetric] = useState<MetricId>("activity");
  const [episode, setEpisode] = useState<CareEpisode>(createCareEpisode);
  const [alertRead, setAlertRead] = useState(false);
  const [calling, setCalling] = useState(false);
  const [escalation, setEscalation] = useState<CareEscalation>(demoWanderingEscalation);
  const [showEscalation, setShowEscalation] = useState(false);
  const t = (zh: string, en: string) => text(language, zh, en);
  const selectedMember = members[member][language];
  const callLabel = calling ? t("正在拨打妈妈…", "Calling Mum…") : t("联系妈妈", "Call Mum");
  const selectedCallLabel = calling
    ? t(`正在拨打${selectedMember.name}…`, `Calling ${selectedMember.name}…`)
    : t(`联系${selectedMember.name}`, `Call ${selectedMember.name}`);
  const openAlertCount = (showEscalation && !isCareEscalationAcknowledged(escalation) ? 1 : 0) + (alertRead ? 0 : 1);
  const activePlan = episode.selectedPlan ? carePlans[episode.selectedPlan] : null;
  const followUpCount = episode.status === "awaiting_family" ? 1 : 0;

  const callMum = () => {
    setCalling(true);
    window.setTimeout(() => setCalling(false), 1400);
  };

  useEffect(() => {
    const syncEscalation = () => {
      const storedEscalation = readCareEscalation();
      setEscalation(storedEscalation ?? demoWanderingEscalation);
      setShowEscalation(Boolean(storedEscalation));
      if (storedEscalation && !isCareEscalationAcknowledged(storedEscalation)) {
        setMobileView("alerts");
        setDesktopView("alerts");
      }
    };
    syncEscalation();
    window.addEventListener("storage", syncEscalation);
    window.addEventListener(ESCALATION_EVENT, syncEscalation);
    return () => {
      window.removeEventListener("storage", syncEscalation);
      window.removeEventListener(ESCALATION_EVENT, syncEscalation);
    };
  }, []);

  useEffect(() => {
    const syncEpisode = () => setEpisode(readCareEpisode() ?? createCareEpisode());
    syncEpisode();
    window.addEventListener("storage", syncEpisode);
    window.addEventListener(CARE_EPISODE_EVENT, syncEpisode);
    return () => {
      window.removeEventListener("storage", syncEpisode);
      window.removeEventListener(CARE_EPISODE_EVENT, syncEpisode);
    };
  }, []);

  const acknowledgeEscalation = () => {
    const acknowledgedStage = escalation.stage === "backup_notified"
      ? "backup_acknowledged"
      : escalation.stage === "primary_multichannel"
        ? "primary_multichannel_acknowledged"
        : "primary_push_acknowledged";
    const updated: CareEscalation = { ...escalation, stage: acknowledgedStage };
    setEscalation(updated);
    saveCareEscalation(updated);
  };

  const updateEpisode = (nextEpisode: CareEpisode) => {
    setEpisode(nextEpisode);
    saveCareEpisode(nextEpisode);
  };

  const approvePlan = (selectedPlan: CarePlanId) => {
    updateEpisode({
      ...episode,
      status: "active",
      selectedPlan,
      approvedAt: `${demoScenarioDate}T08:22:00+08:00`,
    });
  };

  const pauseEpisode = () => {
    updateEpisode({ ...episode, status: "paused", selectedPlan: undefined });
  };

  const simulateFollowUp = () => {
    updateEpisode({
      ...episode,
      status: "resolved",
      resolvedAt: `${demoScenarioDate}T15:00:00+08:00`,
    });
  };

  const resetEpisode = () => {
    updateEpisode(createCareEpisode());
  };

  const openWanderingDemo = () => {
    setShowEscalation(true);
    const freshDemo = { ...demoWanderingEscalation, stage: "primary_multichannel" as const };
    setEscalation(freshDemo);
    saveCareEscalation(freshDemo);
  };

  return (
    <main className="family-stage" lang={language === "zh" ? "zh-CN" : "en-SG"}>
      <section className="family-mobile-shell" aria-label={t("KinKeep 家属端手机版", "KinKeep family mobile") }>
        <header className="family-mobile-header">
          <div className="family-between">
            <div className="family-brand"><span><HeartHandshake size={22} /></span><div><strong>KinKeep</strong><small>{t("上午好，Elena", "Good morning, Elena")}</small></div></div>
            <div className="family-mobile-actions"><Link className="family-button compact" href="/">{t("用户端", "User view")}</Link><LanguageSwitch language={language} onChange={setLanguage} /></div>
          </div>
        </header>

        <div className="family-mobile-content">
          {mobileView === "safe" && (
            <>
              <section className="family-profile-control" aria-label={t("当前健康档案", "Current health profile")}>
                <small>{t("当前健康档案", "Current health profile")}</small>
                <button
                  className="family-profile-selector"
                  onClick={() => setProfilePickerOpen((open) => !open)}
                  aria-expanded={profilePickerOpen}
                  aria-controls="family-profile-picker"
                >
                  <span className={`family-avatar ${members[member].tone}`}>{members[member].initial}</span>
                  <span className="family-profile-selector-copy">
                    <strong>{selectedMember.name}</strong>
                    <small>{selectedMember.relation} · {selectedMember.status}</small>
                  </span>
                  <ChevronDown size={20} aria-hidden="true" />
                </button>
                {profilePickerOpen && (
                  <div id="family-profile-picker" className="family-profile-picker" aria-label={t("选择健康档案", "Choose a health profile")}>
                    <div className="family-between"><strong>{t("选择健康档案", "Choose a health profile")}</strong><small>{t("2 个档案", "2 profiles")}</small></div>
                    {(Object.keys(members) as MemberId[]).map((id) => (
                      <button
                        key={id}
                        className={member === id ? "selected" : ""}
                        onClick={() => { setMember(id); setProfilePickerOpen(false); }}
                        aria-pressed={member === id}
                      >
                        <span className={`family-avatar ${members[id].tone}`}>{members[id].initial}</span>
                        <span><strong>{members[id][language].name}</strong><small>{members[id][language].relation} · {members[id][language].status}</small></span>
                        {member === id && <CheckCircle2 size={18} aria-hidden="true" />}
                      </button>
                    ))}
                    <button className="family-profile-more" onClick={() => { setProfilePickerOpen(false); setMobileView("family"); }}>
                      <UsersRound size={18} />{t("查看全部健康档案", "View all health profiles")}<ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </section>
              <section className="family-mobile-hero">
                <span className={`family-badge ${members[member].tone}`}>{selectedMember.status}</span>
                <h1>{selectedMember.answer}</h1>
                <p>{selectedMember.detail}</p>
                <div className="family-actions"><button className="family-button primary" onClick={callMum}><Phone size={17} />{selectedCallLabel}</button>{member === "mum" && <button className="family-button" onClick={() => setMobileView("followup")}><ListChecks size={17} />{t("查看并处理", "Review & act")}</button>}</div>
              </section>
              <section className="family-mobile-section">
                <h2>{member === "mum" ? t("为什么需要留意", "Why she needs attention") : t("今天的关键信息", "Today's key information")}</h2>
                {member === "mum" ? (
                  <div className="family-signal-list">
                    <div className="family-signal"><span><Moon size={18} /></span><div><strong>{t(`睡眠比个人基线少 ${morningHealthFixture.sleep.deltaZh}`, `Sleep was ${morningHealthFixture.sleep.deltaEn} below her baseline`)}</strong><small>{t(`${morningHealthFixture.sleep.value} · 平时约 ${morningHealthFixture.sleep.baseline}`, `${morningHealthFixture.sleep.value} · usually about ${morningHealthFixture.sleep.baseline}`)}</small></div></div>
                    <div className="family-signal"><span><Footprints size={18} /></span><div><strong>{t("上午活动明显偏少", "Morning activity is much lower")}</strong><small>{t(`${morningHealthFixture.steps.value} 步 · 平时此时约 ${morningHealthFixture.steps.baseline.toLocaleString("en-US")} 步`, `${morningHealthFixture.steps.value} steps · usually about ${morningHealthFixture.steps.baseline.toLocaleString("en-US")} by now`)}</small></div></div>
                    <div className="family-signal"><span><MessageCircle size={18} /></span><div><strong>{t("已完成第一轮问候", "First check-in completed")}</strong><small>{t("确认在家，提到膝盖轻微不适", "She is at home and mentioned mild knee pain")}</small></div></div>
                  </div>
                ) : (
                  <div className="family-signal-list">
                    <div className="family-signal"><span><Footprints size={18} /></span><div><strong>{t("晨间散步已完成", "Morning walk completed")}</strong><small>{t("2,680 步 · 在个人正常范围内", "2,680 steps · within his personal range")}</small></div></div>
                    <div className="family-signal"><span><HeartPulse size={18} /></span><div><strong>{t("静息心率稳定", "Resting heart rate is steady")}</strong><small>{t("65 bpm · 与个人基线一致", "65 bpm · in line with his baseline")}</small></div></div>
                  </div>
                )}
              </section>
            </>
          )}

          {mobileView === "alerts" && (
            <section className="family-mobile-section family-stack">
              <div><h1>{t("即时通知", "Alerts")}</h1><p>{t("按紧急程度集中显示需要你知道的变化", "Meaningful changes are grouped here by urgency")}</p></div>
              {showEscalation ? (
                <CareEscalationCard escalation={escalation} language={language} audience="family" onAcknowledge={acknowledgeEscalation} />
              ) : (
                <section className="family-safety-demo">
                  <span className="family-badge stable">{t("其他智能监测场景", "Another smart monitoring scenario")}</span>
                  <h2>{t("KinKeep 也能识别可能的走失风险", "KinKeep can also detect possible wandering risk")}</h2>
                  <p>{t("综合安全区域、回应状态、位置、心率和设备电量，不靠单一定位点判断。", "It combines safe-zone status, replies, location, heart rate, and device battery instead of relying on one location point.")}</p>
                  <button className="family-button" type="button" onClick={openWanderingDemo}>{t("体验走失监测", "Try wandering detection")}</button>
                </section>
              )}
              <article className={`family-alert ${alertRead ? "resolved" : ""}`}>
                <div className="family-between"><strong>{t("妈妈今早偏离个人基线", "Mum is outside her morning baseline")}</strong><small>08:18</small></div>
                <p>{t("多信号同时变化，助手已完成第一轮问候。妈妈回复膝盖有点痛，没有报告头晕或胸闷。", "Several signals changed together. The companion completed a first check-in; Mum reported mild knee pain and no dizziness or chest tightness.")}</p>
                <ul><li>{t("睡眠 −2h 08m", "Sleep −2h 08m")}</li><li>{t("上午活动 −87%", "Morning activity −87%")}</li><li>{t("静息心率 +11 bpm", "Resting heart rate +11 bpm")}</li><li>{t("早餐未确认", "Breakfast not confirmed")}</li></ul>
                <div className="family-actions"><button className="family-button primary" onClick={callMum}><Phone size={17} />{callLabel}</button><button className="family-button" onClick={() => setAlertRead(true)} disabled={alertRead}>{alertRead ? t("已读", "Read") : t("我知道了", "Got it")}</button></div>
              </article>
              <article className="family-alert resolved"><div className="family-between"><strong>{t("爸爸晨间散步已完成", "Dad completed his morning walk")}</strong><small>07:52</small></div><p>{t("活动、心率和日常规律都在个人基线内。", "Activity, heart rate, and routine are all within his personal baseline.")}</p></article>
            </section>
          )}

          {mobileView === "followup" && (
            <section className="family-mobile-section family-stack">
              <div><h1>{t("今日跟进", "Today's follow-up")}</h1><p>{t("从判断依据，到家人决定，再到任务与复查", "From evidence to a family decision, tasks, and follow-up")}</p></div>
              <CareEpisodePanel
                episode={episode}
                language={language}
                onApprove={approvePlan}
                onPause={pauseEpisode}
                onSimulateFollowUp={simulateFollowUp}
                onReset={resetEpisode}
              />
            </section>
          )}

          {mobileView === "family" && (
            <section className="family-mobile-section family-stack family-mobile-family">
              <div><h1>{t("家庭", "Family")}</h1><p>{t("4 位成员 · 2 个健康档案 · 2 位家属协作者", "4 members · 2 health profiles · 2 family caregivers")}</p></div>
              <div className="family-care-circle-list">
                <div><span className="family-avatar attention">陈</span><span><strong>{t("陈阿姨", "Mdm Tan")}</strong><small>{t("妈妈 · 健康档案", "Mum · health profile")}</small></span><span className="family-badge attention">{t("需要留意", "Needs attention")}</span></div>
                <div><span className="family-avatar">爸</span><span><strong>{t("陈叔叔", "Mr Tan")}</strong><small>{t("爸爸 · 健康档案", "Dad · health profile")}</small></span><span className="family-badge stable">{t("状态稳定", "Stable")}</span></div>
                <div><span className="family-avatar">E</span><span><strong>Elena</strong><small>{t("家庭管理员 · 照护决策人", "Family admin · care decision-maker")}</small></span><span className="family-badge private">{t("权限受限", "Limited access")}</span></div>
                <div><span className="family-avatar">{t("弟", "B")}</span><span><strong>David</strong><small>{t("就近响应联系人 · 家属协作者", "Nearby responder · family caregiver")}</small></span><span className="family-badge stable">{t("住得较近", "Lives nearby")}</span></div>
              </div>
              <p className="family-mobile-family-note">{t("只有已连接健康数据的人会出现在健康档案选择器中；其他成员仍可参与照护与权限分工。", "Only people with connected health data appear in the profile selector. Other members can still share care tasks and permissions.")}</p>
            </section>
          )}
        </div>

        <nav className="family-mobile-nav" aria-label={t("家属端功能", "Family app navigation")}>
          <button className={mobileView === "safe" ? "selected" : ""} onClick={() => { setProfilePickerOpen(false); setMobileView("safe"); }} aria-pressed={mobileView === "safe"}><Home size={19} />{t("首页", "Home")}</button>
          <button className={mobileView === "alerts" ? "selected" : ""} onClick={() => { setProfilePickerOpen(false); setMobileView("alerts"); }} aria-pressed={mobileView === "alerts"}><span className="family-nav-icon"><Bell size={19} />{openAlertCount > 0 && <em>{openAlertCount}</em>}</span>{t("通知", "Alerts")}</button>
          <button className={mobileView === "followup" ? "selected" : ""} onClick={() => { setProfilePickerOpen(false); setMobileView("followup"); }} aria-pressed={mobileView === "followup"}><span className="family-nav-icon"><ShieldCheck size={19} />{followUpCount > 0 && <em>{followUpCount}</em>}</span>{t("跟进", "Follow-up")}</button>
          <button className={mobileView === "family" ? "selected" : ""} onClick={() => { setProfilePickerOpen(false); setMobileView("family"); }} aria-pressed={mobileView === "family"}><UsersRound size={19} />{t("家庭", "Family")}</button>
        </nav>
      </section>

      <section className="family-desktop-shell" aria-label={t("KinKeep 家属端电脑版", "KinKeep family desktop")}>
        <aside className="family-sidebar">
          <div className="family-brand"><span><HeartHandshake size={22} /></span><div><strong>KinKeep</strong><small>{t("家庭照护空间", "Family care space")}</small></div></div>
          <LanguageSwitch language={language} onChange={setLanguage} />
          <nav aria-label={t("家属端页面", "Family views")}>
            <button className={desktopView === "overview" ? "selected" : ""} onClick={() => setDesktopView("overview")} aria-pressed={desktopView === "overview"}><LayoutDashboard size={18} />{t("家庭总览", "Family overview")}</button>
            <button className={desktopView === "followup" ? "selected" : ""} onClick={() => setDesktopView("followup")} aria-pressed={desktopView === "followup"}><ShieldCheck size={18} />{t("今日跟进", "Today's follow-up")}{followUpCount > 0 && <span className="family-sidebar-count">{followUpCount}</span>}</button>
            <button className={desktopView === "alerts" ? "selected" : ""} onClick={() => setDesktopView("alerts")} aria-pressed={desktopView === "alerts"}><Bell size={18} />{t("通知中心", "Notifications")}{openAlertCount > 0 && <span className="family-sidebar-count">{openAlertCount}</span>}</button>
            <button className={desktopView === "trends" ? "selected" : ""} onClick={() => setDesktopView("trends")} aria-pressed={desktopView === "trends"}><ChartNoAxesCombined size={18} />{t("趋势与证据", "Trends & evidence")}</button>
            <button className={desktopView === "care" ? "selected" : ""} onClick={() => setDesktopView("care")} aria-pressed={desktopView === "care"}><CalendarDays size={18} />{t("照护日程", "Care schedule")}</button>
            <button className={desktopView === "records" ? "selected" : ""} onClick={() => setDesktopView("records")} aria-pressed={desktopView === "records"}><ShieldCheck size={18} />{t("操作与权限", "Activity & access")}</button>
          </nav>
          <div className="family-household"><small>{t("当前家庭", "Current family")}</small><strong>{t("陈家 · 4 位成员", "Tan family · 4 members")}</strong><span>{t("2 个健康档案 · 2 位家属协作者", "2 health profiles · 2 family caregivers")}</span></div>
          <Link className="family-button" href="/">{t("返回用户端", "Back to user view")}</Link>
        </aside>

        <div className="family-desktop-main">
          {desktopView === "overview" && (
            <>
              <header className="family-page-header"><div><h1>{t("家庭总览", "Family overview")}</h1><p>{t("今天 08:30 · 先看家人是否安好，再处理需要你的事", "Today, 08:30 · Check everyone's wellbeing, then act where needed")}</p></div><button className="family-button" onClick={() => setDesktopView("care")}><CalendarDays size={17} />{t("查看本周日程", "View this week")}</button></header>

              <section className="family-panel family-health-overview">
                <div className="family-between"><div><h2>{t("家人健康概览", "Family health overview")}</h2><p>{t("只展示已连接健康数据的档案", "Only profiles with connected health data")}</p></div><span>{t("2 个健康档案", "2 health profiles")}</span></div>
                <div className="family-health-card-grid">
                  <button className="family-health-card attention" onClick={() => setDesktopView("followup")}>
                    <span className="family-health-card-heading"><span className="family-avatar attention">陈</span><span><strong>{t("妈妈 · 陈阿姨", "Mum · Mdm Tan")}</strong><small>{t(`已回复 · 在家 · ${morningHealthFixture.parentReplyAt} 更新`, `Replied · at home · updated ${morningHealthFixture.parentReplyAt}`)}</small></span><span className="family-badge attention">{t("需要留意", "Needs attention")}</span></span>
                    <span className="family-health-answer"><strong>{t("现在基本安好", "Appears okay right now")}</strong><small>{t("今早规律有变化，已回复膝盖有点痛，暂无紧急健康信号。", "Her morning pattern changed. She reported mild knee pain; no urgent health signals.")}</small></span>
                    <span className="family-health-signals"><span>{t(`睡眠 −${morningHealthFixture.sleep.deltaEn}`, `Sleep −${morningHealthFixture.sleep.deltaEn}`)}</span><span>{t(`活动 −${morningHealthFixture.steps.deltaPercent}%`, `Activity −${morningHealthFixture.steps.deltaPercent}%`)}</span><span>{t(`静息心率 +${morningHealthFixture.restingHeartRate.delta}`, `Resting HR +${morningHealthFixture.restingHeartRate.delta}`)}</span></span>
                    <span className="family-health-link">{t("查看今日跟进", "View today's follow-up")}<ChevronRight size={17} /></span>
                  </button>
                  <article className="family-health-card">
                    <span className="family-health-card-heading"><span className="family-avatar">爸</span><span><strong>{t("爸爸 · 陈叔叔", "Dad · Mr Tan")}</strong><small>{t("晨间散步完成 · 07:52 更新", "Morning walk complete · updated 07:52")}</small></span><span className="family-badge stable">{t("状态稳定", "Stable")}</span></span>
                    <span className="family-health-answer"><strong>{t("今天一切如常", "Following his usual routine")}</strong><small>{t("活动、静息心率和日常规律都在他的个人基线内。", "Activity, resting heart rate, and routine are within his personal baseline.")}</small></span>
                    <span className="family-health-signals"><span>{t("散步 2,680 步", "Walk 2,680 steps")}</span><span>{t("静息心率 65", "Resting HR 65")}</span><span>{t("规律正常", "Routine normal")}</span></span>
                    <span className="family-health-link stable">{t("所有关键指标均在基线内", "All key indicators are within baseline")}<CheckCircle2 size={17} /></span>
                  </article>
                </div>
              </section>

              <div className="family-overview-grid">
                <section className="family-panel">
                  <div className="family-between">
                    <h2>{t("今天的家庭任务", "Today's family tasks")}</h2>
                    <span>{activePlan ? activePlan.tasks.length : 1}</span>
                  </div>
                  <div className="family-task-list">
                    <div><CheckCircle2 size={18} /><span><strong>{t("爸爸晨间散步", "Dad's morning walk")}</strong><small>{t("07:52 已完成", "Completed at 07:52")}</small></span></div>
                    {activePlan ? activePlan.tasks.map((task) => (
                      <div key={task.id}>
                        {task.kind === "call" ? <Phone size={18} /> : task.kind === "meal" ? <Utensils size={18} /> : <MessageCircle size={18} />}
                        <span><strong>{task.time} · {t(task.titleZh, task.titleEn)}</strong><small>{t(task.ownerZh, task.ownerEn)} · {t("来自今日跟进", "From today's follow-up")}</small></span>
                      </div>
                    )) : (
                      <div><ShieldCheck size={18} /><span><strong>{t("等待 Elena 选择跟进方案", "Waiting for Elena to choose a follow-up plan")}</strong><small>{t("负责人和截止时间将在批准后创建", "Owners and deadlines will be created after approval")}</small></span></div>
                    )}
                  </div>
                </section>
                <section className="family-panel"><div className="family-between"><h2>{t("照护协作", "Care team")}</h2><span>{t("2 位家属", "2 family caregivers")}</span></div><div className="family-collaborator-list"><div><span className="family-avatar">E</span><span><strong>Elena</strong><small>{t("家庭管理员 · 批准高影响行动", "Family admin · approves high-impact actions")}</small></span></div><div><span className="family-avatar">{t("弟", "B")}</span><span><strong>{t("弟弟 · David", "Brother · David")}</strong><small>{t("就近响应 · 交通、杂货与探访", "Nearby response · transport, groceries, and visits")}</small></span></div></div></section>
              </div>
              <div className="family-story-grid">
                <section className="family-panel family-story"><span className="family-badge attention">{t("妈妈 · 需要留意", "Mum · needs attention")}</span><h2>{t("不是单一心率报警，而是今早整体规律变了。", "This is not a single heart-rate alert. Her whole morning pattern changed.")}</h2><p>{t("睡眠、活动、静息心率和早餐规律同时偏离个人基线；她已回复并确认在家，因此当前是“需要家人跟进”，不是紧急状态。", "Sleep, activity, resting heart rate, and breakfast routine all moved away from her baseline. She replied and confirmed she is at home, so this needs family follow-up rather than emergency action.")}</p><div className="family-actions"><button className="family-button primary" onClick={() => setDesktopView("trends")}>{t("查看异常证据", "View evidence")}</button><button className="family-button" onClick={callMum}><Phone size={17} />{callLabel}</button></div></section>
                <section className="family-panel">
                  <div className="family-between"><h2>{t("今日跟进", "Today's follow-up")}</h2>{followUpCount > 0 && <span className="family-badge warning">1</span>}</div>
                  <p>{episode.status === "awaiting_family" ? t("第一轮确认已完成，三个跟进方案正在等待你的决定。", "The first check is complete; three follow-up options are waiting for your decision.") : episode.status === "resolved" ? t("电话与下午复查均已完成，本次跟进已经结束。", "The call and afternoon review are complete; this follow-up is closed.") : t("方案已批准，负责人、截止时间和自动复查均已创建。", "The plan is approved; owners, deadlines, and an automatic follow-up are in place.")}</p>
                  <button className="family-button" onClick={() => setDesktopView("followup")}>{t("查看今日跟进", "View today's follow-up")} <ChevronRight size={17} /></button>
                </section>
              </div>
              <section className="family-panel family-safety-demo family-safety-demo-desktop">
                <div>
                  <span className="family-badge stable">{t("其他智能监测场景", "Another smart monitoring scenario")}</span>
                  <h2>{t("离开安全区域且长时间未回应时，KinKeep 可启动走失风险监测。", "KinKeep can detect wandering risk when someone leaves a safe zone and stops responding.")}</h2>
                  <p>{t("这个场景与今天的膝盖跟进分开演示，避免让家属同时看到两个事故。", "This scenario is demonstrated separately from today's knee follow-up, so the family does not see two incidents at once.")}</p>
                </div>
                <button className="family-button" type="button" onClick={() => { openWanderingDemo(); setDesktopView("alerts"); }}>{t("体验走失监测", "Try wandering detection")}</button>
              </section>
            </>
          )}

          {desktopView === "followup" && (
            <>
              <header className="family-page-header"><div><h1>{t("今日跟进", "Today's follow-up")}</h1><p>{t("妈妈 · 从判断依据，到家人决定，再到任务与复查", "Mum · From evidence to a family decision, tasks, and follow-up")}</p></div><button className="family-button" onClick={() => setDesktopView("care")}><CalendarDays size={17} />{t("查看照护日程", "View care schedule")}</button></header>
              <CareEpisodePanel
                episode={episode}
                language={language}
                onApprove={approvePlan}
                onPause={pauseEpisode}
                onSimulateFollowUp={simulateFollowUp}
                onReset={resetEpisode}
              />
            </>
          )}

          {desktopView === "alerts" && (
            <>
              <header className="family-page-header"><div><h1>{t("通知中心", "Notifications")}</h1><p>{t("所有需要家属知道的变化集中在这里，并按紧急程度排序", "Everything the family needs to know, grouped and ordered by urgency")}</p></div>{openAlertCount > 0 && <span className="family-badge warning">{language === "zh" ? `${openAlertCount} 条未处理` : `${openAlertCount} open`}</span>}</header>
              {showEscalation ? (
                <CareEscalationCard escalation={escalation} language={language} audience="family" onAcknowledge={acknowledgeEscalation} />
              ) : (
                <section className="family-panel family-safety-demo family-safety-demo-desktop">
                  <div><span className="family-badge stable">{t("可选演示", "Optional demo")}</span><h2>{t("走失风险监测尚未启动", "Wandering-risk monitoring is not active")}</h2><p>{t("需要时可单独演示安全区、失联和多渠道通知逻辑。", "You can demonstrate safe-zone, non-response, and multichannel notification logic separately.")}</p></div>
                  <button className="family-button" type="button" onClick={openWanderingDemo}>{t("启动演示", "Start demo")}</button>
                </section>
              )}
              <section className="family-panel family-notification-list">
                <div className="family-between"><h2>{t("其他通知", "Other notifications")}</h2><span>{t("今天", "Today")}</span></div>
                <article className={`family-desktop-notification attention ${alertRead ? "resolved" : ""}`}>
                  <span className="family-notification-icon"><HeartPulse size={19} /></span>
                  <span><strong>{t("妈妈今早偏离个人基线", "Mum is outside her morning baseline")}</strong><small>{t("睡眠、活动、静息心率和早餐规律同时变化；她已回复膝盖轻微不适。", "Sleep, activity, resting heart rate, and breakfast routine changed together; she reported mild knee pain.")}</small></span>
                  <time>08:18</time>
                  <button onClick={() => setAlertRead(true)} disabled={alertRead}>{alertRead ? t("已读", "Read") : t("标为已读", "Mark read")}</button>
                </article>
                <article className="family-desktop-notification resolved">
                  <span className="family-notification-icon"><Footprints size={19} /></span>
                  <span><strong>{t("爸爸晨间散步已完成", "Dad completed his morning walk")}</strong><small>{t("活动、心率和日常规律都在个人基线内。", "Activity, heart rate, and routine are within his personal baseline.")}</small></span>
                  <time>07:52</time>
                  <span className="family-badge stable">{t("已归档", "Archived")}</span>
                </article>
              </section>
            </>
          )}

          {desktopView === "trends" && (
            <>
              <header className="family-page-header"><div><h1>{t("趋势与证据", "Trends & evidence")}</h1><p>{t("妈妈 · 最近 7 天，与她自己的日常基线比较", "Mum · past 7 days compared with her personal baseline")}</p></div><div className="family-segmented" aria-label={t("趋势指标", "Trend metric")}>{(Object.keys(metrics) as MetricId[]).map((id) => <button key={id} className={metric === id ? "selected" : ""} onClick={() => setMetric(id)} aria-pressed={metric === id}>{metrics[id][language].label}</button>)}</div></header>
              <div className="family-trend-grid">
                <section className="family-panel family-chart-panel"><div className="family-between"><div><h2>{metrics[metric][language].title}</h2><p>{metrics[metric][language].summary}</p></div><span className="family-badge warning">{metrics[metric][language].badge}</span></div><TrendChart metric={metric} language={language} /><div className="family-chart-legend"><span><i className="baseline" />{t("个人正常范围", "Personal range")}</span><span><i />{t("实际记录", "Actual")}</span></div></section>
                <aside className="family-panel family-evidence"><div><h2>{t("今天为何被标记", "Why today was flagged")}</h2><p>{t("风险来自多信号一起变化，不由任何单个数字决定。", "The flag comes from several signals changing together, not any single number.")}</p></div><div><strong>{t("睡眠", "Sleep")}</strong><small>{t(`${morningHealthFixture.sleep.value}，对比个人基线 −${morningHealthFixture.sleep.deltaEn}`, `${morningHealthFixture.sleep.value}, ${morningHealthFixture.sleep.deltaEn} below personal baseline`)}</small></div><div><strong>{t("活动", "Activity")}</strong><small>{t(`上午 ${morningHealthFixture.steps.value} 步，对比基线 −${morningHealthFixture.steps.deltaPercent}%`, `${morningHealthFixture.steps.value} morning steps, ${morningHealthFixture.steps.deltaPercent}% below baseline`)}</small></div><div><strong>{t("静息心率", "Resting heart rate")}</strong><small>{t(`${morningHealthFixture.restingHeartRate.value} bpm，对比基线 +${morningHealthFixture.restingHeartRate.delta} bpm`, `${morningHealthFixture.restingHeartRate.value} bpm, ${morningHealthFixture.restingHeartRate.delta} bpm above baseline`)}</small></div><div><strong>{t("回复与规律", "Replies & routine")}</strong><small>{t("延迟 26 分钟回复；早餐尚未确认", "Reply was 26 minutes later than usual; breakfast not confirmed")}</small></div><button className="family-button primary" onClick={callMum}><Phone size={17} />{callLabel}</button></aside>
              </div>
            </>
          )}

          {desktopView === "care" && (
            <>
              <header className="family-page-header"><div><h1>{t("照护日程", "Care schedule")}</h1><p>{t("批准方案后，负责人、截止时间和自动复查会出现在这里", "After plan approval, owners, deadlines, and automatic follow-ups appear here")}</p></div><button className="family-button" onClick={() => setDesktopView("followup")}><ShieldCheck size={17} />{t("查看今日跟进", "View today's follow-up")}</button></header>
              <div className="family-week-strip">{[
                { date: 16, zh: "四", en: "Thu" },
                { date: 17, zh: "五", en: "Fri" },
                { date: 18, zh: "六", en: "Sat" },
                { date: 19, zh: "日", en: "Sun" },
                { date: 20, zh: "一", en: "Mon" },
                { date: 21, zh: "二", en: "Tue" },
                { date: 22, zh: "三", en: "Wed" },
              ].map((day) => <span key={day.date} className={day.date === 18 ? "selected" : ""}><small>{language === "zh" ? day.zh : day.en}</small><strong>{day.date}</strong></span>)}</div>
              <div className="family-care-grid">
                <section className="family-panel">
                  <div className="family-between"><h2>{t("今天", "Today")}</h2>{activePlan && <span className="family-badge stable">{t("来自今日跟进", "From today's follow-up")}</span>}</div>
                  <div className="family-care-list">
                    {activePlan ? activePlan.tasks.map((task) => (
                      <div key={task.id}>
                        <span>{task.kind === "call" ? <Phone size={18} /> : task.kind === "meal" ? <Utensils size={18} /> : task.kind === "research" ? <ListChecks size={18} /> : <MessageCircle size={18} />}</span>
                        <div><strong>{task.time} · {t(task.titleZh, task.titleEn)}</strong><small>{t(task.detailZh, task.detailEn)}</small></div>
                        <em>{t(task.ownerZh, task.ownerEn)}</em>
                      </div>
                    )) : (
                      <div className="family-care-empty">
                        <span><ShieldCheck size={18} /></span>
                        <div><strong>{t("等待跟进方案批准", "Waiting for follow-up plan approval")}</strong><small>{t("批准后，任务将在这里自动生成。", "Tasks will be created here automatically after approval.")}</small></div>
                        <em>—</em>
                      </div>
                    )}
                    <div><span><CalendarDays size={18} /></span><div><strong>{t("18:30 · 送杂货", "18:30 · Grocery delivery")}</strong><small>{t("牛奶、鸡蛋、豆腐", "Milk, eggs, tofu")}</small></div><em>{t("弟弟", "Brother")}</em></div>
                  </div>
                </section>
                <aside className="family-panel family-assignments">
                  <h2>{t("本周家庭分工", "This week's roles")}</h2>
                  <div><strong>Elena</strong><span>{activePlan?.tasks.filter((task) => task.ownerEn === "Elena").length ?? 0} {t("项", "tasks")}</span><small>{t("主要联系、批准高影响行动", "Primary contact and high-impact approvals")}</small></div>
                  <div><strong>{t("弟弟", "Brother")}</strong><span>{t("2 项", "2 tasks")}</span><small>{t("交通、杂货与周末探访", "Transport, groceries, and weekend visits")}</small></div>
                  <div><strong>{t("陪伴助手", "Companion")}</strong><span>{activePlan?.tasks.filter((task) => task.ownerEn === "Companion").length ?? 0} {t("项", "tasks")}</span><small>{t("提醒、日常问候、摘要", "Reminders, routine check-ins, and summaries")}</small></div>
                </aside>
              </div>
            </>
          )}

          {desktopView === "records" && (
            <>
              <header className="family-page-header"><div><h1>{t("操作与权限", "Activity & access")}</h1><p>{t("这里只记录谁同意、谁决定、系统随后创建了什么", "This page records who consented, who decided, and what the system created next")}</p></div><button className="family-button" onClick={() => setDesktopView("followup")}><ShieldCheck size={17} />{t("前往今日跟进", "Go to today's follow-up")}</button></header>
              <div className="family-record-grid">
                <section className="family-panel">
                  <h2>{t("今天的操作记录", "Today's activity")}</h2>
                  <div className="family-record-list">
                    {episode.status === "resolved" && <div><time>15:00</time><span><strong>{t("自动复查完成，本次跟进结束", "Automatic review completed; follow-up closed")}</strong><small>{t("妈妈已进食，膝盖不适由 4/10 降至 2/10", "Mum ate; knee discomfort decreased from 4/10 to 2/10")}</small></span></div>}
                    {episode.status === "resolved" && <div><time>10:24</time><span><strong>{t("Elena 完成联系妈妈", "Elena completed the call with Mum")}</strong><small>{t("任务状态已更新为完成", "Task status updated to complete")}</small></span></div>}
                    {activePlan && <div><time>08:22</time><span><strong>{t(`Elena 批准“${activePlan.titleZh}”`, `Elena approved “${activePlan.titleEn}”`)}</strong><small>{t(`已创建 ${activePlan.tasks.length} 项任务、负责人和截止时间`, `Created ${activePlan.tasks.length} tasks with owners and deadlines`)}</small></span></div>}
                    {!activePlan && episode.status === "awaiting_family" && <div><time>08:20</time><span><strong>{t("三个跟进方案等待 Elena 决定", "Three follow-up options are waiting for Elena")}</strong><small>{t("尚未联系诊所或创建外部预约", "No clinic has been contacted and no external booking created")}</small></span></div>}
                    {episode.status === "paused" && <div><time>08:22</time><span><strong>{t("Elena 决定暂不安排", "Elena decided not to arrange anything yet")}</strong><small>{t("15:00 自动问候仍然保留", "The 15:00 automatic check-in remains scheduled")}</small></span></div>}
                    <div><time>08:18</time><span><strong>{t("Elena 收到第一轮确认摘要", "Elena received the first-check summary")}</strong><small>{t("包含个人基线变化、妈妈回复与不确定性", "Included baseline changes, Mum's replies, and uncertainties")}</small></span></div>
                    <div><time>08:16</time><span><strong>{t("妈妈授权分享本次回复", "Mum approved sharing this reply")}</strong><small>{t("仅家庭圈 · 未分享给第三方", "Family circle only · not shared with third parties")}</small></span></div>
                    <div><time>08:05</time><span><strong>{t("陪伴助手发起日常问候", "Companion started a routine check-in")}</strong><small>{t("常规行动 · 无需家属批准", "Routine action · no family approval required")}</small></span></div>
                  </div>
                </section>
                <aside className="family-panel family-permissions"><h2>{t("家庭权限", "Family access")}</h2><div><strong>{t("Elena · 家庭管理员", "Elena · family admin")}</strong><small>{t("查看全部摘要、异常证据、批准行动", "Can view summaries and evidence and approve actions")}</small></div><div><strong>{t("David · 就近响应联系人", "David · nearby responder")}</strong><small>{t("接收照护提醒、查看日程与任务；不看详细健康数据", "Receives care alerts and can view schedules and tasks, not detailed health data")}</small></div><div><strong>{t("陈阿姨 · 本人", "Mdm Tan · account owner")}</strong><small>{t("可随时调整共享范围与联系人", "Can change sharing scope and contacts at any time")}</small></div></aside>
              </div>
            </>
          )}
        </div>
      </section>

      <footer className="family-disclaimer"><Sparkles size={15} />{t("演示数据 · 非医疗诊断 · 高影响行动由家人决定", "Demo data · not medical diagnosis · family decides high-impact actions")}</footer>
    </main>
  );
}
