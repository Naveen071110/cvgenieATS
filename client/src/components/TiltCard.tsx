import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  maxTilt?: number;
  revealDelay?: number;
  glare?: boolean;
}

/**
 * 3D perspective tilt wrapper for cards. Mouse-follow tilt with a
 * moving glare highlight, plus a rise-into-view reveal.
 * Fully static when `disabled` (mobile / reduced motion).
 */
export default function TiltCard({
  children,
  className = "",
  disabled = false,
  maxTilt = 7,
  revealDelay = 0,
  glare = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-maxTilt, maxTilt]), {
    stiffness: 180,
    damping: 20,
  });
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [maxTilt, -maxTilt]), {
    stiffness: 180,
    damping: 20,
  });
  const glareX = useTransform(mx, [-0.5, 0.5], ["25%", "75%"]);
  const glareY = useTransform(my, [-0.5, 0.5], ["25%", "75%"]);
  const glareBg = useTransform([glareX, glareY], ([x, y]) =>
    `radial-gradient(320px circle at ${x} ${y}, rgba(255,255,255,0.22), transparent 65%)`
  );

  const handleMove = (e: React.MouseEvent) => {
    if (disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={className}
      initial={{ opacity: 0, y: 40, rotateX: 10, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay: revealDelay, ease: [0.21, 0.47, 0.32, 0.98] }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ y: -8, transition: { duration: 0.25 } }}
    >
      {children}
      {glare && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
          style={{ background: glareBg }}
        />
      )}
    </motion.div>
  );
}
