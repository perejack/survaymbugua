import { motion } from "framer-motion";

interface PulseProgressProps {
  current: number;
  total: number;
  reward: number;
}

export default function PulseProgress({ current, total, reward }: PulseProgressProps) {
  const progress = current / total;

  return (
    <div className="w-full px-4 py-3">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-muted-foreground font-medium">
          Question {current} of {total}
        </span>
        <span className="text-xs font-bold text-primary tabular">+{reward} KSH</span>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
            {i < current && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={`h-full rounded-full ${
                  progress >= 0.8 ? "bg-primary pulse-bar" : "bg-primary/70"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
