import { CheckCircle2, MessageCircle, Phone, ShieldCheck } from "lucide-react";

type Props = {
  language: "zh" | "en";
};

export function FollowUpConfirmationCard({ language }: Props) {
  const zh = language === "zh";

  return (
    <section className="parent-follow-up-card" aria-live="polite">
      <div className="parent-follow-up-heading">
        <span><CheckCircle2 size={21} /></span>
        <div>
          <small>{zh ? "日常照护跟进" : "Routine care follow-up"}</small>
          <strong>{zh ? "已请 Elena 跟进" : "Elena has been asked to follow up"}</strong>
        </div>
      </div>
      <p>
        {zh
          ? "Elena 已收到你同意分享的情况，预计今天 10:30 前联系你。"
          : "Elena received the update you approved and is expected to contact you by 10:30 today."}
      </p>
      <div className="parent-follow-up-timeline">
        <span><Phone size={17} /><b>10:30</b>{zh ? "Elena 联系" : "Elena calls"}</span>
        <span><MessageCircle size={17} /><b>15:00</b>{zh ? "KinKeep 再来问候" : "KinKeep checks again"}</span>
      </div>
      <p className="parent-follow-up-safety">
        <ShieldCheck size={15} />
        {zh
          ? "这不是紧急升级。如果突然很不舒服，请点击“需要帮助”。"
          : "This is not an emergency escalation. Tap “I need help” if you suddenly feel very unwell."}
      </p>
    </section>
  );
}
