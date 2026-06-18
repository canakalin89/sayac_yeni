
import { AppSettings } from './types';
import { AcademicYear, getDefaultDatesForYear, getEndYearFromAcademicYear, getSchoolOpeningDate } from './utils/academicYear';

// Sınav tarihleri değiştiğinde bu versiyonu artır → eski localStorage verileri güncellenir
export const DATA_VERSION = 2;

export const THEME_COLORS = {
  blue: { main: '#3b82f6', hover: '#2563eb' },
  red: { main: '#ef4444', hover: '#dc2626' },
  green: { main: '#10b981', hover: '#059669' },
  purple: { main: '#8b5cf6', hover: '#7c3aed' },
  orange: { main: '#f97316', hover: '#ea580c' },
  pink: { main: '#ec4899', hover: '#db2777' },
};

// Okul bilgileri ve sosyal medya linkleri yıllar boyunca genelde sabit kalır.
const DEFAULT_SCHOOL_INFO: AppSettings['school'] = {
  title: 'Aziz Sancar Anadolu Lisesi',
  subtitle: 'YKS Geri Sayım',
  description: "Tekirdağ Kapaklı'da yer alan ve adını Nobel ödüllü bilim insanı Prof. Dr. Aziz Sancar'dan alan okulumuz, akademik başarıyı sosyal sorumlulukla harmanlayan bir eğitim vizyonuna sahiptir.",
  logoUrl: 'https://azizsancaranadolu.meb.k12.tr/meb_iys_dosyalar/59/11/765062/dosyalar/2025_06/04182832_logolar7.png',
};

const DEFAULT_SOCIAL_LINKS: AppSettings['socialLinks'] = [
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
];

/**
 * Verilen akademik yılına göre varsayılan ayarları üretir.
 * Sınav tarihleri ve dönem başlangıç/bitiş otomatik hesaplanır.
 */
export function getDefaultSettings(year: AcademicYear): AppSettings {
  const dates = getDefaultDatesForYear(year);
  const endYear = getEndYearFromAcademicYear(year);

  const KNOWN_EXAM_TIMES: Record<string, { tyt: string[]; ayt: string[]; ydt: string[] }> = {
    '2025-2026': {
      tyt: ['10:15', '13:00'],
      ayt: ['10:15', '13:15'],
      ydt: ['15:45', '17:45'],
    },
    '2026-2027': {
      tyt: ['10:15', '13:00'],
      ayt: ['10:15', '13:15'],
      ydt: ['15:45', '17:45'],
    },
  };

  const times = KNOWN_EXAM_TIMES[year] || KNOWN_EXAM_TIMES['2025-2026'];

  return {
    theme: 'dark',
    color: 'blue',
    school: {
      ...DEFAULT_SCHOOL_INFO,
      subtitle: `YKS${endYear} Geri Sayım`,
    },
    socialLinks: DEFAULT_SOCIAL_LINKS,
    dates: {
      title: 'YKS Serüveni İlerleme Durumu',
      start: dates.termStart,
      end: dates.termEnd,
    },
    exams: [
      {
        id: '1',
        name: 'TYT',
        startDate: dates.termStart,
        date: dates.tytDate,
        startTime: times.tyt[0],
        endTime: times.tyt[1],
        isVisible: true,
      },
      {
        id: '2',
        name: 'AYT',
        startDate: dates.termStart,
        date: dates.aytDate,
        startTime: times.ayt[0],
        endTime: times.ayt[1],
        isVisible: true,
      },
      {
        id: '3',
        name: 'YDT',
        startDate: dates.termStart,
        date: dates.ydtDate,
        startTime: times.ydt[0],
        endTime: times.ydt[1],
        isVisible: true,
      },
    ],
    schoolOpening: {
      date: getSchoolOpeningDate(year),
      label: 'Okulların Açılışı',
    },
  };
}

/**
 * @deprecated Lütfen getDefaultSettings(year) kullanın.
 * Geriye uyumluluk için korunmuştur.
 */
export const DEFAULT_SETTINGS = getDefaultSettings('2025-2026');
