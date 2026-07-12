# BUIDL_QUESTS 2026 Build Log

This log makes the repository history easier to audit. The Git commits and their original timestamps remain the source of truth; this file does not replace or rewrite them.

- Event: [BUIDL_QUESTS 2026](https://openarena.to/en/events/buidl-quests-2026)
- Timezone: Asia/Singapore (UTC+8)
- Repository: [leini8891/KinKeep](https://github.com/leini8891/KinKeep)

## July 12, 2026

| Time (SGT) | Commit | Verifiable milestone |
|---|---|---|
| 14:17 | [`9a7149c`](https://github.com/leini8891/KinKeep/commit/9a7149c6fb19b15f362d96dab934c9dd71706179) | Initial vinext/OpenAI Sites scaffold, parent-facing bilingual companion, styling, SSR test, README, and working PRD. |
| 14:53 | [`9f996aa`](https://github.com/leini8891/KinKeep/commit/9f996aa0ae0318c3d51a47ca0cc08ca3e101af4a) | Added the family dashboard, parent/family navigation, meal-analysis route, Singapore meal fixtures, social preview asset, and updated tests. |
| 15:21 | [`8fc39e2`](https://github.com/leini8891/KinKeep/commit/8fc39e22a90d0e036f6ba191810f1af91867e1c1) | Added bilingual family copy, parent-to-family sync behavior, responsive refinements, configuration fixes, and broader SSR assertions. |
| 15:45 | [`5cef2e0`](https://github.com/leini8891/KinKeep/commit/5cef2e06146911c8a5aa14f5ffbccd87f99ee543) | Clarified the difference between family members and monitored health profiles, with matching SSR assertions. |
| 16:26 | [`52a12c0`](https://github.com/leini8891/KinKeep/commit/52a12c0ca7370769cec31a2984d0d0b61a5f4128) | Redesigned the family mobile profile navigation. |
| 16:35 | [`b5e53df`](https://github.com/leini8891/KinKeep/commit/b5e53df4fb36419c95c38d9c80c8bf7c0b28fe8b) | Gated the companion check-in on the watch sync interaction. |
| 16:37 | [`21731fa`](https://github.com/leini8891/KinKeep/commit/21731fad35b8899b287fc27e8f5235e8f8d45f05) | Added the family mobile preview route. |
| 16:45 | [`d6123aa`](https://github.com/leini8891/KinKeep/commit/d6123aa596536c5bee345dd42aae006e413c9575) | Kept the chat available before the health sync completes. |
| 16:52 | [`bdb0f0d`](https://github.com/leini8891/KinKeep/commit/bdb0f0d2e000ddc338dfce9bae5bec1fbf8d2eed) | Added optional AI-powered companion replies (deterministic care branching unchanged). |
| 17:04 | [`fa89120`](https://github.com/leini8891/KinKeep/commit/fa89120da656965fd2b286e814dee3c2cbe3effc) | Clarified the family overview and notification hierarchy. |

Judged submission: tag [`judged-2026-07-12`](https://github.com/leini8891/KinKeep/releases/tag/judged-2026-07-12) · deployed at <https://kinkeep-family-health.leini9591.chatgpt.site/>.

## Why the initial commit is large

The repository was created during the build day and the first commit imported the runnable scaffold together with the first parent-facing vertical slice. Its 12,673 inserted lines include 11,179 generated `package-lock.json` lines, plus framework configuration, starter infrastructure, documentation, and tests. The hand-written product work is concentrated in `app/parent-health-chat.tsx`, `app/globals.css`, `app/page.tsx`, and `app/layout.tsx`.

Later product milestones are separate commits with focused diffs. The history has not been backdated or rewritten to manufacture activity.

## Judging scope

- KinKeep's judging evidence is the code introduced and changed in this repository during the event window.
- Demo data is synthetic. Local food-evaluation photos are excluded from version control because their provenance is not part of the submission and some retain EXIF metadata.

## Validation record

After the 15:21 milestone, the following checks passed locally:

```bash
npm run lint
npm test
```

`npm test` performs a production vinext build and verifies server-rendered parent and family experiences.

## Version-control protocol through submission

1. Commit one reviewable product milestone or fix at a time with a descriptive message.
2. Run the relevant lint/build/test checks before pushing.
3. Push throughout the build instead of waiting until the submission deadline.
4. Keep feature-branch commits when merging; do not squash the auditable history before judging.
5. Record the final deployed URL and tag the exact judged commit at submission time.
