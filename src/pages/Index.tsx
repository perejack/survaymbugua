import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import { useDatabase } from "@/lib/useDatabase";
import { Loader2 } from "lucide-react";
import LandingPage from "./LandingPage";
import HomePage from "./HomePage";
import TasksPage from "./TasksPage";
import SurveyPage from "./SurveyPage";
import WalletPage from "./WalletPage";
import PremiumPage from "./PremiumPage";
import ProfilePage from "./ProfilePage";
import SignUpPage from "./SignUpPage";
import LoginPage from "./LoginPage";
import BottomNav from "@/components/BottomNav";
import BalanceHeader from "@/components/BalanceHeader";
import { toast } from "sonner";

type Page = "landing" | "auth" | "signup" | "login" | "home" | "tasks" | "survey" | "wallet" | "premium" | "profile";

export default function Index() {
  const { isAuthenticated, isLoading: isAuthLoading, profile, signOut, balance, totalEarned } = useAuth();
  const { completedSurveyIds, completeSurvey, withdraw, upgradeTier } = useDatabase();
  
  const [page, setPage] = useState<Page>("landing");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeSurveyId, setActiveSurveyId] = useState<string | null>(null);

  // Handle auth state changes
  useEffect(() => {
    if (!isAuthLoading) {
      if (isAuthenticated && page === "landing") {
        setPage("home");
      } else if (!isAuthenticated && page !== "landing" && page !== "signup" && page !== "login") {
        setPage("landing");
      }
    }
  }, [isAuthenticated, isAuthLoading, page]);

  const navPage = page === "survey" ? "tasks" : page === "landing" || page === "auth" || page === "signup" || page === "login" ? "home" : page;

  const uiProfile = profile
    ? {
        name: profile.full_name,
        phone: profile.phone_number || "",
        email: profile.email,
        avatar: "",
        tier: (profile.package_id as "free" | "starter" | "pro" | "elite" | null) || "free",
        balance: balance || 0,
        totalEarned: totalEarned || 0,
        completedSurveys: completedSurveyIds?.size ?? 0,
        joinDate: profile.created_at,
      }
    : null;

  const handleGetStarted = () => {
    if (isAuthenticated) {
      setPage("home");
    } else {
      setPage("login");
    }
  };

  const handleStartTask = (taskId: string) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to complete surveys");
      setPage("login");
      return;
    }
    setActiveSurveyId(taskId);
    setPage("survey");
  };

  const handleCompleteTask = async (taskId: string, reward: number, answers: Record<string, string>) => {
    const { success } = await completeSurvey(taskId, reward, answers);
    if (success) {
      setTimeout(() => {
        setActiveSurveyId(null);
        setPage("home");
      }, 500);
    }
  };

  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    setPage("tasks");
  };

  const handleWithdraw = async (amount: number) => {
    if (!profile) return false;
    const { success } = await withdraw(amount, profile.phone);
    return success;
  };

  const handleUpgradeTier = async (tier: "free" | "starter" | "pro" | "elite") => {
    const costs: Record<string, number> = {
      starter: 500,
      pro: 1500,
      elite: 5000,
    };
    const cost = costs[tier] || 0;
    const { success } = await upgradeTier(tier, cost);
    return success;
  };

  const handleLogout = async () => {
    await signOut();
    setPage("landing");
    toast.success("Logged out successfully");
  };

  // Show loading spinner while checking auth
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-primary" />
      </div>
    );
  }

  // Auth pages
  if (page === "landing") {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  if (page === "signup") {
    return (
      <SignUpPage
        onNavigateToLogin={() => setPage("login")}
        onSignUpSuccess={() => setPage("home")}
      />
    );
  }

  if (page === "login") {
    return (
      <LoginPage
        onNavigateToSignUp={() => setPage("signup")}
        onLoginSuccess={() => setPage("home")}
      />
    );
  }

  // If not authenticated and trying to access app pages, redirect to login
  if (!isAuthenticated) {
    return (
      <LoginPage
        onNavigateToSignUp={() => setPage("signup")}
        onLoginSuccess={() => setPage("home")}
      />
    );
  }

  // Main app pages
  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto relative">
      {/* Balance Header */}
      <BalanceHeader onWithdrawClick={() => setPage("wallet")} />
      
      <AnimatePresence mode="wait">
        {page === "home" && (
          <HomePage
            key="home"
            profile={uiProfile!}
            completedTaskIds={completedSurveyIds}
            onNavigate={(p) => setPage(p as Page)}
            onSelectCategory={handleSelectCategory}
            onStartTask={handleStartTask}
          />
        )}
        {page === "tasks" && (
          <TasksPage
            key="tasks"
            profile={profile!}
            completedTaskIds={completedSurveyIds}
            selectedCategory={selectedCategory}
            onBack={() => { setSelectedCategory(null); setPage("home"); }}
            onStartTask={handleStartTask}
          />
        )}
        {page === "wallet" && (
          <WalletPage
            key="wallet"
            profile={uiProfile!}
            onWithdraw={handleWithdraw}
            onBack={() => setPage("home")}
          />
        )}
        {page === "premium" && (
          <PremiumPage
            key="premium"
            profile={profile!}
            onUpgrade={handleUpgradeTier}
            onBack={() => setPage("home")}
          />
        )}
        {page === "profile" && (
          <ProfilePage
            key="profile"
            profile={uiProfile!}
            onBack={() => setPage("home")}
            onNavigate={(p) => setPage(p as Page)}
            onLogout={handleLogout}
          />
        )}
      </AnimatePresence>

      {page === "survey" && activeSurveyId && (
        <SurveyPage
          taskId={activeSurveyId}
          onComplete={handleCompleteTask}
          onClose={() => { setActiveSurveyId(null); setPage("home"); }}
        />
      )}

      {page !== "survey" && (
        <BottomNav active={navPage} onNavigate={(p) => setPage(p as Page)} />
      )}
    </div>
  );
}
