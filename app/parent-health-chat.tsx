"use client";

import {
  Camera,
  CheckCircle2,
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
  Watch,
} from "lucide-react";
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { NutritionAnalysis } from "./nutrition";
import { CareEscalationCard } from "./care-escalation-card";
import {
  createCareEscalation,
  saveCareEscalation,
  type CareEscalation,
  type EscalationKind,
  type EscalationStage,
} from "./care-escalation";

type Language = "zh" | "en";
type Step =
  | "initial"
  | "breakfast"
  | "knee-duration"
  | "call-choice"
  | "sleep-symptoms"
  | "meal-photo"
  | "help-urgent"
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
  error?: string;
  escalation?: CareEscalation;
};
type QuickAction = { id: string; label: string; important?: boolean };

const copy = {
  zh: {
    name: "陈阿姨",
    presence: "早上好，今天也陪着你",
    medicine: "降压药已完成",
    lunch: "午餐提醒",
    stretch: "室内拉伸",
    today: "今天",
    watchConnectTitle: "连接 Apple Watch",
    watchConnectText: "同步昨晚睡眠、今早心率和活动数据",
    watchSyncButton: "同步健康数据",
    watchSyncing: "正在同步…",
    healthTitle: "今早健康概览",
    synced: "07:42 已同步",
    sleep: "睡眠 · 少 1h",
    heart: "心率 · 稳定",
    steps: "步数 · 偏少",
    summary: "没有紧急问题，但今天早上比平时安静。",
    companion: "陪伴助手",
    hello: "早上好，陈阿姨。昨晚睡得比平时少一些，今天还没出去散步。\n膝盖还舒服吗？早餐吃了吗？",
    well: "我很好",
    help: "需要帮助",
    knee: "膝盖有点痛",
    poorSleep: "昨晚没睡好",
    noAppetite: "今天没胃口",
    breakfastNotYet: "早餐还没吃",
    stomach: "肚子有点痛",
    stomachMine: "肚子有点痛。",
    stomachAsk: "肚子是今天开始不舒服，还是最近几天反复出现？",
    suggestionBasis: "根据同步数据和近期健康记录推荐",
    fine: "我很好。",
    fineNext: "那就好。早餐吃了吗？",
    ate: "已经吃了",
    notYet: "还没有",
    uploadMeal: "拍午餐照片",
    kneeMine: "膝盖有点痛。",
    kneeAsk: "疼痛是今天刚开始，还是已经有几天了？",
    todayPain: "今天开始",
    daysPain: "有几天了",
    severe: "比较严重",
    painFollow: "我已经记录下来。需要请 Elena 今天给你打电话吗？",
    yesCall: "好的，请联系",
    noCall: "暂时不用",
    callDone: "已经通知 Elena，她今天会给你打电话。",
    noteDone: "好的，我先记录。下午会再来问候你。",
    sleepMine: "昨晚没睡好。",
    sleepAsk: "现在有没有头晕、胸闷或其他不舒服？",
    noSymptom: "没有不舒服",
    dizzy: "有点头晕",
    sleepDone: "好的。今天先慢一点，下午我会再问问你。",
    dizzyDone: "请先坐到安全的地方。我已经通知 Elena 尽快联系你。",
    appetiteMine: "今天没胃口。",
    appetiteAsk: "明白。午餐时愿意拍张照片吗？我可以帮你看看吃得够不够。",
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
    urgentAsk: "我会陪着你。你现在有紧急危险吗？",
    urgent: "是的，很紧急",
    callElena: "请 Elena 联系我",
    notUrgent: "不紧急",
    urgentDone: "已向 Elena 发送紧急通知，并附上你授权共享的位置和最新健康信息。",
    voiceInput: "开始语音输入",
    stopVoice: "结束录音",
    voiceHint: "点麦克风说话；录音仅用于本次转写",
    listening: "正在听，请说话…",
    transcribing: "正在把语音转成文字…",
    voiceReady: "已识别，请确认文字后点击发送",
    unsupported: "当前浏览器无法使用语音识别，可以继续输入文字。",
    microphoneError: "无法使用麦克风，请允许麦克风权限后重试。",
    voiceError: "没有听清楚，请再说一次。",
    thinking: "陪伴助手正在回复…",
    input: "想说什么都可以…",
    defaultReply: "谢谢你告诉我。还有哪里不舒服，或者需要我提醒什么吗？",
    privacy: "只有经过你同意的更新才会与 Elena 共享",
    userView: "用户端",
    family: "家属端",
    you: "你",
  },
  en: {
    name: "Mdm Tan",
    presence: "Good morning, I’m here with you",
    medicine: "Medicine completed",
    lunch: "Lunch reminder",
    stretch: "Indoor stretch",
    today: "Today",
    watchConnectTitle: "Connect Apple Watch",
    watchConnectText: "Sync last night’s sleep, morning heart rate, and activity",
    watchSyncButton: "Sync health data",
    watchSyncing: "Syncing…",
    healthTitle: "Morning health overview",
    synced: "Synced 07:42",
    sleep: "Sleep · 1h less",
    heart: "Heart rate · steady",
    steps: "Steps · lower",
    summary: "Nothing urgent, but your morning is quieter than usual.",
    companion: "Companion",
    hello: "Good morning, Mdm Tan. You slept a little less than usual and have not gone for your walk yet.\nHow are your knees? Have you had breakfast?",
    well: "I feel well",
    help: "I need help",
    knee: "My knee hurts",
    poorSleep: "I slept poorly",
    noAppetite: "I have no appetite",
    breakfastNotYet: "I haven’t had breakfast",
    stomach: "My stomach hurts",
    stomachMine: "My stomach hurts a little.",
    stomachAsk: "Did the stomach discomfort start today, or has it happened repeatedly over the past few days?",
    suggestionBasis: "Suggested from synced data and recent health history",
    fine: "I feel well.",
    fineNext: "Glad to hear it. Have you had breakfast?",
    ate: "Yes, I ate",
    notYet: "Not yet",
    uploadMeal: "Upload lunch photo",
    kneeMine: "My knee hurts a little.",
    kneeAsk: "Did the pain start today, or has it lasted a few days?",
    todayPain: "Started today",
    daysPain: "A few days",
    severe: "Quite severe",
    painFollow: "I’ve noted it. Would you like Elena to call you today?",
    yesCall: "Yes, please",
    noCall: "Not yet",
    callDone: "Elena has been notified and will call you today.",
    noteDone: "Okay, I’ve noted it. I’ll check in again this afternoon.",
    sleepMine: "I did not sleep well.",
    sleepAsk: "Do you feel dizzy, short of breath, or otherwise unwell now?",
    noSymptom: "No other symptoms",
    dizzy: "A little dizzy",
    sleepDone: "Okay. Take things slowly today. I’ll check again this afternoon.",
    dizzyDone: "Please sit somewhere safe. I’ve asked Elena to contact you soon.",
    appetiteMine: "I do not feel like eating.",
    appetiteAsk: "Understood. Would you take a photo at lunch? I can help check whether the meal is enough.",
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
    urgentAsk: "I’m here with you. Are you in immediate danger?",
    urgent: "Yes, urgent",
    callElena: "Ask Elena to call",
    notUrgent: "Not urgent",
    urgentDone: "An urgent alert was sent to Elena with your approved location and latest health update.",
    voiceInput: "Start voice input",
    stopVoice: "Stop recording",
    voiceHint: "Tap the microphone; audio is used only for this transcription",
    listening: "Listening — please speak…",
    transcribing: "Turning your voice into text…",
    voiceReady: "Transcript ready — review it, then tap send",
    unsupported: "Voice recognition is not available in this browser. You can continue by typing.",
    microphoneError: "The microphone is unavailable. Allow microphone access and try again.",
    voiceError: "I did not catch that. Please try again.",
    thinking: "Companion is replying…",
    input: "You can tell me anything…",
    defaultReply: "Thank you for telling me. Is anything else uncomfortable, or is there something you want me to remind you about?",
    privacy: "Only the updates you approve are shared with Elena",
    userView: "User",
    family: "Family",
    you: "You",
  },
} as const;

