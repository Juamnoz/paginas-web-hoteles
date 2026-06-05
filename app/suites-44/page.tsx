"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

// ── Data ───────────────────────────────────────────────────────────────────

const HERO_IMAGES = [
  "/hotels/suites-44/recepcion.jpg",
  "/hotels/suites-44/triple-basica.jpg",
  "/hotels/suites-44/habitacion-triple.jpg",
  "/hotels/suites-44/527437929.jpg",
];

const TICKER_ITEMS = [
  "Suites · Hotel",
  "Laureles · Medellín",
  "WiFi Gratis",
  "TV por Cable",
  "Aire Acondicionado",
  "Check-in 24h",
];

type CardData = {
  id: string;
  label: string;
  sublabel: string;
  href: string;
  image: string;
  primary?: boolean;
  anchor?: boolean;
  badge?: "whatsapp";
};

const CARDS: CardData[] = [
  {
    id: "reservar",
    label: "Reservar Ahora",
    sublabel: "Mejor precio garantizado",
    href: "#motor-reservas",
    image: "/hotels/suites-44/triple-basica.jpg",
    primary: true,
    anchor: true,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    sublabel: "Reserva directa",
    href: "https://wa.me/573115781227",
    image: "/hotels/suites-44/habitacion-suite.jpg",
    badge: "whatsapp",
  },
];

