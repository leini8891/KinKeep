import { demoScenarioDate } from "./demo-health-data";

export type CarePlanId = "monitor" | "family_call" | "care_navigation";

export type CareEpisodeStatus =
  | "awaiting_family"
  | "active"
  | "paused"
  | "resolved";

export type CareEpisode = {
  id: string;
  status: CareEpisodeStatus;
  selectedPlan?: CarePlanId;
  parentConsentAt: string;
  approvedAt?: string;
  resolvedAt?: string;
};

export type CareTask = {
  id: string;
  kind: "call" | "meal" | "check_in" | "research";
  time: string;
  titleZh: string;
  titleEn: string;
  detailZh: string;
  detailEn: string;
  ownerZh: string;
  ownerEn: string;
};

export type CarePlanDefinition = {
  id: CarePlanId;
  titleZh: string;
  titleEn: string;
  labelZh: string;
  labelEn: string;
  descriptionZh: string;
  descriptionEn: string;
  tasks: CareTask[];
};

export const CARE_EPISODE_EVENT = "kinkeep:care-episode";

const STORAGE_KEY = "kinkeep-care-episode-v1";

export const carePlans: Record<CarePlanId, CarePlanDefinition> = {
  monitor: {
    id: "monitor",
    titleZh: "先在家观察",
    titleEn: "Monitor at home",
    labelZh: "最少介入",
    labelEn: "Lowest intervention",
    descriptionZh: "暂不联系诊所；先确认进食和休息，下午由 KinKeep 再问一次。",
    descriptionEn: "Do not contact a clinic yet. Confirm food and rest, then let KinKeep check again this afternoon.",
    tasks: [
      {
        id: "monitor-lunch",
        kind: "meal",
        time: "12:00",
        titleZh: "确认午餐",
        titleEn: "Confirm lunch",
        detailZh: "提醒拍照或确认已经进食",
        detailEn: "Ask for a photo or confirmation that she ate",
        ownerZh: "助手",
        ownerEn: "Companion",
      },
      {
        id: "monitor-follow-up",
        kind: "check_in",
        time: "15:00",
        titleZh: "再次问候",
        titleEn: "Follow-up check-in",
        detailZh: "确认疼痛、活动和进食是否改善",
        detailEn: "Check whether pain, activity, and eating improved",
        ownerZh: "助手",
        ownerEn: "Companion",
      },
    ],
  },
  family_call: {
    id: "family_call",
    titleZh: "请家人联系",
    titleEn: "Ask family to call",
    labelZh: "建议",
    labelEn: "Suggested",
    descriptionZh: "由 Elena 在午餐前打电话，KinKeep 下午自动复查。",
    descriptionEn: "Elena calls before lunch, and KinKeep follows up automatically this afternoon.",
    tasks: [
      {
        id: "family-call",
        kind: "call",
        time: "10:30",
        titleZh: "联系妈妈",
        titleEn: "Call Mum",
        detailZh: "确认膝盖、早餐和是否需要帮助",
        detailEn: "Check her knee, breakfast, and whether she needs help",
        ownerZh: "Elena",
        ownerEn: "Elena",
      },
      {
        id: "family-lunch",
        kind: "meal",
        time: "12:00",
        titleZh: "午餐确认",
        titleEn: "Confirm lunch",
        detailZh: "若仍未进食，提醒家属",
        detailEn: "Notify family if she still has not eaten",
        ownerZh: "助手",
        ownerEn: "Companion",
      },
      {
        id: "family-follow-up",
        kind: "check_in",
        time: "15:00",
        titleZh: "再次问候",
        titleEn: "Follow-up check-in",
        detailZh: "如仍不适，再请 Elena 决定下一步",
        detailEn: "If discomfort continues, ask Elena to decide the next step",
        ownerZh: "助手",
        ownerEn: "Companion",
      },
    ],
  },
  care_navigation: {
    id: "care_navigation",
    titleZh: "了解专业照护选项",
    titleEn: "Explore professional care",
    labelZh: "需要更多判断",
    labelEn: "More review needed",
    descriptionZh: "先准备本地 GP 与远程问诊信息；不会自动预约或分享资料。",
    descriptionEn: "Prepare local GP and telehealth information without booking or sharing data automatically.",
    tasks: [
      {
        id: "care-options",
        kind: "research",
        time: "09:30",
        titleZh: "准备照护选项",
        titleEn: "Prepare care options",
        detailZh: "整理本地 GP 与远程问诊路径",
        detailEn: "Organize local GP and telehealth pathways",
        ownerZh: "助手",
        ownerEn: "Companion",
      },
      {
        id: "care-review",
        kind: "call",
        time: "10:30",
        titleZh: "与妈妈确认偏好",
        titleEn: "Confirm Mum's preference",
        detailZh: "Elena 先沟通，再决定是否联系机构",
        detailEn: "Elena talks with Mum before contacting any provider",
        ownerZh: "Elena",
        ownerEn: "Elena",
      },
      {
        id: "care-follow-up",
        kind: "check_in",
        time: "15:00",
        titleZh: "复查状态",
        titleEn: "Review her status",
        detailZh: "记录是否改善或需要继续安排",
        detailEn: "Record whether she improved or needs further arrangements",
        ownerZh: "助手",
        ownerEn: "Companion",
      },
    ],
  },
};

export function createCareEpisode(): CareEpisode {
  return {
    id: `care-mum-knee-${demoScenarioDate}`,
    status: "awaiting_family",
    parentConsentAt: `${demoScenarioDate}T08:16:00+08:00`,
  };
}

export function readCareEpisode(): CareEpisode | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) as CareEpisode : null;
  } catch {
    return null;
  }
}

export function saveCareEpisode(episode: CareEpisode) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(episode));
  window.dispatchEvent(new CustomEvent(CARE_EPISODE_EVENT, { detail: episode }));
}
