import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CartItem,
  CategoryId,
  Order,
  OrderStatus,
  Partner,
  Product,
  ProductOption,
  Quartier,
  SpaceType,
  SortOption,
  UserProfile,
  CourierApplication,
  KycStatus,
} from '../types';
import { CONAKRY_QUARTIERS, DEFAULT_QUARTIER, calculateDistanceKm, calculateDeliveryFeeGnf } from '../utils/geo';
import { MOCK_PARTNERS } from '../data/mockData';
import { INITIAL_COURIER_APPLICATIONS } from '../data/mockKycApplications';
import { sound } from '../utils/audio';

interface ClientLocation {
  quartier: Quartier;
  isGPS: boolean;
  addressLabel: string;
}

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'status';
}

interface AppContextType {
  // Navigation & Space
  space: SpaceType;
  setSpace: (space: SpaceType) => void;
  activeTab: 'home' | 'partners' | 'search' | 'orders' | 'favorites' | 'profile';
  setActiveTab: (tab: 'home' | 'partners' | 'search' | 'orders' | 'favorites' | 'profile') => void;

  // Common Landing Portal
  showLandingPortal: boolean;
  setShowLandingPortal: (show: boolean) => void;

  // User Profile & Auth
  user: UserProfile | null;
  updateUser: (profile: Partial<UserProfile>) => void;
  login: (phone: string, name?: string, role?: SpaceType, partnerId?: string, courierId?: string) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  // Legal & Privacy
  isPrivacyModalOpen: boolean;
  setIsPrivacyModalOpen: (open: boolean) => void;

  // Courier KYC & Onboarding
  courierApplications: CourierApplication[];
  currentCourierId: string;
  setCurrentCourierId: (id: string) => void;
  currentCourierApplication: CourierApplication | undefined;
  submitCourierKyc: (application: CourierApplication) => void;
  validateCourierKyc: (applicationId: string) => void;
  rejectCourierKyc: (applicationId: string, reason: string) => void;
  suspendCourier: (applicationId: string, reason: string) => void;
  reactivateCourier: (applicationId: string) => void;
  isCourierOnboardingModalOpen: boolean;
  setIsCourierOnboardingModalOpen: (open: boolean) => void;

  // Partner & Courier Registration
  registerPartner: (partnerData: { name: string; category: CategoryId; phone: string; quartierName: string; ownerName: string }) => void;
  registerCourier: (courierData: { name: string; phone: string; vehicle: string; plateNumber: string; licenseNumber: string }) => void;

  // Location
  location: ClientLocation;
  setLocation: (loc: ClientLocation) => void;
  requestGPSLocation: () => Promise<boolean>;

  // Dark mode
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Sound effects
  soundEnabled: boolean;
  toggleSound: () => void;

  // Toast notifications
  toast: ToastNotification | null;
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'status') => void;
  dismissToast: () => void;

  // Loyalty Program
  loyaltyPoints: number;
  redeemPoints: (points: number) => number; // returns discount in GNF

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, partner: Partner, option?: ProductOption, instructions?: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartPartner: Partner | null;
  cartCount: number;
  cartSubtotalGnf: number;

  // Orders & Tracking
  orders: Order[];
  activeOrder: Order | null;
  createOrder: (orderData: Omit<Order, 'id' | 'trackingNumber' | 'createdAt' | 'status' | 'timeline' | 'partnerPayoutGnf' | 'courierPayoutGnf' | 'soneyaCommissionGnf' | 'paymentFeeGnf' | 'commissionRatePercent' | 'deliveryCode'> & { deliveryCode?: string }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, reason?: string) => void;
  validateOrderWithCode: (orderId: string, code: string) => { success: boolean; message: string };
  reorder: (order: Order) => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
  selectedInvoiceOrder: Order | null;
  setSelectedInvoiceOrder: (order: Order | null) => void;

  // Partners & Management (Catalog, Add, Edit, Commissions, Services)
  selectedPartner: Partner | null;
  setSelectedPartnerId: (id: string | null) => void;
  partners: Partner[];
  updatePartnerStock: (partnerId: string, productId: string, available: boolean) => void;
  addProductToPartner: (partnerId: string, product: Omit<Product, 'id'>) => void;
  updatePartnerProduct: (partnerId: string, productId: string, updates: Partial<Product>) => void;
  deletePartnerProduct: (partnerId: string, productId: string) => void;
  togglePartnerCommissionExempt: (partnerId: string) => void;
  subscribePartnerService: (partnerId: string, serviceKey: 'tout' | 'promo' | 'pro') => void;

  // Favorites
  favorites: string[];
  toggleFavorite: (partnerId: string) => void;
  isFavorite: (partnerId: string) => boolean;

  // Search & Filter state
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  sortOption: SortOption;
  setSortOption: (sort: SortOption) => void;
  isFilterModalOpen: boolean;
  setIsFilterModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  CART: 'soneya_cart',
  ORDERS: 'soneya_orders',
  FAVORITES: 'soneya_favorites',
  THEME: 'soneya_theme_v2',
  LOCATION: 'soneya_location',
  POINTS: 'soneya_points',
  USER: 'soneya_user_profile',
  COURIER_KYC: 'soneya_courier_kyc_applications',
  CURRENT_COURIER_ID: 'soneya_current_courier_id',
};