const SOCIALS = [
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/hotel_suites44laureles",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/share/1BegtuWtrG/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

// ── BentoCard ──────────────────────────────────────────────────────────────

function BentoCard({ card, tall = false }: { card: CardData; tall?: boolean }) {
  const linkProps = card.anchor
    ? { href: card.href }
    : { href: card.href, target: "_blank", rel: "noopener noreferrer" };

  return (
    <motion.a
      {...linkProps}
      className={`relative w-full rounded-2xl overflow-hidden flex flex-col justify-end ${tall ? "h-52" : "h-36"}`}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      whileHover={{ scale: 1.018 }}
      whileTap={{ scale: 0.97 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={card.image}
        alt={card.label}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: card.primary
            ? "linear-gradient(135deg, rgba(200,150,90,0.32) 0%, transparent 55%), linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.12) 65%)"
            : "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.08) 62%)",
        }}
      />
      {card.badge === "whatsapp" && (
        <div
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: "#25D366", boxShadow: "0 2px 10px rgba(37,211,102,0.45)" }}
        >
          <svg viewBox="0 0 24 24" fill="white" width={16} height={16}>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </div>
      )}
      <div className="relative z-10 p-4 flex items-end justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm leading-snug">{card.label}</p>
          {card.sublabel && (
            <p className="text-white/50 text-[11px] mt-0.5">{card.sublabel}</p>
          )}
        </div>
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(255,255,255,0.14)",
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </div>
      </div>
      {card.primary && (
        <div
          className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-widest uppercase"
          style={{ background: "#c8965a", color: "white", boxShadow: "0 2px 14px rgba(200,150,90,0.45)" }}
        >
          Disponible
        </div>
      )}
    </motion.a>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function Suites44Page() {
  const [heroIdx, setHeroIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setHeroIdx((i) => (i + 1) % HERO_IMAGES.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <main className="min-h-screen" style={{ background: "#0d0c0b" }}>
      <style>{`
        @keyframes s44-ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .s44-ticker-track {
          display: flex;
          width: max-content;
          animation: s44-ticker 28s linear infinite;
        }
        html { scroll-behavior: smooth; }
      `}</style>

      {/* ── Hero fullscreen ── */}
      <section className="relative h-screen flex flex-col items-center overflow-hidden">
        <AnimatePresence>
          <motion.div
            key={heroIdx}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={HERO_IMAGES[heroIdx]}
              alt="Hotel Suites 44 Laureles"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
          </motion.div>
        </AnimatePresence>

        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.42) 50%, rgba(13,12,11,0.92) 100%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 gap-5 flex-1 justify-center">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col items-center gap-3"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hotels/suites-44/logo-suites-44.PNG"
              alt="Hotel Suites 44"
              style={{
                width: 96,
                height: 96,
                objectFit: "cover",
                borderRadius: 16,
                display: "block",
                boxShadow: "0 0 0 1px rgba(200,150,90,0.35), 0 8px 32px rgba(0,0,0,0.6)",
              }}
            />
            <h1
              className="text-[2.75rem] font-bold text-white leading-[1.08] tracking-tight"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif", textShadow: "0 2px 24px rgba(0,0,0,0.65)" }}
            >
              Suites 44<br />Hotel
            </h1>
            <p className="text-white/50 text-[10px] tracking-[0.28em] uppercase">
              Hotel · Suites · Laureles
            </p>
            <p
              className="text-white/35 text-[12px] max-w-[240px] mx-auto leading-relaxed mt-1"
              style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}
            >
              Comodidad y ubicación en el corazón de Laureles
            </p>
          </motion.div>

          {/* Progress dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.95 }}
            className="flex gap-2 mt-1"
          >
            {HERO_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIdx(i)}
                className="h-[3px] rounded-full transition-all duration-500"
                style={{
                  width: i === heroIdx ? 28 : 6,
                  background: i === heroIdx ? "#c8965a" : "rgba(255,255,255,0.28)",
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          className="relative z-10 flex flex-col items-center gap-1.5 pb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.15 }}
        >
          <span className="text-white/40 text-[9px] tracking-[0.35em] uppercase">Explorar</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          >
            <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Stats Ticker ── */}
      <div className="overflow-hidden py-3" style={{ background: "#c8965a" }}>
        <div className="s44-ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="inline-flex items-center">
              <span
                className="px-7 text-sm font-semibold"
                style={{ color: "rgba(255,255,255,0.92)", letterSpacing: "0.1em" }}
              >
                {item}
              </span>
              <span style={{ color: "rgba(255,255,255,0.32)", fontSize: 9 }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Constrained content ── */}
      <div className="max-w-[430px] mx-auto w-full">

        {/* ── Bento Cards ── */}
        <section className="px-4 pt-8 pb-6" style={{ background: "#0d0c0b" }}>
          <motion.p
            className="text-center text-[10px] tracking-[0.32em] uppercase mb-5"
            style={{ color: "rgba(200,150,90,0.6)" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Accesos rápidos
          </motion.p>
          <div className="flex flex-col gap-3">
            <BentoCard card={CARDS[0]} tall />
            <BentoCard card={CARDS[1]} />
          </div>
        </section>

        {/* ── Motor de reservas ── */}
        <section id="motor-reservas" className="px-4 pb-6" style={{ background: "#0d0c0b" }}>
          <div className="h-px mb-5" style={{ background: "rgba(200,150,90,0.1)" }} />
          <motion.p
            className="text-center text-[10px] tracking-[0.32em] uppercase mb-4"
            style={{ color: "rgba(200,150,90,0.6)" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Reserva directa
          </motion.p>
          <motion.div
            className="rounded-3xl overflow-hidden"
            style={{ background: "#131110", border: "1px solid rgba(200,150,90,0.14)" }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <iframe
              src="https://sys.hosroom.com/booking/177-hotel-suites-44-laureles"
              width="100%"
              height="580"
              style={{ border: 0, display: "block", colorScheme: "light" }}
              title="Motor de reservas Hotel Suites 44"
              loading="lazy"
              allow="payment"
            />
          </motion.div>
        </section>

        {/* ── Location & Social ── */}
        <section className="px-4 pt-2 pb-8" style={{ background: "#0d0c0b" }}>
          <div className="h-px mb-5" style={{ background: "rgba(200,150,90,0.1)" }} />

          <motion.div
            className="rounded-3xl overflow-hidden"
            style={{ background: "#131110", border: "1px solid rgba(200,150,90,0.14)" }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative w-full" style={{ height: 160 }}>
              <iframe
                src="https://maps.google.com/maps?q=Hotel+Suites+44+Laureles+Medellín&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="160"
                style={{ border: 0, filter: "grayscale(60%) brightness(0.68)", display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Hotel Suites 44"
              />
            </div>

            <div className="px-4 py-3.5 flex items-center justify-between gap-3">
              <a
                href="https://www.google.com/maps/search/Hotel+Suites+44+Laureles+Medellín"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 min-w-0"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width={14} height={14} style={{ flexShrink: 0, color: "#c8965a" }}>
                  <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.083 3.978-5.121 3.978-8.827a8.25 8.25 0 00-16.5 0c0 3.706 2.034 6.744 3.978 8.827a19.576 19.576 0 002.854 2.715l.018.013.004.003zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                <div className="min-w-0">
                  <p className="text-xs font-semibold leading-tight truncate" style={{ color: "rgba(255,255,255,0.85)" }}>
                    Laureles‑Estadio
                  </p>
                  <p className="text-[10px] leading-tight" style={{ color: "rgba(255,255,255,0.35)" }}>
                    Medellín, Antioquia
                  </p>
                </div>
              </a>

              <div className="flex items-center gap-2 flex-shrink-0">
                {SOCIALS.map((s) => (
                  <motion.a
                    key={s.id}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.12, y: -1 }}
                    whileTap={{ scale: 0.92 }}
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(200,150,90,0.16)",
                      color: "#c8965a",
                    }}
                    aria-label={s.label}
                  >
                    {s.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── Footer ── */}
        <footer
          className="flex flex-col items-center gap-2 pt-5 pb-10"
          style={{ background: "#0d0c0b", borderTop: "1px solid rgba(200,150,90,0.08)" }}
        >
          <p
            className="text-[11px] tracking-[0.35em]"
            style={{
              color: "rgba(200,150,90,0.35)",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontStyle: "italic",
              fontWeight: 300,
            }}
          >
            by H . M . B
          </p>
          <p
            className="text-[10px] tracking-[0.18em] uppercase"
            style={{
              color: "rgba(255,255,255,0.15)",
              fontFamily: "'Courier New', Courier, monospace",
            }}
          >
            Desarrollado por{" "}
            <span style={{ color: "rgba(255,255,255,0.28)", fontWeight: 700 }}>Hello AI</span>
          </p>
        </footer>

      </div>
    </main>
  );
}
