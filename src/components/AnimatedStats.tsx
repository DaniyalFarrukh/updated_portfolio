import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useInView, useTransform } from "framer-motion";

interface Stat {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
}

const stats: Stat[] = [
  { label: "Projects Built",     value: 10, suffix: "+" },
  { label: "Years Experience",   value: 2,  suffix: "+" },
  { label: "Certifications",     value: 1,  suffix: "" },
  { label: "Technologies",       value: 20, suffix: "+" },
];

function CountUp({ to, suffix = "", prefix = "" }: { to: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const raw = useMotionValue(0);
  const spring = useSpring(raw, { stiffness: 60, damping: 18 });
  const display = useTransform(spring, (v) => `${prefix}${Math.round(v)}${suffix}`);

  useEffect(() => {
    if (inView) raw.set(to);
  }, [inView, to, raw]);

  return (
    <span ref={ref}>
      <motion.span>{display}</motion.span>
    </span>
  );
}

export const AnimatedStats = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="py-14 border-y border-border/40 bg-card/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 14,
                delay: i * 0.12,
              }}
              className="flex flex-col items-center text-center gap-2 group"
            >
              <span className="text-4xl lg:text-5xl font-extrabold gradient-text tabular-nums">
                <CountUp to={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
              </span>
              <span className="text-sm text-muted-foreground font-medium uppercase tracking-widest">
                {stat.label}
              </span>
              <motion.div
                className="h-0.5 bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={inView ? { width: "40px" } : {}}
                transition={{ delay: i * 0.12 + 0.3, duration: 0.5 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
