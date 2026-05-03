
import React from 'react';
import { AppSettings } from '../types';
import { CloseIcon } from './Icons';
import { shiftDateByYearSafe, getEndYearFromAcademicYear } from '../utils/academicYear';

interface NewYearWizardProps {
  isOpen: boolean;
  previousYear: string;
  currentYear: string;
  previousSettings: AppSettings | null;
  onAccept: (settings: AppSettings) => void;
  onDecline: () => void;
}

const NewYearWizard: React.FC<NewYearWizardProps> = ({
  isOpen,
  previousYear,
  currentYear,
  previousSettings,
  onAccept,
  onDecline,
}) => {
  if (!isOpen) return null;

  const endYear = getEndYearFromAcademicYear(currentYear);

  const handleAccept = () => {
    if (!previousSettings) {
      onDecline();
      return;
    }

    const newSettings: AppSettings = {
      ...previousSettings,
      academicYear: currentYear,
      school: {
        ...previousSettings.school,
        subtitle: `YKS${endYear} Geri Sayım`,
      },
      dates: {
        ...previousSettings.dates,
        start: shiftDateByYearSafe(previousSettings.dates.start, 1),
        end: shiftDateByYearSafe(previousSettings.dates.end, 1),
      },
      exams: previousSettings.exams.map((exam) => ({
        ...exam,
        startDate: shiftDateByYearSafe(exam.startDate, 1),
        date: shiftDateByYearSafe(exam.date, 1),
      })),
    };

    onAccept(newSettings);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        {/* Modal */}
        <div
          className="bg-card-light dark:bg-card-dark rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-white/10 relative transform transition-all scale-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-accent/20 to-transparent p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
            <h2 className="text-xl font-bold text-accent">Yeni Eğitim Öğretim Yılı</h2>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <p className="text-sm opacity-80 leading-relaxed">
              <strong className="text-accent">{previousYear}</strong> akademik yılı sona erdi.
              Artık <strong className="text-accent">{currentYear}</strong> dönemindesiniz.
            </p>

            {previousSettings ? (
              <div className="bg-black/5 dark:bg-white/5 p-3 rounded-lg border border-black/5 dark:border-white/5 text-sm space-y-2">
                <p className="font-medium">Önceki yıl ayarlarınız bulundu:</p>
                <ul className="list-disc list-inside opacity-70 space-y-1 text-xs">
                  <li>Okul bilgileri ve sosyal medya bağlantıları korunacak</li>
                  <li>Sınav tarihleri otomatik 1 yıl ileri alınacak</li>
                  <li>Alt başlık YKS{endYear} olarak güncellenecek</li>
                </ul>
              </div>
            ) : (
              <p className="text-sm opacity-60">
                Önceki yıl ayarınız bulunamadı. Varsayılan ayarlar yüklenecek.
              </p>
            )}

            <div className="flex flex-col gap-2 pt-2">
              {previousSettings && (
                <button
                  onClick={handleAccept}
                  className="w-full py-2.5 px-4 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium transition-colors text-sm shadow-lg shadow-accent/20"
                >
                  Önceki Yıl Ayarlarını Kopyala ve Güncelle
                </button>
              )}
              <button
                onClick={onDecline}
                className="w-full py-2.5 px-4 rounded-lg bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 text-text-light dark:text-text-dark font-medium transition-colors text-sm"
              >
                Varsayılan Ayarlarla Başla
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewYearWizard;
