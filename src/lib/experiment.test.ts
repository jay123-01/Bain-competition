import { describe, expect, it } from "vitest";
import { getAdVariant } from "./experiment";

describe("ad experiment variants", () => {
  it("selects the traditional ad when requested in the URL", () => {
    expect(getAdVariant("traditional")).toBe("traditional");
  });

  it("defaults unsupported variants to the conversation ad", () => {
    expect(getAdVariant("unknown")).toBe("conversation");
  });
});
