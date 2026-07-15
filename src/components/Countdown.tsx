'use client';

import { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

interface CountdownProps {
  endTime: string;
}

export default function Countdown({ endTime }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const end = new Date(endTime).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = end - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <div className="flex items-center space-x-2 text-white font-mono bg-black/45 border border-slate-800/40 p-2.5 rounded-2xl w-fit">
      <Timer className="w-4 h-4 text-blue-400 mr-1 animate-pulse" />
      <div className="flex items-center space-x-1">
        <span className="bg-slate-900 border border-slate-850 px-2.5 py-1.5 rounded-lg text-xs font-black">{String(timeLeft.days).padStart(2, '0')}d</span>
        <span className="text-slate-500">:</span>
        <span className="bg-slate-900 border border-slate-850 px-2.5 py-1.5 rounded-lg text-xs font-black">{String(timeLeft.hours).padStart(2, '0')}h</span>
        <span className="text-slate-500">:</span>
        <span className="bg-slate-900 border border-slate-850 px-2.5 py-1.5 rounded-lg text-xs font-black">{String(timeLeft.minutes).padStart(2, '0')}m</span>
        <span className="text-slate-500">:</span>
        <span className="bg-slate-900 border border-slate-850 px-2.5 py-1.5 rounded-lg text-xs font-black">{String(timeLeft.seconds).padStart(2, '0')}s</span>
      </div>
    </div>
  );
}
