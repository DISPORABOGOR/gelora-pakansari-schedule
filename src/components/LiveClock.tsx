import { useState, useEffect } from "react";
import { formatFullDate, formatTime } from "../utils/date";

export default function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-end">
      <div className="text-gray-300 text-xl font-medium mb-1">
        {formatFullDate(time)}
      </div>
      <div className="text-5xl font-bold text-cyan-400 tracking-wide">
        {formatTime(time)}
      </div>
    </div>
  );
}
