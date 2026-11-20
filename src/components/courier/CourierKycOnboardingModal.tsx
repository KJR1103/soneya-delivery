import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CourierApplication, PaymentMethod } from '../../types';
import { SignaturePad } from './SignaturePad';
import { sound } from '../../utils/audio';
import {
  X,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Camera,
  CheckCircle2,
  Lock,
  FileText,
  Bike,
  AlertCircle,
  AlertTriangle,
} from 'lucide-react';

interface CourierKycOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingApplication?: CourierApplication;
}

export const CourierKycOnboardingModal: React.FC<CourierKycOnboardingModalProps> = ({
  isOpen,
  onClose,
  existingApplication,
}) => {
  const { submitCourierKyc, showToast } = useApp();

  // Current Step (1 to 5)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [fullName, setFullName] = useState(existingApplication?.fullName || 'Ibrahim Kourouma');
  const [phone, setPhone] = useState(existingApplication?.phone || '+224 621 88 44 22');
  const [email] = useState(existingApplication?.email || 'ibrahim.kourouma224@gmail.com');
  const [quartier, setQuartier] = useState(existingApplication?.quartier || 'Dixinn / Minière');

  // Step 1: ID & Selfie & Emergency
  const [cniNumber, setCniNumber] = useState(existingApplication?.documents.cniNumber || 'CNI-224-44910283-GN');
  const [selfiePhotoUrl] = useState(
    existingApplication?.documents.selfiePhotoUrl ||
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
  );
  const [emergencyName, setEmergencyName] = useState(
    existingApplication?.documents.emergencyContact.fullName || 'Mariama Camara'
  );
  const [emergencyRelation, setEmergencyRelation] = useState(
    existingApplication?.documents.emergencyContact.relationship || 'Sœur'
  );
  const [emergencyPhone, setEmergencyPhone] = useState(
    existingApplication?.documents.emergencyContact.phone || '+224 628 33 22 11'
  );

  // Step 2: Vehicle & Residence
  const [vehicleBrandModel, setVehicleBrandModel] = useState(
    existingApplication?.documents.vehicleBrandModel || 'Moto Haojue 125 (Bleue)'
  );
  const [plateNumber, setPlateNumber] = useState(
    existingApplication?.documents.plateNumber || 'RC-4210-AH'
  );

  // Step 3: Mobile Money
  const [momoProvider, setMomoProvider] = useState<PaymentMethod>(
    existingApplication?.documents.momoProvider || 'orange_money'
  );
  const [momoNumber, setMomoNumber] = useState(
    existingApplication?.documents.momoNumber || '621 88 44 22'
  );
  const [momoAccountName, setMomoAccountName] = useState(
    existingApplication?.documents.momoAccountName || 'Ibrahim Kourouma'
  );

  // Step 4: Charter commitments (7 required)
  const [helmetCompliant, setHelmetCompliant] = useState(true);
  const [highwayCodeCompliant, setHighwayCodeCompliant] = useState(true);
  const [punctualAndNotifyCompliant, setPunctualAndNotifyCompliant] = useState(true);
  const [noTamperParcelCompliant, setNoTamperParcelCompliant] = useState(true);
  const [deliverOnlyWith4DigitCodeCompliant, setDeliverOnlyWith4DigitCodeCompliant] = useState(true);
  const [politenessCompliant, setPolitenessCompliant] = useState(true);
  const [sanctionsAccepted, setSanctionsAccepted] = useState(true);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(
    existingApplication?.charter.signatureDataUrl ||
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60"><path d="M10 40 Q 60 10 110 35 T 190 20" stroke="%230B7A4B" stroke-width="3" fill="none"/></svg>'
  );

  // Step 5: Privacy consent
  const [hasConsentedStorage, setHasConsentedStorage] = useState(true);
  const [hasCertifiedAccuracy, setHasCertifiedAccuracy] = useState(true);

  if (!isOpen) return null;

  const totalSteps = 5;

  const stepsMetadata = [
    { num: 1, title: 'Identité & Selfie', desc: 'CNI biométrique & contact' },
    { num: 2, title: 'Véhicule & Résidence', desc: 'Carte grise & certificat' },
    { num: 3, title: 'Mobile Money', desc: 'Paiement de vos gains' },
    { num: 4, title: 'Charte du Livreur', desc: '7 engagements & signature' },
    { num: 5, title: 'Consentement & Envoi', desc: 'Stockage privé sécurisé' },
  ];

  const handleNext = () => {
    sound.playPop();
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    sound.playPop();
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!signatureDataUrl) {
      sound.playPop();
      showToast('Signature manquante', 'Veuillez signer la charte avant d envoyer votre dossier', 'status');
      setCurrentStep(4);
      return;
    }

    if (!hasConsentedStorage || !hasCertifiedAccuracy) {
      sound.playPop();
      showToast('Consentement requis', 'Veuillez cocher les cases de consentement légal', 'status');
      return;
    }

    const applicationData: CourierApplication = {
      id: existingApplication?.id || `kyc-app-${Date.now().toString().slice(-4)}`,
      courierId: existingApplication?.courierId || `c-${Date.now().toString().slice(-4)}`,
      fullName,
      phone,
      email,
      quartier,
      status: 'pending_verification',
      submittedAt: new Date().toISOString(),
      documents: {
        cniRectoUrl: 'specimen_cni_recto',
        cniVersoUrl: 'specimen_cni_verso',
        cniNumber,
        carteGriseUrl: 'specimen_carte_grise',
        certificatResidenceUrl: 'specimen_certif_residence',
        selfiePhotoUrl,
        vehicleBrandModel,
        plateNumber,
        momoProvider,
        momoNumber,
        momoAccountName,
        emergencyContact: {
          fullName: emergencyName,
          relationship: emergencyRelation,
          phone: emergencyPhone,
        },
      },
      charter: {
        helmetCompliant,
        highwayCodeCompliant,
        punctualAndNotifyCompliant,
        noTamperParcelCompliant,
        deliverOnlyWith4DigitCodeCompliant,
        politenessCompliant,
        sanctionsAccepted,
        signatureDataUrl,
        signedAt: new Date().toISOString(),
      },
    };

    submitCourierKyc(applicationData);
    onClose();
  };

  const handleFillDemoExample = () => {
    setFullName('Ousmane Sylla');
    setPhone('+224 625 77 11 00');
    setQuartier('Kaloum / Boulbinet');
    setCniNumber('CNI-224-91823019-GN');
    setVehicleBrandModel('Moto TVS Apache 160 (Noire)');
    setPlateNumber('RC-3180-AG');
    setMomoProvider('orange_money');
    setMomoNumber('625 77 11 00');
    setMomoAccountName('Ousmane Sylla');
    setEmergencyName('Salimatou Sylla');
    setEmergencyRelation('Épouse');
    setEmergencyPhone('+224 628 90 12 34');
    setSignatureDataUrl(
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60"><path d="M10 30 Q 50 5 100 45 T 190 25" stroke="%230B7A4B" stroke-width="3" fill="none"/></svg>'
    );
    showToast('Exemple pré-rempli', 'Dossier complet de test chargé avec succès', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-4 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl my-auto rounded-[24px] bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] shadow-2xl overflow-hidden flex flex-col max-h-[90dvh]">
        {/* Header */}
        <div className="px-4 sm:px-5 py-4 border-b border-[#E2ECE7] dark:border-[#1E3B2D] flex items-center justify-between gap-3 bg-white dark:bg-[#0C1913] shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#0B7A4B] text-white flex items-center justify-center shadow-xs shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="font-heading font-extrabold text-sm sm:text-base text-[#0B2B1E] dark:text-white flex flex-wrap items-center gap-2">
                <span className="truncate">Dossier d'Inscription Livreur</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50/70 dark:bg-[#10231B] text-[#0B7A4B] dark:text-emerald-300 border border-[#D4E9DD] dark:border-[#1E3B2D] shrink-0">
                  Étape {currentStep}/5
                </span>
              </h2>
              <p className="text-[11px] text-[#5C7A6E] dark:text-emerald-300/70 truncate">
                Soneya Delivery · Flotte sécurisée Conakry
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleFillDemoExample}
              className="text-[11px] font-semibold text-[#0B7A4B] dark:text-emerald-300 hover:underline px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] cursor-pointer hidden sm:inline-block"
              title="Pré-remplir pour le test rapide"
            >
              Exemple démo
            </button>
            <button
              onClick={onClose}
              aria-label="Fermer"
              className="w-10 h-10 rounded-full bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] text-[#2F4F42] dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-[#163126] flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#E2ECE7] dark:bg-[#10231B] h-1.5 shrink-0">
          <div
            className="bg-[#0B7A4B] h-1.5 transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Sub-header step indicator */}
        <div className="px-4 sm:px-5 py-2.5 bg-white dark:bg-[#08120D] border-b border-[#E2ECE7] dark:border-[#1E3B2D] text-xs flex items-center justify-between gap-2 shrink-0">
          <span className="font-bold text-[#0B2B1E] dark:text-white truncate">
            {stepsMetadata[currentStep - 1].title}
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] text-[#5C7A6E] dark:text-emerald-300/70">
              {stepsMetadata[currentStep - 1].desc}
            </span>
            <button
              type="button"
              onClick={handleFillDemoExample}
              className="text-[10px] font-semibold text-[#0B7A4B] dark:text-emerald-300 underline sm:hidden cursor-pointer"
            >
              Démo
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 bg-white dark:bg-[#0C1913]">
          {/* STEP 1: Identité & Selfie guidé */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#10231B] border border-[#E2ECE7] dark:border-[#1E3B2D] text-xs text-[#2F4F42] dark:text-emerald-200/80 flex items-start gap-2.5 shadow-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#0B7A4B] dark:text-emerald-300" />
                <p className="leading-relaxed">
                  Fournissez une pièce d'identité officielle en cours de validité (CNI biométrique ou Passeport guinéen) et un selfie visage dégagé.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#0B2B1E] dark:text-emerald-100">
                    Nom et Prénoms complets *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#D4E9DD] dark:border-[#1E3B2D] bg-white dark:bg-[#08120D] text-[#0B2B1E] dark:text-white focus:outline-none focus:border-[#0B7A4B]"
                    placeholder="ex: Mamadou Bah"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#0B2B1E] dark:text-emerald-100">
                    Numéro de Téléphone *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#D4E9DD] dark:border-[#1E3B2D] bg-white dark:bg-[#08120D] text-[#0B2B1E] dark:text-white focus:outline-none focus:border-[#0B7A4B]"
                    placeholder="+224 620 00 00 00"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#0B2B1E] dark:text-emerald-100">
                  Numéro de la Carte Nationale d'Identité (CNI) *
                </label>
                <input
                  type="text"
                  value={cniNumber}
                  onChange={e => setCniNumber(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 text-xs font-mono rounded-xl border border-[#D4E9DD] dark:border-[#1E3B2D] bg-white dark:bg-[#08120D] text-[#0B2B1E] dark:text-white focus:outline-none focus:border-[#0B7A4B]"
                  placeholder="CNI-224-XXXXXXXX-GN"
                />
              </div>

              {/* Photos CNI Recto & Verso */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#0B2B1E] dark:text-emerald-100">
                  Photos de la pièce d'identité (Recto & Verso) *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl border border-[#E2ECE7] dark:border-[#1E3B2D] bg-white dark:bg-[#10231B] text-center space-y-1.5 shadow-xs">
                    <div className="w-8 h-8 mx-auto rounded-full bg-emerald-50/70 dark:bg-[#08120D] border border-[#D4E9DD] dark:border-[#1E3B2D] flex items-center justify-center text-[#0B7A4B] dark:text-emerald-300">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-[#0B2B1E] dark:text-white">
                      CNI Recto
                    </div>
                    <span className="text-[10px] text-[#5C7A6E] dark:text-emerald-300/70 font-semibold block">
                      Pièce prête (Recto)
                    </span>
                  </div>

                  <div className="p-3 rounded-xl border border-[#E2ECE7] dark:border-[#1E3B2D] bg-white dark:bg-[#10231B] text-center space-y-1.5 shadow-xs">
                    <div className="w-8 h-8 mx-auto rounded-full bg-emerald-50/70 dark:bg-[#08120D] border border-[#D4E9DD] dark:border-[#1E3B2D] flex items-center justify-center text-[#0B7A4B] dark:text-emerald-300">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-[#0B2B1E] dark:text-white">
                      CNI Verso
                    </div>
                    <span className="text-[10px] text-[#5C7A6E] dark:text-emerald-300/70 font-semibold block">
                      Pièce prête (Verso)
                    </span>
                  </div>
                </div>
              </div>

              {/* Guided Selfie with Oval Silhouette */}
              <div className="p-4 rounded-xl bg-white dark:bg-[#10231B] border border-[#E2ECE7] dark:border-[#1E3B2D] space-y-3 shadow-xs">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-[#0B7A4B] dark:text-emerald-300 shrink-0" />
                    <span className="text-xs font-bold text-[#0B2B1E] dark:text-white">
                      Photo d'identité (Selfie guidé) *
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-[#5C7A6E] dark:text-emerald-300/70 shrink-0">
                    Visage bien cadré
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {/* Oval Frame */}
                  <div className="relative w-20 h-24 sm:w-24 sm:h-28 shrink-0 rounded-[50%/60%] overflow-hidden border-2 border-[#0B7A4B] shadow-xs">
                    <img src={selfiePhotoUrl} alt="Selfie" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 border border-white/40 pointer-events-none" />
                  </div>
                  <div className="space-y-1 text-xs text-[#2F4F42] dark:text-emerald-200/80">
                    <p className="font-semibold text-[#0B2B1E] dark:text-white">
                      Consignes pour le selfie :
                    </p>
                    <ul className="text-[11px] list-disc list-inside space-y-0.5 text-[#5C7A6E] dark:text-emerald-300/70">
                      <li>Visage centré dans l'ovale</li>
                      <li>Sans lunettes de soleil ni casque</li>
                      <li>Lumière naturelle suffisante</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Personne de confiance */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#10231B] border border-[#E2ECE7] dark:border-[#1E3B2D] space-y-2.5 shadow-xs">
                <span className="text-xs font-bold text-[#0B2B1E] dark:text-white block">
                  Contact d'une personne de confiance (Sécurité & Urgence) *
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <input
                    type="text"
                    value={emergencyName}
                    onChange={e => setEmergencyName(e.target.value)}
                    placeholder="Nom complet"
                    className="px-3 py-2 rounded-xl border border-[#D4E9DD] dark:border-[#1E3B2D] bg-white dark:bg-[#08120D] text-[#0B2B1E] dark:text-white focus:outline-none focus:border-[#0B7A4B]"
                  />
                  <select
                    value={emergencyRelation}
                    onChange={e => setEmergencyRelation(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-[#D4E9DD] dark:border-[#1E3B2D] bg-white dark:bg-[#08120D] text-[#0B2B1E] dark:text-white focus:outline-none focus:border-[#0B7A4B]"
                  >
                    <option value="Épouse">Époux / Épouse</option>
                    <option value="Parent">Parent (Père / Mère)</option>
                    <option value="Frère">Frère / Sœur</option>
                    <option value="Ami proche">Ami(e) proche</option>
                    <option value="Autre">Autre</option>
                  </select>
                  <input
                    type="tel"
                    value={emergencyPhone}
                    onChange={e => setEmergencyPhone(e.target.value)}
                    placeholder="Téléphone urgence"
                    className="px-3 py-2 rounded-xl border border-[#D4E9DD] dark:border-[#1E3B2D] bg-white dark:bg-[#08120D] text-[#0B2B1E] dark:text-white focus:outline-none focus:border-[#0B7A4B]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Véhicule & Résidence à Conakry */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-[#D4E9DD] dark:border-emerald-900/40 text-xs text-[#0B2B1E] dark:text-emerald-300 flex items-start gap-2.5">
                <Bike className="w-4 h-4 shrink-0 mt-0.5 text-[#0B7A4B] dark:text-emerald-400" />
                <p className="leading-relaxed">
                  Pour la sécurité des livraisons, le motard doit opérer avec une moto en règle (carte grise) et justifier de sa résidence à Conakry.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#0B2B1E] dark:text-emerald-100">
                    Modèle de moto / véhicule *
                  </label>
                  <input
                    type="text"
                    value={vehicleBrandModel}
                    onChange={e => setVehicleBrandModel(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#D4E9DD] dark:border-[#1E3B2D] bg-white dark:bg-[#08120D] text-[#0B2B1E] dark:text-white focus:outline-none focus:border-[#0B7A4B]"
                    placeholder="ex: Moto TVS Apache 180"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#0B2B1E] dark:text-emerald-100">
                    Plaque d'immatriculation (Conakry) *
                  </label>
                  <input
                    type="text"
                    value={plateNumber}
                    onChange={e => setPlateNumber(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 text-xs font-mono uppercase rounded-xl border border-[#D4E9DD] dark:border-[#1E3B2D] bg-white dark:bg-[#08120D] text-[#0B2B1E] dark:text-white focus:outline-none focus:border-[#0B7A4B]"
                    placeholder="ex: RC-8492-AG"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#0B2B1E] dark:text-emerald-100">
                  Quartier de résidence habituelle à Conakry *
                </label>
                <input
                  type="text"
                  value={quartier}
                  onChange={e => setQuartier(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#D4E9DD] dark:border-[#1E3B2D] bg-white dark:bg-[#08120D] text-[#0B2B1E] dark:text-white focus:outline-none focus:border-[#0B7A4B]"
                  placeholder="ex: Kipé, Lambanyi, Kaloum, Matam..."
                />
              </div>

              {/* Justificatifs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl border border-[#E2ECE7] dark:border-[#1E3B2D] bg-white dark:bg-[#10231B] space-y-2 shadow-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#0B2B1E] dark:text-white">
                      Carte Grise de la Moto
                    </span>
                    <span className="text-[10px] font-bold text-[#0B7A4B] dark:text-emerald-400">Prêt</span>
                  </div>
                  <p className="text-[11px] text-[#5C7A6E] dark:text-emerald-300/70">
                    Délivrée par la DNTT de Guinée (mentionnant le numéro de châssis).
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl border border-[#E2ECE7] dark:border-[#1E3B2D] bg-white dark:bg-[#10231B] space-y-2 shadow-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#0B2B1E] dark:text-white">
                      Certificat de Résidence
                    </span>
                    <span className="text-[10px] font-bold text-[#0B7A4B] dark:text-emerald-400">Prêt</span>
                  </div>
                  <p className="text-[11px] text-[#5C7A6E] dark:text-emerald-300/70">
                    Certificat signé par le chef de quartier ou la mairie de commune.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Mobile Money pour le versement des gains */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#10231B] border border-[#E2ECE7] dark:border-[#1E3B2D] text-xs text-[#2F4F42] dark:text-emerald-200/80 space-y-1 shadow-xs">
                <strong className="block font-bold text-[#0B2B1E] dark:text-white">Paiement direct & instantané à 80%</strong>
                <p className="text-[11px] leading-relaxed">
                  Sur Soneya, 80% des frais de livraison et 100% des pourboires reviennent au livreur. Indiquez le compte Mobile Money sur lequel vous recevrez vos fonds.
                </p>
              </div>

              {/* Provider Selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#0B2B1E] dark:text-emerald-100">
                  Opérateur Mobile Money *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMomoProvider('orange_money')}
                    className={`p-3.5 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                      momoProvider === 'orange_money'
                        ? 'border-[#0B7A4B] bg-emerald-50/70 dark:bg-[#10231B] text-[#0B2B1E] dark:text-white font-bold'
                        : 'border-[#E2ECE7] dark:border-[#1E3B2D] bg-white dark:bg-[#08120D] text-[#2F4F42] dark:text-emerald-200/80'
                    }`}
                  >
                    <div>
                      <div className="font-extrabold text-xs">Orange Money</div>
                      <span className="text-[10px] text-[#5C7A6E] dark:text-emerald-300/70">Guinée (620 à 629)</span>
                    </div>
                    {momoProvider === 'orange_money' && (
                      <CheckCircle2 className="w-4 h-4 text-[#0B7A4B] dark:text-emerald-400 shrink-0" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setMomoProvider('mtn_momo')}
                    className={`p-3.5 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                      momoProvider === 'mtn_momo'
                        ? 'border-[#0B7A4B] bg-emerald-50/70 dark:bg-[#10231B] text-[#0B2B1E] dark:text-white font-bold'
                        : 'border-[#E2ECE7] dark:border-[#1E3B2D] bg-white dark:bg-[#08120D] text-[#2F4F42] dark:text-emerald-200/80'
                    }`}
                  >
                    <div>
                      <div className="font-extrabold text-xs">MTN MoMo</div>
                      <span className="text-[10px] text-[#5C7A6E] dark:text-emerald-300/70">Guinée (660 à 669)</span>
                    </div>
                    {momoProvider === 'mtn_momo' && (
                      <CheckCircle2 className="w-4 h-4 text-[#0B7A4B] dark:text-emerald-400 shrink-0" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#0B2B1E] dark:text-emerald-100">
                  Numéro de téléphone Mobile Money *
                </label>
                <input
                  type="tel"
                  value={momoNumber}
                  onChange={e => setMomoNumber(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 text-xs font-mono rounded-xl border border-[#D4E9DD] dark:border-[#1E3B2D] bg-white dark:bg-[#08120D] text-[#0B2B1E] dark:text-white focus:outline-none focus:border-[#0B7A4B]"
                  placeholder="ex: 622 45 89 12"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#0B2B1E] dark:text-emerald-100">
                  Nom exact sur le compte Mobile Money *
                </label>
                <input
                  type="text"
                  value={momoAccountName}
                  onChange={e => setMomoAccountName(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#D4E9DD] dark:border-[#1E3B2D] bg-white dark:bg-[#08120D] text-[#0B2B1E] dark:text-white focus:outline-none focus:border-[#0B7A4B]"
                  placeholder="Doit correspondre à la pièce d'identité"
                />
                <p className="text-[10px] text-[#5C7A6E] dark:text-emerald-300/70">
                  Pour éviter tout virement sur un mauvais compte, ce nom sera vérifié par l'administrateur.
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: Charte du Livreur Soneya & Signature manuscrite */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#10231B] text-[#0B2B1E] dark:text-white space-y-1 border border-[#E2ECE7] dark:border-[#1E3B2D] shadow-xs">
                <div className="flex items-center gap-2 text-[#0B7A4B] dark:text-emerald-300">
                  <FileText className="w-4 h-4 shrink-0" />
                  <strong className="text-xs font-extrabold uppercase tracking-wide">
                    Charte Officielle du Motard Soneya
                  </strong>
                </div>
                <p className="text-[11px] text-[#2F4F42] dark:text-emerald-200/80 leading-relaxed">
                  Lisez attentivement chaque engagement et cochez pour valider. Toute infraction expose le motard à des sanctions (avertissement, suspension ou radiation).
                </p>
              </div>

              {/* 7 Mandatory Commitments */}
              <div className="space-y-2 text-xs">
                <label className="flex items-start gap-2.5 p-2.5 rounded-xl border border-[#E2ECE7] dark:border-[#1E3B2D] hover:bg-emerald-50/40 dark:hover:bg-[#10231B] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={helmetCompliant}
                    onChange={e => setHelmetCompliant(e.target.checked)}
                    className="mt-0.5 rounded text-[#0B7A4B] focus:ring-[#0B7A4B]"
                  />
                  <div>
                    <strong className="text-[#0B2B1E] dark:text-white block text-[11px]">
                      1. Port du casque obligatoire
                    </strong>
                    <span className="text-[11px] text-[#5C7A6E] dark:text-emerald-300/70">
                      Casque avec visière homologué attaché à chaque trajet, de jour comme de nuit.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-2.5 rounded-xl border border-[#E2ECE7] dark:border-[#1E3B2D] hover:bg-emerald-50/40 dark:hover:bg-[#10231B] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={highwayCodeCompliant}
                    onChange={e => setHighwayCodeCompliant(e.target.checked)}
                    className="mt-0.5 rounded text-[#0B7A4B] focus:ring-[#0B7A4B]"
                  />
                  <div>
                    <strong className="text-[#0B2B1E] dark:text-white block text-[11px]">
                      2. Respect strict du code de la route guinéen
                    </strong>
                    <span className="text-[11px] text-[#5C7A6E] dark:text-emerald-300/70">
                      Respect des feux tricolores, limitations de vitesse et interdiction formelle des sens interdits.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-2.5 rounded-xl border border-[#E2ECE7] dark:border-[#1E3B2D] hover:bg-emerald-50/40 dark:hover:bg-[#10231B] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={punctualAndNotifyCompliant}
                    onChange={e => setPunctualAndNotifyCompliant(e.target.checked)}
                    className="mt-0.5 rounded text-[#0B7A4B] focus:ring-[#0B7A4B]"
                  />
                  <div>
                    <strong className="text-[#0B2B1E] dark:text-white block text-[11px]">
                      3. Ponctualité & Communication
                    </strong>
                    <span className="text-[11px] text-[#5C7A6E] dark:text-emerald-300/70">
                      Prévenir le client et le partenaire immédiatement en cas d'embouteillage majeur ou retard imprévu.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-2.5 rounded-xl border border-[#E2ECE7] dark:border-[#1E3B2D] hover:bg-emerald-50/40 dark:hover:bg-[#10231B] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={noTamperParcelCompliant}
                    onChange={e => setNoTamperParcelCompliant(e.target.checked)}
                    className="mt-0.5 rounded text-[#0B7A4B] focus:ring-[#0B7A4B]"
                  />
                  <div>
                    <strong className="text-[#0B2B1E] dark:text-white block text-[11px]">
                      4. Intégrité absolue des colis
                    </strong>
                    <span className="text-[11px] text-[#5C7A6E] dark:text-emerald-300/70">
                      Ne jamais ouvrir, goûter, altérer ou échanger un colis ou un plat sous scellé.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-2.5 rounded-xl border border-[#E2ECE7] dark:border-[#1E3B2D] hover:bg-emerald-50/40 dark:hover:bg-[#10231B] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={deliverOnlyWith4DigitCodeCompliant}
                    onChange={e => setDeliverOnlyWith4DigitCodeCompliant(e.target.checked)}
                    className="mt-0.5 rounded text-[#0B7A4B] focus:ring-[#0B7A4B]"
                  />
                  <div>
                    <strong className="text-[#0B2B1E] dark:text-white block text-[11px]">
                      5. Remise sécurisée par code secret à 4 chiffres
                    </strong>
                    <span className="text-[11px] text-[#5C7A6E] dark:text-emerald-300/70">
                      Ne jamais valider une course sans avoir saisi le code à 4 chiffres fourni par le client.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-2.5 rounded-xl border border-[#E2ECE7] dark:border-[#1E3B2D] hover:bg-emerald-50/40 dark:hover:bg-[#10231B] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={politenessCompliant}
                    onChange={e => setPolitenessCompliant(e.target.checked)}
                    className="mt-0.5 rounded text-[#0B7A4B] focus:ring-[#0B7A4B]"
                  />
                  <div>
                    <strong className="text-[#0B2B1E] dark:text-white block text-[11px]">
                      6. Politesse & Respect mutuel
                    </strong>
                    <span className="text-[11px] text-[#5C7A6E] dark:text-emerald-300/70">
                      Salutations courtoises, tenue soignée, écoute et attitude professionnelle envers tous les usagers.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-2.5 rounded-xl border border-[#E2ECE7] dark:border-[#1E3B2D] hover:bg-emerald-50/40 dark:hover:bg-[#10231B] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sanctionsAccepted}
                    onChange={e => setSanctionsAccepted(e.target.checked)}
                    className="mt-0.5 rounded text-[#0B7A4B] focus:ring-[#0B7A4B]"
                  />
                  <div>
                    <strong className="text-[#0B2B1E] dark:text-white block text-[11px]">
                      7. Acceptation des sanctions administratives
                    </strong>
                    <span className="text-[11px] text-[#5C7A6E] dark:text-emerald-300/70">
                      Avertissement écrit, suspension temporaire de compte ou radiation définitive en cas de faute grave.
                    </span>
                  </div>
                </label>
              </div>

              {/* Interactive Digital Signature Pad */}
              <div className="pt-2">
                <SignaturePad
                  onSignatureChange={setSignatureDataUrl}
                  existingSignature={signatureDataUrl}
                />
              </div>
            </div>
          )}

          {/* STEP 5: Confidentialité, Consentement & Envoi */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-white dark:bg-[#10231B] border border-[#E2ECE7] dark:border-[#1E3B2D] text-[#0B2B1E] dark:text-white space-y-2 shadow-xs">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-[#0B7A4B] dark:text-emerald-300 shrink-0" />
                  <span className="font-extrabold text-xs uppercase tracking-wider text-[#0B7A4B] dark:text-emerald-300">
                    Protection des Données Personnelles & RLS
                  </span>
                </div>
                <p className="text-xs text-[#2F4F42] dark:text-emerald-200/80 leading-relaxed">
                  Vos pièces justificatives (CNI, carte grise, selfie) constituent des données hautement sensibles. Elles sont transférées vers un bucket privé sécurisé (Supabase Storage chiffré) avec des politiques de sécurité strictes (Row Level Security).
                </p>
                <div className="pt-2 border-t border-[#E2ECE7] dark:border-[#1E3B2D] text-[11px] text-[#5C7A6E] dark:text-emerald-300/70 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0B7A4B] dark:text-emerald-300 shrink-0" />
                    <span>Aucun client ni commerçant partenaire n'a accès à vos pièces d'identité.</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0B7A4B] dark:text-emerald-300 shrink-0" />
                    <span>Seul l'administrateur de conformité Soneya peut les consulter pour vérification.</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <label className="flex items-start gap-2.5 p-3 rounded-xl border border-[#E2ECE7] dark:border-[#1E3B2D] hover:bg-emerald-50/40 dark:hover:bg-[#10231B] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasConsentedStorage}
                    onChange={e => setHasConsentedStorage(e.target.checked)}
                    className="mt-0.5 rounded text-[#0B7A4B] focus:ring-[#0B7A4B]"
                  />
                  <span className="text-[#2F4F42] dark:text-emerald-100">
                    Je consens au traitement et au stockage sécurisé de mes documents officiels par Guinée Hub Technologie aux seules fins de vérification de mon dossier de coursier.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 p-3 rounded-xl border border-[#E2ECE7] dark:border-[#1E3B2D] hover:bg-emerald-50/40 dark:hover:bg-[#10231B] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasCertifiedAccuracy}
                    onChange={e => setHasCertifiedAccuracy(e.target.checked)}
                    className="mt-0.5 rounded text-[#0B7A4B] focus:ring-[#0B7A4B]"
                  />
                  <span className="text-[#2F4F42] dark:text-emerald-100">
                    Je certifie sur l'honneur l'exactitude de toutes les pièces et coordonnées fournies et m'engage à respecter scrupuleusement la charte Soneya.
                  </span>
                </label>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-[#10231B] border border-[#E2ECE7] dark:border-[#1E3B2D] text-xs text-[#2F4F42] dark:text-emerald-200/80 flex items-center gap-2 shadow-xs">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>
                  Après soumission, votre statut passera en <strong>"En cours de vérification"</strong>. Vous ne pourrez recevoir aucune course avant l'approbation de l'administrateur Soneya.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="px-4 sm:px-5 py-3.5 border-t border-[#E2ECE7] dark:border-[#1E3B2D] bg-white dark:bg-[#0C1913] flex items-center justify-between gap-2 shrink-0">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2.5 rounded-xl border border-[#D4E9DD] dark:border-[#1E3B2D] text-[#0B2B1E] dark:text-emerald-100 hover:bg-emerald-50/60 dark:hover:bg-[#10231B] text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Précédent</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <span>Continuer</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!hasConsentedStorage || !hasCertifiedAccuracy}
              className="px-5 sm:px-6 py-2.5 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span className="truncate">Soumettre mon dossier à l'administrateur</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
