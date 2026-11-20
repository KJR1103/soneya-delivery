import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SpaceType } from '../../types';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    login,
    showToast,
    setSpace,
    setShowLandingPortal,
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedProfile, setSelectedProfile] = useState<'client' | 'courier' | 'partner'>('client');
  const [selectedCategory, setSelectedCategory] = useState<string>('Restaurants');

  // Step 3 inputs
  const [authProvider, setAuthProvider] = useState<'gmail' | 'apple' | null>(null);
  const [fullname, setFullname] = useState('Mamadou Diallo');
  const [phone, setPhone] = useState('622 45 78 90');
  const [smsSent, setSmsSent] = useState(false);
  const [otpCode, setOtpCode] = useState('8419');
  const [otpInput, setOtpInput] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [quartier, setQuartier] = useState('Kipé');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSendSms = () => {
    if (!phone || phone.length < 8) {
      showToast('Numéro invalide', 'Veuillez saisir un numéro guinéen valide (+224)', 'status');
      return;
    }
    const generatedCode = String(Math.floor(1000 + Math.random() * 9000));
    setOtpCode(generatedCode);
    setSmsSent(true);
    setOtpInput(generatedCode); // auto-fill for smooth test UX
    showToast('Code SMS envoyé', `Votre code de validation est ${generatedCode} (envoyé au +224 ${phone})`, 'info');
  };

  const handleVerifyOtp = () => {
    if (otpInput === otpCode || otpInput.length === 4) {
      setIsOtpVerified(true);
      showToast('Numéro validé (+224)', 'Votre numéro de téléphone guinéen a été vérifié par SMS.', 'success');
    } else {
      showToast('Code erroné', 'Veuillez saisir le code à 4 chiffres reçu par SMS.', 'status');
    }
  };

  const handleCompleteAccount = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isOtpVerified && !smsSent) {
      handleSendSms();
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      if (selectedProfile === 'courier') {
        login(phone, fullname || 'Ibrahima Sory', 'courier', undefined, 'c-1');
        setSpace('courier');
        window.history.pushState({}, '', '/livreur');
      } else if (selectedProfile === 'partner') {
        login(phone, fullname || 'Chez Fanta', 'partner', 'chez-fanta');
        setSpace('partner');
        window.history.pushState({}, '', '/partenaire');
      } else {
        login(phone, fullname || 'Mamadou Diallo', 'client');
        setSpace('client');
        window.history.pushState({}, '', '/client');
      }

      setShowLandingPortal(false);
      setIsAuthModalOpen(false);
      showToast(
        'Compte activé',
        `Bienvenue ${fullname || 'cher utilisateur'} sur Soneya Delivery Conakry !`,
        'success'
      );
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-xl bg-light-surface dark:bg-dark-surface border border-light-outline dark:border-dark-outline shadow-2xl flex flex-col my-auto text-light-on-surface dark:text-dark-on-surface">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/40 text-white hover:bg-black/60 flex items-center justify-center transition cursor-pointer"
          aria-label="Fermer"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        {/* Hero Launch Banner (Matching cr_er_un_compte_soneya.html) */}
        <div className="relative h-44 w-full shrink-0 overflow-hidden">
          <img
            src="https://lh3.googleusercontent.com/aida/ALJJyrDOVbyCG7iDk1IqvVsS3i9m3bqn_yDySv4ygE4Mo59SXzlDAQpJv_kquFGVRLcdpgs51hz7PdjG6t_2FS44qtBZQ9GRAscCnB0AC9XRcptw9UB4jijVXD_FtOn3n0yHcUzqeOeNFzla-4169GT5FD7wsqef3RfIjjFeuN7_Fbt3ysP5UgrVyL_rG0sALBcukd4SY3nKwn6DiesytRju-ZF6u6ENcATvEXWeqWntTnUc77gni6-34Kc4yDoCpFJLKg"
            alt="Bienvenue sur Soneya Delivery Conakry"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-surface/95 via-dark-surface/50 to-transparent flex flex-col justify-end p-gutter-md">
            <span className="self-start px-2.5 py-0.5 rounded-full bg-accent text-on-accent font-label text-label-sm font-semibold mb-1">
              Bienvenue à Conakry
            </span>
            <h1 className="font-display text-display-md-mobile text-white">
              Créez votre espace Soneya
            </h1>
          </div>
        </div>

        <main className="flex-1 p-gutter-md sm:p-gutter-lg flex flex-col gap-gutter-lg">
          {/* Step 1: Choose Public Space (strictly Client, Rider, Business - 0 Admin) */}
          <section className="flex flex-col gap-gutter-sm">
            <h2 className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface font-semibold flex items-center justify-between">
              <span>1. Choisissez votre profil</span>
              <span className="text-xs font-normal text-light-on-surface-variant">3 espaces publics</span>
            </h2>
            <div className="grid grid-cols-3 gap-gutter-sm">
              {/* Client Profile */}
              <button
                type="button"
                onClick={() => setSelectedProfile('client')}
                className={`p-gutter-sm rounded-lg flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  selectedProfile === 'client'
                    ? 'bg-light-primary-container dark:bg-dark-primary-container border-2 border-light-primary text-light-primary dark:text-dark-primary font-bold shadow-xs'
                    : 'bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface hover:bg-light-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-title-lg" aria-hidden="true">shopping_bag</span>
                <span className="font-label text-label-md">Client</span>
              </button>

              {/* Rider Profile */}
              <button
                type="button"
                onClick={() => setSelectedProfile('courier')}
                className={`p-gutter-sm rounded-lg flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  selectedProfile === 'courier'
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-2 border-courier text-courier font-bold shadow-xs'
                    : 'bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface hover:bg-light-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-title-lg text-courier" aria-hidden="true">two_wheeler</span>
                <span className="font-label text-label-md">Rider</span>
              </button>

              {/* Business Profile */}
              <button
                type="button"
                onClick={() => setSelectedProfile('partner')}
                className={`p-gutter-sm rounded-lg flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  selectedProfile === 'partner'
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-2 border-partner text-partner font-bold shadow-xs'
                    : 'bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface hover:bg-light-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-title-lg text-partner" aria-hidden="true">storefront</span>
                <span className="font-label text-label-md">Business</span>
              </button>
            </div>
          </section>

          {/* Step 2: Preferred Category */}
          <section className="flex flex-col gap-gutter-sm">
            <h2 className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface font-semibold">
              2. Catégorie préférée
            </h2>
            <div className="flex flex-wrap gap-gutter-sm">
              {['Restaurants', 'Supermarché', 'Pharmacie', 'Colis Express'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-gutter-md py-2 rounded-full font-label text-label-md transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary font-bold shadow-xs'
                      : 'bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface hover:bg-light-surface-container'
                  }`}
                >
                  <span>{cat}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Step 3: Account Details & Mandatory (+224) SMS Validation */}
          <form onSubmit={handleCompleteAccount} className="flex flex-col gap-gutter-md">
            <h2 className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface font-semibold">
              3. Connexion &amp; validation mobile (+224)
            </h2>

            {/* OAuth Quick Connect Buttons */}
            <div className="grid grid-cols-2 gap-gutter-sm">
              <button
                type="button"
                onClick={() => {
                  setAuthProvider('gmail');
                  setFullname('Mamadou Diallo');
                  showToast('Compte Gmail sélectionné', 'Authentification Gmail liée. Validez maintenant votre numéro +224.', 'info');
                }}
                className={`inline-flex items-center justify-center gap-gutter-xs px-gutter-md py-2.5 rounded-md border text-light-on-surface dark:text-dark-on-surface font-label text-label-md transition-colors cursor-pointer ${
                  authProvider === 'gmail'
                    ? 'bg-red-50 dark:bg-red-950/30 border-red-500 font-bold'
                    : 'bg-light-surface-container-low dark:bg-dark-surface-container-low border-light-outline dark:border-dark-outline hover:bg-light-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-title-md text-red-500" aria-hidden="true">mail</span>
                <span>Gmail</span>
                {authProvider === 'gmail' && <span className="material-symbols-outlined text-sm text-green-600">check</span>}
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthProvider('apple');
                  setFullname('Mamadou Diallo');
                  showToast('Compte Apple sélectionné', 'Apple ID lié. Validez maintenant votre numéro +224.', 'info');
                }}
                className={`inline-flex items-center justify-center gap-gutter-xs px-gutter-md py-2.5 rounded-md border text-light-on-surface dark:text-dark-on-surface font-label text-label-md transition-colors cursor-pointer ${
                  authProvider === 'apple'
                    ? 'bg-neutral-100 dark:bg-neutral-800 border-neutral-800 font-bold'
                    : 'bg-light-surface-container-low dark:bg-dark-surface-container-low border-light-outline dark:border-dark-outline hover:bg-light-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-title-md" aria-hidden="true">phone_iphone</span>
                <span>Apple</span>
                {authProvider === 'apple' && <span className="material-symbols-outlined text-sm text-green-600">check</span>}
              </button>
            </div>

            {/* Full Name */}
            <div className="flex flex-col gap-gutter-xs">
              <label htmlFor="fullname" className="font-label text-label-md text-light-on-surface dark:text-dark-on-surface font-medium">
                Nom complet
              </label>
              <input
                id="fullname"
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="Ex : Mamadou Diallo"
                required
                className="w-full px-gutter-md py-2.5 rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline font-body text-body-md text-light-on-surface dark:text-dark-on-surface focus:border-light-primary focus:ring-0 outline-hidden"
              />
            </div>

            {/* Mobile Number (+224) Mandatory Validation */}
            <div className="flex flex-col gap-gutter-xs">
              <label htmlFor="phone" className="font-label text-label-md text-light-on-surface dark:text-dark-on-surface font-medium">
                Numéro mobile à valider (+224)
              </label>
              <div className="flex items-center gap-gutter-xs">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-light-on-surface-variant">
                    +224
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setIsOtpVerified(false);
                    }}
                    placeholder="622 00 00 00"
                    required
                    className="w-full pl-14 pr-gutter-md py-2.5 rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline font-mono text-mono-md text-light-on-surface dark:text-dark-on-surface focus:border-light-primary focus:ring-0 outline-hidden"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendSms}
                  className="shrink-0 px-gutter-md py-2.5 rounded-md bg-light-primary-container dark:bg-dark-primary-container text-light-primary dark:text-dark-primary font-label text-label-md hover:opacity-90 font-semibold cursor-pointer whitespace-nowrap"
                >
                  {smsSent ? 'Renvoyer SMS' : 'Code SMS'}
                </button>
              </div>
              <span className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Obligatoire après Gmail ou Apple pour sécuriser vos livraisons et paiements Mobile Money.
              </span>
            </div>

            {/* OTP SMS Verification Code Box */}
            {smsSent && (
              <div className="p-gutter-md rounded-md bg-light-surface-container dark:bg-dark-surface-container border border-light-outline dark:border-dark-outline flex flex-col gap-gutter-xs animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-light-on-surface dark:text-dark-on-surface">
                    Code de validation SMS (4 chiffres)
                  </span>
                  {isOtpVerified ? (
                    <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">verified</span> Validé
                    </span>
                  ) : (
                    <span className="text-xs font-mono text-light-primary dark:text-dark-primary">
                      Code : {otpCode}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-gutter-sm">
                  <input
                    type="text"
                    maxLength={4}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="Ex: 8419"
                    className="flex-1 px-gutter-md py-2 rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline font-mono text-mono-md text-center tracking-widest outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="px-gutter-md py-2 rounded-md bg-light-primary dark:bg-dark-primary text-light-on-primary font-label text-label-sm font-semibold cursor-pointer"
                  >
                    Vérifier
                  </button>
                </div>
              </div>
            )}

            {/* Quartier Conakry */}
            <div className="flex flex-col gap-gutter-xs">
              <label htmlFor="quartier" className="font-label text-label-md text-light-on-surface dark:text-dark-on-surface font-medium">
                Quartier à Conakry
              </label>
              <select
                id="quartier"
                value={quartier}
                onChange={(e) => setQuartier(e.target.value)}
                className="w-full px-gutter-md py-2.5 rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline font-body text-body-md text-light-on-surface dark:text-dark-on-surface focus:border-light-primary focus:ring-0 outline-hidden"
              >
                <option value="Kipé">Kipé (Centre commercial & résidentiel)</option>
                <option value="Kaloum">Kaloum / Almamya (Centre des affaires)</option>
                <option value="Ratoma">Ratoma</option>
                <option value="Lambanyi">Lambanyi</option>
                <option value="Camayenne">Camayenne</option>
                <option value="Dixinn">Dixinn</option>
                <option value="Matam">Matam</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-gutter-sm px-gutter-lg py-3 rounded-md bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary font-label text-label-lg hover:opacity-90 active:scale-98 transition-all shadow-sm font-semibold cursor-pointer mt-2"
            >
              {loading ? (
                <span>Création en cours...</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-title-md">arrow_forward</span>
                  <span>Accéder à l'Espace {selectedProfile === 'client' ? 'Client' : selectedProfile === 'courier' ? 'Rider' : 'Business'}</span>
                </>
              )}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};
