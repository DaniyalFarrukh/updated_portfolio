import { useRef, ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

export const TiltCard = ({
  children,
  className = "",
  intensity = 12,
}: TiltCardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [intensity, -intensity]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-intensity, intensity]), {
    stiffness: 200,
    damping: 20,
  });

  const glareX = useTransform(rawX, [-0.5, 0.5], ["-30%", "130%"]);
  const glareY = useTransform(rawY, [-0.5, 0.5], ["-30%", "130%"]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    rawX.set((e.clientX - left) / width - 0.5);
    rawY.set((e.clientY - top) / height - 0.5);
  }

  function handleMouseLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 800,
      }}
      className={`relative ${className}`}
    >
      {/* Glare overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-xl overflow-hidden z-10"
        style={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="absolute w-40 h-40 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)",
            left: glareX,
            top: glareY,
            transform: "translate(-50%, -50%)",
          }}
        />
      </motion.div>

      <div style={{ transform: "translateZ(0px)" }}>{children}</div>
    </motion.div>
  );
};
