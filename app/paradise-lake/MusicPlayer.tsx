"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SC_PROFILE = "https://soundcloud.com/jacobo-ospina-586735415";
const EMBED_URL = `https://w.soundcloud.com/player/?url=${encodeURIComponent(SC_PROFILE)}&color=%23F7941D&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&buying=false&sharing=false&download=false`;

declare global {
  interface Window {
    SC: { Widget: (el: HTMLIFrameElement) => SCWidget };
  }
}
interface SCWidget {
  bind(event: string, cb: () => void): void;
  unbind(event: string): void;
  play(): void;
  pause(): void;
  seekTo(ms: number): void;
  getDuration(cb: (ms: number) => void): void;
  getCurrentSound(cb: (sound: { title?: string }) => void): void;
}

// 24 barras con alturas y delays variados para simular espectro real
const BARS = [
  { h: 28, d: 0.00 }, { h: 45, d: 0.08 }, { h: 62, d: 0.16 }, { h: 38, d: 0.04 },
  { h: 80, d: 0.22 }, { h: 55, d: 0.12 }, { h: 72, d: 0.30 }, { h: 42, d: 0.18 },
  { h: 90, d: 0.06 }, { h: 60, d: 0.24 }, { h: 48, d: 0.14 }, { h: 76, d: 0.36 },
  { h: 35, d: 0.10 }, { h: 68, d: 0.28 }, { h: 52, d: 0.02 }, { h: 84, d: 0.20 },
  { h: 40, d: 0.32 }, { h: 70, d: 0.08 }, { h: 58, d: 0.26 }, { h: 46, d: 0.16 },
  { h: 78, d: 0.34 }, { h: 36, d: 0.12 }, { h: 64, d: 0.22 }, { h: 50, d: 0.18 },
];

function Waveform({ playing }: { playing: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2, height: 36, flex: 1 }}>
      {BARS.map((bar, i) => (
        <motion.div
          key={i}
          style={{
            width: 2.5,
            borderRadius: 99,
            originY: 0.5,
            background: playing
              ? `linear-gradient(to top, #F7941D, #FFD580)`
              : "rgba(255,255,255,0.15)",
          }}
          animate={
            playing
              ? {
                  height: [
                    bar.h * 0.25,
                    bar.h,
                    bar.h * 0.55,
                    bar.h * 0.9,
                    bar.h * 0.35,
                    bar.h,
                    bar.h * 0.25,
                  ],
                  opacity: [0.6, 1, 0.7, 1, 0.65, 1, 0.6],
                }
              : { height: bar.h * 0.15, opacity: 0.2 }
          }
          transition={
            playing
              ? {
                  duration: 1.1 + (i % 5) * 0.18,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: bar.d,
                }
              : { duration: 0.5, ease: "easeOut" }
          }
        />
      ))}
    </div>
  );
}

function SoundCloudLogo() {
  return (
    <svg width="20" height="10" viewBox="0 0 40 18" fill="none">
      <path
        d="M0 12.5C0 15 2 17 4.5 17h28c3.9 0 7-3.1 7-7s-3.1-7-7-7l-.6.04C31.2 1.4 27.6-1 23.5-1c-3 0-5.7 1.5-7.4 3.8A5.5 5.5 0 0014 2.5C10.8 2.5 8.2 5 8.1 8.2 5.5 8.9 3.5 10.1 2 12c-.5-.2-1 0-1.5.2L0 12.5z"
        fill="#FF5500"
      />
    </svg>
  );
}

