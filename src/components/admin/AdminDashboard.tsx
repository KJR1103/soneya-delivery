import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatGnf, formatTime } from '../../utils/formatters';
import { CourierApplication, KycStatus } from '../../types';
import { DocumentSpecimenViewer } from '../courier/DocumentSpecimenViewer';
import {
  TrendingUp,
  Store,
  Bike,
  Package,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Database,
  Code2,
  DollarSign,
  Copy,
  ChevronRight,
  Sparkles,
  Award,
  Layers,
  Smartphone,
  Eye,
  X,
  Check,
  AlertTriangle,
  Lock,
  Clock,
  RotateCcw,
  FileText,
  UserCheck,
} from 'lucide-react';

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

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-5 lg:px-6 py-4 pb-32 space-y-4">
      {/* Admin Header with GHT Logo */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-[#D4E9DD] dark:border-[#1E3B2D] p-1 shrink-0 flex items-center justify-center">
            <img
              src="/assets/aistudio/B7697457-7CD5-4A3A-A3C7-3322C1459814_4b7ffeec.png"
              alt="Guinée Hub Technologie Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-heading font-black text-base text-[#0B2B1E] dark:text-white truncate">
                Soneya Admin Console
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50/70 dark:bg-[#10231B] text-[#0B7A4B] dark:text-[#FFB81F] border border-[#D4E9DD] dark:border-[#1E3B2D] shrink-0">
                Guinée Hub Technologie
              </span>
            </div>
            <p className="text-xs text-[#5C7A6E] dark:text-emerald-200/75 truncate">
              Supervision de la plateforme, validation KYC des motards & pilotage à Conakry
            </p>
          </div>
        </div>

        {pendingCouriersCount > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-xs font-bold border border-amber-200 dark:border-amber-800 self-start sm:self-auto shrink-0">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span>{pendingCouriersCount} dossier(s) en attente</span>
          </div>
        )}
      </div>

      {/* Main Tabs */}
      <div className="flex overflow-x-auto no-scrollbar sm:grid sm:grid-cols-5 gap-1.5 bg-white dark:bg-[#0C1913] p-1 rounded-2xl border border-[#E2ECE7] dark:border-[#1E3B2D] text-center text-xs">
        <button
          onClick={() => setActiveTab('livreurs')}
          className={`shrink-0 px-3 sm:px-2 py-2.5 font-bold rounded-xl transition relative cursor-pointer ${
            activeTab === 'livreurs'
              ? 'bg-[#0B7A4B] text-white shadow-xs'
              : 'text-[#2F4F42] dark:text-emerald-200 hover:text-[#0B2B1E] dark:hover:text-white'
          }`}
        >
          <span>Dossiers KYC</span>
          {pendingCouriersCount > 0 && (
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-white font-black text-[9px]">
              {pendingCouriersCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('pilote')}
          className={`shrink-0 px-3 sm:px-2 py-2.5 font-bold rounded-xl transition cursor-pointer ${
            activeTab === 'pilote'
              ? 'bg-[#0B7A4B] text-white shadow-xs'
              : 'text-[#2F4F42] dark:text-emerald-200 hover:text-[#0B2B1E] dark:hover:text-white'
          }`}
        >
          Indicateurs
        </button>

        <button
          onClick={() => setActiveTab('finances')}
          className={`shrink-0 px-3 sm:px-2 py-2.5 font-bold rounded-xl transition cursor-pointer ${
            activeTab === 'finances'
              ? 'bg-[#0B7A4B] text-white shadow-xs'
              : 'text-[#2F4F42] dark:text-emerald-200 hover:text-[#0B2B1E] dark:hover:text-white'
          }`}
        >
          Finances
        </button>

        <button
          onClick={() => setActiveTab('partenaires')}
          className={`shrink-0 px-3 sm:px-2 py-2.5 font-bold rounded-xl transition cursor-pointer ${
            activeTab === 'partenaires'
              ? 'bg-[#0B7A4B] text-white shadow-xs'
              : 'text-[#2F4F42] dark:text-emerald-200 hover:text-[#0B2B1E] dark:hover:text-white'
          }`}
        >
          Commerces ({partners.length})
        </button>

        <button
          onClick={() => setActiveTab('supabase')}
          className={`shrink-0 px-3 sm:px-2 py-2.5 font-bold rounded-xl transition cursor-pointer ${
            activeTab === 'supabase'
              ? 'bg-[#0B7A4B] text-white shadow-xs'
              : 'text-[#2F4F42] dark:text-emerald-200 hover:text-[#0B2B1E] dark:hover:text-white'
          }`}
        >
          Supabase SQL
        </button>
      </div>
      {/* TAB: DOSSIERS LIVREURS KYC (Exigences de vérification) */}
      {activeTab === 'livreurs' && (
        <div className="space-y-4">
          {/* Sub-Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] shadow-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setKycFilter('all')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  kycFilter === 'all'
                    ? 'bg-[#0B7A4B] text-white shadow-xs'
                    : 'text-[#2F4F42] dark:text-emerald-200 hover:bg-emerald-50/60 dark:hover:bg-[#10231B]'
                }`}
              >
                Tous ({courierApplications.length})
              </button>
              <button
                onClick={() => setKycFilter('pending_verification')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  kycFilter === 'pending_verification'
                    ? 'bg-[#0B7A4B] text-white shadow-xs'
                    : 'text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>En attente ({pendingCouriersCount})</span>
              </button>
              <button
                onClick={() => setKycFilter('validated')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  kycFilter === 'validated'
                    ? 'bg-[#0B7A4B] text-white shadow-xs'
                    : 'text-[#0B7A4B] dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-[#10231B]'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>Validés ({courierApplications.filter(a => a.status === 'validated').length})</span>
              </button>
              <button
                onClick={() => setKycFilter('rejected')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  kycFilter === 'rejected'
                    ? 'bg-[#0B7A4B] text-white shadow-xs'
                    : 'text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                }`}
              >
                <span>Refusés ({courierApplications.filter(a => a.status === 'rejected').length})</span>
              </button>
              <button
                onClick={() => setKycFilter('suspended')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  kycFilter === 'suspended'
                    ? 'bg-[#0B7A4B] text-white shadow-xs'
                    : 'text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                }`}
              >
                <span>Suspendus ({courierApplications.filter(a => a.status === 'suspended').length})</span>
              </button>
            </div>

            <div className="text-[11px] text-[#5C7A6E] dark:text-emerald-200/75 px-2 flex items-center gap-1">
              <Lock className="w-3 h-3 text-[#0B7A4B] dark:text-[#FFB81F]" />
              <span>Pièces stockées dans bucket privé chiffré</span>
            </div>
          </div>

          {/* Applications Cards */}
          <div className="space-y-3">
            {filteredApplications.map(app => {
              const isPending = app.status === 'pending_verification';
              const isValidated = app.status === 'validated';
              const isRejected = app.status === 'rejected';
              const isSuspended = app.status === 'suspended';

              return (
                <div
                  key={app.id}
                  className="p-4 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] shadow-xs space-y-3.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-emerald-50/60 dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] shrink-0">
                        <img
                          src={app.documents.selfiePhotoUrl}
                          alt={app.fullName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-heading font-extrabold text-sm text-[#0B2B1E] dark:text-white truncate">
                            {app.fullName}
                          </h3>
                          {isValidated && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#0B7A4B] dark:text-emerald-300 border border-[#D4E9DD] dark:border-emerald-800 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Validé</span>
                            </span>
                          )}
                          {isPending && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>En attente de validation</span>
                            </span>
                          )}
                          {isRejected && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-1">
                              <X className="w-3 h-3 text-rose-600" />
                              <span>Refusé</span>
                            </span>
                          )}
                          {isSuspended && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-amber-700" />
                              <span>Suspendu</span>
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-[#5C7A6E] dark:text-emerald-200/75 mt-0.5 flex flex-wrap items-center gap-2">
                          <span>{app.phone}</span>
                          <span>·</span>
                          <span>{app.documents.vehicleBrandModel} (Plaque : <strong>{app.documents.plateNumber}</strong>)</span>
                          <span>·</span>
                          <span>{app.quartier}</span>
                        </div>
                      </div>
                    </div>

                    <div className="sm:text-right text-xs text-[#5C7A6E] dark:text-emerald-200/75 shrink-0">
                      <div>Soumis le : {new Date(app.submittedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                      <div className="text-[11px] font-medium text-[#0B2B1E] dark:text-emerald-100">
                        {app.documents.momoProvider === 'orange_money' ? 'Orange Money' : 'MTN MoMo'} : {app.documents.momoNumber}
                      </div>
                    </div>
                  </div>

                  {isRejected && app.rejectionReason && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-900 dark:text-rose-200 space-y-0.5">
                      <strong className="block font-bold">Motif du refus notifié :</strong>
                      <p>{app.rejectionReason}</p>
                    </div>
                  )}

                  {isSuspended && app.suspensionReason && (
                    <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-0.5">
                      <strong className="block font-bold">Motif de la suspension :</strong>
                      <p>{app.suspensionReason}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#E2ECE7] dark:border-[#1E3B2D] text-xs">
                    <button
                      onClick={() => {
                        setSelectedInspectionApp(app);
                        setInspectDocType('cni');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] hover:border-[#0B7A4B] text-[#0B2B1E] dark:text-white font-bold transition flex items-center gap-1.5 cursor-pointer min-h-[40px]"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#0B7A4B] dark:text-[#FFB81F]" />
                      <span>Examiner les 5 pièces & signature</span>
                    </button>

                    <div className="flex flex-wrap items-center gap-2">
                      {isPending && (
                        <>
                          <button
                            onClick={() => validateCourierKyc(app.id)}
                            className="px-4 py-2 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white font-bold transition shadow-xs flex items-center gap-1 cursor-pointer min-h-[40px]"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Valider le dossier</span>
                          </button>
                          <button
                            onClick={() => {
                              setRejectionModalApp(app);
                              setRejectionReasonInput('Photo de carte grise ou certificat illisible.');
                            }}
                            className="px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 font-bold transition border border-rose-200 dark:border-rose-900/60 cursor-pointer min-h-[40px]"
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
                          className="px-3 py-2 rounded-xl bg-white dark:bg-[#10231B] hover:border-amber-500 text-amber-800 dark:text-amber-200 font-bold transition border border-amber-200 dark:border-amber-800 flex items-center gap-1 cursor-pointer min-h-[40px]"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Suspendre le livreur</span>
                        </button>
                      )}

                      {(isRejected || isSuspended) && (
                        <button
                          onClick={() => reactivateCourier(app.id)}
                          className="px-4 py-2 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white font-bold transition shadow-xs flex items-center gap-1 cursor-pointer min-h-[40px]"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Réactiver / Valider le motard</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredApplications.length === 0 && (
              <div className="p-8 text-center bg-white dark:bg-[#0C1913] rounded-2xl border border-[#E2ECE7] dark:border-[#1E3B2D] text-xs text-[#5C7A6E] dark:text-emerald-200/70">
                Aucun dossier livreur ne correspond à ce filtre.
              </div>
            )}
          </div>
        </div>
      )}

      {/* INSPECTION MODAL FOR ADMIN */}
      {selectedInspectionApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-4 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl my-auto rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] shadow-2xl overflow-hidden flex flex-col max-h-[90dvh]">
            {/* Header */}
            <div className="px-4 sm:px-5 py-4 border-b border-[#E2ECE7] dark:border-[#1E3B2D] flex items-center justify-between gap-3 bg-white dark:bg-[#0C1913]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-50/70 dark:bg-[#10231B] text-[#0B2B1E] dark:text-emerald-100 flex items-center justify-center border border-[#D4E9DD] dark:border-[#1E3B2D] shrink-0">
                  <ShieldCheck className="w-5 h-5 text-[#0B7A4B] dark:text-emerald-300" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-heading font-extrabold text-sm sm:text-base text-[#0B2B1E] dark:text-white flex items-center gap-2 truncate">
                    <span className="truncate">Audit du dossier : {selectedInspectionApp.fullName}</span>
                  </h3>
                  <p className="text-[11px] text-[#5C7A6E] dark:text-emerald-300/70 truncate">
                    ID : RDR-224-{selectedInspectionApp.courierId} · {selectedInspectionApp.quartier}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedInspectionApp(null)}
                className="w-10 h-10 rounded-full bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] text-[#2F4F42] dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-[#163126] flex items-center justify-center transition shrink-0"
                aria-label="Fermer l'audit"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Document Tabs */}
            <div className="flex overflow-x-auto no-scrollbar sm:grid sm:grid-cols-5 gap-1.5 p-2 bg-white dark:bg-[#08120D] border-b border-[#E2ECE7] dark:border-[#1E3B2D] text-center text-xs shrink-0">
              <button
                onClick={() => setInspectDocType('cni')}
                className={`py-2 px-3 sm:px-2 rounded-xl font-bold transition whitespace-nowrap shrink-0 ${
                  inspectDocType === 'cni'
                    ? 'bg-[#0B7A4B] text-white shadow-xs'
                    : 'text-[#2F4F42] dark:text-emerald-200/75 hover:text-[#0B2B1E] dark:hover:text-white hover:bg-emerald-50/60 dark:hover:bg-[#10231B]'
                }`}
              >
                CNI Biométrique
              </button>
              <button
                onClick={() => setInspectDocType('carte_grise')}
                className={`py-2 px-3 sm:px-2 rounded-xl font-bold transition whitespace-nowrap shrink-0 ${
                  inspectDocType === 'carte_grise'
                    ? 'bg-[#0B7A4B] text-white shadow-xs'
                    : 'text-[#2F4F42] dark:text-emerald-200/75 hover:text-[#0B2B1E] dark:hover:text-white hover:bg-emerald-50/60 dark:hover:bg-[#10231B]'
                }`}
              >
                Carte Grise
              </button>
              <button
                onClick={() => setInspectDocType('certificat_residence')}
                className={`py-2 px-3 sm:px-2 rounded-xl font-bold transition whitespace-nowrap shrink-0 ${
                  inspectDocType === 'certificat_residence'
                    ? 'bg-[#0B7A4B] text-white shadow-xs'
                    : 'text-[#2F4F42] dark:text-emerald-200/75 hover:text-[#0B2B1E] dark:hover:text-white hover:bg-emerald-50/60 dark:hover:bg-[#10231B]'
                }`}
              >
                Résidence Mairie
              </button>
              <button
                onClick={() => setInspectDocType('selfie')}
                className={`py-2 px-3 sm:px-2 rounded-xl font-bold transition whitespace-nowrap shrink-0 ${
                  inspectDocType === 'selfie'
                    ? 'bg-[#0B7A4B] text-white shadow-xs'
                    : 'text-[#2F4F42] dark:text-emerald-200/75 hover:text-[#0B2B1E] dark:hover:text-white hover:bg-emerald-50/60 dark:hover:bg-[#10231B]'
                }`}
              >
                Selfie Guidé
              </button>
              <button
                onClick={() => setInspectDocType('charter')}
                className={`py-2 px-3 sm:px-2 rounded-xl font-bold transition whitespace-nowrap shrink-0 ${
                  inspectDocType === 'charter'
                    ? 'bg-[#0B7A4B] text-white shadow-xs'
                    : 'text-[#2F4F42] dark:text-emerald-200/75 hover:text-[#0B2B1E] dark:hover:text-white hover:bg-emerald-50/60 dark:hover:bg-[#10231B]'
                }`}
              >
                Charte Signée
              </button>
            </div>

            {/* Document Viewer Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 bg-white dark:bg-[#0C1913]">
              <DocumentSpecimenViewer
                application={selectedInspectionApp}
                documentType={inspectDocType}
              />

              {/* Verified metadata strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-white dark:bg-[#10231B] border border-[#E2ECE7] dark:border-[#1E3B2D]">
                  <span className="text-[10px] text-[#5C7A6E] dark:text-emerald-300/70 uppercase block">Opérateur MoMo</span>
                  <strong className="text-[#0B2B1E] dark:text-white">
                    {selectedInspectionApp.documents.momoProvider === 'orange_money' ? 'Orange Money' : 'MTN MoMo'}
                  </strong>
                  <div className="font-mono text-[#2F4F42] dark:text-emerald-200/80 text-[11px] mt-0.5">
                    {selectedInspectionApp.documents.momoNumber}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-[#10231B] border border-[#E2ECE7] dark:border-[#1E3B2D]">
                  <span className="text-[10px] text-[#5C7A6E] dark:text-emerald-300/70 uppercase block">Personne de Confiance</span>
                  <strong className="text-[#0B2B1E] dark:text-white">
                    {selectedInspectionApp.documents.emergencyContact.fullName}
                  </strong>
                  <div className="text-[#5C7A6E] dark:text-emerald-300/70 text-[11px] mt-0.5">
                    {selectedInspectionApp.documents.emergencyContact.relationship} · {selectedInspectionApp.documents.emergencyContact.phone}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-[#10231B] border border-[#E2ECE7] dark:border-[#1E3B2D]">
                  <span className="text-[10px] text-[#5C7A6E] dark:text-emerald-300/70 uppercase block">Horodatage Charte</span>
                  <strong className="text-[#0B2B1E] dark:text-white text-[11px]">
                    7 Engagements Validés
                  </strong>
                  <div className="font-mono text-[#5C7A6E] dark:text-emerald-300/70 text-[10px] mt-0.5 truncate">
                    {selectedInspectionApp.charter.signedAt}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Action buttons */}
            <div className="px-4 sm:px-5 py-3.5 border-t border-[#E2ECE7] dark:border-[#1E3B2D] bg-white dark:bg-[#0C1913] flex flex-wrap items-center justify-between gap-2.5 shrink-0">
              <span className="text-xs text-[#5C7A6E] dark:text-emerald-300/70">
                Statut actuel : <strong className="text-[#0B2B1E] dark:text-white">{selectedInspectionApp.status.toUpperCase()}</strong>
              </span>

              <div className="flex flex-wrap items-center gap-2">
                {selectedInspectionApp.status !== 'validated' && (
                  <button
                    onClick={() => {
                      validateCourierKyc(selectedInspectionApp.id);
                      setSelectedInspectionApp(null);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Valider et Activer le Livreur</span>
                  </button>
                )}

                {selectedInspectionApp.status !== 'rejected' && (
                  <button
                    onClick={() => {
                      setRejectionModalApp(selectedInspectionApp);
                      setRejectionReasonInput('Photo de carte grise illisible ou certificat de résidence manquant.');
                    }}
                    className="px-3.5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-bold transition border border-rose-200 dark:border-rose-900/60"
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
                    className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#10231B] hover:bg-emerald-50 dark:hover:bg-[#163126] text-[#0B2B1E] dark:text-emerald-100 text-xs font-bold transition border border-[#D4E9DD] dark:border-[#1E3B2D]"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-md max-h-[90dvh] overflow-y-auto rounded-2xl bg-white dark:bg-[#0C1913] p-5 space-y-4 border border-[#E2ECE7] dark:border-[#1E3B2D] shadow-2xl">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-heading font-extrabold text-base text-rose-600 dark:text-rose-400 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>Refuser le dossier de {rejectionModalApp.fullName}</span>
              </h4>
              <button
                onClick={() => setRejectionModalApp(null)}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-emerald-50 dark:hover:bg-[#10231B] transition shrink-0"
                aria-label="Fermer"
              >
                <X className="w-4 h-4 text-[#5C7A6E]" />
              </button>
            </div>

            <p className="text-xs text-[#2F4F42] dark:text-emerald-200/80">
              Veuillez préciser le motif précis du refus. Le motard recevra cette explication sur son écran pour corriger son dossier.
            </p>

            <textarea
              rows={3}
              value={rejectionReasonInput}
              onChange={e => setRejectionReasonInput(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-[#D4E9DD] dark:border-[#1E3B2D] bg-white dark:bg-[#08120D] text-[#0B2B1E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0B7A4B]"
              placeholder="Saisissez la raison du rejet..."
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectionModalApp(null)}
                className="px-4 py-2.5 rounded-xl border border-[#D4E9DD] dark:border-[#1E3B2D] text-xs font-semibold text-[#0B2B1E] dark:text-emerald-100 hover:bg-emerald-50/60 dark:hover:bg-[#10231B]"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmRejection}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-xs"
              >
                Confirmer le refus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUSPENSION MOTIF MODAL */}
      {suspensionModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-md max-h-[90dvh] overflow-y-auto rounded-2xl bg-white dark:bg-[#0C1913] p-5 space-y-4 border border-[#E2ECE7] dark:border-[#1E3B2D] shadow-2xl">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-heading font-extrabold text-base text-[#0B2B1E] dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Suspendre le compte de {suspensionModalApp.fullName}</span>
              </h4>
              <button
                onClick={() => setSuspensionModalApp(null)}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-emerald-50 dark:hover:bg-[#10231B] transition shrink-0"
                aria-label="Fermer"
              >
                <X className="w-4 h-4 text-[#5C7A6E]" />
              </button>
            </div>

            <p className="text-xs text-[#2F4F42] dark:text-emerald-200/80">
              Indiquez la raison de la suspension (manquement à la charte, réclamation client ou incident sur la route).
            </p>

            <textarea
              rows={3}
              value={suspensionReasonInput}
              onChange={e => setSuspensionReasonInput(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-[#D4E9DD] dark:border-[#1E3B2D] bg-white dark:bg-[#08120D] text-[#0B2B1E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0B7A4B]"
              placeholder="Raison de la suspension..."
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSuspensionModalApp(null)}
                className="px-4 py-2.5 rounded-xl border border-[#D4E9DD] dark:border-[#1E3B2D] text-xs font-semibold text-[#0B2B1E] dark:text-emerald-100 hover:bg-emerald-50/60 dark:hover:bg-[#10231B]"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmSuspension}
                className="px-4 py-2.5 rounded-xl bg-[#0B2B1E] hover:bg-[#081C13] dark:bg-[#0B7A4B] dark:hover:bg-[#08613B] text-white text-xs font-bold transition shadow-xs"
              >
                Appliquer la suspension
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: PILOTE (INDICATEURS DE CONAKRY) */}
      {activeTab === 'pilote' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] space-y-1 shadow-xs">
              <div className="text-[11px] font-semibold text-[#5C7A6E] dark:text-emerald-300/70">
                Commandes livrées (Objectif: 200)
              </div>
              <div className="font-heading font-black text-2xl text-[#0B2B1E] dark:text-white">
                {totalDelivered}
              </div>
              <div className="text-[10px] text-[#0B7A4B] dark:text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#0B7A4B] dark:text-emerald-400" />
                <span>Objectif pilote atteint (107%)</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] space-y-1 shadow-xs">
              <div className="text-[11px] font-semibold text-[#5C7A6E] dark:text-emerald-300/70">
                Commerçants actifs (Objectif: 20)
              </div>
              <div className="font-heading font-black text-2xl text-[#0B2B1E] dark:text-white">
                {activePartnersCount} / {targetPartners}
              </div>
              <div className="text-[10px] text-[#5C7A6E] dark:text-emerald-300/70">
                Kipé, Lambanyi, Kaloum, Dixinn
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] space-y-1 shadow-xs">
              <div className="text-[11px] font-semibold text-[#5C7A6E] dark:text-emerald-300/70">
                Livreurs validés Soneya
              </div>
              <div className="font-heading font-black text-2xl text-[#0B2B1E] dark:text-white">
                {activeCouriersCount} motards
              </div>
              <div className="text-[10px] text-[#0B7A4B] dark:text-emerald-400 font-bold">
                100% CNI & Carte grise vérifiées
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] space-y-1 shadow-xs">
              <div className="text-[11px] font-semibold text-[#5C7A6E] dark:text-emerald-300/70">
                Délai moyen livraison
              </div>
              <div className="font-heading font-black text-2xl text-[#0B2B1E] dark:text-white">
                {averageDeliveryMinutes} min
              </div>
              <div className="text-[10px] text-[#0B7A4B] dark:text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#0B7A4B] dark:text-emerald-400" />
                <span>Moins de 40 min garanti</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] space-y-1 shadow-xs">
              <div className="text-[11px] font-semibold text-[#5C7A6E] dark:text-emerald-300/70">
                Validation par code secret
              </div>
              <div className="font-heading font-black text-2xl text-[#0B2B1E] dark:text-white">
                {codeValidationRate}%
              </div>
              <div className="text-[10px] text-[#0B7A4B] dark:text-emerald-400 font-bold">
                Zéro litige de livraison
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] space-y-1 shadow-xs">
              <div className="text-[11px] font-semibold text-[#5C7A6E] dark:text-emerald-300/70">
                Satisfaction moyenne
              </div>
              <div className="font-heading font-black text-2xl text-[#0B2B1E] dark:text-white">
                {clientSatisfaction} / 5
              </div>
              <div className="text-[10px] text-[#5C7A6E] dark:text-emerald-300/70">
                Sur 180 avis collectés
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FINANCES */}
      {activeTab === 'finances' && (
        <div className="space-y-4">
          {/* Economic Model Reference - Clean White Card with Subtle Border */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] text-[#0B2B1E] dark:text-white space-y-3 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0B7A4B] dark:text-emerald-300">
                Modèle Économique & Répartition Conakry
              </span>
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50/70 dark:bg-[#10231B] text-[#0B2B1E] dark:text-emerald-100 border border-[#D4E9DD] dark:border-[#1E3B2D]">
                100% Mobile Money
              </span>
            </div>

            <div className="text-xs text-[#2F4F42] dark:text-emerald-200/80 space-y-1.5 leading-relaxed">
              <p>
                <strong>Exemple de référence :</strong> Panier de <strong>100 000 GNF</strong> dans un restaurant à <strong>3 km</strong> :
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-white dark:bg-[#10231B] border border-[#E2ECE7] dark:border-[#1E3B2D]">
                  <div className="text-[10px] text-[#5C7A6E] dark:text-emerald-300/70">Client paie</div>
                  <div className="font-bold text-[#0B7A4B] dark:text-emerald-300 text-sm">118 500 GNF</div>
                  <div className="text-[9px] text-[#5C7A6E] dark:text-emerald-300/70">100k + 15.5k + 3k</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-[#10231B] border border-[#E2ECE7] dark:border-[#1E3B2D]">
                  <div className="text-[10px] text-[#5C7A6E] dark:text-emerald-300/70">Restaurant reçoit</div>
                  <div className="font-bold text-[#0B2B1E] dark:text-white text-sm">88 000 GNF</div>
                  <div className="text-[9px] text-[#5C7A6E] dark:text-emerald-300/70">100k - 12% com.</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-[#10231B] border border-[#E2ECE7] dark:border-[#1E3B2D]">
                  <div className="text-[10px] text-[#5C7A6E] dark:text-emerald-300/70">Livreur reçoit</div>
                  <div className="font-bold text-[#0B2B1E] dark:text-white text-sm">12 400 GNF</div>
                  <div className="text-[9px] text-[#5C7A6E] dark:text-emerald-300/70">80% de 15 500 GNF</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-[#10231B] border border-[#E2ECE7] dark:border-[#1E3B2D]">
                  <div className="text-[10px] text-[#5C7A6E] dark:text-emerald-300/70">Soneya encaisse</div>
                  <div className="font-bold text-[#0B7A4B] dark:text-emerald-300 text-sm">18 100 GNF</div>
                  <div className="text-[9px] text-[#5C7A6E] dark:text-emerald-300/70">3.1k + 12k + 3k</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] space-y-3.5 shadow-xs">
            <h3 className="font-heading font-black text-sm text-[#0B2B1E] dark:text-white">
              Répartition Financière Globale Soneya
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between gap-3 py-1.5 border-b border-[#E2ECE7] dark:border-[#1E3B2D]">
                <span className="text-[#2F4F42] dark:text-emerald-200/80">Volume d'affaires total (GMV)</span>
                <span className="font-bold text-[#0B2B1E] dark:text-white shrink-0">{formatGnf(totalGmvGnf)}</span>
              </div>
              <div className="flex justify-between gap-3 py-1.5 border-b border-[#E2ECE7] dark:border-[#1E3B2D]">
                <span className="text-[#2F4F42] dark:text-emerald-200/80">Paiements reversés aux commerçants</span>
                <span className="font-semibold text-[#0B2B1E] dark:text-emerald-100 shrink-0">{formatGnf(totalPartnerPayoutGnf)}</span>
              </div>
              <div className="flex justify-between gap-3 py-1.5 border-b border-[#E2ECE7] dark:border-[#1E3B2D]">
                <span className="text-[#2F4F42] dark:text-emerald-200/80">Rémunération motards (80% livraison + pourboires)</span>
                <span className="font-semibold text-[#0B2B1E] dark:text-emerald-100 shrink-0">{formatGnf(totalCourierPayoutGnf)}</span>
              </div>
              <div className="flex justify-between gap-3 py-1.5 border-b border-[#E2ECE7] dark:border-[#1E3B2D]">
                <span className="text-[#2F4F42] dark:text-emerald-200/80">Frais réseau Mobile Money (2,75% Orange / MTN)</span>
                <span className="font-semibold text-rose-600 dark:text-rose-400 shrink-0">-{formatGnf(totalPaymentFeeGnf)}</span>
              </div>
              <div className="flex justify-between gap-3 py-2 pt-3 border-t border-[#E2ECE7] dark:border-[#1E3B2D] text-sm">
                <span className="font-heading font-black text-[#0B2B1E] dark:text-white">Marge nette encaissée par Soneya</span>
                <span className="font-heading font-black text-[#0B7A4B] dark:text-emerald-300 text-base shrink-0">
                  {formatGnf(totalSoneyaNetGnf)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COMMERCES PARTENAIRES */}
      {activeTab === 'partenaires' && (
        <div className="space-y-3">
          <div className="text-xs text-[#5C7A6E] dark:text-emerald-300/70">
            {partners.length} établissements actifs. Commission standard : 12% (restaurants), 10% (boutiques), 7% (courses/pharmacies). Offerte le 1er mois.
          </div>

          <div className="grid gap-2.5">
            {partners.map(p => {
              const defaultComm = p.category === 'restaurants' ? 12 : p.category === 'shops' ? 10 : 7;
              return (
                <div
                  key={p.id}
                  className="p-3.5 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={p.logoImage} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0 border border-[#E2ECE7] dark:border-[#1E3B2D]" />
                    <div className="min-w-0">
                      <div className="font-heading font-bold text-sm text-[#0B2B1E] dark:text-white truncate">
                        {p.name}
                      </div>
                      <div className="text-[11px] text-[#5C7A6E] dark:text-emerald-300/70">
                        {p.quartierName} · {p.categoryLabel}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => togglePartnerCommissionExempt(p.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition border ${
                        p.isFirstMonthExempt
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                          : 'bg-white dark:bg-[#10231B] text-[#0B2B1E] dark:text-emerald-100 hover:bg-emerald-50/60 dark:hover:bg-[#163126] border-[#D4E9DD] dark:border-[#1E3B2D]'
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
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] space-y-3 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-[#0B7A4B] dark:text-emerald-300 shrink-0" />
                <h3 className="font-heading font-black text-sm text-[#0B2B1E] dark:text-white">
                  Structure Prête à Brancher sur Supabase & Mobile Money
                </h3>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(supabaseSqlSchema);
                  showToast('Schéma SQL Copié !', 'Le script de création des tables Supabase est prêt à exécuter dans le SQL Editor.', 'success');
                }}
                className="px-3.5 py-2.5 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copier le Schéma SQL</span>
              </button>
            </div>

            <p className="text-xs text-[#2F4F42] dark:text-emerald-200/80 leading-relaxed">
              Ce schéma relationnel PostgreSQL est configuré pour l'application Soneya avec sécurité RLS, persistance des comptes, géolocalisation et rapprochement des transactions Orange Money / MTN MoMo.
            </p>

            <pre className="p-4 rounded-xl bg-[#08120D] text-emerald-400 text-xs font-mono overflow-x-auto max-h-72 border border-[#1E3B2D]">
              {supabaseSqlSchema}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
