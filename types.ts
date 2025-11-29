export interface ExamConfig {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  isVisible: boolean;
}

export type ColorTheme = 'blue' | 'red' | 'green' | 'purple' | 'orange' | 'pink';

export interface AppSettings {
  theme: 'light' | 'dark';
  color: ColorTheme;
  school: {
    title: string;
    subtitle: string;
    description: string;
    logoUrl: string;
  };
  social: {
    instagram: string;
    twitter: string;
    youtube: string;
    phone: string;
  };
  dates: {
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