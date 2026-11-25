import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatGnf, formatTime } from '../../utils/formatters';
import { CourierApplication, KycStatus } from '../../types';
import { DocumentSpecimenViewer } from '../courier/DocumentSpecimenViewer';

export const AdminDashboard: React.FC = () => {
  const {
    orders,
    partners,
    togglePartnerCommissionExempt,
    courierApplications,
    validateCourierKyc,
    rejectCourierKyc,
    suspendCourier,
    reactivateCourier,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pilote' | 'finances' | 'partenaires' | 'livreurs' | 'supabase'>('livreurs');

  // KYC state
  const [kycFilter, setKycFilter] = useState<'all' | 'pending_verification' | 'validated' | 'rejected' | 'suspended'>('all');
  const [selectedInspectionApp, setSelectedInspectionApp] = useState<CourierApplication | null>(null);
  const [inspectDocType, setInspectDocType] = useState<'cni' | 'carte_grise' | 'certificat_residence' | 'selfie' | 'charter'>('cni');

  // Rejection & Suspension Dialogs
  const [rejectionModalApp, setRejectionModalApp] = useState<CourierApplication | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState<string>('La photo du certificat de résidence ou de la carte grise est floue et illisible.');

  const [suspensionModalApp, setSuspensionModalApp] = useState<CourierApplication | null>(null);
  const [suspensionReasonInput, setSuspensionReasonInput] = useState<string>('Non-port du casque de sécurité constaté lors d\'une livraison à Conakry.');

  // Pilot metrics (Kipé & Kaloum - 3 mois)
  const totalDelivered = orders.filter(o => o.status === 'delivered').length + 214;
  const targetDelivered = 200;
  const activePartnersCount = partners.length;
  const targetPartners = 20;
  const activeCouriersCount = courierApplications.filter(a => a.status === 'validated').length;
  const pendingCouriersCount = courierApplications.filter(a => a.status === 'pending_verification').length;
  const averageDeliveryMinutes = 27.5;
  const codeValidationRate = 98.2;
  const clientSatisfaction = 4.85;

  // Financial aggregates
  const totalGmvGnf = orders.reduce((sum, o) => sum + o.totalGnf, 0) + 18500000;
  const totalPartnerPayoutGnf = orders.reduce((sum, o) => sum + o.partnerPayoutGnf, 0) + 14430000;
  const totalCourierPayoutGnf = orders.reduce((sum, o) => sum + o.courierPayoutGnf, 0) + 2480000;
  const totalSoneyaGrossGnf = orders.reduce((sum, o) => sum + o.soneyaCommissionGnf, 0) + 2890000;
  const totalPaymentFeeGnf = Math.round(totalGmvGnf * 0.0275);
  const totalSoneyaNetGnf = totalSoneyaGrossGnf - totalPaymentFeeGnf;

  // Filter courier applications
  const filteredApplications = courierApplications.filter(app => {
    if (kycFilter === 'all') return true;
    return app.status === kycFilter;
  });

  const handleConfirmRejection = () => {
    if (!rejectionModalApp) return;
    rejectCourierKyc(rejectionModalApp.id, rejectionReasonInput);
    if (selectedInspectionApp?.id === rejectionModalApp.id) {
      setSelectedInspectionApp(prev => prev ? { ...prev, status: 'rejected', rejectionReason: rejectionReasonInput } : null);
    }
    setRejectionModalApp(null);
  };

  const handleConfirmSuspension = () => {
    if (!suspensionModalApp) return;
    suspendCourier(suspensionModalApp.id, suspensionReasonInput);
    if (selectedInspectionApp?.id === suspensionModalApp.id) {
      setSelectedInspectionApp(prev => prev ? { ...prev, status: 'suspended', suspensionReason: suspensionReasonInput } : null);
    }
    setSuspensionModalApp(null);
  };

  const supabaseSqlSchema = `-- ==========================================
-- SONEYA DELIVERY - SCHEMA POSTGRESQL / SUPABASE
-- Conakry (Guinée) · Guinée Hub Technologie
-- ==========================================

-- 1. Table Utilisateurs (Clients, Partenaires, Livreurs, Admin)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  role VARCHAR(20) DEFAULT 'client' CHECK (role IN ('client', 'courier', 'partner', 'admin')),
  quartier VARCHAR(50) DEFAULT 'Kipé',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table Partenaires (Commerces de Conakry)
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  category VARCHAR(30) CHECK (category IN ('restaurants', 'groceries', 'shops', 'pharmacy')),
  phone VARCHAR(20) NOT NULL,
  quartier VARCHAR(50) NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  commission_rate_percent INT DEFAULT 12,
  is_first_month_exempt BOOLEAN DEFAULT FALSE,
  has_soneya_tout BOOLEAN DEFAULT FALSE,
  is_open BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table Livreurs Motards (Flotte Conakry)
CREATE TABLE couriers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  vehicle_model VARCHAR(50) NOT NULL,
  plate_number VARCHAR(30) UNIQUE NOT NULL,
  license_number VARCHAR(50) NOT NULL,
  cni_number VARCHAR(50) NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  kyc_status VARCHAR(30) DEFAULT 'pending_verification' CHECK (kyc_status IN ('incomplete', 'pending_verification', 'validated', 'rejected', 'suspended')),
  rating NUMERIC(3,2) DEFAULT 5.0,
  is_online BOOLEAN DEFAULT FALSE
);

-- 4. Table Documents KYC & Charte Sécurité (Bucket Storage Privé RLS)
CREATE TABLE courier_kyc_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  courier_id UUID REFERENCES couriers(id) ON DELETE CASCADE,
  cni_recto_url TEXT NOT NULL,
  cni_verso_url TEXT NOT NULL,
  carte_grise_url TEXT NOT NULL,
  certificat_residence_url TEXT NOT NULL,
  selfie_url TEXT NOT NULL,
  emergency_name VARCHAR(100) NOT NULL,
  emergency_phone VARCHAR(30) NOT NULL,
  emergency_relation VARCHAR(50) NOT NULL,
  momo_provider VARCHAR(20) NOT NULL,
  momo_number VARCHAR(30) NOT NULL,
  momo_account_name VARCHAR(100) NOT NULL,
  charter_signed_at TIMESTAMPTZ NOT NULL,
  charter_signature_data TEXT NOT NULL,
  rejection_reason TEXT,
  suspension_reason TEXT,
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Politiques de Sécurité Row Level Security (RLS) :
-- Strictement CONFIDENTIEL : Seul l'administrateur a le droit de lire les pièces !
ALTER TABLE courier_kyc_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin only read KYC documents" ON courier_kyc_documents
  FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- 5. Table Commandes avec calcul unitaire
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_number VARCHAR(30) UNIQUE NOT NULL,
  delivery_code VARCHAR(4) NOT NULL, -- Preuve 4 chiffres sans papier
  is_code_validated BOOLEAN DEFAULT FALSE,
  partner_id UUID REFERENCES partners(id),
  client_id UUID REFERENCES users(id),
  courier_id UUID REFERENCES couriers(id),
  status VARCHAR(20) DEFAULT 'submitted',
  items_subtotal_gnf BIGINT NOT NULL,
  delivery_distance_km NUMERIC(4,2) NOT NULL,
  delivery_fee_gnf BIGINT NOT NULL,
  service_fee_gnf BIGINT DEFAULT 3000,
  tip_gnf BIGINT DEFAULT 0,
  discount_gnf BIGINT DEFAULT 0,
  total_gnf BIGINT NOT NULL,
  payment_method VARCHAR(20) CHECK (payment_method IN ('orange_money', 'mtn_momo')),
  payment_tx_id VARCHAR(50),
  partner_payout_gnf BIGINT NOT NULL,
  courier_payout_gnf BIGINT NOT NULL,
  soneya_commission_gnf BIGINT NOT NULL,
  payment_fee_gnf BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`;

  // Dark graphite accent for admin space
  const adminAccent = '#1F2937';

  return (
    <div className="max-w-5xl mx-auto px-gutter-sm sm:px-gutter-md lg:px-gutter-lg py-gutter-md pb-32 space-y-gutter-md">
      {/* Admin Header with GHT Logo - Dark graphite confidential console */}
      <div className="p-gutter-md rounded-xl bg-[#1F2937] dark:bg-dark-surface border border-[#374151] dark:border-dark-outline shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-gutter-md">
        <div className="flex items-center gap-gutter-md min-w-0">
          <div className="w-12 h-12 rounded-md overflow-hidden bg-light-surface-container-low border border-[#374151] p-1 shrink-0 flex items-center justify-center">
            <img
              src="/assets/aistudio/B7697457-7CD5-4A3A-A3C7-3322C1459814_4b7ffeec.png"
              alt="Guinée Hub Technologie Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-gutter-sm">
              <h1 className="font-headline font-black text-title-md text-light-surface truncate">
                Soneya Admin Console
              </h1>
              <span className="text-label-sm font-bold px-gutter-sm py-0.5 rounded-full bg-[#374151] text-light-surface border border-[#4B5563] shrink-0 flex items-center gap-gutter-xs">
                <span className="material-symbols-outlined text-title-sm text-rose-400" aria-hidden="true">lock</span>
                CONFIDENTIEL · Interne
              </span>
            </div>
            <p className="text-body-sm text-gray-300 truncate">
              Supervision de la plateforme, validation KYC des motards & pilotage à Conakry
            </p>
          </div>
        </div>

        {pendingCouriersCount > 0 && (
          <div className="flex items-center gap-1.5 px-gutter-md py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-body-sm font-bold border border-amber-200 dark:border-amber-800 self-start sm:self-auto shrink-0">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span>{pendingCouriersCount} dossier(s) en attente</span>
          </div>
        )}
      </div>

      {/* Main Tabs */}
      <div className="flex overflow-x-auto no-scrollbar sm:grid sm:grid-cols-5 gap-gutter-xs bg-light-surface-container-low dark:bg-dark-surface p-gutter-xs rounded-xl border border-light-outline dark:border-dark-outline text-center text-body-sm">
        <button
          onClick={() => setActiveTab('livreurs')}
          className={`shrink-0 px-gutter-md sm:px-gutter-sm py-2.5 font-bold rounded-md transition relative cursor-pointer ${
            activeTab === 'livreurs'
              ? 'bg-[#1F2937] dark:bg-dark-surface-container-low text-light-surface dark:text-dark-on-surface shadow-xs'
              : 'text-light-on-surface-variant dark:text-dark-on-surface-variant hover:text-light-on-surface dark:hover:text-dark-on-surface'
          }`}
        >
          <span>Dossiers KYC</span>
          {pendingCouriersCount > 0 && (
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-light-surface font-black text-mono-sm">
              {pendingCouriersCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('pilote')}
          className={`shrink-0 px-gutter-md sm:px-gutter-sm py-2.5 font-bold rounded-md transition cursor-pointer ${
            activeTab === 'pilote'
              ? 'bg-[#1F2937] dark:bg-dark-surface-container-low text-light-surface dark:text-dark-on-surface shadow-xs'
              : 'text-light-on-surface-variant dark:text-dark-on-surface-variant hover:text-light-on-surface dark:hover:text-dark-on-surface'
          }`}
        >
          Indicateurs
        </button>

        <button
          onClick={() => setActiveTab('finances')}
          className={`shrink-0 px-gutter-md sm:px-gutter-sm py-2.5 font-bold rounded-md transition cursor-pointer ${
            activeTab === 'finances'
              ? 'bg-[#1F2937] dark:bg-dark-surface-container-low text-light-surface dark:text-dark-on-surface shadow-xs'
              : 'text-light-on-surface-variant dark:text-dark-on-surface-variant hover:text-light-on-surface dark:hover:text-dark-on-surface'
          }`}
        >
          Finances
        </button>

        <button
          onClick={() => setActiveTab('partenaires')}
          className={`shrink-0 px-gutter-md sm:px-gutter-sm py-2.5 font-bold rounded-md transition cursor-pointer ${
            activeTab === 'partenaires'
              ? 'bg-[#1F2937] dark:bg-dark-surface-container-low text-light-surface dark:text-dark-on-surface shadow-xs'
              : 'text-light-on-surface-variant dark:text-dark-on-surface-variant hover:text-light-on-surface dark:hover:text-dark-on-surface'
          }`}
        >
          Commerces ({partners.length})
        </button>

        <button
          onClick={() => setActiveTab('supabase')}
          className={`shrink-0 px-gutter-md sm:px-gutter-sm py-2.5 font-bold rounded-md transition cursor-pointer ${
            activeTab === 'supabase'
              ? 'bg-[#1F2937] dark:bg-dark-surface-container-low text-light-surface dark:text-dark-on-surface shadow-xs'
              : 'text-light-on-surface-variant dark:text-dark-on-surface-variant hover:text-light-on-surface dark:hover:text-dark-on-surface'
          }`}
        >
          Supabase SQL
        </button>
      </div>

      {/* TAB: DOSSIERS LIVREURS KYC (Exigences de vérification) */}
      {activeTab === 'livreurs' && (
        <div className="space-y-gutter-md">
          {/* Sub-Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-gutter-sm p-gutter-sm rounded-xl bg-light-surface-container-low dark:bg-dark-surface border border-light-outline dark:border-dark-outline shadow-xs">
            <div className="flex flex-wrap items-center gap-gutter-xs">
              <button
                onClick={() => setKycFilter('all')}
                className={`px-gutter-md py-2 rounded-md text-body-sm font-bold transition cursor-pointer ${
                  kycFilter === 'all'
                    ? 'bg-[#1F2937] dark:bg-dark-surface-container-low text-light-surface dark:text-dark-on-surface shadow-xs'
                    : 'text-light-on-surface-variant dark:text-dark-on-surface-variant hover:bg-light-surface-container dark:hover:bg-dark-surface-container-low'
                }`}
              >
                Tous ({courierApplications.length})
              </button>
              <button
                onClick={() => setKycFilter('pending_verification')}
                className={`px-gutter-md py-2 rounded-md text-body-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  kycFilter === 'pending_verification'
                    ? 'bg-[#1F2937] dark:bg-dark-surface-container-low text-light-surface dark:text-dark-on-surface shadow-xs'
                    : 'text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                }`}
              >
                <span className="material-symbols-outlined text-title-md" aria-hidden="true">schedule</span>
                <span>En attente ({pendingCouriersCount})</span>
              </button>
              <button
                onClick={() => setKycFilter('validated')}
                className={`px-gutter-md py-2 rounded-md text-body-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  kycFilter === 'validated'
                    ? 'bg-[#1F2937] dark:bg-dark-surface-container-low text-light-surface dark:text-dark-on-surface shadow-xs'
                    : 'text-light-primary dark:text-dark-primary hover:bg-light-primary-container dark:hover:bg-dark-surface-container-low'
                }`}
              >
                <span className="material-symbols-outlined text-title-md" aria-hidden="true">check</span>
                <span>Validés ({courierApplications.filter(a => a.status === 'validated').length})</span>
              </button>
              <button
                onClick={() => setKycFilter('rejected')}
                className={`px-gutter-md py-2 rounded-md text-body-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  kycFilter === 'rejected'
                    ? 'bg-[#1F2937] dark:bg-dark-surface-container-low text-light-surface dark:text-dark-on-surface shadow-xs'
                    : 'text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                }`}
              >
                <span>Refusés ({courierApplications.filter(a => a.status === 'rejected').length})</span>
              </button>
              <button
                onClick={() => setKycFilter('suspended')}
                className={`px-gutter-md py-2 rounded-md text-body-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  kycFilter === 'suspended'
                    ? 'bg-[#1F2937] dark:bg-dark-surface-container-low text-light-surface dark:text-dark-on-surface shadow-xs'
                    : 'text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                }`}
              >
                <span>Suspendus ({courierApplications.filter(a => a.status === 'suspended').length})</span>
              </button>
            </div>

            <div className="text-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant px-gutter-sm flex items-center gap-gutter-xs">
              <span className="material-symbols-outlined text-title-sm text-[#1F2937] dark:text-dark-on-surface" aria-hidden="true">lock</span>
              <span>Pièces stockées dans bucket privé chiffré</span>
            </div>
          </div>

          {/* Applications Cards */}
          <div className="space-y-gutter-md">
            {filteredApplications.map(app => {
              const isPending = app.status === 'pending_verification';
              const isValidated = app.status === 'validated';
              const isRejected = app.status === 'rejected';
              const isSuspended = app.status === 'suspended';

              return (
                <div
                  key={app.id}
                  className="p-gutter-md rounded-xl bg-light-surface-container-low dark:bg-dark-surface border border-light-outline dark:border-dark-outline shadow-xs space-y-gutter-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-gutter-md">
                    <div className="flex items-center gap-gutter-md min-w-0">
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-light-primary-container/60 dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline shrink-0">
                        <img
                          src={app.documents.selfiePhotoUrl}
                          alt={app.fullName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-gutter-sm">
                          <h3 className="font-headline font-extrabold text-body-md text-light-on-surface dark:text-dark-on-surface truncate">
                            {app.fullName}
                          </h3>
                          {isValidated && (
                            <span className="text-label-sm font-bold px-gutter-sm py-0.5 rounded-full bg-light-primary-container dark:bg-dark-surface-container-low text-light-primary dark:text-dark-primary border border-light-outline dark:border-dark-outline flex items-center gap-gutter-xs">
                              <span className="material-symbols-outlined text-title-sm" aria-hidden="true">check_circle</span>
                              <span>Validé</span>
                            </span>
                          )}
                          {isPending && (
                            <span className="text-label-sm font-bold px-gutter-sm py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-gutter-xs">
                              <span className="material-symbols-outlined text-title-sm text-amber-600" aria-hidden="true">schedule</span>
                              <span>En attente de validation</span>
                            </span>
                          )}
                          {isRejected && (
                            <span className="text-label-sm font-bold px-gutter-sm py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-gutter-xs">
                              <span className="material-symbols-outlined text-title-sm text-rose-600" aria-hidden="true">close</span>
                              <span>Refusé</span>
                            </span>
                          )}
                          {isSuspended && (
                            <span className="text-label-sm font-bold px-gutter-sm py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 flex items-center gap-gutter-xs">
                              <span className="material-symbols-outlined text-title-sm text-amber-700" aria-hidden="true">warning</span>
                              <span>Suspendu</span>
                            </span>
                          )}
                        </div>

                        <div className="text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant mt-0.5 flex flex-wrap items-center gap-gutter-sm">
                          <span>{app.phone}</span>
                          <span>·</span>
                          <span>{app.documents.vehicleBrandModel} (Plaque : <strong>{app.documents.plateNumber}</strong>)</span>
                          <span>·</span>
                          <span>{app.quartier}</span>
                        </div>
                      </div>
                    </div>

                    <div className="sm:text-right text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant shrink-0">
                      <div>Soumis le : {new Date(app.submittedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                      <div className="text-label-md font-medium text-light-on-surface dark:text-dark-on-surface">
                        {app.documents.momoProvider === 'orange_money' ? 'Orange Money' : 'MTN MoMo'} : {app.documents.momoNumber}
                      </div>
                    </div>
                  </div>

                  {isRejected && app.rejectionReason && (
                    <div className="p-gutter-md rounded-md bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-body-sm text-rose-900 dark:text-rose-200 space-y-0.5">
                      <strong className="block font-bold">Motif du refus notifié :</strong>
                      <p>{app.rejectionReason}</p>
                    </div>
                  )}

                  {isSuspended && app.suspensionReason && (
                    <div className="p-gutter-md rounded-md bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-body-sm text-amber-900 dark:text-amber-200 space-y-0.5">
                      <strong className="block font-bold">Motif de la suspension :</strong>
                      <p>{app.suspensionReason}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-gutter-sm pt-gutter-md border-t border-light-outline dark:border-dark-outline text-body-sm">
                    <button
                      onClick={() => {
                        setSelectedInspectionApp(app);
                        setInspectDocType('cni');
                      }}
                      className="px-gutter-md py-2 rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline hover:border-[#1F2937] dark:hover:border-dark-on-surface text-light-on-surface dark:text-dark-on-surface font-bold transition flex items-center gap-1.5 cursor-pointer min-h-[40px]"
                    >
                      <span className="material-symbols-outlined text-title-md text-[#1F2937] dark:text-dark-on-surface" aria-hidden="true">visibility</span>
                      <span>Examiner les 5 pièces & signature</span>
                    </button>

                    <div className="flex flex-wrap items-center gap-gutter-sm">
                      {isPending && (
                        <>
                          <button
                            onClick={() => validateCourierKyc(app.id)}
                            className="px-gutter-md py-2 rounded-md bg-[#1F2937] dark:bg-dark-surface-container-low hover:opacity-90 text-light-surface dark:text-dark-on-surface font-bold transition shadow-xs flex items-center gap-gutter-xs cursor-pointer min-h-[40px]"
                          >
                            <span className="material-symbols-outlined text-title-md" aria-hidden="true">check</span>
                            <span>Valider le dossier</span>
                          </button>
                          <button
                            onClick={() => {
                              setRejectionModalApp(app);
                              setRejectionReasonInput('Photo de carte grise ou certificat illisible.');
                            }}
                            className="px-gutter-md py-2 rounded-md bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 font-bold transition border border-rose-200 dark:border-rose-900/60 cursor-pointer min-h-[40px]"
                          >
                            Refuser avec motif
                          </button>
                        </>
                      )}

                      {isValidated && (
                        <button
                          onClick={() => {
                            setSuspensionModalApp(app);
                            setSuspensionReasonInput('Signalement client : non-port du casque de protection sur l\'Axe Fidel Castro.');
                          }}
                          className="px-gutter-md py-2 rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low hover:border-amber-500 text-amber-800 dark:text-amber-200 font-bold transition border border-amber-200 dark:border-amber-800 flex items-center gap-gutter-xs cursor-pointer min-h-[40px]"
                        >
                          <span className="material-symbols-outlined text-title-md" aria-hidden="true">warning</span>
                          <span>Suspendre le livreur</span>
                        </button>
                      )}

                      {(isRejected || isSuspended) && (
                        <button
                          onClick={() => reactivateCourier(app.id)}
                          className="px-gutter-md py-2 rounded-md bg-[#1F2937] dark:bg-dark-surface-container-low hover:opacity-90 text-light-surface dark:text-dark-on-surface font-bold transition shadow-xs flex items-center gap-gutter-xs cursor-pointer min-h-[40px]"
                        >
                          <span className="material-symbols-outlined text-title-md" aria-hidden="true">restart_alt</span>
                          <span>Réactiver / Valider le motard</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredApplications.length === 0 && (
              <div className="p-8 text-center bg-light-surface-container-low dark:bg-dark-surface rounded-xl border border-light-outline dark:border-dark-outline text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Aucun dossier livreur ne correspond à ce filtre.
              </div>
            )}
          </div>
        </div>
      )}

      {/* INSPECTION MODAL FOR ADMIN */}
      {selectedInspectionApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-gutter-sm sm:p-gutter-md backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl my-auto rounded-xl bg-light-surface-container-low dark:bg-dark-surface border border-light-outline dark:border-dark-outline shadow-2xl overflow-hidden flex flex-col max-h-[90dvh]">
            {/* Header */}
            <div className="px-gutter-md sm:px-gutter-lg py-gutter-md border-b border-light-outline dark:border-dark-outline flex items-center justify-between gap-gutter-md bg-light-surface-container-low dark:bg-dark-surface">
              <div className="flex items-center gap-gutter-md min-w-0">
                <div className="w-10 h-10 rounded-md bg-light-primary-container/70 dark:bg-dark-surface-container-low text-light-on-surface dark:text-dark-on-surface flex items-center justify-center border border-light-outline dark:border-dark-outline shrink-0">
                  <span className="material-symbols-outlined text-title-lg text-[#1F2937] dark:text-dark-on-surface" aria-hidden="true">shield</span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-headline font-extrabold text-body-md sm:text-title-md text-light-on-surface dark:text-dark-on-surface flex items-center gap-gutter-sm truncate">
                    <span className="truncate">Audit du dossier : {selectedInspectionApp.fullName}</span>
                  </h3>
                  <p className="text-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant truncate">
                    ID : RDR-224-{selectedInspectionApp.courierId} · {selectedInspectionApp.quartier}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedInspectionApp(null)}
                className="w-10 h-10 rounded-full bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline text-light-on-surface-variant dark:text-dark-on-surface-variant hover:bg-light-surface-container dark:hover:bg-dark-surface-container flex items-center justify-center transition shrink-0"
                aria-label="Fermer l'audit"
              >
                <span className="material-symbols-outlined text-title-md" aria-hidden="true">close</span>
              </button>
            </div>

            {/* Document Tabs */}
            <div className="flex overflow-x-auto no-scrollbar sm:grid sm:grid-cols-5 gap-gutter-xs p-gutter-sm bg-light-surface dark:bg-dark-surface border-b border-light-outline dark:border-dark-outline text-center text-body-sm shrink-0">
              <button
                onClick={() => setInspectDocType('cni')}
                className={`py-2 px-gutter-md sm:px-gutter-sm rounded-md font-bold transition whitespace-nowrap shrink-0 ${
                  inspectDocType === 'cni'
                    ? 'bg-[#1F2937] dark:bg-dark-surface-container-low text-light-surface dark:text-dark-on-surface shadow-xs'
                    : 'text-light-on-surface-variant dark:text-dark-on-surface-variant hover:text-light-on-surface dark:hover:text-dark-on-surface hover:bg-light-surface-container dark:hover:bg-dark-surface-container-low'
                }`}
              >
                CNI Biométrique
              </button>
              <button
                onClick={() => setInspectDocType('carte_grise')}
                className={`py-2 px-gutter-md sm:px-gutter-sm rounded-md font-bold transition whitespace-nowrap shrink-0 ${
                  inspectDocType === 'carte_grise'
                    ? 'bg-[#1F2937] dark:bg-dark-surface-container-low text-light-surface dark:text-dark-on-surface shadow-xs'
                    : 'text-light-on-surface-variant dark:text-dark-on-surface-variant hover:text-light-on-surface dark:hover:text-dark-on-surface hover:bg-light-surface-container dark:hover:bg-dark-surface-container-low'
                }`}
              >
                Carte Grise
              </button>
              <button
                onClick={() => setInspectDocType('certificat_residence')}
                className={`py-2 px-gutter-md sm:px-gutter-sm rounded-md font-bold transition whitespace-nowrap shrink-0 ${
                  inspectDocType === 'certificat_residence'
                    ? 'bg-[#1F2937] dark:bg-dark-surface-container-low text-light-surface dark:text-dark-on-surface shadow-xs'
                    : 'text-light-on-surface-variant dark:text-dark-on-surface-variant hover:text-light-on-surface dark:hover:text-dark-on-surface hover:bg-light-surface-container dark:hover:bg-dark-surface-container-low'
                }`}
              >
                Résidence Mairie
              </button>
              <button
                onClick={() => setInspectDocType('selfie')}
                className={`py-2 px-gutter-md sm:px-gutter-sm rounded-md font-bold transition whitespace-nowrap shrink-0 ${
                  inspectDocType === 'selfie'
                    ? 'bg-[#1F2937] dark:bg-dark-surface-container-low text-light-surface dark:text-dark-on-surface shadow-xs'
                    : 'text-light-on-surface-variant dark:text-dark-on-surface-variant hover:text-light-on-surface dark:hover:text-dark-on-surface hover:bg-light-surface-container dark:hover:bg-dark-surface-container-low'
                }`}
              >
                Selfie Guidé
              </button>
              <button
                onClick={() => setInspectDocType('charter')}
                className={`py-2 px-gutter-md sm:px-gutter-sm rounded-md font-bold transition whitespace-nowrap shrink-0 ${
                  inspectDocType === 'charter'
                    ? 'bg-[#1F2937] dark:bg-dark-surface-container-low text-light-surface dark:text-dark-on-surface shadow-xs'
                    : 'text-light-on-surface-variant dark:text-dark-on-surface-variant hover:text-light-on-surface dark:hover:text-dark-on-surface hover:bg-light-surface-container dark:hover:bg-dark-surface-container-low'
                }`}
              >
                Charte Signée
              </button>
            </div>

            {/* Document Viewer Body */}
            <div className="p-gutter-md sm:p-gutter-lg overflow-y-auto space-y-gutter-md flex-1 bg-light-surface-container-low dark:bg-dark-surface">
              <DocumentSpecimenViewer
                application={selectedInspectionApp}
                documentType={inspectDocType}
              />

              {/* Verified metadata strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter-sm text-body-sm">
                <div className="p-gutter-md rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline">
                  <span className="text-label-sm text-light-on-surface-variant dark:text-dark-on-surface-variant uppercase block">Opérateur MoMo</span>
                  <strong className="text-light-on-surface dark:text-dark-on-surface">
                    {selectedInspectionApp.documents.momoProvider === 'orange_money' ? 'Orange Money' : 'MTN MoMo'}
                  </strong>
                  <div className="font-mono text-light-on-surface-variant dark:text-dark-on-surface-variant text-label-md mt-0.5">
                    {selectedInspectionApp.documents.momoNumber}
                  </div>
                </div>

                <div className="p-gutter-md rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline">
                  <span className="text-label-sm text-light-on-surface-variant dark:text-dark-on-surface-variant uppercase block">Personne de Confiance</span>
                  <strong className="text-light-on-surface dark:text-dark-on-surface">
                    {selectedInspectionApp.documents.emergencyContact.fullName}
                  </strong>
                  <div className="text-light-on-surface-variant dark:text-dark-on-surface-variant text-label-md mt-0.5">
                    {selectedInspectionApp.documents.emergencyContact.relationship} · {selectedInspectionApp.documents.emergencyContact.phone}
                  </div>
                </div>

                <div className="p-gutter-md rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline">
                  <span className="text-label-sm text-light-on-surface-variant dark:text-dark-on-surface-variant uppercase block">Horodatage Charte</span>
                  <strong className="text-light-on-surface dark:text-dark-on-surface text-label-md">
                    7 Engagements Validés
                  </strong>
                  <div className="font-mono text-light-on-surface-variant dark:text-dark-on-surface-variant text-mono-sm mt-0.5 truncate">
                    {selectedInspectionApp.charter.signedAt}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Action buttons */}
            <div className="px-gutter-md sm:px-gutter-lg py-gutter-md border-t border-light-outline dark:border-dark-outline bg-light-surface-container-low dark:bg-dark-surface flex flex-wrap items-center justify-between gap-gutter-sm shrink-0">
              <span className="text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Statut actuel : <strong className="text-light-on-surface dark:text-dark-on-surface">{selectedInspectionApp.status.toUpperCase()}</strong>
              </span>

              <div className="flex flex-wrap items-center gap-gutter-sm">
                {selectedInspectionApp.status !== 'validated' && (
                  <button
                    onClick={() => {
                      validateCourierKyc(selectedInspectionApp.id);
                      setSelectedInspectionApp(null);
                    }}
                    className="px-gutter-md py-2.5 rounded-md bg-[#1F2937] dark:bg-dark-surface-container-low hover:opacity-90 text-light-surface dark:text-dark-on-surface text-body-sm font-bold transition shadow-xs flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-title-md" aria-hidden="true">check</span>
                    <span>Valider et Activer le Livreur</span>
                  </button>
                )}

                {selectedInspectionApp.status !== 'rejected' && (
                  <button
                    onClick={() => {
                      setRejectionModalApp(selectedInspectionApp);
                      setRejectionReasonInput('Photo de carte grise illisible ou certificat de résidence manquant.');
                    }}
                    className="px-gutter-md py-2.5 rounded-md bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-body-sm font-bold transition border border-rose-200 dark:border-rose-900/60"
                  >
                    Refuser avec motif
                  </button>
                )}

                {selectedInspectionApp.status === 'validated' && (
                  <button
                    onClick={() => {
                      setSuspensionModalApp(selectedInspectionApp);
                      setSuspensionReasonInput('Signalement client : non-respect des règles de circulation.');
                    }}
                    className="px-gutter-md py-2.5 rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low hover:bg-light-surface-container dark:hover:bg-dark-surface-container text-light-on-surface dark:text-dark-on-surface text-body-sm font-bold transition border border-light-outline dark:border-dark-outline"
                  >
                    Suspendre
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REJECTION MOTIF MODAL */}
      {rejectionModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-gutter-md animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-md max-h-[90dvh] overflow-y-auto rounded-xl bg-light-surface-container-low dark:bg-dark-surface p-gutter-lg space-y-gutter-md border border-light-outline dark:border-dark-outline shadow-2xl">
            <div className="flex items-center justify-between gap-gutter-sm">
              <h4 className="font-headline font-extrabold text-title-md text-rose-600 dark:text-rose-400 flex items-center gap-gutter-sm">
                <span className="material-symbols-outlined text-title-lg shrink-0" aria-hidden="true">error</span>
                <span>Refuser le dossier de {rejectionModalApp.fullName}</span>
              </h4>
              <button
                onClick={() => setRejectionModalApp(null)}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-light-surface-container dark:hover:bg-dark-surface-container-low transition shrink-0"
                aria-label="Fermer"
              >
                <span className="material-symbols-outlined text-title-md text-light-on-surface-variant" aria-hidden="true">close</span>
              </button>
            </div>

            <p className="text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
              Veuillez préciser le motif précis du refus. Le motard recevra cette explication sur son écran pour corriger son dossier.
            </p>

            <textarea
              rows={3}
              value={rejectionReasonInput}
              onChange={e => setRejectionReasonInput(e.target.value)}
              className="w-full p-gutter-md text-body-sm rounded-md border border-light-outline dark:border-dark-outline bg-light-surface-container-low dark:bg-dark-surface-container-low text-light-on-surface dark:text-dark-on-surface focus:outline-none focus:ring-2 focus:ring-[#1F2937]"
              placeholder="Saisissez la raison du rejet..."
            />

            <div className="flex items-center justify-end gap-gutter-sm pt-gutter-sm">
              <button
                type="button"
                onClick={() => setRejectionModalApp(null)}
                className="px-gutter-md py-2.5 rounded-md border border-light-outline dark:border-dark-outline text-body-sm font-semibold text-light-on-surface dark:text-dark-on-surface hover:bg-light-surface-container dark:hover:bg-dark-surface-container-low"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmRejection}
                className="px-gutter-md py-2.5 rounded-md bg-rose-600 hover:bg-rose-700 text-light-surface text-body-sm font-bold transition shadow-xs"
              >
                Confirmer le refus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUSPENSION MOTIF MODAL */}
      {suspensionModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-gutter-md animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-md max-h-[90dvh] overflow-y-auto rounded-xl bg-light-surface-container-low dark:bg-dark-surface p-gutter-lg space-y-gutter-md border border-light-outline dark:border-dark-outline shadow-2xl">
            <div className="flex items-center justify-between gap-gutter-sm">
              <h4 className="font-headline font-extrabold text-title-md text-light-on-surface dark:text-dark-on-surface flex items-center gap-gutter-sm">
                <span className="material-symbols-outlined text-title-lg text-amber-600 dark:text-amber-400 shrink-0" aria-hidden="true">warning</span>
                <span>Suspendre le compte de {suspensionModalApp.fullName}</span>
              </h4>
              <button
                onClick={() => setSuspensionModalApp(null)}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-light-surface-container dark:hover:bg-dark-surface-container-low transition shrink-0"
                aria-label="Fermer"
              >
                <span className="material-symbols-outlined text-title-md text-light-on-surface-variant" aria-hidden="true">close</span>
              </button>
            </div>

            <p className="text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
              Indiquez la raison de la suspension (manquement à la charte, réclamation client ou incident sur la route).
            </p>

            <textarea
              rows={3}
              value={suspensionReasonInput}
              onChange={e => setSuspensionReasonInput(e.target.value)}
              className="w-full p-gutter-md text-body-sm rounded-md border border-light-outline dark:border-dark-outline bg-light-surface-container-low dark:bg-dark-surface-container-low text-light-on-surface dark:text-dark-on-surface focus:outline-none focus:ring-2 focus:ring-[#1F2937]"
              placeholder="Raison de la suspension..."
            />

            <div className="flex items-center justify-end gap-gutter-sm pt-gutter-sm">
              <button
                type="button"
                onClick={() => setSuspensionModalApp(null)}
                className="px-gutter-md py-2.5 rounded-md border border-light-outline dark:border-dark-outline text-body-sm font-semibold text-light-on-surface dark:text-dark-on-surface hover:bg-light-surface-container dark:hover:bg-dark-surface-container-low"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmSuspension}
                className="px-gutter-md py-2.5 rounded-md bg-[#1F2937] hover:opacity-90 dark:bg-dark-primary dark:hover:opacity-90 text-light-surface dark:text-dark-surface text-body-sm font-bold transition shadow-xs"
              >
                Appliquer la suspension
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: PILOTE (INDICATEURS DE CONAKRY) */}
      {activeTab === 'pilote' && (
        <div className="space-y-gutter-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter-md">
            <div className="p-gutter-md rounded-xl bg-light-surface-container-low dark:bg-dark-surface border border-light-outline dark:border-dark-outline space-y-gutter-xs shadow-xs">
              <div className="text-label-md font-semibold text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Commandes livrées (Objectif: 200)
              </div>
              <div className="font-mono font-black text-headline-md text-light-on-surface dark:text-dark-on-surface">
                {totalDelivered}
              </div>
              <div className="text-label-sm text-light-primary dark:text-dark-primary font-bold flex items-center gap-gutter-xs">
                <span className="material-symbols-outlined text-title-sm text-light-primary dark:text-dark-primary" aria-hidden="true">check_circle</span>
                <span>Objectif pilote atteint (107%)</span>
              </div>
            </div>

            <div className="p-gutter-md rounded-xl bg-light-surface-container-low dark:bg-dark-surface border border-light-outline dark:border-dark-outline space-y-gutter-xs shadow-xs">
              <div className="text-label-md font-semibold text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Commerçants actifs (Objectif: 20)
              </div>
              <div className="font-mono font-black text-headline-md text-light-on-surface dark:text-dark-on-surface">
                {activePartnersCount} / {targetPartners}
              </div>
              <div className="text-label-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Kipé, Lambanyi, Kaloum, Dixinn
              </div>
            </div>

            <div className="p-gutter-md rounded-xl bg-light-surface-container-low dark:bg-dark-surface border border-light-outline dark:border-dark-outline space-y-gutter-xs shadow-xs">
              <div className="text-label-md font-semibold text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Livreurs validés Soneya
              </div>
              <div className="font-mono font-black text-headline-md text-light-on-surface dark:text-dark-on-surface">
                {activeCouriersCount} motards
              </div>
              <div className="text-label-sm text-light-primary dark:text-dark-primary font-bold">
                100% CNI & Carte grise vérifiées
              </div>
            </div>

            <div className="p-gutter-md rounded-xl bg-light-surface-container-low dark:bg-dark-surface border border-light-outline dark:border-dark-outline space-y-gutter-xs shadow-xs">
              <div className="text-label-md font-semibold text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Délai moyen livraison
              </div>
              <div className="font-mono font-black text-headline-md text-light-on-surface dark:text-dark-on-surface">
                {averageDeliveryMinutes} min
              </div>
              <div className="text-label-sm text-light-primary dark:text-dark-primary font-bold flex items-center gap-gutter-xs">
                <span className="material-symbols-outlined text-title-sm text-light-primary dark:text-dark-primary" aria-hidden="true">check_circle</span>
                <span>Moins de 40 min garanti</span>
              </div>
            </div>

            <div className="p-gutter-md rounded-xl bg-light-surface-container-low dark:bg-dark-surface border border-light-outline dark:border-dark-outline space-y-gutter-xs shadow-xs">
              <div className="text-label-md font-semibold text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Validation par code secret
              </div>
              <div className="font-mono font-black text-headline-md text-light-on-surface dark:text-dark-on-surface">
                {codeValidationRate}%
              </div>
              <div className="text-label-sm text-light-primary dark:text-dark-primary font-bold">
                Zéro litige de livraison
              </div>
            </div>

            <div className="p-gutter-md rounded-xl bg-light-surface-container-low dark:bg-dark-surface border border-light-outline dark:border-dark-outline space-y-gutter-xs shadow-xs">
              <div className="text-label-md font-semibold text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Satisfaction moyenne
              </div>
              <div className="font-mono font-black text-headline-md text-light-on-surface dark:text-dark-on-surface">
                {clientSatisfaction} / 5
              </div>
              <div className="text-label-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Sur 180 avis collectés
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FINANCES */}
      {activeTab === 'finances' && (
        <div className="space-y-gutter-md">
          {/* Economic Model Reference - Clean White Card with Subtle Border */}
          <div className="p-gutter-md sm:p-gutter-lg rounded-xl bg-light-surface-container-low dark:bg-dark-surface border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface space-y-gutter-md shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-gutter-sm">
              <span className="text-body-sm font-bold uppercase tracking-wider text-[#1F2937] dark:text-dark-on-surface">
                Modèle Économique & Répartition Conakry
              </span>
              <span className="text-label-sm font-semibold px-gutter-sm py-0.5 rounded-full bg-light-primary-container/70 dark:bg-dark-surface-container-low text-light-on-surface dark:text-dark-on-surface border border-light-outline dark:border-dark-outline">
                100% Mobile Money
              </span>
            </div>

            <div className="text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant space-y-gutter-sm leading-relaxed">
              <p>
                <strong>Exemple de référence :</strong> Panier de <strong>100 000 GNF</strong> dans un restaurant à <strong>3 km</strong> :
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-gutter-sm pt-gutter-sm text-center text-body-sm">
                <div className="p-2.5 rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline">
                  <div className="text-label-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">Client paie</div>
                  <div className="font-mono font-bold text-light-primary dark:text-dark-primary text-body-md">118 500 GNF</div>
                  <div className="text-mono-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">100k + 15.5k + 3k</div>
                </div>
                <div className="p-2.5 rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline">
                  <div className="text-label-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">Restaurant reçoit</div>
                  <div className="font-mono font-bold text-light-on-surface dark:text-dark-on-surface text-body-md">88 000 GNF</div>
                  <div className="text-mono-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">100k - 12% com.</div>
                </div>
                <div className="p-2.5 rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline">
                  <div className="text-label-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">Livreur reçoit</div>
                  <div className="font-mono font-bold text-light-on-surface dark:text-dark-on-surface text-body-md">12 400 GNF</div>
                  <div className="text-mono-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">80% de 15 500 GNF</div>
                </div>
                <div className="p-2.5 rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline">
                  <div className="text-label-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">Soneya encaisse</div>
                  <div className="font-mono font-bold text-light-primary dark:text-dark-primary text-body-md">18 100 GNF</div>
                  <div className="text-mono-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">3.1k + 12k + 3k</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-gutter-md sm:p-gutter-lg rounded-xl bg-light-surface-container-low dark:bg-dark-surface border border-light-outline dark:border-dark-outline space-y-gutter-md shadow-xs">
            <h3 className="font-headline font-black text-body-md text-light-on-surface dark:text-dark-on-surface">
              Répartition Financière Globale Soneya
            </h3>

            <div className="space-y-gutter-sm text-body-sm">
              <div className="flex justify-between gap-gutter-md py-1.5 border-b border-light-outline dark:border-dark-outline">
                <span className="text-light-on-surface-variant dark:text-dark-on-surface-variant">Volume d'affaires total (GMV)</span>
                <span className="font-mono font-bold text-light-on-surface dark:text-dark-on-surface shrink-0">{formatGnf(totalGmvGnf)}</span>
              </div>
              <div className="flex justify-between gap-gutter-md py-1.5 border-b border-light-outline dark:border-dark-outline">
                <span className="text-light-on-surface-variant dark:text-dark-on-surface-variant">Paiements reversés aux commerçants</span>
                <span className="font-mono font-semibold text-light-on-surface dark:text-dark-on-surface shrink-0">{formatGnf(totalPartnerPayoutGnf)}</span>
              </div>
              <div className="flex justify-between gap-gutter-md py-1.5 border-b border-light-outline dark:border-dark-outline">
                <span className="text-light-on-surface-variant dark:text-dark-on-surface-variant">Rémunération motards (80% livraison + pourboires)</span>
                <span className="font-mono font-semibold text-light-on-surface dark:text-dark-on-surface shrink-0">{formatGnf(totalCourierPayoutGnf)}</span>
              </div>
              <div className="flex justify-between gap-gutter-md py-1.5 border-b border-light-outline dark:border-dark-outline">
                <span className="text-light-on-surface-variant dark:text-dark-on-surface-variant">Frais réseau Mobile Money (2,75% Orange / MTN)</span>
                <span className="font-mono font-semibold text-rose-600 dark:text-rose-400 shrink-0">-{formatGnf(totalPaymentFeeGnf)}</span>
              </div>
              <div className="flex justify-between gap-gutter-md py-gutter-sm pt-gutter-md border-t-2 border-light-outline dark:border-dark-outline text-body-md">
                <span className="font-headline font-black text-light-on-surface dark:text-dark-on-surface">Marge nette encaissée par Soneya</span>
                <span className="font-mono font-black text-light-primary dark:text-dark-primary text-title-md shrink-0">
                  {formatGnf(totalSoneyaNetGnf)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COMMERCES PARTENAIRES */}
      {activeTab === 'partenaires' && (
        <div className="space-y-gutter-md">
          <div className="text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
            {partners.length} établissements actifs. Commission standard : 12% (restaurants), 10% (boutiques), 7% (courses/pharmacies). Offerte le 1er mois.
          </div>

          <div className="grid gap-gutter-sm">
            {partners.map(p => {
              const defaultComm = p.category === 'restaurants' ? 12 : p.category === 'shops' ? 10 : 7;
              return (
                <div
                  key={p.id}
                  className="p-gutter-md rounded-xl bg-light-surface-container-low dark:bg-dark-surface border border-light-outline dark:border-dark-outline flex flex-col sm:flex-row sm:items-center justify-between gap-gutter-md shadow-xs"
                >
                  <div className="flex items-center gap-gutter-md min-w-0">
                    <img src={p.logoImage} alt="" className="w-10 h-10 rounded-md object-cover shrink-0 border border-light-outline dark:border-dark-outline" />
                    <div className="min-w-0">
                      <div className="font-headline font-bold text-body-md text-light-on-surface dark:text-dark-on-surface truncate">
                        {p.name}
                      </div>
                      <div className="text-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
                        {p.quartierName} · {p.categoryLabel}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-gutter-sm shrink-0">
                    <button
                      onClick={() => togglePartnerCommissionExempt(p.id)}
                      className={`px-gutter-md py-2 rounded-md text-body-sm font-bold transition border ${
                        p.isFirstMonthExempt
                          ? 'bg-light-primary-container text-light-primary border-light-outline dark:bg-dark-surface-container-low dark:text-dark-primary dark:border-dark-outline'
                          : 'bg-light-surface-container-low dark:bg-dark-surface-container-low text-light-on-surface dark:text-dark-on-surface hover:bg-light-surface-container dark:hover:bg-dark-surface border-light-outline dark:border-dark-outline'
                      }`}
                      title="Activer/Désactiver premier mois offert"
                    >
                      {p.isFirstMonthExempt ? '1er mois : 0% com.' : `Com. : ${p.commissionRatePercent ?? defaultComm}%`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: ARCHITECTURE SUPABASE */}
      {activeTab === 'supabase' && (
        <div className="space-y-gutter-md">
          <div className="p-gutter-md sm:p-gutter-lg rounded-xl bg-light-surface-container-low dark:bg-dark-surface border border-light-outline dark:border-dark-outline space-y-gutter-md shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-gutter-sm">
              <div className="flex items-center gap-gutter-sm">
                <span className="material-symbols-outlined text-title-lg text-[#1F2937] dark:text-dark-on-surface shrink-0" aria-hidden="true">database</span>
                <h3 className="font-headline font-black text-body-md text-light-on-surface dark:text-dark-on-surface">
                  Structure Prête à Brancher sur Supabase & Mobile Money
                </h3>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(supabaseSqlSchema);
                  showToast('Schéma SQL Copié !', 'Le script de création des tables Supabase est prêt à exécuter dans le SQL Editor.', 'success');
                }}
                className="px-gutter-md py-2.5 rounded-md bg-[#1F2937] dark:bg-dark-surface-container-low hover:opacity-90 text-light-surface dark:text-dark-on-surface font-bold text-body-sm transition flex items-center gap-1.5 shadow-xs"
              >
                <span className="material-symbols-outlined text-title-md" aria-hidden="true">content_copy</span>
                <span>Copier le Schéma SQL</span>
              </button>
            </div>

            <p className="text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant leading-relaxed">
              Ce schéma relationnel PostgreSQL est configuré pour l'application Soneya avec sécurité RLS, persistance des comptes, géolocalisation et rapprochement des transactions Orange Money / MTN MoMo.
            </p>

            <pre className="p-gutter-md rounded-md bg-[#0F172A] text-emerald-400 text-mono-md font-mono overflow-x-auto max-h-72 border border-[#1E3B2D]">
              {supabaseSqlSchema}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
