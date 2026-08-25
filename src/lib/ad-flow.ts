export function canStartPlanner(message: string) {
  return message.trim().length > 0;
}

export function getInitialPlannerPrompt(message: string | null) {
  const prompt = message?.trim();
  return prompt || undefined;
}
