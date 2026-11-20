import React, { useEffect, useRef, useState } from 'react';
import {
  Map as GoogleMap,
  AdvancedMarker,
  useMap,
  useMapsLibrary,
  useApiLoadingStatus,
  APILoadingStatus,
} from '@vis.gl/react-google-maps';
import { CourierInfo, OrderStatus } from '../../types';
import {
  GOOGLE_MAPS_API_KEY,
  GMP_ATTRIBUTION_IDS,
  notifyIfQuotaExceeded,
} from '../../utils/mapsConfig';
import { Bike, MapPin, Store, Route as RouteIcon } from 'lucide-react';

interface ConakryMapProps {
  partnerLat: number;
  partnerLng: number;
  partnerName: string;
  clientLat: number;
  clientLng: number;
  clientAddress: string;
  courier?: CourierInfo;
  orderStatus?: OrderStatus;
  liveCourierPos?: { lat: number; lng: number } | null;
  interactive?: boolean;
}

interface RouteMetrics {
  distanceMeters: number;
  durationMillis: number;
}

function getBaseRiderProgress(orderStatus?: OrderStatus): number {
  if (orderStatus === 'submitted' || orderStatus === 'preparing') return 0.06;
  if (orderStatus === 'ready') return 0.18;
  if (orderStatus === 'delivering') return 0.58;
  if (orderStatus === 'delivered') return 1.0;
  return 0.08;
}

/**
 * Computes road route via Google Maps JavaScript SDK Routes library (`Route.computeRoutes`)
 * and renders native polylines directly on the active map.
 */
const RouteOverlay: React.FC<{
  origin: google.maps.LatLngLiteral;
  destination: google.maps.LatLngLiteral;
  onRouteComputed: (
    path: google.maps.LatLngLiteral[],
    metrics: RouteMetrics | null
  ) => void;
}> = ({ origin, destination, onRouteComputed }) => {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (!map) return;

    const bounds = new google.maps.LatLngBounds();
    bounds.extend(origin);
    bounds.extend(destination);
    map.fitBounds(bounds, 56);
  }, [map, origin.lat, origin.lng, destination.lat, destination.lng]);

  useEffect(() => {
    if (!routesLib || !map) return;

    let cancelled = false;
    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];

    const request = {
      origin,
      destination,
      travelMode: 'DRIVING',
      fields: ['path', 'distanceMeters', 'durationMillis', 'viewport'],
    };

    const routeClass = routesLib.Route as unknown as {
      computeRoutes?: (req: typeof request) => Promise<{
        routes?: Array<{
          path?: google.maps.LatLng[];
          distanceMeters?: number;
          durationMillis?: number;
          viewport?: google.maps.LatLngBounds;
          createPolylines?: () => google.maps.Polyline[];
        }>;
      }>;
    };

    if (!routeClass?.computeRoutes) return;

    routeClass
      .computeRoutes(request)
      .then(({ routes }) => {
        if (cancelled) return;
        if (!routes || routes.length === 0) {
          onRouteComputed([], null);
          return;
        }

        const primaryRoute = routes[0];
        const pathPoints: google.maps.LatLngLiteral[] = [];

        if (primaryRoute.createPolylines) {
          const newPolylines = primaryRoute.createPolylines();
          newPolylines.forEach((polyline) => {
            polyline.setOptions({
              strokeColor: '#0B7A4B',
              strokeOpacity: 0.92,
              strokeWeight: 5,
            });
            polyline.setMap(map);

            const polyPath = polyline.getPath();
            for (let i = 0; i < polyPath.getLength(); i++) {
              const pt = polyPath.getAt(i);
              pathPoints.push({ lat: pt.lat(), lng: pt.lng() });
            }
          });
          polylinesRef.current = newPolylines;
        } else if (primaryRoute.path && primaryRoute.path.length > 0) {
          primaryRoute.path.forEach((pt) => {
            pathPoints.push({ lat: pt.lat(), lng: pt.lng() });
          });
          const fallbackPoly = new google.maps.Polyline({
            path: pathPoints,
            geodesic: true,
            strokeColor: '#0B7A4B',
            strokeOpacity: 0.92,
            strokeWeight: 5,
            map,
          });
          polylinesRef.current = [fallbackPoly];
        }

        if (primaryRoute.viewport) {
          map.fitBounds(primaryRoute.viewport, 52);
        }

        onRouteComputed(pathPoints, {
          distanceMeters: primaryRoute.distanceMeters ?? 0,
          durationMillis: primaryRoute.durationMillis ?? 0,
        });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        notifyIfQuotaExceeded(err);
        onRouteComputed([], null);
      });

    return () => {
      cancelled = true;
      polylinesRef.current.forEach((p) => p.setMap(null));
      polylinesRef.current = [];
    };
  }, [
    routesLib,
    map,
    origin.lat,
    origin.lng,
    destination.lat,
    destination.lng,
    onRouteComputed,
  ]);

  return null;
};

