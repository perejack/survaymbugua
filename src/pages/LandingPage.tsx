import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, Smartphone, TrendingUp, ChevronRight, Star } from "lucide-react";
import heroGroup from "@/assets/hero-group.jpg";
import heroPerson from "@/assets/hero-person.jpg";
import logo from "@/assets/logo.png";

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <img src={logo} alt="KaziQuest" className="h-8 w-8" />
            <span className="text-lg font-bold tracking-tight text-foreground">KaziQuest</span>
          </div>
          <button onClick={onGetStarted} className="rounded-full bg-primary text-primary-foreground px-5 py-2 text-sm font-semibold hover:brightness-105 transition-all active:scale-95">
            Get Started
          </button>
        </div>
      </header>

      {/* Hero - Vibrant Blue */}
      <section className="relative pt-16 overflow-hidden bg-gradient-to-br from-primary via-emerald-glow to-primary">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />

        <div className="relative max-w-6xl mx-auto px-4 pt-14 pb-10">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="flex-1 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-card/20 backdrop-blur-sm px-4 py-1.5 mb-6 border border-primary-foreground/20">
                <Star size={14} className="text-accent fill-accent" />
                <span className="text-xs font-semibold text-primary-foreground tracking-wide uppercase">Kenya's #1 Survey Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.04em] text-primary-foreground leading-[1.05]">
                Complete Tasks
                <br />
                <span className="text-accent">Earn Rewards.</span>
              </h1>

              <p className="mt-5 text-base sm:text-lg text-primary-foreground/80 max-w-md mx-auto lg:mx-0 leading-relaxed">
                Complete available tasks and earn rewards. Earnings vary by task and availability.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <button
                  onClick={onGetStarted}
                  className="rounded-2xl bg-accent text-accent-foreground px-8 py-4 text-base font-bold flex items-center justify-center gap-2 hover:brightness-105 transition-all active:scale-95 shadow-lg"
                >
                  Get Started
                  <ArrowRight size={18} />
                </button>
                <button
                  onClick={onGetStarted}
                  className="rounded-2xl bg-card/15 backdrop-blur-sm text-primary-foreground px-8 py-4 text-base font-semibold flex items-center justify-center gap-2 hover:bg-card/25 transition-colors border border-primary-foreground/20"
                >
                  <Zap size={18} />
                  See How It Works
                </button>
              </div>
            </motion.div>

            {/* Right - Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="flex-1 relative"
            >
              <div className="relative rounded-[28px] overflow-hidden shadow-2xl max-w-md mx-auto">
                <img src={heroGroup} alt="KaziQuest users earning money" className="w-full h-72 sm:h-80 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
              </div>

              {/* M-Pesa Payment Toast - Floating */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="absolute -bottom-6 -left-4 sm:left-0 max-w-[280px] bg-card rounded-2xl p-3.5 shadow-xl border border-border"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-[10px] text-primary-foreground">✓</span>
                  </div>
                  <span className="text-xs font-bold text-primary">M-Pesa Payment Sent!</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary">P</div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">Patrick Njoroge</p>
                      <p className="text-[10px] text-muted-foreground">Nyeri • 3 mins ago</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-primary tabular">KSh 2,000</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Disclaimer bar */}
        <div className="relative mt-10 py-2.5 bg-primary-foreground/10 backdrop-blur-sm border-t border-primary-foreground/10">
          <div className="max-w-6xl mx-auto px-4 flex items-center justify-center gap-1 text-[10px] sm:text-xs text-primary-foreground/70">
            <span>Subject to availability</span>
            <span>•</span>
            <span>Withdrawal eligibility requirements apply</span>
            <span>•</span>
            <span>Terms and conditions apply</span>
          </div>
        </div>

        {/* Trust badges */}
        <div className="relative py-4 bg-primary-foreground/5">
          <div className="max-w-6xl mx-auto px-4 flex items-center justify-center gap-6 sm:gap-10 text-xs text-primary-foreground/80 font-medium">
            <span className="flex items-center gap-1.5">🇰🇪 Kenya Based</span>
            <span className="flex items-center gap-1.5">📱 M-Pesa Supported</span>
            <span className="flex items-center gap-1.5">✅ Terms Apply</span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 tracking-tight text-foreground">
          Earn in <span className="text-gradient-primary">3 Simple Steps</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { step: "01", title: "Choose a Survey", desc: "Browse categories and pick a task that interests you", icon: Smartphone },
            { step: "02", title: "Select Answers", desc: "Tap your choices — no typing needed. Complete in 60 seconds", icon: TrendingUp },
            { step: "03", title: "Get Paid via M-Pesa", desc: "Earnings go straight to your wallet. Withdraw to M-Pesa anytime", icon: Shield },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="glass-card p-6 text-center hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <item.icon size={24} className="text-primary" />
              </div>
              <span className="text-xs font-bold text-primary tracking-widest">{item.step}</span>
              <h3 className="text-lg font-bold text-foreground mt-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Person */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <div className="glass-card overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-shadow">
          <div className="sm:w-1/2">
            <img src={heroPerson} alt="KaziQuest user" className="w-full h-64 sm:h-full object-cover" />
          </div>
          <div className="sm:w-1/2 p-8 flex flex-col justify-center">
            <span className="text-xs font-bold text-accent uppercase tracking-widest">Success Story</span>
            <h3 className="text-2xl font-bold mt-2 text-foreground">"I earned KSh 14,500 in my first month"</h3>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              KaziQuest lets me earn extra income during my matatu commute. It's easy — just tap answers and the money goes straight to M-Pesa.
            </p>
            <button onClick={onGetStarted} className="mt-6 flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all">
              Start Your Journey <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-secondary/50">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4">
          {[
            { value: "50K+", label: "Active Users" },
            { value: "KSh 12M+", label: "Paid Out" },
            { value: "60s", label: "Avg Survey Time" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl sm:text-4xl font-extrabold text-gradient-primary tabular">{stat.value}</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center border-t border-border">
        <p className="text-xs text-muted-foreground/60 mt-2">© 2026 KaziQuest. All rights reserved.</p>
      </footer>
    </div>
  );
}
