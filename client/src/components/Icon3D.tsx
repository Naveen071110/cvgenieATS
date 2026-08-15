import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface Icon3DProps {
  src: string;
  alt?: string;
  size?: number;
  disabled?: boolean;
  glowColor?: string;
  floatDelay?: number;
  className?: string;
}

/**
 * Dimensional icon: generated 3D glass asset with layered glow,
 * grounded shadow, idle float, and mouse-follow tilt.
 * Respects `disabled` (mobile / reduced motion) — renders static.
 */
export default function Icon3D({
  src,
  alt = "",
  size = 88,
  disabled = false,
  glowColor = "rgba(99, 102, 241, 0.45)",
  floatDelay = 0,
  className = "",
}: Icon3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-16, 16]), {
    stiffness: 200,
    damping: 18,
  });
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [14, -14]), {
    stiffness: 200,
    damping: 18,
  });

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
    return (
      <div className={`relative ${className}`} style={{ width: size, height: size }}>
        <div
          aria-hidden="true"
          className="absolute inset-2 rounded-full blur-xl opacity-60"
          style={{ background: glowColor }}
        />
        <img
          src={src}
          alt={alt}
          width={size}
          height={size}
          loading="lazy"
          decoding="async"
          className="relative z-10 w-full h-full object-contain"
        />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={`relative ${className}`}
      style={{ width: size, height: size, perspective: 600 }}
    >
      {/* ambient glow */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-1 rounded-full blur-2xl"
        style={{ background: glowColor }}
        animate={{ opacity: [0.45, 0.75, 0.45], scale: [1, 1.12, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: floatDelay }}
      />
      {/* grounded contact shadow */}
      <motion.div
        aria-hidden="true"
        className="absolute left-1/2 -bottom-2 h-2 rounded-full bg-black/25 dark:bg-black/50 blur-md"
        style={{ width: size * 0.6, x: "-50%" }}
        animate={{ scaleX: [1, 0.78, 1], opacity: [0.5, 0.28, 0.5] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: floatDelay }}
      />
      {/* the icon itself — floats + tilts */}
      <motion.div
        className="relative z-10 w-full h-full"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        <motion.img
          src={src}
          alt={alt}
          width={size}
          height={size}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-contain icon-3d-img"
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: floatDelay }}
        />
      </motion.div>
    </div>
  );
}
