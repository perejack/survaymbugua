import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Lock } from "lucide-react";
import { categories, surveyTasks } from "@/lib/surveyData";
import { UserProfile } from "@/lib/useAppState";

interface TasksPageProps {
  profile: UserProfile;
  completedTaskIds: Set<string>;
  selectedCategory: string | null;
  onBack: () => void;
  onStartTask: (taskId: string) => void;
}

export default function TasksPage({ profile, completedTaskIds, selectedCategory, onBack, onStartTask }: TasksPageProps) {
  const [activeCat, setActiveCat] = useState(selectedCategory || "all");
  
  const filteredTasks = activeCat === "all"
    ? surveyTasks
    : surveyTasks.filter(t => t.categoryId === activeCat);

  return (
    <div className="pb-24 min-h-screen">
      <div className="px-4 pt-4 pb-3 flex items-center gap-3">
        <button onClick={onBack} className="w-9 h-9 glass-inner bg-muted flex items-center justify-center">
          <ArrowLeft size={18} className="text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Available Tasks</h1>
      </div>

      {/* Category Chips */}
      <div className="px-4 mb-4 overflow-x-auto flex gap-2 pb-1 scrollbar-hide">
        <button
          onClick={() => setActiveCat("all")}
          className={`shrink-0 glass-inner px-4 py-2 text-xs font-semibold transition-colors ${
            activeCat === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCat(cat.id)}
            className={`shrink-0 glass-inner px-4 py-2 text-xs font-semibold transition-colors ${
              activeCat === cat.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Tasks */}
      <div className="px-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredTasks.map((task, i) => {
            const cat = categories.find(c => c.id === task.categoryId);
            const completed = completedTaskIds.has(task.id);
            const locked = task.isPremium && profile.tier === "free";

            return (
              <motion.button
                key={task.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => !completed && !locked && onStartTask(task.id)}
                disabled={completed || locked}
                className={`w-full glass-card-sm p-4 flex items-center justify-between text-left transition-colors active:scale-[0.98] ${
                  completed ? "opacity-50" : locked ? "opacity-70" : "hover:bg-secondary"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl ${
                    task.isPremium ? "bg-accent/10" : "bg-primary/10"
                  }`}>
                    {locked ? <Lock size={18} className="text-accent" /> : cat?.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      {task.title}
                      {task.isPremium && (
                        <span className="text-[10px] font-bold bg-accent/20 text-accent px-2 py-0.5 rounded-full">PREMIUM</span>
                      )}
                      {completed && (
                        <span className="text-[10px] font-bold bg-primary/20 text-primary px-2 py-0.5 rounded-full">DONE</span>
                      )}
                    </h3>
                    <p className="text-xs text-muted-foreground">{task.duration} • {task.questions} Questions</p>
                  </div>
                </div>
                <div className={`glass-inner px-3 py-1.5 ${
                  task.isPremium ? "bg-accent/10" : "bg-primary/10"
                }`}>
                  <span className={`text-xs font-bold tabular ${task.isPremium ? "text-accent" : "text-primary"}`}>
                    +{task.reward} KSH
                  </span>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
