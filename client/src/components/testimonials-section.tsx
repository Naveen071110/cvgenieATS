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
    name: "Gaurav Singh",
    role: "Software Engineer",
    content:
      "CVGenie transformed my resume into a targeted masterpiece. I got 3 interview calls within a week of using it!",
    avatar: "GS",
  },
  {
    name: "Sarah Rodriguez",
    role: "Marketing Manager",
    content:
      "The cover letters are incredible! Each one feels personally written. I landed my current role thanks to CVGenie.",
    avatar: "SR",
  },
  {
    name: "Emily Winter",
    role: "UX Designer",
    content:
      "As a career changer, I was struggling to present my transferable skills. CVGenie made it effortless!",
    avatar: "EW",
  },
  {
    name: "David Greene",
    role: "Data Scientist",
    content:
      "The ATS optimization feature is a game-changer. My resume now passes through filters and reaches real recruiters.",
    avatar: "DG",
  },
];

export default function TestimonialsSection() {
  const headerAnimation = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-slate-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto">
        <div
          ref={headerAnimation.ref}
          className={`text-center mb-16 scroll-fade-in ${headerAnimation.isVisible ? "visible" : ""}`}
        >
          <h2 className="text-4xl font-bold text-slate-900 dark:text-gray-100 mb-6 font-heading">
            Real People. Real Interview Success.
          </h2>
          <p className="text-slate-600 dark:text-gray-400 max-w-2xl mx-auto text-lg font-body leading-relaxed">
            Discover how professionals like you went from overlooked to interview-ready
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
              const testimonialAnimation = useScrollAnimation({
                threshold: 0.2,
              });
              return (
                <CarouselItem
                  key={index}
                  className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <div
                    ref={testimonialAnimation.ref}
                    className={`bg-white dark:bg-gray-800 rounded-xl p-8 border border-slate-200 dark:border-gray-700 floating-card testimonial-fade-in ${
                      testimonialAnimation.isVisible ? "visible" : ""
                    } h-full flex flex-col shadow-sm hover:shadow-md transition-all`}
                    style={{ 
                      animationDelay: `${(index % 3) * 0.2}s`,
                      minHeight: '320px'
                    }}
                  >
                    <div className="flex items-center mb-6">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-gray-300 mb-auto leading-relaxed font-body flex-grow">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center mt-6 pt-6 border-t border-slate-100 dark:border-gray-700">
                      <div
                        className={`w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-blue-100 flex items-center justify-center mr-4 avatar-pop font-semibold text-primary ${
                          testimonialAnimation.isVisible ? "visible" : ""
                        }`}
                        style={{
                          animationDelay: `${(index % 3) * 0.2 + 0.3}s`,
                        }}
                      >
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-gray-100 font-heading">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-gray-400 font-body">
                          {testimonial.role}
                        </p>
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
        <div className="flex justify-center mt-4 md:hidden">
          <p className="text-sm text-slate-500 dark:text-gray-400">← Swipe to see more →</p>
        </div>
      </div>
    </section>
  );
}
