"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";

interface SlideImage {
  src: string;
  alt: string;
}

interface ImageSliderProps {
  images: SlideImage[];
  accentColor: string;
  dotColor?: string;
  borderColor?: string;
}

export default function ImageSlider({
  images,
  accentColor,
  dotColor,
  borderColor = "rgba(255,255,255,0.3)",
}: ImageSliderProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
  }, [images.length]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
      resetTimer();
    },
    [current, resetTimer]
  );

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      const threshold = 50;
      if (info.offset.x < -threshold) {
        goTo((current + 1) % images.length);
      } else if (info.offset.x > threshold) {
        goTo((current - 1 + images.length) % images.length);
      }
    },
    [current, images.length, goTo]
  );

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <div className="w-full px-2">
      <div
        className="relative w-full rounded-2xl overflow-hidden shadow-lg"
        style={{ aspectRatio: "16/10", border: `1px solid ${borderColor}` }}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            <Image
              src={images[current].src}
              alt={images[current].alt}
              fill
              className="object-cover"
              sizes="(max-width: 430px) 100vw, 430px"
              priority={current === 0}
              draggable={false}
              unoptimized={true}
            />
          </motion.div>
        </AnimatePresence>

        {/* Nav arrows */}
        <button
          onClick={() => goTo((current - 1 + images.length) % images.length)}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm z-10"
          style={{ background: "rgba(0,0,0,0.3)", color: "#fff" }}
          aria-label="Anterior"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          onClick={() => goTo((current + 1) % images.length)}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm z-10"
          style={{ background: "rgba(0,0,0,0.3)", color: "#fff" }}
          aria-label="Siguiente"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* Counter badge */}
        <div
          className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium z-10"
          style={{ background: "rgba(0,0,0,0.4)", color: "#fff", backdropFilter: "blur(4px)" }}
        >
          {current + 1} / {images.length}
        </div>
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-1.5 mt-3">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? 20 : 6,
              height: 6,
              background: i === current ? (dotColor || accentColor) : `${dotColor || accentColor}40`,
            }}
            aria-label={`Imagen ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
