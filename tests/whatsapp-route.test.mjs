import assert from "node:assert/strict";
import test from "node:test";

import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  GET,
} from "../app/api/contact/whatsapp/route.ts";

test("builds a contact-specific WhatsApp link when a number is registered", () => {
  const url = new URL(buildWhatsAppUrl("david", "urgent", "zh", "+65 9123 4567"));
  assert.equal(url.origin, "https://wa.me");
  assert.equal(url.pathname, "/6591234567");
  assert.match(url.searchParams.get("text") ?? "", /KinKeep 照护提醒/);
  assert.match(url.searchParams.get("text") ?? "", /David/);
});

test("falls back to the WhatsApp contact picker without a registered number", () => {
  const url = new URL(buildWhatsAppUrl("elena", "symptom", "en"));
  assert.equal(url.origin, "https://wa.me");
  assert.equal(url.pathname, "/");
  assert.match(url.searchParams.get("text") ?? "", /Elena/);
});

test("redirect route keeps family numbers on the server", () => {
  const previous = process.env.KINKEEP_ELENA_WHATSAPP;
  process.env.KINKEEP_ELENA_WHATSAPP = "65 9765 4321";

  try {
    const response = GET(new Request(
      "http://localhost/api/contact/whatsapp?contact=elena&kind=urgent&language=zh",
    ));
    assert.equal(response.status, 307);
    assert.match(response.headers.get("location") ?? "", /^https:\/\/wa\.me\/6597654321\?/);
    assert.match(
      buildWhatsAppMessage("elena", "urgent", "zh"),
      /她选择联系你，Elena/,
    );
  } finally {
    if (previous === undefined) delete process.env.KINKEEP_ELENA_WHATSAPP;
    else process.env.KINKEEP_ELENA_WHATSAPP = previous;
  }
});

test("rejects unknown contacts", async () => {
  const response = GET(new Request(
    "http://localhost/api/contact/whatsapp?contact=unknown&kind=urgent",
  ));
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: "Unknown family contact." });
});
