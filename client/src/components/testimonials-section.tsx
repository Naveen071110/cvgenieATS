import { Star, ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Link } from "wouter";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { OptimizedImage, useResponsiveImageSizes } from "@/components/ui/optimized-image";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer",
    company: "TechCorp",
    avatar: "/images/avatars/sarah-chen",
    content: "CVGenie transformed my resume completely. I went from getting no responses to landing 3 interviews in just two weeks. The ATS optimization really works!",
    rating: 5,
    badge: "Landed Dream Job"
  },
  {
    name: "Marcus Rodriguez",
    role: "Product Manager",
    company: "StartupX",
    avatar: "/images/avatars/marcus-rodriguez",
    content: "The AI suggestions were spot-on. It highlighted experiences I didn't even think were relevant. My resume now tells a coherent story that recruiters love.",
    rating: 5,
    badge: "40% More Interviews"
  },
  {
    name: "Emily Zhang",
    role: "UX Designer",
    company: "DesignStudio",
    avatar: "/images/avatars/emily-zhang",
    content: "I was skeptical about AI resume tools, but CVGenie exceeded my expectations. The formatting is clean, professional, and ATS-friendly. Highly recommend!",
    rating: 5,
    badge: "Design Professional"
  },
  {
    name: "David Kim",
    role: "Data Scientist",
    company: "DataCorp",
    avatar: "/images/avatars/david-kim",
    content: "The keyword optimization feature is incredible. My resume now passes ATS filters I couldn't get through before. Worth every penny.",
    rating: 5,
    badge: "ATS Expert"
  },
  {
    name: "Lisa Thompson",
    role: "Marketing Director",
    company: "BrandAgency",
    avatar: "/images/avatars/lisa-thompson",
    content: "CVGenie helped me transition from marketing coordinator to director level. The AI understood how to position my experience for senior roles.",
    rating: 5,
    badge: "Career Growth"
  },
  {
    name: "Alex Johnson",
    role: "Full Stack Developer",
    company: "WebSolutions",
    avatar: "/images/avatars/alex-johnson",
    content: "As a developer, I appreciate the clean, logical structure CVGenie created. My technical skills are now presented in a way that non-technical recruiters understand.",
    rating: 5,
    badge: "Tech Professional"
  }
];

export default function TestimonialsSection() {
  const headerAnimation = useScrollAnimation({ threshold: 0.2 });
  const imageSizes = useResponsiveImageSizes();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div
          ref={headerAnimation.ref}
          className={`text-center mb-16 scroll-fade-in ${headerAnimation.isVisible ? 'visible' : ''}`}
        >
          <h2 className="typography-section-header text-slate-900 mb-4">
            Trusted by Job Seekers Worldwide
          </h2>
          <p className="typography-body text-slate-600 max-w-2xl mx-auto text-lg">
            See how CVGenie has helped professionals land their dream jobs
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {testimonials.map((testimonial, index) => {
              const testimonialAnimation = useScrollAnimation({ threshold: 0.2 });
              return (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <div
                    ref={testimonialAnimation.ref}
                    className={`bg-slate-50 rounded-2xl p-6 border border-slate-200 floating-card testimonial-fade-in ${
                      testimonialAnimation.isVisible ? 'visible' : ''
                    } h-full`}
                    style={{ animationDelay: `${(index % 3) * 0.2}s` }}
                  >
                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="typography-body text-slate-600 mb-6 leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center">
                      <div
                        className={`w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4 avatar-pop ${
                          testimonialAnimation.isVisible ? 'visible' : ''
                        }`}
                        style={{ animationDelay: `${(index % 3) * 0.2 + 0.3}s` }}
                      >
                        <OptimizedImage
                          src={testimonial.avatar}
                          alt={`${testimonial.name} avatar`}
                          width={64}
                          height={64}
                          sizes={imageSizes.avatar}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="typography-body font-semibold text-slate-900">{testimonial.name}</p>
                        <p className="typography-small text-slate-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>

        {/* Mobile scroll indicator */}
        <div className="flex justify-center mt-6 md:hidden">
          <p className="text-sm text-slate-500">← Swipe to see more →</p>
        </div>

        {/* CTA after testimonials */}
        <div className="text-center mt-16">
          <p className="text-lg text-slate-600 mb-6 max-w-2xl mx-auto">
            Join thousands of professionals who've already transformed their careers
          </p>
          <Link to="/generator">
            <button
              className="cta-primary group"
              aria-label="Join successful professionals - Start your free resume"
            >
              Start Free Today
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}