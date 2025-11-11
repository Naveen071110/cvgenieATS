
import { Star, CheckCircle, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";

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
  {
    id: 2,
    name: "Michael Chen",
    role: "Product Manager",
    company: "Innovation Labs",
    image: null,
    verified: true,
    rating: 5,
    quote: "The AI-powered cover letters are incredible. Each one felt personalized and professional. I landed my dream job at a Fortune 500 company!",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Marketing Director",
    company: "Growth Agency",
    image: null,
    verified: true,
    rating: 5,
    quote: "I was skeptical at first, but the results speak for themselves. My resume now passes ATS filters and actually gets read by recruiters. Worth every penny!",
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className={`relative overflow-hidden border-2 transition-all duration-700 hover:scale-105 hover:shadow-2xl ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Premium Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#5A5AFF]/10 via-[#7B68EE]/10 to-[#A259FF]/10 dark:from-[#5A5AFF]/20 dark:via-[#7B68EE]/20 dark:to-[#A259FF]/20" />
              
              {/* Subtle Border Glow */}
              <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-br from-[#5A5AFF]/30 via-[#7B68EE]/30 to-[#A259FF]/30 dark:from-[#5A5AFF]/40 dark:via-[#7B68EE]/40 dark:to-[#A259FF]/40 rounded-lg" 
                style={{ WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude', padding: '2px' }} 
              />

              <CardContent className="relative z-10 p-8">
                {/* Star Rating with Glow */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400 transition-all duration-300 hover:scale-125 hover:drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]"
                      style={{
                        filter: "drop-shadow(0 0 4px rgba(250, 204, 21, 0.4))",
                      }}
                    />
                  ))}
                </div>

                {/* Testimonial Quote */}
                <blockquote className="mb-6">
                  <p className="text-base font-medium text-white dark:text-white leading-relaxed tracking-wide">
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

                  {/* Name, Role, Company */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white text-base truncate">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-slate-700 dark:text-gray-300 truncate">
                      {testimonial.role}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-500 dark:text-gray-400 flex-shrink-0" />
                      <p className="text-xs text-slate-600 dark:text-gray-400 truncate">
                        {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Footer */}
        <div
          className={`text-center mt-16 transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-slate-600 dark:text-gray-400 text-sm font-medium">
            ⭐ Trusted by 10,000+ professionals worldwide
          </p>
        </div>
      </div>
    </section>
  );
}