const DEFAULT_USER: UserProfile = {
  id: 'usr_224_amadou',
  fullName: 'Amadou Diallo',
  phone: '622 78 90 12',
  email: 'amadou.diallo.conakry@gmail.com',
  role: 'client',
  quartierId: 'kipe',
  quartierName: 'Kipé (Centre)',
  addresses: [
    {
      id: 'addr-1',
      label: 'Maison (Résidence)',
      quartierId: 'kipe',
      quartierName: 'Kipé',
      address: 'Villa 14, Rue KP-12, Kipé',
      landmark: 'Portail bleu, à côté de la pharmacie Kipé',
    },
    {
      id: 'addr-2',
      label: 'Bureau (Travail)',
      quartierId: 'kaloum-centre',
      quartierName: 'Kaloum',
      address: 'Immeuble Almamya, 3ème étage, Kaloum',
      landmark: 'En face de la BICIGUI',
    },
  ],
  savedMomoNumber: '622 78 90 12',
  smsNotifications: true,
  pushNotifications: true,
  emailReceipts: true,
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [space, setSpace] = useState<SpaceType>('client');
  const [activeTab, setActiveTab] = useState<'home' | 'partners' | 'search' | 'orders' | 'favorites' | 'profile'>('home');
  const [partners, setPartners] = useState<Partner[]>(() => {
    try {
      const saved = localStorage.getItem('soneya_partners_catalog');
      return saved ? JSON.parse(saved) : MOCK_PARTNERS;
    } catch {
      return MOCK_PARTNERS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('soneya_partners_catalog', JSON.stringify(partners));
    } catch (e) {
      console.warn(e);
    }
  }, [partners]);

  const [selectedPartnerId, setSelectedPartnerIdState] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('distance');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isCourierOnboardingModalOpen, setIsCourierOnboardingModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  // Courier KYC applications state
  const [courierApplications, setCourierApplications] = useState<CourierApplication[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COURIER_KYC);
      return saved ? JSON.parse(saved) : INITIAL_COURIER_APPLICATIONS;
    } catch {
      return INITIAL_COURIER_APPLICATIONS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COURIER_KYC, JSON.stringify(courierApplications));
    } catch (e) {
      console.warn(e);
    }
  }, [courierApplications]);

  const [currentCourierId, setCurrentCourierId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_COURIER_ID) || 'c-1';
  });

  const handleSetCurrentCourierId = (id: string) => {
    setCurrentCourierId(id);
    localStorage.setItem(STORAGE_KEYS.CURRENT_COURIER_ID, id);
  };

  const currentCourierApplication = courierApplications.find(a => a.courierId === currentCourierId);

  const [showLandingPortal, setShowLandingPortal] = useState<boolean>(false);

  // User Profile
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser(prev => {
      const updated = prev ? { ...prev, ...updates } : { ...DEFAULT_USER, ...updates };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
      return updated;
    });
    showToast('Profil mis à jour', 'Vos coordonnées et adresses ont été enregistrées', 'success');
  };

  const login = (
    phone: string,
    name: string = 'Utilisateur Conakry',
    role: SpaceType = 'client',
    partnerId?: string,
    courierId?: string
  ) => {
    const newUser: UserProfile = {
      ...DEFAULT_USER,
      id: `usr_${Date.now()}`,
      phone,
      fullName: name,
      role,
      partnerId,
      courierId,
    };
    setUser(newUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    setSpace(role);
    if (role === 'partner' && partnerId) {
      setSelectedPartnerIdState(partnerId);
    }
    if (role === 'courier' && courierId) {
      handleSetCurrentCourierId(courierId);
    }
    setIsAuthModalOpen(false);
    setShowLandingPortal(false);
    sound.playSuccess();

    const roleLabels: Record<SpaceType, string> = {
      client: 'Espace Client',
      partner: 'Espace Partenaire Commerçant',
      courier: 'Espace Livreur Motard',
      admin: 'Espace Super Admin (GHT)',
    };
    showToast('Connexion réussie', `Bienvenue ${name}. Connecté en ${roleLabels[role]}.`, 'success');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setSpace('client');
    showToast('Déconnexion', 'Vous êtes maintenant en mode invité', 'info');
  };

  // Loyalty points
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.POINTS);
      return saved ? parseInt(saved, 10) : 180;
    } catch {
      return 180;
    }
  });

  const redeemPoints = (points: number): number => {
    if (loyaltyPoints < points) return 0;
    const discountGnf = points * 50; // 100 points = 5 000 GNF
    setLoyaltyPoints(prev => {
      const next = prev - points;
      localStorage.setItem(STORAGE_KEYS.POINTS, next.toString());
      return next;
    });
    showToast('Points Soneya Club utilisés', `-${discountGnf.toLocaleString('fr-FR')} GNF appliqués !`, 'success');
    return discountGnf;
  };

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'status' = 'info') => {
    setToast({ id: `${Date.now()}`, title, message, type });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 4000);
  };

  const dismissToast = () => setToast(null);

  const toggleSound = () => {
    setSoundEnabled(prev => {
      sound.setSoundEnabled(!prev);
      return !prev;
    });
  };

  // Dark mode (default strictly to light / pure white background unless user toggles)
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved !== null) return saved === 'dark';
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEYS.THEME, darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // Location
  const [location, setLocation] = useState<ClientLocation>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOCATION);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      quartier: DEFAULT_QUARTIER,
      isGPS: false,
      addressLabel: `${DEFAULT_QUARTIER.name}, Commune de ${DEFAULT_QUARTIER.commune}`,
    };
  });

  const requestGPSLocation = async (): Promise<boolean> => {
    if (!navigator.geolocation) return false;
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          let closest = CONAKRY_QUARTIERS[0];
          let minDist = 99999;
          CONAKRY_QUARTIERS.forEach((q) => {
            const d = calculateDistanceKm(lat, lng, q.lat, q.lng);
            if (d < minDist) {
              minDist = d;
              closest = q;
            }
          });
          const newLoc: ClientLocation = {
            quartier: {
              ...closest,
              lat,
              lng,
              name: `Position GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
            },
            isGPS: true,
            addressLabel: `Position GPS exacte (proche de ${closest.name})`,
          };
          setLocation(newLoc);
          localStorage.setItem(STORAGE_KEYS.LOCATION, JSON.stringify(newLoc));
          showToast('GPS activé', `Coordonnées détectées : ${closest.name}`, 'success');
          resolve(true);
        },
        () => {
          resolve(false);
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    });
  };

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return saved ? JSON.parse(saved) : ['chez-fanta', 'le-cedre-kaloum'];
    } catch {
      return ['chez-fanta'];
    }
  });

  const toggleFavorite = (partnerId: string) => {
    setFavorites(prev => {
      const isFav = prev.includes(partnerId);
      const next = isFav ? prev.filter(id => id !== partnerId) : [...prev, partnerId];
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(next));
      sound.playPop();
      showToast(isFav ? 'Retiré des favoris' : 'Ajouté aux favoris', '', 'info');
      return next;
    });
  };

  const isFavorite = (partnerId: string) => favorites.includes(partnerId);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  const cartPartner = cart.length > 0 ? partners.find(p => p.id === cart[0].partnerId) || null : null;
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotalGnf = cart.reduce((acc, item) => {
    const itemPrice = item.product.priceGnf + (item.selectedOption?.priceModifierGnf || 0);
    return acc + itemPrice * item.quantity;
  }, 0);

  const addToCart = (product: Product, partner: Partner, option?: ProductOption, instructions?: string) => {
    sound.playPop();
    setCart(prev => {
      if (prev.length > 0 && prev[0].partnerId !== partner.id) {
        showToast('Nouveau panier', `Votre panier a été mis à jour avec ${partner.name}`, 'info');
        return [{
          product,
          quantity: 1,
          selectedOption: option,
          instructions,
          partnerId: partner.id,
          partnerName: partner.name,
        }];
      }

      const existingIndex = prev.findIndex(item =>
        item.product.id === product.id &&
        item.selectedOption?.name === option?.name
      );

      showToast('Article ajouté', `${product.name} ajouté au panier`, 'success');

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += 1;
        if (instructions) next[existingIndex].instructions = instructions;
        return next;
      }

      return [...prev, {
        product,
        quantity: 1,
        selectedOption: option,
        instructions,
        partnerId: partner.id,
        partnerName: partner.name,
      }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    sound.playPop();
    setCart(prev => {
      if (quantity <= 0) {
        return prev.filter(item => item.product.id !== productId);
      }
      return prev.map(item => item.product.id === productId ? { ...item, quantity } : item);
    });
  };

  const removeFromCart = (productId: string) => {
    sound.playPop();
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    const initialOrder: Order = {
      id: 'ord_demo_224',
      trackingNumber: 'SNY-224-8902',
      deliveryCode: '8492',
      isCodeValidated: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      partnerId: 'chez-fanta',
      partnerName: 'Chez Fanta - Délices de Guinée',
      partnerPhone: '+224 622 10 20 30',
      partnerLat: 9.5855,
      partnerLng: -13.6358,
      partnerAddress: 'Centre Commercial Prima Center, Kipé',
      partnerCategory: 'restaurants',
      clientName: 'Amadou Diallo',
      clientPhone: '+224 622 78 90 12',
      clientAddress: 'Villa 14, Rue KP-12, Kipé',
      clientQuartier: 'Kipé',
      clientLat: 9.5780,
      clientLng: -13.6290,
      deliveryLandmark: 'Portail bleu, en face de la pharmacie Kipé',
      items: [
        {
          product: MOCK_PARTNERS[0].products[0],
          quantity: 2,
          selectedOption: { name: 'Piment modéré', priceModifierGnf: 0 },
          partnerId: 'chez-fanta',
          partnerName: 'Chez Fanta',
        },
        {
          product: MOCK_PARTNERS[0].products[4],
          quantity: 2,
          partnerId: 'chez-fanta',
          partnerName: 'Chez Fanta',
        },
      ],
      itemsSubtotalGnf: 114000,
      deliveryDistanceKm: 2.4,
      deliveryFeeGnf: 13500,
      serviceFeeGnf: 3000,
      tipGnf: 5000,
      discountGnf: 10000,
      promoCode: 'SONEYA20',
      totalGnf: 125500,
      paymentMethod: 'orange_money',
      paymentPhone: '622 78 90 12',
      paymentTransactionId: 'OM-224-918230',
      status: 'delivering',
      estimatedDeliveryMinutes: 14,
      partnerPayoutGnf: 100320, // 114000 - 12%
      courierPayoutGnf: 15800, // 80% de 13500 (= 10800) + 5000 pourboire
      soneyaCommissionGnf: 19380, // 2700 (20% livraison) + 13680 (12% com) + 3000 (service)
      paymentFeeGnf: 3451, // 2.75% de 125 500
      commissionRatePercent: 12,
      courier: {
        id: 'courier-mamadou',
        name: 'Mamadou Sow',
        phone: '+224 622 45 89 12',
        rating: 4.9,
        ridesCount: 1420,
        vehicle: 'Moto TVS Apache 180 (Noire)',
        plateNumber: 'RC-8492-AG',
        licenseNumber: 'PERM-GUI-2022-8419',
        idCardNumber: 'CNI-GN-984-219',
        isVerified: true,
        safetyRating: 5.0,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        currentLat: 9.5815,
        currentLng: -13.6320,
      },
      timeline: [
        { status: 'submitted', timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(), label: 'Commande envoyée', description: 'Reçue par Chez Fanta' },
        { status: 'preparing', timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), label: 'En préparation', description: 'Le chef cuisine vos plats frais' },
        { status: 'ready', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), label: 'Prête', description: 'Colis récupéré par Mamadou Sow' },
        { status: 'delivering', timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(), label: 'En livraison', description: 'Le livreur roule vers votre adresse' },
      ],
    };
    return [initialOrder];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  const activeOrder = orders.find(o => o.status !== 'delivered') || orders[0] || null;

  const createOrder = (orderData: Omit<Order, 'id' | 'trackingNumber' | 'createdAt' | 'status' | 'timeline' | 'partnerPayoutGnf' | 'courierPayoutGnf' | 'soneyaCommissionGnf' | 'paymentFeeGnf' | 'commissionRatePercent' | 'deliveryCode'> & { deliveryCode?: string }): Order => {
    sound.playSuccess();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const code = orderData.deliveryCode || Math.floor(1000 + Math.random() * 9000).toString();

    // Financial split per specifications
    const partner = partners.find(p => p.id === orderData.partnerId);
    const commRate = partner?.isFirstMonthExempt
      ? 0
      : (partner?.commissionRatePercent ?? (partner?.category === 'restaurants' ? 12 : partner?.category === 'shops' ? 10 : 7));
    
    const partnerCommGnf = Math.round((orderData.itemsSubtotalGnf * commRate) / 100);
    const partnerPayoutGnf = orderData.itemsSubtotalGnf - partnerCommGnf;

    // 80% of delivery fee to courier, 20% to Soneya
    const courierCutGnf = Math.round(orderData.deliveryFeeGnf * 0.8);
    const courierPayoutGnf = courierCutGnf + (orderData.tipGnf || 0);
    const soneyaDeliveryCutGnf = orderData.deliveryFeeGnf - courierCutGnf;

    // Soneya gross income: 20% delivery + partner commission + 3000 GNF client service fee
    const serviceFeeGnf = orderData.serviceFeeGnf ?? 3000;
    const soneyaCommissionGnf = soneyaDeliveryCutGnf + partnerCommGnf + serviceFeeGnf;

    // Simulated mobile money payment fee (2.75% of total paid)
    const paymentFeeGnf = Math.round(orderData.totalGnf * 0.0275);

    const newOrder: Order = {
      ...orderData,
      id: `ord_${Date.now()}`,
      trackingNumber: `SNY-224-${randomNum}`,
      deliveryCode: code,
      isCodeValidated: false,
      createdAt: new Date().toISOString(),
      serviceFeeGnf,
      partnerPayoutGnf,
      courierPayoutGnf,
      soneyaCommissionGnf,
      paymentFeeGnf,
      commissionRatePercent: commRate,
      status: 'submitted',
      paymentTransactionId: `${orderData.paymentMethod === 'orange_money' ? 'OM' : 'MOMO'}-GN-${Date.now().toString().slice(-6)}`,
      courier: {
        id: 'courier-alpha',
        name: 'Alpha Oumar Barry',
        phone: '+224 662 14 33 22',
        rating: 4.95,
        ridesCount: 980,
        vehicle: 'Moto Bajaj Pulsar 150 (Bleue)',
        plateNumber: 'RC-5104-AH',
        licenseNumber: 'PERM-GUI-2023-1102',
        idCardNumber: 'CNI-GN-740-928',
        isVerified: true,
        safetyRating: 4.9,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        currentLat: orderData.partnerLat,
        currentLng: orderData.partnerLng,
      },
      timeline: [
        {
          status: 'submitted',
          timestamp: new Date().toISOString(),
          label: 'Commande confirmée',
          description: `Transmise à ${orderData.partnerName}`,
        },
      ],
    };

    const earnedPoints = Math.floor(orderData.totalGnf / 1000);
    setLoyaltyPoints(prev => {
      const next = prev + earnedPoints;
      localStorage.setItem(STORAGE_KEYS.POINTS, next.toString());
      return next;
    });

    setOrders(prev => [newOrder, ...prev]);
    setSelectedOrderId(newOrder.id);
    clearCart();
    showToast('Commande validée !', `Livraison estimée : ${orderData.estimatedDeliveryMinutes} min (+${earnedPoints} pts Soneya Club)`, 'success');
    return newOrder;
  };

  const validateOrderWithCode = (orderId: string, code: string): { success: boolean; message: string } => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return { success: false, message: 'Commande introuvable' };

    if (order.deliveryCode !== code.trim()) {
      sound.playPop();
      showToast('Code erroné', 'Le code à 4 chiffres ne correspond pas', 'status');
      return { success: false, message: 'Code erroné. Veuillez demander le code secret à 4 chiffres affiché sur l écran du client.' };
    }

    // Valid code!
    updateOrderStatus(orderId, 'delivered', 'Validé par code secret à 4 chiffres');
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, isCodeValidated: true, status: 'delivered' } : o));
    sound.playSuccess();
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#0B7A4B', '#FFB81F', '#064E30', '#FFFFFF'],
      });
    } catch (e) {
      console.warn(e);
    }
    showToast(
      'Livraison validée avec succès !',
      `Code ${code} accepté. Preuve de remise confirmée. Rémunération coursier de ${order.courierPayoutGnf.toLocaleString('fr-FR')} GNF débloquée.`,
      'success'
    );
    return { success: true, message: 'Livraison validée avec succès !' };
  };

  const reorder = (prevOrder: Order) => {
    const partner = partners.find(p => p.id === prevOrder.partnerId);
    if (!partner) return;
    setCart(prevOrder.items);
    setSelectedPartnerIdState(null);
    setActiveTab('orders');
    sound.playSuccess();
    showToast('Articles réintégrés', `Panier prêt pour commander chez ${prevOrder.partnerName}`, 'success');
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, reason?: string) => {
    sound.playStatusPing();
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;

      const labels: Record<OrderStatus, { label: string; desc: string }> = {
        submitted: { label: 'Commande envoyée', desc: 'Enregistrée avec succès' },
        preparing: { label: 'En préparation', desc: `${order.partnerName} prépare vos articles` },
        ready: { label: 'Prête', desc: 'Le colis est scellé pour le livreur' },
        delivering: { label: 'En cours de livraison', desc: `${order.courier?.name || 'Le coursier'} est en route` },
        delivered: { label: 'Livrée avec succès', desc: 'Remise en mains propres. Merci d utiliser Soneya !' },
        cancelled: { label: 'Commande annulée', desc: reason || 'Commande refusée ou annulée' },
      };

      const nextTimeline = [...order.timeline];
      if (!nextTimeline.some(t => t.status === status)) {
        nextTimeline.push({
          status,
          timestamp: new Date().toISOString(),
          label: labels[status].label,
          description: reason || labels[status].desc,
        });
      }

      showToast(labels[status].label, reason || labels[status].desc, status === 'delivered' ? 'success' : 'status');

      let courier = order.courier;
      if (courier && status === 'delivering') {
        courier = {
          ...courier,
          currentLat: (order.partnerLat + order.clientLat) / 2,
          currentLng: (order.partnerLng + order.clientLng) / 2,
        };
      } else if (courier && status === 'delivered') {
        courier = {
          ...courier,
          currentLat: order.clientLat,
          currentLng: order.clientLng,
        };
      }

      return {
        ...order,
        status,
        courier,
        timeline: nextTimeline,
      };
    }));
  };

  // Partner Product CRUD
  const updatePartnerStock = (partnerId: string, productId: string, available: boolean) => {
    setPartners(prev => prev.map(p => {
      if (p.id !== partnerId) return p;
      return {
        ...p,
        products: p.products.map(pr => pr.id === productId ? { ...pr, available } : pr),
      };
    }));
    showToast('Stock mis à jour', `Disponibilité modifiée`, 'info');
  };

  const addProductToPartner = (partnerId: string, productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod_${Date.now()}`,
    };
    setPartners(prev => prev.map(p => {
      if (p.id !== partnerId) return p;
      return {
        ...p,
        products: [newProduct, ...p.products],
      };
    }));
    sound.playSuccess();
    showToast('Article ajouté', `${productData.name} est maintenant visible au catalogue`, 'success');
  };

  const updatePartnerProduct = (partnerId: string, productId: string, updates: Partial<Product>) => {
    setPartners(prev => prev.map(p => {
      if (p.id !== partnerId) return p;
      return {
        ...p,
        products: p.products.map(pr => pr.id === productId ? { ...pr, ...updates } : pr),
      };
    }));
    sound.playPop();
    showToast('Article modifié', 'Les changements ont été enregistrés', 'success');
  };

  const deletePartnerProduct = (partnerId: string, productId: string) => {
    setPartners(prev => prev.map(p => {
      if (p.id !== partnerId) return p;
      return {
        ...p,
        products: p.products.filter(pr => pr.id !== productId),
      };
    }));
    showToast('Article supprimé', 'Le produit a été retiré du catalogue', 'info');
  };

  const registerPartner = (data: { name: string; category: CategoryId; phone: string; quartierName: string; ownerName: string }) => {
    const categoryLabels: Record<CategoryId, string> = {
      restaurants: 'Restaurant & Fast Food',
      groceries: 'Supermarché & Courses',
      shops: 'Boutique & Mode',
      pharmacy: 'Pharmacie & Soins',
    };
    const newPartner: Partner = {
      id: `p_${Date.now()}`,
      name: data.name,
      category: data.category,
      categoryLabel: categoryLabels[data.category] || 'Commerce Partenaire',
      rating: 5.0,
      reviewsCount: 1,
      deliveryTimeMin: 25,
      coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
      logoImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=150&auto=format&fit=crop&q=80',
      address: `${data.quartierName}, Conakry`,
      quartierId: 'q-custom',
      quartierName: data.quartierName,
      lat: 9.5370,
      lng: -13.6785,
      minOrderGnf: 15000,
      isOpen: true,
      phone: data.phone,
      tags: ['Partenaire Vérifié', 'Guinée Hub Tech', 'Conakry'],
      products: [
        {
          id: `prod_${Date.now()}_1`,
          name: 'Produit Découverte',
          description: 'Premier article de notre catalogue sur Soneya Delivery.',
          priceGnf: 30000,
          image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
          category: 'Spécialités',
          available: true,
          prepTimeMin: 20,
        },
      ],
    };

    setPartners(prev => [newPartner, ...prev]);
    setSelectedPartnerIdState(newPartner.id);
    setSpace('partner');
    sound.playSuccess();
    showToast('Boutique créée avec succès !', `Bienvenue ${data.name}. Vous pouvez désormais gérer vos articles et vos commandes.`, 'success');
  };

  // Courier KYC methods
  const submitCourierKyc = (applicationData: CourierApplication) => {
    sound.playSuccess();
    setCourierApplications(prev => {
      const exists = prev.some(a => a.id === applicationData.id || a.courierId === applicationData.courierId);
      let updated: CourierApplication[];
      if (exists) {
        updated = prev.map(a => (a.id === applicationData.id || a.courierId === applicationData.courierId) ? applicationData : a);
      } else {
        updated = [applicationData, ...prev];
      }
      return updated;
    });
    handleSetCurrentCourierId(applicationData.courierId);
    showToast(
      'Dossier soumis avec succès !',
      'Votre dossier d inscription motard a été transmis à l équipe Soneya. Examen sous 2h.',
      'success'
    );
  };

  const validateCourierKyc = (applicationId: string) => {
    sound.playSuccess();
    setCourierApplications(prev => prev.map(app => {
      if (app.id !== applicationId) return app;
      return {
        ...app,
        status: 'validated',
        rejectionReason: undefined,
        suspensionReason: undefined,
        reviewedAt: new Date().toISOString(),
        reviewedBy: 'Admin Soneya (Conakry)',
      };
    }));
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#0B7A4B', '#FFB81F', '#064E30'],
      });
    } catch (e) {
      console.warn(e);
    }
    showToast(
      'Dossier livreur validé !',
      'Le motard est certifié Soneya Shield. Il peut désormais recevoir des courses.',
      'success'
    );
  };

  const rejectCourierKyc = (applicationId: string, reason: string) => {
    sound.playPop();
    setCourierApplications(prev => prev.map(app => {
      if (app.id !== applicationId) return app;
      return {
        ...app,
        status: 'rejected',
        rejectionReason: reason,
        reviewedAt: new Date().toISOString(),
        reviewedBy: 'Admin Soneya (Conakry)',
      };
    }));
    showToast(
      'Dossier refusé',
      `Motif notifié au motard : ${reason}`,
      'status'
    );
  };

  const suspendCourier = (applicationId: string, reason: string) => {
    sound.playPop();
    setCourierApplications(prev => prev.map(app => {
      if (app.id !== applicationId) return app;
      return {
        ...app,
        status: 'suspended',
        suspensionReason: reason,
        reviewedAt: new Date().toISOString(),
        reviewedBy: 'Admin Soneya (Sécurité)',
      };
    }));
    showToast(
      'Compte motard suspendu',
      `Motif de suspension : ${reason}`,
      'status'
    );
  };

  const reactivateCourier = (applicationId: string) => {
    sound.playSuccess();
    setCourierApplications(prev => prev.map(app => {
      if (app.id !== applicationId) return app;
      return {
        ...app,
        status: 'validated',
        suspensionReason: undefined,
        rejectionReason: undefined,
        reviewedAt: new Date().toISOString(),
        reviewedBy: 'Admin Soneya (Réhabilitation)',
      };
    }));
    showToast(
      'Compte motard réactivé',
      'Le livreur est réintégré et peut reprendre ses livraisons.',
      'success'
    );
  };

  const registerCourier = (data: { name: string; phone: string; vehicle: string; plateNumber: string; licenseNumber: string }) => {
    sound.playSuccess();
    setIsCourierOnboardingModalOpen(true);
    setSpace('courier');
  };

  const togglePartnerCommissionExempt = (partnerId: string) => {
    setPartners(prev => prev.map(p => {
      if (p.id !== partnerId) return p;
      const current = !!p.isFirstMonthExempt;
      const next = !current;
      showToast(
        next ? 'Premier mois offert activé' : 'Commission standard réactivée',
        next ? `Commission 0% appliquée pour ${p.name}` : `Commission ${p.commissionRatePercent ?? 12}% appliquée pour ${p.name}`,
        'info'
      );
      return { ...p, isFirstMonthExempt: next };
    }));
  };

  const subscribePartnerService = (partnerId: string, serviceKey: 'tout' | 'promo' | 'pro') => {
    const serviceNames = {
      tout: "Pack 'Soneya s'occupe de tout' (Photos HD & Saisie intégrale)",
      promo: "Mise en avant sponsorisée de la vitrine",
      pro: "Abonnement Soneya Pro 24/7",
    };
    setPartners(prev => prev.map(p => {
      if (p.id !== partnerId) return p;
      if (serviceKey === 'tout') return { ...p, hasSubscribedSoneyaTout: true };
      if (serviceKey === 'promo') return { ...p, hasPromotedBanner: true };
      return p;
    }));
    sound.playSuccess();
    showToast('Service souscrit avec succès !', `${serviceNames[serviceKey]} activé pour votre commerce.`, 'success');
  };

  const selectedPartner = selectedPartnerId ? partners.find(p => p.id === selectedPartnerId) || null : null;

  return (
    <AppContext.Provider
      value={{
        space,
        setSpace,
        activeTab,
        setActiveTab,
        showLandingPortal,
        setShowLandingPortal,
        user,
        updateUser,
        login,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isPrivacyModalOpen,
        setIsPrivacyModalOpen,
        courierApplications,
        currentCourierId,
        setCurrentCourierId: handleSetCurrentCourierId,
        currentCourierApplication,
        submitCourierKyc,
        validateCourierKyc,
        rejectCourierKyc,
        suspendCourier,
        reactivateCourier,
        isCourierOnboardingModalOpen,
        setIsCourierOnboardingModalOpen,
        registerPartner,
        registerCourier,
        location,
        setLocation: (loc) => {
          setLocation(loc);
          localStorage.setItem(STORAGE_KEYS.LOCATION, JSON.stringify(loc));
        },
        requestGPSLocation,
        darkMode,
        toggleDarkMode,
        soundEnabled,
        toggleSound,
        toast,
        showToast,
        dismissToast,
        loyaltyPoints,
        redeemPoints,
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartPartner,
        cartCount,
        cartSubtotalGnf,
        orders,
        activeOrder,
        createOrder,
        updateOrderStatus,
        validateOrderWithCode,
        reorder,
        selectedOrderId,
        setSelectedOrderId,
        selectedInvoiceOrder,
        setSelectedInvoiceOrder,
        selectedPartner,
        setSelectedPartnerId: setSelectedPartnerIdState,
        partners,
        updatePartnerStock,
        addProductToPartner,
        updatePartnerProduct,
        deletePartnerProduct,
        togglePartnerCommissionExempt,
        subscribePartnerService,
        favorites,
        toggleFavorite,
        isFavorite,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        sortOption,
        setSortOption,
        isFilterModalOpen,
        setIsFilterModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
