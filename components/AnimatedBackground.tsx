import React, { useEffect, useRef } from 'react';
import { TimerMode } from '../types';

interface AnimatedBackgroundProps {
  mode: TimerMode;
}

type ParticleType = 'circle' | 'square' | 'triangle';

interface Particle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  alpha: number;
  targetAlpha: number;
  type: ParticleType;
  rotation: number;
  rotationSpeed: number;
}

interface Color {
  r: number;
  g: number;
  b: number;
}

interface ThemeColors {
  bgTop: Color;
  bgBottom: Color;
  particle: Color;
}

// Helper functions
const hexToRgb = (hex: string): Color => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
};

const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

const lerpColor = (current: Color, target: Color, factor: number): Color => ({
  r: lerp(current.r, target.r, factor),
  g: lerp(current.g, target.g, factor),
  b: lerp(current.b, target.b, factor),
});

const WORK_THEME: ThemeColors = {
  bgTop: hexToRgb('#1a0505'),    // Very dark red
  bgBottom: hexToRgb('#450a0a'), // Dark red
  particle: hexToRgb('#ff4e4e')  // Bright red
};

const BREAK_THEME: ThemeColors = {
  bgTop: hexToRgb('#022c22'),    // Very dark teal
  bgBottom: hexToRgb('#064e3b'), // Dark teal
  particle: hexToRgb('#4eff8a')  // Bright green
};

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ mode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const modeRef = useRef(mode);
  // Initialize colors based on current mode to prevent jump on load if not WORK
  const currentColorsRef = useRef<ThemeColors>(mode === TimerMode.WORK ? WORK_THEME : BREAK_THEME);

  // Update modeRef whenever prop changes so animation loop sees it
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  const initParticles = (width: number, height: number) => {
    const particleCount = 60;
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(width, height));
    }
    particlesRef.current = particles;
  };

  const createParticle = (w: number, h: number): Particle => {
    const types: ParticleType[] = ['circle', 'circle', 'circle', 'square', 'triangle'];
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 4 + 1,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1,
      targetAlpha: Math.random() * 0.6 + 0.1,
      type: types[Math.floor(Math.random() * types.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02
    };
  };

  const drawTriangle = (ctx: CanvasRenderingContext2D, size: number) => {
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size, size);
    ctx.lineTo(-size, size);
    ctx.closePath();
    ctx.fill();
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const targetTheme = modeRef.current === TimerMode.WORK ? WORK_THEME : BREAK_THEME;
    
    // Smoothly interpolate current colors towards target theme
    currentColorsRef.current = {
      bgTop: lerpColor(currentColorsRef.current.bgTop, targetTheme.bgTop, 0.02),
      bgBottom: lerpColor(currentColorsRef.current.bgBottom, targetTheme.bgBottom, 0.02),
      particle: lerpColor(currentColorsRef.current.particle, targetTheme.particle, 0.02)
    };

    const colors = currentColorsRef.current;

    // Draw Background Gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, `rgb(${colors.bgTop.r},${colors.bgTop.g},${colors.bgTop.b})`);
    gradient.addColorStop(1, `rgb(${colors.bgBottom.r},${colors.bgBottom.g},${colors.bgBottom.b})`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and Draw Particles
    particlesRef.current.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;

      // Wrap around edges for continuous flow
      if (p.x < -50) p.x = canvas.width + 50;
      if (p.x > canvas.width + 50) p.x = -50;
      if (p.y < -50) p.y = canvas.height + 50;
      if (p.y > canvas.height + 50) p.y = -50;

      // Twinkle effect
      if (Math.abs(p.alpha - p.targetAlpha) < 0.01) {
        p.targetAlpha = Math.random() * 0.6 + 0.1;
      }
      p.alpha = lerp(p.alpha, p.targetAlpha, 0.01);

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = `rgba(${colors.particle.r}, ${colors.particle.g}, ${colors.particle.b}, ${p.alpha})`;

      if (p.type === 'square') {
        ctx.fillRect(-p.size, -p.size, p.size * 2, p.size * 2);
      } else if (p.type === 'triangle') {
        drawTriangle(ctx, p.size);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(requestRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  );
};

export default AnimatedBackground;