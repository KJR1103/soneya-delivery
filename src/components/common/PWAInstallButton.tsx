import React, { useState, useEffect } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import {
  Download,
  Share2,
  PlusSquare,
  X,
  Compass,
  Chrome,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  Smartphone,
} from 'lucide-react';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, isIOSChrome, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [activeBrowserTab, setActiveBrowserTab] = useState<'chrome' | 'safari'>(
    isIOSChrome ? 'chrome' : 'safari'
  );
  const [copied, setCopied] = useState(false);
  const [isInIframe, setIsInIframe] = useState(false);

  useEffect(() => {
    try {
      setIsInIframe(window.self !== window.top);
    } catch {
      setIsInIframe(true);
    }
  }, []);

  // If already running standalone (already installed and opened as PWA), hide
  if (isInstalled) {
    return null;
  }

  const directAppUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyDirectUrl = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(directAppUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          if (isInstallable) {
            install();
          } else {
            setActiveBrowserTab(isIOSChrome ? 'chrome' : 'safari');
            setShowIOSGuide(true);
          }
        }}
        className={`flex items-center gap-1.5 font-medium transition-all ${
          compact
            ? 'px-2.5 py-1.5 min-h-[36px] text-xs rounded-xl bg-white dark:bg-[#10231B] text-[#0B2B1E] dark:text-white font-semibold border border-[#D4E9DD] dark:border-[#1E3B2D] hover:bg-emerald-50 dark:hover:bg-[#13291F]'
            : 'px-3.5 py-2 min-h-[40px] text-xs rounded-xl bg-[#0B7A4B] text-white hover:bg-[#08613B] shadow-xs font-semibold'
        }`}
        title="Installer l'application Soneya Delivery sur votre écran d'accueil"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Installer l'App</span>
      </button>

      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2B1E]/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#0C1913] p-5 sm:p-6 shadow-2xl border border-[#E2ECE7] dark:border-[#1E3B2D] max-h-[90dvh] overflow-y-auto my-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E2ECE7] dark:border-[#1E3B2D]">
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src="/assets/aistudio/B7697457-7CD5-4A3A-A3C7-3322C1459814_4b7ffeec.png"
                  alt="Guinée Hub Technologie Logo"
                  className="w-8 h-8 object-contain rounded-lg border border-[#D4E9DD] dark:border-[#1E3B2D] p-0.5 shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="font-heading font-extrabold text-sm text-[#0B2B1E] dark:text-white truncate">
                    Installer Soneya sur iPhone
                  </h3>
                  <p className="text-[10px] text-[#5C7A6E] dark:text-emerald-200/70">Guinée Hub Technologie</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                aria-label="Fermer"
                className="w-9 h-9 rounded-full text-[#2F4F42] hover:text-[#0B2B1E] hover:bg-emerald-50 dark:text-emerald-200/70 dark:hover:text-white flex items-center justify-center shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Crucial Explanation: Open Direct Link */}
            <div className="mt-4 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-200">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Pour installer l'application seule</span>
              </div>
              <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
                Dans Google AI Studio, touchez l'icône <strong>« Ouvrir dans un nouvel onglet » (↗)</strong> située juste au-dessus du cadre de prévisualisation, ou cliquez sur <strong>Partager (Share)</strong> en haut à droite d'AI Studio pour activer le lien public.
              </p>
              <div className="text-[11px] text-[#2F4F42] dark:text-emerald-100 bg-white dark:bg-[#10231B] p-2.5 rounded-xl border border-amber-200/60 dark:border-[#1E3B2D]">
                Une fois sur l'onglet de l'application seule, faites simplement :<br />
                <strong>Partager (↑) → « Sur l'écran d'accueil »</strong>.
              </div>
            </div>

            {/* Browser switcher tabs */}
            <div className="mt-4 flex p-1 bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] rounded-xl gap-1">
              <button
                onClick={() => setActiveBrowserTab('chrome')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition ${
                  activeBrowserTab === 'chrome'
                    ? 'bg-[#0B7A4B] text-white shadow-xs'
                    : 'text-[#2F4F42] dark:text-emerald-200/70 hover:bg-emerald-50 dark:hover:bg-[#13291F]'
                }`}
              >
                <Chrome className="w-3.5 h-3.5" />
                <span>Dans Chrome</span>
              </button>
              <button
                onClick={() => setActiveBrowserTab('safari')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition ${
                  activeBrowserTab === 'safari'
                    ? 'bg-[#0B7A4B] text-white shadow-xs'
                    : 'text-[#2F4F42] dark:text-emerald-200/70 hover:bg-emerald-50 dark:hover:bg-[#13291F]'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Dans Safari</span>
              </button>
            </div>

            {/* Step-by-step instructions */}
            {activeBrowserTab === 'chrome' ? (
              <div className="mt-4 space-y-3 text-xs text-[#2F4F42] dark:text-emerald-100/85">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#0B7A4B] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                    2
                  </span>
                  <div>
                    Une fois sur l'onglet direct de Soneya, touchez l'icône de <strong>Partage</strong>{' '}
                    <Share2 className="inline w-3.5 h-3.5 text-[#0B7A4B] dark:text-[#FFB81F]" /> (ou les <strong>3 points « ... »</strong> en bas à droite).
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#0B7A4B] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                    3
                  </span>
                  <div>
                    Faites défiler le menu et appuyez sur{' '}
                    <strong>« Ajouter à l'écran d'accueil »</strong>{' '}
                    <PlusSquare className="inline w-3.5 h-3.5 text-[#0B2B1E] dark:text-emerald-200" />.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#0B7A4B] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                    4
                  </span>
                  <div>
                    Appuyez sur <strong>« Ajouter »</strong> en haut à droite. Soneya Delivery apparaît avec son icône verte et s'ouvre comme une <strong>vraie application autonome</strong> !
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-3 text-xs text-[#2F4F42] dark:text-emerald-100/85">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#0B7A4B] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                    2
                  </span>
                  <div>
                    Dans Safari (sur le lien direct), appuyez sur le bouton <strong>Partager</strong>{' '}
                    <Share2 className="inline w-3.5 h-3.5 text-[#0B7A4B] dark:text-[#FFB81F]" /> au centre en bas.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#0B7A4B] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                    3
                  </span>
                  <div>
                    Faites défiler et sélectionnez <strong>« Sur l'écran d'accueil »</strong>.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#0B7A4B] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                    4
                  </span>
                  <div>
                    Touchez <strong>« Ajouter »</strong>. L'icône est créée et se lance sans aucune barre de navigation.
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full min-h-[44px] rounded-2xl bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] py-2.5 text-xs font-bold text-[#0B2B1E] dark:text-white hover:bg-emerald-50 dark:hover:bg-[#13291F] transition"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </>
  );
};
