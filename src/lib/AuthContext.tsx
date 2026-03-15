import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, type UserProfile } from './supabase';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, fullName: string, phoneNumber: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  balance: number;
  totalEarned: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setBalance(0);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        // Profile doesn't exist, create it
        const userEmail = user?.email || session?.user?.email || '';
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            email: userEmail,
            full_name: userEmail.split('@')[0] || 'User',
            phone_number: '',
            is_active: false,
            package_id: 'basic',
          })
          .select()
          .single();
        
        if (createError) throw createError;
        setProfile(newProfile);
      } else {
        setProfile(data);
      }
      
      // Fetch balance
      await fetchBalance(userId);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchBalance(userId: string) {
    try {
      // Fetch all transactions and calculate balance manually
      // Only count survey_earnings (positive) and withdrawals (negative)
      // Ignore upgrade and activation fees (paid via M-Pesa, not from wallet)
      const { data, error } = await supabase
        .from('transactions')
        .select('type, amount')
        .eq('user_id', userId)
        .in('type', ['survey_earning', 'withdrawal'])
        .eq('status', 'completed');
      
      if (error) throw error;
      
      // Calculate balance: earnings - withdrawals
      let calculatedBalance = 0;
      let calculatedTotalEarned = 0;
      data?.forEach((tx: { type: string; amount: number }) => {
        if (tx.type === 'survey_earning') {
          calculatedBalance += tx.amount;
          calculatedTotalEarned += tx.amount;
        } else if (tx.type === 'withdrawal') {
          calculatedBalance -= tx.amount;
        }
      });
      
      setBalance(Math.max(0, calculatedBalance)); // Never go below 0
      setTotalEarned(calculatedTotalEarned);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance(0);
      setTotalEarned(0);
    }
  }

  async function signUp(email: string, password: string, fullName: string, phoneNumber: string) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email,
            full_name: fullName,
            phone_number: phoneNumber,
            is_active: false,
            package_id: 'basic',
          });

        if (profileError) throw profileError;
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function refreshProfile() {
    if (user) {
      await fetchProfile(user.id);
    }
  }

  const value = {
    session,
    user,
    profile,
    isLoading,
    isAuthenticated: !!session,
    signUp,
    signIn,
    signOut,
    refreshProfile,
    balance,
    totalEarned,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
