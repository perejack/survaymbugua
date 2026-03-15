import { motion } from "framer-motion";
import { ArrowLeft, User, Mail, Phone, Calendar, Award, ChevronRight, LogOut, Settings, HelpCircle, Shield } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useDatabase } from "@/lib/useDatabase";

interface ProfilePageProps {
  profile: { name: string; phone: string; email: string; avatar: string; tier: "free" | "starter" | "pro" | "elite"; balance: number; totalEarned: number; completedSurveys: number; joinDate: string; };
  onBack: () => void;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export default function ProfilePage({ profile, onBack, onNavigate, onLogout }: ProfilePageProps) {
  const { profile: authProfile, balance } = useAuth();
  const { completedSurveyIds } = useDatabase();
  
  const tierColors: Record<string, string> = {
    free: "text-muted-foreground bg-muted",
    starter: "text-silver bg-silver/10",
    pro: "text-accent bg-accent/10",
    elite: "text-primary bg-primary/10",
  };

  // Use auth profile data if available, fallback to props
  const displayName = authProfile?.full_name || profile?.name || "User";
  const displayEmail = authProfile?.email || profile?.email || "";
  const displayPhone = authProfile?.phone_number || profile?.phone || "";
  const completedCount = completedSurveyIds?.size ?? profile?.completedSurveys ?? 0;
  const memberSince = authProfile?.created_at 
    ? new Date(authProfile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : profile?.joinDate || "Recently";

  return (
    <div className="pb-24 min-h-screen">
      <div className="px-4 pt-4 pb-3 flex items-center gap-3">
        <button onClick={onBack} className="w-9 h-9 glass-inner bg-muted flex items-center justify-center">
          <ArrowLeft size={18} className="text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Profile</h1>
      </div>

      {/* Profile Header */}
      <div className="px-4 mb-6">
        <div className="glass-card p-6 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
            <User size={32} className="text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">{displayName}</h2>
          <div className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full ${tierColors[profile.tier]}`}>
            <Award size={12} />
            <span className="text-xs font-bold uppercase">{profile.tier} Member</span>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              { label: "Surveys", value: completedCount },
              { label: "Earned", value: `${(balance / 1000).toFixed(1)}K` },
              { label: "Since", value: memberSince },
            ].map((stat, i) => (
              <div key={i} className="glass-inner bg-muted p-3 text-center">
                <p className="text-base font-bold text-foreground tabular">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground font-medium uppercase">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="px-4 mb-5">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Account Info</h3>
        <div className="glass-card overflow-hidden">
          {[
            { icon: User, label: "Full Name", value: displayName },
            { icon: Mail, label: "Email", value: displayEmail },
            { icon: Phone, label: "Phone", value: displayPhone },
            { icon: Calendar, label: "Joined", value: memberSince },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3.5" style={i > 0 ? { boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)" } : undefined}>
              <item.icon size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground flex-1">{item.label}</span>
              <span className="text-sm font-medium text-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="px-4">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Quick Actions</h3>
        <div className="glass-card overflow-hidden">
          {[
            { icon: Award, label: "Upgrade Plan", action: () => onNavigate("premium"), color: "text-accent" },
            { icon: Shield, label: "Privacy & Security", action: () => {}, color: "text-primary" },
            { icon: HelpCircle, label: "Help & Support", action: () => {}, color: "text-muted-foreground" },
            { icon: Settings, label: "Settings", action: () => {}, color: "text-muted-foreground" },
            { icon: LogOut, label: "Log Out", action: onLogout, color: "text-destructive" },
          ].map((item, i) => (
            <button
              key={i}
              onClick={item.action}
              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-secondary transition-colors"
              style={i > 0 ? { boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)" } : undefined}
            >
              <item.icon size={16} className={item.color} />
              <span className="text-sm text-foreground flex-1 text-left">{item.label}</span>
              <ChevronRight size={14} className="text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
