export const GOOGLE_MAPS_API_KEY: string =
  (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) ||
  (typeof __GOOGLE_MAPS_API_KEY__ !== 'undefined' ? __GOOGLE_MAPS_API_KEY__ : '') ||
  '';

export const GMP_ATTRIBUTION_IDS = ['gmp_mcp_codeassist_v1_aistudio'];

export const CONAKRY_CENTER: google.maps.LatLngLiteral = {
  lat: 9.555,
  lng: -13.655,
};

/**
 * Inspects errors returned by Maps JS SDK promise calls (Places API New, Routes API)
 * and fires the top-level 'gmp-quota-exceeded' event only on true quota/rate-limit errors.
 */
export function notifyIfQuotaExceeded(err: unknown): boolean {
  if (!err) return false;
  const errObj = err as {
    status?: string | number;
    code?: string | number;
    message?: string;
  };
  const statusStr = String(errObj.status ?? errObj.code ?? '').toUpperCase();
  const msg = String(errObj.message ?? err).toUpperCase();

  const isQuotaError =
    statusStr === '429' ||
    statusStr === 'RESOURCE_EXHAUSTED' ||
    statusStr === 'OVER_QUERY_LIMIT' ||
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.includes('OVER_QUERY_LIMIT') ||
    msg.includes('OVERQUOTAMAPERROR') ||
    msg.includes('QUOTAEXCEEDEDERROR') ||
    msg.includes('QUOTA EXCEEDED');

  if (isQuotaError) {
    window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
    return true;
  }
  return false;
}
