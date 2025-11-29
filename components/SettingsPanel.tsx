
import React, { useState, useEffect } from 'react';
import { AppSettings, ExamConfig, ColorTheme, SocialLink, SocialPlatform } from '../types';
import { CloseIcon, EyeIcon, EyeOffIcon, TrashIcon, PlusIcon, InstagramIcon, TwitterIcon, YouTubeIcon, PhoneIcon, GlobeIcon, LinkIcon } from './Icons';
import { THEME_COLORS } from '../constants';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdate: (newSettings: AppSettings) => void;
  onReset: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdate,
  onReset,
}) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);

  // Sync local state when props change
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  // Live Preview Effect
  useEffect(() => {
    if (!isOpen) return;

    if (localSettings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const selectedColor = THEME_COLORS[localSettings.color] || THEME_COLORS.blue;
    document.documentElement.style.setProperty('--color-accent', selectedColor.main);
    document.documentElement.style.setProperty('--color-accent-hover', selectedColor.hover);

    return () => {};
  }, [localSettings.theme, localSettings.color, isOpen]);

  // Revert preview on close if not saved
  useEffect(() => {
    if (!isOpen) {
        if (settings.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        const selectedColor = THEME_COLORS[settings.color] || THEME_COLORS.blue;
        document.documentElement.style.setProperty('--color-accent', selectedColor.main);
        document.documentElement.style.setProperty('--color-accent-hover', selectedColor.hover);
    }
  }, [isOpen, settings]);


  const handleChange = (section: keyof AppSettings, key: string, value: string) => {
    // @ts-ignore
    setLocalSettings((prev) => ({
      ...prev,
      [section]: {
        // @ts-ignore
        ...prev[section],
        [key]: value,
      },
    }));
  };
  
  // --- Exam Management ---
  const handleExamChange = (id: string, field: keyof ExamConfig, value: string | boolean) => {
      setLocalSettings(prev => ({
          ...prev,
          exams: prev.exams.map(exam => 
            exam.id === id ? { ...exam, [field]: value } : exam
          )
      }));
  }

  const handleAddExam = () => {
    const newExam: ExamConfig = {
      id: Date.now().toString(),
      name: 'Yeni Sınav',
      startDate: new Date().toISOString().split('T')[0],
      date: new Date().toISOString().split('T')[0],
      startTime: '10:00',
      endTime: '12:00',
      isVisible: true
    };
    setLocalSettings(prev => ({
      ...prev,
      exams: [...prev.exams, newExam]
    }));
  };

  const handleRemoveExam = (id: string) => {
    setLocalSettings(prev => ({
      ...prev,
      exams: prev.exams.filter(exam => exam.id !== id)
    }));
  };

  const handleToggleExamVisibility = (id: string) => {
    setLocalSettings(prev => ({
      ...prev,
      exams: prev.exams.map(exam => 
        exam.id === id ? { ...exam, isVisible: !exam.isVisible } : exam
      )
    }));
  };

  // --- Social Link Management ---
  const handleSocialLinkChange = (id: string, field: keyof SocialLink, value: string | boolean) => {
    setLocalSettings(prev => ({
        ...prev,
        socialLinks: prev.socialLinks.map(link => 
          link.id === id ? { ...link, [field]: value } : link
        )
    }));
  }

  const handleAddSocialLink = () => {
    const newLink: SocialLink = {
        id: Date.now().toString(),
        platform: 'website',
        url: '',
        label: 'Yeni Bağlantı',
        isVisible: true
    };
    setLocalSettings(prev => ({
        ...prev,
        socialLinks: [...prev.socialLinks, newLink]
    }));
  }

  const handleRemoveSocialLink = (id: string) => {
    setLocalSettings(prev => ({
        ...prev,
        socialLinks: prev.socialLinks.filter(link => link.id !== id)
    }));
  }

  const handleToggleSocialVisibility = (id: string) => {
    setLocalSettings(prev => ({
        ...prev,
        socialLinks: prev.socialLinks.map(link => 
            link.id === id ? { ...link, isVisible: !link.isVisible } : link
        )
    }));
  }

  const handleApply = () => {
    onUpdate(localSettings);
    onClose();
  };

  const toggleTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTheme = e.target.checked ? 'dark' : 'light';
      setLocalSettings(prev => ({...prev, theme: newTheme}));
  }

  const handleColorChange = (color: ColorTheme) => {
      setLocalSettings(prev => ({...prev, color}));
  }

  const getPlatformIcon = (platform: SocialPlatform) => {
      switch(platform) {
          case 'instagram': return <InstagramIcon />;
          case 'twitter': return <TwitterIcon />;
          case 'youtube': return <YouTubeIcon />;
          case 'phone': return <PhoneIcon />;
          case 'website': return <GlobeIcon />;
          default: return <LinkIcon />;
      }
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className={`
        fixed top-5 right-5 bottom-auto rounded-xl z-50 w-96 max-h-[85vh] overflow-y-auto
        bg-card-light dark:bg-card-dark border border-gray-200 dark:border-gray-800
        shadow-2xl transition-transform duration-300 transform
        ${isOpen ? 'translate-x-0' : 'translate-x-[450px]'}
      `}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-white/10 pb-4">
            <h3 className="text-lg font-bold">Özelleştirme Ayarları</h3>
            <button onClick={onClose} className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors">
              <CloseIcon />
            </button>
          </div>

          <div className="space-y-6">
            {/* Theme & Color */}
            <div className="pb-5 border-b border-gray-200 dark:border-white/10 space-y-4">
                <p className="text-sm font-medium">Görünüm</p>
                
                {/* Light/Dark Toggle */}
                <div className="flex items-center justify-between">
                    <span className="text-xs opacity-70">Karanlık Mod</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={localSettings.theme === 'dark'} 
                            onChange={toggleTheme}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                    </label>
                </div>

                {/* Color Palette */}
                <div>
                    <span className="text-xs opacity-70 block mb-2">Tema Rengi</span>
                    <div className="flex gap-3 flex-wrap">
                        {(Object.keys(THEME_COLORS) as ColorTheme[]).map((c) => (
                            <button
                                key={c}
                                onClick={() => handleColorChange(c)}
                                className={`w-8 h-8 rounded-full transition-transform hover:scale-110 border-2 ${localSettings.color === c ? 'border-white ring-2 ring-gray-400 dark:ring-gray-500 scale-110' : 'border-transparent'}`}
                                style={{ backgroundColor: THEME_COLORS[c].main }}
                                aria-label={`${c} tema`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* School Info */}
            <div className="pb-5 border-b border-gray-200 dark:border-white/10 space-y-3">
              <p className="text-sm font-medium">Okul Bilgileri</p>
              <div>
                <label className="text-xs opacity-70 mb-1 block">Başlık</label>
                <input
                  type="text"
                  value={localSettings.school.title}
                  onChange={(e) => handleChange('school', 'title', e.target.value)}
                  className="w-full p-2 rounded-md text-sm bg-black/5 border border-black/10 dark:bg-white/5 dark:border-white/10 focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
              <div>
                <label className="text-xs opacity-70 mb-1 block">Alt Başlık</label>
                <input
                  type="text"
                  value={localSettings.school.subtitle}
                  onChange={(e) => handleChange('school', 'subtitle', e.target.value)}
                  className="w-full p-2 rounded-md text-sm bg-black/5 border border-black/10 dark:bg-white/5 dark:border-white/10 focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
              <div>
                <label className="text-xs opacity-70 mb-1 block">Okul Logosu (Resim URL)</label>
                <input
                  type="text"
                  value={localSettings.school.logoUrl}
                  placeholder="https://example.com/logo.png"
                  onChange={(e) => handleChange('school', 'logoUrl', e.target.value)}
                  className="w-full p-2 rounded-md text-sm bg-black/5 border border-black/10 dark:bg-white/5 dark:border-white/10 focus:outline-none focus:ring-1 focus:ring-accent"
                />
                <p className="text-[10px] opacity-50 mt-1">Okul logosunun internet adresini buraya yapıştırın.</p>
              </div>
              <div>
                <label className="text-xs opacity-70 mb-1 block">Açıklama</label>
                <textarea
                  rows={3}
                  value={localSettings.school.description}
                  onChange={(e) => handleChange('school', 'description', e.target.value)}
                  className="w-full p-2 rounded-md text-sm bg-black/5 border border-black/10 dark:bg-white/5 dark:border-white/10 focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="pb-5 border-b border-gray-200 dark:border-white/10 space-y-3">
              <p className="text-sm font-medium">Genel İlerleme Çubuğu</p>
              
              <div>
                <label className="text-xs opacity-70 mb-1 block">Çubuk Başlığı</label>
                <input
                    type="text"
                    value={localSettings.dates.title}
                    placeholder="Örn: YKS Serüveni"
                    onChange={(e) => handleChange('dates', 'title', e.target.value)}
                    className="w-full p-2 rounded-md text-sm bg-black/5 border border-black/10 dark:bg-white/5 dark:border-white/10 focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs opacity-70 mb-1 block">Başlangıç</label>
                  <input
                    type="date"
                    value={localSettings.dates.start}
                    onChange={(e) => handleChange('dates', 'start', e.target.value)}
                    className="w-full p-2 rounded-md text-xs bg-black/5 border border-black/10 dark:bg-white/5 dark:border-white/10 focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="text-xs opacity-70 mb-1 block">Bitiş</label>
                  <input
                    type="date"
                    value={localSettings.dates.end}
                    onChange={(e) => handleChange('dates', 'end', e.target.value)}
                    className="w-full p-2 rounded-md text-xs bg-black/5 border border-black/10 dark:bg-white/5 dark:border-white/10 focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>
            </div>

             {/* Social Links - Dynamic List */}
             <div className="pb-5 border-b border-gray-200 dark:border-white/10 space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Sosyal Medya & İletişim</p>
                <button 
                  onClick={handleAddSocialLink}
                  className="flex items-center gap-1 text-xs bg-accent/10 text-accent hover:bg-accent/20 px-2 py-1 rounded transition-colors"
                >
                  <PlusIcon /> Ekle
                </button>
              </div>
              
              <div className="space-y-3">
                {localSettings.socialLinks.map((link) => (
                  <div key={link.id} className={`p-3 rounded-lg border ${link.isVisible ? 'bg-black/5 dark:bg-white/5 border-transparent' : 'bg-transparent border-dashed border-gray-300 dark:border-gray-700 opacity-60'}`}>
                    <div className="flex justify-between items-center mb-2 gap-2">
                       <div className="flex items-center gap-2 flex-grow">
                            <span className="text-accent opacity-70">
                                {getPlatformIcon(link.platform)}
                            </span>
                            <select 
                                value={link.platform}
                                onChange={(e) => handleSocialLinkChange(link.id, 'platform', e.target.value as SocialPlatform)}
                                className="bg-transparent text-xs font-bold focus:outline-none"
                            >
                                <option value="website" className="text-black">Web Sitesi</option>
                                <option value="instagram" className="text-black">Instagram</option>
                                <option value="twitter" className="text-black">Twitter/X</option>
                                <option value="youtube" className="text-black">YouTube</option>
                                <option value="phone" className="text-black">Telefon</option>
                                <option value="other" className="text-black">Diğer</option>
                            </select>
                       </div>

                      <div className="flex gap-1">
                        <button 
                          onClick={() => handleToggleSocialVisibility(link.id)}
                          className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-text-light dark:text-text-dark"
                          title={link.isVisible ? "Gizle" : "Göster"}
                        >
                          {link.isVisible ? <EyeIcon /> : <EyeOffIcon />}
                        </button>
                        <button 
                          onClick={() => handleRemoveSocialLink(link.id)}
                          className="p-1.5 rounded hover:bg-red-500/10 text-red-500"
                          title="Sil"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2">
                        <input
                            type="text"
                            value={link.label || ''}
                            placeholder="Görünen İsim (Örn: Instagram)"
                            onChange={(e) => handleSocialLinkChange(link.id, 'label', e.target.value)}
                            className="w-full p-1.5 rounded text-xs bg-white/50 dark:bg-black/20 focus:outline-none focus:ring-1 focus:ring-accent mb-1"
                        />
                         <input
                            type="text"
                            value={link.url}
                            placeholder={link.platform === 'phone' ? 'Telefon Numarası' : 'URL / Kullanıcı Adı'}
                            onChange={(e) => handleSocialLinkChange(link.id, 'url', e.target.value)}
                            className="w-full p-1.5 rounded text-xs bg-white/50 dark:bg-black/20 focus:outline-none focus:ring-1 focus:ring-accent font-mono"
                        />
                    </div>
                  </div>
                ))}
                {localSettings.socialLinks.length === 0 && (
                  <p className="text-xs text-center opacity-50 py-2">Henüz bağlantı eklenmemiş.</p>
                )}
              </div>
            </div>

            {/* Exams - Dynamic List */}
            <div className="pb-5 border-b border-gray-200 dark:border-white/10 space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Sayaçlar ve Sınavlar</p>
                <button 
                  onClick={handleAddExam}
                  className="flex items-center gap-1 text-xs bg-accent/10 text-accent hover:bg-accent/20 px-2 py-1 rounded transition-colors"
                >
                  <PlusIcon /> Ekle
                </button>
              </div>
              
              <div className="space-y-4">
                {localSettings.exams.map((exam) => (
                  <div key={exam.id} className={`p-3 rounded-lg border ${exam.isVisible ? 'bg-black/5 dark:bg-white/5 border-transparent' : 'bg-transparent border-dashed border-gray-300 dark:border-gray-700 opacity-60'}`}>
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <input
                        type="text"
                        value={exam.name}
                        onChange={(e) => handleExamChange(exam.id, 'name', e.target.value)}
                        className="flex-grow p-1.5 rounded text-xs font-bold bg-white/50 dark:bg-black/20 focus:outline-none focus:ring-1 focus:ring-accent"
                        placeholder="Sınav Adı"
                      />
                      <div className="flex gap-1">
                        <button 
                          onClick={() => handleToggleExamVisibility(exam.id)}
                          className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-text-light dark:text-text-dark"
                          title={exam.isVisible ? "Gizle" : "Göster"}
                        >
                          {exam.isVisible ? <EyeIcon /> : <EyeOffIcon />}
                        </button>
                        <button 
                          onClick={() => handleRemoveExam(exam.id)}
                          className="p-1.5 rounded hover:bg-red-500/10 text-red-500"
                          title="Sil"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2">
                        <div className="flex gap-2">
                            <div className="w-1/2">
                                <label className="text-[10px] opacity-60 block mb-0.5">Başlangıç</label>
                                <input
                                    type="date"
                                    value={exam.startDate}
                                    onChange={(e) => handleExamChange(exam.id, 'startDate', e.target.value)}
                                    className="w-full p-1.5 rounded text-xs bg-white/50 dark:bg-black/20 focus:outline-none focus:ring-1 focus:ring-accent"
                                />
                            </div>
                            <div className="w-1/2">
                                <label className="text-[10px] opacity-60 block mb-0.5">Sınav Tarihi</label>
                                <input
                                    type="date"
                                    value={exam.date}
                                    onChange={(e) => handleExamChange(exam.id, 'date', e.target.value)}
                                    className="w-full p-1.5 rounded text-xs bg-white/50 dark:bg-black/20 focus:outline-none focus:ring-1 focus:ring-accent"
                                />
                            </div>
                        </div>
                        
                        <div className="flex gap-2">
                            <input
                                type="time"
                                value={exam.startTime}
                                onChange={(e) => handleExamChange(exam.id, 'startTime', e.target.value)}
                                className="w-full p-1.5 rounded text-xs bg-white/50 dark:bg-black/20 focus:outline-none focus:ring-1 focus:ring-accent"
                            />
                            <span className="self-center">-</span>
                            <input
                                type="time"
                                value={exam.endTime}
                                onChange={(e) => handleExamChange(exam.id, 'endTime', e.target.value)}
                                className="w-full p-1.5 rounded text-xs bg-white/50 dark:bg-black/20 focus:outline-none focus:ring-1 focus:ring-accent"
                            />
                        </div>
                    </div>
                  </div>
                ))}
                {localSettings.exams.length === 0 && (
                  <p className="text-xs text-center opacity-50 py-4">Henüz sayaç eklenmemiş.</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleApply}
                className="w-full py-2.5 px-4 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium transition-colors text-sm shadow-lg shadow-accent/20"
              >
                Değişiklikleri Uygula
              </button>
              <button
                onClick={() => {
                    onReset();
                    onClose();
                }}
                className="w-full py-2.5 px-4 rounded-lg bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 text-text-light dark:text-text-dark font-medium transition-colors text-sm"
              >
                Ayarları Sıfırla
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPanel;
