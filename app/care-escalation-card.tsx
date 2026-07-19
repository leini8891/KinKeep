"use client";

import { CheckCircle2, MapPin, MessageCircle, Phone, ShieldAlert, UserRoundCheck } from "lucide-react";
import {
  careWhatsAppHref,
  isCareEscalationAcknowledged,
  shouldShowCareEscalationContext,
  type CareEscalation,
} from "./care-escalation";

type Props = {
  escalation: CareEscalation;
  language: "zh" | "en";
  audience: "parent" | "family";
  onAcknowledge?: () => void;
  onConfirmWhatsAppSent?: () => void;
};

export function CareEscalationCard({
  escalation,
  language,
  audience,
  onAcknowledge,
  onConfirmWhatsAppSent,
}: Props) {
  const zh = language === "zh";
  const acknowledged = isCareEscalationAcknowledged(escalation);
  const whatsappDraftOpened = escalation.stage === "whatsapp_draft_opened";
  const whatsappSendConfirmed = escalation.stage === "whatsapp_send_confirmed";
  const showContext = shouldShowCareEscalationContext(audience, escalation.stage);
  const initialContact = escalation.initialContact ?? "elena";
  const contactName = initialContact === "elena" ? "Elena" : "David";
  const whatsappHref = careWhatsAppHref(initialContact, escalation.kind, language);
  const contactLabel = initialContact === "elena"
    ? (zh ? "女儿 Elena" : "daughter Elena")
    : audience === "parent"
    ? (zh ? "儿子 David" : "son David")
    : (zh ? "弟弟 David" : "brother David");
  const contactRole = initialContact === "david"
    ? (zh ? "就近响应联系人" : "nearby responder")
    : (zh ? "家庭照护联系人" : "family care contact");

  return (
    <section className={`care-escalation-card ${escalation.kind}`} aria-live="polite">
      <div className="care-escalation-heading">
        <span className="care-escalation-icon"><ShieldAlert size={20} /></span>
        <div>
          <small>{whatsappDraftOpened || whatsappSendConfirmed ? "WhatsApp" : (zh ? "家属联系" : "Family contact")}</small>
          <strong>
            {whatsappDraftOpened
              ? (zh ? "消息已准备好" : "Message ready")
              : whatsappSendConfirmed
                ? (zh ? `已通知 ${contactName}` : `${contactName} has been notified`)
                : escalation.kind === "wandering"
              ? (zh ? "需要家属确认妈妈的位置" : "Family needs to confirm Mum’s location")
              : acknowledged
                ? (zh ? `${contactName} 已确认接手` : `${contactName} has accepted`)
                : (zh ? `正在联系 ${contactName}` : `Contacting ${contactName}`)}
          </strong>
        </div>
        <span className={`care-live-status ${acknowledged ? "done" : "active"}`}>
          {acknowledged
            ? (zh ? "已接手" : "Accepted")
            : whatsappDraftOpened
              ? (zh ? "待发送" : "Ready")
              : (zh ? "等待确认" : "Waiting")}
        </span>
      </div>

      {showContext && (
        <p className="care-escalation-reason">{zh ? escalation.reasonZh : escalation.reasonEn}</p>
      )}

      {showContext && escalation.kind === "wandering" && (
        <div className="care-event-facts">
          <span><MapPin size={16} />{escalation.lastLocation ?? "Toa Payoh MRT Exit B"}</span>
          <span>{zh ? "安全区外 14 分钟" : "Outside safe zone 14 min"}</span>
          <span>{zh ? `心率 ${escalation.heartRate ?? 95} bpm` : `Heart rate ${escalation.heartRate ?? 95} bpm`}</span>
          <span>{zh ? `手表电量 ${escalation.deviceBattery ?? 85}%` : `Watch battery ${escalation.deviceBattery ?? 85}%`}</span>
        </div>
      )}

      {showContext && (
        <div className={`care-contact-summary ${acknowledged ? "complete" : ""}`}>
          <UserRoundCheck size={20} />
          <span>
            <strong>{contactLabel}</strong>
            <small>
              {acknowledged
                ? (zh ? `${contactName} 已确认，并会直接联系妈妈` : `${contactName} confirmed and will contact Mum directly`)
                : whatsappDraftOpened
                  ? (zh
                      ? `消息已填好；若未自动选中，请选择 ${contactName} 后发送`
                      : `Message is pre-filled; select ${contactName} if the chat is not opened automatically`)
                  : whatsappSendConfirmed
                    ? (zh ? "妈妈确认已发送 WhatsApp，请尽快联系她" : "Mum confirmed the WhatsApp was sent; please contact her soon")
                    : contactRole}
            </small>
          </span>
          {acknowledged && <CheckCircle2 size={19} />}
        </div>
      )}

      {audience === "parent" && whatsappDraftOpened && (
        <div className="care-whatsapp-actions">
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={17} />{zh ? "再次打开 WhatsApp" : "Open WhatsApp again"}
          </a>
          {onConfirmWhatsAppSent && (
            <button type="button" onClick={onConfirmWhatsAppSent}>
              <CheckCircle2 size={17} />{zh ? "我已在 WhatsApp 发送" : "I sent it in WhatsApp"}
            </button>
          )}
        </div>
      )}

      {audience === "family" && !acknowledged && !whatsappDraftOpened && onAcknowledge && (
        <button className="care-acknowledge" type="button" onClick={onAcknowledge}><Phone size={17} />{zh ? "拨打妈妈并接手" : "Call Mum and take over"}</button>
      )}
    </section>
  );
}
