"use client";

import {
  Camera,
  CircleCheck,
  Footprints,
  HeartPulse,
  Leaf,
  LoaderCircle,
  Mic,
  Moon,
  PersonStanding,
  Send,
  Siren,
  Smile,
  Sparkles,
  Utensils,
  UserRound,
  UsersRound,
  Volume2,
  Watch,
} from "lucide-react";
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { NutritionAnalysis } from "./nutrition";
import { CareEscalationCard } from "./care-escalation-card";
import { createCareEpisode, saveCareEpisode } from "./care-episode";
import { morningHealthFixture } from "./demo-health-data";
import { FollowUpConfirmationCard } from "./follow-up-confirmation-card";
import {
  ESCALATION_EVENT,
  careWhatsAppHref,
  createCareEscalation,
  readCareEscalation,
  saveCareEscalation,
  type CareContact,
  type CareEscalation,
  type EscalationKind,
} from "./care-escalation";

type Language = "zh" | "en";
type DayPeriod = "morning" | "afternoon" | "evening";
type MealPeriod = "breakfast" | "lunch" | "dinner";
type TimeContext = { dayPeriod: DayPeriod; mealPeriod: MealPeriod };
type GuidanceKind = "general" | "knee" | "stomach" | "dizziness";
type Step =
  | "initial"
  | "meal-check"
  | "stomach-safety"
  | "stomach-duration"
  | "knee-duration"
  | "knee-safety"
  | "call-choice"
  | "family-contact-choice"
  | "sleep-symptoms"
  | "meal-photo"
  | "help-problem"
  | "done";
type MessageTone = "normal" | "status" | "alert";
type Message = {
  id: number;
  role: "assistant" | "user" | "watch";
  tone?: MessageTone;
  text?: string;
  imageUrl?: string;
  fileName?: string;
  health?: boolean;
  watchSync?: boolean;
  syncing?: boolean;
  nutrition?: NutritionAnalysis;
  loading?: boolean;
  replying?: boolean;
  proactiveThinking?: boolean;
  error?: string;
  escalation?: CareEscalation;
  followUpConfirmation?: boolean;
  readAloud?: boolean;
};
type QuickAction = {
  id: string;
  label: string;
  detail?: string;
  important?: boolean;
};

