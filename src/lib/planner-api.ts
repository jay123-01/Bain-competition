export type PlannerApiReply = {
  reply: string;
  quickReplies: string[];
  tripReady: boolean;
};

const fallbackReply: PlannerApiReply = {
  reply: "여행 조건을 조금만 더 알려주시면 맞춤으로 도와드릴게요.",
  quickReplies: [],
  tripReady: false
};

function readableReplyOrFallback(reply: string): PlannerApiReply {
  return /[가-힣]/.test(reply) ? { ...fallbackReply, reply } : fallbackReply;
}

export function parsePlannerReply(output: string): PlannerApiReply {
  const trimmed = output.trim();
  const fencedJson = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)?.[1] ?? trimmed;
  try {
    const parsed = JSON.parse(fencedJson) as Partial<PlannerApiReply>;
    if (typeof parsed.reply !== "string") return readableReplyOrFallback(trimmed);
    return {
      reply: parsed.reply,
      quickReplies: Array.isArray(parsed.quickReplies) ? parsed.quickReplies.filter((item): item is string => typeof item === "string").slice(0, 4) : [],
      tripReady: parsed.tripReady === true
    };
  } catch {
    return readableReplyOrFallback(trimmed);
  }
}

export function extractClaudeText(content: Array<{ type: string; text?: string }>) {
  return content.find((block) => block.type === "text")?.text ?? "";
}

export function getPlannerErrorMessage(status: number) {
  if (status === 401 || status === 403) return "Claude API 키를 확인해주세요. 키를 저장한 뒤 개발 서버를 다시 시작해야 합니다.";
  if (status === 429) return "Claude API 사용량 또는 속도 제한에 도달했습니다. Anthropic Console의 크레딧을 확인해주세요.";
  if (status === 503) return "Claude API 키를 찾을 수 없습니다. .env.local을 확인하고 개발 서버를 재시작해주세요.";
  return "Claude API 호출에 실패했습니다. 터미널의 오류 메시지와 모델 설정을 확인해주세요.";
}

export function parseAnthropicError(body: string) {
  try {
    const parsed = JSON.parse(body) as { error?: { message?: unknown } };
    return typeof parsed.error?.message === "string" ? parsed.error.message : "No error message returned.";
  } catch {
    return "No error message returned.";
  }
}
