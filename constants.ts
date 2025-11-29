
import { AppSettings } from './types';

export const THEME_COLORS = {
  blue: { main: '#3b82f6', hover: '#2563eb' },
  red: { main: '#ef4444', hover: '#dc2626' },
  green: { main: '#10b981', hover: '#059669' },
  purple: { main: '#8b5cf6', hover: '#7c3aed' },
  orange: { main: '#f97316', hover: '#ea580c' },
  pink: { main: '#ec4899', hover: '#db2777' },
};

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  color: 'blue',
  school: {
    title: 'Aziz Sancar Anadolu Lisesi',
    subtitle: 'YKS2026 Geri Sayım',
    description: "Tekirdağ Kapaklı'da yer alan ve adını Nobel ödüllü bilim insanı Prof. Dr. Aziz Sancar'dan alan okulumuz, akademik başarıyı sosyal sorumlulukla harmanlayan bir eğitim vizyonuna sahiptir.",
    logoUrl: 'https://azizsancaranadolu.meb.k12.tr/meb_iys_dosyalar/59/11/765062/dosyalar/2025_06/04182832_logolar7.png',
  },
  socialLinks: [
    {
      id: '1',
      platform: 'website',
      url: 'https://azizsancaranadolu.meb.k12.tr/',
      label: 'Web Sitesi',
      isVisible: true,
    },
    {
      id: '2',
      platform: 'instagram',
      url: '@asalkapakli2019',
      label: 'Instagram',
      isVisible: true,
    },
    {
      id: '3',
      platform: 'twitter',
      url: '@asalkapakli2019',
      label: 'Twitter/X',
      isVisible: true,
    },
    {
      id: '4',
      platform: 'youtube',
      url: '@AzizSancarAnadoluLisesi',
      label: 'YouTube',
      isVisible: true,
    },
    {
      id: '5',
      platform: 'phone',
      url: '0282 502 2728',
      label: 'Telefon',
      isVisible: true,
    }
  ],
  dates: {
    title: 'YKS Serüveni İlerleme Durumu',
    start: '2025-09-01',
    end: '2026-06-20',
  },
  exams: [
    {
      id: '1',
      name: 'TYT',
      startDate: '2025-09-01',
      date: '2026-06-20',
      startTime: '10:15',
      endTime: '13:00',
      isVisible: true,
    },
    {
      id: '2',
      name: 'AYT',
      startDate: '2025-09-01',
      date: '2026-06-21',
      startTime: '10:15',
      endTime: '13:15',
      isVisible: true,
    },
    {
      id: '3',
      name: 'YDT',
      startDate: '2025-09-01',
      date: '2026-06-21',
      startTime: '15:45',
      endTime: '17:45',
      isVisible: true,
    },
  ],
};
