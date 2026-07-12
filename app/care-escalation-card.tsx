"use client";

import { CheckCircle2, MapPin, MessageSquareText, Phone, ShieldAlert, Smartphone, UserRoundCheck } from "lucide-react";
import type { CareEscalation } from "./care-escalation";

type Props = {
  escalation: CareEscalation;
  language: "zh" | "en";
  audience: "parent" | "family";
  onAcknowledge?: () => void;
};

export function CareEscalationCard({ escalation, language, audience, onAcknowledge }: Props) {
  const zh = language === "zh";
  const multichannel = escalation.stage !== "primary_push";
  const acknowledged = escalation.stage === "backup_acknowledged";
  const urgent = escalation.kind === "urgent" || escalation.kind === "wandering";

  return (
    <section className={`care-escalation-card ${escalation.kind}`} aria-live="polite">
      <div className="care-escalation-heading">
        <span className="care-escalation-icon"><ShieldAlert size={20} /></span>
        <div>
          <small>{zh ? "照护升级 · Demo" : "Care escalation · Demo"}</small>
          <strong>{escalation.kind === "wandering" ? (zh ? "可能迷路，正在寻找妈妈" : "Mum may be lost") : (zh ? "家属联络进行中" : "Family contact in progress")}</strong>
        </div>
        <span className={`care-live-status ${acknowledged ? "done" : "active"}`}>{acknowledged ? (zh ? "已接手" : "Accepted") : (zh ? "进行中" : "Live")}</span>
      </div>

      <p className="care-escalation-reason">{zh ? escalation.reasonZh : escalation.reasonEn}</p>

      {escalation.kind === "wandering" && (
        <div className="care-event-facts">
          <span><MapPin size={16} />{escalation.lastLocation ?? "Toa Payoh MRT Exit B"}</span>
          <span>{zh ? "安全区外 14 分钟" : "Outside safe zone 14 min"}</span>
          <span>{zh ? `心率 ${escalation.heartRate ?? 95} bpm` : `Heart rate ${escalation.heartRate ?? 95} bpm`}</span>
          <span>{zh ? `手表电量 ${escalation.deviceBattery ?? 85}%` : `Watch battery ${escalation.deviceBattery ?? 85}%`}</span>
        </div>
      )}

      <ol className="care-channel-list">
        <li className="complete"><Smartphone size={17} /><span><strong>{zh ? "App 推送 → Elena" : "App push → Elena"}</strong><small>{multichannel ? (zh ? "已送达，90 秒未确认" : "Delivered, no response after 90 sec") : (zh ? "已送达 · 等待确认" : "Delivered · awaiting response")}</small></span><CheckCircle2 size={17} /></li>
        <li className={multichannel ? "complete" : "pending"}><MessageSquareText size={17} /><span><strong>{zh ? "短信 + 电话 → Elena" : "SMS + phone → Elena"}</strong><small>{multichannel ? (zh ? "升级通道已触发" : "Escalation channel triggered") : (zh ? "等待首轮确认" : "Waiting for first response")}</small></span>{multichannel && <CheckCircle2 size={17} />}</li>
        <li className={acknowledged ? "complete" : multichannel ? "active" : "pending"}><UserRoundCheck size={17} /><span><strong>{zh ? "后备家属 → 弟弟 David" : "Backup family → David"}</strong><small>{acknowledged ? (zh ? "David 已确认接手，正在联系妈妈" : "David accepted and is contacting Mum") : multichannel ? (zh ? "Elena 未确认，已通知 David" : "Elena did not respond; David notified") : (zh ? "若 Elena 未回应将自动接力" : "Will take over if Elena does not respond")}</small></span>{acknowledged && <CheckCircle2 size={17} />}</li>
      </ol>

      {audience === "family" && !acknowledged && onAcknowledge && (
        <button className="care-acknowledge" type="button" onClick={onAcknowledge}><Phone size={17} />{zh ? "我已接手，联系妈妈" : "I’ll take over and call Mum"}</button>
      )}

      {urgent && (
        <div className="care-official-options">
          <strong>{zh ? "需要真人判断的官方求助选项" : "Official help options — human decision required"}</strong>
          {escalation.kind === "wandering" && <span><b>999</b>{zh ? "警方 · 走失 / 失踪" : "Police · missing person"}</span>}
          <span><b>995</b>{zh ? "SCDF · 仅危及生命时" : "SCDF · life-threatening only"}</span>
          <span><b>6262 6262</b>NurseFirst</span>
          {escalation.kind === "wandering" && <span><b>CARA</b>{zh ? "已加入计划时可发布社区寻人" : "Community alert if already enrolled"}</span>}
        </div>
      )}

      <p className="care-demo-note">{zh ? "本地 Demo：展示通知与升级逻辑，不会真的拨号、发短信或向第三方共享数据。" : "Local demo: shows notification and escalation logic; it does not place calls, send messages, or share data."}</p>
    </section>
  );
}