const ConakrySvgFallback: React.FC<ConakryMapProps> = ({
  partnerLat,
  partnerLng,
  partnerName,
  clientLat,
  clientLng,
  clientAddress,
  orderStatus,
}) => {
  const minLat = Math.min(partnerLat, clientLat, 9.5) - 0.015;
  const maxLat = Math.max(partnerLat, clientLat, 9.62) + 0.015;
  const minLng = Math.min(partnerLng, clientLng, -13.72) - 0.015;
  const maxLng = Math.max(partnerLng, clientLng, -13.58) + 0.015;

  const toX = (lng: number) => 10 + ((lng - minLng) / (maxLng - minLng)) * 80;
  const toY = (lat: number) => 90 - ((lat - minLat) / (maxLat - minLat)) * 80;

  const pX = toX(partnerLng);
  const pY = toY(partnerLat);
  const cX = toX(clientLng);
  const cY = toY(clientLat);

  const riderProgress = getBaseRiderProgress(orderStatus);
  const midX = (pX + cX) / 2 + (cY > pY ? -6 : 6);
  const midY = (pY + cY) / 2 - 4;
  const pathD = `M ${pX} ${pY} Q ${midX} ${midY} ${cX} ${cY}`;
  const t = riderProgress;
  const riderX = (1 - t) * (1 - t) * pX + 2 * (1 - t) * t * midX + t * t * cX;
  const riderY = (1 - t) * (1 - t) * pY + 2 * (1 - t) * t * midY + t * t * cY;

  return (
    <div className="relative w-full h-full min-h-[240px] rounded-2xl overflow-hidden bg-[#061A12] border border-[#164734] shadow-inner select-none">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#072217" />
            <stop offset="100%" stopColor="#03120C" />
          </linearGradient>
          <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0E3323" />
            <stop offset="100%" stopColor="#082016" />
          </linearGradient>
          <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFB81F" />
            <stop offset="100%" stopColor="#0B7A4B" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#oceanGrad)" />
        <path
          d="M 5 95 C 15 85, 25 70, 35 60 C 45 50, 60 40, 85 25 C 95 20, 100 15, 100 0 L 100 100 L 0 100 Z"
          fill="url(#landGrad)"
          stroke="#19523B"
          strokeWidth={0.5}
        />
        <path
          d="M 12 88 Q 38 65 85 28"
          fill="none"
          stroke="#216B4E"
          strokeWidth={1.2}
          strokeDasharray="1 1"
          opacity="0.7"
        />
        <path
          d={pathD}
          fill="none"
          stroke="url(#routeGrad)"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeDasharray="3 1.5"
        />
        <circle cx={pX} cy={pY} r="3" fill="#0B7A4B" stroke="#ffffff" strokeWidth={0.8} />
        <circle cx={cX} cy={cY} r="3" fill="#ef4444" stroke="#ffffff" strokeWidth={0.8} />
        {orderStatus !== 'delivered' && (
          <g transform={`translate(${riderX}, ${riderY})`}>
            <circle cx="0" cy="0" r="4.5" fill="#FFB81F" opacity="0.3" className="animate-ping" />
            <circle cx="0" cy="0" r="3.2" fill="#FFB81F" stroke="#000" strokeWidth={0.7} />
          </g>
        )}
      </svg>

      <div className="absolute top-3 left-3 bg-[#0B2B1E]/90 backdrop-blur-md border border-[#19523B] rounded-xl px-2.5 py-1.5 text-xs text-white shadow-lg flex items-center gap-2 max-w-[60%]">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
        <span className="font-semibold text-[11px] truncate">Réseau Conakry GPS Live</span>
      </div>

      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 bg-[#0B2B1E]/90 backdrop-blur-md border border-[#19523B] rounded-xl px-3 py-2 text-xs text-white">
        <div className="flex items-center gap-1.5 truncate max-w-[35%] min-w-0">
          <Store className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate text-[11px] text-emerald-100">{partnerName}</span>
        </div>
        <div className="flex items-center gap-1 text-[#FFB81F] font-bold text-[11px] shrink-0">
          <Bike className="w-3.5 h-3.5 animate-bounce" />
          <span>{orderStatus === 'delivering' ? 'En route' : orderStatus === 'ready' ? 'Départ' : 'Préparation'}</span>
        </div>
        <div className="flex items-center gap-1.5 truncate max-w-[35%] min-w-0 justify-end">
          <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span className="truncate text-[11px] text-emerald-100">{clientAddress}</span>
        </div>
      </div>
    </div>
  );
};

const GoogleConakryMapInner: React.FC<ConakryMapProps> = (props) => {
  const {
    partnerLat,
    partnerLng,
    partnerName,
    clientLat,
    clientLng,
    clientAddress,
    courier,
    orderStatus,
    liveCourierPos,
    interactive = true,
  } = props;

  const loadingStatus = useApiLoadingStatus();
  const [routePath, setRoutePath] = useState<google.maps.LatLngLiteral[]>([]);
  const [routeMetrics, setRouteMetrics] = useState<RouteMetrics | null>(null);
  const [liveProgressBoost, setLiveProgressBoost] = useState(0);

  // Subtle movement along the real route while order is in 'delivering'
  useEffect(() => {
    if (orderStatus !== 'delivering' || liveCourierPos) {
      setLiveProgressBoost(0);
      return;
    }
    const timer = setInterval(() => {
      setLiveProgressBoost((prev) => (prev >= 0.25 ? 0 : prev + 0.025));
    }, 2500);
    return () => clearInterval(timer);
  }, [orderStatus, liveCourierPos]);

  const handleRouteComputed = React.useCallback(
    (path: google.maps.LatLngLiteral[], metrics: RouteMetrics | null) => {
      setRoutePath(path);
      setRouteMetrics(metrics);
    },
    []
  );

  if (
    loadingStatus === APILoadingStatus.FAILED ||
    loadingStatus === APILoadingStatus.AUTH_FAILURE
  ) {
    return <ConakrySvgFallback {...props} />;
  }

  const origin: google.maps.LatLngLiteral = { lat: partnerLat, lng: partnerLng };
  const destination: google.maps.LatLngLiteral = { lat: clientLat, lng: clientLng };

  let riderPosition: google.maps.LatLngLiteral;
  if (liveCourierPos) {
    riderPosition = liveCourierPos;
  } else {
    const progress = Math.min(
      0.96,
      getBaseRiderProgress(orderStatus) + liveProgressBoost
    );
    if (routePath.length >= 2) {
      const idx = Math.min(
        routePath.length - 1,
        Math.max(0, Math.round(progress * (routePath.length - 1)))
      );
      riderPosition = routePath[idx];
    } else {
      riderPosition = {
        lat: partnerLat + (clientLat - partnerLat) * progress,
        lng: partnerLng + (clientLng - partnerLng) * progress,
      };
    }
  }

  const distanceKmDisplay = routeMetrics?.distanceMeters
    ? (routeMetrics.distanceMeters / 1000).toFixed(1)
    : null;
  const durationMinDisplay = routeMetrics?.durationMillis
    ? Math.max(1, Math.round(routeMetrics.durationMillis / 60000))
    : null;

  return (
    <div className="relative w-full h-full min-h-[240px] rounded-2xl overflow-hidden bg-white border border-[#E2ECE7] dark:border-[#1E3B2D] shadow-xs">
      <GoogleMap
        mapId="DEMO_MAP_ID"
        defaultCenter={{
          lat: (partnerLat + clientLat) / 2,
          lng: (partnerLng + clientLng) / 2,
        }}
        defaultZoom={13}
        gestureHandling={interactive ? 'greedy' : 'cooperative'}
        disableDefaultUI={true}
        zoomControl={interactive}
        internalUsageAttributionIds={GMP_ATTRIBUTION_IDS}
        style={{ width: '100%', height: '100%' }}
      >
        <RouteOverlay
          origin={origin}
          destination={destination}
          onRouteComputed={handleRouteComputed}
        />

        {/* Partner / Pickup AdvancedMarker */}
        <AdvancedMarker position={origin} title={partnerName}>
          <div className="flex flex-col items-center">
            <div className="px-2 py-0.5 mb-1 rounded-full bg-white text-[#0B2B1E] border border-[#D4E9DD] shadow-md text-[10px] font-bold max-w-[130px] truncate">
              {partnerName}
            </div>
            <div className="w-8 h-8 rounded-full bg-[#0B7A4B] border-2 border-white shadow-lg flex items-center justify-center text-white">
              <Store className="w-4 h-4" />
            </div>
          </div>
        </AdvancedMarker>

        {/* Client Destination AdvancedMarker */}
        <AdvancedMarker position={destination} title={clientAddress}>
          <div className="flex flex-col items-center">
            <div className="px-2 py-0.5 mb-1 rounded-full bg-white text-[#0B2B1E] border border-rose-200 shadow-md text-[10px] font-bold max-w-[130px] truncate">
              {clientAddress}
            </div>
            <div className="w-8 h-8 rounded-full bg-rose-600 border-2 border-white shadow-lg flex items-center justify-center text-white">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
        </AdvancedMarker>

        {/* Live Courier AdvancedMarker */}
        {orderStatus !== 'delivered' && (
          <AdvancedMarker
            position={riderPosition}
            title={courier ? `${courier.name} (Motard Soneya)` : 'Motard Soneya'}
          >
            <div className="relative flex items-center justify-center">
              <span className="absolute w-11 h-11 rounded-full bg-[#FFB81F]/40 animate-ping" />
              <div className="relative w-9 h-9 rounded-full bg-[#FFB81F] border-2 border-[#0B2B1E] shadow-xl flex items-center justify-center text-[#0B2B1E]">
                <Bike className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
          </AdvancedMarker>
        )}
      </GoogleMap>

      {/* Top Left Live Google Maps HUD */}
      <div className="absolute top-3 left-3 bg-white/95 dark:bg-[#0C1913]/95 backdrop-blur-md border border-[#D4E9DD] dark:border-[#1E3B2D] rounded-xl px-2.5 py-1.5 text-xs text-[#0B2B1E] dark:text-white shadow-md flex items-center gap-2 max-w-[68%] pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-[#0B7A4B] animate-pulse shrink-0" />
        <span className="font-bold text-[11px] truncate">
          {distanceKmDisplay && durationMinDisplay
            ? `Google Maps · ${distanceKmDisplay} km (~${durationMinDisplay} min)`
            : 'Google Maps · Conakry Live'}
        </span>
      </div>

      {routeMetrics && (
        <div className="hidden sm:flex absolute top-3 right-3 bg-white/95 dark:bg-[#0C1913]/95 backdrop-blur-md border border-[#D4E9DD] dark:border-[#1E3B2D] rounded-xl px-2.5 py-1.5 text-[11px] font-bold text-[#0B7A4B] dark:text-[#FFB81F] shadow-md items-center gap-1 pointer-events-none">
          <RouteIcon className="w-3.5 h-3.5" />
          <span>Itinéraire routier</span>
        </div>
      )}

      {/* Bottom Legend Bar */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 bg-white/95 dark:bg-[#0C1913]/95 backdrop-blur-md border border-[#D4E9DD] dark:border-[#1E3B2D] rounded-xl px-3 py-2 text-xs text-[#0B2B1E] dark:text-white shadow-md pointer-events-none">
        <div className="flex items-center gap-1.5 truncate max-w-[35%] min-w-0">
          <Store className="w-3.5 h-3.5 text-[#0B7A4B] shrink-0" />
          <span className="truncate text-[11px] font-semibold">{partnerName}</span>
        </div>
        <div className="flex items-center gap-1 text-[#0B7A4B] dark:text-[#FFB81F] font-bold text-[11px] shrink-0">
          <Bike className="w-3.5 h-3.5" />
          <span>
            {orderStatus === 'delivered'
              ? 'Arrivé'
              : orderStatus === 'delivering'
              ? 'En route'
              : orderStatus === 'ready'
              ? 'Départ'
              : 'Préparation'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 truncate max-w-[35%] min-w-0 justify-end">
          <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          <span className="truncate text-[11px] font-semibold">{clientAddress}</span>
        </div>
      </div>
    </div>
  );
};

export const ConakryMap: React.FC<ConakryMapProps> = (props) => {
  if (!GOOGLE_MAPS_API_KEY) {
    return <ConakrySvgFallback {...props} />;
  }
  return <GoogleConakryMapInner {...props} />;
};
