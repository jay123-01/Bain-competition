import { describe, expect, it } from "vitest";
import { buildAnalyticsEvent, getExperimentContext, getPostHogSettings } from "./analytics";

describe("experiment analytics", () => {
  it("reads variant, audience cohort, and campaign from a landing URL", () => {
    expect(getExperimentContext("?variant=traditional&audience=tokyo_intent&campaign=fall_2026", "session-1")).toEqual({
      variant: "traditional",
      audienceCohort: "tokyo_intent",
      campaignId: "fall_2026",
      sessionId: "session-1"
    });
  });

  it("adds experiment context to every tracked event", () => {
    const event = buildAnalyticsEvent("qualified_intent_created", { fieldCount: 4 }, {
      variant: "conversation", audienceCohort: "broad", campaignId: "fall_2026", sessionId: "session-1"
    });

    expect(event).toMatchObject({ eventName: "qualified_intent_created", properties: { variant: "conversation", audienceCohort: "broad", campaignId: "fall_2026", sessionId: "session-1", fieldCount: 4 } });
  });

  it("enables PostHog only when a project token is configured", () => {
    expect(getPostHogSettings("phc_example", "https://us.i.posthog.com")).toEqual({ key: "phc_example", host: "https://us.i.posthog.com" });
    expect(getPostHogSettings(undefined, "https://us.i.posthog.com")).toBeUndefined();
  });
});
