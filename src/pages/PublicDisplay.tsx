import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScheduleTable from "../components/ScheduleTable";
import AnnouncementBar from "../components/AnnouncementBar";
import { useSchedule } from "../hooks/useSchedule";
import { useAnnouncement } from "../hooks/useAnnouncement";
import { Maximize2, Minimize2 } from "lucide-react";
import { formatDateIndonesian } from "../utils/date";

export default function PublicDisplay() {
  const { schedules } = useSchedule();
  const { announcement } = useAnnouncement();
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Correct sorting and transformation
  const processedSchedules = [...schedules]
    .sort((a, b) => {
      const dateDiff = a.tanggal.localeCompare(b.tanggal);
      if (dateDiff !== 0) return dateDiff;
      // Handle potentially undefined waktuMulai
      const timeA = a.waktuMulai || "";
      const timeB = b.waktuMulai || "";
      return timeA.localeCompare(timeB);
    })
    .map((s) => ({
      ...s,
      tanggal: formatDateIndonesian(s.tanggal),
    }));

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFsChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <Header />

      <main className="flex-1 px-8 py-6 flex flex-col justify-center min-h-0 overflow-hidden">
        <ScheduleTable schedules={processedSchedules} />

        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={toggleFullscreen}
            className="p-3 bg-navy-800/80 hover:bg-teal-600 text-teal-400 hover:text-white rounded-full backdrop-blur-sm transition-all shadow-lg border border-teal-500/30"
            title="Toggle TV Mode"
          >
            {isFullscreen ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
          </button>
        </div>
      </main>

      <div className="mt-auto">
        <AnnouncementBar announcement={announcement} />
        <Footer />
      </div>
    </div>
  );
}
