import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jptsbpepledqqmqdscyo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwdHNicGVwbGVkcXFtcWRzY3lvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MTQ4MjUsImV4cCI6MjA4OTA5MDgyNX0.tgHwmHRS4z7a2TdjXEjFWFA0-wZr_Q2XKEmj_MZZZsY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserProfile = {
  id: string;
  email: string;
  full_name: string;
  phone_number: string | null;
  is_active: boolean;
  package_id: string | null;
  created_at: string;
  updated_at: string;
};

export type Survey = {
  id: string;
  title: string;
  description: string;
  category: string;
  reward: number;
  duration: string;
  questions_count: number;
  is_premium: boolean;
  required_package: string | null;
  is_active: boolean;
  created_at: string;
};

export type SurveyResponse = {
  id: string;
  user_id: string;
  survey_id: string;
  answers: Record<string, string>;
  completed_at: string;
  reward_earned: number;
};

export type Transaction = {
  id: string;
  user_id: string;
  type: 'withdrawal' | 'activation' | 'upgrade' | 'survey_earning';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  phone_number: string | null;
  reference: string | null;
  description: string;
  created_at: string;
  completed_at: string | null;
};

export type Package = {
  id: string;
  name: string;
  price: number;
  daily_earning_limit: number;
  features: string[];
  color: string;
  badge: string;
};
