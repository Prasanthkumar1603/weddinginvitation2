import couple from "@/assets/muslim-couple.webp";
import arch from "@/assets/arch-ornament.webp";
import architecture from "@/assets/nikah-architecture.jpg";
import type { WeddingTheme } from "./wedding";

export const muslimTheme: WeddingTheme = {
  religion: "muslim",
  colors: { background: "ivory", foreground: "emerald", accent: "gold" },
  fonts: { display: "Cormorant Garamond", body: "DM Sans" },
  decorations: { arch: true, crescent: true, lanterns: true },
  assets: { couple, arch, architecture },
};

// Theme registry intentionally contains only installed templates. Add a Hindu
// entry here when the original Hindu template is available in this project.
export const installedWeddingThemes = { muslim: muslimTheme } as const;