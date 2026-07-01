import OpenAI from "openai";

const DEFAULT_MODEL = "gpt-4.1-mini";

let client: OpenAI | undefined;

function assertServerRuntime(): void {
  if (typeof window !== "undefined") {
    throw new Error("The OpenAI provider is server-only.");
  }
}

export function hasOpenAIConfiguration(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

export function getOpenAIModel(): string {
  return process.env.OPENAI_MODEL?.trim() || DEFAULT_MODEL;
}

export function getOpenAIClient(): OpenAI {
  assertServerRuntime();
  if (!hasOpenAIConfiguration()) {
    throw new Error("OpenAI is not configured.");
  }

  client ??= new OpenAI({ apiKey: process.env.OPENAI_API_KEY?.trim() });
  return client;
}
