import { useState, useCallback } from "react";

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  avatar: string;
  tier: "free" | "starter" | "pro" | "elite";
  balance: number;
  totalEarned: number;
  completedSurveys: number;
  joinDate: string;
}

const defaultProfile: UserProfile = {
  name: "Brian Ochieng",
  phone: "0712****89",
  email: "brian.o@gmail.com",
  avatar: "",
  tier: "free",
  balance: 2850,
  totalEarned: 14500,
  completedSurveys: 47,
  joinDate: "Jan 2026",
};

export function useAppState() {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [completedTaskIds, setCompletedTaskIds] = useState<Set<string>>(new Set());

  const completeTask = useCallback((taskId: string, reward: number) => {
    setCompletedTaskIds(prev => new Set(prev).add(taskId));
    setProfile(prev => ({
      ...prev,
      balance: prev.balance + reward,
      totalEarned: prev.totalEarned + reward,
      completedSurveys: prev.completedSurveys + 1,
    }));
  }, []);

  const withdraw = useCallback((amount: number) => {
    setProfile(prev => ({
      ...prev,
      balance: prev.balance - amount,
    }));
  }, []);

  const upgradeTier = useCallback((tier: UserProfile["tier"]) => {
    setProfile(prev => ({ ...prev, tier }));
  }, []);

  return { profile, completedTaskIds, completeTask, withdraw, upgradeTier };
}
