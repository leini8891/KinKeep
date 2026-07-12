type OpenAIResponse = {
  output_text?: string;
  output?: Array<{
    type?: string;
    content?: Array<{ type?: string; text?: string }>;
  }>;
};

function extractOutputText(response: OpenAIResponse) {
  if (response.output_text?.trim()) return response.output_text.trim();
  for (const item of response.output ?? []) {
    if (item.type !== "message") continue;
    for (const part of item.content ?? []) {
      if (part.type === "output_text" && part.text?.trim()) return part.text.trim();
    }
  }
  throw new Error("No companion reply returned");
}

function jsonResponse(body: unknown, status: number) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return jsonResponse({ error: "Companion AI is not configured." }, 503);

  let body: {
    language?: "zh" | "en";
    message?: string;
    history?: Array<{ role?: string; text?: string }>;
    healthSynced?: boolean;
  };

  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid request." }, 400);
  }

  const language = body.language === "en" ? "en" : "zh";
  const message = body.message?.trim().slice(0, 800) ?? "";
  if (!message) return jsonResponse({ error: "Message is required." }, 400);

  const history = (body.history ?? [])
    .slice(-10)
    .map((item) => `${item.role === "user" ? "Older adult" : "Companion"}: ${(item.text ?? "").slice(0, 500)}`)
    .join("\n");

  const healthContext = body.healthSynced
    ? "Apple Watch summary: sleep 6h12m (about 1 hour below personal baseline), resting heart rate 72 bpm and stable, 320 steps (lower than usual this morning). Recent history includes occasional knee discomfort. Breakfast is not yet confirmed."
    : "Apple Watch data has not been synced. Do not claim to know sleep, heart rate, steps, or other wearable facts.";

  const systemPrompt = `You are KinKeep's warm companion for an older adult in Singapore.
Reply in ${language === "zh" ? "natural Simplified Chinese" : "clear, natural English"}.

Conversation principles:
- Sound warm, respectful, and human. Never sound like a form or repeat a generic fallback.
- Directly acknowledge what the person just said. If they refuse a suggestion, accept it without pressure and offer one easy alternative or permission to stop.
- Use at most 2 short sentences and ask at most one question.
- Use the supplied wearable facts only when relevant. Never invent measurements, symptoms, meals, actions, calls, or notifications.
- Do not diagnose or prescribe. Do not give medication instructions.
- If the message suggests immediate danger, chest pain, breathing difficulty, a fall, fainting, severe bleeding, or being lost, calmly tell them to move to safety if possible and seek immediate human help.
- The person may use short, colloquial, or imperfect phrases. Infer their intent kindly.

${healthContext}`;

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL?.trim() || "gpt-5.6-terra",
        store: false,
        safety_identifier: "kinkeep-parent-companion",
        reasoning: { effort: "low" },
        max_output_tokens: 220,
        instructions: systemPrompt,
        input: `${history ? `${history}\n` : ""}Older adult: ${message}\nCompanion:`,
      }),
    });

    if (!response.ok) return jsonResponse({ error: "Companion AI is temporarily unavailable." }, 502);
    const reply = extractOutputText((await response.json()) as OpenAIResponse);
    return jsonResponse({ reply }, 200);
  } catch {
    return jsonResponse({ error: "Companion AI is temporarily unavailable." }, 502);
  }
}
