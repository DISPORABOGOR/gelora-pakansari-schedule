import type { ScheduleItem } from "../../types";
import {
  Pencil,
  Trash2,
  Clock,
  Calendar as CalendarIcon,
  Search,
} from "lucide-react";
import { formatDateIndonesian } from "../../utils/date";

interface ScheduleListProps {
  schedules: ScheduleItem[];
  onEdit: (schedule: ScheduleItem) => void;
  onDelete: (id: string | number) => void;
}

export default function ScheduleList({
  schedules,
  onEdit,
  onDelete,
}: ScheduleListProps) {
  if (schedules.length === 0) {
    return (
      <div className="bg-navy-800 rounded-xl shadow-sm border border-navy-700 p-12 text-center">
        <div className="w-16 h-16 bg-navy-900 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
          <Search size={32} />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">Belum ada jadwal</h3>
        <p className="text-slate-400">
          Silakan tambahkan jadwal baru melalui form di atas.
        </p>
      </div>
    );
  }

  // Define format function locally or imported

  // Helper to group schedules
  const getGroupedSchedules = (items: ScheduleItem[]) => {
    const grouped: (ScheduleItem & {
      dateRange?: string;
      ids: (string | number)[];
    })[] = [];

    if (items.length === 0) return grouped;

    let currentGroup = { ...items[0] };
    let ids: (string | number)[] = [items[0].id];
    let startDate = items[0].tanggal;
    let endDate = items[0].tanggal;
    let count = 1;

    for (let i = 1; i < items.length; i++) {
      const item = items[i];
      const isSame =
        item.kegiatan === currentGroup.kegiatan &&
        item.waktuMulai === currentGroup.waktuMulai &&
        item.waktuSelesai === currentGroup.waktuSelesai &&
        item.tempat === currentGroup.tempat &&
        item.keterangan === currentGroup.keterangan;

      if (isSame) {
        endDate = item.tanggal;
        ids.push(item.id);
        count++;
      } else {
        // Push previous group
        if (count > 1) {
          grouped.push({
            ...currentGroup,
            hari: "",
            dateRange: `${formatDateIndonesian(startDate)} - ${formatDateIndonesian(endDate)}`,
            ids: [...ids],
          });
        } else {
          grouped.push({ ...currentGroup, ids: [...ids] });
        }

        // Start new group
        currentGroup = { ...item };
        ids = [item.id];
        startDate = item.tanggal;
        endDate = item.tanggal;
        count = 1;
      }
    }

    // Push last group
    if (count > 1) {
      grouped.push({
        ...currentGroup,
        hari: "",
        dateRange: `${formatDateIndonesian(startDate)} - ${formatDateIndonesian(endDate)}`,
        ids: [...ids],
      });
    } else {
      grouped.push({ ...currentGroup, ids: [...ids] });
    }

    return grouped;
  };

  const groupedSchedules = getGroupedSchedules(schedules);

  return (
    <div className="bg-navy-800 rounded-xl shadow-lg border border-navy-700 overflow-hidden">
      <div className="p-4 border-b border-navy-700 flex justify-between items-center bg-navy-900/50">
        <h3 className="font-bold text-white flex items-center gap-2">
          <span className="bg-teal-600 text-white text-xs px-2 py-0.5 rounded-full">
            {groupedSchedules.length}
          </span>
          Jadwal Terdaftar (Grup)
        </h3>
      </div>

      <div className="divide-y divide-navy-700">
        {groupedSchedules.map((schedule, index) => (
          <div
            key={index} // Use index as key for groups
            className="p-4 hover:bg-navy-700/50 transition-colors"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-navy-900 text-teal-400 border border-teal-500/30 flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg mb-1">
                    {schedule.kegiatan}
                  </h4>
                  <div className="flex flex-wrap gap-3 text-sm text-slate-400 mb-2">
                    <div className="flex items-center gap-1.5">
                      <CalendarIcon size={14} className="text-teal-500" />
                      {schedule.dateRange ? (
                        <span className="text-teal-400 font-medium">
                          {schedule.dateRange} (Multiple Days)
                        </span>
                      ) : (
                        <span>
                          {schedule.hari},{" "}
                          {formatDateIndonesian(schedule.tanggal)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} className="text-teal-500" />
                      <span>
                        {schedule.waktuMulai && schedule.waktuSelesai
                          ? `${schedule.waktuMulai} - ${schedule.waktuSelesai}`
                          : "Waktu tidak ditentukan"}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm mb-2">
                    {schedule.tempat && (
                      <span className="text-teal-400 bg-teal-900/30 px-2 py-0.5 rounded text-xs">
                        📍 {schedule.tempat}
                      </span>
                    )}
                    {schedule.keterangan && (
                      <span className="text-slate-300 italic bg-navy-900/50 border border-navy-700 px-2 py-0.5 rounded text-xs">
                        {schedule.keterangan}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-start">
                <button
                  onClick={() => onEdit(schedule)}
                  className="p-2 text-teal-400 hover:bg-teal-400/10 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => {
                    if (schedule.ids && schedule.ids.length > 1) {
                      if (
                        confirm(
                          `Hapus ${schedule.ids.length} jadwal ini sekaligus?`,
                        )
                      ) {
                        // Loop delete
                        schedule.ids.forEach((id) => onDelete(id));
                      }
                    } else {
                      onDelete(schedule.id);
                    }
                  }}
                  className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  title="Hapus"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