const careProfile = {
  recurringConcerns: ["knee"] as Array<"knee" | "stomach">,
  sleepBelowBaseline: true,
  breakfastUnconfirmed: true,
};

let nextMessageId = 10;

function initialMessages(): Message[] {
  return [{ id: 1, role: "watch", tone: "status", watchSync: true }];
}

export function ParentHealthChat() {
  const [language, setLanguage] = useState<Language>("zh");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [step, setStep] = useState<Step>("initial");
  const [draft, setDraft] = useState("");
  const [voiceState, setVoiceState] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const objectUrlsRef = useRef<string[]>([]);
  const watchSyncTimerRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const voiceTimeoutRef = useRef<number | null>(null);
  const escalationTimersRef = useRef<number[]>([]);
  const t = copy[language];
  const isWatchSynced = messages.some((message) => message.health);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);

  useEffect(() => {
    const objectUrls = objectUrlsRef.current;
    const escalationTimers = escalationTimersRef.current;
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
      if (watchSyncTimerRef.current !== null) window.clearTimeout(watchSyncTimerRef.current);
      if (voiceTimeoutRef.current !== null) window.clearTimeout(voiceTimeoutRef.current);
      escalationTimers.forEach((timer) => window.clearTimeout(timer));
      if (mediaRecorderRef.current?.state === "recording") mediaRecorderRef.current.stop();
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const addMessage = (message: Omit<Message, "id">) => {
    setMessages((current) => [...current, { ...message, id: nextMessageId++ }]);
  };

  const advanceEscalation = (id: string, stage: EscalationStage) => {
    setMessages((current) =>
      current.map((message) => {
        if (message.escalation?.id !== id) return message;
        const escalation = { ...message.escalation, stage };
        saveCareEscalation(escalation);
        return { ...message, escalation };
      }),
    );
  };

  const startEscalation = (kind: EscalationKind) => {
    const escalation = createCareEscalation(kind);
    saveCareEscalation(escalation);
    addMessage({ role: "assistant", tone: "alert", escalation });
    escalationTimersRef.current.push(
      window.setTimeout(() => advanceEscalation(escalation.id, "primary_multichannel"), 1200),
      window.setTimeout(() => advanceEscalation(escalation.id, "backup_acknowledged"), 2800),
    );
  };

  const resetConversation = (nextLanguage: Language) => {
    if (watchSyncTimerRef.current !== null) {
      window.clearTimeout(watchSyncTimerRef.current);
      watchSyncTimerRef.current = null;
    }
    setLanguage(nextLanguage);
    setMessages(initialMessages());
    setStep("initial");
    setVoiceState("");
  };

  const syncAppleWatch = () => {
    setMessages((current) =>
      current.map((message) =>
        message.id === 1 ? { ...message, syncing: true } : message,
      ),
    );
    watchSyncTimerRef.current = window.setTimeout(() => {
      setMessages((current) => {
        const syncedMessages = current.map((message) =>
          message.id === 1
            ? { ...message, watchSync: false, syncing: false, health: true }
            : message,
        );
        return syncedMessages.some((message) => message.id === 2)
          ? syncedMessages
          : [...syncedMessages, { id: 2, role: "assistant", text: t.hello }];
      });
      watchSyncTimerRef.current = null;
    }, 900);
  };

  const finishCallChoice = (notify: boolean) => {
    addMessage({ role: "user", text: notify ? t.yesCall : t.noCall });
    if (notify) startEscalation("symptom");
    else addMessage({ role: "assistant", text: t.noteDone });
    setStep("done");
  };

  const handleAction = (action: string) => {
    if (action === "well") {
      addMessage({ role: "user", text: t.fine });
      addMessage({ role: "assistant", text: t.fineNext });
      setStep("breakfast");
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
      addMessage({ role: "assistant", text: t.stomachAsk });
      setStep("done");
      return;
    }
    if (action === "today-pain" || action === "days-pain") {
      addMessage({ role: "user", text: action === "today-pain" ? t.todayPain : t.daysPain });
      addMessage({ role: "assistant", text: t.painFollow });
      setStep("call-choice");
      return;
    }
    if (action === "severe") {
      addMessage({ role: "user", text: t.severe });
      startEscalation("urgent");
      setStep("done");
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
        addMessage({ role: "assistant", tone: "alert", text: language === "zh" ? "请先坐到安全的地方。照护升级已启动。" : "Please sit somewhere safe. Care escalation has started." });
        startEscalation("urgent");
      } else addMessage({ role: "assistant", text: t.sleepDone });
      setStep("done");
      return;
    }
    if (action === "appetite" || action === "not-yet") {
      addMessage({ role: "user", text: action === "appetite" ? t.appetiteMine : t.breakfastNotYet });
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
      addMessage({ role: "assistant", tone: "alert", text: t.urgentAsk });
      setStep("help-urgent");
      return;
    }
    if (action === "urgent") {
      addMessage({ role: "user", text: t.urgent });
      addMessage({ role: "assistant", tone: "alert", text: language === "zh" ? "请留在安全位置。照护升级已启动。" : "Stay somewhere safe. Care escalation has started." });
      startEscalation("urgent");
      setStep("done");
      return;
    }
    if (action === "call-elena") {
      addMessage({ role: "user", text: t.callElena });
      startEscalation("symptom");
      setStep("done");
      return;
    }
    if (action === "not-urgent") {
      addMessage({ role: "user", text: t.notUrgent });
      addMessage({ role: "assistant", text: t.defaultReply });
      setStep("initial");
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
          ...(careProfile.breakfastUnconfirmed ? [{ id: "not-yet", label: t.breakfastNotYet }] : []),
        ];
      case "breakfast":
        return [
          { id: "ate", label: t.ate },
          { id: "not-yet", label: t.notYet },
          { id: "upload", label: t.uploadMeal },
        ];
      case "knee-duration":
        return [
          { id: "today-pain", label: t.todayPain },
          { id: "days-pain", label: t.daysPain },
          { id: "severe", label: t.severe, important: true },
        ];
      case "call-choice":
        return [
          { id: "yes-call", label: t.yesCall, important: true },
          { id: "no-call", label: t.noCall },
        ];
      case "sleep-symptoms":
        return [
          { id: "no-symptom", label: t.noSymptom },
          { id: "dizzy", label: t.dizzy, important: true },
        ];
      case "meal-photo":
        return [{ id: "upload", label: t.uploadMeal, important: true }];
      case "help-urgent":
        return [
          { id: "urgent", label: t.urgent, important: true },
          { id: "call-elena", label: t.callElena },
          { id: "not-urgent", label: t.notUrgent },
        ];
      default:
        return [];
    }
  })();

  const processText = async (text: string) => {
    const normalized = text.toLowerCase();
    if (/帮助|help|紧急|urgent|胸痛|胸闷|呼吸困难|喘不过气|跌倒|摔倒|晕倒|迷路|chest pain|can'?t breathe|fell|fall|faint|lost/.test(normalized)) {
      addMessage({ role: "assistant", tone: "alert", text: t.urgentAsk });
      setStep("help-urgent");
      return;
    }

    const replyMessageId = nextMessageId++;
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
      setStep("initial");
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
    if (event.key === "Enter") sendDraft();
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
    const imageMessageId = nextMessageId++;
    const analysisMessageId = nextMessageId++;
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
            <span className="presence"><i />{t.presence}</span>
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
                <div className="nutrition-loading" role="status">
                  <LoaderCircle size={20} />
                  <span>{t.thinking}</span>
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
                <CareEscalationCard escalation={message.escalation} language={language} audience="parent" />
              ) : message.health ? (
                <div className="health-summary">
                  <div className="health-summary-title"><strong>{t.healthTitle}</strong><span>{t.synced}</span></div>
                  <div className="health-metrics">
                    <div><Moon size={18} /><strong>6h 12m</strong><small>{t.sleep}</small></div>
                    <div><HeartPulse size={18} /><strong>72 bpm</strong><small>{t.heart}</small></div>
                    <div><Footprints size={18} /><strong>320</strong><small>{t.steps}</small></div>
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
                message.text?.split("\n").map((line) => <p key={line}>{line}</p>)
              )}
            </div>
          </article>
        ))}
        <div ref={endRef} />
      </section>

      {isWatchSynced && quickActions.length > 0 && (
        <div className="quick-action-area">
          {step === "initial" && <small className="quick-action-basis"><Sparkles size={14} />{t.suggestionBasis}</small>}
          <div className="quick-actions" aria-label="Suggested replies">
            {quickActions.map((action) => (
              <button key={action.id} className={action.important ? "important" : ""} onClick={() => handleAction(action.id)}>{action.label}</button>
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
        <div className={`voice-state ${isListening || isTranscribing ? "active" : ""}`} role="status">{voiceState || t.voiceHint}</div>
        <div className="privacy-note"><CheckCircle2 size={15} />{t.privacy}</div>
      </footer>
    </section>
  );
}
