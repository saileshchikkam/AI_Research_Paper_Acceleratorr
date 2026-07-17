import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../ThemeContext';

export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle nodes config (Research connections)
    const particlesCount = Math.min(65, Math.floor((width * height) / 22000));
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      pulse: number;
      pulseSpeed: number;
    }> = [];

    // Liquid Glass Gradient Mesh Blobs configuration (Unique Luxury Palette)
    const blobs: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      colorDark: string;
    }> = [
      {
        x: width * 0.15,
        y: height * 0.25,
        vx: 0.12,
        vy: 0.08,
        radius: Math.min(width * 0.45, 450),
        color: 'rgba(16, 185, 129, 0.16)', // Soft Emerald
        colorDark: 'rgba(16, 185, 129, 0.09)',
      },
      {
        x: width * 0.8,
        y: height * 0.35,
        vx: -0.08,
        vy: 0.12,
        radius: Math.min(width * 0.5, 520),
        color: 'rgba(139, 92, 246, 0.15)', // Violet
        colorDark: 'rgba(109, 40, 217, 0.08)',
      },
      {
        x: width * 0.5,
        y: height * 0.75,
        vx: 0.06,
        vy: -0.1,
        radius: Math.min(width * 0.4, 420),
        color: 'rgba(6, 182, 212, 0.15)', // Cyan
        colorDark: 'rgba(8, 145, 178, 0.08)',
      },
      {
        x: width * 0.3,
        y: height * 0.85,
        vx: -0.07,
        vy: 0.05,
        radius: Math.min(width * 0.35, 350),
        color: 'rgba(244, 63, 94, 0.1)', // Coral Accent
        colorDark: 'rgba(225, 29, 72, 0.05)',
      },
      {
        x: width * 0.7,
        y: height * 0.15,
        vx: 0.05,
        vy: -0.06,
        radius: Math.min(width * 0.35, 380),
        color: 'rgba(245, 158, 11, 0.1)', // Warm Gold Highlight
        colorDark: 'rgba(217, 119, 6, 0.05)',
      },
    ];

    // Translucent Liquid Glass Bubbles configuration
    const glassBubblesCount = 12;
    const glassBubbles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      opacity: number;
      angle: number;
      rotationSpeed: number;
    }> = [];

    for (let i = 0; i < glassBubblesCount; i++) {
      glassBubbles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        radius: Math.random() * 50 + 25,
        opacity: Math.random() * 0.2 + 0.1,
        angle: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
      });
    }

    // Mouse coordinates with easing follow
    const mouse = { x: -1000, y: -1000, currentX: -1000, currentY: -1000, radius: 240 };

    for (let i = 0; i < particlesCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.8 + 0.8,
        pulse: Math.random() * Math.PI,
        pulseSpeed: 0.01 + Math.random() * 0.02,
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (mouse.currentX === -1000) {
        mouse.currentX = mouse.x;
        mouse.currentY = mouse.y;
      }
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const isDark = theme === 'dark';

      // 1. Draw Liquid Glass Ambient Gradient Mesh Blobs (Iridescent Aurora Glows)
      blobs.forEach((b) => {
        b.x += b.vx;
        b.y += b.vy;

        // Soft bounce boundaries
        if (b.x - b.radius < -100 || b.x + b.radius > width + 100) b.vx *= -1;
        if (b.y - b.radius < -100 || b.y + b.radius > height + 100) b.vy *= -1;

        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
        const color = isDark ? b.colorDark : b.color;
        grad.addColorStop(0, color);
        grad.addColorStop(0.5, color.replace(/[\d\.]+\)$/, '0.04)'));
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      // 2. Draw Floating Liquid Glass Bubbles (Refractive, Lustrous)
      glassBubbles.forEach((bubble) => {
        bubble.x += bubble.vx;
        bubble.y += bubble.vy;
        bubble.angle += bubble.rotationSpeed;

        // Bounce boundaries
        if (bubble.x - bubble.radius < -50 || bubble.x + bubble.radius > width + 50) bubble.vx *= -1;
        if (bubble.y - bubble.radius < -50 || bubble.y + bubble.radius > height + 50) bubble.vy *= -1;

        ctx.save();
        ctx.translate(bubble.x, bubble.y);
        ctx.rotate(bubble.angle);

        // Ambient glass shadow
        ctx.beginPath();
        ctx.arc(0, 0, bubble.radius, 0, Math.PI * 2);
        ctx.shadowColor = isDark ? 'rgba(0,0,0,0.4)' : 'rgba(15, 23, 42, 0.08)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 6;
        
        // Base glass refraction (dual gradient overlay)
        const glassGrad = ctx.createRadialGradient(
          -bubble.radius * 0.25,
          -bubble.radius * 0.25,
          0,
          -bubble.radius * 0.1,
          -bubble.radius * 0.1,
          bubble.radius
        );
        
        if (isDark) {
          glassGrad.addColorStop(0, 'rgba(255, 255, 255, 0.09)');
          glassGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.02)');
          glassGrad.addColorStop(0.8, 'rgba(255, 255, 255, 0.005)');
          glassGrad.addColorStop(1, 'rgba(255, 255, 255, 0.06)'); // edge rim
        } else {
          glassGrad.addColorStop(0, 'rgba(255, 255, 255, 0.28)');
          glassGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.08)');
          glassGrad.addColorStop(0.8, 'rgba(255, 255, 255, 0.02)');
          glassGrad.addColorStop(1, 'rgba(255, 255, 255, 0.35)'); // edge rim
        }
        
        ctx.fillStyle = glassGrad;
        ctx.fill();

        // High gloss specular highlight
        const specGrad = ctx.createRadialGradient(
          -bubble.radius * 0.35,
          -bubble.radius * 0.35,
          0,
          -bubble.radius * 0.35,
          -bubble.radius * 0.35,
          bubble.radius * 0.3
        );
        specGrad.addColorStop(0, isDark ? 'rgba(255, 255, 255, 0.28)' : 'rgba(255, 255, 255, 0.65)');
        specGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.beginPath();
        ctx.arc(-bubble.radius * 0.35, -bubble.radius * 0.35, bubble.radius * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = specGrad;
        ctx.fill();

        // Glass Rim outline for depth refraction
        ctx.beginPath();
        ctx.arc(0, 0, bubble.radius, 0, Math.PI * 2);
        ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.42)';
        ctx.lineWidth = 1;
        ctx.shadowBlur = 0; // reset shadow
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.stroke();

        ctx.restore();
      });

      // 3. Draw Interactive Spotlight Mouse Glow
      if (mouse.x !== -1000) {
        // Easing follow for smooth micro lag feel
        mouse.currentX += (mouse.x - mouse.currentX) * 0.08;
        mouse.currentY += (mouse.y - mouse.currentY) * 0.08;

        const spotGlow = ctx.createRadialGradient(
          mouse.currentX,
          mouse.currentY,
          0,
          mouse.currentX,
          mouse.currentY,
          mouse.radius
        );

        const glowColor = isDark 
          ? 'rgba(16, 185, 129, 0.08)' // Emerald glow
          : 'rgba(139, 92, 246, 0.07)'; // Violet glow

        spotGlow.addColorStop(0, glowColor);
        spotGlow.addColorStop(0.4, isDark ? 'rgba(6, 182, 212, 0.04)' : 'rgba(244, 63, 94, 0.02)');
        spotGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.beginPath();
        ctx.arc(mouse.currentX, mouse.currentY, mouse.radius, 0, Math.PI * 2);
        ctx.fillStyle = spotGlow;
        ctx.fill();
      }

      // 4. Draw Subtly Aligned Grid Lines
      const gridSpacing = 90;
      ctx.strokeStyle = isDark ? 'rgba(139, 92, 246, 0.02)' : 'rgba(16, 185, 129, 0.015)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 5. Draw and Update Particle Connections (Living Neural Research Nodes)
      const particleColor = isDark ? 'rgba(16, 185, 129, 0.28)' : 'rgba(139, 92, 246, 0.22)';
      const lineColor = isDark ? 'rgba(139, 92, 246, 0.06)' : 'rgba(16, 185, 129, 0.05)';
      const mouseLineColor = isDark ? 'rgba(6, 182, 212, 0.16)' : 'rgba(244, 63, 94, 0.12)';

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;

        // Bounce boundaries
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Pulse size slightly
        const radius = p.radius + Math.sin(p.pulse) * 0.45;

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();

        // Connect near nodes
        particles.forEach((other) => {
          if (p === other) return;
          const dx = p.x - other.x;
          const dy = p.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = (1 - dist / 140) * 0.8;
            ctx.stroke();
          }
        });

        // Interactive mouse connection
        if (mouse.x !== -1000) {
          const dx = p.x - mouse.currentX;
          const dy = p.y - mouse.currentY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.currentX, mouse.currentY);
            ctx.strokeStyle = mouseLineColor;
            ctx.lineWidth = (1 - dist / mouse.radius) * 1.2;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden w-full h-full"
      id="landing_interactive_bg"
    />
  );
}
