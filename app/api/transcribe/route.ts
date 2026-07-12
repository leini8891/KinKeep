const MAX_AUDIO_BYTES = 5 * 1024 * 1024;
const SUPPORTED_AUDIO_TYPES = new Set([
  "audio/mp3",
  "audio/mp4",
  "audio/mpeg",
  "audio/mpga",
  "audio/m4a",
  "audio/wav",
  "audio/webm",
  "audio/ogg",
]);

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ error: "Voice transcription is not configured." }, { status: 503 });
  }

  try {
    const incoming = await request.formData();
    const audio = incoming.get("audio");
    const language = incoming.get("language") === "en" ? "en" : "zh";

    if (!(audio instanceof File)) {
      return Response.json({ error: "An audio recording is required." }, { status: 400 });
    }
    if (audio.size === 0 || audio.size > MAX_AUDIO_BYTES) {
      return Response.json({ error: "The recording is empty or too large." }, { status: 413 });
    }
    if (audio.type && !SUPPORTED_AUDIO_TYPES.has(audio.type)) {
      return Response.json({ error: "This audio format is not supported." }, { status: 415 });
    }

    const openAIForm = new FormData();
    openAIForm.append("file", audio, audio.name || `voice.${audio.type.includes("mp4") ? "mp4" : "webm"}`);
    openAIForm.append("model", process.env.OPENAI_TRANSCRIBE_MODEL || "gpt-4o-mini-transcribe");
    openAIForm.append("language", language);
    openAIForm.append("response_format", "json");
    openAIForm.append(
      "prompt",
      language === "zh"
        ? "这是长者在家庭健康陪伴应用中的简短口语输入，请准确保留症状、饮食、睡眠和求助相关用词。"
        : "This is a short spoken message in a family health companion app. Preserve symptom, meal, sleep, and help-related wording accurately.",
    );

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: openAIForm,
    });

    if (!response.ok) {
      return Response.json({ error: "Voice transcription is temporarily unavailable." }, { status: 502 });
    }

    const payload = (await response.json()) as { text?: string };
    const text = payload.text?.trim();
    if (!text) {
      return Response.json({ error: "No speech was detected." }, { status: 422 });
    }

    return Response.json(
      { text },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json({ error: "Voice transcription could not be completed." }, { status: 500 });
  }
}
