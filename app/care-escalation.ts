export type EscalationKind = "symptom" | "urgent" | "wandering";
export type EscalationStage =
  | "primary_push"
  | "primary_multichannel"
  | "backup_acknowledged";

export type CareEscalation = {
  id: string;
  kind: EscalationKind;
  stage: EscalationStage;
  reasonZh: string;
  reasonEn: string;
  startedAt: string;
  lastLocation?: string;
  heartRate?: number;
  deviceBattery?: number;
};

export const ESCALATION_STORAGE_KEY = "kinkeep_active_escalation";
export const ESCALATION_EVENT = "kinkeep-escalation";

export function readCareEscalation(): CareEscalation | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(ESCALATION_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as CareEscalation) : null;
  } catch {
    return null;
  }
}

export function saveCareEscalation(escalation: CareEscalation) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ESCALATION_STORAGE_KEY, JSON.stringify(escalation));
  window.dispatchEvent(new CustomEvent(ESCALATION_EVENT, { detail: escalation }));
}

export function createCareEscalation(
  kind: EscalationKind,
  details?: Partial<Pick<CareEscalation, "lastLocation" | "heartRate" | "deviceBattery">>,
): CareEscalation {
  const reasons = {
    symptom: ["妈妈表示持续不舒服，希望家属联系", "Mum feels unwell and asked for family contact"],
    urgent: ["妈妈表示现在需要紧急帮助", "Mum says she needs urgent help now"],
    wandering: ["离开安全区域后未回应，可能迷路", "Left the safe zone and did not respond; may be lost"],
  } as const;

  return {
    id: `care-${Date.now()}`,
    kind,
    stage: "primary_push",
    reasonZh: reasons[kind][0],
    reasonEn: reasons[kind][1],
    startedAt: new Date().toISOString(),
    ...details,
  };
}
