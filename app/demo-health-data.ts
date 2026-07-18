export const demoScenarioDate = "2026-07-18";

export const morningHealthFixture = {
  syncedAt: "07:42",
  activityObservedAt: "08:05",
  parentReplyAt: "08:16",
  safetyCheckedAt: "08:17",
  sleep: {
    value: "5h 12m",
    baseline: "7h 20m",
    deltaEn: "2h 08m",
    deltaZh: "2 小时 08 分",
  },
  restingHeartRate: {
    value: 78,
    baseline: 67,
    delta: 11,
  },
  steps: {
    value: 320,
    baseline: 2400,
    deltaPercent: 87,
  },
} as const;
