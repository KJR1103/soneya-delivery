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
import { CourierKycOnboardingModal } from './components/courier/CourierKycOnboardingModal';
import { LandingPortal } from './components/landing/LandingPortal';
import { ClientHome } from './components/client/ClientHome';
import { PartnerView } from './components/client/PartnerView';
import { CartView } from './components/client/CartView';
import { LiveTrackingView } from './components/client/LiveTrackingView';
import { ProfileView } from './components/client/ProfileView';
import { CourierView } from './components/courier/CourierView';
import { PartnerDashboard } from './components/partner/PartnerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';

const MainContent: React.FC = () => {
  const {
    space,
    activeTab,
    selectedPartner,
    setSelectedPartnerId,
    selectedOrderId,
    cart,
  } = useApp();

  // 1. If in Admin Space
  if (space === 'admin') {
    return <AdminDashboard />;
  }

  // 2. If in Courier Space
  if (space === 'courier') {
    return <CourierView />;
  }

  // 3. If in Partner/Merchant Space
  if (space === 'partner') {
    return <PartnerDashboard />;
  }

  // 4. Client Space navigation:
  if (selectedPartner) {
    return (
      <PartnerView
        partner={selectedPartner}
        onBack={() => setSelectedPartnerId(null)}
      />
    );
  }

  // Profile & Settings tab
  if (activeTab === 'profile') {
    return <ProfileView />;
  }

  // Orders tab: show Cart (if items) OR Live Tracking (if ongoing/past order)
  if (activeTab === 'orders') {
    if (cart.length > 0) {
      return <CartView />;
    }
    return <LiveTrackingView orderId={selectedOrderId} />;
  }

  // Default to Client Home (Accueil or Favoris or Search)
  return <ClientHome />;
};

const AppInner: React.FC = () => {
  const {
    space,
    showLandingPortal,
    selectedInvoiceOrder,
    setSelectedInvoiceOrder,
    isCourierOnboardingModalOpen,
    setIsCourierOnboardingModalOpen,
  } = useApp();

  if (showLandingPortal) {
    return (
      <div className="min-h-screen w-full overflow-x-hidden bg-white dark:bg-[#08120D] text-[#0B2B1E] dark:text-white flex flex-col font-sans transition-colors duration-200">
        <OfflineIndicator />
        <NotificationToast />
        <LandingPortal />
        <AuthModal />
        <PrivacyPolicyModal />
        <CourierKycOnboardingModal
          isOpen={isCourierOnboardingModalOpen}
          onClose={() => setIsCourierOnboardingModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className={`app-shell app-shell-${space} min-h-screen w-full overflow-x-hidden bg-white dark:bg-[#08120D] text-[#0B2B1E] dark:text-white flex flex-col font-sans transition-colors duration-200`}>
      <OfflineIndicator />
      <NotificationToast />
      <Header />

      <main className={`app-main app-main-${space} flex-1 w-full mx-auto overflow-x-hidden transition-all`}>
        <MainContent />
      </main>

      <MiniTrackerBar />
      <BottomNav />

      {/* Auth, Privacy, Invoicing and Courier KYC Modals */}
      <AuthModal />
      <PrivacyPolicyModal />
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
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
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
