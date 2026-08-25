export type AnalyticsValue = string | number | boolean | undefined;
export type AnalyticsProperties = Record<string, AnalyticsValue>;
export type ExperimentContext = {
  variant: "conversation" | "traditional";
  audienceCohort: "broad" | "tokyo_intent";
  campaignId: string;
  sessionId: string;
};
export type AnalyticsEvent = { eventName: string; properties: AnalyticsProperties & ExperimentContext };

let activeContext: ExperimentContext = { variant: "conversation", audienceCohort: "broad", campaignId: "organic", sessionId: "uninitialized" };
let posthogClient: Promise<typeof import("posthog-js").default> | undefined;

export function getPostHogSettings(key?: string, host?: string) {
  if (!key) return undefined;
  return { key, host: host || "https://us.i.posthog.com" };
}

export function getExperimentContext(search: string, sessionId: string): ExperimentContext {
  const params = new URLSearchParams(search);
  return {
    variant: params.get("variant") === "traditional" ? "traditional" : "conversation",
    audienceCohort: params.get("audience") === "tokyo_intent" ? "tokyo_intent" : "broad",
    campaignId: params.get("campaign") || "organic",
    sessionId
  };
}

export function buildAnalyticsEvent(eventName: string, properties: AnalyticsProperties, context: ExperimentContext): AnalyticsEvent {
  return { eventName, properties: { ...context, ...properties } };
}

export function initializeAnalytics(search: string) {
  const sessionKey = "trip-planner-session-id";
  let sessionId = sessionStorage.getItem(sessionKey);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem(sessionKey, sessionId);
  }
  activeContext = getExperimentContext(search, sessionId);
  const posthogSettings = getPostHogSettings(process.env.NEXT_PUBLIC_POSTHOG_KEY, process.env.NEXT_PUBLIC_POSTHOG_HOST);
  if (posthogSettings && !posthogClient) {
    posthogClient = import("posthog-js").then(({ default: posthog }) => {
      posthog.init(posthogSettings.key, { api_host: posthogSettings.host, capture_pageview: false, disable_session_recording: true });
      return posthog;
    });
  }
  return activeContext;
}

export function trackEvent(eventName: string, properties: AnalyticsProperties = {}) {
  const event = buildAnalyticsEvent(eventName, properties, activeContext);
  console.log("[Analytics]", event.eventName, event.properties);
  void posthogClient?.then((posthog) => posthog.capture(event.eventName, event.properties));
  if (typeof window !== "undefined") {
    const appWindow = window as Window & { __tripPlannerEvents?: AnalyticsEvent[] };
    appWindow.__tripPlannerEvents = [...(appWindow.__tripPlannerEvents ?? []), event];
  }
}
