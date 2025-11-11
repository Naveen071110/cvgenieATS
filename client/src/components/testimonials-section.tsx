import { Star, CheckCircle, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Import Avatar components
import { Briefcase } from "lucide-react"; // Import Briefcase icon

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Software Engineer",
    company: "Tech Corp",
    image: null, // Will use fallback avatar
    verified: true,
    rating: 5,
    quote: "CVGenie transformed my resume completely. I went from zero callbacks to three interview invitations in just one week. The ATS optimization really works!",
  },
];

// Generate avatar color based on name
const getAvatarColor = (name: string) => {
  const colors = [
    "from-blue-500 to-purple-500",
    "from-purple-500 to-pink-500",
    "from-pink-500 to-rose-500",
    "from-teal-500 to-cyan-500",
    "from-indigo-500 to-blue-500",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

// Get initials from name
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

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

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 max-w-[700px] mx-auto gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className={`relative overflow-hidden rounded-xl border border-slate-200/60 dark:border-slate-700/60 transition-all duration-700 hover:scale-[1.02] hover:shadow-xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${index * 150}ms`, boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)' }}
            >
              {/* Subtle Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-white/30 to-slate-50/50 dark:from-slate-800/50 dark:via-slate-800/30 dark:to-slate-800/50" />

              {/* Very Subtle Border Accent */}
              <div className="absolute inset-0 border border-transparent bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-pink-400/10 rounded-xl" 
                style={{ WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude', padding: '1px' }} 
              />

              <CardContent className="relative z-10 px-8 py-12 sm:px-10 sm:py-14 md:px-12 md:py-16">
                {/* Testimonial Quote - Reduced Size */}
                <blockquote className="mb-8">
                  <p className="text-base font-normal text-slate-800 dark:text-gray-100 leading-relaxed tracking-normal">
                    "{testimonial.quote}"
                  </p>
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center gap-4">
                  {/* Avatar with Verified Badge */}
                  <div className="relative flex-shrink-0">
                    <div
                      className={`w-14 h-14 rounded-full bg-gradient-to-br ${getAvatarColor(
                        testimonial.name
                      )} flex items-center justify-center text-white font-bold text-lg shadow-lg border-2 border-white dark:border-gray-700`}
                    >
                      {getInitials(testimonial.name)}
                    </div>
                    {testimonial.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-0.5 shadow-md">
                        <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 fill-current" />
                      </div>
                    )}
                  </div>

                  {/* Name, Role - Reduced Sizes */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="font-semibold text-slate-900 dark:text-white text-[0.95rem] truncate">
                      {testimonial.name}
                    </p>
                    <p className="text-[0.85rem] text-slate-600 dark:text-gray-400 truncate">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        </div>
    </section>
  );
}