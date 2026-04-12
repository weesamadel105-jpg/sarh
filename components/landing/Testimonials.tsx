import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Computer Science Student",
    university: "Stanford University",
    content: "Sarh helped me maintain a 4.0 GPA while working part-time. Their tutors are incredibly knowledgeable and always available when I need help.",
    rating: 5,
    avatar: "SJ",
  },
  {
    name: "Michael Chen",
    role: "Business Major",
    university: "Harvard Business School",
    content: "The quality of work is outstanding. I got an A+ on my thesis paper. The writing was flawless and the research was thorough.",
    rating: 5,
    avatar: "MC",
  },
  {
    name: "Emily Rodriguez",
    role: "Medical Student",
    university: "Johns Hopkins",
    content: "During my MCAT preparation, Sarh's tutors provided personalized strategies that boosted my score by 200 points. Highly recommend!",
    rating: 5,
    avatar: "ER",
  },
  {
    name: "David Kim",
    role: "Engineering Student",
    university: "MIT",
    content: "Their 24/7 support saved me during finals week. Complex calculus problems solved in minutes. Worth every penny.",
    rating: 5,
    avatar: "DK",
  },
  {
    name: "Lisa Thompson",
    role: "Law Student",
    university: "Yale Law School",
    content: "The legal research assistance was impeccable. Helped me with my constitutional law paper that earned me top marks in class.",
    rating: 5,
    avatar: "LT",
  },
  {
    name: "James Wilson",
    role: "MBA Student",
    university: "Wharton School",
    content: "Sarh's business case analysis service is professional-grade. Their insights helped me excel in my strategy courses.",
    rating: 5,
    avatar: "JW",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            What Our Students
            <span className="block bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Are Saying
            </span>
          </h2>
          <p className="max-w-3xl mx-auto text-xl text-slate-300">
            Join thousands of successful students who trust Sarh for their academic excellence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/50 transition-all duration-300">
                <Quote className="h-8 w-8 text-cyan-400 mb-4" />

                <p className="text-slate-300 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{testimonial.name}</h4>
                    <p className="text-sm text-slate-400">{testimonial.role}</p>
                    <p className="text-xs text-slate-500">{testimonial.university}</p>
                  </div>
                </div>

                <div className="flex gap-1 mt-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl px-6 py-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-white font-semibold ml-2">4.9/5</span>
            <span className="text-slate-400">from 2,500+ reviews</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}