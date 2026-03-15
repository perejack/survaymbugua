import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Smartphone, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabase";
import { initiateSTKPush, pollTransactionStatus, isValidPhoneNumber } from "@/lib/hashback-api";
import { toast } from "sonner";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: "starter" | "pro" | "elite";
  price: number;
  onUpgrade: () => void;
}

export default function UpgradeModal({ isOpen, onClose, tier, price, onUpgrade }: UpgradeModalProps) {
  const { profile, refreshProfile } = useAuth();
  const [phone, setPhone] = useState(profile?.phone_number || "");
  const [step, setStep] = useState<"form" | "processing" | "success" | "error">("form");
  const [errorMessage, setErrorMessage] = useState("");

  const isValidPhone = isValidPhoneNumber(phone);

  const handlePay = async () => {
    if (!isValidPhone || !profile?.id) return;
    
    setStep("processing");
    setErrorMessage("");

    try {
      // Generate unique reference for this package upgrade
      const reference = `UPG-${tier.toUpperCase()}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Initiate STK Push
      const response = await initiateSTKPush(String(price), phone, reference);
      
      if (response.CheckoutRequestID) {
        // Poll for transaction status
        await pollTransactionStatus(response.CheckoutRequestID, 30, 3000);
        
        // Payment successful - update profile package and create transaction
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ package_id: tier })
          .eq('id', profile.id);

        if (updateError) throw updateError;

        // Create upgrade transaction
        const { error: txError } = await supabase
          .from('transactions')
          .insert({
            user_id: profile.id,
            type: 'upgrade',
            amount: price,
            status: 'completed',
            phone_number: phone,
            reference: reference,
            description: `Upgraded to ${tier} package`,
            completed_at: new Date().toISOString(),
          });

        if (txError) throw txError;

        // Refresh profile to get updated package
        await refreshProfile();
        
        setStep("success");
        toast.success(`Upgraded to ${tier} package!`);
      } else {
        throw new Error(response.ResponseDescription || "Failed to initiate STK Push");
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Payment failed. Please try again.");
      setStep("error");
    }
  };

  const handleClose = () => {
    onClose();
    setStep("form");
    setPhone("");
    setErrorMessage("");
  };

  const getTierName = () => {
    return tier.charAt(0).toUpperCase() + tier.slice(1);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-foreground/40"
          onClick={handleClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-card-foreground">Upgrade to {getTierName()}</h2>
              <button onClick={handleClose} className="p-2 rounded-full hover:bg-secondary">
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>

            {step === "form" && (
              <div className="space-y-5">
                <div className="bg-secondary rounded-2xl p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Package</span>
                    <span className="font-bold text-card-foreground">{getTierName()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Amount</span>
                    <span className="font-bold text-primary">KSH {price}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">M-Pesa Phone Number</label>
                  <div className="relative">
                    <Smartphone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0712345678"
                      maxLength={10}
                      className="w-full h-14 rounded-2xl bg-secondary pl-12 pr-4 text-lg font-semibold text-card-foreground outline-none focus:ring-2 focus:ring-primary transition"
                    />
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handlePay}
                  disabled={!isValidPhone}
                  className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-bold text-base shadow-primary disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Pay KSH {price} via M-Pesa
                </motion.button>
              </div>
            )}

            {step === "processing" && (
              <div className="text-center py-8 space-y-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                  className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full mx-auto"
                />
                <h3 className="text-lg font-bold text-card-foreground">Sending STK Push...</h3>
                <p className="text-sm text-muted-foreground">Check your phone and enter your M-Pesa PIN</p>
              </div>
            )}

            {step === "success" && (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-6 space-y-4">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
                  <CheckCircle2 size={64} className="text-primary mx-auto" />
                </motion.div>
                <h3 className="text-xl font-bold text-card-foreground">Upgrade Successful! 🎉</h3>
                <p className="text-sm text-muted-foreground">
                  You are now on the <span className="font-bold text-primary">{getTierName()}</span> package. Enjoy premium surveys!
                </p>
                <button onClick={handleClose} className="w-full h-12 rounded-2xl bg-secondary text-secondary-foreground font-semibold">
                  Done
                </button>
              </motion.div>
            )}

            {step === "error" && (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle size={32} className="text-destructive" />
                </div>
                <h3 className="text-xl font-bold text-card-foreground">Payment Failed</h3>
                <p className="text-sm text-destructive px-4">{errorMessage}</p>
                <div className="flex gap-3 px-4">
                  <button 
                    onClick={() => setStep("form")} 
                    className="flex-1 h-12 rounded-2xl bg-secondary text-secondary-foreground font-semibold"
                  >
                    Try Again
                  </button>
                  <button 
                    onClick={handleClose} 
                    className="flex-1 h-12 rounded-2xl bg-primary text-primary-foreground font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
