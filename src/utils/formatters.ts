/**
 * Formate un montant en Francs Guinéens (GNF)
 * Ex: 25000 -> "25 000 GNF"
 */
export function formatGnf(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '0 GNF';
  const rounded = Math.round(amount);
  return `${rounded.toLocaleString('fr-FR')} GNF`;
}

/**
 * Formate un numéro de téléphone guinéen
 * Format attendu : 62X XX XX XX ou 66X XX XX XX
 */
export function formatGuineanPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 9) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)}`;
  }
  return phone;
}

/**
 * Formate une heure française locale
 */
export function formatTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}
