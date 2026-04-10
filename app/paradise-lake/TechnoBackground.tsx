"use client";

import { useEffect, useRef } from "react";

export default function TechnoBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let animId: number;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Particles
    const PARTICLE_COUNT = 80;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.6 - 0.2,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.6 + 0.2,
      color: Math.random() > 0.5 ? "#F7941D" : "#2BAF9E",
    }));

    // Lasers
    const LASER_COUNT = 6;
    const lasers = Array.from({ length: LASER_COUNT }, (_, i) => ({
      angle: (i / LASER_COUNT) * Math.PI * 2,
      speed: (Math.random() > 0.5 ? 1 : -1) * (0.003 + Math.random() * 0.004),
      color: i % 3 === 0 ? "#F7941D" : i % 3 === 1 ? "#2BAF9E" : "#ffffff",
      alpha: 0.35 + Math.random() * 0.25,
      width: 1 + Math.random() * 1.5,
    }));

    // Rings
    const rings = Array.from({ length: 5 }, (_, i) => ({
      phase: (i / 5) * Math.PI * 2,
      speed: 0.008 + i * 0.003,
      color: i % 2 === 0 ? "#F7941D" : "#2BAF9E",
    }));

    const draw = () => {
      t += 0.016;
      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;
      const cy = H / 2;

      // Background
      ctx.fillStyle = "#020509";
      ctx.fillRect(0, 0, W, H);

      // Grid perspective
      ctx.save();
      ctx.globalAlpha = 0.12;
      const GRID = 60;
      const vanishY = H * 0.45;
      const horizon = vanishY;
      ctx.strokeStyle = "#2BAF9E";
      ctx.lineWidth = 0.8;
      // Horizontal lines
      for (let row = 0; row <= 18; row++) {
        const progress = row / 18;
        const eased = Math.pow(progress, 2.2);
        const y = horizon + eased * (H - horizon);
        const spread = eased * W * 1.2;
        ctx.beginPath();
        ctx.moveTo(cx - spread / 2, y);
        ctx.lineTo(cx + spread / 2, y);
        ctx.stroke();
      }
      // Vertical lines
      for (let col = -10; col <= 10; col++) {
        ctx.beginPath();
        ctx.moveTo(cx + col * 18, horizon);
        ctx.lineTo(cx + col * W * 0.09, H);
        ctx.stroke();
      }
      ctx.restore();

      // Pulse rings from center
      rings.forEach((ring) => {
        const pulse = (Math.sin(t * ring.speed * 60 + ring.phase) + 1) / 2;
        const r = 60 + pulse * Math.min(W, H) * 0.55;
        const alpha = (1 - pulse) * 0.18;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(cx, cy * 0.7, r, 0, Math.PI * 2);
        ctx.strokeStyle = ring.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      });

      // Laser beams from top-center focal point
      const focal = { x: cx, y: H * 0.05 };
      lasers.forEach((laser) => {
        laser.angle += laser.speed;
        const len = Math.max(W, H) * 1.6;
        const ex = focal.x + Math.cos(laser.angle) * len;
        const ey = focal.y + Math.sin(laser.angle) * len;

        const grad = ctx.createLinearGradient(focal.x, focal.y, ex, ey);
        grad.addColorStop(0, laser.color.replace(")", `,${laser.alpha})`).replace("rgb", "rgba").replace("#F7941D", `rgba(247,148,29,${laser.alpha})`).replace("#2BAF9E", `rgba(43,175,158,${laser.alpha})`).replace("#ffffff", `rgba(255,255,255,${laser.alpha})`));
        grad.addColorStop(1, "rgba(0,0,0,0)");

        ctx.save();
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.moveTo(focal.x, focal.y);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = grad;
        ctx.lineWidth = laser.width;
        ctx.shadowColor = laser.color;
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.restore();
      });

      // Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;

        ctx.save();
        ctx.globalAlpha = p.alpha * (0.7 + 0.3 * Math.sin(t * 2 + p.x));
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Central glow
      const glowR = ctx.createRadialGradient(cx, H * 0.3, 0, cx, H * 0.3, 220);
      glowR.addColorStop(0, `rgba(247,148,29,${0.04 + 0.03 * Math.sin(t * 1.5)})`);
      glowR.addColorStop(0.5, `rgba(43,175,158,${0.03 + 0.02 * Math.sin(t * 1.2)})`);
      glowR.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glowR;
      ctx.fillRect(0, 0, W, H);

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.9 }}
    />
  );
}
