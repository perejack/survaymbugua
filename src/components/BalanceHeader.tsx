import { useAuth } from "@/lib/AuthContext";
import { Wallet } from "lucide-react";

interface BalanceHeaderProps {
  onWithdrawClick: () => void;
}

export default function BalanceHeader({ onWithdrawClick }: BalanceHeaderProps) {
  const { balance } = useAuth();
  
  return (
    <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Available Balance</p>
          <p className="text-lg font-bold text-foreground tabular">
            KSH <span className="text-primary">{(balance ?? 0).toLocaleString()}</span>.00
          </p>
        </div>
        <button
          onClick={onWithdrawClick}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold active:scale-95 transition-transform"
        >
          <Wallet size={16} />
          Withdraw
        </button>
      </div>
    </div>
  );
}