const copy = {
  zh: {
    name: "陈阿姨",
    greetings: {
      morning: "早上好",
      afternoon: "下午好",
      evening: "晚上好",
    },
    presenceSuffix: "今天也陪着你",
    mealQuestions: {
      breakfast: "早餐吃了吗？",
      lunch: "午餐吃了吗？",
      dinner: "晚餐吃了吗？",
    },
    mealNotYet: {
      breakfast: "早餐还没吃",
      lunch: "午餐还没吃",
      dinner: "晚餐还没吃",
    },
    helloHealthContext: "昨晚睡得比平时少一些，今天还没出去散步。",
    helloKneePrompt: "膝盖还舒服吗？",
    fineAcknowledgement: "那就好。",
    medicine: "降压药已完成",
    lunch: "午餐提醒",
    stretch: "室内拉伸",
    today: "今天",
    watchConnectTitle: "连接 Apple Watch",
    watchConnectText: "同步昨晚睡眠、今早心率和活动数据",
    watchSyncButton: "同步健康数据",
    watchSyncing: "正在同步…",
    healthTitle: "今早健康概览",
    synced: `${morningHealthFixture.syncedAt} 已同步`,
    sleep: `睡眠 · 少 ${morningHealthFixture.sleep.deltaZh}`,
    heart: `静息心率 · 高 ${morningHealthFixture.restingHeartRate.delta} bpm`,
    steps: "步数 · 偏少",
    summary: "没有紧急问题，但今天早上比平时安静。",
    companion: "陪伴助手",
    well: "我很好",
    help: "需要帮助",
    knee: "膝盖有点痛",
    poorSleep: "昨晚没睡好",
    noAppetite: "今天没胃口",
    stomach: "肚子有点痛",
    stomachMine: "肚子有点痛。",
    stomachAsk: "肚子是今天开始不舒服，还是最近几天反复出现？",
    stomachSafetyAsk: "听到您肚子疼，我在这里陪您。现在有没有剧烈疼痛、呕吐、发烧、冒冷汗、胸闷，或者肚子变硬？",
    stomachSafe: "没有这些情况",
    stomachDanger: "有其中一种",
    suggestionBasis: "根据同步数据和近期健康记录推荐",
    fine: "我很好。",
    ate: "已经吃了",
    notYet: "还没有",
    uploadMeal: "拍餐食照片",
    kneeMine: "膝盖有点痛。",
    kneeAsk: "疼痛是今天刚开始，还是已经有几天了？",
    todayPain: "今天开始",
    daysPain: "有几天了",
    severe: "比较严重",
    kneeSafetyAsk: "明白。现在有没有跌倒、胸闷、呼吸困难，或者疼痛突然变得很严重？",
    kneeSafe: "没有这些情况",
    kneeDanger: "有，需要帮助",
    painFollow: "我已经记录下来。需要请 Elena 今天给你打电话吗？",
    yesCall: "好的，请联系",
    noCall: "暂时不用",
    contactFamilyAsk: "我现在联系你的家属好吗？",
    guidanceGeneral: "参考建议：如果有呼吸困难、失去意识、大量出血或严重外伤，请立即拨打 995；如果不是危及生命但需要医疗判断，可联系 NurseFirst 6262 6262。",
    guidanceKnee: "参考建议：先停止走动，避免独自站立。若跌倒后无法起身、呼吸困难、失去意识、大量出血或出现严重外伤，请拨打 995；非紧急情况可联系医生或 NurseFirst 6262 6262。",
    guidanceStomach: "参考建议：如果腹痛突然且持续不缓解，或伴随呼吸困难、失去意识或大量出血，请拨打 995；其他非紧急情况可联系医生或 NurseFirst 6262 6262。",
    guidanceDizziness: "参考建议：先坐下或躺下，不要独自行走。若出现呼吸困难、失去意识、严重外伤或中风迹象，请拨打 995；非紧急情况可联系医生或 NurseFirst 6262 6262。",
    readAdvice: "朗读建议",
    speechUnsupported: "当前设备暂时无法朗读，请查看屏幕文字。",
    contactElena: "联系女儿 Elena",
    contactDavid: "联系儿子 David",
    contactDavidOption: "儿子 David · 约 3 km",
    contactDavidLocation: "已授权共享 · 更新于 2 分钟前",
    contactElenaOption: "女儿 Elena",
    contactElenaLocation: "未授权位置共享",
    handleMyself: "暂不联系家属",
    noFamilyContactConfirmed: "好的，暂不通知家属。参考建议仍保留在上方；情况变化时可以随时点击“需要帮助”。",
    callDone: "已经通知 Elena，她今天会给你打电话。",
    noteDone: "好的，我先记录。稍后会再来问候你。",
    sleepMine: "昨晚没睡好。",
    sleepAsk: "现在有没有头晕、胸闷或其他不舒服？",
    noSymptom: "没有不舒服",
    dizzy: "有点头晕",
    sleepDone: "好的。今天先慢一点，下午我会再问问你。",
    dizzyDone: "请先坐到安全的地方。我已经通知 Elena 尽快联系你。",
    appetiteMine: "今天没胃口。",
    appetiteAsk: "明白。吃饭时愿意拍张照片吗？我可以帮你看看吃得够不够。",
    mealAdded: "已上传餐食照片",
    analyzingMeal: "营养助手正在识别菜品、份量和营养…",
    analysisFailed: "暂时无法完成营养分析",
    retryPhoto: "重新选择照片",
    caloriesLabel: "估算热量",
    protein: "蛋白质",
    carbs: "碳水",
    fat: "脂肪",
    fiber: "膳食纤维",
    sodium: "钠",
    vegetables: "蔬菜",
    confidence: "识别置信度",
    portion: "估算份量",
    assumptions: "识别依据",
    estimateNote: "根据照片估算，实际数值会因份量和烹调方式变化。",
    photoTypeError: "请选择 JPG、PNG、WEBP 或 GIF 图片。",
    photoSizeError: "请选择小于 10 MB 的图片。",
    uploadTooLarge: "图片超过上传限制，请选择更小的照片或压缩后重试。",
    low: "低",
    medium: "中",
    high: "高",
    moderate: "中等",
    good: "充足",
    helpMine: "我需要帮助。",
    helpProblemAsk: "我在这里陪你。现在遇到了什么问题？你可以直接说，也可以选择下面最接近的情况。",
    urgent: "跌倒、胸闷或呼吸困难",
    voiceInput: "开始语音输入",
    stopVoice: "结束录音",
    listening: "正在听，请说话…",
    transcribing: "正在把语音转成文字…",
    voiceReady: "已识别，请确认文字后点击发送",
    unsupported: "当前浏览器无法使用语音识别，可以继续输入文字。",
    microphoneError: "无法使用麦克风，请允许麦克风权限后重试。",
    voiceError: "没有听清楚，请再说一次。",
    thinking: "陪伴助手正在回复…",
    proactiveThinking: "陪伴助手正在分析您的健康数据…",
    input: "点麦克风说话，或输入文字…",
    defaultReply: "谢谢你告诉我。还有哪里不舒服，或者需要我提醒什么吗？",
    userView: "用户端",
    family: "家属端",
    you: "你",
  },
  en: {
    name: "Mdm Tan",
    greetings: {
      morning: "Good morning",
      afternoon: "Good afternoon",
      evening: "Good evening",
    },
    presenceSuffix: "I’m here with you",
    mealQuestions: {
      breakfast: "Have you had breakfast?",
      lunch: "Have you had lunch?",
      dinner: "Have you had dinner?",
    },
    mealNotYet: {
      breakfast: "I haven’t had breakfast",
      lunch: "I haven’t had lunch",
      dinner: "I haven’t had dinner",
    },
    helloHealthContext: "You slept a little less than usual and have not gone for your walk yet.",
    helloKneePrompt: "How are your knees?",
    fineAcknowledgement: "Glad to hear it.",
    medicine: "Medicine completed",
    lunch: "Lunch reminder",
    stretch: "Indoor stretch",
    today: "Today",
    watchConnectTitle: "Connect Apple Watch",
    watchConnectText: "Sync last night’s sleep, morning heart rate, and activity",
    watchSyncButton: "Sync health data",
    watchSyncing: "Syncing…",
    healthTitle: "Morning health overview",
    synced: `Synced ${morningHealthFixture.syncedAt}`,
    sleep: `Sleep · ${morningHealthFixture.sleep.deltaEn} less`,
    heart: `Resting HR · ${morningHealthFixture.restingHeartRate.delta} bpm higher`,
    steps: "Steps · lower",
    summary: "Nothing urgent, but your morning is quieter than usual.",
    companion: "Companion",
    well: "I feel well",
    help: "I need help",
    knee: "My knee hurts",
    poorSleep: "I slept poorly",
    noAppetite: "I have no appetite",
    stomach: "My stomach hurts",
    stomachMine: "My stomach hurts a little.",
    stomachAsk: "Did the stomach discomfort start today, or has it happened repeatedly over the past few days?",
    stomachSafetyAsk: "I’m here with you. Is the pain severe, or do you have vomiting, fever, a cold sweat, chest tightness, or a hard abdomen?",
    stomachSafe: "None of those",
    stomachDanger: "Yes, one of those",
    suggestionBasis: "Suggested from synced data and recent health history",
    fine: "I feel well.",
    ate: "Yes, I ate",
    notYet: "Not yet",
    uploadMeal: "Upload meal photo",
    kneeMine: "My knee hurts a little.",
    kneeAsk: "Did the pain start today, or has it lasted a few days?",
    todayPain: "Started today",
    daysPain: "A few days",
    severe: "Quite severe",
    kneeSafetyAsk: "Understood. Have you fallen, felt chest tightness or shortness of breath, or has the pain suddenly become severe?",
    kneeSafe: "None of those",
    kneeDanger: "Yes, I need help",
    painFollow: "I’ve noted it. Would you like Elena to call you today?",
    yesCall: "Yes, please",
    noCall: "Not yet",
    contactFamilyAsk: "Would you like me to contact a family member now?",
    guidanceGeneral: "Reference guidance: call 995 for breathlessness, loss of consciousness, excessive bleeding, or major trauma. For non-life-threatening medical guidance, call NurseFirst at 6262 6262.",
    guidanceKnee: "Reference guidance: stop walking and avoid standing alone. Call 995 if a fall leaves you unable to get up, or if there is breathlessness, loss of consciousness, excessive bleeding, or major trauma. For non-emergency guidance, contact a doctor or NurseFirst at 6262 6262.",
    guidanceStomach: "Reference guidance: call 995 for sudden abdominal pain that does not subside, or abdominal pain with breathlessness, loss of consciousness, or excessive bleeding. For other non-emergency guidance, contact a doctor or NurseFirst at 6262 6262.",
    guidanceDizziness: "Reference guidance: sit or lie down and do not walk alone. Call 995 for breathlessness, loss of consciousness, major trauma, or signs of stroke. For non-emergency guidance, contact a doctor or NurseFirst at 6262 6262.",
    readAdvice: "Read advice aloud",
    speechUnsupported: "Read-aloud is not available on this device. Please use the on-screen text.",
    contactElena: "Contact daughter Elena",
    contactDavid: "Contact son David",
    contactDavidOption: "Son David · about 3 km away",
    contactDavidLocation: "Location shared · updated 2 min ago",
    contactElenaOption: "Daughter Elena",
    contactElenaLocation: "Location sharing not authorized",
    handleMyself: "Do not contact family yet",
    noFamilyContactConfirmed: "Okay. No family member will be notified for now. The reference guidance remains above, and you can tap “I need help” if anything changes.",
    callDone: "Elena has been notified and will call you today.",
    noteDone: "Okay, I’ve noted it. I’ll check in again later.",
    sleepMine: "I did not sleep well.",
    sleepAsk: "Do you feel dizzy, short of breath, or otherwise unwell now?",
    noSymptom: "No other symptoms",
    dizzy: "A little dizzy",
    sleepDone: "Okay. Take things slowly today. I’ll check again this afternoon.",
    dizzyDone: "Please sit somewhere safe. I’ve asked Elena to contact you soon.",
    appetiteMine: "I do not feel like eating.",
    appetiteAsk: "Understood. Would you take a photo when you eat? I can help check whether the meal is enough.",
    mealAdded: "Meal photo uploaded",
    analyzingMeal: "The Nutrition Agent is identifying the dish, portion, and nutrients…",
    analysisFailed: "Nutrition analysis could not be completed",
    retryPhoto: "Choose another photo",
    caloriesLabel: "Estimated calories",
    protein: "Protein",
    carbs: "Carbs",
    fat: "Fat",
    fiber: "Fiber",
    sodium: "Sodium",
    vegetables: "Vegetables",
    confidence: "Recognition confidence",
    portion: "Estimated portion",
    assumptions: "Recognition assumptions",
    estimateNote: "Estimated from the photo; actual values vary with portion and preparation.",
    photoTypeError: "Please choose a JPG, PNG, WEBP, or GIF image.",
    photoSizeError: "Please choose an image smaller than 10 MB.",
    uploadTooLarge: "This photo exceeds the upload limit. Choose a smaller photo or compress it and try again.",
    low: "Low",
    medium: "Medium",
    high: "High",
    moderate: "Moderate",
    good: "Good",
    helpMine: "I need help.",
    helpProblemAsk: "I’m here with you. What is happening now? You can tell me directly or choose the closest option below.",
    urgent: "Fall, chest tightness, or breathlessness",
    voiceInput: "Start voice input",
    stopVoice: "Stop recording",
    listening: "Listening — please speak…",
    transcribing: "Turning your voice into text…",
    voiceReady: "Transcript ready — review it, then tap send",
    unsupported: "Voice recognition is not available in this browser. You can continue by typing.",
    microphoneError: "The microphone is unavailable. Allow microphone access and try again.",
    voiceError: "I did not catch that. Please try again.",
    thinking: "Companion is replying…",
    proactiveThinking: "Companion is analyzing your health data…",
    input: "Tap the microphone or type…",
    defaultReply: "Thank you for telling me. Is anything else uncomfortable, or is there something you want me to remind you about?",
    userView: "User",
    family: "Family",
    you: "You",
  },
} as const;

