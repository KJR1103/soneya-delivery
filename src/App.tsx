/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { AppProvider, useApp } from './context/AppContext';
import { GOOGLE_MAPS_API_KEY } from './utils/mapsConfig';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { NotificationToast } from './components/common/NotificationToast';
import { MiniTrackerBar } from './components/common/MiniTrackerBar';
import { AuthModal } from './components/common/AuthModal';
import { InvoiceModal } from './components/client/InvoiceModal';
import { PrivacyPolicyModal } from './components/common/PrivacyPolicyModal';
import { ConsentGate, ConsentRecord } from './components/common/ConsentGate';
import { CourierKycOnboardingModal } from './components/courier/CourierKycOnboardingModal';
import { LandingPortal } from './components/landing/LandingPortal';
import { ClientHome } from './components/client/ClientHome';
import { PartnerView } from './components/client/PartnerView';
import { CartView } from './components/client/CartView';
import { LiveTrackingView } from './components/client/LiveTrackingView';
import { ProfileView } from './components/client/ProfileView';
import { OrdersAndReceiptsView } from './components/client/OrdersAndReceiptsView';
import { CourierView } from './components/courier/CourierView';
import { PartnerDashboard } from './components/partner/PartnerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ArrowLeft } from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    space,
    activeTab,
    selectedPartner,
    setSelectedPartnerId,
    selectedOrderId,
  } = useApp();

  const [showLiveGps, setShowLiveGps] = useState(false);

  if (space === 'admin') {
    return <AdminDashboard />;
  }

  if (space === 'courier') {
    return <CourierView />;
  }

  if (space === 'partner') {
    return <PartnerDashboard />;
  }

  if (selectedPartner) {
    return (
      <PartnerView
        partner={selectedPartner}
        onBack={() => setSelectedPartnerId(null)}
      />
    );
  }

  if (activeTab === 'profile') {
    return <ProfileView />;
  }

  if (activeTab === 'cart') {
    return <CartView />;
  }

  if (activeTab === 'orders') {
    if (showLiveGps) {
      return (
        <div>
          <div className="max-w-xl mx-auto px-4 pt-3">
            <button
              onClick={() => setShowLiveGps(false)}
              className="px-3 py-1.5 text-xs font-bold text-[#1F3A8A] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour aux commandes &amp; reçus</span>
            </button>
          </div>
          <LiveTrackingView orderId={selectedOrderId} />
        </div>
      );
    }
    return <OrdersAndReceiptsView onOpenLiveTracking={() => setShowLiveGps(true)} />;
  }

  return <ClientHome />;
};

const AppInner: React.FC = () => {
  const {
    space,
    setSpace,
    showLandingPortal,
    setShowLandingPortal,
    selectedInvoiceOrder,
    setSelectedInvoiceOrder,
    isCourierOnboardingModalOpen,
    setIsCourierOnboardingModalOpen,
  } = useApp();

  const [hasConsented, setHasConsented] = useState<boolean>(() => {
    try {
      return localStorage.getItem('soneya_consent_v1') === 'accepted';
    } catch {
      return false;
    }
  });

  const handleAcceptConsent = (consent: ConsentRecord) => {
    try {
      localStorage.setItem('soneya_consent_v1', 'accepted');
      localStorage.setItem('soneya_consent_record', JSON.stringify(consent));
    } catch (e) {
      console.warn(e);
    }
    setHasConsented(true);
  };

  useEffect(() => {
    const syncRoute = () => {
      const path = window.location.pathname.replace(/\/$/, '') || '/';

      const routeMap: Record<string, 'client' | 'courier' | 'partner' | 'admin'> = {
        '/client': 'client',
        '/livreur': 'courier',
        '/partenaire': 'partner',
        '/admin': 'admin',
      };

      if (path === '/' || path === '/index.html') {
        document.title = 'Soneya Delivery Conakry — Tout Conakry livré avec élégance';
        setShowLandingPortal(true);
      } else if (routeMap[path]) {
        const activeSpace = routeMap[path];

        const titles = {
          client: 'Soneya Client — Commander à Conakry',
          courier: 'Soneya Rider — Espace livreur & KYC',
          partner: 'Soneya Business — Espace partenaire',
          admin: 'Soneya HQ — Console interne confidentielle',
        };

        document.title = titles[activeSpace];
        setSpace(activeSpace);
        setShowLandingPortal(false);
      } else {
        window.history.replaceState({}, '', '/');
        setShowLandingPortal(true);
      }
    };

    syncRoute();

    window.addEventListener('popstate', syncRoute);

    return () => {
      window.removeEventListener('popstate', syncRoute);
    };
  }, [setShowLandingPortal, setSpace]);

  if (showLandingPortal) {
    return (
      <div className="min-h-screen w-full overflow-x-hidden bg-[#F8FAFC] text-[#0F172A] flex flex-col font-body transition-colors duration-200">
        <OfflineIndicator />
        <NotificationToast />
        <LandingPortal />
        <AuthModal />
        <PrivacyPolicyModal />
        <ConsentGate isOpen={!hasConsented} onAccept={handleAcceptConsent} />
        <CourierKycOnboardingModal
          isOpen={isCourierOnboardingModalOpen}
          onClose={() => setIsCourierOnboardingModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className={`app-shell app-shell-${space} min-h-screen w-full overflow-x-hidden bg-[#F8FAFC] text-[#0F172A] flex flex-col font-body transition-colors duration-200`}>
      <OfflineIndicator />
      <NotificationToast />
      {space === 'client' && <Header />}

      <main className={`app-main app-main-${space} flex-1 w-full mx-auto overflow-x-hidden transition-all`}>
        <MainContent />
      </main>

      {space === 'client' && <MiniTrackerBar />}
      {space === 'client' && <BottomNav />}

      <AuthModal />
      <PrivacyPolicyModal />
      <ConsentGate isOpen={!hasConsented} onAccept={handleAcceptConsent} />

      <CourierKycOnboardingModal
        isOpen={isCourierOnboardingModalOpen}
        onClose={() => setIsCourierOnboardingModalOpen(false)}
      />

      {selectedInvoiceOrder && (
        <InvoiceModal
          order={selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}
    </div>
  );
};

export default function App() {
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuotaExceeded = () => setQuotaExceeded(true);

    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);

    return () => {
      window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    };
  }, []);

  const appTree = (
    <AppProvider>
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-xs">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}
      <AppInner />
    </AppProvider>
  );

  if (GOOGLE_MAPS_API_KEY) {
    return (
      <APIProvider
        apiKey={GOOGLE_MAPS_API_KEY}
        language="fr"
        region="GN"
        libraries={['marker', 'places', 'routes']}
      >
        {appTree}
      </APIProvider>
    );
  }

  return appTree;
}