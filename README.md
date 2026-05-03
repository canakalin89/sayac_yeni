# 🎓 YKS Geri Sayım ve Takip Uygulaması

Bu proje, Yükseköğretim Kurumları Sınavı (YKS) ve diğer akademik sınavlar için geliştirilmiş, tamamen özelleştirilebilir, modern ve şık bir geri sayım uygulamasıdır. Okullar, eğitim kurumları veya bireysel öğrenciler için motivasyon ve takip aracı olarak tasarlanmıştır.

> **Tasarım ve Kodlama:** [Can AKALIN](https://instagram.com/can_akalin)

## ✨ Özellikler

Bu uygulama sadece basit bir sayaç değil, detaylı bir takip sistemidir:

*   **Dinamik Sınav Yönetimi:**
    *   İstediğiniz kadar sınav (TYT, AYT, YDT, LGS, Bursluluk vb.) ekleyebilirsiniz.
    *   Sınavları gizleyebilir, silebilir veya isimlerini değiştirebilirsiniz.
    *   Her sınavın kendine ait bir **İlerleme Çubuğu** bulunur.
*   **Gelişmiş Görsel Özelleştirme:**
    *   **Koyu / Açık Mod** desteği.
    *   **6 Farklı Renk Teması** (Mavi, Kırmızı, Yeşil, Mor, Turuncu, Pembe).
    *   **Glassmorphism** (cam efekti) kartlar ve arayüz elemanları.
    *   Hareketli **mesh gradient** arka plan.
    *   Tüm renkler ve gölgeler seçilen temaya göre otomatik güncellenir.
*   **Kurumsal Kimlik Entegrasyonu:**
    *   Okul Adı, Alt Başlık ve Açıklama metinleri düzenlenebilir.
    *   **Okul Logosu:** URL üzerinden logo eklenebilir. Logoya tıklandığında okulun web sitesine yönlendirir.
*   **Sosyal Medya ve İletişim:**
    *   Instagram, Twitter (X), YouTube, Web Sitesi ve Telefon butonları.
    *   Bu butonlar dinamik olarak eklenip çıkarılabilir, sıralaması değiştirilebilir.
*   **Genel İlerleme Durumu:**
    *   Eğitim öğretim yılına veya belirlediğiniz tarih aralığına göre genel yüzdelik ilerleme çubuğu.
*   **Ziyaretçi Sayacı:**
    *   Veritabanı gerektirmeyen, API tabanlı (CounterAPI) ve kurum ismine özel çalışan canlı ziyaretçi sayacı.
*   **Akademik Yıl Yönetimi (Otomatik):**
    *   Her eğitim öğretim yılı için ayarlar otomatik olarak ayrılır (`localStorage`).
    *   Yeni yıla geçişte önceki yılın ayarlarını tek tıkla kopyalayabilir ve sınav tarihlerini otomatik güncelleyebilirsiniz.
    *   Varsayılan sınav tarihleri (TYT, AYT, YDT) ÖSYM takvimine göre otomatik hesaplanır.
*   **Otomatik Kaydetme:**
    *   Ayarlar panelinde yaptığınız her değişiklik anında kaydedilir, kaydetme butonuna gerek yoktur.
*   **Kalıcı Ayarlar:**
    *   Yapılan tüm değişiklikler tarayıcının `localStorage` biriminde saklanır. Sayfa yenilendiğinde ayarlar kaybolmaz.
    *   Eski kayıtlar otomatik olarak yeni yıl sistemine taşınır (migrate).

## 🛠 Kullanılan Teknolojiler

Proje, modern web geliştirme standartlarına uygun olarak, performans ve temiz kod prensipleriyle geliştirilmiştir:

*   **React (v18+):** Kullanıcı arayüzü kütüphanesi.
*   **TypeScript:** Tip güvenliği ve hatasız kod yapısı için.
*   **Tailwind CSS:** Hızlı, modern ve responsive (mobil uyumlu) tasarım.
*   **Vite:** Hızlı geliştirme ve derleme (build) aracı.
*   **CounterAPI:** Backend gerektirmeyen ziyaretçi sayacı servisi.

## 🚀 Kurulum ve Çalıştırma

Bu projeyi kendi bilgisayarınızda çalıştırmak veya geliştirmek için aşağıdaki adımları izleyin:

### Gereksinimler
*   Node.js (v16 veya üzeri)

### Adımlar

1.  **Projeyi Klonlayın:**
    ```bash
    git clone https://github.com/canakalin89/sayac_yeni.git
    cd sayac_yeni
    ```

2.  **Bağımlılıkları Yükleyin:**
    ```bash
    npm install
    ```

3.  **Geliştirme Sunucusunu Başlatın:**
    ```bash
    npm run dev
    ```
    Tarayıcınızda `http://localhost:5173` adresine giderek uygulamayı görebilirsiniz.

## 📦 Yayına Alma (Deployment)

Proje statik bir web sitesi olarak çalışır. Netlify, Vercel veya GitHub Pages üzerinde kolayca yayınlayabilirsiniz.

**Build (Derleme) Almak İçin:**
```bash
npm run build
```
Bu komut `dist` klasörü oluşturur. Bu klasörün içindeki dosyaları sunucunuza yükleyebilirsiniz.

**Netlify İçin:**
Projeyi GitHub'a yükledikten sonra Netlify'a bağlamanız yeterlidir. Sistem otomatik olarak `vite.config.ts` ayarlarını algılayacaktır.

## ⚙️ Kullanım Kılavuzu

### Ayarlar Panelini Açma

Ayarlar butonu ekranda **görünmez**. Paneli açmak için iki yöntem vardır:

1.  **Klavye Kısayolu:** `Ctrl + Shift + S`
2.  **Sağ Üst Köşe:** Fareyi sayfanın sağ üst köşesine (logonun sağına) götürün. Küçük bir mavi nokta belirecektir. Üzerine tıklayarak paneli açabilirsiniz.

### Ayarlar Paneli Bölümleri

1.  **Görünüm:** Koyu / Açık mod ve 6 farklı ana renk arasından seçim yapın. Değişiklikler anında uygulanır ve otomatik kaydedilir.
2.  **Okul Bilgileri:** Okul ismini, alt başlığını, açıklamasını ve logo URL'sini düzenleyin.
3.  **Genel İlerleme:** Dönem başlangıç ve bitiş tarihlerini ayarlayın.
4.  **Sosyal Medya:** Platform seçimi, görünen isim ve URL girerek yeni bağlantılar ekleyin. Gizleme ve silme butonları mevcuttur.
5.  **Sayaçlar:** Sınav adı, başlangıç tarihi, sınav tarihi ve saat bilgilerini girin.
6.  **Yıl Yönetimi:**
    *   **Tüm Tarihleri +1 Yıl Kaydır:** Mevcut tüm sınav ve dönem tarihlerini bir yıl ileri alır.
    *   **Önceki Yıl Ayarlarını Kopyala:** `localStorage`'dan bir önceki akademik yılın verilerini çeker, okul bilgilerini korur ve sınav tarihlerini günceller.

> ⚠️ **ÖSYM Uyarısı:** Sınav tarihleri, ÖSYM'nin geçmiş yıllardaki takvimine göre otomatik hesaplanmış **tahmini** tarihlerdir. Kesin tarihler için lütfen [resmi ÖSYM takvimini](https://www.osym.gov.tr/TR,9493/sinav-takvimi.html) kontrol ediniz.

### 🔄 Yıllık Kullanım ve Geçiş

Uygulama her eğitim öğretim yılı için ayrı bir profil oluşturur:

*   **Otomatik Yıl Algılama:** Eylül ayından itibaren yeni akademik yılı otomatik algılar.
*   **Yıl Geçiş Sihirbazı:** Yeni yıla geçtiğinizde, önceki yılın ayarlarını kopyalama teklifi sunar (okul bilgileri ve sosyal medya linkleri korunur, sınav tarihleri otomatik kaydırılır).
*   **Manuel Geçiş:** Ayarlar panelinden istediğiniz zaman "Önceki Yıl Ayarlarını Kopyala" veya "Tüm Tarihleri +1 Yıl Kaydır" seçeneklerini kullanabilirsiniz.

## 👨‍💻 Geliştirici

Bu proje **Can AKALIN** tarafından tasarlanmış ve kodlanmıştır.

*   **Instagram:** [@can_akalin](https://instagram.com/can_akalin)

## 📄 Lisans

Bu proje eğitim amaçlıdır ve açık kaynak olarak paylaşılmıştır. İstenildiği gibi geliştirilebilir ve kullanılabilir.
