import type { Announcement } from "../types";
import { AlertTriangle } from "lucide-react";

interface AnnouncementBarProps {
  announcement: Announcement;
}

export default function AnnouncementBar({
  announcement,
}: AnnouncementBarProps) {
  if (!announcement.enabled || !announcement.text) return null;

  return (
    <div className="bg-yellow-400 text-yellow-900 border-t-4 border-yellow-500 shadow-lg overflow-hidden relative flex items-center h-12">
      <div className="bg-yellow-500 h-full px-4 flex items-center z-20 shadow-md">
        <AlertTriangle className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1 overflow-hidden relative h-full flex items-center">
        <div className="whitespace-nowrap animate-marquee absolute top-1/2 -translate-y-1/2 font-bold text-lg tracking-wide w-full">
          {/* Duplicate text to ensure smooth loop if we use specialized marquee, but specific CSS animation handles it. 
               We will just render the text. With `animate-marquee` translating from 100% to -100%, simple text works. 
           */}
          {announcement.text}
        </div>
      </div>
    </div>
  );
}
