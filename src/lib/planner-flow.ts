export type TravelIntent = {
  destination?: "Japan";
  duration?: "3 nights 4 days";
  budget?: number;
  companion?: "couple" | "friends";
  travelStyle?: "food" | "shopping" | "sightseeing" | "relaxation";
};

export type PlannerReply =
  | { kind: "follow-up"; text: string; chips: string[]; intent: TravelIntent }
  | { kind: "result"; intent: TravelIntent };

export function extractTravelIntent(prompt: string): TravelIntent {
  const text = prompt.toLowerCase();
  return {
    destination: /일본|도쿄|japan|tokyo/.test(text) ? "Japan" : undefined,
    duration: /3박\s*4일|3 nights?\s*4 days?/.test(text) ? "3 nights 4 days" : undefined,
    budget: /120\s*만|1,?200,?000/.test(text) ? 1200000 : undefined,
    companion: /여자친구|남자친구|커플|couple/.test(text) ? "couple" : /친구|friends?/.test(text) ? "friends" : undefined,
    travelStyle: /맛집|food/.test(text) ? "food" : /쇼핑|shopping/.test(text) ? "shopping" : /관광|sightseeing/.test(text) ? "sightseeing" : /휴양|relax/.test(text) ? "relaxation" : undefined
  };
}

export function isQualifiedIntent(intent: TravelIntent) {
  return Boolean(intent.destination && intent.duration && intent.budget && intent.companion);
}

export function buildPlannerReply(prompt: string): PlannerReply {
  const intent = extractTravelIntent(prompt);
  if (!isQualifiedIntent(intent)) {
    return { kind: "follow-up", text: "좋아요. 여행 기간과 예산, 누구와 함께 가는지 알려주시면 더 잘 맞춰드릴게요.", chips: ["3박 4일 · 120만원 · 커플", "직접 입력할게요"], intent };
  }
  if (isQualifiedIntent(intent) && !intent.travelStyle) {
    return { kind: "follow-up", text: "좋아요. 어떤 여행 스타일이 가장 중요하세요?", chips: ["맛집", "쇼핑", "관광", "휴양"], intent };
  }
  return { kind: "result", intent: { ...intent, travelStyle: intent.travelStyle ?? "food" } };
}
