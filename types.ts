
export interface ExamConfig {
  id: string;
  name: string;
  startDate: string; // YYYY-MM-DD (New field)
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  isVisible: boolean;
}

export type ColorTheme = 'blue' | 'red' | 'green' | 'purple' | 'orange' | 'pink';

export type SocialPlatform = 'instagram' | 'twitter' | 'youtube' | 'website' | 'phone' | 'other';

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  url: string;
  label?: string; // For accessibility or display text
  isVisible: boolean;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  color: ColorTheme;
  school: {
    title: string;
    subtitle: string;
    description: string;
    logoUrl: string;
  };
  socialLinks: SocialLink[];
  dates: {
    title: string;
    start: string; // YYYY-MM-DD
    end: string; // YYYY-MM-DD
  };
  exams: ExamConfig[];
}

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isCompleted: boolean;
}
