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

type MobileView = "safe" | "alerts" | "approvals";
type DesktopView = "overview" | "trends" | "care" | "records";
type MemberId = "mum" | "dad" | "me";
type MetricId = "activity" | "sleep" | "heart" | "routine";
type Decision = "pending" | "approved" | "declined";

const members = {
  mum: {
    initial: "陈",
    relation: "妈妈",
    name: "陈阿姨",
    status: "需要留意 · 已回复",
    answer: "妈妈现在基本安好。",
    detail: "今早和她平时不太一样，但 08:16 已回复“膝盖有点痛”，暂时没有紧急信号。",
    tone: "attention",
  },
  dad: {
    initial: "爸",
    relation: "爸爸",
    name: "陈叔叔",
    status: "状态稳定",
    answer: "爸爸今天一切如常。",
    detail: "07:52 已完成晨间散步，活动、心率和日常规律都在他的个人基线内。",
    tone: "stable",
  },
  me: {
    initial: "E",
    relation: "自己",
    name: "Elena",
    status: "共享范围正常",
    answer: "你的家庭照护设置已同步。",
    detail: "你只与家庭圈共享照护日程和紧急联系人，不共享个人健康详情。",
    tone: "private",
  },
} as const;

const metrics = {
  activity: {
    label: "活动",
    title: "上午活动步数",
    summary: "今日 320 步 · 个人基线约 2,400 步",
    badge: "低于基线 87%",
    values: [2380, 2510, 2290, 2460, 2350, 2210, 320],
    low: [1950, 2000, 1900, 1980, 1920, 1880, 1850],
    high: [2780, 2850, 2720, 2890, 2810, 2690, 2700],
  },
  sleep: {
    label: "睡眠",
    title: "夜间睡眠",
    summary: "今日 5h 12m · 个人基线约 7h 20m",
    badge: "少 2h 08m",
    values: [7.4, 7.2, 7.7, 7.1, 7.5, 7.0, 5.2],
    low: [6.7, 6.7, 6.7, 6.7, 6.7, 6.7, 6.7],
    high: [8, 8, 8, 8, 8, 8, 8],
  },
  heart: {
    label: "静息心率",
    title: "静息心率",
    summary: "今日 78 bpm · 个人基线约 67 bpm",
    badge: "高于基线 11 bpm",
    values: [66, 68, 65, 67, 69, 66, 78],
    low: [62, 62, 62, 62, 62, 62, 62],
    high: [71, 71, 71, 71, 71, 71, 71],
  },
  routine: {
    label: "日常规律",
    title: "日常规律吻合度",
    summary: "今日 42% · 由起床、早餐、活动与回复组成",
    badge: "低于平时 49%",
    values: [92, 89, 94, 90, 87, 91, 42],
    low: [78, 78, 78, 78, 78, 78, 78],
    high: [100, 100, 100, 100, 100, 100, 100],
  },
} as const;

const dayLabels = ["一", "二", "三", "四", "五", "六", "日"];

function chartGeometry(metric: MetricId) {
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
    points: data.values.map((value, index) => ({ x: x(index), y: y(value), label: dayLabels[index] })),
  };
}

