import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { formatGnf } from '../../utils/formatters';
import { sound } from '../../utils/audio';

export const CourierView: React.FC = () => {
  const {
    currentCourierApplication,
    submitCourierKyc,
    showToast,
    user,
  } = useApp();

  // Rider state
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'kyc' | 'settings'>('dashboard');

  // KYC Onboarding state (Matching inscription_rider_kyc.html)
  const [hasCompletedKyc, setHasCompletedKyc] = useState(true);
  const [phone, setPhone] = useState(user?.phone ? `+224 ${user.phone}` : '+224 622 45 78 90');
  const [uploadedCarteGrise, setUploadedCarteGrise] = useState('carte_grise_moto.pdf');
  const [uploadedCni, setUploadedCni] = useState('carte_id_ibrahima.jpg');
  const [uploadedResidence, setUploadedResidence] = useState('certificat_residence_kipe.pdf');
  const [charterAccepted, setCharterAccepted] = useState(true);
  const [hasSigned, setHasSigned] = useState(true);

  // Active mission state (Matching #SNY-8420 in Stitch Ultra)
  const [missionStep, setMissionStep] = useState<'pickup' | 'delivering' | 'completed'>('pickup');
  const [dailyEarnings, setDailyEarnings] = useState(185000);
  const [weeklyEarnings, setWeeklyEarnings] = useState(940000);
  const [weeklyKm, setWeeklyKm] = useState(113);

  // Canvas for charter signature pad
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw initial sample signature if default hasSigned is true
    if (hasSigned && !isDrawing) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#176B4A';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(30, 60);
      ctx.bezierCurveTo(80, 20, 110, 80, 160, 40);
      ctx.bezierCurveTo(200, 10, 230, 90, 280, 50);
      ctx.stroke();
    }
  }, [hasSigned, activeTab]);

  const handleStartSigning = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setIsDrawing(true);
    setHasSigned(true);
    ctx.strokeStyle = '#176B4A';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const handleDrawSignature = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const handleStopSigning = () => {
    setIsDrawing(false);
  };

  const handleClearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  };

  const handleKycSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!charterAccepted) {
      showToast('Charte requise', 'Veuillez accepter la charte officielle des riders Soneya.', 'status');
      return;
    }
    setHasCompletedKyc(true);
    setActiveTab('dashboard');
    showToast('Dossier KYC validé', 'Félicitations ! Vos documents sont certifiés conformes.', 'success');
  };

  const handleAdvanceMission = () => {
    if (missionStep === 'pickup') {
      sound.playStatusPing();
      setMissionStep('delivering');
      showToast('Commande récupérée', 'En route vers Camayenne pour livrer Aïssatou Barry.', 'info');
    } else if (missionStep === 'delivering') {
      sound.playSuccess();
      setMissionStep('completed');
      setDailyEarnings((prev) => prev + 18000);
      setWeeklyEarnings((prev) => prev + 18000);
      showToast('Mission terminée !', '+18 000 GNF crédités sur votre compte Rider Soneya.', 'success');
    } else {
      setMissionStep('pickup');
      showToast('Nouvelle mission affectée', 'Course #SNY-8422 disponible chez Le Cèdre (Kaloum).', 'info');
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-24 bg-light-surface dark:bg-dark-surface text-light-on-surface dark:text-dark-on-surface font-body antialiased selection:bg-courier/20 selection:text-courier">
      {/* Rider Header (Matching espace_livreur_rider.html) */}
      <header className="sticky top-0 z-30 bg-light-surface-container-low/95 dark:bg-dark-surface-container-low/95 backdrop-blur-md border-b border-light-outline dark:border-dark-outline px-gutter-md py-gutter-sm flex items-center justify-between gap-gutter-sm">
        <div className="flex items-center gap-gutter-sm">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-courier text-white font-bold shrink-0">
            <span className="material-symbols-outlined text-title-lg" aria-hidden="true">two_wheeler</span>
          </span>
          <div className="min-w-0">
            <span className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface block font-bold truncate">
              {user?.fullName || 'Ibrahima Sory Bah'}
            </span>
            <span className="font-label text-label-sm text-light-primary dark:text-dark-primary inline-flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-label-sm" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">
                verified
              </span>
              Rider vérifié · Kipé
            </span>
          </div>
        </div>

        <div className="flex items-center gap-gutter-sm">
          <div className="flex bg-light-surface-container dark:bg-dark-surface-container p-0.5 rounded-full border border-light-outline dark:border-dark-outline text-xs font-semibold">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1 rounded-full cursor-pointer transition ${
                activeTab === 'dashboard'
                  ? 'bg-courier text-white font-bold shadow-xs'
                  : 'text-light-on-surface-variant'
              }`}
            >
              Missions
            </button>
            <button
              onClick={() => setActiveTab('kyc')}
              className={`px-3 py-1 rounded-full cursor-pointer transition ${
                activeTab === 'kyc'
                  ? 'bg-courier text-white font-bold shadow-xs'
                  : 'text-light-on-surface-variant'
              }`}
            >
              Dossier KYC
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsOnline(!isOnline);
              showToast(
                isOnline ? 'Mode hors-ligne' : 'En ligne',
                isOnline ? 'Vous ne recevrez plus de nouvelles courses.' : 'Prêt à recevoir des courses à Conakry !',
                isOnline ? 'status' : 'success'
              );
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-label text-label-sm font-bold transition cursor-pointer ${
              isOnline
                ? 'bg-light-primary text-light-on-primary shadow-xs'
                : 'bg-light-surface-container text-light-on-surface-variant border border-light-outline'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-white animate-pulse' : 'bg-gray-400'}`} />
            <span>{isOnline ? 'En ligne' : 'Hors ligne'}</span>
          </button>
        </div>
      </header>

      {/* Main Content: Dashboard OR KYC View */}
      {activeTab === 'kyc' ? (
        /* KYC Inscription & Document Upload View (inscription_rider_kyc.html) */
        <main className="max-w-xl mx-auto w-full px-gutter-md py-gutter-lg flex flex-col gap-gutter-lg">
          <div className="flex items-center justify-between border-b border-light-outline dark:border-dark-outline pb-gutter-sm">
            <div>
              <h1 className="font-headline text-headline-md text-light-on-surface dark:text-dark-on-surface font-bold">
                Dossier Rider Soneya
              </h1>
              <p className="text-xs text-light-on-surface-variant">Validation KYC obligatoire à Conakry</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-light-primary-container text-light-primary font-label text-label-sm font-bold">
              Étape 2/2 · Conforme
            </span>
          </div>

          <form onSubmit={handleKycSubmit} className="flex flex-col gap-gutter-lg">
            {/* Verified Mobile Number */}
            <section className="p-gutter-md rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline flex flex-col gap-gutter-xs shadow-xs">
              <label htmlFor="rider-phone" className="font-label text-label-md text-light-on-surface dark:text-dark-on-surface font-semibold">
                Numéro mobile validé
              </label>
              <div className="flex items-center justify-between gap-gutter-sm">
                <input
                  id="rider-phone"
                  type="tel"
                  value={phone}
                  readOnly
                  className="w-full px-gutter-md py-2.5 rounded-md bg-light-surface-container dark:bg-dark-surface-container border border-light-outline dark:border-dark-outline font-mono text-mono-md text-light-on-surface dark:text-dark-on-surface"
                />
                <span className="material-symbols-outlined text-title-lg text-light-primary shrink-0" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">
                  verified
                </span>
              </div>
            </section>

            {/* Required KYC Documents (Carte grise, Carte d'identité, Certificat de résidence) */}
            <section className="flex flex-col gap-gutter-sm">
              <h2 className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface font-bold">
                Documents obligatoires
              </h2>

              {/* 1. Carte Grise */}
              <div className="p-gutter-md rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline flex items-center justify-between gap-gutter-md shadow-xs">
                <div className="flex items-center gap-gutter-sm min-w-0">
                  <span className="material-symbols-outlined text-title-lg text-courier shrink-0" aria-hidden="true">
                    directions_bike
                  </span>
                  <div className="min-w-0">
                    <p className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface font-semibold truncate">
                      Carte Grise (Moto)
                    </p>
                    <p className="font-body text-body-sm text-light-primary truncate">
                      {uploadedCarteGrise}
                    </p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-title-lg text-light-primary shrink-0" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">
                  check_circle
                </span>
              </div>

              {/* 2. Carte d'Identité */}
              <div className="p-gutter-md rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline flex items-center justify-between gap-gutter-md shadow-xs">
                <div className="flex items-center gap-gutter-sm min-w-0">
                  <span className="material-symbols-outlined text-title-lg text-courier shrink-0" aria-hidden="true">
                    badge
                  </span>
                  <div className="min-w-0">
                    <p className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface font-semibold truncate">
                      Carte d'Identité (CNI)
                    </p>
                    <p className="font-body text-body-sm text-light-primary truncate">
                      {uploadedCni}
                    </p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-title-lg text-light-primary shrink-0" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">
                  check_circle
                </span>
              </div>

              {/* 3. Certificat de Résidence */}
              <div className="p-gutter-md rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline flex items-center justify-between gap-gutter-md shadow-xs">
                <div className="flex items-center gap-gutter-sm min-w-0">
                  <span className="material-symbols-outlined text-title-lg text-courier shrink-0" aria-hidden="true">
                    home_pin
                  </span>
                  <div className="min-w-0">
                    <p className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface font-semibold truncate">
                      Certificat de Résidence
                    </p>
                    <p className="font-body text-body-sm text-light-primary truncate">
                      {uploadedResidence}
                    </p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-title-lg text-light-primary shrink-0" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">
                  check_circle
                </span>
              </div>
            </section>

            {/* Charte du Livreur & Finger Signature Pad (Matching Stitch Ultra) */}
            <section className="p-gutter-md rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline flex flex-col gap-gutter-md shadow-xs">
              <div>
                <h2 className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface font-bold">
                  Charte du Livreur Soneya
                </h2>
                <p className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                  Respect des délais, tenue propre, port du casque, sécurité routière et remise intégrale des colis en GNF.
                </p>
              </div>

              {/* Interactive Signature Canvas */}
              <div className="relative rounded-md bg-light-surface-container dark:bg-dark-surface-container border border-dashed border-light-outline dark:border-dark-outline flex flex-col items-center justify-center overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={340}
                  height={110}
                  onMouseDown={handleStartSigning}
                  onMouseMove={handleDrawSignature}
                  onMouseUp={handleStopSigning}
                  onTouchStart={handleStartSigning}
                  onTouchMove={handleDrawSignature}
                  onTouchEnd={handleStopSigning}
                  className="w-full h-28 cursor-crosshair touch-none"
                />
                {!hasSigned && (
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center gap-1 text-light-on-surface-variant opacity-70">
                    <span className="material-symbols-outlined text-title-lg" aria-hidden="true">draw</span>
                    <span className="font-body text-body-sm">Signez ici avec le doigt</span>
                  </div>
                )}
                {hasSigned && (
                  <button
                    type="button"
                    onClick={handleClearSignature}
                    className="absolute right-2 top-2 px-2 py-0.5 rounded bg-black/30 text-white text-[10px] hover:bg-black/50"
                  >
                    Effacer
                  </button>
                )}
              </div>

              <label className="flex items-start gap-gutter-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={charterAccepted}
                  onChange={(e) => setCharterAccepted(e.target.checked)}
                  className="mt-0.5 rounded border-light-outline text-light-primary focus:ring-0 cursor-pointer"
                />
                <span className="font-body text-body-sm text-light-on-surface dark:text-dark-on-surface">
                  J'accepte la charte officielle des riders Soneya Conakry et atteste sur l'honneur l'exactitude de mes pièces justificatives.
                </span>
              </label>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-gutter-sm px-gutter-lg py-3 rounded-md bg-light-primary dark:bg-dark-primary text-light-on-primary font-label text-label-lg hover:opacity-90 active:scale-98 transition shadow-xs font-bold cursor-pointer"
              >
                <span>Mettre à jour mon dossier KYC</span>
              </button>
            </section>
          </form>
        </main>
      ) : (
        /* Rider Dashboard (espace_livreur_rider.html) */
        <main className="max-w-4xl mx-auto w-full px-gutter-md py-gutter-md flex flex-col gap-gutter-lg">
          {/* Weekly Activity KPI Cards (Matching img_0415) */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-md">
            <article className="p-gutter-md rounded-lg bg-courier text-white flex flex-col gap-gutter-xs shadow-xs">
              <span className="font-label text-label-sm opacity-90 font-medium">Temps moyen</span>
              <span className="font-headline text-headline-md tabular-nums font-bold">22 min</span>
              <span className="font-body text-body-sm opacity-90">37 courses / sem.</span>
            </article>

            <article className="p-gutter-md rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline shadow-xs flex flex-col gap-gutter-xs">
              <span className="font-label text-label-sm text-light-on-surface-variant dark:text-dark-on-surface-variant font-medium">
                Gains du jour
              </span>
              <span className="font-headline text-headline-md text-light-on-surface dark:text-dark-on-surface tabular-nums font-bold">
                {formatGnf(dailyEarnings)}
              </span>
              <span className="font-body text-body-sm text-light-primary dark:text-dark-primary font-semibold">
                {formatGnf(weeklyEarnings)} / sem.
              </span>
            </article>
          </section>

          {/* Weekly Distance / Activity Bar Chart (L, M, M, J, V, S, D) */}
          <section className="p-gutter-md rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline shadow-xs flex flex-col gap-gutter-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface font-bold">
                Activité de la semaine
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-courier text-white font-mono text-mono-sm font-bold">
                {weeklyKm} km
              </span>
            </div>

            <div className="h-28 flex items-end justify-between gap-3 pt-3">
              <div className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full h-12 rounded-t-sm bg-light-surface-variant dark:bg-dark-surface-variant transition-all hover:opacity-80" />
                <span className="font-label text-label-sm text-light-on-surface-variant">L</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full h-16 rounded-t-sm bg-accent transition-all hover:opacity-80" />
                <span className="font-label text-label-sm text-light-on-surface-variant">M</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full h-14 rounded-t-sm bg-light-primary dark:bg-dark-primary transition-all hover:opacity-80" />
                <span className="font-label text-label-sm text-light-on-surface-variant">M</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full h-24 rounded-t-sm bg-courier shadow-xs transition-all hover:opacity-80" />
                <span className="font-label text-label-sm text-light-on-surface dark:text-dark-on-surface font-bold">J</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full h-16 rounded-t-sm bg-accent transition-all hover:opacity-80" />
                <span className="font-label text-label-sm text-light-on-surface-variant">V</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full h-8 rounded-t-sm bg-light-surface-variant dark:bg-dark-surface-variant transition-all hover:opacity-80" />
                <span className="font-label text-label-sm text-light-on-surface-variant">S</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full h-6 rounded-t-sm bg-light-surface-variant dark:bg-dark-surface-variant transition-all hover:opacity-80" />
                <span className="font-label text-label-sm text-light-on-surface-variant">D</span>
              </div>
            </div>
          </section>

          {/* Active Mission Card (Reference img_0415 Center Screen & Stitch Ultra) */}
          <section className="p-gutter-md rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline shadow-xs flex flex-col gap-gutter-md">
            <div className="grid grid-cols-3 gap-gutter-sm text-center pb-gutter-sm border-b border-light-outline dark:border-dark-outline">
              <div>
                <span className="font-mono text-mono-md text-light-on-surface dark:text-dark-on-surface block font-bold">
                  4,2 km
                </span>
                <span className="font-label text-label-sm text-light-on-surface-variant">Distance</span>
              </div>
              <div>
                <span className="font-mono text-mono-md text-light-on-surface dark:text-dark-on-surface block font-bold">
                  12 min
                </span>
                <span className="font-label text-label-sm text-light-on-surface-variant">Restant</span>
              </div>
              <div>
                <span className="font-mono text-mono-md text-light-primary dark:text-dark-primary block font-bold">
                  18:15
                </span>
                <span className="font-label text-label-sm text-light-on-surface-variant">Arrivée</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-mono text-mono-md text-light-on-surface dark:text-dark-on-surface font-bold">
                Mission #SNY-8420
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-light-primary-container dark:bg-dark-primary-container text-light-primary dark:text-dark-primary font-label text-label-sm font-semibold">
                Payé MoMo
              </span>
            </div>

            <div className="flex flex-col gap-gutter-xs text-body-sm border-y border-light-outline/60 dark:border-dark-outline/60 py-2">
              <div className="flex justify-between">
                <span className="text-light-on-surface-variant">Départ restaurant</span>
                <span className="font-title text-light-on-surface dark:text-dark-on-surface font-semibold">
                  Chez Fanta · Kipé
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-light-on-surface-variant">Client destinataire</span>
                <span className="font-title text-light-on-surface dark:text-dark-on-surface font-semibold">
                  Aïssatou Barry · Camayenne
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-light-on-surface-variant">Gain net rider</span>
                <span className="font-mono text-light-primary dark:text-dark-primary font-bold">
                  +18 000 GNF
                </span>
              </div>
            </div>

            {/* Action button corresponding to mission status */}
            <button
              type="button"
              onClick={handleAdvanceMission}
              className={`w-full inline-flex items-center justify-center gap-gutter-sm px-gutter-lg py-3 rounded-md font-label text-label-lg transition-all shadow-xs font-bold cursor-pointer ${
                missionStep === 'pickup'
                  ? 'bg-light-primary dark:bg-dark-primary text-light-on-primary hover:opacity-90'
                  : missionStep === 'delivering'
                  ? 'bg-courier text-white hover:opacity-90'
                  : 'bg-green-600 text-white hover:opacity-90'
              }`}
            >
              <span className="material-symbols-outlined text-title-md">
                {missionStep === 'pickup' ? 'store' : missionStep === 'delivering' ? 'sports_motorsports' : 'check_circle'}
              </span>
              <span>
                {missionStep === 'pickup'
                  ? 'Confirmer la récupération chez Fanta'
                  : missionStep === 'delivering'
                  ? 'Confirmer la remise à Camayenne'
                  : 'Course terminée · En attente de la suivante'}
              </span>
            </button>
          </section>
        </main>
      )}
    </div>
  );
};