export default function MusicPlayer() {
  const iframeRef  = useRef<HTMLIFrameElement>(null);
  const widgetRef  = useRef<SCWidget | null>(null);
  const [visible,    setVisible]    = useState(false);
  const [playing,    setPlaying]    = useState(false);
  const [trackTitle, setTrackTitle] = useState("Jacobo Ospina");
  const [ready,      setReady]      = useState(false);
  const firstPlay = useRef(true);

  useEffect(() => { setVisible(true); }, []);

  useEffect(() => {
    const anchor = document.getElementById("music-trigger");
    if (!anchor) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && widgetRef.current && ready) {
          widgetRef.current.play();
          observer.disconnect();
        }
      },
      { threshold: 0 }
    );
    observer.observe(anchor);
    return () => observer.disconnect();
  }, [ready]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const setup = () => {
      if (!iframeRef.current || !window.SC) return;
      const widget = window.SC.Widget(iframeRef.current);
      widgetRef.current = widget;
      const refreshTitle = () =>
        widget.getCurrentSound((s) => { if (s?.title) setTrackTitle(s.title); });
      widget.bind("ready", () => { setReady(true); refreshTitle(); });
      widget.bind("play",  () => { setPlaying(true); refreshTitle(); });
      widget.bind("pause",  () => setPlaying(false));
      widget.bind("finish", () => setPlaying(false));
    };
    const existing = document.getElementById("sc-widget-api");
    if (existing) {
      if (window.SC) setup();
      else existing.addEventListener("load", setup, { once: true });
      return;
    }
    const script = document.createElement("script");
    script.id  = "sc-widget-api";
    script.src = "https://w.soundcloud.com/player/api.js";
    script.addEventListener("load", setup, { once: true });
    document.head.appendChild(script);
    return () => {
      widgetRef.current?.unbind("ready");
      widgetRef.current?.unbind("play");
      widgetRef.current?.unbind("pause");
      widgetRef.current?.unbind("finish");
    };
  }, []);

  const togglePlay = () => {
    const w = widgetRef.current;
    if (!w) return;
    if (playing) {
      w.pause();
    } else if (firstPlay.current) {
      firstPlay.current = false;
      w.getDuration((ms) => { w.seekTo(ms / 2); w.play(); });
    } else {
      w.play();
    }
  };

  const dismiss = () => {
    widgetRef.current?.pause();
    setVisible(false);
    sessionStorage.setItem("music-dismissed", "1");
  };

  return (
    <>
      <iframe
        ref={iframeRef}
        src={EMBED_URL}
        style={{ display: "none", position: "absolute", pointerEvents: "none" }}
        allow="autoplay"
        title="SC player"
      />

      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            style={{
              position: "fixed",
              bottom: 20,
              left: "50%",
              x: "-50%",
              width: "calc(100% - 32px)",
              maxWidth: 420,
              zIndex: 50,
            }}
          >
            {/* glow ambiental cuando suena */}
            <motion.div
              animate={playing ? { opacity: [0.3, 0.6, 0.3] } : { opacity: 0 }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: "absolute",
                inset: -12,
                borderRadius: 32,
                background: "radial-gradient(ellipse, rgba(247,148,29,0.35) 0%, transparent 72%)",
                filter: "blur(16px)",
                pointerEvents: "none",
              }}
            />

            {/* card — sin borde, solo sombra + blur */}
            <div
              style={{
                position: "relative",
                borderRadius: 24,
                overflow: "hidden",
                background: "rgba(10,6,6,0.75)",
                backdropFilter: "blur(40px) saturate(180%)",
                WebkitBackdropFilter: "blur(40px) saturate(180%)",
                boxShadow: "0 24px 64px rgba(0,0,0,0.7), 0 2px 0 rgba(255,255,255,0.04) inset",
                padding: "12px 14px 14px",
              }}
            >
              {/* fila superior: logo + estado + cerrar */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                <SoundCloudLogo />
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.28)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}>
                  SoundCloud
                </span>
                <motion.span
                  animate={playing ? { opacity: [0.4, 0.9, 0.4] } : { opacity: 0.3 }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  style={{ fontSize: 9, color: playing ? "#F7941D" : "rgba(255,255,255,0.2)", marginLeft: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}
                >
                  {ready ? (playing ? "● en vivo" : "en pausa") : "cargando"}
                </motion.span>
                <button
                  onClick={dismiss}
                  style={{
                    marginLeft: "auto",
                    width: 24, height: 24,
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "rgba(255,255,255,0.07)",
                    border: "none",
                    cursor: "pointer",
                    color: "rgba(255,255,255,0.3)",
                    flexShrink: 0,
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} width={11} height={11}>
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* fila principal: play + info + waveform */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <motion.button
                  onClick={togglePlay}
                  disabled={!ready}
                  whileHover={{ scale: ready ? 1.08 : 1 }}
                  whileTap={{ scale: ready ? 0.92 : 1 }}
                  style={{
                    flexShrink: 0,
                    width: 44, height: 44,
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: ready
                      ? "linear-gradient(145deg, #F7941D 0%, #A85500 100%)"
                      : "rgba(255,255,255,0.06)",
                    border: "none",
                    cursor: ready ? "pointer" : "not-allowed",
                    boxShadow: ready && playing ? "0 0 24px rgba(247,148,29,0.55)" : "none",
                  }}
                >
                  {playing ? (
                    <svg viewBox="0 0 24 24" fill="white" width={16} height={16}>
                      <rect x="6" y="4" width="4" height="16" rx="1.5" />
                      <rect x="14" y="4" width="4" height="16" rx="1.5" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="white" width={16} height={16}>
                      <path d="M8 5.5v13l10-6.5z" />
                    </svg>
                  )}
                </motion.button>

                {/* nombre del track */}
                <div style={{ minWidth: 0, flexShrink: 0, maxWidth: 100 }}>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", margin: 0, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>
                    Jacobo Ospina
                  </p>
                  <p style={{ fontSize: 12, color: "#fff", margin: 0, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {trackTitle}
                  </p>
                </div>

                {/* waveform ocupa el espacio restante */}
                <Waveform playing={playing} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