function DecisionPanel({ decision, onDecision }: { decision: Decision; onDecision: (decision: Decision) => void }) {
  if (decision !== "pending") {
    const approved = decision === "approved";
    return (
      <section className="family-decision decided" aria-live="polite">
        <CheckCircle2 size={24} />
        <div>
          <strong>{approved ? "已批准建议" : "已记录：暂不安排"}</strong>
          <p>{approved ? "系统会准备问诊选项，但仍不会自动分享资料或完成预约。" : "下午问候仍会继续；如情况变化，将再次通知你。"}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="family-decision">
      <div className="family-between"><span className="family-badge warning">高影响 · 已暂停</span><span>08:20</span></div>
      <h3>是否建议妈妈今天进行远程问诊？</h3>
      <p>助手认为膝痛已连续出现，需要家属判断是否继续安排。现在尚未联系任何诊所。</p>
      <ul>
        <li>妈妈：“这几天膝盖都有点痛。”</li>
        <li>今天活动低于个人基线 87%</li>
        <li>没有跌倒、胸闷或严重疼痛信号</li>
      </ul>
      <p className="family-policy"><strong>为什么需要你批准：</strong>医疗升级与向第三方分享信息均属于高影响行动。</p>
      <div className="family-actions">
        <button className="family-button primary" onClick={() => onDecision("approved")}>批准建议</button>
        <button className="family-button" onClick={() => onDecision("declined")}>暂不安排</button>
      </div>
    </section>
  );
}

function TrendChart({ metric }: { metric: MetricId }) {
  const geometry = chartGeometry(metric);

  return (
    <svg className="family-chart" viewBox="0 0 640 285" role="img" aria-labelledby="trend-title trend-description">
      <title id="trend-title">妈妈最近七天的{metrics[metric].title}</title>
      <desc id="trend-description">实际记录与陈阿姨个人正常范围的比较，今天的记录明显偏离。</desc>
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

export function FamilyCareDashboard() {
  const [mobileView, setMobileView] = useState<MobileView>("safe");
  const [desktopView, setDesktopView] = useState<DesktopView>("overview");
  const [member, setMember] = useState<MemberId>("mum");
  const [metric, setMetric] = useState<MetricId>("activity");
  const [decision, setDecision] = useState<Decision>("pending");
  const [alertRead, setAlertRead] = useState(false);
  const [callState, setCallState] = useState("联系妈妈");
  const selectedMember = members[member];

  const callMum = () => {
    setCallState("正在拨打妈妈…");
    window.setTimeout(() => setCallState("联系妈妈"), 1400);
  };

  return (
    <main className="family-stage">
      <section className="family-mobile-shell" aria-label="KinKeep family mobile">
        <header className="family-mobile-header">
          <div className="family-between">
            <div className="family-brand"><span><HeartHandshake size={22} /></span><div><strong>KinKeep</strong><small>上午好，Elena</small></div></div>
            <Link className="family-button compact" href="/">妈妈端</Link>
          </div>
          <nav className="family-mobile-tabs" aria-label="家属端页面">
            <button className={mobileView === "safe" ? "selected" : ""} onClick={() => setMobileView("safe")} aria-pressed={mobileView === "safe"}>安心</button>
            <button className={mobileView === "alerts" ? "selected" : ""} onClick={() => setMobileView("alerts")} aria-pressed={mobileView === "alerts"}>通知 <span>1</span></button>
            <button className={mobileView === "approvals" ? "selected" : ""} onClick={() => setMobileView("approvals")} aria-pressed={mobileView === "approvals"}>待批准 <span>1</span></button>
          </nav>
        </header>

        <div className="family-mobile-content">
          {mobileView === "safe" && (
            <>
              <section className="family-mobile-hero">
                <small>{selectedMember.relation} · {selectedMember.name}</small>
                <span className={`family-badge ${selectedMember.tone}`}>{selectedMember.status}</span>
                <h1>{selectedMember.answer}</h1>
                <p>{selectedMember.detail}</p>
                {member === "mum" && <div className="family-actions"><button className="family-button primary" onClick={callMum}><Phone size={17} />{callState}</button><button className="family-button" onClick={() => setMobileView("alerts")}><ListChecks size={17} />查看依据</button></div>}
              </section>
              <section className="family-mobile-section">
                <h2>{member === "mum" ? "为什么需要留意" : "今天的关键信息"}</h2>
                {member === "mum" ? (
                  <div className="family-signal-list">
                    <div className="family-signal"><span><Moon size={18} /></span><div><strong>睡眠比个人基线少 2 小时</strong><small>5 小时 12 分 · 平时约 7 小时 20 分</small></div></div>
                    <div className="family-signal"><span><Footprints size={18} /></span><div><strong>上午活动明显偏少</strong><small>320 步 · 平时此时约 2,400 步</small></div></div>
                    <div className="family-signal"><span><MessageCircle size={18} /></span><div><strong>已完成第一轮问候</strong><small>确认在家，提到膝盖轻微不适</small></div></div>
                  </div>
                ) : member === "dad" ? (
                  <div className="family-signal-list">
                    <div className="family-signal"><span><Footprints size={18} /></span><div><strong>晨间散步已完成</strong><small>2,680 步 · 在个人正常范围内</small></div></div>
                    <div className="family-signal"><span><HeartPulse size={18} /></span><div><strong>静息心率稳定</strong><small>65 bpm · 与个人基线一致</small></div></div>
                  </div>
                ) : (
                  <div className="family-signal-list">
                    <div className="family-signal"><span><ShieldCheck size={18} /></span><div><strong>共享范围已确认</strong><small>家人只能看到你授权的日程和联系人</small></div></div>
                    <div className="family-signal"><span><UsersRound size={18} /></span><div><strong>你是主要联系人</strong><small>负责高影响行动批准与紧急联络</small></div></div>
                  </div>
                )}
              </section>
            </>
          )}

          {mobileView === "alerts" && (
            <section className="family-mobile-section family-stack">
              <div className="family-between"><div><h1>即时通知</h1><p>只推送真正需要你知道的变化</p></div><span className="family-badge warning">{alertRead ? "已处理" : "1 未处理"}</span></div>
              <article className={`family-alert ${alertRead ? "resolved" : ""}`}>
                <div className="family-between"><strong>妈妈今早偏离个人基线</strong><small>08:18</small></div>
                <p>多信号同时变化，助手已完成第一轮问候。妈妈回复膝盖有点痛，没有报告头晕或胸闷。</p>
                <ul><li>睡眠 −2h 08m</li><li>上午活动 −87%</li><li>静息心率 +11 bpm</li><li>早餐未确认</li></ul>
                <div className="family-actions"><button className="family-button primary" onClick={callMum}><Phone size={17} />{callState}</button><button className="family-button" onClick={() => setAlertRead(true)} disabled={alertRead}>{alertRead ? "已读" : "我知道了"}</button></div>
              </article>
              <article className="family-alert resolved"><div className="family-between"><strong>爸爸晨间散步已完成</strong><small>07:52</small></div><p>活动、心率和日常规律都在个人基线内。</p></article>
            </section>
          )}

          {mobileView === "approvals" && (
            <section className="family-mobile-section family-stack">
              <div><h1>待批准行动</h1><p>高影响行动永远先交给家人决定</p></div>
              <DecisionPanel decision={decision} onDecision={setDecision} />
            </section>
          )}
        </div>

        <nav className="family-member-nav" aria-label="家庭成员">
          {(Object.keys(members) as MemberId[]).map((id) => (
            <button key={id} className={member === id ? "selected" : ""} onClick={() => { setMember(id); setMobileView("safe"); }} aria-pressed={member === id}>
              {id === "mum" ? <HeartHandshake size={18} /> : id === "dad" ? <UserRound size={18} /> : <ShieldCheck size={18} />}
              {members[id].relation}
            </button>
          ))}
        </nav>
      </section>

      <section className="family-desktop-shell" aria-label="KinKeep family desktop">
        <aside className="family-sidebar">
          <div className="family-brand"><span><HeartHandshake size={22} /></span><div><strong>KinKeep</strong><small>家庭照护空间</small></div></div>
          <nav aria-label="家属端页面">
            <button className={desktopView === "overview" ? "selected" : ""} onClick={() => setDesktopView("overview")} aria-pressed={desktopView === "overview"}><LayoutDashboard size={18} />家庭总览</button>
            <button className={desktopView === "trends" ? "selected" : ""} onClick={() => setDesktopView("trends")} aria-pressed={desktopView === "trends"}><ChartNoAxesCombined size={18} />趋势与证据</button>
            <button className={desktopView === "care" ? "selected" : ""} onClick={() => setDesktopView("care")} aria-pressed={desktopView === "care"}><CalendarDays size={18} />照护日程</button>
            <button className={desktopView === "records" ? "selected" : ""} onClick={() => setDesktopView("records")} aria-pressed={desktopView === "records"}><ShieldCheck size={18} />操作与权限</button>
          </nav>
          <div className="family-household"><small>当前家庭</small><strong>陈家 · 3 位成员</strong><span>你是主要联系人</span></div>
          <Link className="family-button" href="/">返回妈妈端</Link>
        </aside>

        <div className="family-desktop-main">
          {desktopView === "overview" && (
            <>
              <header className="family-page-header"><div><h1>家庭总览</h1><p>今天 08:30 · 一眼看清谁安好、谁需要你</p></div><button className="family-button" onClick={() => setDesktopView("care")}><CalendarDays size={17} />查看本周日程</button></header>
              <div className="family-overview-grid">
                <section className="family-panel"><h2>家人状态</h2><div className="family-member-list">
                  <button className="family-member-row" onClick={() => setDesktopView("trends")}><span className="family-avatar attention">陈</span><span><strong>妈妈 · 陈阿姨</strong><small>已回复 · 在家 · 08:16 更新</small></span><span className="family-badge attention">需要留意</span><ChevronRight size={17} /></button>
                  <div className="family-member-row"><span className="family-avatar">爸</span><span><strong>爸爸 · 陈叔叔</strong><small>晨间散步完成 · 07:52 更新</small></span><span className="family-badge stable">状态稳定</span></div>
                  <div className="family-member-row"><span className="family-avatar">E</span><span><strong>自己 · Elena</strong><small>仅共享照护日程与紧急联系人</small></span><span className="family-badge private">权限受限</span></div>
                </div></section>
                <section className="family-panel"><div className="family-between"><h2>今天的家庭任务</h2><span>2 / 3</span></div><div className="family-task-list"><div><CheckCircle2 size={18} /><span><strong>爸爸晨间散步</strong><small>07:52 已完成</small></span></div><div><Phone size={18} /><span><strong>联系妈妈</strong><small>Elena · 午餐前</small></span></div><div><Utensils size={18} /><span><strong>爸爸复诊交通</strong><small>弟弟 · 周四 14:30</small></span></div></div></section>
              </div>
              <div className="family-story-grid">
                <section className="family-panel family-story"><span className="family-badge attention">妈妈 · 需要留意</span><h2>不是单一心率报警，而是今早整体规律变了。</h2><p>睡眠、活动、静息心率和早餐规律同时偏离个人基线；她已回复并确认在家，因此当前是“需要家人跟进”，不是紧急状态。</p><div className="family-actions"><button className="family-button primary" onClick={() => setDesktopView("trends")}>查看异常证据</button><button className="family-button" onClick={callMum}><Phone size={17} />{callState}</button></div></section>
                <section className="family-panel"><div className="family-between"><h2>待批准</h2><span className="family-badge warning">1</span></div><p>远程问诊建议已在高影响行动闸门暂停，等待你的决定。</p><button className="family-button" onClick={() => setDesktopView("records")}>前往处理 <ChevronRight size={17} /></button></section>
              </div>
            </>
          )}

          {desktopView === "trends" && (
            <>
              <header className="family-page-header"><div><h1>趋势与证据</h1><p>妈妈 · 最近 7 天，与她自己的日常基线比较</p></div><div className="family-segmented" aria-label="趋势指标">{(Object.keys(metrics) as MetricId[]).map((id) => <button key={id} className={metric === id ? "selected" : ""} onClick={() => setMetric(id)} aria-pressed={metric === id}>{metrics[id].label}</button>)}</div></header>
              <div className="family-trend-grid">
                <section className="family-panel family-chart-panel"><div className="family-between"><div><h2>{metrics[metric].title}</h2><p>{metrics[metric].summary}</p></div><span className="family-badge warning">{metrics[metric].badge}</span></div><TrendChart metric={metric} /><div className="family-chart-legend"><span><i className="baseline" />个人正常范围</span><span><i />实际记录</span></div></section>
                <aside className="family-panel family-evidence"><div><h2>今天为何被标记</h2><p>风险来自多信号一起变化，不由任何单个数字决定。</p></div><div><strong>睡眠</strong><small>5h 12m，对比个人基线 −2h 08m</small></div><div><strong>活动</strong><small>上午 320 步，对比基线 −87%</small></div><div><strong>静息心率</strong><small>78 bpm，对比基线 +11 bpm</small></div><div><strong>回复与规律</strong><small>延迟 26 分钟回复；早餐尚未确认</small></div><button className="family-button primary" onClick={callMum}><Phone size={17} />{callState}</button></aside>
              </div>
            </>
          )}

          {desktopView === "care" && (
            <>
              <header className="family-page-header"><div><h1>照护日程</h1><p>把家庭分工放在同一个清楚的时间线上</p></div></header>
              <div className="family-week-strip">{[12, 13, 14, 15, 16, 17, 18].map((date, index) => <span key={date} className={index === 0 ? "selected" : ""}><small>{dayLabels[index]}</small><strong>{date}</strong></span>)}</div>
              <div className="family-care-grid"><section className="family-panel"><h2>今天</h2><div className="family-care-list"><div><span><Phone size={18} /></span><div><strong>10:30 · 联系妈妈</strong><small>确认膝盖与早餐情况</small></div><em>Elena</em></div><div><span><Utensils size={18} /></span><div><strong>12:00 · 午餐提醒</strong><small>由陪伴助手自动跟进</small></div><em>助手</em></div><div><span><MessageCircle size={18} /></span><div><strong>15:00 · 再次问候</strong><small>如仍不适，再通知家属</small></div><em>助手</em></div><div><span><CalendarDays size={18} /></span><div><strong>18:30 · 送杂货</strong><small>牛奶、鸡蛋、豆腐</small></div><em>弟弟</em></div></div></section><aside className="family-panel family-assignments"><h2>本周家庭分工</h2><div><strong>Elena</strong><span>3 项</span><small>主要联系、批准高影响行动</small></div><div><strong>弟弟</strong><span>2 项</span><small>交通、杂货与周末探访</small></div><div><strong>陪伴助手</strong><span>7 项</span><small>提醒、日常问候、摘要</small></div></aside></div>
            </>
          )}

          {desktopView === "records" && (
            <>
              <header className="family-page-header"><div><h1>操作与权限</h1><p>谁看过、谁决定、系统做了什么，都有清楚记录</p></div></header>
              <div className="family-record-grid"><section className="family-panel"><h2>今天的操作记录</h2><div className="family-record-list"><div><time>08:20</time><span><strong>远程问诊建议已暂停</strong><small>高影响行动 · 等待 Elena 决定</small></span></div><div><time>08:18</time><span><strong>Elena 收到异常通知</strong><small>包含 4 项基线变化与妈妈的回复摘要</small></span></div><div><time>08:16</time><span><strong>妈妈授权分享本次回复</strong><small>仅家庭圈 · 未分享给第三方</small></span></div><div><time>08:05</time><span><strong>陪伴助手发起日常问候</strong><small>常规行动 · 无需家属批准</small></span></div></div></section><aside className="family-panel family-permissions"><h2>家庭权限</h2><div><strong>Elena · 主要联系人</strong><small>查看全部摘要、异常证据、批准行动</small></div><div><strong>弟弟 · 协作家属</strong><small>查看日程与任务；不看详细健康数据</small></div><div><strong>陈阿姨 · 本人</strong><small>可随时调整共享范围与联系人</small></div></aside></div>
              <DecisionPanel decision={decision} onDecision={setDecision} />
            </>
          )}
        </div>
      </section>

      <footer className="family-disclaimer"><Sparkles size={15} />演示数据 · 非医疗诊断 · 高影响行动由家人决定</footer>
    </main>
  );
}
