import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShoppingBag,
  Store,
  Bike,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Smartphone,
  MapPin,
  Lock,
  Compass,
} from 'lucide-react';

export const LandingPortal: React.FC = () => {
  const {
    setSpace,
    setShowLandingPortal,
    setIsAuthModalOpen,
    login,
  } = useApp();

  const handleEnterSpace = (targetSpace: 'client' | 'partner' | 'courier' | 'admin') => {
    setShowLandingPortal(false);
    setSpace(targetSpace);
  };

  const handleQuickDemoLogin = (role: 'client' | 'partner' | 'courier' | 'admin') => {
    if (role === 'client') {
      login('622 78 90 12', 'Amadou Diallo', 'client');
    } else if (role === 'partner') {
      login('620 10 20 30', 'Chez Fanta (Commerçant)', 'partner', 'chez-fanta');
    } else if (role === 'courier') {
      login('622 45 89 12', 'Mamadou Sow (Motard)', 'courier', undefined, 'c-1');
    } else if (role === 'admin') {
      login('622 00 00 00', 'René Kaba Tolno (GHT Fondateur)', 'admin');
    }
    setShowLandingPortal(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#08120D] text-[#0B2B1E] dark:text-emerald-50 flex flex-col font-sans transition-colors overflow-x-hidden">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-white dark:bg-[#0C1913] border-b border-[#E2ECE7] dark:border-[#1E3B2D] px-3 sm:px-4 py-3 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <img
              src="/assets/aistudio/B7697457-7CD5-4A3A-A3C7-3322C1459814_4b7ffeec.png"
              alt="Guinée Hub Technologie Logo"
              className="w-10 h-10 sm:w-11 sm:h-11 object-contain rounded-xl bg-white border border-[#D4E9DD] dark:border-[#1E3B2D] p-1 shadow-xs shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-base sm:text-lg tracking-tight text-[#0B2B1E] dark:text-white truncate">
                  Soneya Delivery
                </span>
                <span className="hidden xs:inline-block text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50/70 dark:bg-[#10231B] text-[#0B7A4B] dark:text-[#FFB81F] border border-[#D4E9DD] dark:border-[#1E3B2D] shrink-0">
                  Guinée Hub Tech
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#5C7A6E] dark:text-emerald-200/75 -mt-0.5 truncate">
                Conakry commande · Soneya livre
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleEnterSpace('client')}
              className="px-3 sm:px-4 py-2 rounded-xl bg-white dark:bg-[#10231B] text-[#0B2B1E] dark:text-emerald-100 hover:border-[#0B7A4B] text-xs font-semibold transition border border-[#D4E9DD] dark:border-[#1E3B2D] flex items-center gap-1.5 cursor-pointer min-h-[40px]"
            >
              <Compass className="w-3.5 h-3.5 text-[#0B7A4B] dark:text-[#FFB81F]" />
              <span className="hidden sm:inline">Catalogue Commerces</span>
              <span className="sm:hidden">Catalogue</span>
            </button>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white text-xs font-semibold shadow-xs transition cursor-pointer min-h-[40px]"
            >
              Se Connecter
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-12 sm:pt-14 sm:pb-16 px-4 bg-white dark:bg-[#08120D]">
        <div className="relative max-w-4xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#0C1913] border border-[#D4E9DD] dark:border-[#1E3B2D] text-[#0B2B1E] dark:text-emerald-100 text-xs font-semibold shadow-xs">
            <ShieldCheck className="w-4 h-4 text-[#0B7A4B] dark:text-[#FFB81F]" />
            <span>Plateforme Intégrée de Commande & Livraison à Conakry</span>
          </div>

          <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#0B2B1E] dark:text-white tracking-tight leading-tight">
            Une Seule Application.
            <br />
            <span className="text-[#0B7A4B] dark:text-[#FFB81F]">
              Quatre Espaces Dédiés & Cloisonnés.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#2F4F42] dark:text-emerald-100/80 leading-relaxed">
            Chaque acteur dispose d'un espace 100% sécurisé et adapté à sa fonction : les clients commandent en direct, les commerçants pilotent leurs vitrines, les livreurs certifiés reçoivent 80% des gains par Mobile Money, et la direction supervise l'ensemble.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => handleEnterSpace('client')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white font-heading font-bold text-sm shadow-sm transition flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Accéder à l'Espace Client</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white dark:bg-[#0C1913] border border-[#D4E9DD] dark:border-[#1E3B2D] text-[#0B2B1E] dark:text-white font-heading font-semibold text-sm hover:border-[#0B7A4B] transition cursor-pointer min-h-[48px]"
            >
              Connexion & Création de Compte
            </button>
          </div>
        </div>
      </section>

      {/* 4 Dedicated Spaces Grid */}
      <section className="max-w-5xl mx-auto px-4 pb-16 space-y-6 w-full">
        <div className="text-center space-y-1">
          <h2 className="font-heading font-black text-2xl text-[#0B2B1E] dark:text-white">
            Choisissez Votre Espace de Travail
          </h2>
          <p className="text-xs text-[#5C7A6E] dark:text-emerald-200/75">
            Chaque profil utilisateur est isolé : le client ne voit que son compte, le commerçant sa vitrine, le livreur ses courses et l'admin supervise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Client */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="w-11 h-11 rounded-xl bg-emerald-50/70 dark:bg-[#10231B] text-[#0B7A4B] dark:text-[#FFB81F] flex items-center justify-center font-bold border border-[#D4E9DD] dark:border-[#1E3B2D]">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-medium px-2.5 py-1 rounded bg-emerald-50/70 dark:bg-[#10231B] text-[#0B7A4B] dark:text-emerald-200 border border-[#D4E9DD] dark:border-[#1E3B2D]">
                  Particuliers & Familles
                </span>
              </div>

              <div>
                <h3 className="font-heading font-extrabold text-lg text-[#0B2B1E] dark:text-white">
                  1. Espace Client
                </h3>
                <p className="text-xs text-[#2F4F42] dark:text-emerald-100/80 mt-1 leading-relaxed">
                  Accès exclusif aux restaurants, supermarchés, boutiques et pharmacies de Conakry. Panier multi-articles, paiement Mobile Money (Orange Money & MTN MoMo), suivi GPS en direct et code secret à 4 chiffres.
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-[#0B2B1E] dark:text-emerald-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0B7A4B] dark:text-[#FFB81F] shrink-0" />
                  <span>Calcul kilométrique exact du prix de livraison</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0B7A4B] dark:text-[#FFB81F] shrink-0" />
                  <span>Aucun accès aux interfaces commerçant ou admin</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0B7A4B] dark:text-[#FFB81F] shrink-0" />
                  <span>Factures téléchargeables et reçus certifiés</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleEnterSpace('client')}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white font-semibold text-xs shadow-xs transition text-center cursor-pointer min-h-[42px]"
              >
                Explorer comme Client
              </button>
              <button
                onClick={() => handleQuickDemoLogin('client')}
                className="px-3 py-2.5 rounded-xl bg-white dark:bg-[#10231B] hover:border-[#0B7A4B] text-xs font-semibold text-[#0B2B1E] dark:text-emerald-100 border border-[#D4E9DD] dark:border-[#1E3B2D] cursor-pointer min-h-[42px]"
                title="Connexion test Amadou Diallo"
              >
                Démo Client
              </button>
            </div>
          </div>

          {/* Card 2: Partner */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="w-11 h-11 rounded-xl bg-emerald-50/70 dark:bg-[#10231B] text-[#0B7A4B] dark:text-[#FFB81F] flex items-center justify-center font-bold border border-[#D4E9DD] dark:border-[#1E3B2D]">
                  <Store className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-medium px-2.5 py-1 rounded bg-emerald-50/70 dark:bg-[#10231B] text-[#0B7A4B] dark:text-emerald-200 border border-[#D4E9DD] dark:border-[#1E3B2D]">
                  0% Commission 1er Mois
                </span>
              </div>

              <div>
                <h3 className="font-heading font-extrabold text-lg text-[#0B2B1E] dark:text-white">
                  2. Espace Partenaire Commerçant
                </h3>
                <p className="text-xs text-[#2F4F42] dark:text-emerald-100/80 mt-1 leading-relaxed">
                  Chaque établissement (restaurant, boulangerie, supermarché, pharmacie) gère sa propre vitrine en ligne, ses produits, stocks, descriptions et promotions avec partage WhatsApp & QR code.
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-[#0B2B1E] dark:text-emerald-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0B7A4B] dark:text-[#FFB81F] shrink-0" />
                  <span>Gestion des commandes en cuisine / magasin</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0B7A4B] dark:text-[#FFB81F] shrink-0" />
                  <span>Génération automatique de bannières promo</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0B7A4B] dark:text-[#FFB81F] shrink-0" />
                  <span>Service « Soneya s'occupe de tout » (Photos HD)</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleEnterSpace('partner')}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white font-semibold text-xs shadow-xs transition text-center cursor-pointer min-h-[42px]"
              >
                Espace Commerçant
              </button>
              <button
                onClick={() => handleQuickDemoLogin('partner')}
                className="px-3 py-2.5 rounded-xl bg-white dark:bg-[#10231B] hover:border-[#0B7A4B] text-xs font-semibold text-[#0B2B1E] dark:text-emerald-100 border border-[#D4E9DD] dark:border-[#1E3B2D] cursor-pointer min-h-[42px]"
                title="Connexion test Chez Fanta"
              >
                Démo Partenaire
              </button>
            </div>
          </div>

          {/* Card 3: Courier */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="w-11 h-11 rounded-xl bg-emerald-50/70 dark:bg-[#10231B] text-[#0B7A4B] dark:text-[#FFB81F] flex items-center justify-center font-bold border border-[#D4E9DD] dark:border-[#1E3B2D]">
                  <Bike className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-medium px-2.5 py-1 rounded bg-emerald-50/70 dark:bg-[#10231B] text-[#0B7A4B] dark:text-emerald-200 border border-[#D4E9DD] dark:border-[#1E3B2D]">
                  80% Frais Livreur Direct
                </span>
              </div>

              <div>
                <h3 className="font-heading font-extrabold text-lg text-[#0B2B1E] dark:text-white">
                  3. Espace Livreur Motard
                </h3>
                <p className="text-xs text-[#2F4F42] dark:text-emerald-100/80 mt-1 leading-relaxed">
                  Réservé aux motards certifiés. Dépôt de dossier KYC (CNI biométrique, carte grise, certificat de résidence, selfie guidé et charte signée). Clôture sécurisée par code secret à 4 chiffres.
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-[#0B2B1E] dark:text-emerald-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0B7A4B] dark:text-[#FFB81F] shrink-0" />
                  <span>Aucune course accessible avant validation admin</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0B7A4B] dark:text-[#FFB81F] shrink-0" />
                  <span>Navigation GPS en temps réel vers le client</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0B7A4B] dark:text-[#FFB81F] shrink-0" />
                  <span>80% des frais de livraison + 100% pourboires</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleEnterSpace('courier')}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white font-semibold text-xs shadow-xs transition text-center cursor-pointer min-h-[42px]"
              >
                Espace Livreur
              </button>
              <button
                onClick={() => handleQuickDemoLogin('courier')}
                className="px-3 py-2.5 rounded-xl bg-white dark:bg-[#10231B] hover:border-[#0B7A4B] text-xs font-semibold text-[#0B2B1E] dark:text-emerald-100 border border-[#D4E9DD] dark:border-[#1E3B2D] cursor-pointer min-h-[42px]"
                title="Connexion test Mamadou Sow"
              >
                Démo Livreur
              </button>
            </div>
          </div>

          {/* Card 4: Admin */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="w-11 h-11 rounded-xl bg-emerald-50/70 dark:bg-[#10231B] text-[#0B7A4B] dark:text-[#FFB81F] flex items-center justify-center font-bold border border-[#D4E9DD] dark:border-[#1E3B2D]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-medium px-2.5 py-1 rounded bg-emerald-50/70 dark:bg-[#10231B] text-[#0B7A4B] dark:text-emerald-200 border border-[#D4E9DD] dark:border-[#1E3B2D]">
                  Accès Direction GHT
                </span>
              </div>

              <div>
                <h3 className="font-heading font-extrabold text-lg text-[#0B2B1E] dark:text-white">
                  4. Espace Administration & Régulation
                </h3>
                <p className="text-xs text-[#2F4F42] dark:text-emerald-100/80 mt-1 leading-relaxed">
                  L'espace central pour le fondateur (René Kaba Tolno) et l'équipe Guinée Hub Technologie. Supervision globale, validation des dossiers KYC des livreurs, statistiques du pilote et rapprochement financier.
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-[#0B2B1E] dark:text-emerald-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0B7A4B] dark:text-[#FFB81F] shrink-0" />
                  <span>Validation & suspension des dossiers livreurs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0B7A4B] dark:text-[#FFB81F] shrink-0" />
                  <span>Vue financière totale (GMV, commissions, Mobile Money)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0B7A4B] dark:text-[#FFB81F] shrink-0" />
                  <span>Gestion des taux de commissions partenaires</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleEnterSpace('admin')}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#0B2B1E] hover:bg-[#081C13] text-white font-semibold text-xs shadow-xs transition text-center cursor-pointer min-h-[42px]"
              >
                Ouvrir la Console Admin
              </button>
              <button
                onClick={() => handleQuickDemoLogin('admin')}
                className="px-3 py-2.5 rounded-xl bg-white dark:bg-[#10231B] hover:border-[#0B7A4B] text-xs font-semibold text-[#0B2B1E] dark:text-emerald-100 border border-[#D4E9DD] dark:border-[#1E3B2D] cursor-pointer min-h-[42px]"
                title="Connexion test Fondateur"
              >
                Démo Admin
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Differentiation Pillars */}
      <section className="bg-white dark:bg-[#0C1913] border-t border-[#E2ECE7] dark:border-[#1E3B2D] py-12 px-4">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-1">
            <h2 className="font-heading font-black text-xl text-[#0B2B1E] dark:text-white">
              Les Piliers Technologiques de Soneya à Conakry
            </h2>
            <p className="text-xs text-[#5C7A6E] dark:text-emerald-200/75">
              Résoudre les frictions locales avec rigueur et transparence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#10231B] border border-[#E2ECE7] dark:border-[#1E3B2D] space-y-2 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-emerald-50/70 dark:bg-[#0C1913] text-[#0B7A4B] dark:text-[#FFB81F] flex items-center justify-center font-bold border border-[#D4E9DD] dark:border-[#1E3B2D]">
                <MapPin className="w-4 h-4" />
              </div>
              <h4 className="font-heading font-bold text-sm text-[#0B2B1E] dark:text-white">
                Tarification GPS Exacte
              </h4>
              <p className="text-[#2F4F42] dark:text-emerald-100/80 leading-relaxed">
                Fini les négociations au téléphone : 5 000 GNF de base + 3 500 GNF/km calculés sur la distance réelle Haversine x 1,3.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#10231B] border border-[#E2ECE7] dark:border-[#1E3B2D] space-y-2 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-emerald-50/70 dark:bg-[#0C1913] text-[#0B7A4B] dark:text-[#FFB81F] flex items-center justify-center font-bold border border-[#D4E9DD] dark:border-[#1E3B2D]">
                <Lock className="w-4 h-4" />
              </div>
              <h4 className="font-heading font-bold text-sm text-[#0B2B1E] dark:text-white">
                Code Secret à 4 Chiffres
              </h4>
              <p className="text-[#2F4F42] dark:text-emerald-100/80 leading-relaxed">
                Preuve de remise sans papier. Le livreur ne valide et ne débloque ses gains que lorsque le client lui communique son code secret.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#10231B] border border-[#E2ECE7] dark:border-[#1E3B2D] space-y-2 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-emerald-50/70 dark:bg-[#0C1913] text-[#0B7A4B] dark:text-[#FFB81F] flex items-center justify-center font-bold border border-[#D4E9DD] dark:border-[#1E3B2D]">
                <Smartphone className="w-4 h-4" />
              </div>
              <h4 className="font-heading font-bold text-sm text-[#0B2B1E] dark:text-white">
                100% Mobile Money
              </h4>
              <p className="text-[#2F4F42] dark:text-emerald-100/80 leading-relaxed">
                Zéro espèce physique, zéro risque d'agression ou de monnaie manquante pour les motards. Orange Money et MTN MoMo intégrés.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer with GHT logo */}
      <footer className="mt-auto border-t border-[#E2ECE7] dark:border-[#1E3B2D] py-6 px-4 bg-white dark:bg-[#0C1913] text-xs text-[#5C7A6E] dark:text-emerald-200/75">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/B7697457-7CD5-4A3A-A3C7-3322C1459814_4b7ffeec.png"
              alt="Guinée Hub Technologie Logo"
              className="w-10 h-10 object-contain rounded-xl bg-white border border-[#D4E9DD] dark:border-[#1E3B2D] p-1 shrink-0"
            />
            <div>
              <span className="font-bold text-[#0B2B1E] dark:text-white">
                Soneya Delivery
              </span>{' '}
              · Développé par{' '}
              <strong className="text-[#0B2B1E] dark:text-white">
                Guinée Hub Technologie (GHT)
              </strong>
              <p className="text-[11px] text-[#5C7A6E] dark:text-emerald-200/70">
                Fondée par René Kaba Tolno · Conakry, République de Guinée
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs">
            <button
              onClick={() => handleEnterSpace('client')}
              className="hover:text-[#0B7A4B] dark:hover:text-white transition cursor-pointer"
            >
              Espace Client
            </button>
            <button
              onClick={() => handleEnterSpace('partner')}
              className="hover:text-[#0B7A4B] dark:hover:text-white transition cursor-pointer"
            >
              Espace Commerçant
            </button>
            <button
              onClick={() => handleEnterSpace('courier')}
              className="hover:text-[#0B7A4B] dark:hover:text-white transition cursor-pointer"
            >
              Espace Livreur
            </button>
            <button
              onClick={() => handleEnterSpace('admin')}
              className="font-semibold text-[#0B7A4B] dark:text-[#FFB81F] hover:underline cursor-pointer"
            >
              Espace Admin
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
