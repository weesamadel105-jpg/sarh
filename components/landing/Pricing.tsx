import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/shared/Button";

const plans = [
  {
    name: "Basic",
    price: "$29",
    period: "per semester",
    description: "Perfect for occasional academic help",
    features: [
      "5 assignments per month",
      "Basic essay writing",
      "Email support",
      "File upload (up to 5MB)",
      "Basic plagiarism check",
    ],
    popular: false,
    gradient: "from-slate-600 to-slate-700",
  },
  {
    name: "Pro",
    price: "$59",
    period: "per semester",
    description: "Most popular choice for regular students",
    features: [
      "15 assignments per month",
      "Advanced essay & research papers",
      "Priority email support",
      "File upload (up to 50MB)",
      "Advanced plagiarism check",
      "One-on-one tutoring (2 hours)",
      "Progress tracking",
    ],
    popular: true,
    gradient: "from-cyan-500 to-purple-600",
  },
  {
    name: "Premium",
    price: "$99",
    period: "per semester",
    description: "Complete academic support package",
    features: [
      "Unlimited assignments",
      "All academic writing services",
      "24/7 priority support",
      "Unlimited file uploads",
      "Premium plagiarism check",
      "Weekly tutoring sessions (4 hours)",
      "Progress tracking & analytics",
      "Dedicated account manager",
      "Test preparation included",
    ],
    popular: false,
    gradient: "from-purple-500 to-pink-600",
  },
];

export function Pricing() {
  return (
    <section className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Semester
            <span className="block bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Subscription Plans
            </span>
          </h2>
          <p className="max-w-3xl mx-auto text-xl text-slate-300">
            Choose the perfect plan for your academic needs. All plans include our
            premium quality guarantee and 24/7 support.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative group ${plan.popular ? 'lg:scale-105' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className={`relative bg-slate-800/50 backdrop-blur-sm border rounded-2xl p-8 h-full transition-all duration-300 ${
                plan.popular
                  ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                  : 'border-slate-700/50 hover:border-slate-600/50'
              }`}>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-slate-400">{plan.period}</span>
                  </div>
                  <p className="text-slate-300">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                      : 'bg-slate-700 hover:bg-slate-600 text-white'
                  }`}
                >
                  Get Started
                </Button>
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
          <p className="text-slate-400 mb-4">
            All plans include a 30-day money-back guarantee
          </p>
          <p className="text-sm text-slate-500">
            Prices are billed per semester. Cancel anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}