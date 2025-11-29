
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TimeLeft } from '../types';

interface CountdownCardProps {
  title: string;
  startDate: string;
  date: string;
  startTime: string;
  endTime: string;
}

const CountdownCard: React.FC<CountdownCardProps> = ({ title, startDate, date, startTime, endTime }) => {
  // Countdown Logic
  const calculateTimeLeft = useCallback((): TimeLeft => {
    const targetDateTime = new Date(`${date}T${startTime}:00`).getTime();
    const now = new Date().getTime();
    const difference = targetDateTime - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isCompleted: false,
    };
  }, [date, startTime]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  // Progress Bar Logic
  const percentage = useMemo(() => {
    const start = new Date(startDate).getTime();
    const target = new Date(`${date}T${startTime}:00`).getTime();
    const now = new Date().getTime();

    if (now < start) return 0;
    if (now > target) return 100;

    const totalDuration = target - start;
    const elapsed = now - start;
    
    if (totalDuration <= 0) return 100;

    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  }, [startDate, date, startTime]);

  const digits = [
    { label: 'GÜN', value: timeLeft.days },
    { label: 'SAAT', value: timeLeft.hours },
    { label: 'DAKİKA', value: timeLeft.minutes },
    { label: 'SANİYE', value: timeLeft.seconds },
  ];

  return (
    <div className="card bg-card-light dark:bg-card-dark rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <div className="card-header p-6 bg-blue-500/10 border-b border-gray-100 dark:border-white/5 relative overflow-hidden">
         {/* Decorative circle */}
         <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-accent/10 rounded-full blur-xl"></div>
         
        <h2 className="text-2xl font-bold text-accent relative z-10">{title}</h2>
        <div className="flex items-center text-sm opacity-70 mt-1 relative z-10 space-x-2">
            <span>{new Date(date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span>•</span>
            <span>{startTime}</span>
        </div>
      </div>
      
      <div className="p-6 flex-grow flex flex-col justify-center">
        {timeLeft.isCompleted ? (
           <div className="text-center py-8">
               <span className="text-xl font-bold text-green-500">Sınav Başladı veya Tamamlandı!</span>
           </div>
        ) : (
            <>
                <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-6">
                {digits.map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                    <div className="w-full aspect-square max-w-[80px] flex items-center justify-center bg-blue-500/10 dark:bg-blue-500/20 text-accent text-lg sm:text-2xl md:text-3xl font-bold rounded-lg mb-2 shadow-inner border border-blue-500/10">
                        {String(item.value).padStart(2, '0')}
                    </div>
                    <span className="text-[10px] sm:text-xs font-semibold uppercase opacity-60 tracking-wider">{item.label}</span>
                    </div>
                ))}
                </div>

                {/* Individual Progress Bar */}
                <div className="w-full">
                    <div className="flex justify-between items-end mb-1">
                        <span className="text-[10px] uppercase font-bold opacity-40">İlerleme</span>
                        <span className="text-xs font-bold text-accent">%{percentage.toFixed(1)}</span>
                    </div>
                    <div className="h-2 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                        <div 
                            className="h-full rounded-full bg-accent transition-all duration-700 ease-out"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                </div>
            </>
        )}
      </div>
    </div>
  );
};

export default CountdownCard;
