export type NutritionAnalysis = {
  isFood: boolean;
  dishName: string;
  portion: string;
  calories: {
    min: number;
    max: number;
  };
  nutrients: {
    proteinG: number;
    carbsG: number;
    fatG: number;
    fiberG: number;
    sodiumLevel: "low" | "moderate" | "high";
    vegetableLevel: "low" | "moderate" | "good";
  };
  confidence: "low" | "medium" | "high";
  summary: string;
  suggestion: string;
  assumptions: string[];
};

const sodiumLevels = new Set(["low", "moderate", "high"]);
const vegetableLevels = new Set(["low", "moderate", "good"]);
const confidenceLevels = new Set(["low", "medium", "high"]);

function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

export function isNutritionAnalysis(value: unknown): value is NutritionAnalysis {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<NutritionAnalysis>;
  const calories = candidate.calories as NutritionAnalysis["calories"] | undefined;
  const nutrients = candidate.nutrients as NutritionAnalysis["nutrients"] | undefined;

  return (
    typeof candidate.isFood === "boolean" &&
    typeof candidate.dishName === "string" &&
    typeof candidate.portion === "string" &&
    !!calories &&
    isNonNegativeNumber(calories.min) &&
    isNonNegativeNumber(calories.max) &&
    calories.max >= calories.min &&
    !!nutrients &&
    isNonNegativeNumber(nutrients.proteinG) &&
    isNonNegativeNumber(nutrients.carbsG) &&
    isNonNegativeNumber(nutrients.fatG) &&
    isNonNegativeNumber(nutrients.fiberG) &&
    sodiumLevels.has(nutrients.sodiumLevel) &&
    vegetableLevels.has(nutrients.vegetableLevel) &&
    confidenceLevels.has(candidate.confidence ?? "") &&
    typeof candidate.summary === "string" &&
    typeof candidate.suggestion === "string" &&
    Array.isArray(candidate.assumptions) &&
    candidate.assumptions.every((item) => typeof item === "string")
  );
}

export const nutritionAnalysisSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "isFood",
    "dishName",
    "portion",
    "calories",
    "nutrients",
    "confidence",
    "summary",
    "suggestion",
    "assumptions",
  ],
  properties: {
    isFood: { type: "boolean" },
    dishName: { type: "string" },
    portion: { type: "string" },
    calories: {
      type: "object",
      additionalProperties: false,
      required: ["min", "max"],
      properties: {
        min: { type: "number", minimum: 0 },
        max: { type: "number", minimum: 0 },
      },
    },
    nutrients: {
      type: "object",
      additionalProperties: false,
      required: [
        "proteinG",
        "carbsG",
        "fatG",
        "fiberG",
        "sodiumLevel",
        "vegetableLevel",
      ],
      properties: {
        proteinG: { type: "number", minimum: 0 },
        carbsG: { type: "number", minimum: 0 },
        fatG: { type: "number", minimum: 0 },
        fiberG: { type: "number", minimum: 0 },
        sodiumLevel: { type: "string", enum: ["low", "moderate", "high"] },
        vegetableLevel: { type: "string", enum: ["low", "moderate", "good"] },
      },
    },
    confidence: { type: "string", enum: ["low", "medium", "high"] },
    summary: { type: "string" },
    suggestion: { type: "string" },
    assumptions: {
      type: "array",
      maxItems: 5,
      items: { type: "string" },
    },
  },
} as const;
