import assert from "node:assert/strict";
import test from "node:test";

import { shouldShowCareEscalationContext } from "../app/care-escalation.ts";

test("keeps the parent WhatsApp card focused on its two actions", () => {
  assert.equal(
    shouldShowCareEscalationContext("parent", "whatsapp_draft_opened"),
    false,
  );
  assert.equal(
    shouldShowCareEscalationContext("parent", "whatsapp_send_confirmed"),
    false,
  );
});

test("keeps care context for the receiving family member", () => {
  assert.equal(
    shouldShowCareEscalationContext("family", "whatsapp_send_confirmed"),
    true,
  );
  assert.equal(
    shouldShowCareEscalationContext("parent", "backup_acknowledged"),
    true,
  );
});
