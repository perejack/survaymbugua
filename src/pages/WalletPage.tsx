import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Smartphone, CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useDatabase } from "@/lib/useDatabase";
import { supabase } from "@/lib/supabase";
import ActivateAccountModal from "@/components/ActivateAccountModal";
import { toast } from "sonner";

interface WalletPageProps {
  profile: { name: string; phone: string; email: string; avatar: string; tier: "free" | "starter" | "pro" | "elite"; balance: number; totalEarned: number; completedSurveys: number; joinDate: string; };
  onWithdraw: (amount: number) => Promise<boolean>;
  onBack: () => void;
}

interface Transaction {
  id: string;
  type: "earn" | "withdraw";
  desc: string;
  amount: number;
  time: string;
}

export default function WalletPage({ profile, onWithdraw, onBack }: WalletPageProps) {
  const { user, profile: authProfile, balance, totalEarned } = useAuth();
  const { withdraw } = useDatabase();
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showActivate, setShowActivate] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawStep, setWithdrawStep] = useState<"input" | "loading" | "success">("input");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTx, setLoadingTx] = useState(true);
  
  // Safe balance with fallback
  const displayBalance = balance ?? 0;
  const displayPhone = authProfile?.phone_number || profile?.phone || "";

  // Fetch transactions from database
  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  async function fetchTransactions() {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      const formatted: Transaction[] = (data || []).map(tx => ({
        id: tx.id,
        type: tx.type === 'survey_earning' ? 'earn' : 'withdraw',
        desc: tx.description,
        amount: tx.type === 'survey_earning' ? tx.amount : -tx.amount,
        time: formatTime(tx.created_at),
      }));

      setTransactions(formatted);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoadingTx(false);
    }
  }

  function formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours} hrs ago`;
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  }

  const handleWithdrawClick = () => {
    // Check if account is active
    if (!authProfile?.is_active) {
      setShowActivate(true);
      return;
    }
    setShowWithdraw(true);
  };

  const handleWithdraw = async () => {
    const amount = parseInt(withdrawAmount);
    if (!amount || amount <= 0 || amount > displayBalance) return;
    
    setWithdrawStep("loading");
    
    const { success } = await withdraw(amount, displayPhone);
    
    if (success) {
      setWithdrawStep("success");
      await fetchTransactions();
      setTimeout(() => {
        setShowWithdraw(false);
        setWithdrawStep("input");
        setWithdrawAmount("2500");
      }, 3000);
    } else {
      setWithdrawStep("input");
      toast.error("Withdrawal failed. Please try again.");
    }
  };

  const handleActivated = () => {
    setShowActivate(false);
    setShowWithdraw(true);
  };

  return (
    <div className="pb-24 min-h-screen">
      <div className="px-4 pt-4 pb-3 flex items-center gap-3">
        <button onClick={onBack} className="w-9 h-9 glass-inner bg-muted flex items-center justify-center">
          <ArrowLeft size={18} className="text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Wallet</h1>
      </div>

      {/* Balance */}
      <div className="px-4 mb-6">
        <div className="glass-card p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">Available Balance</p>
          <h2 className="mt-1 text-4xl font-extrabold tracking-tight tabular text-foreground">
            <span className="text-muted-foreground text-xl">KSH</span> {displayBalance.toLocaleString()}.00
          </h2>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Total earned:</span>
            <span className="text-xs font-bold text-primary tabular">KSH {totalEarned.toLocaleString()}</span>
          </div>
          
          {/* Account Status */}
          {authProfile && (
            <div className={`mt-3 p-2 rounded-lg text-xs ${authProfile.is_active ? 'bg-green-500/10 text-green-600' : 'bg-amber-500/10 text-amber-600'}`}>
              {authProfile.is_active ? '✓ Account Active' : '⚠ Account needs activation to withdraw'}
            </div>
          )}
          
          <button
            onClick={handleWithdrawClick}
            disabled={displayBalance <= 0}
            className="mt-5 w-full glass-inner bg-primary text-primary-foreground py-3.5 text-sm font-bold active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Withdraw to M-Pesa
          </button>
          {displayBalance <= 0 && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Enter amount to withdraw
            </p>
          )}
        </div>
      </div>

      {/* Transactions */}
      <div className="px-4">
        <h2 className="text-base font-bold text-foreground mb-3">Recent Transactions</h2>
        {loadingTx ? (
          <div className="text-center py-4">
            <Loader2 size={24} className="text-primary animate-spin mx-auto" />
          </div>
        ) : transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No transactions yet</p>
        ) : (
          <div className="space-y-2">
            {transactions.map(tx => (
              <div key={tx.id} className="glass-card-sm p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                    tx.type === "earn" ? "bg-primary/10" : "bg-destructive/10"
                  }`}>
                    {tx.type === "earn" ? (
                      <ArrowDownLeft size={18} className="text-primary" />
                    ) : (
                      <ArrowUpRight size={18} className="text-destructive" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{tx.desc}</p>
                    <p className="text-xs text-muted-foreground">{tx.time}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold tabular ${
                  tx.type === "earn" ? "text-primary" : "text-destructive"
                }`}>
                  {tx.type === "earn" ? "+" : ""}{tx.amount.toLocaleString()} KSH
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Withdraw Modal */}
      <AnimatePresence>
        {showWithdraw && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end justify-center"
            onClick={() => withdrawStep === "input" && setShowWithdraw(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-lg glass-card p-6 rounded-b-none"
              onClick={e => e.stopPropagation()}
            >
              {withdrawStep === "input" && (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Smartphone size={22} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">M-Pesa Withdrawal</h3>
                      <p className="text-xs text-muted-foreground">Funds sent via STK Push</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">Amount (KSH)</label>
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={e => setWithdrawAmount(e.target.value)}
                      className="w-full glass-inner bg-muted p-4 text-2xl font-bold text-foreground tabular outline-none focus:shadow-[inset_0_0_0_1.5px_hsl(var(--primary))] transition-shadow"
                      min={1}
                      max={displayBalance}
                    />
                    <div className="flex gap-2 mt-3">
                      {[2500, 5000, 7500].map(amt => (
                        <button
                          key={amt}
                          onClick={() => setWithdrawAmount(String(amt))}
                          disabled={amt > displayBalance}
                          className="flex-1 glass-inner bg-muted py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
                        >
                          {amt.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card-sm p-3 mb-4 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Phone Number</span>
                    <span className="text-sm font-semibold text-foreground">{displayPhone}</span>
                  </div>

                  <button
                    onClick={handleWithdraw}
                    disabled={parseInt(withdrawAmount) <= 0 || parseInt(withdrawAmount) > displayBalance}
                    className="w-full glass-inner bg-primary text-primary-foreground py-4 text-base font-bold active:scale-95 transition-transform disabled:opacity-50"
                  >
                    Request Withdrawal
                  </button>
                </>
              )}

              {withdrawStep === "loading" && (
                <div className="text-center py-8">
                  <Loader2 size={40} className="text-primary animate-spin mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-foreground">Processing...</h3>
                  <p className="text-sm text-muted-foreground mt-2">Your withdrawal is being processed</p>
                </div>
              )}

              {withdrawStep === "success" && (
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle2 size={48} className="text-primary mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-lg font-bold text-foreground">Withdrawal Requested!</h3>
                  <p className="text-2xl font-extrabold text-gradient-primary mt-2 tabular">
                    KSH {parseInt(withdrawAmount).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">Will be sent to {displayPhone} via M-Pesa</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Activate Account Modal */}
      <ActivateAccountModal
        isOpen={showActivate}
        onClose={() => setShowActivate(false)}
        onActivated={handleActivated}
      />
    </div>
  );
}
