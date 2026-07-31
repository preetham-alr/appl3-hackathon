/**
 * Krithiq AI - Dynamic Ambient Particle & Motion Background
 */

import React, { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';

export const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme, accentColor } = useApp();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Color maps for section accents
    const accentHexMap: Record<string, string> = {
      cyan: '#06b6d4',
      emerald: '#10b981',
      orange: '#f97316',
      violet: '#8b5cf6',
      neon: '#ec4899',
      earth: '#14b8a6',
      gold: '#f59e0b',
    };
    const activeHex = accentHexMap[accentColor] || '#06b6d4';

    // Particle nodes
    const particleCount = Math.min(30, Math.floor(width / 35));
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render soft ambient radial mesh
      const gradient = ctx.createRadialGradient(
        width * 0.5,
        height * 0.2,
        100,
        width * 0.5,
        height * 0.2,
        width * 0.8
      );
      if (theme === 'black') {
        gradient.addColorStop(0, `${activeHex}12`);
        gradient.addColorStop(1, 'transparent');
      } else {
        gradient.addColorStop(0, `${activeHex}08`);
        gradient.addColorStop(1, 'transparent');
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Render connected particles
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = activeHex;
        ctx.globalAlpha = p.alpha * 0.6;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = activeHex;
            ctx.globalAlpha = (1 - dist / 120) * 0.15;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      });

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, accentColor]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"
    />
  );
};
