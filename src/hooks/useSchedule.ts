import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { ScheduleItem } from '../types';

export function useSchedule() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch schedules from Supabase
  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .order('tanggal', { ascending: true })
        // .order('waktu_mulai', { ascending: true }); // Can't order by nullable safely here, handled in client if needed

      if (error) throw error;

      // Transform database format to app format
      const transformed: ScheduleItem[] = (data || []).map((item) => ({
        id: item.id,
        hari: item.hari,
        tanggal: item.tanggal,
        kegiatan: item.kegiatan,
        waktuMulai: item.waktu_mulai?.slice(0, 5) || '', // HH:mm format
        waktuSelesai: item.waktu_selesai?.slice(0, 5) || '',
        tempat: item.tempat || '',
        keterangan: item.keterangan || '',
      }));

      setSchedules(transformed);
      setError(null);
    } catch (err) {
      console.error('Error fetching schedules:', err);
      setError('Gagal memuat jadwal');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  // Real-time subscription
  useEffect(() => {
    const subscription = supabase
      .channel('schedules-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'schedules' }, () => {
        fetchSchedules();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchSchedules]);

  const addSchedule = async (item: Omit<ScheduleItem, 'id'>) => {
    try {
      const { error } = await supabase.from('schedules').insert({
        hari: item.hari,
        tanggal: item.tanggal,
        kegiatan: item.kegiatan,
        waktu_mulai: item.waktuMulai || null,
        waktu_selesai: item.waktuSelesai || null,
        tempat: item.tempat || '',
        keterangan: item.keterangan || '',
      });

      if (error) throw error;
      await fetchSchedules();
    } catch (err) {
      console.error('Error adding schedule:', err);
      setError('Gagal menambah jadwal');
    }
  };

  const addMultipleSchedules = async (items: Omit<ScheduleItem, 'id'>[]) => {
    try {
      const dbItems = items.map(item => ({
        hari: item.hari,
        tanggal: item.tanggal,
        kegiatan: item.kegiatan,
        waktu_mulai: item.waktuMulai || null,
        waktu_selesai: item.waktuSelesai || null,
        tempat: item.tempat || '',
        keterangan: item.keterangan || '',
      }));

      const { error } = await supabase.from('schedules').insert(dbItems);

      if (error) throw error;
      await fetchSchedules();
    } catch (err) {
      console.error('Error adding multiple schedules:', err);
      setError('Gagal menambah banyak jadwal');
    }
  };

  const updateSchedule = async (id: string | number, updatedItem: Partial<ScheduleItem>) => {
    try {
      const updateData: Record<string, unknown> = {};
      if (updatedItem.hari !== undefined) updateData.hari = updatedItem.hari;
      if (updatedItem.tanggal !== undefined) updateData.tanggal = updatedItem.tanggal;
      if (updatedItem.kegiatan !== undefined) updateData.kegiatan = updatedItem.kegiatan;
      
      // Handle time fields specifically to convert "" to null
      if (updatedItem.waktuMulai !== undefined) {
        updateData.waktu_mulai = updatedItem.waktuMulai || null;
      }
      if (updatedItem.waktuSelesai !== undefined) {
        updateData.waktu_selesai = updatedItem.waktuSelesai || null;
      }
      
      if (updatedItem.tempat !== undefined) updateData.tempat = updatedItem.tempat;
      if (updatedItem.keterangan !== undefined) updateData.keterangan = updatedItem.keterangan;

      const { error } = await supabase
        .from('schedules')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      await fetchSchedules();
    } catch (err) {
      console.error('Error updating schedule:', err);
      setError('Gagal memperbarui jadwal');
    }
  };

  const deleteSchedule = async (id: string | number) => {
    try {
      const { error } = await supabase
        .from('schedules')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchSchedules();
    } catch (err) {
      console.error('Error deleting schedule:', err);
      setError('Gagal menghapus jadwal');
    }
  };

  const resetSchedule = async () => {
    // For Supabase, we just refresh from database
    await fetchSchedules();
  };

  return {
    schedules,
    loading,
    error,
    addSchedule,
    addMultipleSchedules,
    updateSchedule,
    deleteSchedule,
    resetSchedule,
    refetch: fetchSchedules,
  };
}
