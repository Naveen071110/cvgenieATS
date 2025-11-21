import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { LazyImage } from "@/components/LazyImage";

export default function TestimonialsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="relative py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-gray-900 overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="testimonial-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="2" fill="currentColor" className="text-primary" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#testimonial-pattern)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header with Animation */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Real People. Real Interview Success.
          </h2>
          <p className="text-xl font-semibold text-slate-700 dark:text-gray-200 max-w-3xl mx-auto leading-relaxed tracking-wide">
            Join thousands of professionals who transformed their job search with CVGenie
          </p>
        </div>

        {/* Coming Soon Placeholder */}
        <div className="max-w-[700px] mx-auto">
          <Card
            className={`relative overflow-hidden rounded-xl border border-slate-200/60 dark:border-slate-700/60 transition-all duration-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
            style={{ boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)' }}
          >
            {/* Subtle Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-white/30 to-slate-50/50 dark:from-slate-800/50 dark:via-slate-800/30 dark:to-slate-800/50" />

            <CardContent className="relative z-10 px-8 py-20 sm:px-10 sm:py-24 md:px-12 md:py-28 text-center">
              <div className="flex justify-center mb-6">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-8 h-8 text-yellow-400 fill-yellow-400 opacity-50"
                    />
                  ))}
                </div>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Success Stories Coming Soon
              </h3>

              <p className="text-lg text-slate-600 dark:text-gray-400 max-w-md mx-auto">
                We're collecting testimonials from professionals who've landed their dream jobs with CVGenie. Check back soon!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}