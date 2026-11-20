import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { useApp } from '../../context/AppContext';
import { CONAKRY_QUARTIERS, calculateDistanceKm } from '../../utils/geo';
import {
  GOOGLE_MAPS_API_KEY,
  CONAKRY_CENTER,
  notifyIfQuotaExceeded,
} from '../../utils/mapsConfig';
import { MapPin, Navigation, Check, X, Search, Loader2 } from 'lucide-react';
import { Quartier } from '../../types';

interface NeighborhoodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GooglePlacesSuggestionsBoxProps {
  query: string;
  onSelectPlace: (coords: { lat: number; lng: number; label: string; name: string }) => void;
}

const GooglePlacesSuggestionsBox: React.FC<GooglePlacesSuggestionsBoxProps> = ({
  query,
  onSelectPlace,
}) => {
  const placesLib = useMapsLibrary('places');
  const sessionTokenRef =
    useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompleteSuggestion[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const resetSession = useCallback(() => {
    sessionTokenRef.current = null;
    setSuggestions([]);
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (!placesLib || trimmed.length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    const timer = setTimeout(() => {
      const { AutocompleteSessionToken, AutocompleteSuggestion } = placesLib;
      if (!sessionTokenRef.current) {
        sessionTokenRef.current = new AutocompleteSessionToken();
      }

      setIsLoading(true);
      const request: google.maps.places.AutocompleteRequest = {
        input: trimmed,
        sessionToken: sessionTokenRef.current,
        includedRegionCodes: ['gn'],
        locationBias: {
          center: CONAKRY_CENTER,
          radius: 30000,
        },
      };

      AutocompleteSuggestion.fetchAutocompleteSuggestions(request)
        .then((res) => {
          if (cancelled) return;
          setSuggestions(res.suggestions ?? []);
          setIsLoading(false);
        })
        .catch((err: unknown) => {
          if (cancelled) return;
          notifyIfQuotaExceeded(err);
          setSuggestions([]);
          setIsLoading(false);
        });
    }, 280);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [placesLib, query]);

  const handleSelectSuggestion = async (
    suggestion: google.maps.places.AutocompleteSuggestion
  ) => {
    if (!placesLib || !suggestion.placePrediction) return;
    try {
      const place = suggestion.placePrediction.toPlace();
      await place.fetchFields({
        fields: ['displayName', 'formattedAddress', 'location'],
      });
      if (place.location) {
        const lat = place.location.lat();
        const lng = place.location.lng();
        const name =
          place.displayName ||
          suggestion.placePrediction.mainText?.text ||
          'Adresse Conakry';
        const label =
          place.formattedAddress ||
          suggestion.placePrediction.text.text ||
          name;
        resetSession();
        onSelectPlace({ lat, lng, label, name });
      }
    } catch (err) {
      notifyIfQuotaExceeded(err);
    }
  };

  if (query.trim().length < 2) return null;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#0B7A4B] dark:text-[#FFB81F]">
        <span>Adresses Google Maps (Conakry)</span>
        {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
      </div>

      {suggestions.length > 0 && (
        <div className="space-y-1 rounded-xl border border-[#D4E9DD] dark:border-[#1E3B2D] bg-emerald-50/30 dark:bg-[#10231B] p-1.5">
          {suggestions.map((suggestion, idx) => {
            const mainText =
              suggestion.placePrediction?.mainText?.text ||
              suggestion.placePrediction?.text.text ||
              '';
            const secondaryText =
              suggestion.placePrediction?.secondaryText?.text || '';
            return (
              <button
                key={suggestion.placePrediction?.placeId || idx}
                type="button"
                onClick={() => void handleSelectSuggestion(suggestion)}
                className="w-full flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-white dark:hover:bg-[#0C1913] text-left transition cursor-pointer min-h-[44px]"
              >
                <MapPin className="w-4 h-4 text-[#0B7A4B] dark:text-[#FFB81F] shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-[#0B2B1E] dark:text-white truncate">
                    {mainText}
                  </div>
                  {secondaryText && (
                    <div className="text-[11px] text-[#2F4F42] dark:text-emerald-200/70 truncate">
                      {secondaryText}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const NeighborhoodModal: React.FC<NeighborhoodModalProps> = ({ isOpen, onClose }) => {
  const { location, setLocation, requestGPSLocation, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectQuartier = (q: Quartier) => {
    setLocation({
      quartier: q,
      isGPS: false,
      addressLabel: `${q.name}, Commune de ${q.commune}`,
    });
    onClose();
  };

  const handleSelectGooglePlace = ({
    lat,
    lng,
    label,
    name,
  }: {
    lat: number;
    lng: number;
    label: string;
    name: string;
  }) => {
    let closest = CONAKRY_QUARTIERS[0];
    let minDist = Infinity;
    CONAKRY_QUARTIERS.forEach((q) => {
      const d = calculateDistanceKm(lat, lng, q.lat, q.lng);
      if (d < minDist) {
        minDist = d;
        closest = q;
      }
    });

    setLocation({
      quartier: {
        ...closest,
        lat,
        lng,
        name,
      },
      isGPS: false,
      addressLabel: label,
    });
    showToast('Adresse Google Maps sélectionnée', label, 'success');
    onClose();
  };

  const handleUseGPS = async () => {
    setGpsLoading(true);
    setGpsError(null);
    const success = await requestGPSLocation();
    setGpsLoading(false);
    if (success) {
      onClose();
    } else {
      setGpsError('Position GPS inaccessible ou désactivée. Veuillez choisir votre quartier ci-dessous.');
    }
  };

  const filteredQuartiers = CONAKRY_QUARTIERS.filter(
    (q) =>
      q.name.toLowerCase().includes(search.toLowerCase()) ||
      q.commune.toLowerCase().includes(search.toLowerCase()) ||
      (q.description && q.description.toLowerCase().includes(search.toLowerCase()))
  );

  const communes = Array.from(new Set(filteredQuartiers.map((q) => q.commune)));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#0B2B1E]/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md max-h-[88dvh] flex flex-col rounded-t-3xl sm:rounded-2xl bg-white dark:bg-[#0C1913] shadow-2xl border border-[#E2ECE7] dark:border-[#1E3B2D] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E2ECE7] dark:border-[#1E3B2D] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#0B7A4B] dark:text-[#FFB81F] border border-[#D4E9DD] dark:border-[#1E3B2D] flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-heading font-bold text-base text-[#0B2B1E] dark:text-white truncate">
                Zone de livraison à Conakry
              </h3>
              <p className="text-xs text-[#2F4F42] dark:text-emerald-200/70 truncate">
                Calcul précis des frais selon votre position
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="w-9 h-9 rounded-full text-[#2F4F42] hover:text-[#0B2B1E] hover:bg-emerald-50 dark:text-emerald-200/70 dark:hover:text-white flex items-center justify-center shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* GPS Quick Action */}
        <div className="p-4 bg-white dark:bg-[#10231B]/60 border-b border-[#E2ECE7] dark:border-[#1E3B2D]">
          <button
            onClick={handleUseGPS}
            disabled={gpsLoading}
            className="w-full flex items-center justify-between gap-2 p-3 rounded-xl bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] shadow-xs hover:border-[#0B7A4B] transition group text-left cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#0B7A4B] text-white flex items-center justify-center group-hover:scale-105 transition shadow-xs shrink-0">
                <Navigation className={`w-4 h-4 ${gpsLoading ? 'animate-spin' : ''}`} />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-sm text-[#0B2B1E] dark:text-white flex flex-wrap items-center gap-1.5">
                  <span className="truncate">Utiliser ma position GPS exacte</span>
                  {location.isGPS && (
                    <span className="text-[10px] bg-[#0B7A4B] text-white font-semibold px-2 py-0.5 rounded-full">
                      Actif
                    </span>
                  )}
                </div>
                <div className="text-xs text-[#2F4F42] dark:text-emerald-200/70 truncate">
                  {gpsLoading ? 'Localisation par satellite en cours...' : 'Précision maximale pour le coursier'}
                </div>
              </div>
            </div>
            <div className="text-xs font-semibold text-[#0B7A4B] dark:text-[#FFB81F] shrink-0">
              Localiser
            </div>
          </button>

          {gpsError && (
            <p className="mt-2 text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/40 p-2 rounded-lg border border-rose-200 dark:border-rose-900">
              {gpsError}
            </p>
          )}
        </div>

        {/* Search */}
        <div className="p-3 border-b border-[#E2ECE7] dark:border-[#1E3B2D]">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#0B7A4B]" />
            <input
              type="text"
              placeholder="Rechercher un quartier ou une adresse Google Maps..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] focus:border-[#0B7A4B] focus:outline-none text-[#0B2B1E] dark:text-white text-xs font-medium placeholder-[#5C7A6E]"
            />
          </div>
        </div>

        {/* Google Places Suggestions + Quartiers list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {GOOGLE_MAPS_API_KEY && (
            <GooglePlacesSuggestionsBox
              query={search}
              onSelectPlace={handleSelectGooglePlace}
            />
          )}

          {communes.map((commune) => (
            <div key={commune} className="space-y-1.5">
              <div className="text-xs font-bold uppercase tracking-wider text-[#5C7A6E] dark:text-emerald-200/60">
                Commune de {commune}
              </div>
              <div className="space-y-1">
                {filteredQuartiers
                  .filter((q) => q.commune === commune)
                  .map((q) => {
                    const isSelected = !location.isGPS && location.quartier.id === q.id;
                    return (
                      <button
                        key={q.id}
                        onClick={() => handleSelectQuartier(q)}
                        className={`w-full flex items-center justify-between min-h-[44px] p-2.5 rounded-xl text-left transition cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50/70 dark:bg-emerald-950/40 text-[#0B7A4B] dark:text-white font-bold border border-[#0B7A4B]/30 dark:border-[#1E3B2D]'
                            : 'hover:bg-emerald-50/40 dark:hover:bg-[#13291F] text-[#0B2B1E] dark:text-emerald-100'
                        }`}
                      >
                        <div>
                          <div className="text-sm font-medium">{q.name}</div>
                          {q.description && (
                            <div className="text-xs text-[#2F4F42] dark:text-emerald-200/70">
                              {q.description}
                            </div>
                          )}
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-[#0B7A4B] dark:text-[#FFB81F] shrink-0" />
                        )}
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}

          {filteredQuartiers.length === 0 && (
            <div className="text-center py-6 text-sm text-[#5C7A6E]">
              Aucun quartier prédéfini trouvé pour « {search} »
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
