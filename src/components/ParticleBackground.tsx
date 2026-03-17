import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  pulseSpeed: number;
  pulseOffset: number;
  colorIndex: number;
}

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      const count = Math.min(
        120,
        Math.floor((canvas.width * canvas.height) / 10000)
      );
      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2.5 + 1,
        opacity: Math.random() * 0.4 + 0.4,
        pulseSpeed: Math.random() * 0.02 + 0.008,
        pulseOffset: Math.random() * Math.PI * 2,
        colorIndex: Math.floor(Math.random() * 3),
      }));
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("resize", resize);
    resize();

    const CONNECTION_DIST = 150;
    const MOUSE_DIST = 200;
    const MOUSE_REPEL = 120;
    let time = 0;

    const draw = () => {
      animRef.current = requestAnimationFrame(draw);
      time += 0.016;

      const isDark = document.documentElement.classList.contains("dark");
      const PARTICLE_COLORS = isDark
        ? ["139, 92, 246", "99, 102, 241", "168, 85, 247"]
        : ["92, 69, 192", "67, 56, 202", "126, 34, 206"];
      const LINE_COLOR = isDark ? "139, 92, 246" : "92, 69, 192";
      const MOUSE_COLOR = isDark ? "196, 181, 253" : "126, 34, 206";

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isDark) {
        ctx.fillStyle = "#0a0a0f";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const radial = ctx.createRadialGradient(cx, cy, 0, cx, cy, canvas.width * 0.7);
        radial.addColorStop(0, "rgba(99, 40, 180, 0.08)");
        radial.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      // Draw connections first (behind particles)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const d = Math.sqrt(dx * dx + dy * dy);

          if (d < CONNECTION_DIST) {
            const alpha = (1 - d / CONNECTION_DIST) * (isDark ? 0.4 : 0.5);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${LINE_COLOR}, ${alpha})`;
            ctx.lineWidth = isDark ? 0.7 : 0.9;
            ctx.stroke();
          }
        }

        // Mouse connections
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < MOUSE_DIST) {
          const alpha = (1 - mdist / MOUSE_DIST) * (isDark ? 0.7 : 0.5);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(${MOUSE_COLOR}, ${alpha})`;
          ctx.lineWidth = isDark ? 1 : 0.9;
          ctx.stroke();
        }
      }

      // Draw & update particles
      particles.forEach((p) => {
        // Mouse repulsion
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < MOUSE_REPEL && mdist > 0) {
          const force = (MOUSE_REPEL - mdist) / MOUSE_REPEL;
          p.vx += (mdx / mdist) * force * 0.5;
          p.vy += (mdy / mdist) * force * 0.5;
        }

        // Damping & clamp
        p.vx *= 0.97;
        p.vy *= 0.97;
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (spd > 2) { p.vx = (p.vx / spd) * 2; p.vy = (p.vy / spd) * 2; }

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        // Pulse
        const pulse = Math.sin(time * p.pulseSpeed * 60 + p.pulseOffset) * 0.2;
        const opacity = Math.min(1, Math.max(0.2, p.opacity + pulse));
        const color = PARTICLE_COLORS[p.colorIndex];

        const glowMult = isDark ? 1 : 0.9;
        const glowRadius = p.radius * 6;
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius);
        glow.addColorStop(0, `rgba(${color}, ${opacity * 0.6 * glowMult})`);
        glow.addColorStop(0.4, `rgba(${color}, ${opacity * 0.15 * glowMult})`);
        glow.addColorStop(1, `rgba(${color}, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${Math.min(1, opacity + (isDark ? 0.4 : 0.55))})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity * (isDark ? 0.8 : 0.5)})`;
        ctx.fill();
      });

      if (mouse.x > 0 && mouse.x < canvas.width && isDark) {
        const mglow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 100);
        mglow.addColorStop(0, "rgba(167, 139, 250, 0.12)");
        mglow.addColorStop(0.5, "rgba(139, 92, 246, 0.05)");
        mglow.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 100, 0, Math.PI * 2);
        ctx.fillStyle = mglow;
        ctx.fill();
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
};

export default ParticleBackground;
