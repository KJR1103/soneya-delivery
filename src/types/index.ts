export type SpaceType = 'client' | 'courier' | 'partner' | 'admin';

export type CategoryId = 'restaurants' | 'groceries' | 'shops' | 'pharmacy';

export type SortOption = 'distance' | 'rating' | 'speed' | 'fee';

export interface Quartier {
  id: string;
  name: string;
  commune: 'Kaloum' | 'Dixinn' | 'Matam' | 'Ratoma' | 'Matoto' | 'Sonfonia' | 'Dubréka';
  lat: number;
  lng: number;
  description?: string;
}

export interface ProductOption {
  name: string;
  priceModifierGnf: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  priceGnf: number;
  image: string;
  category: string;
  available: boolean;
  isPopular?: boolean;
  prepTimeMin?: number;
  options?: ProductOption[];
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Partner {
  id: string;
  name: string;
  category: CategoryId;
  categoryLabel: string;
  rating: number;
  reviewsCount: number;
  deliveryTimeMin: number;
  coverImage: string;
  logoImage: string;
  address: string;
  quartierId: string;
  quartierName: string;
  lat: number;
  lng: number;
  minOrderGnf: number;
  isOpen: boolean;
  phone: string;
  products: Product[];
  tags: string[];
  bannerOffer?: string;
  reviews?: Review[];
  commissionRatePercent?: number; // 12% restaurants, 10% boutiques, 7% supermarchés & pharmacie
  isFirstMonthExempt?: boolean; // Offerte le premier mois
  hasSubscribedSoneyaTout?: boolean; // Soneya s'occupe de tout
  hasPromotedBanner?: boolean; // Mise en avant
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOption?: ProductOption;
  instructions?: string;
  partnerId: string;
  partnerName: string;
}

export type OrderStatus = 'submitted' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';

// 100% Mobile Money (Orange Money, MTN MoMo). Pas d'espèces, pas de carte.
export type PaymentMethod = 'orange_money' | 'mtn_momo';

export type KycStatus = 'incomplete' | 'pending_verification' | 'validated' | 'rejected' | 'suspended';

export interface EmergencyContact {
  fullName: string;
  relationship: string;
  phone: string;
}

export interface CourierKycDocuments {
  cniRectoUrl: string;
  cniVersoUrl: string;
  cniNumber: string;
  carteGriseUrl: string;
  certificatResidenceUrl: string;
  selfiePhotoUrl: string;
  vehicleBrandModel: string;
  plateNumber: string;
  momoProvider: PaymentMethod;
  momoNumber: string;
  momoAccountName: string;
  emergencyContact: EmergencyContact;
}

export interface CourierCharterAgreement {
  helmetCompliant: boolean;
  highwayCodeCompliant: boolean;
  punctualAndNotifyCompliant: boolean;
  noTamperParcelCompliant: boolean;
  deliverOnlyWith4DigitCodeCompliant: boolean;
  politenessCompliant: boolean;
  sanctionsAccepted: boolean;
  signatureDataUrl: string;
  signedAt: string;
}

export interface CourierApplication {
  id: string;
  courierId: string;
  fullName: string;
  phone: string;
  email?: string;
  quartier: string;
  status: KycStatus;
  rejectionReason?: string;
  suspensionReason?: string;
  documents: CourierKycDocuments;
  charter: CourierCharterAgreement;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface CourierInfo {
  id: string;
  name: string;
  phone: string;
  rating: number;
  ridesCount: number;
  vehicle: string;
  plateNumber: string;
  avatar: string;
  currentLat: number;
  currentLng: number;
  licenseNumber?: string;
  idCardNumber?: string;
  isVerified?: boolean;
  safetyRating?: number;
  kycStatus?: KycStatus;
  rejectionReason?: string;
  suspensionReason?: string;
  emergencyContact?: EmergencyContact;
}

export interface Order {
  id: string;
  trackingNumber: string;
  deliveryCode: string; // Code à 4 chiffres (preuve de remise sécurisée)
  isCodeValidated?: boolean;
  createdAt: string;
  partnerId: string;
  partnerName: string;
  partnerPhone: string;
  partnerLat: number;
  partnerLng: number;
  partnerAddress: string;
  partnerCategory?: CategoryId;
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  clientQuartier: string;
  clientLat: number;
  clientLng: number;
  deliveryLandmark?: string; // Point de repère conakrykaise (ex: "Face station Total, portail bleu")
  isScheduled?: boolean;
  scheduledTime?: string;
  items: CartItem[];
  itemsSubtotalGnf: number;
  deliveryDistanceKm: number;
  deliveryFeeGnf: number;
  serviceFeeGnf: number; // Frais de service client : 3 000 GNF
  tipGnf: number;
  discountGnf: number;
  promoCode?: string;
  totalGnf: number;
  paymentMethod: PaymentMethod;
  paymentPhone?: string;
  paymentTransactionId?: string;
  status: OrderStatus;
  estimatedDeliveryMinutes: number;
  courier?: CourierInfo;
  
  // Économie unitaire détaillée
  partnerPayoutGnf: number; // Ce que reçoit le restaurant (Panier - Commission)
  courierPayoutGnf: number; // 80 % des frais de livraison (+ pourboire)
  soneyaCommissionGnf: number; // 20 % livraison + commission panier + frais service
  paymentFeeGnf: number; // 2,75 % de frais mobile money simulés
  commissionRatePercent: number; // 12%, 10%, 7% ou 0%
  
  timeline: {
    status: OrderStatus;
    timestamp: string;
    label: string;
    description: string;
  }[];
}

export interface PromoCode {
  code: string;
  discountType: 'flat' | 'percentage' | 'free_delivery';
  discountValue: number;
  maxDiscountGnf?: number;
  minOrderGnf?: number;
  description: string;
}

export interface StoryItem {
  id: string;
  title: string;
  partnerId?: string;
  partnerName?: string;
  image: string;
  badge: string;
  tag: string;
}

export interface SavedAddress {
  id: string;
  label: string; // 'Maison', 'Bureau', 'Parents'
  quartierId: string;
  quartierName: string;
  address: string;
  landmark: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  role: SpaceType; // 'client' | 'courier' | 'partner' | 'admin'
  partnerId?: string; // If merchant
  courierId?: string; // If courier
  quartierId: string;
  quartierName: string;
  addresses: SavedAddress[];
  savedMomoNumber?: string;
  smsNotifications: boolean;
  pushNotifications: boolean;
  emailReceipts: boolean;
}
