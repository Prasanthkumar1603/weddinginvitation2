export type WeddingReligion = "hindu" | "muslim" | "christian";

export type WeddingEvent = {
  id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  description?: string;
  icon?: "sparkle" | "flower" | "rings" | "lantern" | "heart";
  enabled: boolean;
  directionsUrl?: string;
};

export type WeddingData = {
  bride: { name: string; photo?: string };
  groom: { name: string; photo?: string };
  couplePhoto?: string;
  gallery: { src: string; alt: string; category: "bride" | "groom" | "couple" | "wedding" }[];
  date: string;
  blessing: string;
  welcome: string;
  openingMessage?: string;
  nikahMessage?: string;
  closingMessage: string;
  events: WeddingEvent[];
  musicUrl?: string;
  rsvpEmail?: string;
};

export type WeddingTheme = {
  religion: WeddingReligion;
  colors: { background: string; foreground: string; accent: string };
  fonts: { display: string; body: string };
  decorations: { arch: boolean; crescent: boolean; lanterns: boolean };
  assets: { couple: string; arch: string; architecture: string };
};

// All personal content and event scheduling lives here, separate from the visual theme.
// Replace example details and provide rsvpEmail/musicUrl/photos before sharing with guests.
export const sampleWedding: WeddingData = {
  bride: { name: "Ayesha" },
  groom: { name: "Ahmed" },
  gallery: [],
  date: "2026-12-12T10:30:00+05:30",
  blessing: "With the blessings of Allah and our beloved families",
  welcome: "Together with our families,\nwe invite you to celebrate\nthe beginning of our forever.",
  openingMessage: "With joyful hearts, our families invite you to share in a day of love, togetherness and new beginnings.",
  nikahMessage: "As we begin this beautiful journey together, your presence would mean the world to us.",
  closingMessage: "Your presence and prayers\nwill make our celebration complete.",
  events: [
    { id: "engagement", name: "Engagement", date: "2026-12-10T18:00:00+05:30", time: "6:00 PM", venue: "Venue to be announced", address: "", description: "A joyful evening with our families", icon: "sparkle", enabled: false },
    { id: "mehndi", name: "Mehndi", date: "2026-12-11T17:00:00+05:30", time: "5:00 PM", venue: "Venue to be announced", address: "", description: "An evening of colour and celebration", icon: "flower", enabled: false },
    { id: "nikah", name: "Nikah", date: "2026-12-12T10:30:00+05:30", time: "10:30 AM", venue: "Venue to be announced", address: "", description: "The beginning of our forever", icon: "rings", enabled: true },
    { id: "walima", name: "Walima", date: "2026-12-13T19:00:00+05:30", time: "7:00 PM", venue: "Venue to be announced", address: "", description: "Join us for an evening of celebration", icon: "lantern", enabled: true },
    { id: "reception", name: "Reception", date: "2026-12-14T19:00:00+05:30", time: "7:00 PM", venue: "Venue to be announced", address: "", description: "Celebrate with us", icon: "heart", enabled: false },
  ],
};

export function formatWeddingDate(date: string, options?: Intl.DateTimeFormatOptions) {
  const format = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata", ...options });
  const parts = format.formatToParts(new Date(date));
  const get = (type: string) => parts.find(part => part.type === type)?.value ?? "";
  const day = get("day");
  const month = get("month");
  const year = get("year");
  const weekday = get("weekday");
  return `${weekday ? `${weekday}, ` : ""}${day} ${month} ${year}`.trim();
}

export function getCountdown(date: string, now: number) {
  let seconds = Math.max(0, Math.floor((new Date(date).getTime() - now) / 1000));
  const days = Math.floor(seconds / 86400);
  seconds %= 86400;
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  return { days, hours, minutes, seconds: seconds % 60 };
}