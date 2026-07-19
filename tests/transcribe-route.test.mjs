import assert from "node:assert/strict";
import test from "node:test";

import { normalizeAudioType, POST } from "../app/api/transcribe/route.ts";

test("normalizes MediaRecorder codec parameters before validation", () => {
  assert.equal(normalizeAudioType("audio/webm;codecs=opus"), "audio/webm");
  assert.equal(normalizeAudioType("audio/mp4; codecs=mp4a.40.2"), "audio/mp4");
});

test("accepts Chrome webm recordings and forwards a normalized audio type", async () => {
  const previousApiKey = process.env.OPENAI_API_KEY;
  const previousFetch = globalThis.fetch;
  let forwardedFile;

  process.env.OPENAI_API_KEY = "test-key";
  globalThis.fetch = async (_input, init) => {
    forwardedFile = init?.body?.get("file");
    return Response.json({ text: "我肚子疼" });
  };

  try {
    const form = new FormData();
    form.append(
      "audio",
      new File(["test-audio"], "voice-input.webm", {
        type: "audio/webm;codecs=opus",
      }),
    );
    form.append("language", "zh");

    const response = await POST(new Request("http://localhost/api/transcribe", {
      method: "POST",
      body: form,
    }));

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { text: "我肚子疼" });
    assert.ok(forwardedFile instanceof File);
    assert.equal(forwardedFile.type, "audio/webm");
    assert.equal(forwardedFile.name, "voice-input.webm");
  } finally {
    globalThis.fetch = previousFetch;
    if (previousApiKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = previousApiKey;
  }
});

test("still rejects unsupported media types before calling OpenAI", async () => {
  const previousApiKey = process.env.OPENAI_API_KEY;
  const previousFetch = globalThis.fetch;
  let called = false;

  process.env.OPENAI_API_KEY = "test-key";
  globalThis.fetch = async () => {
    called = true;
    return Response.json({ text: "unexpected" });
  };

  try {
    const form = new FormData();
    form.append(
      "audio",
      new File(["not-audio"], "voice-input.txt", { type: "text/plain" }),
    );

    const response = await POST(new Request("http://localhost/api/transcribe", {
      method: "POST",
      body: form,
    }));

    assert.equal(response.status, 415);
    assert.equal(called, false);
  } finally {
    globalThis.fetch = previousFetch;
    if (previousApiKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = previousApiKey;
  }
});
