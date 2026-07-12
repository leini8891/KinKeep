import {
  isNutritionAnalysis,
  nutritionAnalysisSchema,
} from "../../nutrition";

const supportedImageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const maxImageBytes = 10 * 1024 * 1024;

type OpenAIResponse = {
  output_text?: string;
  output?: Array<{
    type?: string;
    content?: Array<{
      type?: string;
      text?: string;
      refusal?: string;
    }>;
  }>;
};

function toBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;

  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }

  return btoa(binary);
}

function extractOutputText(response: OpenAIResponse) {
  if (typeof response.output_text === "string" && response.output_text) {
    return response.output_text;
  }

  for (const item of response.output ?? []) {
    if (item.type !== "message") continue;
    for (const part of item.content ?? []) {
      if (part.type === "output_text" && typeof part.text === "string") {
        return part.text;
      }
      if (part.type === "refusal" && typeof part.refusal === "string") {
        throw new Error("The nutrition analysis could not be completed for this image.");
      }
    }
  }

  throw new Error("The nutrition analysis returned no usable result.");
}

function nutritionPrompt(language: "zh" | "en") {
  const outputLanguage = language === "zh" ? "Simplified Chinese" : "English";

  return `You are KinKeep's Nutrition Agent. Analyze this single meal photo for an older adult and return the requested structured nutrition estimate in ${outputLanguage}.

Rules:
- Estimate only from food, portions, cooking methods, and condiments that are visibly supported by the photo.
- Recognize Singapore and Asian hawker dishes when applicable, but do not force a local-food label when uncertain.
- Calories must be a realistic range, not false precision. Macro and fiber values are approximate grams for the visible serving.
- Keep the summary calm and factual. Give exactly one practical suggestion that the person could act on at the next bite or meal.
- Focus on adequate protein, vegetables, fiber, hydration, and sodium awareness. Do not diagnose, prescribe treatment, change medication, or assume a medical condition.
- Use confidence and assumptions to make uncertainty visible.
- If this is not a clear food photo, set isFood to false, use zero for numeric estimates, explain how to retake the photo in summary, and keep assumptions empty.
- Never call a food simply healthy or unhealthy.`;
}

function jsonResponse(body: unknown, status: number) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return jsonResponse(
      { error: "Nutrition analysis is not configured yet." },
      503,
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return jsonResponse({ error: "The uploaded meal photo could not be read." }, 400);
  }

  const image = formData.get("image");
  const requestedLanguage = formData.get("language");
  const language = requestedLanguage === "en" ? "en" : "zh";

  if (!(image instanceof File)) {
    return jsonResponse({ error: "Please choose a meal photo." }, 400);
  }

  if (!supportedImageTypes.has(image.type)) {
    return jsonResponse(
      { error: "Please use a JPG, PNG, WEBP, or non-animated GIF image." },
      415,
    );
  }

  if (image.size === 0 || image.size > maxImageBytes) {
    return jsonResponse(
      { error: "Please choose an image smaller than 10 MB." },
      413,
    );
  }

  const imageBase64 = toBase64(await image.arrayBuffer());
  const imageUrl = `data:${image.type};base64,${imageBase64}`;

  let openAIResponse: Response;
  try {
    openAIResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL?.trim() || "gpt-5.6-terra",
        store: false,
        safety_identifier: "kinkeep-parent-demo",
        reasoning: { effort: "low" },
        max_output_tokens: 1200,
        input: [
          {
            role: "user",
            content: [
              { type: "input_text", text: nutritionPrompt(language) },
              {
                type: "input_image",
                image_url: imageUrl,
                detail: "high",
              },
            ],
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "meal_nutrition_analysis",
            strict: true,
            schema: nutritionAnalysisSchema,
          },
        },
      }),
    });
  } catch {
    return jsonResponse(
      { error: "The nutrition service is temporarily unavailable. Please try again." },
      502,
    );
  }

  if (!openAIResponse.ok) {
    return jsonResponse(
      { error: "The nutrition service could not analyze this photo. Please try again." },
      502,
    );
  }

  try {
    const payload = (await openAIResponse.json()) as OpenAIResponse;
    const parsed = JSON.parse(extractOutputText(payload)) as unknown;

    if (!isNutritionAnalysis(parsed)) {
      throw new Error("Invalid nutrition response");
    }

    return jsonResponse({ analysis: parsed }, 200);
  } catch {
    return jsonResponse(
      { error: "The nutrition result was incomplete. Please try another photo." },
      502,
    );
  }
}
