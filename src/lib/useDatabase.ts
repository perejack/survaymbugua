import { useState, useCallback, useEffect } from 'react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';

export function useDatabase() {
  const { user, profile, refreshProfile } = useAuth();
  const [completedSurveyIds, setCompletedSurveyIds] = useState<Set<string>>(new Set());

  // Fetch completed surveys on mount
  useEffect(() => {
    if (user) {
      fetchCompletedSurveys();
    }
  }, [user]);

  async function fetchCompletedSurveys() {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('survey_responses')
        .select('survey_id')
        .eq('user_id', user.id);

      if (error) throw error;
      const ids = new Set(data?.map(r => r.survey_id) || []);
      setCompletedSurveyIds(ids);
    } catch (error) {
      console.error('Error fetching completed surveys:', error);
    }
  }

  const completeSurvey = useCallback(async (surveyId: string, reward: number, answers: Record<string, string>) => {
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      // Check if already completed
      const { data: existing } = await supabase
        .from('survey_responses')
        .select('id')
        .eq('user_id', user.id)
        .eq('survey_id', surveyId)
        .single();

      if (existing) {
        return { success: false, error: 'Already completed' };
      }

      // Save survey response
      const { error: responseError } = await supabase
        .from('survey_responses')
        .insert({
          user_id: user.id,
          survey_id: surveyId,
          answers: answers,
          reward_earned: reward,
        });

      if (responseError) throw responseError;

      // Create earning transaction
      const { error: txError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'survey_earning',
          amount: reward,
          status: 'completed',
          description: `Earned from survey`,
          completed_at: new Date().toISOString(),
        });

      if (txError) throw txError;

      // Update local state
      setCompletedSurveyIds(prev => new Set(prev).add(surveyId));
      
      // Refresh profile to update balance
      await refreshProfile();

      return { success: true };
    } catch (error) {
      console.error('Error completing survey:', error);
      return { success: false, error: 'Failed to complete survey' };
    }
  }, [user, refreshProfile]);

  const withdraw = useCallback(async (amount: number, phone: string) => {
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'withdrawal',
          amount: amount,
          status: 'pending',
          phone_number: phone,
          reference: `WD-${Date.now()}`,
          description: `Withdrawal of KSH ${amount} to ${phone}`,
        });

      if (error) throw error;
      await refreshProfile();
      return { success: true };
    } catch (error) {
      console.error('Error creating withdrawal:', error);
      return { success: false, error: 'Failed to create withdrawal' };
    }
  }, [user, refreshProfile]);

  const upgradeTier = useCallback(async (tier: string, cost: number) => {
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      // Update profile package
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ package_id: tier })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Create upgrade transaction
      const { error: txError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'upgrade',
          amount: cost,
          status: 'completed',
          description: `Upgrade to ${tier} package`,
          completed_at: new Date().toISOString(),
        });

      if (txError) throw txError;
      await refreshProfile();
      return { success: true };
    } catch (error) {
      console.error('Error upgrading tier:', error);
      return { success: false, error: 'Failed to upgrade' };
    }
  }, [user, refreshProfile]);

  const activateAccount = useCallback(async (phone: string, amount: number = 160) => {
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      // Update profile to active
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ is_active: true })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Create activation transaction
      const { error: txError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'activation',
          amount: amount,
          status: 'completed',
          phone_number: phone,
          reference: `ACT-${Date.now()}`,
          description: 'Account activation fee',
          completed_at: new Date().toISOString(),
        });

      if (txError) throw txError;
      await refreshProfile();
      return { success: true };
    } catch (error) {
      console.error('Error activating account:', error);
      return { success: false, error: 'Failed to activate' };
    }
  }, [user, refreshProfile]);

  return {
    completedSurveyIds,
    completeSurvey,
    withdraw,
    upgradeTier,
    activateAccount,
    fetchCompletedSurveys,
  };
}
