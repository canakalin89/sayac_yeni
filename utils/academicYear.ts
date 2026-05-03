/**
 * Akademik yıl hesaplama ve yönetim yardımcıları.
 * Eğitim öğretim yılı: Eylül ayı başından Ağustos sonuna kadar.
 */

export type AcademicYear = string; // "2025-2026" formatında

/**
 * Mevcut tarihe göre aktif akademik yılı döndürür.
 * Eylül (8. ay) ve sonrası → yıl-(yıl+1)
 * Öncesinde → (yıl-1)-yıl
 */
export function getCurrentAcademicYear(): AcademicYear {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed: 0=Ocak, 8=Eylül

  if (month >= 8) {
    return `${year}-${year + 1}`;
  }
  return `${year - 1}-${year}`;
}

/**
 * Akademik yıl string'inden başlangıç yılını çıkarır.
 * "2025-2026" → 2025
 */
export function getStartYearFromAcademicYear(year: AcademicYear): number {
  return parseInt(year.split('-')[0], 10);
}

/**
 * Akademik yıl string'inden bitiş yılını çıkarır.
 * "2025-2026" → 2026
 */
export function getEndYearFromAcademicYear(year: AcademicYear): number {
  return parseInt(year.split('-')[1], 10);
}

/**
 * localStorage anahtarını üretir.
 */
export function getStorageKey(year: AcademicYear): string {
  return `yks-countdown-settings-${year}`;
}

/**
 * Eski (yılsız) localStorage anahtarı.
 */
export function getLegacyStorageKey(): string {
  return 'yks-countdown-settings';
}

/**
 * Bir sonraki akademik yılı hesaplar.
 * "2025-2026" → "2026-2027"
 */
export function getNextAcademicYear(year: AcademicYear): AcademicYear {
  const start = getStartYearFromAcademicYear(year);
  return `${start + 1}-${start + 2}`;
}

/**
 * Bir önceki akademik yılı hesaplar.
 * "2025-2026" → "2024-2025"
 */
export function getPreviousAcademicYear(year: AcademicYear): AcademicYear {
  const start = getStartYearFromAcademicYear(year);
  return `${start - 1}-${start}`;
}

/**
 * Verilen yılın Haziran ayının 3. Cumartesi gününü hesaplar.
 * Bu, genellikle TYT sınavının yapıldığı tarihtir (ÖSYM takvimi).
 */
export function getThirdSaturdayOfJune(year: number): string {
  // 1 Haziran'ın haftanın hangi günü olduğunu bul (0=Pazar, 6=Cumartesi)
  const firstOfJune = new Date(year, 5, 1); // 5 = Haziran
  const dayOfWeek = firstOfJune.getDay();

  // 1 Haziran'dan sonraki ilk Cumartesi'ye kaç gün kaldı?
  const daysUntilSaturday = (6 - dayOfWeek + 7) % 7;

  // 3. Cumartesi = 1 + gün farkı + 14 gün
  const saturdayDate = 1 + daysUntilSaturday + 14;

  return `${year}-06-${String(saturdayDate).padStart(2, '0')}`;
}

/**
 * Verilen akademik yıl için varsayılan sınav tarihlerini üretir.
 */
export function getDefaultDatesForYear(year: AcademicYear) {
  const startYear = getStartYearFromAcademicYear(year);
  const endYear = getEndYearFromAcademicYear(year);

  const tytDate = getThirdSaturdayOfJune(endYear);

  // TYT tarihini Date objesine çevir ve AYT/YDT için +1 ve +2 gün ekle
  const tytDateObj = new Date(tytDate);
  const aytDateObj = new Date(tytDateObj);
  aytDateObj.setDate(aytDateObj.getDate() + 1);
  const ydtDateObj = new Date(tytDateObj);
  ydtDateObj.setDate(ydtDateObj.getDate() + 2);

  const toDateStr = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  return {
    termStart: `${startYear}-09-01`,
    termEnd: tytDate,
    tytDate,
    aytDate: toDateStr(aytDateObj),
    ydtDate: toDateStr(ydtDateObj),
  };
}

/**
 * Bir tarih string'ini (YYYY-MM-DD) verilen yıl sayısı kadar kaydırır.
 * Aylar/günler sabit kalır, sadece yıl değişir.
 */
export function shiftDateByYear(dateStr: string, years: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const newYear = y + years;
  return `${newYear}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

/**
 * Bir tarih string'ini (YYYY-MM-DD) verilen yıl sayısı kadar kaydırır.
 * Ay/gün sınırlarını dikkate alır (örn. 29 Şubat → 28 Şubat).
 */
export function shiftDateByYearSafe(dateStr: string, years: number): string {
  const date = new Date(`${dateStr}T12:00:00`);
  date.setFullYear(date.getFullYear() + years);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
