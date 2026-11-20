import { Quartier } from '../types';

// Quartiers phares de Conakry avec coordonnées GPS représentatives
export const CONAKRY_QUARTIERS: Quartier[] = [
  { id: 'kaloum-centre', name: 'Kaloum (Centre-ville)', commune: 'Kaloum', lat: 9.5101, lng: -13.7122, description: 'Sièges administratifs, port et banques' },
  { id: 'almamya', name: 'Almamya', commune: 'Kaloum', lat: 9.5140, lng: -13.7080, description: 'Quartier commercial de Kaloum' },
  { id: 'camayenne', name: 'Camayenne', commune: 'Dixinn', lat: 9.5342, lng: -13.6885, description: 'Corniche Sud, Donka et Hôtels' },
  { id: 'dixinn-centre', name: 'Dixinn Centre', commune: 'Dixinn', lat: 9.5480, lng: -13.6750, description: 'Université Gamal Abdel Nasser' },
  { id: 'madina', name: 'Madina Marché', commune: 'Matam', lat: 9.5420, lng: -13.6490, description: 'Le grand poumon commercial de Guinée' },
  { id: 'matam-bonfi', name: 'Bonfi / Matam', commune: 'Matam', lat: 9.5380, lng: -13.6620, description: 'Bord de mer et marchés' },
  { id: 'kipe', name: 'Kipé (Centre)', commune: 'Ratoma', lat: 9.5850, lng: -13.6350, description: 'Prima Center, restaurants chics & résidences' },
  { id: 'taouyah', name: 'Taouyah', commune: 'Ratoma', lat: 9.5720, lng: -13.6550, description: 'Bord de mer et vie nocturne' },
  { id: 'nongo', name: 'Nongo', commune: 'Ratoma', lat: 9.6050, lng: -13.6200, description: 'Stade Général Lansana Conté, résidences' },
  { id: 'lambanyi', name: 'Lambanyi', commune: 'Ratoma', lat: 9.6250, lng: -13.6050, description: 'Commerces, écoles & résidences modernes' },
  { id: 'bambeto', name: 'Bambéto / Cosa', commune: 'Ratoma', lat: 9.5780, lng: -13.6180, description: 'Carrefour névralgique de la route Le Prince' },
  { id: 'matoto-centre', name: 'Matoto Centre', commune: 'Matoto', lat: 9.5760, lng: -13.5900, description: 'Grand marché de Matoto et gare routière' },
  { id: 'gbessia', name: 'Gbessia (Aéroport)', commune: 'Matoto', lat: 9.5630, lng: -13.6120, description: 'Aéroport International Ahmed Sékou Touré' },
  { id: 'entag', name: 'Entag / Dabompa', commune: 'Matoto', lat: 9.6100, lng: -13.5400, description: 'Sortie Sud de Conakry' },
  { id: 'sonfonia', name: 'Sonfonia', commune: 'Sonfonia', lat: 9.6380, lng: -13.5500, description: 'Université Général Lansana Conté' },
];

export const DEFAULT_QUARTIER = CONAKRY_QUARTIERS[6]; // Kipé by default

/**
 * Calcule la distance orthodromique (Haversine) en km
 * avec un multiplicateur routier réaliste (1.35x pour les détours urbains de la presqu'île de Conakry)
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Rayon de la terre en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const rawDistance = R * c;
  
  // Facteur de correction de voirie urbaine pour Conakry (Haversine x 1,3)
  const urbanFactor = 1.3;
  const finalDistance = Math.max(0.5, rawDistance * urbanFactor);
  return Number(finalDistance.toFixed(1));
}

/**
 * Calcul exact des frais de livraison selon la formule exigée:
 * Base 5 000 GNF + 3 500 GNF par km, minimum 8 000 GNF, arrondi à 500 GNF
 */
export function calculateDeliveryFeeGnf(distanceKm: number): {
  feeGnf: number;
  baseGnf: number;
  kmFeeGnf: number;
  distanceKm: number;
  appliedMinimum: boolean;
} {
  const baseGnf = 5000;
  const kmRate = 3500;
  const kmFeeGnf = Math.round(distanceKm * kmRate);
  const rawTotal = baseGnf + kmFeeGnf;
  const minGnf = 8000;
  
  const appliedMinimum = rawTotal < minGnf;
  const feeGnf = appliedMinimum ? minGnf : Math.ceil(rawTotal / 500) * 500;

  return {
    feeGnf,
    baseGnf,
    kmFeeGnf,
    distanceKm,
    appliedMinimum,
  };
}

/**
 * Estime le temps de trajet en moto à Conakry
 * Tient compte de la circulation conakrykaise
 */
export function estimateDeliveryDurationMinutes(distanceKm: number, prepTimeMin: number = 15): number {
  // Moto taxi à Conakry : moyenne 20-25 km/h avec bouchons
  const transitMinutes = Math.max(8, Math.round(distanceKm * 2.8));
  return prepTimeMin + transitMinutes;
}
