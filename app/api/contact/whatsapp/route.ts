import type { CareContact, EscalationKind } from "../../../care-escalation";

const CONTACT_ENV = {
  elena: "KINKEEP_ELENA_WHATSAPP",
  david: "KINKEEP_DAVID_WHATSAPP",
} as const satisfies Record<CareContact, string>;

const VALID_KINDS = new Set<EscalationKind>(["symptom", "urgent", "wandering"]);

function normalizePhone(value: string | undefined) {
  return value?.replace(/\D/g, "") ?? "";
}

export function buildWhatsAppMessage(
  contact: CareContact,
  kind: EscalationKind,
  language: "zh" | "en",
) {
  const contactName = contact === "elena" ? "Elena" : "David";
  if (language === "en") {
    const situation = kind === "urgent"
      ? "Mum just said she needs urgent help."
      : kind === "wandering"
        ? "KinKeep could not confirm Mum’s current location."
        : "Mum said she feels unwell and would like family support.";
    return `[KinKeep care alert]\n${situation}\nShe chose to contact you, ${contactName}. Please call her as soon as you can.\n\nFor breathlessness, loss of consciousness, excessive bleeding, or major trauma, call 995 immediately.`;
  }

  const situation = kind === "urgent"
    ? "妈妈刚才表示现在需要紧急帮助。"
    : kind === "wandering"
      ? "KinKeep 暂时无法确认妈妈现在的位置。"
      : "妈妈表示身体不舒服，希望家人联系。";
  return `【KinKeep 照护提醒】\n${situation}\n她选择联系你，${contactName}。请尽快打电话确认她的情况。\n\n如有呼吸困难、失去意识、大量出血或严重外伤，请立即拨打 995。`;
}

export function buildWhatsAppUrl(
  contact: CareContact,
  kind: EscalationKind,
  language: "zh" | "en",
  phone?: string,
) {
  const normalizedPhone = normalizePhone(phone);
  const base = normalizedPhone
    ? `https://wa.me/${normalizedPhone}`
    : "https://wa.me/";
  const message = buildWhatsAppMessage(contact, kind, language);
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function GET(request: Request) {
  const url = new URL(request.url);
  const contact = url.searchParams.get("contact");
  const kind = url.searchParams.get("kind");
  const language = url.searchParams.get("language") === "en" ? "en" : "zh";

  if (contact !== "elena" && contact !== "david") {
    return Response.json({ error: "Unknown family contact." }, { status: 400 });
  }
  if (!kind || !VALID_KINDS.has(kind as EscalationKind)) {
    return Response.json({ error: "Unknown care alert type." }, { status: 400 });
  }

  const phone = process.env[CONTACT_ENV[contact]];
  const whatsappUrl = buildWhatsAppUrl(
    contact,
    kind as EscalationKind,
    language,
    phone,
  );
  return new Response(null, {
    status: 307,
    headers: {
      "Cache-Control": "no-store",
      Location: whatsappUrl,
    },
  });
}
