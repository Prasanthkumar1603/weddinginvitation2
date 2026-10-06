import { describe, expect, it } from "vitest";
import { formatWeddingDate, getCountdown, sampleWedding } from "@/lib/wedding";
import { installedWeddingThemes } from "@/lib/wedding-themes";

describe("shared wedding configuration", () => {
  it("keeps the installed theme separate from the wedding details", () => {
    expect(installedWeddingThemes.muslim.religion).toBe("muslim");
    expect(sampleWedding.events.filter(event => event.enabled).map(event => event.id)).toEqual(["nikah", "walima"]);
  });
  it("counts down to the wedding and stops at zero", () => {
    expect(getCountdown("2026-12-12T10:30:00+05:30", new Date("2026-12-11T09:29:59+05:30").getTime())).toEqual({ days: 1, hours: 1, minutes: 0, seconds: 1 });
    expect(getCountdown("2026-12-12T10:30:00+05:30", new Date("2026-12-13T10:30:00+05:30").getTime())).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  });
  it("formats dates consistently for server and browser", () => {
    expect(formatWeddingDate(sampleWedding.date, { weekday: "long" })).toBe("Saturday, 12 December 2026");
  });
});
