import React, { useState, useEffect } from 'react';
import { AppSettings } from './types';
import { DEFAULT_SETTINGS, THEME_COLORS } from './constants';
import SettingsPanel from './components/SettingsPanel';
import CountdownCard from './components/CountdownCard';
import ProgressBar from './components/ProgressBar';
import { InstagramIcon, TwitterIcon, YouTubeIcon, PhoneIcon, SettingsIcon } from './components/Icons';

const App: React.FC = () => {
  // --- State Management ---
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('yks-countdown-settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed.exams)) {
            return DEFAULT_SETTINGS;
        }
        // Ensure color is present for older saves
        if (!parsed.color) {
            parsed.color = DEFAULT_SETTINGS.color;
        }
        return parsed;
      } catch (e) {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // --- Effects ---
  
  // Persist settings
  useEffect(() => {
    localStorage.setItem('yks-countdown-settings', JSON.stringify(settings));
  }, [settings]);

  // Apply Theme & Color
  useEffect(() => {
    // Apply Dark/Light Mode
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Apply Color Theme
    const selectedColor = THEME_COLORS[settings.color] || THEME_COLORS.blue;
    document.documentElement.style.setProperty('--color-accent', selectedColor.main);
    document.documentElement.style.setProperty('--color-accent-hover', selectedColor.hover);

  }, [settings.theme, settings.color]);

  // --- Handlers ---
  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
  };

  const handleResetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  // Filter visible exams
  const visibleExams = settings.exams.filter(exam => exam.isVisible);

  return (
    <div className="min-h-screen flex flex-col relative">
      
      {/* Header Section */}
      <header className="relative bg-gradient-to-br from-accent/10 to-accent/5 pb-16 pt-12 px-4 border-b border-gray-200 dark:border-white/5">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
             <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-3xl"></div>
             <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col items-center text-center">
            {/* Logo */}
            {settings.school.logoUrl && (
                <div className="w-28 h-28 rounded-full bg-white dark:bg-white shadow-xl flex items-center justify-center mb-8 border-4 border-white/20 dark:border-white/10 p-2 transition-transform hover:scale-105 duration-300 overflow-hidden">
                <img 
                    src={settings.school.logoUrl} 
                    alt="Logo" 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                        // Hide if image fails or show placeholder
                         (e.target as HTMLImageElement).style.display = 'none';
                    }}
                />
                </div>
            )}

            {/* Titles */}
            <h1 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight text-accent dark:text-accent-hover drop-shadow-sm">
              {settings.school.title}
            </h1>
            <p className="text-xl md:text-2xl font-medium mb-6 opacity-90">{settings.school.subtitle}</p>
            <p className="text-sm md:text-base max-w-2xl opacity-70 leading-relaxed mb-8">
              {settings.school.description}
            </p>

            {/* Social Links */}
            <div className="flex flex-wrap justify-center gap-3">
              {settings.social.instagram && (
                <a 
                  href={`https://instagram.com/${settings.social.instagram.replace('@', '')}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all hover:-translate-y-1 text-sm font-medium"
                >
                  <InstagramIcon />
                  <span className="hidden sm:inline">Instagram</span>
                </a>
              )}
              {settings.social.twitter && (
                <a 
                  href={`https://twitter.com/${settings.social.twitter.replace('@', '')}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all hover:-translate-y-1 text-sm font-medium"
                >
                  <TwitterIcon />
                  <span className="hidden sm:inline">Twitter/X</span>
                </a>
              )}
               {settings.social.youtube && (
                <a 
                  href={`https://youtube.com/${settings.social.youtube}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all hover:-translate-y-1 text-sm font-medium"
                >
                  <YouTubeIcon />
                  <span className="hidden sm:inline">YouTube</span>
                </a>
              )}
               {settings.social.phone && (
                <a 
                  href={`tel:${settings.social.phone}`} 
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all hover:-translate-y-1 text-sm font-medium"
                >
                  <PhoneIcon />
                  <span className="hidden sm:inline">{settings.social.phone}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-6xl px-4 -mt-8 relative z-20 pb-20">
        
        <ProgressBar 
            startDate={settings.dates.start}
            endDate={settings.dates.end}
        />

        {visibleExams.length > 0 ? (
            <div className={`grid grid-cols-1 ${visibleExams.length === 1 ? 'md:grid-cols-1 max-w-xl mx-auto' : visibleExams.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' : 'md:grid-cols-3'} gap-6`}>
            {visibleExams.map((exam) => (
                <CountdownCard 
                    key={exam.id}
                    title={exam.name} 
                    date={exam.date}
                    startTime={exam.startTime}
                    endTime={exam.endTime}
                />
            ))}
            </div>
        ) : (
            <div className="text-center py-10 opacity-60">
                <p>Gösterilecek sayaç bulunamadı. Ayarlardan yeni sayaç ekleyebilir veya mevcut olanları görünür yapabilirsiniz.</p>
            </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 text-center text-sm border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-black/20">
        <div className="container mx-auto flex flex-col items-center justify-center space-y-2">
            <p className="opacity-70">{settings.school.title}</p>
            <p className="font-bold text-accent text-base tracking-wide">
                Tasarım ve Kodlama: <a href="https://instagram.com/can_akalin" target="_blank" rel="noreferrer" className="hover:underline hover:text-accent-hover transition-colors">Can AKALIN</a>
            </p>
        </div>
      </footer>

      {/* Floating Settings Button */}
      <button 
        onClick={() => setIsSettingsOpen(true)}
        className="fixed bottom-6 left-6 z-30 p-3 rounded-full bg-card-light dark:bg-card-dark text-text-light dark:text-text-dark shadow-xl hover:scale-110 transition-transform duration-300 border border-gray-200 dark:border-gray-700 hover:text-accent"
        aria-label="Ayarlar"
      >
        <SettingsIcon />
      </button>

      {/* Settings Drawer */}
      <SettingsPanel 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdate={handleUpdateSettings}
        onReset={handleResetSettings}
      />
    </div>
  );
};

export default App;