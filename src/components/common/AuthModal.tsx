import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SpaceType } from '../../types';

type AuthScreenState = 'welcome' | 'login' | 'signup' | 'forgot' | 'otp';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    login,
    showToast,
  } = useApp();

  const [screen, setScreen] = useState<AuthScreenState>('login');
  const [role, setRole] = useState<SpaceType>('client');

  // Input states (100% Mobile Phone Conakry)
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('622 78 90 12');
  const [password, setPassword] = useState('••••••••');
  const [resetPhone, setResetPhone] = useState('622 78 90 12');

  // OTP 4-digit code states (SMS simulé)
  const [otpDigits, setOtpDigits] = useState(['8', '4', '1', '9']);
  const [activeDigitIndex, setActiveDigitIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleNumpadPress = (num: string) => {
    const updated = [...otpDigits];
    updated[activeDigitIndex] = num;
    setOtpDigits(updated);
    if (activeDigitIndex < 3) {
      setActiveDigitIndex(activeDigitIndex + 1);
    }
  };

  const handleNumpadDelete = () => {
    const updated = [...otpDigits];
    updated[activeDigitIndex] = '';
    setOtpDigits(updated);
    if (activeDigitIndex > 0) {
      setActiveDigitIndex(activeDigitIndex - 1);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setScreen('otp');
      showToast('Code SMS envoyé', 'Code de sécurité envoyé par SMS au +224 ' + phone, 'status');
    }, 400);
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setScreen('otp');
      showToast('Code SMS envoyé', 'Code d inscription envoyé au +224 ' + phone, 'status');
    }, 400);
  };

  const handleVerifyOtp = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (role === 'admin') {
        login('622 00 00 00', 'René Kaba Tolno (GHT Direction)', 'admin');
      } else if (role === 'partner') {
        login(phone, name || 'Chez Fanta (Commerçant)', 'partner', 'chez-fanta');
      } else if (role === 'courier') {
        login(phone, name || 'Mamadou Sow (Motard)', 'courier', undefined, 'c-1');
      } else {
        login(phone, name || 'Amadou Diallo', 'client');
      }
      setIsAuthModalOpen(false);
      setScreen('login');
      showToast('Connexion réussie', 'Bienvenue sur Soneya Delivery Conakry !', 'success');
    }, 500);
  };

  const handleQuickDemo = (demoRole: SpaceType) => {
    setRole(demoRole);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (demoRole === 'client') {
        login('622 78 90 12', 'Amadou Diallo', 'client');
      } else if (demoRole === 'partner') {
        login('620 10 20 30', 'Chez Fanta (Commerçant)', 'partner', 'chez-fanta');
      } else if (demoRole === 'courier') {
        login('622 45 89 12', 'Mamadou Sow (Motard)', 'courier', undefined, 'c-1');
      } else if (demoRole === 'admin') {
        login('622 00 00 00', 'René Kaba Tolno (Direction GHT)', 'admin');
      }
      setIsAuthModalOpen(false);
      showToast('Session démo active', `Connecté en tant que ${demoRole}`, 'success');
    }, 300);
  };

  // Role tab accent color per role (courier uses courier blue, partner uses partner gold, others primary)
  const roleAccent =
    role === 'courier'
      ? 'bg-courier text-on-courier'
      : role === 'partner'
      ? 'bg-partner text-on-courier'
      : 'bg-light-primary text-light-on-primary';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-light-on-surface/70 dark:bg-dark-on-surface/70 backdrop-blur-xs p-gutter-sm sm:p-gutter-md overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-xl bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline shadow-2xl overflow-hidden flex flex-col max-h-[90dvh] my-auto">
        {/* Top close button bar */}
        <div className="p-gutter-md border-b border-light-outline dark:border-dark-outline flex items-center justify-between bg-light-surface-container-low dark:bg-dark-surface-container-low">
          <div className="flex items-center gap-gutter-sm">
            <img
              src="/assets/aistudio/B7697457-7CD5-4A3A-A3C7-3322C1459814_4b7ffeec.png"
              alt="GHT"
              className="h-6 w-auto"
            />
            <span className="font-headline font-black text-label-md text-light-on-surface dark:text-dark-on-surface uppercase tracking-wider">
              Soneya Delivery
            </span>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="w-9 h-9 rounded-full bg-light-surface-container dark:bg-dark-surface-container border border-light-outline dark:border-dark-outline text-light-on-surface-variant dark:text-dark-on-surface-variant hover:text-light-on-surface dark:hover:text-dark-on-surface flex items-center justify-center cursor-pointer"
            aria-label="Fermer"
          >
            <span className="material-symbols-outlined text-body-md" aria-hidden="true">
              close
            </span>
          </button>
        </div>

        {/* Dynamic Screen View (100% en Français, pas de Google/Facebook) */}
        <div className="p-gutter-lg sm:p-gutter-xl overflow-y-auto flex-1 space-y-gutter-md">
          {/* SCREEN: BIENVENUE */}
          {screen === 'welcome' && (
            <div className="text-center space-y-gutter-lg animate-in fade-in">
              <div className="w-20 h-20 mx-auto rounded-xl bg-light-primary text-light-on-primary dark:bg-dark-primary dark:text-dark-on-primary flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-headline-md" aria-hidden="true">
                  smartphone
                </span>
              </div>
              <div>
                <h2 className="font-headline font-black text-headline-md text-light-on-surface dark:text-dark-on-surface">
                  Bienvenue sur Soneya
                </h2>
                <p className="text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant mt-gutter-xs leading-relaxed">
                  Conakry commande. Soneya livre. Connexion 100 % sécurisée par numéro de téléphone et SMS.
                </p>
              </div>

              <div className="space-y-gutter-sm pt-gutter-sm">
                <button
                  onClick={() => setScreen('login')}
                  className="w-full min-h-[48px] py-gutter-md rounded-md bg-light-primary hover:opacity-90 text-light-on-primary dark:bg-dark-primary dark:text-dark-on-primary font-headline font-bold text-body-sm shadow-md transition cursor-pointer"
                >
                  Continuer avec mon numéro de téléphone (+224)
                </button>
              </div>

              <div className="text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Vous avez déjà un compte ?{' '}
                <button
                  onClick={() => setScreen('login')}
                  className="font-bold text-light-primary dark:text-dark-primary underline"
                >
                  Se connecter
                </button>
              </div>
            </div>
          )}

          {/* SCREEN: CONNEXION */}
          {screen === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-gutter-md animate-in fade-in">
              <div>
                <h2 className="font-headline font-black text-title-lg text-light-on-surface dark:text-dark-on-surface">
                  Connexion Sécurisée
                </h2>
                <p className="text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant mt-gutter-xs">
                  Accédez à votre espace par numéro de téléphone guinéen
                </p>
              </div>

              {/* Role selector — Client/Livreur/Partenaire (+ Admin) */}
              <div className="grid grid-cols-4 gap-gutter-xs p-gutter-xs bg-light-surface-container dark:bg-dark-surface-container border border-light-outline dark:border-dark-outline rounded-md text-label-md font-semibold">
                <button
                  type="button"
                  onClick={() => setRole('client')}
                  className={`py-gutter-sm rounded-md transition ${
                    role === 'client' ? roleAccent : 'text-light-on-surface-variant dark:text-dark-on-surface-variant'
                  }`}
                >
                  Client
                </button>
                <button
                  type="button"
                  onClick={() => setRole('partner')}
                  className={`py-gutter-sm rounded-md transition truncate px-gutter-xs ${
                    role === 'partner' ? roleAccent : 'text-light-on-surface-variant dark:text-dark-on-surface-variant'
                  }`}
                >
                  Commerçant
                </button>
                <button
                  type="button"
                  onClick={() => setRole('courier')}
                  className={`py-gutter-sm rounded-md transition ${
                    role === 'courier' ? roleAccent : 'text-light-on-surface-variant dark:text-dark-on-surface-variant'
                  }`}
                >
                  Livreur
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`py-gutter-sm rounded-md transition ${
                    role === 'admin' ? roleAccent : 'text-light-on-surface-variant dark:text-dark-on-surface-variant'
                  }`}
                >
                  Admin
                </button>
              </div>

              {/* Phone input with country code */}
              <div className="space-y-gutter-xs">
                <label className="font-label text-label-sm uppercase tracking-wider text-light-on-surface-variant dark:text-dark-on-surface-variant">
                  Numéro de téléphone (+224)
                </label>
                <div className="relative">
                  <span className="absolute left-gutter-sm top-1/2 -translate-y-1/2 text-body-sm font-bold text-light-primary dark:text-dark-primary">
                    +224
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="622 78 90 12"
                    className="w-full pl-14 pr-10 py-gutter-md text-body-sm rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface focus:outline-none focus:border-light-primary dark:focus:border-dark-primary font-semibold"
                  />
                  <span
                    className="material-symbols-outlined text-body-md text-light-on-surface-variant absolute right-gutter-sm top-1/2 -translate-y-1/2"
                    aria-hidden="true"
                  >
                    call
                  </span>
                </div>
              </div>

              {/* Password input */}
              <div className="space-y-gutter-xs">
                <div className="flex items-center justify-between">
                  <label className="font-label text-label-sm uppercase tracking-wider text-light-on-surface-variant dark:text-dark-on-surface-variant">
                    Mot de passe
                  </label>
                  <button
                    type="button"
                    onClick={() => setScreen('forgot')}
                    className="text-label-md font-semibold text-light-primary dark:text-dark-primary hover:underline cursor-pointer"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-gutter-md pr-10 py-gutter-md text-body-sm rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface focus:outline-none focus:border-light-primary dark:focus:border-dark-primary"
                  />
                  <span
                    className="material-symbols-outlined text-body-md text-light-on-surface-variant absolute right-gutter-sm top-1/2 -translate-y-1/2"
                    aria-hidden="true"
                  >
                    lock
                  </span>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full min-h-[48px] py-gutter-md rounded-md bg-light-primary hover:opacity-90 text-light-on-primary dark:bg-dark-primary dark:text-dark-on-primary font-headline font-bold text-body-sm shadow-md transition cursor-pointer"
              >
                {loading ? 'Vérification en cours...' : 'Recevoir le code SMS de vérification'}
              </button>

              {/* Switch to SignUp */}
              <div className="text-center text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant pt-gutter-xs">
                Pas encore de compte ?{' '}
                <button
                  type="button"
                  onClick={() => setScreen('signup')}
                  className="font-bold text-light-primary dark:text-dark-primary underline cursor-pointer"
                >
                  Créer un compte
                </button>
              </div>

              {/* Quick Demo Login Shortcuts */}
              <div className="pt-gutter-sm border-t border-light-outline dark:border-dark-outline">
                <div className="font-label text-label-sm uppercase text-light-on-surface-variant dark:text-dark-on-surface-variant text-center mb-gutter-xs">
                  Accès démo rapide (1 clic)
                </div>
                <div className="grid grid-cols-2 gap-gutter-sm">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('client')}
                    className="min-h-[40px] py-gutter-sm px-gutter-xs rounded-md bg-light-surface-container dark:bg-dark-surface-container border border-light-outline dark:border-dark-outline text-label-md font-semibold text-light-on-surface dark:text-dark-on-surface hover:bg-light-primary-container dark:hover:opacity-90"
                  >
                    Démo Client
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('partner')}
                    className="min-h-[40px] py-gutter-sm px-gutter-xs rounded-md bg-light-surface-container dark:bg-dark-surface-container border border-light-outline dark:border-dark-outline text-label-md font-semibold text-light-on-surface dark:text-dark-on-surface hover:bg-light-primary-container dark:hover:opacity-90"
                  >
                    Démo Commerçant
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* SCREEN: INSCRIPTION */}
          {screen === 'signup' && (
            <form onSubmit={handleSignUpSubmit} className="space-y-gutter-md animate-in fade-in">
              <div>
                <h2 className="font-headline font-black text-title-lg text-light-on-surface dark:text-dark-on-surface">
                  Créer un compte Soneya
                </h2>
                <p className="text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant mt-gutter-xs">
                  Rejoignez la communauté Soneya à Conakry
                </p>
              </div>

              {/* Name */}
              <div className="space-y-gutter-xs">
                <label className="font-label text-label-sm uppercase tracking-wider text-light-on-surface-variant dark:text-dark-on-surface-variant">
                  Nom et prénom
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Amadou Diallo"
                    className="w-full px-gutter-md pr-10 py-gutter-md text-body-sm rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface focus:outline-none focus:border-light-primary dark:focus:border-dark-primary"
                  />
                  <span
                    className="material-symbols-outlined text-body-md text-light-on-surface-variant absolute right-gutter-sm top-1/2 -translate-y-1/2"
                    aria-hidden="true"
                  >
                    person
                  </span>
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-gutter-xs">
                <label className="font-label text-label-sm uppercase tracking-wider text-light-on-surface-variant dark:text-dark-on-surface-variant">
                  Numéro de téléphone (+224)
                </label>
                <div className="relative">
                  <span className="absolute left-gutter-sm top-1/2 -translate-y-1/2 text-body-sm font-bold text-light-primary dark:text-dark-primary">
                    +224
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="622 78 90 12"
                    className="w-full pl-14 pr-10 py-gutter-md text-body-sm rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface focus:outline-none focus:border-light-primary dark:focus:border-dark-primary font-semibold"
                  />
                  <span
                    className="material-symbols-outlined text-body-md text-light-on-surface-variant absolute right-gutter-sm top-1/2 -translate-y-1/2"
                    aria-hidden="true"
                  >
                    call
                  </span>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-gutter-xs">
                <label className="font-label text-label-sm uppercase tracking-wider text-light-on-surface-variant dark:text-dark-on-surface-variant">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Au moins 6 caractères"
                    className="w-full px-gutter-md pr-10 py-gutter-md text-body-sm rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface focus:outline-none focus:border-light-primary dark:focus:border-dark-primary"
                  />
                  <span
                    className="material-symbols-outlined text-body-md text-light-on-surface-variant absolute right-gutter-sm top-1/2 -translate-y-1/2"
                    aria-hidden="true"
                  >
                    lock
                  </span>
                </div>
              </div>

              {/* Role selection for signup */}
              <div className="space-y-gutter-xs">
                <label className="font-label text-label-sm uppercase tracking-wider text-light-on-surface-variant dark:text-dark-on-surface-variant">
                  Je suis…
                </label>
                <div className="grid grid-cols-3 gap-gutter-sm">
                  <button
                    type="button"
                    onClick={() => setRole('client')}
                    className={`min-h-[44px] py-gutter-sm rounded-md border text-label-md font-semibold transition flex items-center justify-center gap-gutter-xs ${
                      role === 'client'
                        ? 'bg-light-primary text-light-on-primary border-light-primary dark:bg-dark-primary dark:text-dark-on-primary dark:border-dark-primary'
                        : 'bg-light-surface-container-low dark:bg-dark-surface-container-low text-light-on-surface-variant dark:text-dark-on-surface-variant border-light-outline dark:border-dark-outline'
                    }`}
                  >
                    <span className="material-symbols-outlined text-body-md" aria-hidden="true">
                      person
                    </span>
                    Client
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('courier')}
                    className={`min-h-[44px] py-gutter-sm rounded-md border text-label-md font-semibold transition flex items-center justify-center gap-gutter-xs ${
                      role === 'courier'
                        ? 'bg-courier text-on-courier border-courier'
                        : 'bg-light-surface-container-low dark:bg-dark-surface-container-low text-light-on-surface-variant dark:text-dark-on-surface-variant border-light-outline dark:border-dark-outline'
                    }`}
                  >
                    <span className="material-symbols-outlined text-body-md" aria-hidden="true">
                      two_wheeler
                    </span>
                    Livreur
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('partner')}
                    className={`min-h-[44px] py-gutter-sm rounded-md border text-label-md font-semibold transition flex items-center justify-center gap-gutter-xs ${
                      role === 'partner'
                        ? 'bg-partner text-on-courier border-partner'
                        : 'bg-light-surface-container-low dark:bg-dark-surface-container-low text-light-on-surface-variant dark:text-dark-on-surface-variant border-light-outline dark:border-dark-outline'
                    }`}
                  >
                    <span className="material-symbols-outlined text-body-md" aria-hidden="true">
                      store
                    </span>
                    Partenaire
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full min-h-[48px] py-gutter-md rounded-md bg-light-primary hover:opacity-90 text-light-on-primary dark:bg-dark-primary dark:text-dark-on-primary font-headline font-bold text-body-sm shadow-md transition cursor-pointer"
              >
                {loading ? 'Création en cours...' : "S'inscrire et recevoir le code SMS"}
              </button>

              {/* Terms & privacy */}
              <p className="text-center text-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant leading-relaxed">
                En créant un compte, vous acceptez nos{' '}
                <button type="button" className="font-bold text-light-primary dark:text-dark-primary underline cursor-pointer">
                  Conditions d'utilisation
                </button>{' '}
                et notre{' '}
                <button type="button" className="font-bold text-light-primary dark:text-dark-primary underline cursor-pointer">
                  Politique de confidentialité
                </button>
                .
              </p>

              {/* Switch to Login */}
              <div className="text-center text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant pt-gutter-xs">
                Vous avez déjà un compte ?{' '}
                <button
                  type="button"
                  onClick={() => setScreen('login')}
                  className="font-bold text-light-primary dark:text-dark-primary underline cursor-pointer"
                >
                  Se connecter
                </button>
              </div>
            </form>
          )}

          {/* SCREEN: MOT DE PASSE OUBLIÉ */}
          {screen === 'forgot' && (
            <div className="space-y-gutter-md animate-in fade-in">
              <div>
                <h2 className="font-headline font-black text-title-lg text-light-on-surface dark:text-dark-on-surface">
                  Réinitialiser le mot de passe
                </h2>
                <p className="text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant mt-gutter-xs leading-relaxed">
                  Entrez votre numéro de téléphone pour recevoir un code SMS de réinitialisation.
                </p>
              </div>

              <div className="space-y-gutter-xs">
                <label className="font-label text-label-sm uppercase tracking-wider text-light-on-surface-variant dark:text-dark-on-surface-variant">
                  Numéro de téléphone (+224)
                </label>
                <div className="relative">
                  <span className="absolute left-gutter-sm top-1/2 -translate-y-1/2 text-body-sm font-bold text-light-primary dark:text-dark-primary">
                    +224
                  </span>
                  <input
                    type="tel"
                    value={resetPhone}
                    onChange={(e) => setResetPhone(e.target.value)}
                    placeholder="622 78 90 12"
                    className="w-full pl-14 pr-10 py-gutter-md text-body-sm rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface focus:outline-none focus:border-light-primary dark:focus:border-dark-primary font-semibold"
                  />
                  <span
                    className="material-symbols-outlined text-body-md text-light-on-surface-variant absolute right-gutter-sm top-1/2 -translate-y-1/2"
                    aria-hidden="true"
                  >
                    call
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  showToast('Code SMS envoyé', 'Code SMS de sécurité envoyé au +224 ' + resetPhone, 'status');
                  setScreen('otp');
                }}
                className="w-full min-h-[48px] py-gutter-md rounded-md bg-light-primary hover:opacity-90 text-light-on-primary dark:bg-dark-primary dark:text-dark-on-primary font-headline font-bold text-body-sm shadow-md transition cursor-pointer"
              >
                Envoyer le code SMS
              </button>

              <button
                type="button"
                onClick={() => setScreen('login')}
                className="w-full min-h-[40px] py-gutter-sm text-body-sm font-semibold text-light-on-surface-variant hover:text-light-on-surface dark:text-dark-on-surface-variant dark:hover:text-dark-on-surface text-center cursor-pointer"
              >
                Retour à la connexion
              </button>
            </div>
          )}

          {/* SCREEN: VALIDATION CODE OTP + CLAVIER NUMÉRIQUE */}
          {screen === 'otp' && (
            <div className="space-y-gutter-md text-center animate-in fade-in">
              <div>
                <h2 className="font-headline font-black text-title-lg text-light-on-surface dark:text-dark-on-surface">
                  Code de vérification SMS
                </h2>
                <p className="text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant mt-gutter-xs leading-relaxed">
                  Saisissez le code secret à 4 chiffres envoyé au{' '}
                  <strong className="text-light-on-surface dark:text-dark-on-surface">+224 {phone}</strong>
                </p>
              </div>

              {/* 4 OTP Digit Boxes */}
              <div className="flex justify-center gap-gutter-sm py-gutter-sm">
                {[0, 1, 2, 3].map((idx) => {
                  const isCurrent = activeDigitIndex === idx;
                  const val = otpDigits[idx];
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveDigitIndex(idx)}
                      className={`w-12 h-14 rounded-md border text-title-lg font-mono font-black flex items-center justify-center transition cursor-pointer ${
                        isCurrent
                          ? 'border-light-primary ring-2 ring-light-primary/25 bg-light-surface-container-low dark:bg-dark-surface-container-low text-light-on-surface dark:text-dark-on-surface dark:border-dark-primary dark:ring-dark-primary/25'
                          : val
                          ? 'border-light-outline dark:border-dark-outline bg-light-surface-container-low dark:bg-dark-surface-container-low text-light-on-surface dark:text-dark-on-surface'
                          : 'border-light-outline dark:border-dark-outline bg-light-surface-container-low dark:bg-dark-surface-container-low text-light-on-surface-variant'
                      }`}
                    >
                      {val || ''}
                    </button>
                  );
                })}
              </div>

              <div className="text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Vous n'avez pas reçu le code ?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setOtpDigits(['8', '4', '1', '9']);
                    showToast('Nouveau code SMS', 'Code SMS renvoyé : 8419', 'status');
                  }}
                  className="font-bold text-light-primary dark:text-dark-primary underline cursor-pointer"
                >
                  Renvoyer par SMS
                </button>
              </div>

              {/* Numeric Keypad */}
              <div className="grid grid-cols-3 gap-gutter-sm pt-gutter-sm">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => handleNumpadPress(digit)}
                    className="min-h-[44px] py-gutter-md rounded-md bg-light-surface-container dark:bg-dark-surface-container hover:bg-light-primary-container dark:hover:opacity-90 text-title-md font-bold font-mono text-light-on-surface dark:text-dark-on-surface transition active:scale-95 cursor-pointer border border-light-outline dark:border-dark-outline"
                  >
                    {digit}
                  </button>
                ))}
                <div />
                <button
                  type="button"
                  onClick={() => handleNumpadPress('0')}
                  className="min-h-[44px] py-gutter-md rounded-md bg-light-surface-container dark:bg-dark-surface-container hover:bg-light-primary-container dark:hover:opacity-90 text-title-md font-bold font-mono text-light-on-surface dark:text-dark-on-surface transition active:scale-95 cursor-pointer border border-light-outline dark:border-dark-outline"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={handleNumpadDelete}
                  className="min-h-[44px] py-gutter-md rounded-md bg-light-surface-container dark:bg-dark-surface-container hover:bg-light-primary-container dark:hover:opacity-90 text-label-md font-bold text-light-on-surface dark:text-dark-on-surface transition active:scale-95 cursor-pointer border border-light-outline dark:border-dark-outline"
                >
                  Effacer
                </button>
              </div>

              {/* Confirm Code CTA */}
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full min-h-[48px] mt-gutter-xs py-gutter-md rounded-md bg-light-primary hover:opacity-90 text-light-on-primary dark:bg-dark-primary dark:text-dark-on-primary font-headline font-bold text-body-sm shadow-md transition cursor-pointer"
              >
                {loading ? 'Validation en cours...' : 'Valider & Entrer'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
