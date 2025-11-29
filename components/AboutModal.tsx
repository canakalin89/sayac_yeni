import React from 'react';
import { CloseIcon, CodeIcon, UserIcon } from './Icons';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div 
          className="bg-card-light dark:bg-card-dark rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-white/10 relative transform transition-all scale-100"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-accent/20 to-transparent p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
            <h2 className="text-xl font-bold text-accent">Uygulama Hakkında</h2>
            <button onClick={onClose} className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors">
              <CloseIcon />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            
            {/* Tech Stack */}
            <div className="flex gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg h-fit text-blue-500">
                <CodeIcon />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Nasıl Yapıldı?</h3>
                <p className="text-sm opacity-80 leading-relaxed">
                  Bu uygulama, modern web geliştirme standartları gözetilerek hazırlanmıştır. 
                  Teknik altyapıda şunlar kullanılmıştır:
                </p>
                <ul className="mt-2 text-sm space-y-1 list-disc list-inside opacity-70">
                  <li><strong className="text-accent">React:</strong> Dinamik ve hızlı kullanıcı arayüzü.</li>
                  <li><strong className="text-accent">Tailwind CSS:</strong> Modern ve duyarlı (responsive) tasarım.</li>
                  <li><strong className="text-accent">TypeScript:</strong> Güvenli ve hatasız kod yapısı.</li>
                </ul>
              </div>
            </div>

            <hr className="border-gray-200 dark:border-white/10" />

            {/* Developer Info */}
            <div className="flex gap-4">
              <div className="p-3 bg-purple-500/10 rounded-lg h-fit text-purple-500">
                <UserIcon />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Geliştirici & Amaç</h3>
                <p className="text-sm opacity-80 leading-relaxed">
                  Bu proje, öğrencilerin sınav süreçlerini daha motive edici bir şekilde takip edebilmeleri amacıyla tasarlanmıştır. 
                  Açık kaynak vizyonuyla, özelleştirilebilir bir yapı sunar.
                </p>
                <div className="mt-3 text-xs bg-black/5 dark:bg-white/5 p-3 rounded border border-black/5 dark:border-white/5">
                  <p className="font-mono">Tasarım ve Kodlama: [Geliştirici İsmi / Okul Bilişim Kulübü]</p>
                </div>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50 dark:bg-black/20 text-center text-xs opacity-50">
             © {new Date().getFullYear()} Açık Kaynak Eğitim Projesi
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutModal;