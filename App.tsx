import React, { useState, useEffect, useMemo } from 'react';
import type { AppSettings, SocialPlatform } from './types';
import { getDefaultSettings, THEME_COLORS, DATA_VERSION } from './constants';
import SettingsPanel from './components/SettingsPanel';
import CountdownCard from './components/CountdownCard';
import ProgressBar from './components/ProgressBar';
import NewYearWizard from './components/NewYearWizard';
import {
  getCurrentAcademicYear,
  getNextAcademicYear,
  getEndYearFromAcademicYear,
  getStorageKey,
  getLegacyStorageKey,
  getPreviousAcademicYear,
} from './utils/academicYear';
import { InstagramIcon, TwitterIcon, YouTubeIcon, PhoneIcon, GlobeIcon, LinkIcon, ChartIcon } from './components/Icons';

const CURRENT_YEAR = getCurrentAcademicYear();

export default function App() {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const defaults = getDefaultSettings(CURRENT_YEAR);

    const migrateSettings = (parsed: any): AppSettings => {
      if (!parsed.socialLinks && parsed.social) {
        const newSocialLinks = [];
        let idCounter = 1;
        if (parsed.social.instagram) newSocialLinks.push({ id: (idCounter++).toString(), platform: 'instagram', url: parsed.social.instagram, label: 'Instagram', isVisible: true });
        if (parsed.social.twitter) newSocialLinks.push({ id: (idCounter++).toString(), platform: 'twitter', url: parsed.social.twitter, label: 'Twitter/X', isVisible: true });
        if (parsed.social.youtube) newSocialLinks.push({ id: (idCounter++).toString(), platform: 'youtube', url: parsed.social.youtube, label: 'YouTube', isVisible: true });
        if (parsed.social.phone) newSocialLinks.push({ id: (idCounter++).toString(), platform: 'phone', url: parsed.social.phone, label: 'Telefon', isVisible: true });
        newSocialLinks.unshift({ id: (idCounter++).toString(), platform: 'website', url: 'https://azizsancaranadolu.meb.k12.tr/', label: 'Web Sitesi', isVisible: true });
        parsed.socialLinks = newSocialLinks;
        delete parsed.social;
      }
      if (!Array.isArray(parsed.exams)) parsed.exams = defaults.exams;
      parsed.exams = parsed.exams.map((exam: any) => ({ ...exam, startDate: exam.startDate || parsed.dates?.start || defaults.dates.start }));
      if (!Array.isArray(parsed.socialLinks)) parsed.socialLinks = defaults.socialLinks;
      if (!parsed.color) parsed.color = defaults.color;
      if (!parsed.dates?.title) { parsed.dates = parsed.dates || {}; parsed.dates.title = defaults.dates.title; }

      // Veri versiyonu kontrolü: eski versiyon ise sınav tarihleri ve schoolOpening güncelle
      if ((parsed.dataVersion || 0) < DATA_VERSION) {
        parsed.exams = defaults.exams;
        parsed.dates = defaults.dates;
        parsed.schoolOpening = defaults.schoolOpening;
        parsed.dataVersion = DATA_VERSION;
      }

      if (!parsed.schoolOpening) {
        parsed.schoolOpening = defaults.schoolOpening;
      }

      parsed.academicYear = CURRENT_YEAR;
      return parsed;
    };

    const legacy = localStorage.getItem(getLegacyStorageKey());
    if (legacy) {
      try {
        const parsed = migrateSettings(JSON.parse(legacy));
        localStorage.setItem(getStorageKey(CURRENT_YEAR), JSON.stringify(parsed));
        localStorage.removeItem(getLegacyStorageKey());
        return parsed;
      } catch { return defaults; }
    }
    const saved = localStorage.getItem(getStorageKey(CURRENT_YEAR));
    if (saved) {
      try {
        return migrateSettings(JSON.parse(saved));
      } catch { return defaults; }
    }
    return defaults;
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [visitCount, setVisitCount] = useState<number | null>(null);
  const [logoError, setLogoError] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [previousSettings, setPreviousSettings] = useState<AppSettings | null>(null);

  // Keyboard shortcut: Ctrl + Shift + S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setIsSettingsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(getStorageKey(CURRENT_YEAR));
    if (!saved) {
      const prevYear = getPreviousAcademicYear(CURRENT_YEAR);
      const prevSaved = localStorage.getItem(getStorageKey(prevYear));
      if (prevSaved) {
        try { setPreviousSettings(JSON.parse(prevSaved)); setShowWizard(true); } catch {}
      }
    }
  }, []);

  useEffect(() => { localStorage.setItem(getStorageKey(CURRENT_YEAR), JSON.stringify(settings)); }, [settings]);
  useEffect(() => { setLogoError(false); }, [settings.school.logoUrl]);
  useEffect(() => {
    if (settings.theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    const selectedColor = THEME_COLORS[settings.color] || THEME_COLORS.blue;
    document.documentElement.style.setProperty('--color-accent', selectedColor.main);
    document.documentElement.style.setProperty('--color-accent-hover', selectedColor.hover);
  }, [settings.theme, settings.color]);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const key = settings.school.title.toLowerCase().trim().replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'default-school-yks';
        const NAMESPACE_ID = 'ut_RJmfCA1gQ2URIJ24wzQDzvLQ66sWtUouCLyW1vFv';
        const response = await fetch(`https://api.counterapi.dev/v1/${NAMESPACE_ID}/${key}/up`);
        const data = await response.json();
        if (data && typeof data.count === 'number') setVisitCount(data.count);
      } catch (error) { console.error('Counter API error:', error); }
    };
    fetchCount();
  }, [settings.school.title]);

  const handleUpdateSettings = (newSettings: AppSettings) => setSettings(newSettings);
  const handleResetSettings = () => setSettings(getDefaultSettings(CURRENT_YEAR));
  const handleWizardAccept = (newSettings: AppSettings) => { setSettings(newSettings); setShowWizard(false); };
  const handleWizardDecline = () => { setSettings(getDefaultSettings(CURRENT_YEAR)); setShowWizard(false); };

  const visibleExams = settings.exams.filter(exam => exam.isVisible);
  const visibleLinks = settings.socialLinks.filter(link => link.isVisible);

  // Faz tespiti: sınavlar aktif / okulların açılışı / sonraki yıl
  const [phase, setPhase] = useState<'exams' | 'school-opening'>('exams');
  const [nextYearSettings, setNextYearSettings] = useState<AppSettings | null>(null);

  useEffect(() => {
    const checkPhase = () => {
      const now = Date.now();
      const allExamsDone = settings.exams.length > 0 && settings.exams.every(exam => {
        const endTime = new Date(`${exam.date}T${exam.endTime}:00`).getTime();
        return now > endTime;
      });

      if (allExamsDone && settings.schoolOpening?.date) {
        const schoolOpeningTime = new Date(`${settings.schoolOpening.date}T08:00:00`).getTime();
        if (now < schoolOpeningTime) {
          setPhase('school-opening');
          return;
        }
        // Okul açıldıysa, sonraki yılın ayarlarını yükle
        const nextYear = getNextAcademicYear(CURRENT_YEAR);
        const nextSaved = localStorage.getItem(getStorageKey(nextYear));
        const nextSettings = nextSaved ? JSON.parse(nextSaved) : getDefaultSettings(nextYear);
        setNextYearSettings(nextSettings);
        setPhase('exams');
        return;
      }
      setPhase('exams');
    };
    checkPhase();
    const timer = setInterval(checkPhase, 60000);
    return () => clearInterval(timer);
  }, [settings.exams, settings.schoolOpening]);

  const displayExams = useMemo(() => {
    if (phase === 'exams' && nextYearSettings) {
      return nextYearSettings.exams.filter(e => e.isVisible);
    }
    return visibleExams;
  }, [phase, nextYearSettings, visibleExams]);

  const getIcon = (platform: SocialPlatform) => {
    switch (platform) {
      case 'instagram': return <InstagramIcon />;
      case 'twitter': return <TwitterIcon />;
      case 'youtube': return <YouTubeIcon />;
      case 'phone': return <PhoneIcon />;
      case 'website': return <GlobeIcon />;
      default: return <LinkIcon />;
    }
  };

  const getHref = (platform: SocialPlatform, url: string) => {
    if (platform === 'phone') return `tel:${url}`;
    let finalUrl = url;
    if (platform === 'instagram' && !url.startsWith('http')) finalUrl = `https://instagram.com/${url.replace('@', '')}`;
    if (platform === 'twitter' && !url.startsWith('http')) finalUrl = `https://twitter.com/${url.replace('@', '')}`;
    if (platform === 'youtube' && !url.startsWith('http')) finalUrl = `https://youtube.com/${url}`;
    if (!finalUrl.startsWith('http')) return `https://${finalUrl}`;
    return finalUrl;
  };

  const websiteLink = settings.socialLinks.find(link => link.platform === 'website') || settings.socialLinks[0];
  const logoHref = websiteLink ? getHref(websiteLink.platform, websiteLink.url) : '#';

  return (
    <div className="min-h-screen flex flex-col relative dark:mesh-bg bg-bg-light dark:bg-bg-dark">

      {/* Header */}
      <header className="relative pb-20 pt-16 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[30%] -left-[10%] w-[60%] h-[60%] bg-accent/20 rounded-full blur-[120px] animate-float"></div>
          <div className="absolute top-[10%] -right-[10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[100px] animate-float-delayed"></div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col items-center text-center">
            {settings.school.logoUrl && (
              <a href={logoHref} target="_blank" rel="noreferrer"
                className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden mb-10 block transition-transform hover:scale-110 duration-300"
                title="Web sitesine git">
                {!logoError ? (
                  <img src={settings.school.logoUrl} alt="Logo" className="w-full h-full object-cover block" onError={() => setLogoError(true)} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-white/40"><GlobeIcon /></div>
                )}
              </a>
            )}

            <h1 className="text-4xl md:text-7xl font-black mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-accent to-slate-900/80 dark:from-white dark:via-accent dark:to-white/80 drop-shadow-lg">
              {settings.school.title}
            </h1>
            <p className="text-2xl md:text-4xl font-bold mb-4 opacity-90 bg-clip-text text-transparent bg-gradient-to-r from-accent to-purple-500">
              {phase === 'school-opening'
                ? `${settings.schoolOpening?.label || 'Okulların Açılışı'} Geri Sayım`
                : `YKS${getEndYearFromAcademicYear(nextYearSettings ? getNextAcademicYear(CURRENT_YEAR) : CURRENT_YEAR)} Geri Sayım`}
            </p>
            <p className="text-sm md:text-base max-w-xl opacity-60 leading-relaxed mb-10">
              {settings.school.description}
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              {visibleLinks.map((link) => (
                <a key={link.id} href={getHref(link.platform, link.url)}
                  target={link.platform === 'phone' ? '_self' : '_blank'} rel="noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full glass text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/20 border border-black/10 dark:border-white/10 text-slate-800 dark:text-white">
                  {getIcon(link.platform)}
                  <span className="hidden sm:inline">{link.label || link.url}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-6xl px-4 -mt-6 relative z-20 pb-24">

        {phase === 'school-opening' && settings.schoolOpening ? (
          <>
            <ProgressBar
              title="Yaz Tatili İlerleme Durumu"
              startDate={settings.exams.reduce((latest, exam) => {
                const d = `${exam.date}T${exam.endTime}:00`;
                return d > latest ? d : latest;
              }, '').split('T')[0]}
              endDate={settings.schoolOpening.date}
            />
            <div className="max-w-lg mx-auto">
              <CountdownCard
                title={settings.schoolOpening.label}
                startDate={settings.exams.reduce((latest, exam) => {
                  const d = exam.date;
                  return d > latest ? d : latest;
                }, '')}
                date={settings.schoolOpening.date}
                startTime="08:00"
                endTime="17:00"
                hideEstimatedNote
              />
            </div>
          </>
        ) : (
          <>
            <ProgressBar
              title={nextYearSettings ? nextYearSettings.dates.title : settings.dates.title}
              startDate={nextYearSettings ? nextYearSettings.dates.start : settings.dates.start}
              endDate={nextYearSettings ? nextYearSettings.dates.end : settings.dates.end}
            />

            {displayExams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
                {displayExams.map((exam, index) => (
                  <div key={exam.id} className="h-full" style={{ animationDelay: `${index * 100}ms` }}>
                    <CountdownCard
                      title={exam.name}
                      startDate={exam.startDate}
                      date={exam.date}
                      startTime={exam.startTime}
                      endTime={exam.endTime}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 opacity-50 glass rounded-2xl">
                <p className="text-lg">Gösterilecek sayaç bulunamadı.</p>
                <p className="text-sm mt-2 opacity-70">Ayarlar'dan yeni sayaç ekleyebilir veya mevcut olanları görünür yapabilirsiniz.</p>
              </div>
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto py-10 text-center text-sm border-t border-black/5 dark:border-white/5 glass">
        <div className="container mx-auto flex flex-col items-center justify-center space-y-4">
          {visitCount !== null && (
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-mono opacity-70 hover:opacity-100 transition-opacity text-accent">
              <ChartIcon />
              <span>{visitCount.toLocaleString()} Görüntülenme</span>
            </div>
          )}
          <div className="flex flex-col items-center space-y-1">
            <p className="opacity-50">{settings.school.title}</p>
            <p className="font-bold text-accent text-base tracking-wide">
              Tasarım ve Kodlama: <a href="https://instagram.com/can_akalin" target="_blank" rel="noreferrer" className="hover:underline hover:text-accent-hover transition-colors">Can AKALIN</a>
            </p>
          </div>
        </div>
      </footer>

      {/* Invisible corner trigger + keyboard hint */}
      <div
        onClick={() => setIsSettingsOpen(true)}
        className="fixed top-0 right-0 w-16 h-16 z-30 cursor-pointer group"
        title="Ayarlar"
      >
        <div className="w-full h-full flex items-start justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-2 h-2 rounded-full bg-accent/60 shadow-[0_0_8px_var(--color-accent)]"></div>
        </div>
      </div>
      <div className="fixed bottom-4 right-4 z-30 text-[10px] opacity-0 hover:opacity-30 transition-opacity text-slate-500 dark:text-white/30 select-none pointer-events-none">
        Ctrl+Shift+S
      </div>

      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}
        settings={settings} onUpdate={handleUpdateSettings} onReset={handleResetSettings} currentYear={CURRENT_YEAR} />

      <NewYearWizard isOpen={showWizard} previousYear={getPreviousAcademicYear(CURRENT_YEAR)} currentYear={CURRENT_YEAR}
        previousSettings={previousSettings} onAccept={handleWizardAccept} onDecline={handleWizardDecline} />
    </div>
  );
}
