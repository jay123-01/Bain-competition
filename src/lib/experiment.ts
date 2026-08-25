export type AdVariant = "conversation" | "traditional";

export function getAdVariant(variant?: string): AdVariant {
  return variant === "traditional" ? "traditional" : "conversation";
}
