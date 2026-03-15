import { motion } from "framer-motion";
import {
  Bell,
  ChevronRight,
  Clock,
  Crown,
  CreditCard,
  Film,
  HeartPulse,
  Search,
  Shirt,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Utensils,
  Wallet,
  Bus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { categories, surveyTasks } from "@/lib/surveyData";
import { useAuth } from "@/lib/AuthContext";

interface HomePageProps {
  profile: { name: string; phone: string; email: string; avatar: string; tier: "free" | "starter" | "pro" | "elite"; balance: number; totalEarned: number; completedSurveys: number; joinDate: string; };
  completedTaskIds: Set<string>;
  onNavigate: (page: string) => void;
  onSelectCategory: (catId: string) => void;
  onStartTask: (taskId: string) => void;
}

export default function HomePage({ profile, completedTaskIds, onNavigate, onSelectCategory, onStartTask }: HomePageProps) {
  const { profile: authProfile, balance } = useAuth();
  const availableTasks = surveyTasks.filter(t => !completedTaskIds.has(t.id));
  const freeSurveys = availableTasks.filter(t => !t.isPremium);
  const premiumSurveys = availableTasks.filter(t => t.isPremium);

  // Use auth data if available
  const displayName = authProfile?.full_name || profile?.name || "User";
  const displayBalance = balance ?? profile?.balance ?? 0;
  const completedCount = completedTaskIds?.size ?? profile?.completedSurveys ?? 0;

  const categoryUi: Record<string, { icon: LucideIcon; image: string; accent: string }> = {
    food: { icon: Utensils, image: "https://www.millerkaplan.com/wp-content/uploads/2018/12/shutterstock_672436372-1.jpg", accent: "from-orange-500/20 via-amber-500/10 to-transparent" },
    tech: { icon: Smartphone, image: "https://bernardmarr.com/wp-content/uploads/2022/04/The-10-Biggest-Technology-Trends-That-Will-Transform-The-Next-Decade.jpg", accent: "from-sky-500/20 via-cyan-500/10 to-transparent" },
    fashion: { icon: Shirt, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKBEyJ3DJfk_XaKfuPAwHCDDrJ-jqxvPGKJw&s", accent: "from-fuchsia-500/20 via-pink-500/10 to-transparent" },
    finance: { icon: Wallet, image: "https://www.safaricom.co.ke/images/calendars/m-pesa-go-banner.png", accent: "from-emerald-500/20 via-lime-500/10 to-transparent" },
    transport: { icon: Bus, image: "/category-transport.svg", accent: "from-violet-500/20 via-indigo-500/10 to-transparent" },
    entertainment: { icon: Film, image: "/category-entertainment.svg", accent: "from-red-500/20 via-rose-500/10 to-transparent" },
    health: { icon: HeartPulse, image: "/category-health.svg", accent: "from-teal-500/20 via-emerald-500/10 to-transparent" },
    shopping: { icon: ShoppingCart, image: "/category-shopping.svg", accent: "from-blue-500/20 via-indigo-500/10 to-transparent" },
  };

  return (
    <div className="pb-24 min-h-screen">
      {/* Top Bar */}
      <div className="px-4 pt-4 pb-4 flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">Welcome back</p>
          <h1 className="text-xl font-extrabold text-foreground tracking-tight truncate">{displayName}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="w-10 h-10 glass-inner bg-muted flex items-center justify-center"
            aria-label="Search"
          >
            <Search size={18} className="text-muted-foreground" />
          </button>
          <button
            className="w-10 h-10 glass-inner bg-muted flex items-center justify-center"
            aria-label="Notifications"
          >
            <Bell size={18} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Balance Hero */}
      <div className="px-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl p-5 glass-card"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/15 rounded-full blur-2xl" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/10 rounded-full blur-2xl" />
          </div>

          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Available Balance</p>
                <h2 className="mt-2 text-4xl font-extrabold tracking-tight tabular text-foreground">
                  <span className="text-muted-foreground text-xl">KSH</span> {displayBalance.toLocaleString()}.00
                </h2>
              </div>
              <div className="glass-inner bg-muted px-3 py-2 flex items-center gap-2">
                <CreditCard size={16} className="text-primary" />
                <span className="text-xs font-bold text-foreground">Instant</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { label: "Completed", value: completedCount },
                { label: "Tier", value: (profile?.tier || "free").toUpperCase() },
                { label: "Today", value: "New" },
              ].map((stat, i) => (
                <div key={i} className="glass-inner bg-muted/40 p-3 text-center">
                  <p className="text-base font-extrabold text-foreground tabular">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => onNavigate("wallet")}
                className="flex-1 glass-inner bg-primary text-primary-foreground py-3.5 text-sm font-extrabold active:scale-95 transition-transform"
              >
                Withdraw
              </button>
              <button
                onClick={() => onNavigate("premium")}
                className="glass-inner bg-muted px-4 py-3.5"
                aria-label="Upgrade"
              >
                <Sparkles size={18} className="text-accent" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Section: Premium Surveys */}
      {premiumSurveys.length > 0 && (
        <div className="px-4 mb-7">
          <div className="flex items-center justify-between mb-3">
            <div className="min-w-0">
              <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
                <Crown size={16} className="text-yellow-500" />
                Premium Surveys
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">Unlock higher rewards with a package</p>
            </div>
            <button
              onClick={() => onNavigate("premium")}
              className="text-xs font-bold text-yellow-700 bg-yellow-500/10 px-3 py-2 glass-inner"
            >
              View Packages
            </button>
          </div>
          <div className="space-y-3">
            {premiumSurveys.slice(0, 3).map((task, i) => {
              const cat = categories.find(c => c.id === task.categoryId);
              const ui = categoryUi[task.categoryId];
              const Icon = ui?.icon;
              return (
                <motion.button
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => onNavigate("premium")}
                  className="w-full overflow-hidden glass-card-sm p-0 text-left hover:bg-secondary transition-colors active:scale-[0.98] border border-yellow-500/20"
                >
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-yellow-500/10 flex items-center justify-center">
                        {Icon ? <Icon size={18} className="text-yellow-600" /> : <Crown size={18} className="text-yellow-600" />}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-foreground truncate">{task.title}</h3>
                        <p className="text-xs text-muted-foreground">{cat?.name} • {task.duration}</p>
                      </div>
                    </div>
                    <div className="glass-inner bg-yellow-500/10 px-3 py-1.5">
                      <span className="text-xs font-extrabold text-yellow-700 tabular">+{task.reward} KSH</span>
                    </div>
                  </div>
                  <div className={`h-1 w-full bg-gradient-to-r ${categoryUi[task.categoryId]?.accent || "from-yellow-500/20 via-yellow-500/10 to-transparent"}`} />
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Section: Available Surveys */}
      <div className="px-4 mb-7">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
              <Clock size={16} className="text-primary" />
              Available Surveys
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">Quick tasks you can do right now</p>
          </div>
          <button onClick={() => onNavigate("home")} className="text-xs text-primary font-bold flex items-center gap-1">
            See all <ChevronRight size={14} />
          </button>
        </div>
        <div className="space-y-3">
          {freeSurveys.length === 0 ? (
            <div className="text-center py-10 glass-card-sm">
              <p className="text-muted-foreground text-sm">All free surveys completed!</p>
            </div>
          ) : (
            freeSurveys.slice(0, 6).map((task, i) => {
              const cat = categories.find(c => c.id === task.categoryId);
              const ui = categoryUi[task.categoryId];
              const Icon = ui?.icon;
              return (
                <motion.button
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => onStartTask(task.id)}
                  className="w-full glass-card-sm p-4 text-left hover:bg-secondary transition-colors active:scale-[0.98]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center">
                        {Icon ? <Icon size={18} className="text-primary" /> : <Clock size={18} className="text-primary" />}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-extrabold text-foreground truncate">{task.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{cat?.name} • {task.duration} • {task.questions} Q</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="glass-inner bg-primary/10 px-3 py-1.5">
                        <span className="text-xs font-extrabold text-primary tabular">+{task.reward} KSH</span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="px-4">
        <div className="flex items-end justify-between mb-3">
          <div>
            <h2 className="text-base font-extrabold text-foreground">Browse Categories</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Pick a topic and start earning</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat, i) => {
            const ui = categoryUi[cat.id];
            const Icon = ui?.icon;
            return (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => onSelectCategory(cat.id)}
                className="relative overflow-hidden rounded-3xl glass-card-sm p-0 text-left hover:bg-secondary transition-colors active:scale-[0.98]"
              >
                <div className="relative p-4 min-h-[140px]">
                  <div className="absolute inset-0">
                    <img src={ui?.image} alt={cat.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="relative h-full flex flex-col justify-between">
                    <div className="w-10 h-10 rounded-2xl glass-inner bg-muted/40 flex items-center justify-center">
                      {Icon ? <Icon size={18} className="text-foreground" /> : <Sparkles size={18} className="text-foreground" />}
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-foreground leading-tight drop-shadow-sm">{cat.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1 drop-shadow-sm">{cat.taskCount} tasks</p>
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
