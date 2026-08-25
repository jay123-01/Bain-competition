import { describe, expect, it } from "vitest";
import { canStartPlanner, getInitialPlannerPrompt } from "./ad-flow";

describe("ad conversation entry", () => {
  it("does not start the planner for an empty message", () => {
    expect(canStartPlanner("   ")).toBe(false);
  });

  it("starts the planner after the traveler writes a message", () => {
    expect(canStartPlanner("여자친구와 도쿄 여행 가고 싶어요")).toBe(true);
  });

  it("carries the ad message into the planner as its initial submitted prompt", () => {
    expect(getInitialPlannerPrompt("  여자친구와 도쿄 여행 가고 싶어요  ")).toBe("여자친구와 도쿄 여행 가고 싶어요");
  });
});
