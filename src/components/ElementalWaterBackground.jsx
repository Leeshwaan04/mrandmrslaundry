import React, { useEffect, useRef } from 'react';

/**
 * ElementalWaterBackground
 * Inspired by ThreeUI Elements — Water (https://threeui.com/backgrounds/elements/elemental-water)
 * Features:
 * - Pointer-driven circular ripples with harmonic wave propagation & decay
 * - Autonomous ambient water droplets creating gentle concentric ripples
 * - Cyan depth refraction, specular caustic crests, and caustic lighting
 * - Soft suspended underwater micro-bubbles & buoyant motes
 * - ZERO external brand marks (pure organic liquid water)
 */
export default function ElementalWaterBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.clientWidth);
    let height = (canvas.height = canvas.clientHeight);

    // Ripple state list
    // Each ripple: { x, y, radius, maxRadius, speed, amplitude, decay, birth }
    const ripples = [];
    const maxRipples = 16;

    // Suspended floating water motes / bubbles
    const bubbleCount = 45;
    const bubbles = Array.from({ length: bubbleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 0.8,
      speedY: Math.random() * 0.4 + 0.15,
      speedX: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.5 + 0.2,
      wobbleSpeed: Math.random() * 0.03 + 0.01,
      wobbleOffset: Math.random() * Math.PI * 2,
    }));

    let animationFrameId;
    let lastTime = performance.now();
    let lastAmbientDrop = performance.now();

    const addRipple = (x, y, maxR = 280, amp = 1.0) => {
      if (ripples.length >= maxRipples) {
        ripples.shift();
      }
      ripples.push({
        x,
        y,
        radius: 0,
        maxRadius: maxR,
        speed: 140, // pixels per second
        amplitude: amp,
        decay: 0.65,
        birth: performance.now(),
      });
    };

    // Pointer event handlers
    let lastMoveTime = 0;
    const handlePointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const now = performance.now();
      if (now - lastMoveTime > 75) {
        lastMoveTime = now;
        addRipple(x, y, 220, 0.75);
      }
    };

    const handlePointerDown = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      addRipple(x, y, 360, 1.4);
    };

    window.addEventListener('resize', () => {
      if (!canvas) return;
      width = canvas.width = canvas.clientWidth;
      height = canvas.height = canvas.clientHeight;
    });

    const heroEl = canvas.closest('#hero-section') || canvas.parentElement || window;
    heroEl.addEventListener('pointermove', handlePointerMove, { passive: true });
    heroEl.addEventListener('pointerdown', handlePointerDown, { passive: true });

    // Animation Loop
    const render = (time) => {
      animationFrameId = requestAnimationFrame(render);
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      // Spawn periodic gentle ambient water drops
      if (time - lastAmbientDrop > 2200) {
        lastAmbientDrop = time;
        const dropX = width * (0.15 + Math.random() * 0.7);
        const dropY = height * (0.2 + Math.random() * 0.6);
        addRipple(dropX, dropY, 300, 0.85);
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Draw Deep Cyan Fluid Caustic Ambient Gradients
      const ambientGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.45,
        50,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.65
      );
      ambientGrad.addColorStop(0, 'rgba(0, 113, 227, 0.12)');
      ambientGrad.addColorStop(0.4, 'rgba(41, 151, 255, 0.08)');
      ambientGrad.addColorStop(0.7, 'rgba(0, 229, 255, 0.04)');
      ambientGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = ambientGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Render Suspended Bubbles / Fluid Motes
      ctx.save();
      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i];
        b.y -= b.speedY;
        b.x += b.speedX + Math.sin(time * b.wobbleSpeed + b.wobbleOffset) * 0.3;

        if (b.y < -10) {
          b.y = height + 10;
          b.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 210, 255, ${b.opacity * 0.7})`;
        ctx.shadowColor = 'rgba(0, 229, 255, 0.4)';
        ctx.shadowBlur = 6;
        ctx.fill();
      }
      ctx.restore();

      // 3. Render Circular Water Ripples with Caustic Specular Refraction
      ctx.save();
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        const age = (time - r.birth) / 1000;
        r.radius += r.speed * dt;

        const progress = r.radius / r.maxRadius;
        if (progress >= 1.0) {
          ripples.splice(i, 1);
          continue;
        }

        const currentOpacity = Math.max(0, (1 - progress) * r.amplitude * 0.7);

        // Draw multiple harmonic wavefronts per ripple
        const wavesCount = 3;
        for (let w = 0; w < wavesCount; w++) {
          const waveRadius = r.radius - w * 16;
          if (waveRadius <= 0) continue;

          const waveOpacity = currentOpacity * (1 - w * 0.28);

          // Caustic cyan outer ring
          ctx.beginPath();
          ctx.arc(r.x, r.y, waveRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(41, 151, 255, ${waveOpacity * 0.6})`;
          ctx.lineWidth = 3.5 - w * 0.8;
          ctx.stroke();

          // Bright specular crest highlight (light refraction edge)
          ctx.beginPath();
          ctx.arc(r.x, r.y, waveRadius + 1.2, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(200, 245, 255, ${waveOpacity * 0.85})`;
          ctx.lineWidth = 1.2;
          ctx.shadowColor = 'rgba(0, 229, 255, 0.8)';
          ctx.shadowBlur = 8;
          ctx.stroke();
        }

        // Inner caustic refraction glow pool
        const poolGrad = ctx.createRadialGradient(
          r.x,
          r.y,
          Math.max(0, r.radius * 0.4),
          r.x,
          r.y,
          r.radius
        );
        poolGrad.addColorStop(0, `rgba(0, 229, 255, 0)`);
        poolGrad.addColorStop(0.7, `rgba(41, 151, 255, ${currentOpacity * 0.12})`);
        poolGrad.addColorStop(1, `rgba(100, 210, 255, 0)`);

        ctx.fillStyle = poolGrad;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (heroEl) {
        heroEl.removeEventListener('pointermove', handlePointerMove);
        heroEl.removeEventListener('pointerdown', handlePointerDown);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2,
        mixBlendMode: 'screen',
      }}
    />
  );
}
