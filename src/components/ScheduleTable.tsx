import type { ScheduleItem } from "../types";
import { formatDateIndonesian } from "../utils/date";

interface ScheduleTableProps {
  schedules: ScheduleItem[];
}

export default function ScheduleTable({ schedules }: ScheduleTableProps) {
  if (schedules.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500 bg-navy-800/50 rounded-lg border border-navy-700">
        <div className="text-4xl mb-2">📅</div>
        <p className="text-lg">Tidak ada jadwal kegiatan untuk ditampilkan</p>
      </div>
    );
  }

  // Function to group consecutive schedules with same details
  const getGroupedSchedules = (items: ScheduleItem[]) => {
    const grouped: (ScheduleItem & { dateRange?: string })[] = [];

    if (items.length === 0) return grouped;

    let currentGroup = { ...items[0] };
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
        count++;
      } else {
        // Push previous group
        if (count > 1) {
          grouped.push({
            ...currentGroup,
            hari: "", // Will be replaced by range logic display
            dateRange: `${formatDateIndonesian(startDate)} - ${formatDateIndonesian(endDate)}`,
          });
        } else {
          grouped.push(currentGroup);
        }

        // Start new group
        currentGroup = { ...item };
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
      });
    } else {
      grouped.push(currentGroup);
    }

    return grouped;
  };

  const displaySchedules = getGroupedSchedules(schedules);

  return (
    <div className="w-full h-full overflow-hidden flex flex-col">
      <div className="bg-navy-800 rounded-t-3xl border border-navy-700 overflow-y-auto flex-1 shadow-2xl scrollbar-hide">
        <table className="w-full relative">
          <thead className="sticky top-0 z-10">
            <tr className="bg-navy-900 text-teal-400 border-b border-teal-500/30 shadow-md">
              <th className="py-5 px-6 text-center w-[70px] font-bold text-lg border-r border-teal-500/20">
                NO
              </th>
              <th className="py-5 px-6 text-left w-[250px] font-bold text-lg border-r border-teal-500/20">
                HARI / TANGGAL
              </th>
              <th className="py-5 px-6 text-left font-bold text-lg border-r border-teal-500/20">
                URAIAN KEGIATAN
              </th>
              <th className="py-5 px-6 text-center w-[160px] font-bold text-lg border-r border-teal-500/20">
                WAKTU
              </th>
              <th className="py-5 px-6 text-center w-[200px] font-bold text-lg border-r border-teal-500/20">
                TEMPAT
              </th>
              <th className="py-5 px-6 text-center w-[180px] font-bold text-lg">
                KETERANGAN
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-700">
            {displaySchedules.map((item, index) => (
              <tr
                key={index}
                className="hover:bg-teal-900/10 transition-colors duration-150 odd:bg-navy-900 even:bg-navy-800/50"
              >
                <td className="py-4 px-5 text-center font-bold text-slate-500 text-xl border-r border-navy-700 bg-navy-900/50">
                  {index + 1}
                </td>
                <td className="py-4 px-5 border-r border-navy-700">
                  {item.dateRange ? (
                    <div className="flex flex-col">
                      <span className="text-white font-bold text-lg leading-tight">
                        {item.dateRange}
                      </span>
                      <span className="text-teal-500 text-sm font-medium mt-1 uppercase tracking-wider">
                        (Beberapa Hari)
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <span className="text-white font-bold text-lg capitalize mb-0.5">
                        {item.hari}
                      </span>
                      <span className="text-slate-400 text-base">
                        {formatDateIndonesian(item.tanggal)}
                      </span>
                    </div>
                  )}
                </td>
                <td className="py-4 px-5 border-r border-navy-700">
                  <div className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-900/40 to-teal-900/40 rounded-lg border-l-4 border-cyan-500 shadow-sm w-full">
                    <span className="text-cyan-100 font-bold text-lg uppercase tracking-wide drop-shadow-sm">
                      {item.kegiatan}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-5 text-center border-r border-navy-700">
                  <span className="text-cyan-400 font-bold text-lg font-mono">
                    {item.waktuMulai && item.waktuSelesai
                      ? `${item.waktuMulai} - ${item.waktuSelesai}`
                      : "-"}
                  </span>
                </td>
                <td className="py-4 px-5 text-slate-300 border-r border-navy-700 text-center text-lg font-medium">
                  {item.tempat || "-"}
                </td>
                <td className="py-4 px-5 text-center">
                  {item.keterangan ? (
                    <span className="inline-block px-3 py-1 bg-red-900/30 text-red-400 rounded border border-red-900/50 text-base font-medium">
                      {item.keterangan}
                    </span>
                  ) : (
                    <span className="text-slate-600">-</span>
                  )}
                </td>
              </tr>
            ))}

            {displaySchedules.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="py-20 text-center text-slate-500 text-xl italic"
                >
                  Belum ada jadwal kegiatan yang terdaftar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
