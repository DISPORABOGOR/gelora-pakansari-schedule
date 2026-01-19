import { useState } from "react";
import { useSchedule } from "../hooks/useSchedule";
import { useAnnouncement } from "../hooks/useAnnouncement";
import AdminHeader from "../components/admin/AdminHeader";
import ScheduleForm from "../components/admin/ScheduleForm";
import ScheduleList from "../components/admin/ScheduleList";
import type { ScheduleItem } from "../types";
import { Save } from "lucide-react";

export default function AdminPanel() {
  const {
    schedules,
    addSchedule,
    addMultipleSchedules,
    updateSchedule,
    deleteSchedule,
    resetSchedule,
  } = useSchedule();
  const { announcement, updateAnnouncement } = useAnnouncement();

  const [editingSchedule, setEditingSchedule] = useState<ScheduleItem | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [localAnnouncement, setLocalAnnouncement] = useState(announcement);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Sync local announcement state when hook state changes (initial load)
  // But we want to edit locally and save manually?
  // Legacy app loaded from storage. Here we can use state.
  // Let's keep it simple: sync with hook, and update button saves to hook (which saves to storage).

  // Actually, hooks update storage immediately.
  // For announcement, we might want a save button.
  // Let's assume controlled input for announcement.

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const handleSaveSchedule = (
    data: Omit<ScheduleItem, "id"> | ScheduleItem | Omit<ScheduleItem, "id">[],
  ) => {
    if (Array.isArray(data)) {
      // Bulk Create
      addMultipleSchedules(data);
    } else if ("id" in data) {
      // Check if we are editing a group
      // We can attach 'ids' to the editingSchedule state if we cast it
      const currentEditing = editingSchedule as any;
      if (
        currentEditing &&
        currentEditing.ids &&
        currentEditing.ids.length > 1
      ) {
        // Batch Update
        // removing 'id' from data to avoid confusion, though updateSchedule ignores it if not used
        const { id, ...updateData } = data;

        // We need a batch update function or just loop
        // Looping for now
        currentEditing.ids.forEach((id: string | number) => {
          updateSchedule(id, updateData);
        });
      } else {
        // Single Update
        updateSchedule(data.id, data);
      }
    } else {
      addSchedule(data);
    }
    setEditingSchedule(null);
  };

  const handleEdit = (schedule: ScheduleItem) => {
    setEditingSchedule(schedule);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const filteredSchedules = schedules.filter((s) => {
    const matchesSearch =
      s.kegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.hari.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    // Date Range Filter logic
    if (startDate && endDate) {
      return s.tanggal >= startDate && s.tanggal <= endDate;
    } else if (startDate) {
      return s.tanggal >= startDate;
    } else if (endDate) {
      return s.tanggal <= endDate;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-background pb-12 text-slate-100">
      <AdminHeader />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <ScheduleForm
          onSave={handleSaveSchedule}
          onCancel={() => setEditingSchedule(null)}
          editSchedule={editingSchedule}
        />

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Cari jadwal..."
            className="flex-1 px-4 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex gap-2">
            <div className="flex items-center gap-2 bg-navy-800 border border-navy-700 rounded-lg px-3 py-2">
              <span className="text-sm text-slate-400">Dari:</span>
              <input
                type="date"
                className="bg-transparent text-white text-sm outline-none color-scheme-dark"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 bg-navy-800 border border-navy-700 rounded-lg px-3 py-2">
              <span className="text-sm text-slate-400">Sampai:</span>
              <input
                type="date"
                className="bg-transparent text-white text-sm outline-none color-scheme-dark"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            {(startDate || endDate) && (
              <button
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                }}
                className="px-3 py-2 text-sm text-red-400 hover:bg-navy-800 rounded-lg border border-transparent hover:border-navy-700"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        <ScheduleList
          schedules={filteredSchedules}
          onEdit={handleEdit}
          onDelete={deleteSchedule}
        />

        {/* Announcement Section */}
        <div className="mt-8 bg-navy-800 rounded-xl shadow-sm border border-navy-700 p-6">
          <h3 className="font-bold text-teal-400 mb-4 flex items-center gap-2">
            Pengumuman Running Text
          </h3>
          <div className="flex gap-4 items-start">
            <div className="flex-1">
              <textarea
                className="w-full px-3 py-2 bg-navy-900 border border-navy-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 outline-none"
                rows={2}
                value={localAnnouncement.text}
                onChange={(e) =>
                  setLocalAnnouncement((prev) => ({
                    ...prev,
                    text: e.target.value,
                  }))
                }
                placeholder="Masukkan teks pengumuman..."
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-teal-600 rounded bg-navy-900 border-navy-700 focus:ring-teal-500"
                  checked={localAnnouncement.enabled}
                  onChange={(e) =>
                    setLocalAnnouncement((prev) => ({
                      ...prev,
                      enabled: e.target.checked,
                    }))
                  }
                />
                <span className="text-sm font-medium text-slate-300">
                  Aktifkan
                </span>
              </label>
              <button
                onClick={() => updateAnnouncement(localAnnouncement)}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm flex items-center gap-2 shadow-lg shadow-teal-900/20"
              >
                <Save size={16} /> Simpan
              </button>
            </div>
          </div>
        </div>

        {/* Utilities */}
        <div className="mt-8 p-4 border-t border-navy-800">
          <button
            onClick={() => {
              if (confirm("Reset ke data awal?")) resetSchedule();
            }}
            className="text-sm text-slate-500 hover:text-red-400 underline"
          >
            Reset Data Sample
          </button>
        </div>
      </main>
    </div>
  );
}
