import React, { useMemo } from 'react';

interface ProgressBarProps {
  startDate: string;
  endDate: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ startDate, endDate }) => {
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
    <div className="card bg-card-light dark:bg-card-dark p-6 rounded-xl border border-gray-200 dark:border-white/10 shadow-lg mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <span className="w-2 h-2 rounded-full bg-accent mr-2"></span>
          YKS Serüveni İlerleme Durumu
        </h3>
        <span className="text-lg font-bold text-accent">{percentage.toFixed(2)}%</span>
      </div>
      
      <div className="h-3 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400 bg-[length:200%_100%] animate-gradient-x transition-all duration-700 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="flex justify-between text-xs opacity-60 mt-3 font-medium">
        <span>Başlangıç: {new Date(startDate).toLocaleDateString('tr-TR')}</span>
        <span>Hedef: {new Date(endDate).toLocaleDateString('tr-TR')}</span>
      </div>
    </div>
  );
};

export default ProgressBar;