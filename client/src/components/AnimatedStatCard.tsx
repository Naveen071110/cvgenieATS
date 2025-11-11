
import { useState, useEffect } from "react";

interface AnimatedStatCardProps {
  icon: React.ReactNode;
  value: number;
  suffix?: string;
  label: string;
  decimals?: number;
  shouldAnimate: boolean;
  className?: string;
}

// Animated counter hook
const useAnimatedCounter = (
  end: number,
  duration: number = 2000,
  shouldAnimate: boolean = false,
  decimals: number = 0
) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!shouldAnimate || hasAnimated) return;

    setHasAnimated(true);
    let startTime: number | null = null;
    const startValue = 0;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = startValue + (end - startValue) * easeOutQuart;

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, shouldAnimate, hasAnimated, decimals]);

  return count;
};

export default function AnimatedStatCard({
  icon,
  value,
  suffix = "",
  label,
  decimals = 0,
  shouldAnimate,
  className = "",
}: AnimatedStatCardProps) {
  const animatedValue = useAnimatedCounter(value, 2000, shouldAnimate, decimals);

  const displayValue =
    decimals > 0
      ? animatedValue.toFixed(decimals)
      : Math.floor(animatedValue);

  return (
    <div
      className={`bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 md:p-8 text-center border-2 border-white/20 dark:border-white/10 shadow-lg hover:shadow-xl hover:border-white/30 dark:hover:border-white/20 transition-all duration-300 hover:-translate-y-1 ${className}`}
      role="article"
      aria-label={`${label}: ${value}${suffix}`}
    >
      <div className="flex justify-center mb-4 text-white/90" aria-hidden="true">
        {icon}
      </div>
      <div
        className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2"
        aria-live="polite"
        aria-atomic="true"
      >
        {displayValue}
        {suffix}
      </div>
      <div className="text-sm md:text-base text-white/80 font-medium">
        {label}
      </div>
    </div>
  );
}
