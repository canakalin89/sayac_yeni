import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { TimeLeft } from '../types';

interface CountdownCardProps {
  title: string;
  startDate: string;
  date: string;
  startTime: string;
  endTime: string;
}

export default function CountdownCard({ title, startDate, date, startTime, endTime }: CountdownCardProps) {
  const calculateTimeLeft = useCallback((): TimeLeft => {
    const targetDateTime = new Date(`${date}T${startTime}:00`).getTime();
    const now = new Date().getTime();
    const difference = targetDateTime - now;
    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: true };
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
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

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
    <div className="glass rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border border-black/10 dark:border-white/10 flex flex-col h-full fade-in-up">
      <div className="relative p-6 md:p-8">
        <div>
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="font-black text-accent tracking-tight text-2xl md:text-3xl">{title}</h2>
              <div className="flex items-center text-sm opacity-50 mt-2 space-x-2">
                <span>{new Date(date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <span className="opacity-30">•</span>
                <span>{startTime}</span>
              </div>
              <div className="text-[10px] opacity-30 mt-1">
                <span>Tahmini tarihtir. </span>
                <a href="https://www.osym.gov.tr/TR,9493/sinav-takvimi.html" target="_blank" rel="noreferrer" className="underline hover:text-accent transition-colors">Resmi ÖSYM takvimi →</a>
              </div>
            </div>
            {timeLeft.isCompleted && (
              <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/20">TAMAMLANDI</span>
            )}
          </div>

          {timeLeft.isCompleted ? (
            <div className="text-center py-8">
              <span className="text-xl font-bold text-green-400">Sınav Başladı veya Tamamlandı!</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-8">
                {digits.map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className="w-full aspect-square flex items-center justify-center rounded-xl mb-2 font-black tabular-nums bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 shadow-inner text-xl sm:text-2xl md:text-3xl text-slate-900 dark:text-white"
                    >
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <span className="font-semibold uppercase opacity-40 tracking-widest text-[10px]">{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="w-full">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[10px] uppercase font-bold opacity-30 tracking-wider">İlerleme</span>
                  <span className="text-sm font-bold text-accent">%{percentage.toFixed(1)}</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-accent to-purple-500 transition-all duration-700 ease-out relative shine-sweep" style={{ width: `${percentage}%` }} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
