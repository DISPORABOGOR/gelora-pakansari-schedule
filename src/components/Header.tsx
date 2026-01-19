import LiveClock from "./LiveClock";
// import { MapPin } from 'lucide-react';

interface HeaderProps {
  className?: string;
}

export default function Header({ className = "" }: HeaderProps) {
  return (
    <header
      className={`bg-navy-900 text-white p-6 border-b border-navy-700 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Logo Area */}
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden">
            <img
              src="/images/LOGO_DISPORA.PNG"
              alt="Logo Dispora"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Title Area */}
          <div>
            <h1 className="text-3xl font-bold tracking-wide text-teal-400 drop-shadow-sm">
              GELORA PAKANSARI
            </h1>
            <p className="text-gray-400 text-lg mt-1 font-medium">
              Unit Pelaksana Teknis Paspor Pakansari - Kabupaten Bogor
            </p>
          </div>
        </div>

        {/* Live Clock Area */}
        <div className="text-right">
          <LiveClock />
        </div>
      </div>
    </header>
  );
}
