import { motion } from "framer-motion";
import { BookOpen, Users, FileText, Award, Clock, Shield } from "lucide-react";

const services = [
  {
    icon: BookOpen,
    title: "Academic Writing",
    description: "Professional essay writing, research papers, dissertations, and thesis assistance across all subjects.",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: Users,
    title: "Personal Tutoring",
    description: "One-on-one tutoring sessions with expert tutors in math, science, languages, and humanities.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: FileText,
    title: "Assignment Help",
    description: "Complete homework assistance, project guidance, and exam preparation for all academic levels.",
    gradient: "from-green-500 to-cyan-500",
  },
  {
    icon: Award,
    title: "Test Preparation",
    description: "Comprehensive SAT, ACT, GRE, GMAT, and other standardized test preparation programs.",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock customer support and instant help whenever you need academic assistance.",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: Shield,
    title: "Quality Guarantee",
    description: "100% plagiarism-free work with unlimited revisions and money-back guarantee.",
    gradient: "from-teal-500 to-cyan-500",
  },
];

export function Services() {
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
            Comprehensive Academic
            <span className="block bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Services
            </span>
          </h2>
          <p className="max-w-3xl mx-auto text-xl text-slate-300">
            From essay writing to test preparation, we provide complete academic support
            tailored to your needs and schedule.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-slate-600/50 transition-all duration-300">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${service.gradient} mb-6`}>
                  <service.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{service.title}</h3>
                <p className="text-slate-300 leading-relaxed">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}