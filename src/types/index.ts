export interface ScheduleItem {
  id: string | number;
  hari: string;
  tanggal: string; // YYYY-MM-DD
  kegiatan: string;
  waktuMulai?: string; // HH:mm
  waktuSelesai?: string; // HH:mm
  tempat?: string;
  keterangan?: string;
}

export interface Announcement {
  text: string;
  enabled: boolean;
}

export type ScheduleSortOption = 'date-asc' | 'date-desc';
