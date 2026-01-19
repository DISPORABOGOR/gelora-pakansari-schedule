import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Announcement } from '../types';

const defaultAnnouncement: Announcement = {
  text: '',
  enabled: false
};

export function useAnnouncement() {
  const [announcement, setAnnouncement] = useState<Announcement>(defaultAnnouncement);
  const [loading, setLoading] = useState(true);

  const fetchAnnouncement = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setAnnouncement({
          text: data.text || '',
          enabled: data.enabled || false,
        });
      }
    } catch (err) {
      console.error('Error fetching announcement:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncement();
  }, [fetchAnnouncement]);

  // Real-time subscription
  useEffect(() => {
    const subscription = supabase
      .channel('announcements-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, () => {
        fetchAnnouncement();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchAnnouncement]);

  const updateAnnouncement = async (newAnnouncement: Announcement) => {
    try {
      // First check if there's an existing record
      const { data: existing } = await supabase
        .from('announcements')
        .select('id')
        .limit(1)
        .single();

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('announcements')
          .update({
            text: newAnnouncement.text,
            enabled: newAnnouncement.enabled,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from('announcements')
          .insert({
            text: newAnnouncement.text,
            enabled: newAnnouncement.enabled,
          });

        if (error) throw error;
      }

      setAnnouncement(newAnnouncement);
    } catch (err) {
      console.error('Error updating announcement:', err);
    }
  };

  return {
    announcement,
    loading,
    updateAnnouncement,
    refetch: fetchAnnouncement,
  };
}
