import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, PartyPopper, Loader2 } from "lucide-react";
import { surveyTasks, getQuestionsForTask } from "@/lib/surveyData";
import PulseProgress from "@/components/PulseProgress";
import { useDatabase } from "@/lib/useDatabase";
import { toast } from "sonner";

interface SurveyPageProps {
  taskId: string;
  onComplete: (taskId: string, reward: number, answers: Record<string, string>) => void;
  onClose: () => void;
}

export default function SurveyPage({ taskId, onComplete, onClose }: SurveyPageProps) {
  const { completeSurvey, completedSurveyIds } = useDatabase();
  const task = surveyTasks.find(t => t.id === taskId);
  const questions = task ? getQuestionsForTask(taskId) : [];
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if already completed
  const alreadyCompleted = completedSurveyIds.has(taskId);

  const handleSelect = async (option: string) => {
    const newAnswers = { ...answers, [questions[currentQ].id]: option };
    setAnswers(newAnswers);

    setTimeout(async () => {
      if (currentQ < questions.length - 1) {
        setCurrentQ(prev => prev + 1);
      } else {
        // All questions answered - submit to database
        setIsSubmitting(true);
        setError(null);
        
        if (task) {
          const { success, error: submitError } = await completeSurvey(taskId, task.reward, newAnswers);
          
          if (success) {
            setShowSuccess(true);
            setTimeout(() => {
              onComplete(taskId, task.reward, newAnswers);
            }, 2500);
          } else {
            setError(submitError || "Failed to submit survey");
            toast.error(submitError || "Failed to submit survey");
          }
        }
        setIsSubmitting(false);
      }
    }, 400);
  };

  // Show already completed screen
  if (alreadyCompleted && !showSuccess) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex items-center justify-center px-5">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-5">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}>
            <CheckCircle2 size={80} className="text-green-500 mx-auto" />
          </motion.div>
          <h1 className="text-2xl font-extrabold text-foreground">Already Completed! ✅</h1>
          <p className="text-muted-foreground">You've already completed this survey.</p>
          <p className="text-sm text-muted-foreground">Each survey can only be completed once.</p>
          <button onClick={onClose} className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-semibold">
            Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Survey not found</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center px-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6"
          >
            <PartyPopper size={36} className="text-primary" />
          </motion.div>
          <h1 className="text-2xl font-extrabold text-foreground">Quest Complete! 🎉</h1>
          <p className="text-muted-foreground mt-2">You've earned</p>
          <motion.p
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.4 }}
            className="text-4xl font-extrabold text-gradient-primary mt-2 tabular"
          >
            +{task.reward} KSH
          </motion.p>
          <p className="text-xs text-muted-foreground mt-4">Wallet updated. Keep earning!</p>
          <button
            onClick={onClose}
            className="mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold text-sm"
          >
            Continue Earning
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h2 className="text-sm font-bold text-foreground">{task.title}</h2>
        <button onClick={onClose} className="w-9 h-9 glass-inner bg-muted flex items-center justify-center">
          <X size={18} className="text-muted-foreground" />
        </button>
      </div>

      <PulseProgress current={currentQ + (answers[questions[currentQ]?.id] ? 1 : 0)} total={questions.length} reward={task.reward} />

      {/* Question */}
      <div className="flex-1 flex flex-col justify-center px-4 pb-8">
        {isSubmitting ? (
          <div className="text-center">
            <Loader2 size={40} className="text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Submitting your answers...</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <button onClick={onClose} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
              Go Back
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-bold text-foreground text-center mb-8 leading-snug">
                {questions[currentQ]?.question}
              </h3>

              <div className="space-y-3 max-w-sm mx-auto">
                {questions[currentQ]?.options.map((option, i) => {
                  const selected = answers[questions[currentQ].id] === option;
                  return (
                    <motion.button
                      key={option}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      onClick={() => handleSelect(option)}
                      disabled={isSubmitting}
                      className={`w-full text-left p-4 glass-card-sm flex items-center justify-between transition-all active:scale-[0.97] ${
                        selected
                          ? "bg-primary/10 shadow-[inset_0_0_0_1.5px_hsl(var(--primary))]"
                          : "hover:bg-secondary"
                      }`}
                      style={!selected ? { boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05)" } : undefined}
                    >
                      <span className={`text-sm font-medium ${selected ? "text-primary" : "text-foreground"}`}>
                        {option}
                      </span>
                      {selected && <CheckCircle2 size={20} className="text-primary" />}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
