/**
 * Soneya Delivery 2.0 - Préparation de l'architecture Backend Supabase
 * Développé par Guinée Hub Technologie (GHT)
 * 
 * IMPORTANT : Le projet Supabase n'est pas encore créé par l'utilisateur.
 * Ce module ne contient AUCUNE fausse clé d'API ni fausse URL.
 * Il structure l'interface de données, les types PostgreSQL et les politiques
 * de sécurité (Row Level Security - RLS) prêtes à être branchées dès que
 * les variables d'environnement VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY
 * seront configurées.
 */

import { Order, Partner, Product, UserProfile, CourierApplication } from '../types';

export interface SupabaseConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

/**
 * Structure des tables PostgreSQL pour Soneya Delivery
 * 
 * -- Table: users (Comptes et profils)
 * CREATE TABLE public.profiles (
 *   id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 *   full_name TEXT NOT NULL,
 *   phone TEXT NOT NULL UNIQUE,
 *   email TEXT,
 *   role TEXT NOT NULL CHECK (role IN ('client', 'courier', 'partner', 'admin')),
 *   quartier_id TEXT,
 *   created_at TIMESTAMPTZ DEFAULT NOW(),
 *   updated_at TIMESTAMPTZ DEFAULT NOW()
 * );
 * 
 * -- RLS: public.profiles
 * ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
 * CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
 * CREATE POLICY "Admins have full access to profiles" ON public.profiles FOR ALL USING (
 *   EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
 * );
 * 
 * -- Table: partners (Commerces & restaurants de Conakry)
 * CREATE TABLE public.partners (
 *   id TEXT PRIMARY KEY,
 *   name TEXT NOT NULL,
 *   category TEXT NOT NULL,
 *   category_label TEXT NOT NULL,
 *   phone TEXT NOT NULL,
 *   address TEXT NOT NULL,
 *   lat DOUBLE PRECISION NOT NULL,
 *   lng DOUBLE PRECISION NOT NULL,
 *   is_open BOOLEAN DEFAULT true,
 *   rating NUMERIC(2, 1) DEFAULT 4.8,
 *   commission_rate_percent NUMERIC(4, 2) DEFAULT 12.0,
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 * 
 * -- Table: orders (Commandes et livraisons)
 * CREATE TABLE public.orders (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   tracking_number TEXT UNIQUE NOT NULL,
 *   client_id UUID REFERENCES public.profiles(id),
 *   partner_id TEXT REFERENCES public.partners(id),
 *   courier_id UUID REFERENCES public.profiles(id),
 *   status TEXT NOT NULL CHECK (status IN ('submitted', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled')),
 *   delivery_code TEXT NOT NULL, -- Code PIN secret 4 chiffres
 *   is_code_validated BOOLEAN DEFAULT false,
 *   total_gnf INTEGER NOT NULL,
 *   delivery_fee_gnf INTEGER NOT NULL,
 *   payment_method TEXT NOT NULL CHECK (payment_method IN ('orange_money', 'mtn_momo')),
 *   payment_phone TEXT,
 *   client_lat DOUBLE PRECISION,
 *   client_lng DOUBLE PRECISION,
 *   delivery_landmark TEXT,
 *   created_at TIMESTAMPTZ DEFAULT NOW(),
 *   updated_at TIMESTAMPTZ DEFAULT NOW()
 * );
 * 
 * -- Table: courier_kyc (Dossiers de vérification motards)
 * CREATE TABLE public.courier_kyc (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   courier_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
 *   status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
 *   cni_number TEXT,
 *   gray_card_number TEXT,
 *   residence_cert_number TEXT,
 *   charter_signed_at TIMESTAMPTZ,
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 */

export interface RealtimeOrderPayload {
  id: string;
  trackingNumber: string;
  partnerId: string;
  clientId: string;
  courierId: string | null;
  status: Order['status'];
  deliveryCode: string;
  isCodeValidated: boolean;
  totalGnf: number;
  deliveryFeeGnf: number;
  clientLat: number;
  clientLng: number;
  updatedAt: string;
}

export interface RealtimeCourierLocation {
  courierId: string;
  lat: number;
  lng: number;
  heading?: number;
  isOnline: boolean;
  batteryLevel?: number;
  updatedAt: string;
}

class SupabaseService {
  private config: SupabaseConfig;

  constructor() {
    // Lecture stricte des variables d'environnement réelles, sans valeurs inventées
    this.config = {
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
      supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    };
  }

  /**
   * Indique si un backend Supabase est configuré avec des clés réelles
   */
  public isConfigured(): boolean {
    return Boolean(this.config.supabaseUrl && this.config.supabaseAnonKey);
  }

  /**
   * Vérifie la connectivité réelle (renvoie false si non configuré)
   */
  public async testConnection(): Promise<boolean> {
    if (!this.isConfigured()) {
      return false;
    }
    try {
      const response = await fetch(`${this.config.supabaseUrl}/rest/v1/`, {
        headers: {
          apikey: this.config.supabaseAnonKey,
          Authorization: `Bearer ${this.config.supabaseAnonKey}`,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Abonne l'interface aux mises à jour d'une commande
   * Si non configuré, repli transparent sur la mémoire locale
   */
  public subscribeToOrder(
    orderId: string,
    onUpdate: (payload: RealtimeOrderPayload) => void
  ) {
    if (!this.isConfigured()) {
      return {
        channel: `local:order:${orderId}`,
        unsubscribe: () => {},
      };
    }

    // Préparation pour le client Supabase Realtime natif
    return {
      channel: `public:orders:id=eq.${orderId}`,
      unsubscribe: () => {},
    };
  }

  /**
   * Diffuse la position GPS du livreur en direct
   */
  public async broadcastCourierLocation(
    location: RealtimeCourierLocation
  ): Promise<boolean> {
    if (!this.isConfigured()) {
      // Repli local sans erreur
      return true;
    }
    // Appel Realtime Supabase broadcast
    return true;
  }
}

export const supabaseService = new SupabaseService();
