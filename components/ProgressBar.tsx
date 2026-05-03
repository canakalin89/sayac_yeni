import React, { useMemo } from 'react';

interface ProgressBarProps {
  title: string;
  startDate: string;
  endDate: string;
}

export default function ProgressBar({ title, startDate, endDate }: ProgressBarProps) {
  const percentage = useMemo(() => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    if (now < start) return 0;
    if (now > end) return 100;
    const totalDuration = end - start;
    const elapsed = now - start;
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  }, [startDate, endDate]);

  return (
    <div className="glass rounded-2xl p-6 md:p-8 mb-6 shadow-xl border border-black/10 dark:border-white/10 fade-in-up">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg md:text-xl font-bold flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_10px_var(--color-accent)]"></span>
          {title}
        </h3>
        <span className="text-xl md:text-2xl font-black text-accent tabular-nums">{percentage.toFixed(2)}%</span>
      </div>

      <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden relative">
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent via-purple-500 to-accent bg-[length:200%_100%] animate-gradient-x transition-all duration-700 ease-out shadow-[0_0_20px_var(--color-accent)] relative"
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 shine-sweep rounded-full"></div>
        </div>
      </div>

      <div className="flex justify-between text-xs opacity-40 mt-4 font-medium">
        <span>Başlangıç: {new Date(startDate).toLocaleDateString('tr-TR')}</span>
        <span>Hedef: {new Date(endDate).toLocaleDateString('tr-TR')}</span>
      </div>
    </div>
  );
}