const careProfile = {
  recurringConcerns: ["knee"] as Array<"knee" | "stomach">,
  sleepBelowBaseline: true,
  mealUnconfirmed: true,
};

function getTimeContext(hour: number): TimeContext {
  if (hour < 11) return { dayPeriod: "morning", mealPeriod: "breakfast" };
  if (hour < 16) return { dayPeriod: "afternoon", mealPeriod: "lunch" };
  if (hour < 18) return { dayPeriod: "afternoon", mealPeriod: "dinner" };
  return { dayPeriod: "evening", mealPeriod: "dinner" };
}

function initialMessages(): Message[] {
  return [{ id: 1, role: "watch", tone: "status", watchSync: true }];
}

export function ParentHealthChat() {
  const [language, setLanguage] = useState<Language>("zh");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const nextMessageIdRef = useRef(Math.max(9, ...messages.map((message) => message.id)) + 1);
  const [step, setStep] = useState<Step>("initial");
  const [draft, setDraft] = useState("");
  const [voiceState, setVoiceState] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [timeContext, setTimeContext] = useState<TimeContext>({
    dayPeriod: "morning",
    mealPeriod: "breakfast",
  });
  const [pendingEscalationKind, setPendingEscalationKind] = useState<EscalationKind | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const objectUrlsRef = useRef<string[]>([]);
  const watchSyncTimersRef = useRef<number[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const voiceTimeoutRef = useRef<number | null>(null);
  const t = copy[language];
  const greeting = t.greetings[timeContext.dayPeriod];
  const mealQuestion = t.mealQuestions[timeContext.mealPeriod];
  const mealNotYet = t.mealNotYet[timeContext.mealPeriod];
  const proactiveHello = language === "zh"
    ? `${greeting}，${t.name}。${t.helloHealthContext}\n${t.helloKneePrompt}${mealQuestion}`
    : `${greeting}, ${t.name}. ${t.helloHealthContext}\n${t.helloKneePrompt} ${mealQuestion}`;
  const presence = language === "zh"
    ? `${greeting}，${t.presenceSuffix}`
    : `${greeting}, ${t.presenceSuffix}`;
  const isWatchSynced = messages.some((message) => message.health);
  const isProactiveQuestionReady = messages.some(
    (message) => message.id === 2 && Boolean(message.text),
  );

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);

  useEffect(() => {
    setTimeContext(getTimeContext(new Date().getHours()));
  }, []);

  useEffect(() => {
    const syncEscalation = () => {
      const currentEscalation = readCareEscalation();
      if (!currentEscalation) return;
      setMessages((current) =>
        current.map((message) =>
          message.escalation?.id === currentEscalation.id
            ? { ...message, escalation: currentEscalation }
            : message,
        ),
      );
    };
    window.addEventListener("storage", syncEscalation);
    window.addEventListener(ESCALATION_EVENT, syncEscalation);
    return () => {
      window.removeEventListener("storage", syncEscalation);
      window.removeEventListener(ESCALATION_EVENT, syncEscalation);
    };
  }, []);

  useEffect(() => {
    const objectUrls = objectUrlsRef.current;
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
      watchSyncTimersRef.current.forEach((timer) => window.clearTimeout(timer));
      if (voiceTimeoutRef.current !== null) window.clearTimeout(voiceTimeoutRef.current);
      if (mediaRecorderRef.current?.state === "recording") mediaRecorderRef.current.stop();
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  const addMessage = (message: Omit<Message, "id">) => {
    const id = nextMessageIdRef.current++;
    setMessages((current) => [...current, { ...message, id }]);
  };

  const guidanceFor = (kind: GuidanceKind) => {
    if (kind === "knee") return t.guidanceKnee;
    if (kind === "stomach") return t.guidanceStomach;
    if (kind === "dizziness") return t.guidanceDizziness;
    return t.guidanceGeneral;
  };

  const offerGuidanceAndFamilyChoice = (
    guidanceKind: GuidanceKind,
    escalationKind: EscalationKind,
  ) => {
    addMessage({
      role: "assistant",
      tone: "alert",
      text: `${guidanceFor(guidanceKind)}\n${t.contactFamilyAsk}`,
      readAloud: true,
    });
    setPendingEscalationKind(escalationKind);
    setStep("family-contact-choice");
  };

  const readMessageAloud = (text: string) => {
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
      setVoiceState(t.speechUnsupported);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "zh" ? "zh-CN" : "en-SG";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const startEscalation = (kind: EscalationKind, initialContact: CareContact = "elena") => {
    const escalation = {
      ...createCareEscalation(kind, undefined, initialContact),
      stage: "whatsapp_draft_opened" as const,
    };
    window.open(
      careWhatsAppHref(initialContact, kind, language),
      "_blank",
      "noopener,noreferrer",
    );
    addMessage({ role: "assistant", tone: "alert", escalation });
    setStep("done");
  };

  const confirmWhatsAppSent = (escalation: CareEscalation) => {
    const updated: CareEscalation = {
      ...escalation,
      stage: "whatsapp_send_confirmed",
    };
    saveCareEscalation(updated);
    setMessages((current) =>
      current.map((message) =>
        message.escalation?.id === escalation.id
          ? { ...message, escalation: updated }
          : message,
      ),
    );
  };

  const resetConversation = (nextLanguage: Language) => {
    watchSyncTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    watchSyncTimersRef.current = [];
    setLanguage(nextLanguage);
    setMessages(initialMessages());
    nextMessageIdRef.current = 10;
    setStep("initial");
    setPendingEscalationKind(null);
    setVoiceState("");
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  };

  const syncAppleWatch = () => {
    setMessages((current) =>
      current.map((message) =>
        message.id === 1 ? { ...message, syncing: true } : message,
      ),
    );
    const showHealthSummary = window.setTimeout(() => {
      setMessages((current) =>
        current.map((message) =>
          message.id === 1
            ? { ...message, watchSync: false, syncing: false, health: true }
            : message,
        ),
      );
    }, 700);
    const showAssistantThinking = window.setTimeout(() => {
      setMessages((current) =>
        current.some((message) => message.id === 2)
          ? current
          : [
              ...current,
              {
                id: 2,
                role: "assistant",
                tone: "status",
                replying: true,
                proactiveThinking: true,
              },
            ],
      );
    }, 1200);
    const showProactiveQuestion = window.setTimeout(() => {
      setMessages((current) => {
        const assistantQuestion: Message = {
          id: 2,
          role: "assistant",
          text: proactiveHello,
        };
        return current.some((message) => message.id === 2)
          ? current.map((message) => (message.id === 2 ? assistantQuestion : message))
          : [...current, assistantQuestion];
      });
      watchSyncTimersRef.current = [];
    }, 2800);
    watchSyncTimersRef.current = [
      showHealthSummary,
      showAssistantThinking,
      showProactiveQuestion,
    ];
  };

  const finishCallChoice = (notify: boolean) => {
    addMessage({ role: "user", text: notify ? t.yesCall : t.noCall });
    if (notify) {
      const episode = createCareEpisode();
      saveCareEpisode(episode);
      addMessage({ role: "assistant", tone: "status", followUpConfirmation: true });
    }
    else addMessage({ role: "assistant", text: t.noteDone });
    setStep("done");
  };

  const handleAction = (action: string) => {
    if (action === "well") {
      addMessage({ role: "user", text: t.fine });
      addMessage({ role: "assistant", text: `${t.fineAcknowledgement}${language === "zh" ? "" : " "}${mealQuestion}` });
      setStep("meal-check");
      return;
    }
    if (action === "knee") {
      addMessage({ role: "user", text: t.kneeMine });
      addMessage({ role: "assistant", text: t.kneeAsk });
      setStep("knee-duration");
      return;
    }
    if (action === "stomach") {
      addMessage({ role: "user", text: t.stomachMine });
      addMessage({ role: "assistant", text: t.stomachSafetyAsk });
      setStep("stomach-safety");
      return;
    }
    if (action === "stomach-safe") {
      addMessage({ role: "user", text: t.stomachSafe });
      addMessage({ role: "assistant", text: t.stomachAsk });
      setStep("stomach-duration");
      return;
    }
    if (action === "stomach-danger") {
      addMessage({ role: "user", text: t.stomachDanger });
      offerGuidanceAndFamilyChoice("stomach", "urgent");
      return;
    }
    if (action === "stomach-today" || action === "stomach-recurring") {
      addMessage({ role: "user", text: action === "stomach-today" ? t.todayPain : t.daysPain });
      addMessage({ role: "assistant", text: t.noteDone });
      setStep("done");
      return;
    }
    if (action === "today-pain" || action === "days-pain") {
      addMessage({ role: "user", text: action === "today-pain" ? t.todayPain : t.daysPain });
      addMessage({ role: "assistant", text: t.kneeSafetyAsk });
      setStep("knee-safety");
      return;
    }
    if (action === "knee-safe") {
      addMessage({ role: "user", text: t.kneeSafe });
      addMessage({ role: "assistant", text: t.painFollow });
      setStep("call-choice");
      return;
    }
    if (action === "knee-danger") {
      addMessage({ role: "user", text: t.kneeDanger });
      offerGuidanceAndFamilyChoice("knee", "urgent");
      return;
    }
    if (action === "severe") {
      addMessage({ role: "user", text: t.severe });
      offerGuidanceAndFamilyChoice("knee", "symptom");
      return;
    }
    if (action === "sleep") {
      addMessage({ role: "user", text: t.sleepMine });
      addMessage({ role: "assistant", text: t.sleepAsk });
      setStep("sleep-symptoms");
      return;
    }
    if (action === "no-symptom" || action === "dizzy") {
      addMessage({ role: "user", text: action === "dizzy" ? t.dizzy : t.noSymptom });
      if (action === "dizzy") {
        offerGuidanceAndFamilyChoice("dizziness", "urgent");
      } else addMessage({ role: "assistant", text: t.sleepDone });
      if (action !== "dizzy") setStep("done");
      return;
    }
    if (action === "appetite" || action === "not-yet") {
      addMessage({ role: "user", text: action === "appetite" ? t.appetiteMine : mealNotYet });
      addMessage({ role: "assistant", text: t.appetiteAsk });
      setStep("meal-photo");
      return;
    }
    if (action === "ate") {
      addMessage({ role: "user", text: t.ate });
      addMessage({ role: "assistant", text: t.noteDone });
      setStep("done");
      return;
    }
    if (action === "upload") {
      fileRef.current?.click();
      return;
    }
    if (action === "yes-call") {
      finishCallChoice(true);
      return;
    }
    if (action === "no-call") {
      finishCallChoice(false);
      return;
    }
    if (action === "help") {
      addMessage({ role: "user", text: t.helpMine });
      addMessage({ role: "assistant", text: t.helpProblemAsk });
      setStep("help-problem");
      return;
    }
    if (action === "dizzy-from-help") {
      addMessage({ role: "user", text: t.dizzy });
      offerGuidanceAndFamilyChoice("dizziness", "urgent");
      return;
    }
    if (action === "urgent") {
      addMessage({ role: "user", text: t.urgent });
      offerGuidanceAndFamilyChoice("general", "urgent");
      return;
    }
    if (action === "contact-elena") {
      const escalationKind = pendingEscalationKind ?? "symptom";
      addMessage({ role: "user", text: t.contactElena });
      setPendingEscalationKind(null);
      startEscalation(escalationKind, "elena");
      return;
    }
    if (action === "contact-david") {
      const escalationKind = pendingEscalationKind ?? "symptom";
      addMessage({ role: "user", text: t.contactDavid });
      setPendingEscalationKind(null);
      startEscalation(escalationKind, "david");
      return;
    }
    if (action === "advice-only") {
      addMessage({ role: "user", text: t.handleMyself });
      addMessage({ role: "assistant", text: t.noFamilyContactConfirmed });
      setPendingEscalationKind(null);
      setStep("done");
      return;
    }
  };

  const quickActions: QuickAction[] = (() => {
    switch (step) {
      case "initial":
        return [
          ...careProfile.recurringConcerns.map((concern) =>
            concern === "knee"
              ? { id: "knee", label: t.knee }
              : { id: "stomach", label: t.stomach },
          ),
          ...(careProfile.sleepBelowBaseline ? [{ id: "sleep", label: t.poorSleep }] : []),
          ...(careProfile.mealUnconfirmed ? [{ id: "not-yet", label: mealNotYet }] : []),
        ];
      case "meal-check":
        return [
          { id: "ate", label: t.ate },
          { id: "not-yet", label: t.notYet },
          { id: "upload", label: t.uploadMeal },
        ];
      case "stomach-safety":
        return [
          { id: "stomach-safe", label: t.stomachSafe },
          { id: "stomach-danger", label: t.stomachDanger, important: true },
        ];
      case "stomach-duration":
        return [
          { id: "stomach-today", label: t.todayPain },
          { id: "stomach-recurring", label: t.daysPain },
        ];
      case "knee-duration":
        return [
          { id: "today-pain", label: t.todayPain },
          { id: "days-pain", label: t.daysPain },
          { id: "severe", label: t.severe, important: true },
        ];
      case "knee-safety":
        return [
          { id: "knee-safe", label: t.kneeSafe },
          { id: "knee-danger", label: t.kneeDanger, important: true },
        ];
      case "call-choice":
        return [
          { id: "yes-call", label: t.yesCall, important: true },
          { id: "no-call", label: t.noCall },
        ];
      case "family-contact-choice":
        return [
          {
            id: "contact-david",
            label: t.contactDavidOption,
            detail: t.contactDavidLocation,
            important: true,
          },
          {
            id: "contact-elena",
            label: t.contactElenaOption,
            detail: t.contactElenaLocation,
          },
          { id: "advice-only", label: t.handleMyself },
        ];
      case "sleep-symptoms":
        return [
          { id: "no-symptom", label: t.noSymptom },
          { id: "dizzy", label: t.dizzy, important: true },
        ];
      case "meal-photo":
        return [{ id: "upload", label: t.uploadMeal, important: true }];
      case "help-problem":
        return [
          { id: "stomach", label: t.stomach },
          { id: "knee", label: t.knee },
          { id: "dizzy-from-help", label: t.dizzy },
          { id: "urgent", label: t.urgent, important: true },
        ];
      default:
        return [];
    }
  })();

  const processText = async (text: string) => {
    const normalized = text.toLowerCase();
    if (/胸痛|胸闷|呼吸困难|喘不过气|跌倒|摔倒|晕倒|迷路|chest pain|chest tightness|can'?t breathe|breathless|fell|fall|faint|lost/.test(normalized)) {
      offerGuidanceAndFamilyChoice("general", "urgent");
      return;
    }
    if (/^\s*(帮助|需要帮助|help|i need help)\s*[。.!！]?\s*$/.test(normalized)) {
      addMessage({ role: "assistant", text: t.helpProblemAsk });
      setStep("help-problem");
      return;
    }
    if (/肚子|腹痛|胃痛|stomach|abdominal|tummy/.test(normalized)) {
      addMessage({ role: "assistant", text: t.stomachSafetyAsk });
      setStep("stomach-safety");
      return;
    }
    if (/膝|knee/.test(normalized)) {
      addMessage({ role: "assistant", text: t.kneeAsk });
      setStep("knee-duration");
      return;
    }
    if (/没睡好|睡不着|失眠|睡眠|poor sleep|didn'?t sleep|insomnia/.test(normalized)) {
      addMessage({ role: "assistant", text: t.sleepAsk });
      setStep("sleep-symptoms");
      return;
    }
    if (/没胃口|不想吃|no appetite|don'?t want to eat/.test(normalized)) {
      addMessage({ role: "assistant", text: t.appetiteAsk });
      setStep("meal-photo");
      return;
    }

    setStep("done");
    const replyMessageId = nextMessageIdRef.current++;
    setIsReplying(true);
    setMessages((current) => [...current, { id: replyMessageId, role: "assistant", tone: "status", replying: true }]);

    try {
      const response = await fetch("/api/companion-reply", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          language,
          message: text,
          healthSynced: isWatchSynced,
          history: messages
            .filter((message) => message.text)
            .slice(-10)
            .map((message) => ({ role: message.role, text: message.text })),
        }),
      });
      const payload = (await response.json()) as { reply?: string };
      if (!response.ok || !payload.reply) throw new Error("No reply");
      setMessages((current) => current.map((message) => message.id === replyMessageId ? { ...message, replying: false, tone: "normal", text: payload.reply } : message));
    } catch {
      setMessages((current) => current.map((message) => message.id === replyMessageId ? { ...message, replying: false, tone: "normal", text: t.defaultReply } : message));
    } finally {
      setIsReplying(false);
      setStep("done");
    }
  };

  const sendDraft = () => {
    const text = draft.trim();
    if (!text || isReplying) return;
    setDraft("");
    setVoiceState("");
    addMessage({ role: "user", text });
    void processText(text);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    // IME composition (e.g. pinyin) uses Enter to commit text, not to send.
    if (event.key === "Enter" && !event.nativeEvent.isComposing) sendDraft();
  };

  const handlePhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const supportedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
    if (!supportedTypes.has(file.type)) {
      setVoiceState(t.photoTypeError);
      event.target.value = "";
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setVoiceState(t.photoSizeError);
      event.target.value = "";
      return;
    }

    setVoiceState("");
    const imageUrl = URL.createObjectURL(file);
    objectUrlsRef.current.push(imageUrl);
    const imageMessageId = nextMessageIdRef.current++;
    const analysisMessageId = nextMessageIdRef.current++;
    setMessages((current) => [
      ...current,
      { id: imageMessageId, role: "user", imageUrl, fileName: file.name },
      {
        id: analysisMessageId,
        role: "assistant",
        tone: "status",
        loading: true,
      },
    ]);
    setStep("done");
    event.target.value = "";

    const formData = new FormData();
    formData.append("image", file);
    formData.append("language", language);

    try {
      const response = await fetch("/api/analyze-meal", {
        method: "POST",
        body: formData,
      });
      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.toLowerCase().includes("application/json")) {
        await response.text();
        throw new Error(response.status === 413 ? t.uploadTooLarge : t.analysisFailed);
      }

      const payload = (await response.json()) as {
        analysis?: NutritionAnalysis;
        error?: string;
      };

      if (!response.ok || !payload.analysis) {
        throw new Error(payload.error || t.analysisFailed);
      }

      setMessages((current) =>
        current.map((message) =>
          message.id === analysisMessageId
            ? {
                ...message,
                loading: false,
                nutrition: payload.analysis,
              }
            : message,
        ),
      );
    } catch (error) {
      setMessages((current) =>
        current.map((message) =>
          message.id === analysisMessageId
            ? {
                ...message,
                loading: false,
                error: error instanceof Error ? error.message : t.analysisFailed,
              }
            : message,
        ),
      );
    }
  };

  const transcribeRecording = async (audio: Blob) => {
    setIsTranscribing(true);
    setVoiceState(t.transcribing);
    const formData = new FormData();
    const extension = audio.type.includes("mp4") ? "mp4" : audio.type.includes("ogg") ? "ogg" : "webm";
    formData.append("audio", audio, `voice-input.${extension}`);
    formData.append("language", language);

    try {
      const response = await fetch("/api/transcribe", { method: "POST", body: formData });
      const contentType = response.headers.get("content-type") ?? "";
      const payload = contentType.includes("application/json")
        ? (await response.json()) as { text?: string; error?: string }
        : { error: t.voiceError };
      if (!response.ok || !payload.text) throw new Error(payload.error || t.voiceError);
      setDraft(payload.text);
      setVoiceState(t.voiceReady);
    } catch (error) {
      setVoiceState(error instanceof Error ? error.message : t.voiceError);
    } finally {
      setIsTranscribing(false);
    }
  };

  const stopVoiceRecording = () => {
    if (voiceTimeoutRef.current !== null) {
      window.clearTimeout(voiceTimeoutRef.current);
      voiceTimeoutRef.current = null;
    }
    if (mediaRecorderRef.current?.state === "recording") mediaRecorderRef.current.stop();
  };

  const startVoiceRecording = async () => {
    if (!("MediaRecorder" in window) || !navigator.mediaDevices?.getUserMedia) {
      setVoiceState(t.unsupported);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      audioChunksRef.current = [];
      const preferredType = ["audio/webm;codecs=opus", "audio/mp4", "audio/webm"]
        .find((type) => MediaRecorder.isTypeSupported(type));
      const recorder = preferredType ? new MediaRecorder(stream, { mimeType: preferredType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      recorder.onerror = () => {
        setIsListening(false);
        setVoiceState(t.voiceError);
      };
      recorder.onstop = () => {
        setIsListening(false);
        mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
        const audio = new Blob(audioChunksRef.current, { type: recorder.mimeType || "audio/webm" });
        audioChunksRef.current = [];
        if (audio.size === 0) {
          setVoiceState(t.voiceError);
          return;
        }
        void transcribeRecording(audio);
      };
      recorder.start();
      setIsListening(true);
      setVoiceState(t.listening);
      voiceTimeoutRef.current = window.setTimeout(stopVoiceRecording, 12_000);
    } catch {
      setIsListening(false);
      setVoiceState(t.microphoneError);
    }
  };

  const handleVoiceInput = () => {
    if (isListening) stopVoiceRecording();
    else void startVoiceRecording();
  };

  return (
    <section className="phone-app" aria-label="KinKeep parent companion">
      <header className="app-header">
        <div className="profile-heading">
          <div className="profile-avatar" aria-hidden="true">陈</div>
          <div>
            <strong>{t.name}</strong>
            <span className="presence"><i />{presence}</span>
          </div>
        </div>
        <div className="language-switch" aria-label="Language">
          <button className={language === "en" ? "selected" : ""} onClick={() => resetConversation("en")} aria-pressed={language === "en"}>EN</button>
          <button className={language === "zh" ? "selected" : ""} onClick={() => resetConversation("zh")} aria-pressed={language === "zh"}>中文</button>
        </div>
      </header>

      <nav className="audience-switch" aria-label={language === "zh" ? "端视图" : "View"}>
        <span className="selected" aria-current="page"><UserRound size={16} />{t.userView}</span>
        <Link href="/family"><UsersRound size={16} />{t.family}</Link>
      </nav>

      <section className="schedule-strip" aria-label="Today’s reminders">
        <div className="schedule-item done"><CircleCheck size={18} /><span><strong>08:00</strong><small>{t.medicine}</small></span></div>
        <div className="schedule-item"><Utensils size={18} /><span><strong>12:00</strong><small>{t.lunch}</small></span></div>
        <div className="schedule-item"><PersonStanding size={18} /><span><strong>15:00</strong><small>{t.stretch}</small></span></div>
      </section>

      <div className="day-label">{t.today}</div>

      <section className="chat-thread" aria-label="Conversation">
        {messages.map((message) => (
          <article key={message.id} className={`message ${message.role === "user" ? "mine" : ""} ${message.tone ?? "normal"}`}>
            <small>{message.role === "watch" ? "Apple Watch" : message.role === "user" ? t.you : t.companion}</small>
            <div className="bubble">
              {message.watchSync ? (
                <div className="watch-sync-card" role="status" aria-live="polite">
                  <span className="watch-sync-icon"><Watch size={24} /></span>
                  <div className="watch-sync-copy">
                    <strong>{t.watchConnectTitle}</strong>
                    <span>{t.watchConnectText}</span>
                  </div>
                  <button type="button" onClick={syncAppleWatch} disabled={message.syncing}>
                    {message.syncing ? <LoaderCircle size={17} /> : <Watch size={17} />}
                    {message.syncing ? t.watchSyncing : t.watchSyncButton}
                  </button>
                </div>
              ) : message.replying ? (
                <div className="nutrition-loading" role="status" aria-live="polite">
                  <LoaderCircle size={20} />
                  <span>{message.proactiveThinking ? t.proactiveThinking : t.thinking}</span>
                </div>
              ) : message.loading ? (
                <div className="nutrition-loading" role="status">
                  <LoaderCircle size={20} />
                  <span>{t.analyzingMeal}</span>
                </div>
              ) : message.nutrition ? (
                <div className="nutrition-result">
                  <div className="nutrition-heading">
                    <span><Leaf size={19} /><strong>{message.nutrition.dishName}</strong></span>
                    <span className="confidence-badge">
                      {t.confidence} · {t[message.nutrition.confidence]}
                    </span>
                  </div>
                  <p className="nutrition-portion"><strong>{t.portion}</strong> · {message.nutrition.portion}</p>
                  {message.nutrition.isFood ? (
                    <>
                      <div className="calorie-range">
                        <span>{t.caloriesLabel}</span>
                        <strong>{Math.round(message.nutrition.calories.min)}–{Math.round(message.nutrition.calories.max)} kcal</strong>
                      </div>
                      <div className="macro-grid">
                        <div><strong>{Math.round(message.nutrition.nutrients.proteinG)}g</strong><span>{t.protein}</span></div>
                        <div><strong>{Math.round(message.nutrition.nutrients.carbsG)}g</strong><span>{t.carbs}</span></div>
                        <div><strong>{Math.round(message.nutrition.nutrients.fatG)}g</strong><span>{t.fat}</span></div>
                        <div><strong>{Math.round(message.nutrition.nutrients.fiberG)}g</strong><span>{t.fiber}</span></div>
                      </div>
                      <div className="nutrition-signals">
                        <span>{t.vegetables} · {t[message.nutrition.nutrients.vegetableLevel]}</span>
                        <span>{t.sodium} · {t[message.nutrition.nutrients.sodiumLevel]}</span>
                      </div>
                    </>
                  ) : null}
                  <div className="nutrition-advice">
                    <p>{message.nutrition.summary}</p>
                    <p><strong>{message.nutrition.suggestion}</strong></p>
                  </div>
                  {message.nutrition.assumptions.length > 0 ? (
                    <details className="nutrition-assumptions">
                      <summary>{t.assumptions}</summary>
                      <ul>{message.nutrition.assumptions.map((assumption) => <li key={assumption}>{assumption}</li>)}</ul>
                    </details>
                  ) : null}
                  <p className="estimate-note">{t.estimateNote}</p>
                </div>
              ) : message.error ? (
                <div className="nutrition-error" role="alert">
                  <strong>{t.analysisFailed}</strong>
                  <span>{message.error}</span>
                  <button onClick={() => fileRef.current?.click()}>{t.retryPhoto}</button>
                </div>
              ) : message.escalation ? (
                <CareEscalationCard
                  escalation={message.escalation}
                  language={language}
                  audience="parent"
                  onConfirmWhatsAppSent={() => confirmWhatsAppSent(message.escalation!)}
                />
              ) : message.followUpConfirmation ? (
                <FollowUpConfirmationCard language={language} />
              ) : message.health ? (
                <div className="health-summary">
                  <div className="health-summary-title"><strong>{t.healthTitle}</strong><span>{t.synced}</span></div>
                  <div className="health-metrics">
                    <div><Moon size={18} /><strong>{morningHealthFixture.sleep.value}</strong><small>{t.sleep}</small></div>
                    <div><HeartPulse size={18} /><strong>{morningHealthFixture.restingHeartRate.value} bpm</strong><small>{t.heart}</small></div>
                    <div><Footprints size={18} /><strong>{morningHealthFixture.steps.value}</strong><small>{t.steps}</small></div>
                  </div>
                  <p><span>{t.summary}</span><Sparkles size={17} /></p>
                </div>
              ) : message.imageUrl ? (
                <div className="uploaded-meal">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={message.imageUrl} alt={t.mealAdded} />
                  <span>{t.mealAdded} · {message.fileName}</span>
                </div>
              ) : (
                <>
                  {message.text?.split("\n").map((line) => <p key={line}>{line}</p>)}
                  {message.readAloud && message.text && (
                    <button
                      type="button"
                      className="advice-listen-button"
                      onClick={() => readMessageAloud(message.text ?? "")}
                      aria-label={t.readAdvice}
                      title={t.readAdvice}
                    >
                      <Volume2 size={17} />
                      <span>{t.readAdvice}</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </article>
        ))}
        <div ref={endRef} />
      </section>

      {quickActions.length > 0 && (step !== "initial" || (isWatchSynced && isProactiveQuestionReady)) && (
        <div className="quick-action-area">
          {step === "initial" && <small className="quick-action-basis"><Sparkles size={14} />{t.suggestionBasis}</small>}
          <div className="quick-actions" aria-label="Suggested replies">
            {quickActions.map((action) => (
              <button
                key={action.id}
                className={[
                  action.important ? "important" : "",
                  action.detail ? "with-detail" : "",
                ].filter(Boolean).join(" ")}
                onClick={() => handleAction(action.id)}
              >
                <span>{action.label}</span>
                {action.detail && <small>{action.detail}</small>}
              </button>
            ))}
          </div>
        </div>
      )}

      <footer className="chat-controls">
        <div className="safety-actions">
          <button className="well-button" onClick={() => handleAction("well")}><Smile size={20} />{t.well}</button>
          <button className="help-button" onClick={() => handleAction("help")}><Siren size={20} />{t.help}</button>
        </div>
        <div className="composer">
          <button
            className={`icon-button ${isListening ? "listening" : ""}`}
            onClick={handleVoiceInput}
            aria-label={isListening ? t.stopVoice : t.voiceInput}
            aria-pressed={isListening}
            disabled={isTranscribing}
            title={isListening ? t.stopVoice : t.voiceInput}
          ><Mic size={21} /></button>
          <div className="text-entry">
            <input value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={handleKeyDown} placeholder={t.input} aria-label={t.input} />
            <button onClick={sendDraft} aria-label="Send" disabled={isReplying}><Send size={19} /></button>
          </div>
          <button className="icon-button" onClick={() => fileRef.current?.click()} aria-label={t.uploadMeal}><Camera size={21} /></button>
          <input ref={fileRef} hidden type="file" accept="image/jpeg,image/png,image/webp,image/gif" capture="environment" onChange={handlePhoto} />
        </div>
        {voiceState && <div className={`voice-state ${isListening || isTranscribing ? "active" : ""}`} role="status">{voiceState}</div>}
      </footer>
    </section>
  );
}
