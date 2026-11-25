import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronDown, Eye, EyeOff, ArrowLeft, Check, ShieldCheck, UserCheck } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    login,
    showToast,
    setSpace,
    setShowLandingPortal,
    setIsPrivacyModalOpen,
  } = useApp();

  // Screen flow:
  // 1 = Connexion (login)
  // 2 = Choix du type de compte ("Vous êtes ?")
  // 3 = Inscription avec code SMS à 4 cases
  const [screen, setScreen] = useState<1 | 2 | 3>(1);

  // Selected account type for registration / role switching
  const [accountType, setAccountType] = useState<'client' | 'partner' | 'courier'>('client');

  // Language pill selector
  const [language, setLanguage] = useState<'Français' | 'English' | 'Soussou' | 'Pular'>('Français');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  // Form states - Login
  const [loginPhone, setLoginPhone] = useState('622 45 78 90');
  const [loginPassword, setLoginPassword] = useState('••••••••');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Form states - Register
  const [registerName, setRegisterName] = useState('');
  const [registerPhone, setRegisterPhone] = useState('622 10 20 30');
  const [registerPassword, setRegisterPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(true);

  // 4 SMS code digit boxes
  const [smsDigits, setSmsDigits] = useState<string[]>(['4', '2', '', '']);
  const [resendTimer, setResendTimer] = useState(42);
  const [canResend, setCanResend] = useState(false);
  const digitInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Quick switch role state for multi-role handling
  const [quickRole, setQuickRole] = useState<'client' | 'partner' | 'courier' | 'admin'>('client');
  const [isLoading, setIsLoading] = useState(false);

  // Countdown timer for SMS code
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (screen === 3 && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [screen, resendTimer]);

  if (!isAuthModalOpen) return null;

  // Format Guinea Phone Number as user types (+224 6XX XX XX XX)
  const formatGuineaPhone = (raw: string) => {
    let digits = raw.replace(/\D/g, '');
    if (digits.startsWith('224')) digits = digits.slice(3);
    if (digits.length > 9) digits = digits.slice(0, 9);
    
    // Format into 6XX XX XX XX
    const parts = [];
    if (digits.length > 0) parts.push(digits.slice(0, 3));
    if (digits.length > 3) parts.push(digits.slice(3, 5));
    if (digits.length > 5) parts.push(digits.slice(5, 7));
    if (digits.length > 7) parts.push(digits.slice(7, 9));
    return parts.join(' ');
  };

  // Handle digit input change in 4-box SMS code
  const handleDigitChange = (index: number, value: string) => {
    const cleanValue = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...smsDigits];
    newDigits[index] = cleanValue;
    setSmsDigits(newDigits);

    if (cleanValue && index < 3) {
      digitInputRefs[index + 1].current?.focus();
    }
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !smsDigits[index] && index > 0) {
      digitInputRefs[index - 1].current?.focus();
    }
  };

  // Resend SMS Code simulation
  const handleResendCode = () => {
    setResendTimer(45);
    setCanResend(false);
    setSmsDigits(['8', '4', '', '']);
    showToast('Nouveau SMS envoyé', 'Code de vérification envoyé au +224 ' + registerPhone, 'info');
  };

  // Quick switch profile for multi-role handling ("gérer plusieurs trucs")
  const handleSelectQuickRole = (role: 'client' | 'partner' | 'courier' | 'admin') => {
    setQuickRole(role);
    if (role === 'client') {
      setLoginPhone('622 45 78 90');
      setLoginPassword('soneya2026');
    } else if (role === 'courier') {
      setLoginPhone('624 88 12 34');
      setLoginPassword('rider2026');
    } else if (role === 'partner') {
      setLoginPhone('628 33 44 55');
      setLoginPassword('commerce2026');
    } else if (role === 'admin') {
      setLoginPhone('620 99 00 11');
      setLoginPassword('admin2026');
    }
  };

  // Submit Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      if (quickRole === 'admin') {
        setSpace('admin');
        window.history.pushState({}, '', '/admin');
        showToast('Super Admin connecté', 'Accès confidentiel au Command Center Soneya HQ', 'success');
      } else if (quickRole === 'courier') {
        login(loginPhone, 'Ibrahima Sory', 'courier', undefined, 'c-1');
        setSpace('courier');
        window.history.pushState({}, '', '/livreur');
        showToast('Connexion Livreur réussie', 'Bienvenue sur votre cockpit de course', 'success');
      } else if (quickRole === 'partner') {
        login(loginPhone, 'Chez Fanta', 'partner', 'chez-fanta');
        setSpace('partner');
        window.history.pushState({}, '', '/partenaire');
        showToast('Connexion Entreprise réussie', 'Bienvenue sur votre gestionnaire de commerce', 'success');
      } else {
        login(loginPhone, 'Mamadou Diallo', 'client');
        setSpace('client');
        window.history.pushState({}, '', '/client');
        showToast('Connexion réussie', 'Bienvenue sur Soneya Delivery Conakry !', 'success');
      }

      setShowLandingPortal(false);
      setIsAuthModalOpen(false);
    }, 500);
  };

  // Submit Registration
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptTerms) {
      showToast('Conditions requises', "Veuillez accepter les conditions d'utilisation.", 'status');
      return;
    }

    const code = smsDigits.join('');
    if (code.length < 4) {
      // Auto-complete if partial for quick test
      setSmsDigits(['4', '2', '8', '9']);
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      const name = registerName.trim() || (accountType === 'client' ? 'Mamadou Diallo' : accountType === 'courier' ? 'Ibrahima Sory' : 'Chez Fanta');

      if (accountType === 'courier') {
        login(registerPhone, name, 'courier', undefined, 'c-1');
        setSpace('courier');
        window.history.pushState({}, '', '/livreur');
        showToast('Compte Livreur créé', 'Bienvenue Ibrahima ! Complétez vos vérifications KYC.', 'success');
      } else if (accountType === 'partner') {
        login(registerPhone, name, 'partner', 'chez-fanta');
        setSpace('partner');
        window.history.pushState({}, '', '/partenaire');
        showToast('Compte Entreprise activé', 'Bienvenue sur votre espace boutique Soneya.', 'success');
      } else {
        login(registerPhone, name, 'client');
        setSpace('client');
        window.history.pushState({}, '', '/client');
        showToast('Compte Client activé', 'Bienvenue sur Soneya Delivery Conakry !', 'success');
      }

      setShowLandingPortal(false);
      setIsAuthModalOpen(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/70 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      {/* Modal Shell Container */}
      <div className="relative w-full max-w-[420px] bg-[#FFFFFF] rounded-[28px] border border-[#E2E8F0] shadow-2xl flex flex-col my-auto overflow-hidden text-[#0F172A]">
        {/* Close button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] flex items-center justify-center transition cursor-pointer"
          aria-label="Fermer"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        {/* =========================================================================
            SCREEN 1 : CONNEXION (Strictly matching Left Screen of soneya-client-1.png)
           ========================================================================= */}
        {screen === 1 && (
          <div className="p-6 sm:p-8 flex flex-col">
            {/* Top Bar with Language Selector */}
            <div className="flex items-center justify-end pr-8 mb-4">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="px-3.5 py-1 rounded-full border border-[#E2E8F0] bg-[#FFFFFF] text-xs font-semibold text-[#0F172A] flex items-center gap-1 shadow-2xs hover:bg-[#F8FAFC] cursor-pointer"
                >
                  <span>{language}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
                </button>

                {showLanguageMenu && (
                  <div className="absolute right-0 mt-1.5 w-32 bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] shadow-lg py-1 z-30">
                    {(['Français', 'English', 'Soussou', 'Pular'] as const).map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => {
                          setLanguage(lang);
                          setShowLanguageMenu(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-[#F1F5F9] transition ${
                          language === lang ? 'text-[#1E3A8A] font-bold bg-[#EFF6FF]' : 'text-[#334155]'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Soneya Pin Badge (Matching exact rounded square blue badge with white pin & red dot) */}
            <div className="flex flex-col items-center text-center mt-1 mb-6">
              <div className="w-[72px] h-[72px] rounded-[22px] bg-[#1E3A8A] flex items-center justify-center shadow-md relative mb-4">
                {/* Custom SVG Location Pin matching Soneya reference */}
                <svg width="42" height="42" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Pin Body */}
                  <path
                    d="M24 4C15.163 4 8 11.163 8 20C8 30.8 22.4 43.2 23.016 43.725C23.3 43.968 23.65 44.095 24 44.095C24.35 44.095 24.7 43.968 24.984 43.725C25.6 43.2 40 30.8 40 20C40 11.163 32.837 4 24 4Z"
                    fill="white"
                  />
                  {/* Blue circular center */}
                  <circle cx="24" cy="20" r="10.5" fill="#1E3A8A" />
                  {/* Letter 'S' inside */}
                  <text
                    x="24"
                    y="24.5"
                    textAnchor="middle"
                    fill="white"
                    fontSize="13"
                    fontFamily="Manrope, sans-serif"
                    fontWeight="800"
                  >
                    S
                  </text>
                  {/* Small red pin highlight at bottom */}
                  <circle cx="24" cy="41" r="2.2" fill="#D8432F" />
                </svg>
              </div>

              <h1 className="text-[22px] font-extrabold text-[#1E3A8A] font-headline tracking-tight">
                Bienvenue sur Soneya
              </h1>
              <p className="text-xs text-[#64748B] font-medium mt-1">
                Connectez-vous à votre compte
              </p>
            </div>

            {/* Multi-role Fast Switcher ("dans tout ça là, on doit pouvoir gérer plusieurs trucs") */}
            <div className="mb-5 p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block mb-1.5 px-1">
                Profil de test / Rôle actif
              </span>
              <div className="grid grid-cols-4 gap-1">
                {[
                  { id: 'client', label: 'Client', icon: '👤' },
                  { id: 'courier', label: 'Livreur', icon: '🛵' },
                  { id: 'partner', label: 'Boutique', icon: '🏪' },
                  { id: 'admin', label: 'Admin', icon: '🛡️' },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleSelectQuickRole(r.id as any)}
                    className={`px-1.5 py-1.5 rounded-lg text-[11px] font-bold flex flex-col items-center gap-0.5 transition cursor-pointer ${
                      quickRole === r.id
                        ? 'bg-[#1E3A8A] text-white shadow-xs'
                        : 'bg-white text-[#475569] border border-[#E2E8F0] hover:bg-[#F1F5F9]'
                    }`}
                  >
                    <span className="text-xs">{r.icon}</span>
                    <span>{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
              {/* Phone Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#334155]">Téléphone</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#64748B]">
                    +224
                  </div>
                  <input
                    type="tel"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(formatGuineaPhone(e.target.value))}
                    placeholder="6_ _ _ _ _ _ _ _"
                    required
                    className="w-full pl-14 pr-4 py-3 rounded-xl border border-[#CBD5E1] bg-[#FFFFFF] text-sm text-[#0F172A] font-medium outline-hidden focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/10 transition"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#334155]">Mot de passe</label>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-[#FFFFFF] text-sm text-[#0F172A] font-medium outline-hidden focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/10 transition pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] cursor-pointer"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => showToast('Réinitialisation SMS', 'Un lien de réinitialisation sécurisé a été transmis par SMS.', 'info')}
                    className="text-xs font-medium text-[#1E3A8A] hover:underline cursor-pointer"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
              </div>

              {/* Primary Button: Se connecter (Coral #D8432F) */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-[#D8432F] text-white font-headline text-sm font-bold shadow-md hover:bg-[#D8432F]/90 active:scale-98 transition cursor-pointer flex items-center justify-center gap-2 mt-1"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Se connecter</span>
                )}
              </button>

              {/* Divider: ou */}
              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-[#E2E8F0]" />
                <span className="text-xs text-[#94A3B8] font-medium">ou</span>
                <div className="flex-1 h-px bg-[#E2E8F0]" />
              </div>

              {/* Secondary Button: Créer un compte (White with navy border #1E3A8A) */}
              <button
                type="button"
                onClick={() => setScreen(2)}
                className="w-full py-3.5 rounded-xl bg-white border-1.5 border-[#1E3A8A] text-[#1E3A8A] font-headline text-sm font-bold hover:bg-[#F8FAFC] active:scale-98 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Créer un compte</span>
              </button>
            </form>
          </div>
        )}

        {/* =========================================================================
            SCREEN 2 : CHOIX DU COMPTE (Matching Right Screen of soneya-client-1.png)
           ========================================================================= */}
        {screen === 2 && (
          <div className="p-6 sm:p-8 flex flex-col">
            {/* Top Bar with Back Arrow & Title */}
            <div className="flex items-center gap-3 mb-6">
              <button
                type="button"
                onClick={() => setScreen(1)}
                className="w-8 h-8 rounded-full bg-[#F1F5F9] text-[#0F172A] hover:bg-[#E2E8F0] flex items-center justify-center transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h2 className="text-base font-extrabold text-[#0F172A] font-headline">
                Créer un compte
              </h2>
            </div>

            {/* Header Question */}
            <div className="mb-6">
              <h1 className="text-xl font-extrabold text-[#0F172A] font-headline tracking-tight">
                Vous êtes ?
              </h1>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                Choisissez le type de compte.<br />
                Un compte correspond à un seul rôle.
              </p>
            </div>

            {/* 3 Selectable Cards with Radio Buttons */}
            <div className="flex flex-col gap-3.5 mb-6">
              {/* Card 1: Client */}
              <div
                onClick={() => setAccountType('client')}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  accountType === 'client'
                    ? 'border-[#1E3A8A] bg-[#EFF6FF]/40 shadow-xs ring-1 ring-[#1E3A8A]'
                    : 'border-[#E2E8F0] bg-[#FFFFFF] hover:border-[#CBD5E1]'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=160&q=80"
                    alt="Client Platter"
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex flex-col">
                    <span className="font-headline font-bold text-sm text-[#0F172A]">Client</span>
                    <span className="text-[11px] text-[#64748B] leading-tight">
                      Commandez repas, courses, pharmacie et colis
                    </span>
                  </div>
                </div>

                {/* Radio Indicator */}
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    accountType === 'client'
                      ? 'border-[#1E3A8A] bg-[#1E3A8A]'
                      : 'border-[#CBD5E1] bg-white'
                  }`}
                >
                  {accountType === 'client' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>

              {/* Card 2: Entreprise */}
              <div
                onClick={() => setAccountType('partner')}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  accountType === 'partner'
                    ? 'border-[#1E3A8A] bg-[#EFF6FF]/40 shadow-xs ring-1 ring-[#1E3A8A]'
                    : 'border-[#E2E8F0] bg-[#FFFFFF] hover:border-[#CBD5E1]'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=160&q=80"
                    alt="Entreprise"
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex flex-col">
                    <span className="font-headline font-bold text-sm text-[#0F172A]">Entreprise</span>
                    <span className="text-[11px] text-[#64748B] leading-tight">
                      Restaurant, boutique ou pharmacie : vendez en ligne
                    </span>
                  </div>
                </div>

                {/* Radio Indicator */}
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    accountType === 'partner'
                      ? 'border-[#1E3A8A] bg-[#1E3A8A]'
                      : 'border-[#CBD5E1] bg-white'
                  }`}
                >
                  {accountType === 'partner' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>

              {/* Card 3: Livreur */}
              <div
                onClick={() => setAccountType('courier')}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  accountType === 'courier'
                    ? 'border-[#1E3A8A] bg-[#EFF6FF]/40 shadow-xs ring-1 ring-[#1E3A8A]'
                    : 'border-[#E2E8F0] bg-[#FFFFFF] hover:border-[#CBD5E1]'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src="https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=160&q=80"
                    alt="Livreur"
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex flex-col">
                    <span className="font-headline font-bold text-sm text-[#0F172A]">Livreur</span>
                    <span className="text-[11px] text-[#64748B] leading-tight">
                      Acceptez des missions et gagnez à chaque course
                    </span>
                  </div>
                </div>

                {/* Radio Indicator */}
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    accountType === 'courier'
                      ? 'border-[#1E3A8A] bg-[#1E3A8A]'
                      : 'border-[#CBD5E1] bg-white'
                  }`}
                >
                  {accountType === 'courier' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>
            </div>

            {/* Continuer Button (Coral #D8432F) */}
            <button
              type="button"
              onClick={() => {
                setScreen(3);
                setResendTimer(42);
                setCanResend(false);
              }}
              className="w-full py-3.5 rounded-xl bg-[#D8432F] text-white font-headline text-sm font-bold shadow-md hover:bg-[#D8432F]/90 active:scale-98 transition cursor-pointer"
            >
              Continuer
            </button>
          </div>
        )}

        {/* =========================================================================
            SCREEN 3 : INSCRIPTION & CODE SMS (Matching Left Screen of soneya-client-2.png)
           ========================================================================= */}
        {screen === 3 && (
          <div className="p-6 sm:p-8 flex flex-col">
            {/* Top Bar with Back Arrow & Dynamic Role Title */}
            <div className="flex items-center gap-3 mb-6">
              <button
                type="button"
                onClick={() => setScreen(2)}
                className="w-8 h-8 rounded-full bg-[#F1F5F9] text-[#0F172A] hover:bg-[#E2E8F0] flex items-center justify-center transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h2 className="text-base font-extrabold text-[#0F172A] font-headline">
                {accountType === 'client' && 'Compte Client'}
                {accountType === 'partner' && 'Compte Entreprise'}
                {accountType === 'courier' && 'Compte Livreur'}
              </h2>
            </div>

            <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
              {/* Field 1: Nom complet */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#334155]">Nom complet</label>
                <input
                  type="text"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  placeholder={accountType === 'partner' ? '[Nom du commerce / restaurant]' : '[Prénom Nom]'}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-[#FFFFFF] text-sm text-[#0F172A] font-medium outline-hidden focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/10 transition"
                />
              </div>

              {/* Field 2: Téléphone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#334155]">Téléphone</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#64748B]">
                    +224
                  </div>
                  <input
                    type="tel"
                    value={registerPhone}
                    onChange={(e) => setRegisterPhone(formatGuineaPhone(e.target.value))}
                    placeholder="6_ _ _ _ _ _ _ _"
                    required
                    className="w-full pl-14 pr-4 py-3 rounded-xl border border-[#CBD5E1] bg-[#FFFFFF] text-sm text-[#0F172A] font-medium outline-hidden focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/10 transition"
                  />
                </div>
              </div>

              {/* Field 3: Mot de passe */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#334155]">Mot de passe</label>
                <input
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-[#FFFFFF] text-sm text-[#0F172A] font-medium outline-hidden focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/10 transition"
                />
              </div>

              {/* Section: Code reçu par SMS (4 Large Square Boxes) */}
              <div className="flex flex-col gap-2 mt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#334155]">Code reçu par SMS</label>
                  <span className="text-[11px] text-[#1E3A8A] font-semibold cursor-pointer" onClick={() => setSmsDigits(['4', '2', '8', '9'])}>
                    Code test : 4289
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {smsDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={digitInputRefs[idx]}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                      className={`h-14 text-center font-headline text-xl font-bold rounded-2xl border transition-all outline-hidden ${
                        digit
                          ? 'border-[#1E3A8A] bg-[#EFF6FF]/30 text-[#1E3A8A] ring-1 ring-[#1E3A8A]'
                          : 'border-[#CBD5E1] bg-[#FFFFFF] text-[#0F172A] focus:border-[#1E3A8A]'
                      }`}
                    />
                  ))}
                </div>

                {/* Resend Countdown Link */}
                <div className="text-left mt-0.5">
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendCode}
                      className="text-xs font-bold text-[#D8432F] hover:underline cursor-pointer"
                    >
                      Renvoyer le code maintenant
                    </button>
                  ) : (
                    <span className="text-xs text-[#64748B]">
                      Renvoyer le code dans 00:{resendTimer < 10 ? `0${resendTimer}` : resendTimer}
                    </span>
                  )}
                </div>
              </div>

              {/* Checkbox: J'accepte les conditions d'utilisation */}
              <div className="flex items-center gap-2.5 mt-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="w-4 h-4 rounded-md accent-[#1E3A8A] cursor-pointer"
                />
                <label htmlFor="terms" className="text-xs text-[#475569] cursor-pointer select-none">
                  J'accepte les{' '}
                  <button
                    type="button"
                    onClick={() => setIsPrivacyModalOpen(true)}
                    className="text-[#1E3A8A] font-semibold hover:underline"
                  >
                    conditions d'utilisation
                  </button>
                </label>
              </div>

              {/* Primary CTA Button: Créer mon compte (Coral #D8432F) */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-[#D8432F] text-white font-headline text-sm font-bold shadow-md hover:bg-[#D8432F]/90 active:scale-98 transition cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Créer mon compte</span>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
