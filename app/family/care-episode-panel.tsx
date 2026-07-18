"use client";

import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileSearch,
  MessageCircle,
  Phone,
  ShieldCheck,
  Utensils,
} from "lucide-react";
import { useState } from "react";
import {
  carePlans,
  type CareEpisode,
  type CarePlanId,
  type CareTask,
} from "../care-episode";
import { morningHealthFixture } from "../demo-health-data";

type Language = "zh" | "en";

type Props = {
  episode: CareEpisode;
  language: Language;
  onApprove: (plan: CarePlanId) => void;
  onPause: () => void;
  onSimulateFollowUp: () => void;
  onReset: () => void;
};

function TaskIcon({ task }: { task: CareTask }) {
  if (task.kind === "call") return <Phone size={17} />;
  if (task.kind === "meal") return <Utensils size={17} />;
  if (task.kind === "research") return <FileSearch size={17} />;
  return <MessageCircle size={17} />;
}

export function CareEpisodePanel({
  episode,
  language,
  onApprove,
  onPause,
  onSimulateFollowUp,
  onReset,
}: Props) {
  const [selectedPlan, setSelectedPlan] = useState<CarePlanId>(episode.selectedPlan ?? "family_call");
  const zh = language === "zh";
  const plan = carePlans[episode.selectedPlan ?? selectedPlan];

  if (episode.status === "resolved") {
    return (
      <section className="episode-panel episode-resolved" aria-live="polite">
        <div className="episode-status-heading">
          <span><CheckCircle2 size={23} /></span>
          <div>
            <small>{zh ? "15:00 · 自动复查完成" : "15:00 · Follow-up completed"}</small>
            <h2>{zh ? "本次跟进已完成" : "This follow-up is complete"}</h2>
          </div>
        </div>
        <div className="episode-outcome-grid">
          <div><strong>10:24</strong><span>{zh ? "Elena 已完成电话" : "Elena completed the call"}</span></div>
          <div><strong>2 / 10</strong><span>{zh ? "膝盖不适，由 4 降至 2" : "Knee discomfort, down from 4"}</span></div>
          <div><strong>{zh ? "已进食" : "Ate lunch"}</strong><span>{zh ? "妈妈确认午餐已完成" : "Mum confirmed lunch"}</span></div>
        </div>
        <p className="episode-outcome-note">
          {zh
            ? "妈妈在家、已经进食，膝盖不适有所缓解，暂无新的危险信号。明早继续按个人基线观察。"
            : "Mum is at home, has eaten, and reports less knee discomfort with no new danger signals. Continue baseline monitoring tomorrow morning."}
        </p>
        <button className="episode-reset-button" type="button" onClick={onReset}>
          {zh ? "重新演示本次跟进" : "Replay this follow-up"}
        </button>
      </section>
    );
  }

  if (episode.status === "active") {
    return (
      <section className="episode-panel episode-active" aria-live="polite">
        <div className="episode-status-heading">
          <span><ShieldCheck size={23} /></span>
          <div>
            <small>{zh ? "方案已由 Elena 批准" : "Plan approved by Elena"}</small>
            <h2>{zh ? plan.titleZh : plan.titleEn}</h2>
          </div>
        </div>
        <p>{zh ? "负责人、截止时间和自动复查已经创建。" : "Owners, deadlines, and an automatic follow-up have been created."}</p>
        <div className="episode-task-list">
          {plan.tasks.map((task) => (
            <div key={task.id}>
              <span className="episode-task-icon"><TaskIcon task={task} /></span>
              <span>
                <strong>{task.time} · {zh ? task.titleZh : task.titleEn}</strong>
                <small>{zh ? task.detailZh : task.detailEn}</small>
              </span>
              <em>{zh ? task.ownerZh : task.ownerEn}</em>
            </div>
          ))}
        </div>
        <div className="episode-escalation-rule">
          <AlertCircle size={17} />
          <span>
            <strong>{zh ? "升级条件" : "Escalation rule"}</strong>
            {zh
              ? "若疼痛明显加重，或出现跌倒、胸闷、呼吸困难，将重新通知家属并进入紧急流程。"
              : "If pain worsens markedly, or a fall, chest tightness, or breathing difficulty appears, notify family and enter the urgent flow."}
          </span>
        </div>
        <button className="episode-simulate-button" type="button" onClick={onSimulateFollowUp}>
          <Clock3 size={18} />{zh ? "演示：模拟至 15:00 复查" : "Demo: simulate the 15:00 follow-up"}
        </button>
      </section>
    );
  }

  if (episode.status === "paused") {
    return (
      <section className="episode-panel episode-paused" aria-live="polite">
        <div className="episode-status-heading">
          <span><Clock3 size={23} /></span>
          <div>
            <small>{zh ? "家属决定" : "Family decision"}</small>
            <h2>{zh ? "暂不安排，继续观察" : "No action for now; continue monitoring"}</h2>
          </div>
        </div>
        <p>{zh ? "KinKeep 会在 15:00 再次问候；如果情况变化，会重新通知你。" : "KinKeep will check again at 15:00 and notify you if anything changes."}</p>
      </section>
    );
  }

  return (
    <section className="episode-panel">
      <div className="episode-summary">
        <span className="family-badge attention">{zh ? "妈妈 · 今日需要跟进" : "Mum · follow-up needed today"}</span>
        <h2>{zh ? "目前没有紧急信号，但不能只看一条心率。" : "There is no urgent signal, but one heart-rate reading is not enough."}</h2>
        <p>
          {zh
            ? "KinKeep 已把穿戴数据和妈妈的回复放在一起，完成第一轮确认。"
            : "KinKeep combined wearable data with Mum's replies and completed the first check."}
        </p>
      </div>

      <div className="episode-evidence">
        <div className="episode-section-heading">
          <div><strong>{zh ? "判断依据" : "Evidence"}</strong><small>{zh ? "来源和时间都保留" : "Sources and times retained"}</small></div>
          <span>4</span>
        </div>
        <ul>
          <li><span>Apple Watch · {morningHealthFixture.syncedAt}</span><strong>{zh ? `睡眠比个人基线少 ${morningHealthFixture.sleep.deltaZh}` : `Sleep was ${morningHealthFixture.sleep.deltaEn} below her baseline`}</strong></li>
          <li><span>Apple Watch · {morningHealthFixture.activityObservedAt}</span><strong>{zh ? `上午活动低于个人基线 ${morningHealthFixture.steps.deltaPercent}%` : `Morning activity was ${morningHealthFixture.steps.deltaPercent}% below baseline`}</strong></li>
          <li><span>{zh ? `妈妈的回复 · ${morningHealthFixture.parentReplyAt}` : `Mum's reply · ${morningHealthFixture.parentReplyAt}`}</span><strong>{zh ? "“这几天膝盖都有点痛。”" : "“My knee has hurt for a few days.”"}</strong></li>
          <li><span>{zh ? `安全问询 · ${morningHealthFixture.safetyCheckedAt}` : `Safety check · ${morningHealthFixture.safetyCheckedAt}`}</span><strong>{zh ? "没有跌倒、胸闷、呼吸困难或严重疼痛" : "No fall, chest tightness, breathing difficulty, or severe pain"}</strong></li>
        </ul>
      </div>

      <div className="episode-uncertainty">
        <AlertCircle size={18} />
        <span>
          <strong>{zh ? "还不确定" : "Still uncertain"}</strong>
          {zh
            ? "疼痛的准确程度、走路是否会加重，以及早餐是否已经完成。"
            : "Exact pain level, whether walking makes it worse, and whether breakfast is complete."}
        </span>
      </div>

      <div className="episode-options-heading">
        <div><h2>{zh ? "选择今天怎么跟进" : "Choose today's follow-up"}</h2><p>{zh ? "三个方案都不会自动联系诊所" : "None of these options contacts a clinic automatically"}</p></div>
      </div>
      <div className="episode-options" role="radiogroup" aria-label={zh ? "照护方案" : "Care plan"}>
        {(Object.keys(carePlans) as CarePlanId[]).map((planId) => {
          const option = carePlans[planId];
          const selected = selectedPlan === planId;
          return (
            <button
              key={planId}
              className={`episode-option ${selected ? "selected" : ""}`}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setSelectedPlan(planId)}
            >
              <span className="episode-option-radio">{selected ? <CheckCircle2 size={19} /> : null}</span>
              <span>
                <small>{zh ? option.labelZh : option.labelEn}</small>
                <strong>{zh ? option.titleZh : option.titleEn}</strong>
                <em>{zh ? option.descriptionZh : option.descriptionEn}</em>
              </span>
              <ChevronRight size={18} />
            </button>
          );
        })}
      </div>
      <div className="family-actions episode-actions">
        <button className="family-button primary" type="button" onClick={() => onApprove(selectedPlan)}>
          {zh ? "批准所选方案" : "Approve selected plan"}
        </button>
        <button className="family-button" type="button" onClick={onPause}>{zh ? "暂不安排" : "Not now"}</button>
      </div>
      <p className="family-policy">
        <strong>{zh ? "为什么需要你批准：" : "Why your approval is required: "}</strong>
        {zh ? "联系家人、准备医疗选项和改变照护安排都需要人的判断。" : "Contacting family, preparing medical options, and changing care arrangements require human judgment."}
      </p>
    </section>
  );
}
