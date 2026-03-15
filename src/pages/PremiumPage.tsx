import { motion } from "framer-motion";
import { ArrowLeft, Zap, Crown, Shield, Star, CheckCircle2 } from "lucide-react";
import { UserProfile } from "@/lib/useAppState";
import { useEffect, useState } from "react";
import UpgradeModal from "@/components/UpgradeModal";

interface PremiumPageProps {
  profile: UserProfile;
  onUpgrade: (tier: UserProfile["tier"]) => void;
  onBack: () => void;
}

const tiers = [
  {
    id: "starter" as const,
    name: "Starter",
    price: 350,
    color: "silver",
    icon: Star,
    multiplier: "1.2x",
    features: ["Access premium surveys", "1.2x earning multiplier", "Priority task queue", "Daily bonus tasks"],
    glowClass: "",
    bgClass: "bg-silver/5",
    borderClass: "shadow-[inset_0_0_0_1px_hsl(220_10%_72%/0.3)]",
    textClass: "text-silver",
  },
  {
    id: "pro" as const,
    name: "Pro",
    price: 500,
    color: "gold",
    icon: Crown,
    multiplier: "1.5x",
    features: ["All Starter features", "1.5x earning multiplier", "Exclusive brand surveys", "Instant task availability", "500 KSH surveys"],
    glowClass: "glow-gold",
    bgClass: "bg-accent/5",
    borderClass: "shadow-[inset_0_0_0_1.5px_hsl(47_95%_50%/0.4)]",
    textClass: "text-accent",
    popular: true,
  },
  {
    id: "elite" as const,
    name: "Elite",
    price: 650,
    color: "emerald",
    icon: Shield,
    multiplier: "2x",
    features: ["All Pro features", "2x earning multiplier", "Instant M-Pesa withdrawal", "650 KSH premium surveys", "VIP support", "Weekly bonus pool"],
    glowClass: "glow-emerald",
    bgClass: "bg-primary/5",
    borderClass: "shadow-[inset_0_0_0_1.5px_hsl(142_76%_36%/0.4)]",
    textClass: "text-primary",
  },
];

export default function PremiumPage({ profile, onUpgrade, onBack }: PremiumPageProps) {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [upgradeModal, setUpgradeModal] = useState<{ isOpen: boolean; tier: "starter" | "pro" | "elite"; price: number } | null>(null);

  const handleUpgradeClick = (tier: "starter" | "pro" | "elite", price: number) => {
    setUpgradeModal({ isOpen: true, tier, price });
  };

  const handleUpgradeSuccess = () => {
    setUpgradeModal(null);
    onUpgrade(profile.tier);
  };

  return (
    <>
    <div className="pb-24 min-h-screen">
      <div className="px-4 pt-4 pb-3 flex items-center gap-3">
        <button onClick={onBack} className="w-9 h-9 glass-inner bg-muted flex items-center justify-center">
          <ArrowLeft size={18} className="text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Upgrade Plan</h1>
      </div>

      <div className="px-4 mb-6 text-center">
        <div className="inline-flex items-center gap-2 glass-inner bg-accent/10 px-4 py-1.5 mb-3">
          <Zap size={14} className="text-accent" />
          <span className="text-xs font-bold text-accent">EARN MORE</span>
        </div>
        <h2 className="text-2xl font-extrabold text-foreground">Unlock Higher Rewards</h2>
        <p className="text-sm text-muted-foreground mt-1">Daily task packages with premium surveys</p>
      </div>

      <div className="px-4 space-y-4">
        {tiers.map((tier, i) => {
          const isCurrentTier = profile.tier === tier.id;
          return (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card p-5 relative overflow-hidden ${tier.glowClass} ${tier.borderClass}`}
            >
              {tier.popular && (
                <div className="absolute top-3 right-3 bg-accent/20 px-3 py-1 rounded-full">
                  <span className="text-[10px] font-bold text-accent">POPULAR</span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-2xl ${tier.bgClass} flex items-center justify-center`}>
                  <tier.icon size={22} className={tier.textClass} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{tier.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-foreground tabular">{tier.price}</span>
                    <span className="text-sm text-muted-foreground">KSH/day</span>
                  </div>
                </div>
                <div className={`ml-auto glass-inner ${tier.bgClass} px-3 py-1.5`}>
                  <span className={`text-sm font-bold ${tier.textClass}`}>{tier.multiplier}</span>
                </div>
              </div>

              <div className="space-y-2 mb-5">
                {tier.features.map((feat, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <CheckCircle2 size={14} className={tier.textClass} />
                    <span className="text-sm text-muted-foreground">{feat}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => !isCurrentTier && handleUpgradeClick(tier.id, tier.price)}
                disabled={isCurrentTier}
                className={`w-full glass-inner py-3 text-sm font-bold transition-all active:scale-95 ${
                  isCurrentTier
                    ? "bg-muted text-muted-foreground cursor-default"
                    : `${tier.bgClass} ${tier.textClass} hover:brightness-110`
                }`}
                style={!isCurrentTier ? { boxShadow: `inset 0 0 0 1px currentColor` } : undefined}
              >
                {isCurrentTier ? "Current Plan" : `Upgrade to ${tier.name}`}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>

    {/* Upgrade Modal */}
    {upgradeModal && (
      <UpgradeModal
        isOpen={upgradeModal.isOpen}
        onClose={() => setUpgradeModal(null)}
        tier={upgradeModal.tier}
        price={upgradeModal.price}
        onUpgrade={handleUpgradeSuccess}
      />
    )}
    </>
  );
}
