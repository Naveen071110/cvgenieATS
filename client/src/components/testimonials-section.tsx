import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer",
    content: "CVGenie transformed my generic resume into a targeted masterpiece. I got 3 interview calls within a week of using it!"
  },
  {
    name: "Michael Rodriguez",
    role: "Marketing Manager", 
    content: "The cover letters are incredible! Each one feels personally written. I landed my current role thanks to CVGenie."
  },
  {
    name: "Emily Johnson",
    role: "UX Designer",
    content: "As a career changer, I was struggling to present my transferable skills. CVGenie made it effortless!"
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Trusted by Job Seekers Worldwide
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            See how CVGenie has helped professionals land their dream jobs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 floating-card">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-slate-600 mb-4">
                "{testimonial.content}"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full mr-4 bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{testimonial.name}</p>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
