
import { Star } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer",
    content: "CVGenie transformed my generic resume into a targeted masterpiece. I got 3 interview calls within a week of using it!",
    avatar: "SC"
  },
  {
    name: "Michael Rodriguez",
    role: "Marketing Manager", 
    content: "The cover letters are incredible! Each one feels personally written. I landed my current role thanks to CVGenie.",
    avatar: "MR"
  },
  {
    name: "Emily Johnson",
    role: "UX Designer",
    content: "As a career changer, I was struggling to present my transferable skills. CVGenie made it effortless!",
    avatar: "EJ"
  },
  {
    name: "David Park",
    role: "Data Scientist",
    content: "The ATS optimization feature is a game-changer. My resume now passes through filters and reaches real recruiters.",
    avatar: "DP"
  },
  {
    name: "Lisa Thompson",
    role: "Product Manager",
    content: "I've tried other resume builders, but CVGenie's AI understands context better than anything else out there.",
    avatar: "LT"
  },
  {
    name: "James Wilson",
    role: "Sales Director",
    content: "Generated 5 different versions of my resume for different industries. Each one perfectly tailored. Amazing!",
    avatar: "JW"
  },
  {
    name: "Ana Martinez",
    role: "HR Specialist",
    content: "As someone who reviews resumes daily, I can confirm CVGenie creates professional, compelling documents.",
    avatar: "AM"
  },
  {
    name: "Kevin Zhang",
    role: "Frontend Developer",
    content: "The technical skills section optimization helped me highlight my expertise perfectly. Got my dream job!",
    avatar: "KZ"
  }
];

export default function TestimonialsSection() {
  const headerAnimation = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div 
          ref={headerAnimation.ref}
          className={`text-center mb-16 scroll-fade-in ${headerAnimation.isVisible ? 'visible' : ''}`}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Trusted by Job Seekers Worldwide
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
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
                    <p className="text-slate-600 mb-6">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center">
                      <div 
                        className={`w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-semibold mr-4 avatar-pop ${
                          testimonialAnimation.isVisible ? 'visible' : ''
                        }`}
                        style={{ animationDelay: `${(index % 3) * 0.2 + 0.3}s` }}
                      >
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{testimonial.name}</p>
                        <p className="text-sm text-slate-500">{testimonial.role}</p>
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
      </div>
    </section>
  );
}
