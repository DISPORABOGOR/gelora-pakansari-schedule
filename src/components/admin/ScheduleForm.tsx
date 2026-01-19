import { useState, useEffect } from "react";
import type { ScheduleItem } from "../../types";
import { Save, X, Calendar, Clock, MapPin, AlignLeft } from "lucide-react";

interface ScheduleFormProps {
  onSave: (
    data: Omit<ScheduleItem, "id"> | ScheduleItem | Omit<ScheduleItem, "id">[],
  ) => void;
  onCancel: () => void;
  editSchedule: ScheduleItem | null;
}

export default function ScheduleForm({
  onSave,
  onCancel,
  editSchedule,
}: ScheduleFormProps) {
  const [formData, setFormData] = useState({
    hari: "",
    tanggal: "",
    tanggalSelesai: "",
    kegiatan: "",
    waktuMulai: "",
    waktuSelesai: "",
    tempat: "",
    keterangan: "",
  });

  useEffect(() => {
    if (editSchedule) {
      setFormData({
        hari: editSchedule.hari,
        tanggal: editSchedule.tanggal,
        tanggalSelesai: "", // No range edit for existing items
        kegiatan: editSchedule.kegiatan,
        waktuMulai: editSchedule.waktuMulai || "",
        waktuSelesai: editSchedule.waktuSelesai || "",
        tempat: editSchedule.tempat || "",
        keterangan: editSchedule.keterangan || "",
      });
    } else {
      setFormData({
        hari: "",
        tanggal: new Date().toISOString().split("T")[0],
        tanggalSelesai: "",
        kegiatan: "",
        waktuMulai: "",
        waktuSelesai: "",
        tempat: "",
        keterangan: "",
      });
    }
  }, [editSchedule]);

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    const days = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    return days[date.getDay()];
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editSchedule) {
      // Single Update
      onSave({
        id: editSchedule.id,
        hari: getDayName(formData.tanggal),
        tanggal: formData.tanggal,
        kegiatan: formData.kegiatan,
        waktuMulai: formData.waktuMulai,
        waktuSelesai: formData.waktuSelesai,
        tempat: formData.tempat,
        keterangan: formData.keterangan,
      });
    } else {
      // Create - check for range
      if (
        formData.tanggalSelesai &&
        formData.tanggalSelesai > formData.tanggal
      ) {
        // Generate multiple
        const startDate = new Date(formData.tanggal);
        const endDate = new Date(formData.tanggalSelesai);
        const items: Omit<ScheduleItem, "id">[] = [];

        for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().split("T")[0];
          items.push({
            hari: getDayName(dateStr),
            tanggal: dateStr,
            kegiatan: formData.kegiatan,
            waktuMulai: formData.waktuMulai,
            waktuSelesai: formData.waktuSelesai,
            tempat: formData.tempat,
            keterangan: formData.keterangan,
          });
        }
        onSave(items);
      } else {
        // Single Create
        onSave({
          hari: getDayName(formData.tanggal),
          tanggal: formData.tanggal,
          kegiatan: formData.kegiatan,
          waktuMulai: formData.waktuMulai,
          waktuSelesai: formData.waktuSelesai,
          tempat: formData.tempat,
          keterangan: formData.keterangan,
        });
      }
    }
  };

  return (
    <div className="bg-navy-800 rounded-xl shadow-lg border border-navy-700 p-6 mb-8 transform transition-all">
      <div className="flex justify-between items-center mb-6 border-b border-navy-700 pb-4">
        <h3 className="font-bold text-xl text-teal-400 flex items-center gap-2">
          {editSchedule ? <Save size={20} /> : <Calendar size={20} />}
          {editSchedule ? "Edit Jadwal" : "Tambah Jadwal Baru"}
        </h3>
        <button
          onClick={onCancel}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date Section */}
        {/* Date Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1 flex items-center gap-2">
              <Calendar size={14} className="text-teal-500" />
              {editSchedule ? "Tanggal" : "Tanggal Mulai"}
            </label>
            <input
              type="date"
              name="tanggal"
              value={formData.tanggal}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-navy-900 border border-navy-600 rounded-lg text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors color-scheme-dark"
            />
            {!editSchedule && formData.tanggal && (
              <p className="text-xs text-slate-400 mt-1">
                Hari:{" "}
                <span className="text-teal-400">
                  {getDayName(formData.tanggal)}
                </span>
              </p>
            )}
          </div>

          {!editSchedule && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1 flex items-center gap-2">
                <Calendar size={14} className="text-teal-500" />
                Tanggal Selesai (Opsional)
              </label>
              <input
                type="date"
                name="tanggalSelesai"
                min={formData.tanggal}
                value={formData.tanggalSelesai}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-navy-900 border border-navy-600 rounded-lg text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors color-scheme-dark"
              />
              <p className="text-xs text-slate-500 mt-1">
                Isi jika jadwal berlangsung beberapa hari berturut-turut.
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Uraian Kegiatan
          </label>
          <textarea
            name="kegiatan"
            value={formData.kegiatan}
            onChange={handleChange}
            required
            rows={2}
            className="w-full px-3 py-2 bg-navy-900 border border-navy-600 rounded-lg text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
            placeholder="Contoh: Latihan Rutin..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1 flex items-center gap-2">
              <Clock size={14} className="text-teal-500" /> Waktu Mulai
            </label>
            <input
              type="time"
              name="waktuMulai"
              value={formData.waktuMulai}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-navy-900 border border-navy-600 rounded-lg text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors color-scheme-dark"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1 flex items-center gap-2">
              <Clock size={14} className="text-teal-500" /> Waktu Selesai
            </label>
            <input
              type="time"
              name="waktuSelesai"
              value={formData.waktuSelesai}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-navy-900 border border-navy-600 rounded-lg text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors color-scheme-dark"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1 flex items-center gap-2">
              <MapPin size={14} className="text-teal-500" /> Tempat
            </label>
            <input
              type="text"
              name="tempat"
              value={formData.tempat}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-navy-900 border border-navy-600 rounded-lg text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
              placeholder="Contoh: Lapangan Utama..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1 flex items-center gap-2">
              <AlignLeft size={14} className="text-teal-500" /> Keterangan
            </label>
            <input
              type="text"
              name="keterangan"
              value={formData.keterangan}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-navy-900 border border-navy-600 rounded-lg text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
              placeholder="Opsional..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-navy-700">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-navy-700 text-slate-300 rounded-lg hover:bg-navy-600 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 shadow-lg shadow-teal-900/20 font-medium transition-all hover:scale-105"
          >
            {editSchedule ? "Simpan Perubahan" : "Tambah Jadwal"}
          </button>
        </div>
      </form>
    </div>
  );
}
