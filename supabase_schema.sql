-- Create schedules table
CREATE TABLE IF NOT EXISTS schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hari TEXT NOT NULL,
  tanggal DATE NOT NULL,
  kegiatan TEXT NOT NULL,
  waktu_mulai TIME,
  waktu_selesai TIME,
  tempat TEXT,
  keterangan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL DEFAULT '',
  enabled BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Realtime for these tables
ALTER PUBLICATION supabase_realtime ADD TABLE schedules;
ALTER PUBLICATION supabase_realtime ADD TABLE announcements;

-- Insert default announcement row (only one row needed)
INSERT INTO announcements (text, enabled) VALUES ('', false)
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read/write access (for demo purposes)
-- In production, you should restrict this based on authentication
CREATE POLICY "Allow public read schedules" ON schedules FOR SELECT USING (true);
CREATE POLICY "Allow public insert schedules" ON schedules FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update schedules" ON schedules FOR UPDATE USING (true);
CREATE POLICY "Allow public delete schedules" ON schedules FOR DELETE USING (true);

CREATE POLICY "Allow public read announcements" ON announcements FOR SELECT USING (true);
CREATE POLICY "Allow public update announcements" ON announcements FOR UPDATE USING (true);

-- Insert sample data
INSERT INTO schedules (hari, tanggal, kegiatan, waktu_mulai, waktu_selesai, tempat, keterangan) VALUES
  ('Senin', '2025-01-20', 'Latihan Rutin PERSIKABO 1973', '08:00', '12:00', 'Lapangan Utama', ''),
  ('Senin', '2025-01-20', 'Pertandingan Liga 2 Indonesia', '15:00', '18:00', 'Lapangan Utama', 'Tiket Berbayar'),
  ('Selasa', '2025-01-21', 'Maintenance Rumput Lapangan', '06:00', '10:00', 'Area Tertutup', ''),
  ('Rabu', '2025-01-22', 'Event Komunitas Sepak Bola Kab. Bogor', '09:00', '15:00', 'Lapangan Utama', 'Pendaftaran Online'),
  ('Kamis', '2025-01-23', 'Latihan Tim Nasional U-20', '14:00', '17:00', 'Lapangan Utama', 'Tertutup untuk Umum');
