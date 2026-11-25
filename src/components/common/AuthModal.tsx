import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SpaceType } from '../../types';
import {
  X,
  Lock,
  User,
  Phone,
  ArrowRight,
  ShieldCheck,
  Check,
  RotateCcw,
  Store,
  Bike,
  Sparkles,
  Smartphone,
} from 'lucide-react';

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2B1E]/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] shadow-2xl overflow-hidden flex flex-col max-h-[90dvh] my-auto">
        {/* Top close button bar */}
        <div className="p-3.5 border-b border-[#E2ECE7] dark:border-[#1E3B2D] flex items-center justify-between bg-white dark:bg-[#0C1913]">
          <div className="flex items-center gap-2">
            <img
              src="/assets/aistudio/B7697457-7CD5-4A3A-A3C7-3322C1459814_4b7ffeec.png"
              alt="GHT"
              className="h-6 w-auto"
            />
            <span className="font-heading font-black text-xs text-[#0B2B1E] dark:text-white uppercase tracking-wider">
              Soneya Delivery
            </span>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="w-9 h-9 rounded-full bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] text-[#2F4F42] hover:text-[#0B2B1E] dark:text-emerald-200/70 dark:hover:text-white flex items-center justify-center cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Screen View (100% en Français, pas de Google/Facebook) */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* SCREEN: BIENVENUE */}
          {screen === 'welcome' && (
            <div className="text-center space-y-5 animate-in fade-in">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-[#0B7A4B] text-white flex items-center justify-center shadow-md shadow-[#0B7A4B]/25">
                <Smartphone className="w-10 h-10" />
              </div>
              <div>
                <h2 className="font-heading font-black text-2xl text-[#0B2B1E] dark:text-white">
                  Bienvenue sur Soneya
                </h2>
                <p className="text-xs text-[#2F4F42] dark:text-emerald-200/70 mt-1 leading-relaxed">
                  Conakry commande. Soneya livre. Connexion 100 % sécurisée par numéro de téléphone et SMS.
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => setScreen('login')}
                  className="w-full min-h-[46px] py-3.5 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white font-heading font-bold text-xs shadow-md shadow-[#0B7A4B]/20 transition cursor-pointer"
                >
                  Continuer avec mon numéro de téléphone (+224)
                </button>
              </div>

              <div className="text-xs text-[#2F4F42] dark:text-emerald-200/70">
                Vous avez déjà un compte ?{' '}
                <button
                  onClick={() => setScreen('login')}
                  className="font-bold text-[#0B7A4B] dark:text-[#10B981] underline"
                >
                  Se connecter
                </button>
              </div>
            </div>
          )}

          {/* SCREEN: CONNEXION */}
          {screen === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 animate-in fade-in">
              <div>
                <h2 className="font-heading font-black text-xl text-[#0B2B1E] dark:text-white">
                  Connexion Sécurisée
                </h2>
                <p className="text-xs text-[#2F4F42] dark:text-emerald-200/70 mt-0.5">
                  Accédez à votre espace par numéro de téléphone guinéen
                </p>
              </div>

              {/* Role selector tab */}
              <div className="grid grid-cols-4 gap-1 p-1 bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] rounded-xl text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setRole('client')}
                  className={`py-2 rounded-lg transition ${
                    role === 'client' ? 'bg-[#0B7A4B] text-white shadow-xs font-bold' : 'text-[#2F4F42] dark:text-emerald-200/70'
                  }`}
                >
                  Client
                </button>
                <button
                  type="button"
                  onClick={() => setRole('partner')}
                  className={`py-2 rounded-lg transition truncate px-1 ${
                    role === 'partner' ? 'bg-[#0B7A4B] text-white shadow-xs font-bold' : 'text-[#2F4F42] dark:text-emerald-200/70'
                  }`}
                >
                  Commerçant
                </button>
                <button
                  type="button"
                  onClick={() => setRole('courier')}
                  className={`py-2 rounded-lg transition ${
                    role === 'courier' ? 'bg-[#0B7A4B] text-white shadow-xs font-bold' : 'text-[#2F4F42] dark:text-emerald-200/70'
                  }`}
                >
                  Livreur
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`py-2 rounded-lg transition ${
                    role === 'admin' ? 'bg-[#0B7A4B] text-white shadow-xs font-bold' : 'text-[#2F4F42] dark:text-emerald-200/70'
                  }`}
                >
                  Admin
                </button>
              </div>

              {/* Phone input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#2F4F42] dark:text-emerald-200/70">
                  Numéro de téléphone (+224)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#0B7A4B] dark:text-[#FFB81F]">
                    +224
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="622 78 90 12"
                    className="w-full pl-14 pr-10 py-3 text-xs rounded-xl bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] text-[#0B2B1E] dark:text-white focus:outline-none focus:border-[#0B7A4B] font-semibold"
                  />
                  <Phone className="w-4 h-4 text-[#5C7A6E] absolute right-3 top-3.5" />
                </div>
              </div>

              {/* Password input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#2F4F42] dark:text-emerald-200/70">
                    Mot de passe
                  </label>
                  <button
                    type="button"
                    onClick={() => setScreen('forgot')}
                    className="text-[11px] font-semibold text-[#0B7A4B] dark:text-[#10B981] hover:underline cursor-pointer"
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
                    className="w-full px-3.5 pr-10 py-3 text-xs rounded-xl bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] text-[#0B2B1E] dark:text-white focus:outline-none focus:border-[#0B7A4B]"
                  />
                  <Lock className="w-4 h-4 text-[#5C7A6E] absolute right-3 top-3.5" />
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full min-h-[46px] py-3.5 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white font-heading font-bold text-xs shadow-md shadow-[#0B7A4B]/20 transition cursor-pointer"
              >
                {loading ? 'Vérification en cours...' : 'Recevoir le code SMS de vérification'}
              </button>

              {/* Switch to SignUp */}
              <div className="text-center text-xs text-[#2F4F42] dark:text-emerald-200/70 pt-1">
                Pas encore de compte ?{' '}
                <button
                  type="button"
                  onClick={() => setScreen('signup')}
                  className="font-bold text-[#0B7A4B] dark:text-[#10B981] underline cursor-pointer"
                >
                  Créer un compte
                </button>
              </div>

              {/* Quick Demo Login Shortcuts */}
              <div className="pt-2 border-t border-[#E2ECE7] dark:border-[#1E3B2D]">
                <div className="text-[10px] font-bold uppercase text-[#5C7A6E] dark:text-emerald-200/60 text-center mb-1.5">
                  Accès démo rapide (1 clic)
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('client')}
                    className="min-h-[38px] py-2 px-2 rounded-lg bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] text-[10px] font-semibold text-[#0B2B1E] dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-[#13291F]"
                  >
                    Démo Client
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('partner')}
                    className="min-h-[38px] py-2 px-2 rounded-lg bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] text-[10px] font-semibold text-[#0B2B1E] dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-[#13291F]"
                  >
                    Démo Commerçant
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* SCREEN: INSCRIPTION */}
          {screen === 'signup' && (
            <form onSubmit={handleSignUpSubmit} className="space-y-4 animate-in fade-in">
              <div>
                <h2 className="font-heading font-black text-xl text-[#0B2B1E] dark:text-white">
                  Créer un compte Soneya
                </h2>
                <p className="text-xs text-[#2F4F42] dark:text-emerald-200/70 mt-0.5">
                  Rejoignez la communauté Soneya à Conakry
                </p>
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#2F4F42] dark:text-emerald-200/70">
                  Nom et prénom
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Amadou Diallo"
                    className="w-full px-3.5 pr-10 py-3 text-xs rounded-xl bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] text-[#0B2B1E] dark:text-white focus:outline-none focus:border-[#0B7A4B]"
                  />
                  <User className="w-4 h-4 text-[#5C7A6E] absolute right-3 top-3.5" />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#2F4F42] dark:text-emerald-200/70">
                  Numéro de téléphone (+224)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#0B7A4B] dark:text-[#FFB81F]">
                    +224
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="622 78 90 12"
                    className="w-full pl-14 pr-10 py-3 text-xs rounded-xl bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] text-[#0B2B1E] dark:text-white focus:outline-none focus:border-[#0B7A4B] font-semibold"
                  />
                  <Phone className="w-4 h-4 text-[#5C7A6E] absolute right-3 top-3.5" />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#2F4F42] dark:text-emerald-200/70">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Au moins 6 caractères"
                    className="w-full px-3.5 pr-10 py-3 text-xs rounded-xl bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] text-[#0B2B1E] dark:text-white focus:outline-none focus:border-[#0B7A4B]"
                  />
                  <Lock className="w-4 h-4 text-[#5C7A6E] absolute right-3 top-3.5" />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full min-h-[46px] py-3.5 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white font-heading font-bold text-xs shadow-md shadow-[#0B7A4B]/20 transition cursor-pointer"
              >
                {loading ? 'Création en cours...' : "S'inscrire et recevoir le code SMS"}
              </button>

              {/* Switch to Login */}
              <div className="text-center text-xs text-[#2F4F42] dark:text-emerald-200/70 pt-1">
                Vous avez déjà un compte ?{' '}
                <button
                  type="button"
                  onClick={() => setScreen('login')}
                  className="font-bold text-[#0B7A4B] dark:text-[#10B981] underline cursor-pointer"
                >
                  Se connecter
                </button>
              </div>
            </form>
          )}

          {/* SCREEN: MOT DE PASSE OUBLIÉ */}
          {screen === 'forgot' && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <h2 className="font-heading font-black text-xl text-[#0B2B1E] dark:text-white">
                  Réinitialiser le mot de passe
                </h2>
                <p className="text-xs text-[#2F4F42] dark:text-emerald-200/70 mt-1 leading-relaxed">
                  Entrez votre numéro de téléphone pour recevoir un code SMS de réinitialisation.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#2F4F42] dark:text-emerald-200/70">
                  Numéro de téléphone (+224)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#0B7A4B] dark:text-[#FFB81F]">
                    +224
                  </span>
                  <input
                    type="tel"
                    value={resetPhone}
                    onChange={(e) => setResetPhone(e.target.value)}
                    placeholder="622 78 90 12"
                    className="w-full pl-14 pr-10 py-3 text-xs rounded-xl bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] text-[#0B2B1E] dark:text-white focus:outline-none focus:border-[#0B7A4B] font-semibold"
                  />
                  <Phone className="w-4 h-4 text-[#5C7A6E] absolute right-3 top-3.5" />
                </div>
              </div>

              <button
                onClick={() => {
                  showToast('Code SMS envoyé', 'Code SMS de sécurité envoyé au +224 ' + resetPhone, 'status');
                  setScreen('otp');
                }}
                className="w-full min-h-[46px] py-3.5 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white font-heading font-bold text-xs shadow-md shadow-[#0B7A4B]/20 transition cursor-pointer"
              >
                Envoyer le code SMS
              </button>

              <button
                type="button"
                onClick={() => setScreen('login')}
                className="w-full min-h-[40px] py-2 text-xs font-semibold text-[#2F4F42] hover:text-[#0B2B1E] dark:text-emerald-200/70 dark:hover:text-white text-center cursor-pointer"
              >
                Retour à la connexion
              </button>
            </div>
          )}

          {/* SCREEN: VALIDATION CODE OTP + CLAVIER NUMÉRIQUE */}
          {screen === 'otp' && (
            <div className="space-y-4 text-center animate-in fade-in">
              <div>
                <h2 className="font-heading font-black text-xl text-[#0B2B1E] dark:text-white">
                  Code de vérification SMS
                </h2>
                <p className="text-xs text-[#2F4F42] dark:text-emerald-200/70 mt-1 leading-relaxed">
                  Saisissez le code secret à 4 chiffres envoyé au{' '}
                  <strong className="text-[#0B2B1E] dark:text-white">+224 {phone}</strong>
                </p>
              </div>

              {/* 4 OTP Digit Boxes */}
              <div className="flex justify-center gap-2.5 py-2">
                {[0, 1, 2, 3].map((idx) => {
                  const isCurrent = activeDigitIndex === idx;
                  const val = otpDigits[idx];
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveDigitIndex(idx)}
                      className={`w-12 h-14 rounded-xl border text-xl font-mono font-black flex items-center justify-center transition cursor-pointer ${
                        isCurrent
                          ? 'border-[#0B7A4B] ring-2 ring-[#0B7A4B]/25 bg-white dark:bg-[#10231B] text-[#0B2B1E] dark:text-white'
                          : val
                          ? 'border-[#D4E9DD] dark:border-[#1E3B2D] bg-white dark:bg-[#10231B] text-[#0B2B1E] dark:text-white'
                          : 'border-[#E2ECE7] dark:border-[#1E3B2D] bg-white dark:bg-[#10231B] text-[#5C7A6E]'
                      }`}
                    >
                      {val || ''}
                    </button>
                  );
                })}
              </div>

              <div className="text-xs text-[#2F4F42] dark:text-emerald-200/70">
                Vous n'avez pas reçu le code ?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setOtpDigits(['8', '4', '1', '9']);
                    showToast('Nouveau code SMS', 'Code SMS renvoyé : 8419', 'status');
                  }}
                  className="font-bold text-[#0B7A4B] dark:text-[#10B981] underline cursor-pointer"
                >
                  Renvoyer par SMS
                </button>
              </div>

              {/* Numeric Keypad */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => handleNumpadPress(digit)}
                    className="min-h-[44px] py-3 rounded-xl bg-white dark:bg-[#10231B] hover:bg-emerald-50 dark:hover:bg-[#13291F] text-base font-bold font-mono text-[#0B2B1E] dark:text-white transition active:scale-95 cursor-pointer shadow-xs border border-[#D4E9DD] dark:border-[#1E3B2D]"
                  >
                    {digit}
                  </button>
                ))}
                <div />
                <button
                  type="button"
                  onClick={() => handleNumpadPress('0')}
                  className="min-h-[44px] py-3 rounded-xl bg-white dark:bg-[#10231B] hover:bg-emerald-50 dark:hover:bg-[#13291F] text-base font-bold font-mono text-[#0B2B1E] dark:text-white transition active:scale-95 cursor-pointer shadow-xs border border-[#D4E9DD] dark:border-[#1E3B2D]"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={handleNumpadDelete}
                  className="min-h-[44px] py-3 rounded-xl bg-white dark:bg-[#10231B] hover:bg-emerald-50 dark:hover:bg-[#13291F] text-xs font-bold text-[#0B2B1E] dark:text-emerald-100 transition active:scale-95 cursor-pointer shadow-xs border border-[#D4E9DD] dark:border-[#1E3B2D]"
                >
                  Effacer
                </button>
              </div>

              {/* Confirm Code CTA */}
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full min-h-[46px] mt-2 py-3.5 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white font-heading font-bold text-xs shadow-md shadow-[#0B7A4B]/20 transition cursor-pointer"
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
