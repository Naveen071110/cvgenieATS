
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface StatItem {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
}

interface StatsWidgetProps {
  className?: string;
  stats?: StatItem[];
}

const defaultStats: StatItem[] = [
  { value: 12847, label: 'Resumes Generated Today' },
  { value: 94, label: 'ATS Pass Rate', suffix: '%' },
  { value: 100, label: 'Total Users', suffix: '+' },
  { value: 98, label: 'User Satisfaction', suffix: '%' }
];

function AnimatedCounter({ 
  targetValue, 
  duration = 2000, 
  prefix = '', 
  suffix = '' 
}: { 
  targetValue: number; 
  duration?: number; 
  prefix?: string; 
  suffix?: string; 
}) {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = 0;
    
    const updateValue = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const value = Math.floor(startValue + (targetValue - startValue) * easeOutQuart);
      
      setCurrentValue(value);
      
      if (progress < 1) {
        requestAnimationFrame(updateValue);
      }
    };
    
    const timer = setTimeout(updateValue, 100);
    return () => clearTimeout(timer);
  }, [targetValue, duration]);

  return (
    <span className="tabular-nums">
      {prefix}{currentValue.toLocaleString()}{suffix}
    </span>
  );
}

export function StatsWidget({ className, stats = defaultStats }: StatsWidgetProps) {
  return (
    <div className={cn('stats-widget', className)}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="stat text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className="text-2xl md:text-3xl font-bold text-white mb-1">
              <AnimatedCounter 
                targetValue={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
                duration={2000 + index * 200}
              />
            </div>
            <div className="text-white/80 text-xs md:text-sm font-medium">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
