import { NextResponse } from "next/server";
import { extractClaudeText, parseAnthropicError, parsePlannerReply } from "@/lib/planner-api";

type ChatMessage = { role: "user" | "assistant"; text: string };

const instructions = `You are AI Trip Planner, a concise and warm Korean travel-planning assistant for a student research prototype.
Continue naturally from the supplied conversation. Identify destination, dates/duration, budget, companion, and travel style.
Ask at most one focused follow-up question at a time. When you have enough detail to recommend a trip, say so briefly and set tripReady to true.
Always respond in Korean and return JSON only in exactly this shape:
{"reply":"short natural Korean reply","quickReplies":["optional short choice"],"tripReady":false}`;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { messages?: ChatMessage[] } | null;
  const messages = body?.messages?.filter((message): message is ChatMessage =>
    Boolean(message && (message.role === "user" || message.role === "assistant") && typeof message.text === "string" && message.text.trim())
  ) ?? [];

  if (!messages.length) return NextResponse.json({ error: "A message is required." }, { status: 400 });
  if (!process.env.ANTHROPIC_API_KEY) return NextResponse.json({ error: "ANTHROPIC_API_KEY is not configured." }, { status: 503 });

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514",
        max_tokens: 500,
        system: instructions,
        messages: messages.map((message) => ({ role: message.role, content: message.text }))
      })
    });
    if (!response.ok) {
      const errorBody = await response.text();
      console.error("[Planner API] Anthropic API returned", response.status, parseAnthropicError(errorBody));
      return NextResponse.json({ error: "Anthropic API request failed." }, { status: response.status });
    }
    const payload = await response.json() as { content?: Array<{ type: string; text?: string }> };
    return NextResponse.json(parsePlannerReply(extractClaudeText(payload.content ?? [])));
  } catch (error) {
    console.error("[Planner API]", error);
    return NextResponse.json({ error: "The trip assistant is temporarily unavailable." }, { status: 502 });
  }
}
