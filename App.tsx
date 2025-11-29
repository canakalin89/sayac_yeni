
import React, { useState, useEffect } from 'react';
import { AppSettings, SocialPlatform } from './types';
import { DEFAULT_SETTINGS, THEME_COLORS } from './constants';
import SettingsPanel from './components/SettingsPanel';
import CountdownCard from './components/CountdownCard';
import ProgressBar from './components/ProgressBar';
import { InstagramIcon, TwitterIcon, YouTubeIcon, PhoneIcon, SettingsIcon, GlobeIcon, LinkIcon, ChartIcon, UserIcon } from './components/Icons';

const App: React.FC = () => {
  // --- State Management ---
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('yks-countdown-settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        
        // --- MIGRATION LOGIC ---
        // If data is old (has 'social' object instead of 'socialLinks' array), migrate it
        if (!parsed.socialLinks && parsed.social) {
            const newSocialLinks = [];
            let idCounter = 1;

            if (parsed.social.instagram) {
                newSocialLinks.push({ id: (idCounter++).toString(), platform: 'instagram', url: parsed.social.instagram, label: 'Instagram', isVisible: true });
            }
            if (parsed.social.twitter) {
                newSocialLinks.push({ id: (idCounter++).toString(), platform: 'twitter', url: parsed.social.twitter, label: 'Twitter/X', isVisible: true });
            }
            if (parsed.social.youtube) {
                newSocialLinks.push({ id: (idCounter++).toString(), platform: 'youtube', url: parsed.social.youtube, label: 'YouTube', isVisible: true });
            }
            if (parsed.social.phone) {
                newSocialLinks.push({ id: (idCounter++).toString(), platform: 'phone', url: parsed.social.phone, label: 'Telefon', isVisible: true });
            }

            // Add Default Website if not present
            newSocialLinks.unshift({
                id: (idCounter++).toString(),
                platform: 'website',
                url: 'https://azizsancaranadolu.meb.k12.tr/',
                label: 'Web Sitesi',
                isVisible: true
            });

            parsed.socialLinks = newSocialLinks;
            delete parsed.social; // Remove old key
        }

        // Ensure array safety
        if (!Array.isArray(parsed.exams)) {
            return DEFAULT_SETTINGS;
        }
        
        // Migrate exams to include startDate if missing
        parsed.exams = parsed.exams.map((exam: any) => ({
            ...exam,
            startDate: exam.startDate || parsed.dates.start || DEFAULT_SETTINGS.dates.start
        }));

        if (!Array.isArray(parsed.socialLinks)) {
            parsed.socialLinks = DEFAULT_SETTINGS.socialLinks;
        }

        // Ensure color is present for older saves
        if (!parsed.color) {
            parsed.color = DEFAULT_SETTINGS.color;
        }

        // Ensure dates title exists
        if (!parsed.dates.title) {
            parsed.dates.title = DEFAULT_SETTINGS.dates.title;
        }

        return parsed;
      } catch (e) {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [visitCount, setVisitCount] = useState<number | null>(null);
  const [logoError, setLogoError] = useState(false);

  // --- Effects ---
  
  // Persist settings
  useEffect(() => {
    localStorage.setItem('yks-countdown-settings', JSON.stringify(settings));
  }, [settings]);

  // Reset logo error when URL changes
  useEffect(() => {
    setLogoError(false);
  }, [settings.school.logoUrl]);

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

  // Visit Counter Effect
  useEffect(() => {
    const fetchCount = async () => {
      try {
        // Create a URL-safe key from the school title to ensure uniqueness per school name
        const key = settings.school.title
            .toLowerCase()
            .trim()
            .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '') || 'default-school-yks';
            
        // API Key (Namespace) provided by user
        const NAMESPACE_ID = 'ut_RJmfCA1gQ2URIJ24wzQDzvLQ66sWtUouCLyW1vFv';
        
        // Using counterapi.dev - format: /v1/{namespace}/{key}/up
        const response = await fetch(`https://api.counterapi.dev/v1/${NAMESPACE_ID}/${key}/up`);
        const data = await response.json();
        
        if (data && typeof data.count === 'number') {
          setVisitCount(data.count);
        }
      } catch (error) {
        console.error('Counter API error:', error);
      }
    };

    fetchCount();
  }, [settings.school.title]);

  // --- Handlers ---
  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
  };

  const handleResetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  // Filter visible exams
  const visibleExams = settings.exams.filter(exam => exam.isVisible);
  const visibleLinks = settings.socialLinks.filter(link => link.isVisible);

  // Helper to get icon
  const getIcon = (platform: SocialPlatform) => {
      switch(platform) {
          case 'instagram': return <InstagramIcon />;
          case 'twitter': return <TwitterIcon />;
          case 'youtube': return <YouTubeIcon />;
          case 'phone': return <PhoneIcon />;
          case 'website': return <GlobeIcon />;
          default: return <LinkIcon />;
      }
  };

  // Helper to get href
  const getHref = (platform: SocialPlatform, url: string) => {
      if (platform === 'phone') return `tel:${url}`;
      
      let finalUrl = url;
      if (platform === 'instagram' && !url.startsWith('http')) finalUrl = `https://instagram.com/${url.replace('@', '')}`;
      if (platform === 'twitter' && !url.startsWith('http')) finalUrl = `https://twitter.com/${url.replace('@', '')}`;
      if (platform === 'youtube' && !url.startsWith('http')) finalUrl = `https://youtube.com/${url}`;
      
      // Default fallback for others if not absolute
      if (!finalUrl.startsWith('http')) return `https://${finalUrl}`;
      
      return finalUrl;
  };

  // Get main website URL for logo click
  const websiteLink = settings.socialLinks.find(link => link.platform === 'website') || settings.socialLinks[0];
  const logoHref = websiteLink ? getHref(websiteLink.platform, websiteLink.url) : '#';

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
            {/* Logo - Clickable */}
            {settings.school.logoUrl && (
                <a 
                  href={logoHref} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-28 h-28 rounded-full bg-white dark:bg-white shadow-xl flex items-center justify-center mb-8 border-4 border-white/20 dark:border-white/10 p-2 transition-transform hover:scale-105 duration-300 overflow-hidden cursor-pointer group"
                  title="Web sitesine git"
                >
                    {!logoError ? (
                      <img 
                          src={settings.school.logoUrl} 
                          alt="Logo" 
                          className="w-full h-full object-contain"
                          onError={() => setLogoError(true)}
                      />
                    ) : (
                      <div className="text-gray-400 group-hover:text-accent transition-colors">
                        <GlobeIcon />
                      </div>
                    )}
                </a>
            )}

            {/* Titles */}
            <h1 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight text-accent dark:text-accent-hover drop-shadow-sm">
              {settings.school.title}
            </h1>
            <p className="text-xl md:text-2xl font-medium mb-6 opacity-90">{settings.school.subtitle}</p>
            <p className="text-sm md:text-base max-w-2xl opacity-70 leading-relaxed mb-8">
              {settings.school.description}
            </p>

            {/* Social & Contact Links */}
            <div className="flex flex-wrap justify-center gap-3">
              {visibleLinks.map((link) => (
                  <a 
                    key={link.id}
                    href={getHref(link.platform, link.url)} 
                    target={link.platform === 'phone' ? '_self' : '_blank'} 
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all hover:-translate-y-1 text-sm font-medium"
                  >
                    {getIcon(link.platform)}
                    <span className="hidden sm:inline">{link.label || link.url}</span>
                  </a>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-6xl px-4 -mt-8 relative z-20 pb-20">
        
        <ProgressBar 
            title={settings.dates.title}
            startDate={settings.dates.start}
            endDate={settings.dates.end}
        />

        {visibleExams.length > 0 ? (
            <div className={`grid grid-cols-1 ${visibleExams.length === 1 ? 'md:grid-cols-1 max-w-xl mx-auto' : visibleExams.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' : 'md:grid-cols-3'} gap-6`}>
            {visibleExams.map((exam) => (
                <CountdownCard 
                    key={exam.id}
                    title={exam.name} 
                    startDate={exam.startDate}
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
        <div className="container mx-auto flex flex-col items-center justify-center space-y-4">
            
            {/* Visit Counter */}
            {visitCount !== null && (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 text-xs font-mono opacity-70 hover:opacity-100 transition-opacity text-accent">
                    <ChartIcon />
                    <span>{visitCount.toLocaleString()} Görüntülenme</span>
                </div>
            )}

            <div className="flex flex-col items-center space-y-1">
                <p className="opacity-70">{settings.school.title}</p>
                <p className="font-bold text-accent text-base tracking-wide">
                    Tasarım ve Kodlama: <a href="https://instagram.com/can_akalin" target="_blank" rel="noreferrer" className="hover:underline hover:text-accent-hover transition-colors">Can AKALIN</a>
                </p>
            </div>
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
