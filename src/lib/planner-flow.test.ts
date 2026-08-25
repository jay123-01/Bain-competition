import { describe, expect, it } from "vitest";
import { buildPlannerReply, extractTravelIntent } from "./planner-flow";

describe("planner conversation flow", () => {
  it("extracts a qualified travel intent from a Korean trip request", () => {
    const intent = extractTravelIntent("여자친구와 10월에 일본 3박 4일 가고 싶고 총 예산은 120만원, 맛집 위주로 다니고 싶어요.");

    expect(intent).toMatchObject({
      destination: "Japan",
      duration: "3 nights 4 days",
      budget: 1200000,
      companion: "couple",
      travelStyle: "food"
    });
  });

  it("asks one focused follow-up when a qualified request is missing travel style", () => {
    const reply = buildPlannerReply("친구와 10월에 일본 3박 4일, 예산 120만원이에요.");

    expect(reply.kind).toBe("follow-up");
    if (reply.kind !== "follow-up") throw new Error("Expected a follow-up reply");
    expect(reply.text).toContain("어떤 여행 스타일");
    expect(reply.chips).toEqual(["맛집", "쇼핑", "관광", "휴양"]);
  });

  it("asks for missing essentials instead of generating a trip from a vague request", () => {
    const reply = buildPlannerReply("도쿄 가고 싶어요");

    expect(reply.kind).toBe("follow-up");
    if (reply.kind !== "follow-up") throw new Error("Expected a follow-up reply");
    expect(reply.text).toContain("기간");
  });

  it("returns an itinerary result when the request includes four required signals", () => {
    const reply = buildPlannerReply("여자친구와 일본 3박 4일, 예산 120만원으로 맛집 여행 갈래요.");

    expect(reply.kind).toBe("result");
    expect(reply.intent.destination).toBe("Japan");
  });
});
