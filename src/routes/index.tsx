import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, Check, ChevronLeft, ChevronRight, Copy, Heart, MapPin, Menu, Music2, Pause, Share2, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCountdown, formatWeddingDate, sampleWedding, type WeddingEvent } from "@/lib/wedding";
import { muslimTheme } from "@/lib/wedding-themes";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Ahmed & Ayesha | Wedding Invitation" },
    { name: "description", content: "Join Ahmed and Ayesha to celebrate their Nikah and Walima. A celebration of love, family and new beginnings." },
    { property: "og:title", content: "Ahmed & Ayesha | Wedding Invitation" },
    { property: "og:description", content: "With the blessings of our families, we invite you to celebrate our wedding." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: WeddingPage,
});

const wedding = sampleWedding;
const theme = muslimTheme;
const couple = theme.assets.couple;
const arch = theme.assets.arch;
const architecture = theme.assets.architecture;

function Ornament({ light = false }: { light?: boolean }) {
  return <div className={`ornament ${light ? "ornament-light" : ""}`} aria-hidden="true"><span />✦<span /></div>;
}

function SectionHeading({ eyebrow, title, light = false }: { eyebrow: string; title: string; light?: boolean }) {
  return <div className={`section-heading ${light ? "section-heading-light" : ""}`}><p className="eyebrow">{eyebrow}</p><h2>{title}</h2><Ornament light={light} /></div>;
}

function formatEventDate(date: string) {
  return formatWeddingDate(date, { weekday: "long", day: "numeric", month: "long" });
}

function Countdown({ date }: { date: string }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const count = getCountdown(date, now ?? new Date(date).getTime());
  return <div className="countdown-grid" aria-label="Countdown to wedding">{Object.entries(count).map(([label, value]) => <div className="countdown-cell" key={label}><strong>{String(value).padStart(2, "0")}</strong><span>{label}</span></div>)}</div>;
}

function EventIcon({ icon }: { icon?: WeddingEvent["icon"] }) {
  if (icon === "flower") return <span className="event-symbol" aria-hidden="true">✿</span>;
  if (icon === "lantern") return <span className="event-symbol" aria-hidden="true">✧</span>;
  if (icon === "rings") return <span className="event-symbol" aria-hidden="true">∞</span>;
  if (icon === "heart") return <Heart size={24} strokeWidth={1.2} />;
  return <Sparkles size={24} strokeWidth={1.2} />;
}

function WeddingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [attendance, setAttendance] = useState<"yes" | "no">("yes");
  const [rsvpStatus, setRsvpStatus] = useState("");
  const [rsvpResponse, setRsvpResponse] = useState("");
  const events = wedding.events.filter(event => event.enabled);
  const nikah = events.find(event => event.id === "nikah");
  const walima = events.find(event => event.id === "walima");
  const venueEvent = nikah ?? events[0];
  const gallery = wedding.gallery;
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };
  const copyUrl = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); window.setTimeout(() => setCopied(false), 2500); }
    catch { setCopied(false); }
  };
  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: `${wedding.groom.name} & ${wedding.bride.name} | Wedding Invitation`, url: window.location.href }); return; }
      catch { /* dismissed or unsupported: keep other share options available */ }
    }
    setShareOpen(true);
  };
  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) { try { await audio.play(); setMusicPlaying(true); } catch { setMusicPlaying(false); } }
    else { audio.pause(); setMusicPlaying(false); }
  };
  const submitRsvp = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const guest = String(form.get("guest") || "").trim();
    const number = String(form.get("number") || "1");
    const message = String(form.get("message") || "").trim();
    if (!guest) return;
    const response = `Wedding RSVP for ${wedding.groom.name} & ${wedding.bride.name}\nName: ${guest}\nAttendance: ${attendance === "yes" ? "Yes, I'll be there" : "Sorry, can't make it"}\nGuests: ${attendance === "yes" ? number : "0"}${message ? `\nMessage: ${message}` : ""}`;
    if (wedding.rsvpEmail) {
      window.location.href = `mailto:${wedding.rsvpEmail}?subject=${encodeURIComponent("Wedding RSVP")}&body=${encodeURIComponent(response)}`;
      setRsvpStatus("Your email app is opening with your response ready to send.");
    } else {
      setRsvpResponse(response);
      setRsvpStatus("Your response is ready below. Please send it to the couple directly.");
    }
  };
  return <main className="wedding-page">
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="Back to beginning"><span className="wordmark-mark">✧</span> A <span className="wordmark-and">&</span> A</a>
      <nav className={`main-nav ${menuOpen ? "main-nav-open" : ""}`} aria-label="Invitation navigation">
        <a href="#story" onClick={() => setMenuOpen(false)}>Our story</a>
        <a href="#events" onClick={() => setMenuOpen(false)}>The celebration</a>
        <a href="#venue" onClick={() => setMenuOpen(false)}>Venue</a>
        <a href="#rsvp" onClick={() => setMenuOpen(false)}>RSVP</a>
      </nav>
      <div className="header-actions"><Button variant="outline" className="header-rsvp" onClick={() => scrollTo("rsvp")}>Kindly RSVP <ArrowRight size={14} /></Button><Button variant="ghost" size="icon" className="menu-toggle" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button></div>
    </header>

    <section className="hero" id="top">
      <div className="hero-stars" aria-hidden="true"><i>✦</i><i>✧</i><i>✦</i><i>✧</i><i>✦</i></div>
      <div className="hero-copy"><p className="hero-kicker">✦ &nbsp; A CELEBRATION OF LOVE &nbsp; ✦</p><p className="hero-intro">{wedding.blessing}</p><h1>{wedding.groom.name} <em>&</em> {wedding.bride.name}</h1><div className="hero-divider"><span />✧<span /></div><p className="hero-subtitle">Joyfully invite you to celebrate their Nikah</p><p className="hero-date">{formatWeddingDate(wedding.date, { day: "2-digit", month: "long", year: "numeric" }).toUpperCase()}</p><Button className="invitation-button" onClick={() => scrollTo("welcome")}>OPEN INVITATION <ArrowDown size={16} /></Button></div>
      <div className="hero-art" aria-hidden="true"><div className="hero-art-halo" /><img className="hero-arch" src={arch} alt="" width={1024} height={1024} /><img className="hero-couple" src={couple} alt="" width={1024} height={1280} fetchPriority="high" /></div>
      <div className="hero-bottom"><span>EST. IN LOVE, FOREVER IN FAITH</span><span>SCROLL TO EXPLORE ↓</span></div>
    </section>

    <section className="welcome-section section-pad" id="welcome"><div className="welcome-inner"><span className="section-mini">A NEW CHAPTER BEGINS</span><Ornament /><h2>{wedding.welcome}</h2><p>We would be honoured to have you by our side as we begin a lifetime of love and togetherness.</p><span className="welcome-flourish" aria-hidden="true">❧</span></div></section>

    <section className="couple-section section-pad" id="story"><SectionHeading eyebrow="TWO HEARTS, ONE JOURNEY" title="Meet the couple" /><div className="couple-layout"><div className="person person-bride"><div className="person-frame">{wedding.bride.photo ? <img src={wedding.bride.photo} alt={wedding.bride.name} loading="lazy" /> : <img src={couple} alt="Illustration of the bride and groom" loading="lazy" width={1024} height={1280} className="placeholder-couple" />}</div><p>THE BRIDE</p><h3>{wedding.bride.name}</h3></div><div className="couple-connector" aria-hidden="true">✦<span>&</span>✦</div><div className="person person-groom"><div className="person-frame">{wedding.groom.photo ? <img src={wedding.groom.photo} alt={wedding.groom.name} loading="lazy" /> : <img src={couple} alt="Illustration of the bride and groom" loading="lazy" width={1024} height={1280} className="placeholder-couple" />}</div><p>THE GROOM</p><h3>{wedding.groom.name}</h3></div></div>{wedding.couplePhoto && <img className="couple-photo" src={wedding.couplePhoto} alt={`${wedding.groom.name} and ${wedding.bride.name}`} loading="lazy" />}</section>

    {wedding.openingMessage && <section className="message-section section-pad"><span className="section-mini">A NOTE FROM OUR FAMILIES</span><Ornament /><p>{wedding.openingMessage}</p></section>}

    <section className="countdown-section section-pad"><div className="countdown-content"><span className="section-mini">THE MOMENT IS ALMOST HERE</span><h2>Counting down to<br /><em>our special day</em></h2><Countdown date={wedding.date} /></div></section>

    {nikah && <section className="nikah-section" id="nikah"><div className="nikah-image"><img src={architecture} alt="Illustrated wedding courtyard with arches and flowers" loading="lazy" width={1536} height={1024} /></div><div className="nikah-content"><span className="section-mini">THE HEART OF OUR CELEBRATION</span><Ornament light /><h2>Our Nikah</h2><p className="nikah-text">{wedding.nikahMessage}</p><div className="nikah-details"><div><span>WHEN</span><strong>{formatEventDate(nikah.date)}</strong><span>{nikah.time}</span></div><div><span>WHERE</span><strong>{nikah.venue}</strong>{nikah.address && <span>{nikah.address}</span>}</div></div><Button variant="outline" onClick={() => scrollTo("rsvp")}>CELEBRATE WITH US <ArrowRight size={15} /></Button></div></section>}

    {events.length > 0 && <section className="events-section section-pad" id="events"><SectionHeading eyebrow="THE CELEBRATIONS" title="Moments to remember" /><p className="section-lead">Every beautiful beginning deserves to be celebrated together.</p><div className="events-grid">{events.map((event, index) => <article className="event-card" key={event.id}><div className="event-card-top"><span>0{index + 1} / THE CELEBRATION</span><EventIcon icon={event.icon} /></div><h3>{event.name}</h3><p>{event.description}</p><div className="event-meta"><span>{formatEventDate(event.date)}</span><span>{event.time}</span><span>{event.venue}</span></div>{event.directionsUrl && <a href={event.directionsUrl} target="_blank" rel="noopener noreferrer">DIRECTIONS <ArrowRight size={13} /></a>}</article>)}</div></section>}

    {walima && <section className="walima-section section-pad"><div className="walima-ornament" aria-hidden="true">☾</div><span className="section-mini">A CELEBRATION OF TOGETHERNESS</span><h2>Walima</h2><Ornament /><p>{walima.description}</p><div className="walima-details"><span>{formatEventDate(walima.date)}</span><i>✦</i><span>{walima.time}</span><i>✦</i><span>{walima.venue}</span></div></section>}

    {venueEvent && <section className="venue-section section-pad" id="venue"><div className="venue-inner"><div className="venue-art"><img src={architecture} alt="Illustrated wedding venue courtyard" loading="lazy" width={1536} height={1024} /></div><div className="venue-copy"><span className="section-mini">FIND YOUR WAY TO US</span><h2>The venue</h2><Ornament /><p className="venue-label">{venueEvent.name.toUpperCase()} CEREMONY</p><h3>{venueEvent.venue}</h3>{venueEvent.address && <p className="venue-address">{venueEvent.address}</p>}<p className="venue-date">{formatEventDate(venueEvent.date)} <span>·</span> {venueEvent.time}</p>{venueEvent.directionsUrl ? <Button asChild className="directions-button"><a href={venueEvent.directionsUrl} target="_blank" rel="noopener noreferrer"><MapPin size={16} /> GET DIRECTIONS</a></Button> : <p className="venue-pending">Directions will be shared when the venue is confirmed.</p>}</div></div></section>}

    {gallery.length > 0 && <section className="gallery-section section-pad" id="gallery"><SectionHeading eyebrow="OUR FAVOURITE MEMORIES" title="A little glimpse of us" /><div className="gallery-grid">{gallery.map((photo, index) => <Button variant="ghost" className="gallery-item" key={`${photo.src}-${index}`} onClick={() => setLightboxIndex(index)} aria-label={`View ${photo.alt}`}><img src={photo.src} alt={photo.alt} loading="lazy" /></Button>)}</div></section>}

    <section className="rsvp-section section-pad" id="rsvp"><div className="rsvp-layout"><div className="rsvp-intro"><span className="section-mini">SAVE YOUR SEAT</span><h2>Will you<br /><em>join us?</em></h2><Ornament /><p>We can’t wait to celebrate with you. Let us know if you’ll be there.</p><span className="rsvp-decoration" aria-hidden="true">✧</span></div><form className="rsvp-form" onSubmit={submitRsvp}><label>Your name<input name="guest" type="text" autoComplete="name" required placeholder="Enter your full name" /></label><fieldset><legend>Will you attend?</legend><div className="attendance-options"><label className={attendance === "yes" ? "selected" : ""}><input type="radio" name="attendance" value="yes" checked={attendance === "yes"} onChange={() => setAttendance("yes")} />YES, I’LL BE THERE</label><label className={attendance === "no" ? "selected" : ""}><input type="radio" name="attendance" value="no" checked={attendance === "no"} onChange={() => setAttendance("no")} />SORRY, CAN’T MAKE IT</label></div></fieldset>{attendance === "yes" && <label>Number of guests<select name="number" defaultValue="1"><option value="1">1 guest</option><option value="2">2 guests</option><option value="3">3 guests</option><option value="4">4 guests</option><option value="5">5 guests</option></select></label>}<label>A message for the couple <span>(optional)</span><textarea name="message" rows={3} placeholder="Your wishes for the couple..." /></label><Button type="submit" className="rsvp-submit">PREPARE MY RESPONSE <ArrowRight size={16} /></Button>{rsvpStatus && <p className="rsvp-status" role="status">{rsvpStatus}</p>}{rsvpResponse && <label>Your ready-to-send response<textarea value={rsvpResponse} readOnly rows={6} onFocus={event => event.currentTarget.select()} /></label>}</form></div></section>

    <section className="closing-section section-pad"><div className="closing-arch"><img src={arch} alt="" width={1024} height={1024} loading="lazy" /><div className="closing-copy"><span className="section-mini">UNTIL WE MEET</span><h2>{wedding.closingMessage}</h2><Ornament /><p>With love,</p><strong>{wedding.groom.name} & {wedding.bride.name}</strong></div></div><img className="closing-couple" src={couple} alt="Illustration of the couple" loading="lazy" width={1024} height={1280} /></section>
    <footer className="site-footer"><span>{wedding.groom.name} <i>&</i> {wedding.bride.name}</span><p>MADE WITH LOVE · {new Date(wedding.date).getFullYear()}</p><Button variant="ghost" onClick={share}><Share2 size={16} /> SHARE INVITATION</Button></footer>

    <div className="floating-actions">{wedding.musicUrl && <><audio ref={audioRef} src={wedding.musicUrl} loop preload="none" onEnded={() => setMusicPlaying(false)} /><Button variant="outline" size="icon" aria-label={musicPlaying ? "Pause music" : "Play music"} title={musicPlaying ? "Pause music" : "Play music"} onClick={toggleMusic}>{musicPlaying ? <Pause size={17} /> : <Music2 size={17} />}</Button></>}<Button variant="outline" size="icon" aria-label="Share invitation" title="Share invitation" onClick={share}><Share2 size={17} /></Button></div>
    {shareOpen && <div className="modal-backdrop" onClick={() => setShareOpen(false)}><div className="share-dialog" role="dialog" aria-modal="true" aria-label="Share invitation" onClick={e => e.stopPropagation()}><Button variant="ghost" size="icon" className="dialog-close" aria-label="Close" onClick={() => setShareOpen(false)}><X /></Button><span className="section-mini">SPREAD THE JOY</span><h2>Share our invitation</h2><p>Celebrate this special day with us.</p><div className="share-options"><Button variant="outline" onClick={copyUrl}>{copied ? <Check /> : <Copy />}{copied ? "Copied!" : "Copy link"}</Button><Button asChild><a href={`https://wa.me/?text=${encodeURIComponent(`You're invited to celebrate ${wedding.groom.name} & ${wedding.bride.name}! ${typeof window === "undefined" ? "" : window.location.href}`)}`} target="_blank" rel="noopener noreferrer">WhatsApp <ArrowRight size={16} /></a></Button></div></div></div>}
    {lightboxIndex !== null && gallery[lightboxIndex] && <div className="modal-backdrop lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={() => setLightboxIndex(null)}><Button variant="ghost" size="icon" className="lightbox-close" aria-label="Close photo" onClick={() => setLightboxIndex(null)}><X /></Button><Button variant="ghost" size="icon" aria-label="Previous photo" onClick={e => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + gallery.length) % gallery.length); }}><ChevronLeft /></Button><img src={gallery[lightboxIndex].src} alt={gallery[lightboxIndex].alt} onClick={e => e.stopPropagation()} onTouchStart={e => { e.currentTarget.dataset["startX"] = String(e.touches[0]?.clientX ?? 0); }} onTouchEnd={e => { const start = Number(e.currentTarget.dataset["startX"]); const delta = (e.changedTouches[0]?.clientX ?? start) - start; if (Math.abs(delta) > 50) setLightboxIndex((lightboxIndex + (delta < 0 ? 1 : -1) + gallery.length) % gallery.length); }} /><Button variant="ghost" size="icon" aria-label="Next photo" onClick={e => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % gallery.length); }}><ChevronRight /></Button></div>}
  </main>;
}
