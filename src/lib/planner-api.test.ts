import { describe, expect, it } from "vitest";
import { extractClaudeText, getPlannerErrorMessage, parseAnthropicError, parsePlannerReply } from "./planner-api";

describe("planner API response parsing", () => {
  it("returns the assistant reply, quick replies, and readiness from valid model JSON", () => {
    const reply = parsePlannerReply('{"reply":"좋아요. 어느 지역에 머물고 싶으세요?","quickReplies":["시부야","아사쿠사"],"tripReady":false}');

    expect(reply).toEqual({
      reply: "좋아요. 어느 지역에 머물고 싶으세요?",
      quickReplies: ["시부야", "아사쿠사"],
      tripReady: false
    });
  });

  it("parses a valid JSON reply wrapped in a markdown code block", () => {
    const reply = parsePlannerReply('```json\n{"reply":"시부야는 맛집과 야경을 함께 즐기기 좋아요.","quickReplies":["맛집 중심"],"tripReady":false}\n```');

    expect(reply.reply).toBe("시부야는 맛집과 야경을 함께 즐기기 좋아요.");
    expect(reply.quickReplies).toEqual(["맛집 중심"]);
  });

  it("uses the JSON block when Claude puts an explanation before it", () => {
    const reply = parsePlannerReply('좋아요. 기간은 며칠인가요?\n\n```json\n{"reply":"기간은 며칠 정도로 생각하세요?","quickReplies":["3박 4일"],"tripReady":false}\n```');

    expect(reply.reply).toBe("기간은 며칠 정도로 생각하세요?");
    expect(reply.quickReplies).toEqual(["3박 4일"]);
  });

  it("falls back to a safe conversational reply when the model output is malformed", () => {
    expect(parsePlannerReply("not JSON")).toEqual({
      reply: "여행 조건을 조금만 더 알려주시면 맞춤으로 도와드릴게요.",
      quickReplies: [],
      tripReady: false
    });
  });

  it("shows a plain-language Claude reply instead of replacing it with a generic fallback", () => {
    expect(parsePlannerReply("시부야는 맛집과 야경을 함께 즐기기 좋은 지역이에요.").reply).toBe("시부야는 맛집과 야경을 함께 즐기기 좋은 지역이에요.");
  });

  it("extracts the JSON text block from a Claude Messages API response", () => {
    expect(extractClaudeText([{ type: "text", text: '{"reply":"좋아요","quickReplies":[],"tripReady":false}' }])).toContain("좋아요");
  });

  it("explains an authentication error instead of silently falling back", () => {
    expect(getPlannerErrorMessage(401)).toContain("API 키");
  });

  it("extracts Anthropic's safe error message for server-side diagnostics", () => {
    expect(parseAnthropicError('{"error":{"type":"not_found_error","message":"model not found"}}')).toBe("model not found");
  });
});
