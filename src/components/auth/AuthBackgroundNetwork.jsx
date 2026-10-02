import React, { useEffect, useRef, useState } from 'react';

/**
 * Premium Animated Intelligence Background System
 * Layer 1: Base Pale Yellow #F9F4BC
 * Layer 2: Floating Soft Orange Ambient Orbs with slow motion & parallax
 * Layer 3: Interactive Particle Constellation with connecting lines & flowing intelligence pulse
 */
export default function AuthBackgroundNetwork() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });
  const [isMobile, setIsMobile] = useState(false);

  // Parallax orb offsets (lerped for smoothness)
  const [orbOffset, setOrbOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Check mobile screen
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Track mouse movement for subtle parallax (5-15px)
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth) - 0.5;
      const y = (e.clientY / innerHeight) - 0.5;
      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Canvas Intelligence Network Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    // Particle definition
    const particleCount = window.innerWidth < 768 ? 12 : 32;
    let particles = [];

    // Intelligence Flow Path (Data -> Connections -> Insights -> Decisions)
    let flowProgress = 0;

    const initParticles = () => {
      particles = [];
      const count = window.innerWidth < 768 ? 12 : 32;

      for (let i = 0; i < count; i++) {
        // Bias distribution towards edges & left visual panel (keep center/right login card calmer)
        let x;
        if (Math.random() < 0.55) {
          // Left panel area
          x = Math.random() * (width * 0.45);
        } else if (Math.random() < 0.75) {
          // Outer right edge
          x = width * 0.75 + Math.random() * (width * 0.25);
        } else {
          // Top / bottom perimeter
          x = Math.random() * width;
        }

        const y = Math.random() * height;
        const radius = Math.random() * 1.8 + 1.2;
        const vx = (Math.random() - 0.5) * 0.35;
        const vy = (Math.random() - 0.5) * 0.35;
        const baseOpacity = Math.random() * 0.45 + 0.25;

        particles.push({
          x,
          y,
          originX: x,
          originY: y,
          radius,
          vx,
          vy,
          baseOpacity,
          pulseSpeed: Math.random() * 0.02 + 0.01,
          pulseOffset: Math.random() * Math.PI * 2
        });
      }
    };

    initParticles();

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Render loop
    let tick = 0;
    const render = () => {
      tick++;

      // Smooth lerp for mouse parallax
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Update React state for DOM floating orbs smoothly every few frames
      if (tick % 3 === 0) {
        setOrbOffset({
          x: mouseRef.current.x * 16,
          y: mouseRef.current.y * 16
        });
      }

      ctx.clearRect(0, 0, width, height);

      const parallaxX = mouseRef.current.x * 12;
      const parallaxY = mouseRef.current.y * 12;

      // 1. Draw Connecting Lines between nearby particles
      const connectionDist = isMobile ? 90 : 135;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = (particles[i].x + parallaxX) - (particles[j].x + parallaxX);
          const dy = (particles[i].y + parallaxY) - (particles[j].y + parallaxY);
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            const lineOpacity = (1 - dist / connectionDist) * 0.18;
            ctx.beginPath();
            ctx.moveTo(particles[i].x + parallaxX, particles[i].y + parallaxY);
            ctx.lineTo(particles[j].x + parallaxX, particles[j].y + parallaxY);
            ctx.strokeStyle = `rgba(255, 128, 0, ${lineOpacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // 2. Draw Subtle Intelligence Flow Curved Pathway (Data -> Connections -> Insights -> Decisions)
      if (!isMobile && width > 900) {
        const pathPoints = [
          { x: width * 0.08, y: height * 0.2 },
          { x: width * 0.22, y: height * 0.42 },
          { x: width * 0.15, y: height * 0.68 },
          { x: width * 0.35, y: height * 0.88 }
        ];

        // Draw faint guide curve
        ctx.beginPath();
        ctx.moveTo(pathPoints[0].x + parallaxX * 0.5, pathPoints[0].y + parallaxY * 0.5);
        ctx.bezierCurveTo(
          pathPoints[1].x + parallaxX * 0.5, pathPoints[1].y + parallaxY * 0.5,
          pathPoints[2].x + parallaxX * 0.5, pathPoints[2].y + parallaxY * 0.5,
          pathPoints[3].x + parallaxX * 0.5, pathPoints[3].y + parallaxY * 0.5
        );
        ctx.strokeStyle = 'rgba(255, 128, 0, 0.08)';
        ctx.setLineDash([4, 6]);
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.setLineDash([]); // reset

        // Advance flowing intelligence pulse
        if (!prefersReducedMotion) {
          flowProgress = (flowProgress + 0.003) % 1;
        }

        // Interpolate position along bezier curve (t = flowProgress)
        const t = flowProgress;
        const p0 = pathPoints[0];
        const p1 = pathPoints[1];
        const p2 = pathPoints[2];
        const p3 = pathPoints[3];

        const cx = Math.pow(1 - t, 3) * p0.x + 3 * Math.pow(1 - t, 2) * t * p1.x + 3 * (1 - t) * Math.pow(t, 2) * p2.x + Math.pow(t, 3) * p3.x + parallaxX * 0.5;
        const cy = Math.pow(1 - t, 3) * p0.y + 3 * Math.pow(1 - t, 2) * t * p1.y + 3 * (1 - t) * Math.pow(t, 2) * p2.y + Math.pow(t, 3) * p3.y + parallaxY * 0.5;

        // Draw traveling glowing pulse
        const pulseGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 14);
        pulseGrad.addColorStop(0, 'rgba(255, 128, 0, 0.85)');
        pulseGrad.addColorStop(0.4, 'rgba(255, 128, 0, 0.35)');
        pulseGrad.addColorStop(1, 'rgba(255, 128, 0, 0)');

        ctx.beginPath();
        ctx.arc(cx, cy, 14, 0, Math.PI * 2);
        ctx.fillStyle = pulseGrad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#FF8000';
        ctx.fill();
      }

      // 3. Update & Draw Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;

          // Gentle bounds bounce
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
        }

        const currentOpacity = p.baseOpacity * (0.8 + 0.2 * Math.sin(tick * p.pulseSpeed + p.pulseOffset));

        ctx.beginPath();
        ctx.arc(p.x + parallaxX, p.y + parallaxY, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 128, 0, ${currentOpacity})`;
        ctx.fill();

        // Subtle glowing halo for larger particles
        if (p.radius > 2.2) {
          ctx.beginPath();
          ctx.arc(p.x + parallaxX, p.y + parallaxY, p.radius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 128, 0, ${currentOpacity * 0.25})`;
          ctx.fill();
        }
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isMobile]);

  return (
    <div 
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden select-none -z-10 transition-opacity duration-1000 ease-out"
    >
      {/* LAYER 1: Base Warm Pale Yellow Background Canvas */}
      <div className="absolute inset-0 bg-[#F9F4BC]" />

      {/* LAYER 2: Floating Soft Orange Ambient Orbs with slow motion & parallax */}
      <div 
        className="absolute inset-0 transition-transform duration-700 ease-out"
        style={{
          transform: `translate3d(${orbOffset.x}px, ${orbOffset.y}px, 0)`
        }}
      >
        {/* Top-Left Ambient Orb (Behind Branding & Illustration) */}
        <div 
          className="absolute -top-12 -left-20 w-[460px] h-[460px] rounded-full bg-gradient-to-br from-[#FF8000]/14 to-amber-300/18 blur-[85px] animate-ambient-float-1"
          style={{ animationDuration: '14s' }}
        />

        {/* Mid-Left Flow Orb (Behind Causal Pipeline) */}
        <div 
          className="absolute top-1/2 -left-10 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-tr from-[#FFA147]/12 to-amber-200/15 blur-[75px] animate-ambient-float-2"
          style={{ animationDuration: '16s', animationDelay: '2s' }}
        />

        {/* Bottom-Right Orb (Behind Edge of Page) */}
        <div 
          className="absolute -bottom-16 -right-16 w-[480px] h-[480px] rounded-full bg-gradient-to-tl from-[#FF8000]/12 to-amber-300/16 blur-[90px] animate-ambient-float-1"
          style={{ animationDuration: '18s', animationDelay: '4s' }}
        />

        {/* Top-Right Perimeter Soft Light */}
        <div 
          className="absolute top-8 right-1/4 w-72 h-72 rounded-full bg-gradient-to-b from-amber-300/10 to-orange-400/8 blur-[70px] animate-ambient-float-2"
          style={{ animationDuration: '13s', animationDelay: '1s' }}
        />
      </div>

      {/* LAYER 3: Animated Canvas Network with Particles, Connecting Lines, and Neural Flow Pulse */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}
