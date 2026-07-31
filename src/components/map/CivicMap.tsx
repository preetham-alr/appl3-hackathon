/**
 * Krithiq AI - Interactive Civic Map Component
 * Live Satellite, Multi-Layer Toggles, Clustering, Route Impact Analyzer, Timeline Filters, and Nearby Government Assets
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { useApp } from '../../context/AppContext';
import { MapMarker, GovernmentAsset } from '../../types';
import { initialGovernmentAssets } from '../../data/mockData';
import {
  MapPin,
  Layers,
  Flame,
  Search,
  Navigation,
  AlertTriangle,
  Compass,
  CheckCircle2,
  Globe,
  Maximize2,
  Sparkles,
  CloudRain,
  Activity,
  Building2,
  ShieldAlert,
  Calendar,
  Route,
  Share2,
  PhoneCall,
  X,
  RotateCw,
  Eye,
  Info,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Check,
  Copy,
} from 'lucide-react';

type MapTileMode = 'satellite' | 'roads' | 'terrain' | 'dark';
type TimelineFilter = 'all' | 'today' | 'last_7' | 'last_30';

interface PresetRoute {
  id: string;
  name: string;
  origin: string;
  destination: string;
  coords: [number, number][];
  detourCoords: [number, number][];
}

const PRESET_ROUTES: PresetRoute[] = [
  {
    id: 'route_1',
    name: 'Cyber Towers → Inorbit Mall Corridor',
    origin: 'Cyber Towers Junction',
    destination: 'Inorbit Mall Entrance',
    coords: [
      [17.4504, 78.3811],
      [17.448, 78.386],
      [17.4435, 78.3921],
    ],
    detourCoords: [
      [17.4504, 78.3811],
      [17.4538, 78.385],
      [17.4552, 78.3892],
      [17.4435, 78.3921],
    ],
  },
  {
    id: 'route_2',
    name: 'Madhapur Metro → Kondapur Pharmacy Belt',
    origin: 'Madhapur Metro Station',
    destination: 'Kondapur Main Pharmacy Belt',
    coords: [
      [17.4455, 78.3888],
      [17.452, 78.384],
      [17.4591, 78.3822],
    ],
    detourCoords: [
      [17.4455, 78.3888],
      [17.4468, 78.3789],
      [17.4591, 78.3822],
    ],
  },
  {
    id: 'route_3',
    name: 'Durgam Cheruvu → HITEC City Road 2',
    origin: 'Durgam Cheruvu Metro Pillar 12',
    destination: 'HITEC City Road 2 Water Supply Line',
    coords: [
      [17.4421, 78.3845],
      [17.4468, 78.3789],
      [17.4504, 78.3811],
    ],
    detourCoords: [
      [17.4421, 78.3845],
      [17.4435, 78.3921],
      [17.4504, 78.3811],
    ],
  },
];

export const CivicMap: React.FC = () => {
  const { mapMarkers, setReportingModalOpen, setActiveTab, theme } = useApp();
  const isLight = theme === 'light';

  // Core Map Tile & Layer States
  const googleMapsApiKey = (process.env as any).GOOGLE_MAPS_PLATFORM_KEY || '';
  const [mapEngine, setMapEngine] = useState<'google' | 'leaflet'>('leaflet');
  const [mapTileMode, setMapTileMode] = useState<MapTileMode>('satellite');
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showTraffic, setShowTraffic] = useState(false);
  const [showWeather, setShowWeather] = useState(false);
  const [showGovServices, setShowGovServices] = useState(true);

  // Filter States
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedTimeline, setSelectedTimeline] = useState<TimelineFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Route Impact Mode State
  const [isRouteImpactMode, setIsRouteImpactMode] = useState(false);
  const [activeRouteId, setActiveRouteId] = useState<string>('route_1');
  const [isUsingDetour, setIsUsingDetour] = useState(false);

  // UI Interactive States
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(mapMarkers[0] || null);
  const [selectedGovAsset, setSelectedGovAsset] = useState<GovernmentAsset | null>(null);
  const [is3dView, setIs3dView] = useState(false);
  const [isLegendOpen, setIsLegendOpen] = useState(true);
  const [isLayerDrawerOpen, setIsLayerDrawerOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentZoom, setCurrentZoom] = useState<number>(14);

  // Map DOM Refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markerGroupRef = useRef<L.LayerGroup | null>(null);
  const govMarkerGroupRef = useRef<L.LayerGroup | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const trafficLayerRef = useRef<L.LayerGroup | null>(null);

  // Tile Providers
  const tileUrls: Record<MapTileMode, string> = {
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    roads: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    terrain: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  };

  const tileAttributions: Record<MapTileMode, string> = {
    satellite: 'Tiles © Esri World Imagery Stream',
    roads: '© OpenStreetMap contributors',
    terrain: 'Esri World Topographic Map',
    dark: '© CartoDB Dark Base',
  };

  const filterCategories = [
    { id: 'all', label: 'All Issues' },
    { id: 'potholes_roads', label: 'Roads & Potholes' },
    { id: 'garbage_waste', label: 'Garbage & Waste' },
    { id: 'electricity_lights', label: 'Streetlights' },
    { id: 'water_sewerage', label: 'Water & Drains' },
    { id: 'public_safety', label: 'Safety Zones' },
    { id: 'counterfeit_fraud', label: 'Fraud Alerts' },
  ];

  // Helper Toast Trigger
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered Markers Logic
  const filteredMarkers = useMemo(() => {
    return mapMarkers.filter((m) => {
      // Category filter
      if (selectedCategoryFilter !== 'all' && m.type !== selectedCategoryFilter) return false;

      // Search query filter
      if (
        searchQuery &&
        !m.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !m.address.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Timeline filter
      if (selectedTimeline !== 'all') {
        const markerDateStr = m.createdDate || '2026-07-30';
        const markerDate = new Date(markerDateStr).getTime();
        const now = new Date('2026-07-30').getTime();
        const diffDays = (now - markerDate) / (1000 * 3600 * 24);

        if (selectedTimeline === 'today' && diffDays > 1) return false;
        if (selectedTimeline === 'last_7' && diffDays > 7) return false;
        if (selectedTimeline === 'last_30' && diffDays > 30) return false;
      }

      return true;
    });
  }, [mapMarkers, selectedCategoryFilter, searchQuery, selectedTimeline]);

  // Active Preset Route
  const activePresetRoute = useMemo(() => {
    return PRESET_ROUTES.find((r) => r.id === activeRouteId) || PRESET_ROUTES[0];
  }, [activeRouteId]);

  // Issues along active route
  const hazardsOnRoute = useMemo(() => {
    if (!isRouteImpactMode) return [];
    // Distance check to route points
    const currentCoords = isUsingDetour ? activePresetRoute.detourCoords : activePresetRoute.coords;
    return filteredMarkers.filter((marker) => {
      const mLat = marker.lat;
      const mLng = marker.lng;
      return currentCoords.some(([rLat, rLng]) => {
        const dist = Math.sqrt(Math.pow(mLat - rLat, 2) + Math.pow(mLng - rLng, 2));
        return dist < 0.008; // ~800 meters corridor
      });
    });
  }, [filteredMarkers, isRouteImpactMode, activePresetRoute, isUsingDetour]);

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialMap = L.map(mapContainerRef.current, {
        center: [17.4486, 78.3908], // Cyber Towers, Madhapur, Hyderabad
        zoom: 14,
        zoomControl: false,
      });

      L.control.zoom({ position: 'topright' }).addTo(initialMap);

      // Tile Layer
      const tileLayer = L.tileLayer(tileUrls[mapTileMode], {
        maxZoom: 19,
        attribution: tileAttributions[mapTileMode],
      }).addTo(initialMap);

      tileLayerRef.current = tileLayer;

      // Layer Groups
      const markerGroup = L.layerGroup().addTo(initialMap);
      markerGroupRef.current = markerGroup;

      const govGroup = L.layerGroup().addTo(initialMap);
      govMarkerGroupRef.current = govGroup;

      const trafficGroup = L.layerGroup().addTo(initialMap);
      trafficLayerRef.current = trafficGroup;

      // Zoom listener for clustering
      initialMap.on('zoomend', () => {
        setCurrentZoom(initialMap.getZoom());
      });

      mapInstanceRef.current = initialMap;

      // Ensure proper canvas sizing in container
      setTimeout(() => {
        initialMap.invalidateSize();
      }, 150);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapEngine]);

  // 2. Update Map Base Tile Layer when mode changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const newTileLayer = L.tileLayer(tileUrls[mapTileMode], {
      maxZoom: 19,
      attribution: tileAttributions[mapTileMode],
    });

    newTileLayer.addTo(mapInstanceRef.current);
    tileLayerRef.current = newTileLayer;
  }, [mapTileMode]);

  // 3. Render / Update Civic Issue Markers with Smart Clustering
  useEffect(() => {
    if (!mapInstanceRef.current || !markerGroupRef.current) return;

    markerGroupRef.current.clearLayers();

    // Check if zoomed out for smart clustering (zoom <= 13)
    if (currentZoom <= 13 && filteredMarkers.length > 3) {
      // Create a simplified cluster badge
      const avgLat = filteredMarkers.reduce((acc, m) => acc + m.lat, 0) / filteredMarkers.length;
      const avgLng = filteredMarkers.reduce((acc, m) => acc + m.lng, 0) / filteredMarkers.length;

      const clusterIcon = L.divIcon({
        className: 'custom-cluster-icon',
        html: `
          <div style="
            background: linear-gradient(135deg, #f97316, #ef4444);
            color: #ffffff;
            padding: 8px 14px;
            border-radius: 9999px;
            font-weight: 900;
            font-size: 12px;
            display: flex;
            align-items: center;
            gap: 6px;
            box-shadow: 0 0 25px rgba(239, 68, 68, 0.7), 0 0 0 4px rgba(255, 255, 255, 0.2);
            cursor: pointer;
            border: 2px solid #ffffff;
            animation: pulse 2s infinite;
          ">
            <span>⚡ ${filteredMarkers.length} Issues Cluster</span>
          </div>
        `,
        iconSize: [140, 36],
        iconAnchor: [70, 18],
      });

      const clusterMarker = L.marker([avgLat, avgLng], { icon: clusterIcon });
      clusterMarker.on('click', () => {
        mapInstanceRef.current?.flyTo([avgLat, avgLng], 15, { duration: 1.2 });
        triggerToast('Zoomed in to show individual report markers!');
      });

      markerGroupRef.current.addLayer(clusterMarker);
      return;
    }

    // Render individual issue markers
    filteredMarkers.forEach((marker) => {
      const isSelected = selectedMarker?.id === marker.id;
      const isRouteHazard = hazardsOnRoute.some((h) => h.id === marker.id);

      const badgeColor =
        marker.severity === 'Critical'
          ? '#ef4444'
          : marker.severity === 'High'
          ? '#f97316'
          : '#14b8a6';

      const customIcon = L.divIcon({
        className: 'custom-map-pin-icon',
        html: `
          <div style="
            background: ${isRouteHazard ? '#a855f7' : badgeColor};
            color: #ffffff;
            padding: 6px 12px;
            border-radius: 14px;
            font-weight: 900;
            font-size: 11px;
            display: flex;
            align-items: center;
            gap: 5px;
            box-shadow: 0 10px 20px rgba(0,0,0,0.6), 0 0 16px ${isRouteHazard ? '#a855f7' : badgeColor}aa;
            border: ${isSelected ? '3px solid #38bdf8' : '2px solid #ffffff'};
            cursor: pointer;
            transform: ${isSelected ? 'scale(1.25)' : 'scale(1)'};
            transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          ">
            <span>${isRouteHazard ? '⚡' : '📍'} ${marker.title.slice(0, 18)}${marker.title.length > 18 ? '...' : ''}</span>
          </div>
        `,
        iconSize: [140, 34],
        iconAnchor: [70, 17],
      });

      const leafletMarker = L.marker([marker.lat, marker.lng], { icon: customIcon });

      leafletMarker.on('click', () => {
        setSelectedGovAsset(null);
        setSelectedMarker(marker);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([marker.lat, marker.lng], 16, { duration: 1.0 });
        }
      });

      markerGroupRef.current?.addLayer(leafletMarker);
    });
  }, [filteredMarkers, selectedMarker, currentZoom, hazardsOnRoute]);

  // 4. Render / Update Government Asset Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !govMarkerGroupRef.current) return;

    govMarkerGroupRef.current.clearLayers();

    if (!showGovServices) return;

    initialGovernmentAssets.forEach((asset) => {
      const isSelected = selectedGovAsset?.id === asset.id;

      const govIcon = L.divIcon({
        className: 'custom-gov-asset-icon',
        html: `
          <div style="
            background: #0284c7;
            color: #ffffff;
            padding: 6px 10px;
            border-radius: 12px;
            font-weight: 800;
            font-size: 10px;
            display: flex;
            align-items: center;
            gap: 4px;
            box-shadow: 0 8px 16px rgba(0,0,0,0.5), 0 0 12px #38bdf8aa;
            border: ${isSelected ? '3px solid #facc15' : '2px solid #e0f2fe'};
            cursor: pointer;
            transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'};
            transition: all 0.2s ease;
          ">
            <span>${asset.icon} ${asset.name.split(' ')[0]} ${asset.name.split(' ')[1] || ''}</span>
          </div>
        `,
        iconSize: [120, 30],
        iconAnchor: [60, 15],
      });

      const leafletGovMarker = L.marker([asset.lat, asset.lng], { icon: govIcon });

      leafletGovMarker.on('click', () => {
        setSelectedMarker(null);
        setSelectedGovAsset(asset);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([asset.lat, asset.lng], 16, { duration: 1.0 });
        }
      });

      govMarkerGroupRef.current?.addLayer(leafletGovMarker);
    });
  }, [showGovServices, selectedGovAsset]);

  // 5. Render Route Impact Polyline Overlay
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (routePolylineRef.current) {
      mapInstanceRef.current.removeLayer(routePolylineRef.current);
      routePolylineRef.current = null;
    }

    if (!isRouteImpactMode) return;

    const pathCoords = isUsingDetour ? activePresetRoute.detourCoords : activePresetRoute.coords;

    const polyline = L.polyline(pathCoords, {
      color: isUsingDetour ? '#10b981' : '#f43f5e',
      weight: 6,
      opacity: 0.9,
      dashArray: isUsingDetour ? '10, 10' : undefined,
    }).addTo(mapInstanceRef.current);

    routePolylineRef.current = polyline;

    // Fit map bounds to polyline
    mapInstanceRef.current.fitBounds(polyline.getBounds(), { padding: [50, 50] });
  }, [isRouteImpactMode, activePresetRoute, isUsingDetour]);

  // 6. Render Traffic Overlay Simulation Lines
  useEffect(() => {
    if (!mapInstanceRef.current || !trafficLayerRef.current) return;

    trafficLayerRef.current.clearLayers();

    if (!showTraffic) return;

    // Sample traffic corridors around Madhapur
    const trafficCorridors = [
      {
        coords: [
          [17.4504, 78.3811],
          [17.448, 78.386],
        ],
        color: '#ef4444', // Heavy Congestion (Red)
        label: 'Heavy Congestion (18 km/h)',
      },
      {
        coords: [
          [17.448, 78.386],
          [17.4435, 78.3921],
        ],
        color: '#f59e0b', // Moderate Traffic (Orange)
        label: 'Moderate Flow (32 km/h)',
      },
      {
        coords: [
          [17.4455, 78.3888],
          [17.4591, 78.3822],
        ],
        color: '#10b981', // Clear Traffic (Green)
        label: 'Clear Route (52 km/h)',
      },
    ];

    trafficCorridors.forEach((c) => {
      const line = L.polyline(c.coords as [number, number][], {
        color: c.color,
        weight: 5,
        opacity: 0.85,
      });

      line.bindTooltip(c.label, { permanent: false, direction: 'top' });
      trafficLayerRef.current?.addLayer(line);
    });
  }, [showTraffic]);

  // Handle GPS Re-center
  const handleFlyToUserLocation = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([17.4486, 78.3908], 16, { duration: 1.5 });
      triggerToast('🎯 GPS Centered to Cyber Towers, Madhapur');
    }
  };

  // Handle Refresh Live Scan
  const handleRefreshScan = () => {
    setIsRefreshing(true);
    triggerToast('🔄 Triggering Live Satellite Radar Scan & Incident Sync...');
    setTimeout(() => {
      setIsRefreshing(false);
      triggerToast('✅ Live Radar Synced: 9 Active Incidents Detected in Ward 107');
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 pb-24 animate-in fade-in duration-300">
      
      {/* Toast Feedback Popup */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-slate-900/95 border border-cyan-500/50 text-cyan-200 text-xs font-bold shadow-2xl backdrop-blur-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Control & Filter Toolbar */}
      <div className={`p-4 rounded-3xl border shadow-xl space-y-3 ${
        isLight
          ? 'bg-white border-gray-200 text-gray-900 shadow-2xs'
          : 'bg-slate-950/90 border-white/10 backdrop-blur-2xl shadow-2xl'
      }`}>
        
        {/* Top Row: Search + Primary Mode Switcher + Layer Drawer Toggle */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Search Location Input */}
          <div className={`w-full md:w-80 flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border text-xs transition-all ${
            isLight
              ? 'bg-gray-50 border-gray-200 focus-within:border-blue-600 focus-within:bg-white'
              : 'bg-white/5 border-white/10 focus-within:border-cyan-400/80'
          }`}>
            <Search className={`w-4 h-4 shrink-0 ${isLight ? 'text-blue-800' : 'text-cyan-400'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search address or landmark (e.g. Madhapur, Metro)..."
              className={`w-full bg-transparent focus:outline-none font-medium ${
                isLight ? 'text-gray-900 placeholder-gray-400' : 'text-white placeholder-slate-400'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className={`cursor-pointer ${isLight ? 'text-gray-400 hover:text-gray-700' : 'text-slate-400 hover:text-white'}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Main Map Mode Pills */}
          <div className={`flex items-center gap-1.5 p-1 rounded-2xl border overflow-x-auto max-w-full scrollbar-none ${
            isLight ? 'bg-gray-100 border-gray-200' : 'bg-black/70 border-white/15'
          }`}>
            <button
              onClick={() => {
                if (!googleMapsApiKey) {
                  triggerToast('ℹ️ Using Satellite Stream (Google Maps API key not active in environment)');
                  setMapEngine('leaflet');
                  setMapTileMode('satellite');
                } else {
                  setMapEngine('google');
                  triggerToast('📍 Switched to Google Maps Platform Engine');
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                mapEngine === 'google'
                  ? isLight ? 'bg-blue-800 text-white shadow-2xs' : 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30'
                  : isLight ? 'text-gray-600 hover:text-gray-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              Google Maps
            </button>

            <button
              onClick={() => {
                setMapEngine('leaflet');
                setMapTileMode('satellite');
                setShowHeatmap(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                mapEngine === 'leaflet' && mapTileMode === 'satellite' && !showHeatmap
                  ? isLight ? 'bg-blue-800 text-white shadow-2xs' : 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30'
                  : isLight ? 'text-gray-600 hover:text-gray-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              Satellite Stream
            </button>

            <button
              onClick={() => {
                setMapTileMode('roads');
                setShowHeatmap(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                mapTileMode === 'roads' && !showHeatmap
                  ? isLight ? 'bg-blue-800 text-white shadow-2xs' : 'bg-cyan-500 text-slate-950 shadow-lg'
                  : isLight ? 'text-gray-600 hover:text-gray-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Streets
            </button>

            <button
              onClick={() => {
                setMapTileMode('dark');
                setShowHeatmap(true);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                showHeatmap
                  ? 'bg-rose-500 text-slate-950 shadow-lg shadow-rose-500/30 animate-pulse'
                  : isLight ? 'text-gray-600 hover:text-gray-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              AI Heatmap
            </button>

            <button
              onClick={() => setIsRouteImpactMode(!isRouteImpactMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                isRouteImpactMode
                  ? 'bg-purple-600 text-white shadow-md'
                  : isLight ? 'text-gray-600 hover:text-gray-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Route className="w-3.5 h-3.5" />
              Route Impact
            </button>
          </div>

          {/* Quick Layers Drawer Toggle */}
          <button
            onClick={() => setIsLayerDrawerOpen(!isLayerDrawerOpen)}
            className={`px-3.5 py-2.5 rounded-2xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              isLayerDrawerOpen
                ? isLight ? 'bg-blue-50 border-blue-500 text-blue-900' : 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                : isLight ? 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50' : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <SlidersHorizontal className={`w-4 h-4 ${isLight ? 'text-blue-800' : 'text-cyan-400'}`} />
            <span>Map Layers</span>
            {isLayerDrawerOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Collapsible Layer Selector Options Drawer */}
        {isLayerDrawerOpen && (
          <div className={`p-3.5 rounded-2xl border grid grid-cols-2 sm:grid-cols-4 gap-2 animate-in slide-in-from-top-2 duration-200 ${
            isLight ? 'bg-gray-50 border-gray-200' : 'bg-black/60 border-white/10'
          }`}>
            {/* Terrain Tile */}
            <button
              onClick={() => {
                setMapTileMode('terrain');
                setShowHeatmap(false);
              }}
              className={`p-2.5 rounded-xl border text-left text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                mapTileMode === 'terrain'
                  ? isLight ? 'bg-emerald-100 border-emerald-400 text-emerald-950' : 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                  : isLight ? 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-4 h-4 text-emerald-600" />
              <div>
                <span className={`block ${isLight ? 'text-gray-900' : 'text-white'}`}>3D Terrain</span>
                <span className={`text-[10px] font-normal ${isLight ? 'text-gray-500' : 'text-slate-400'}`}>Topo & Elevation</span>
              </div>
            </button>

            {/* Live Traffic Overlay */}
            <button
              onClick={() => setShowTraffic(!showTraffic)}
              className={`p-2.5 rounded-xl border text-left text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                showTraffic
                  ? isLight ? 'bg-amber-100 border-amber-400 text-amber-950' : 'bg-amber-500/20 border-amber-400 text-amber-300'
                  : isLight ? 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-4 h-4 text-amber-600" />
              <div>
                <span className={`block ${isLight ? 'text-gray-900' : 'text-white'}`}>Live Traffic</span>
                <span className={`text-[10px] font-normal ${isLight ? 'text-gray-500' : 'text-slate-400'}`}>Congestion Speed</span>
              </div>
            </button>

            {/* Weather Radar Overlay */}
            <button
              onClick={() => setShowWeather(!showWeather)}
              className={`p-2.5 rounded-xl border text-left text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                showWeather
                  ? isLight ? 'bg-sky-100 border-sky-400 text-sky-950' : 'bg-sky-500/20 border-sky-400 text-sky-300'
                  : isLight ? 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <CloudRain className="w-4 h-4 text-sky-600" />
              <div>
                <span className={`block ${isLight ? 'text-gray-900' : 'text-white'}`}>Weather Radar</span>
                <span className={`text-[10px] font-normal ${isLight ? 'text-gray-500' : 'text-slate-400'}`}>Rain & Storm Cloud</span>
              </div>
            </button>

            {/* Government Assets Overlay */}
            <button
              onClick={() => setShowGovServices(!showGovServices)}
              className={`p-2.5 rounded-xl border text-left text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                showGovServices
                  ? isLight ? 'bg-indigo-100 border-indigo-400 text-indigo-950' : 'bg-indigo-500/20 border-indigo-400 text-indigo-300'
                  : isLight ? 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4 text-indigo-600" />
              <div>
                <span className={`block ${isLight ? 'text-gray-900' : 'text-white'}`}>Gov Services</span>
                <span className={`text-[10px] font-normal ${isLight ? 'text-gray-500' : 'text-slate-400'}`}>Ward & Police Hubs</span>
              </div>
            </button>
          </div>
        )}

        {/* Second Row: Category Filter Pills + Timeline Filter */}
        <div className={`flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pt-1 border-t ${
          isLight ? 'border-gray-100' : 'border-white/10'
        }`}>
          
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 scrollbar-none">
            {filterCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategoryFilter === cat.id
                    ? isLight ? 'bg-blue-50 border-blue-600 text-blue-900 font-extrabold shadow-2xs' : 'bg-teal-500/20 border-teal-500 text-teal-300 shadow-md font-extrabold'
                    : isLight ? 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Timeline Filter */}
          <div className={`flex items-center gap-1.5 p-1 rounded-2xl border shrink-0 ${
            isLight ? 'bg-gray-100 border-gray-200' : 'bg-black/60 border-white/10'
          }`}>
            <span className={`text-[10px] font-bold px-2 flex items-center gap-1 ${isLight ? 'text-gray-600' : 'text-slate-400'}`}>
              <Calendar className={`w-3 h-3 ${isLight ? 'text-blue-800' : 'text-cyan-400'}`} /> Time Range:
            </span>
            {(['all', 'today', 'last_7', 'last_30'] as TimelineFilter[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setSelectedTimeline(tf)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer ${
                  selectedTimeline === tf
                    ? isLight ? 'bg-blue-800 text-white shadow-2xs' : 'bg-cyan-500 text-slate-950 shadow-md'
                    : isLight ? 'text-gray-600 hover:text-gray-900' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf === 'all'
                  ? 'All Time'
                  : tf === 'today'
                  ? 'Today'
                  : tf === 'last_7'
                  ? 'Last 7 Days'
                  : 'Last 30 Days'}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* Route Impact Control Bar Overlay (When Route Impact Mode is Active) */}
      {isRouteImpactMode && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-purple-950/90 via-slate-950/90 to-indigo-950/90 border border-purple-500/40 backdrop-blur-2xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-3 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-300">
              <Route className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white flex items-center gap-2">
                <span>Route Impact Analyzer</span>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 text-[10px] font-mono border border-purple-400/40">
                  {hazardsOnRoute.length} Hazards Detected
                </span>
              </h4>
              <p className="text-[11px] text-slate-300">
                {isUsingDetour
                  ? '✅ Active Safe Detour: Bypassing critical road fractures.'
                  : `Path: ${activePresetRoute.origin} → ${activePresetRoute.destination}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            {/* Route selector dropdown */}
            <select
              value={activeRouteId}
              onChange={(e) => {
                setActiveRouteId(e.target.value);
                setIsUsingDetour(false);
              }}
              className="px-3 py-2 rounded-xl bg-black/70 border border-purple-500/40 text-white text-xs font-bold focus:outline-none cursor-pointer"
            >
              {PRESET_ROUTES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>

            {/* Toggle Detour Button */}
            <button
              onClick={() => {
                setIsUsingDetour(!isUsingDetour);
                triggerToast(
                  !isUsingDetour
                    ? '🛡️ Calculating AI Safe Detour bypassing hazardous spots...'
                    : '⚠️ Switched to Direct Primary Corridor'
                );
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                isUsingDetour
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
              }`}
            >
              {isUsingDetour ? '✅ Using Safe Detour' : '🛡️ Avoid Hazards (Detour)'}
            </button>
          </div>
        </div>
      )}

      {/* Main Interactive Leaflet Map Canvas Container */}
      <div
        className={`relative w-full h-[580px] rounded-3xl overflow-hidden border border-cyan-500/30 shadow-2xl bg-slate-950 transition-all duration-500 ${
          is3dView ? 'transform perspective-1000 rotate-x-12 scale-[0.98]' : ''
        }`}
      >
        {/* Google Maps / Leaflet Map Target */}
        {mapEngine === 'google' ? (
          <div className="w-full h-full z-10 relative">
            <APIProvider apiKey={googleMapsApiKey}>
              <Map
                defaultCenter={{ lat: 17.4486, lng: 78.3908 }}
                defaultZoom={14}
                mapId="DEMO_MAP_ID"
                internalUsageAttributionIds={['gmp_aistudio_build_v1_default']}
                className="w-full h-full rounded-3xl"
              >
                {filteredMarkers.map((m) => (
                  <AdvancedMarker
                    key={m.id}
                    position={{ lat: m.lat, lng: m.lng }}
                    onClick={() => setSelectedMarker(m)}
                  >
                    <Pin
                      background={m.severity === 'Critical' ? '#ef4444' : m.severity === 'Moderate' ? '#f59e0b' : '#3b82f6'}
                      borderColor="#000000"
                      glyphColor="#ffffff"
                    />
                  </AdvancedMarker>
                ))}

                {showGovServices && initialGovernmentAssets.map((asset) => (
                  <AdvancedMarker
                    key={asset.id}
                    position={{ lat: asset.lat, lng: asset.lng }}
                    onClick={() => setSelectedGovAsset(asset)}
                  >
                    <Pin
                      background="#10b981"
                      borderColor="#065f46"
                      glyphColor="#ffffff"
                    />
                  </AdvancedMarker>
                ))}

                {selectedMarker && (
                  <InfoWindow
                    position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
                    onCloseClick={() => setSelectedMarker(null)}
                  >
                    <div className="p-2 text-slate-900 max-w-xs font-sans">
                      <span className="inline-block px-2 py-0.5 text-[10px] bg-blue-100 text-blue-900 font-extrabold rounded-full mb-1">
                        {selectedMarker.category}
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-900 mb-1">{selectedMarker.title}</h4>
                      <p className="text-xs text-slate-600 mb-2">{selectedMarker.description}</p>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold border-t pt-1">
                        <span>{selectedMarker.status}</span>
                        <span>👍 {selectedMarker.upvotes} Upvotes</span>
                      </div>
                    </div>
                  </InfoWindow>
                )}

                {selectedGovAsset && (
                  <InfoWindow
                    position={{ lat: selectedGovAsset.lat, lng: selectedGovAsset.lng }}
                    onCloseClick={() => setSelectedGovAsset(null)}
                  >
                    <div className="p-2 text-slate-900 max-w-xs font-sans">
                      <span className="inline-block px-2 py-0.5 text-[10px] bg-emerald-100 text-emerald-900 font-extrabold rounded-full mb-1">
                        {selectedGovAsset.type}
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-900 mb-1">{selectedGovAsset.name}</h4>
                      <p className="text-xs text-slate-600 mb-2">{selectedGovAsset.address}</p>
                      <div className="text-[11px] text-emerald-800 font-bold border-t pt-1">
                        📞 {selectedGovAsset.phone}
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </Map>
            </APIProvider>
          </div>
        ) : (
          <div ref={mapContainerRef} className="w-full h-full z-10" />
        )}

        {/* Heatmap Glowing Overlay */}
        {showHeatmap && (
          <div className="absolute inset-0 pointer-events-none z-20">
            <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-rose-500/35 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-1/2 left-2/3 w-96 h-96 bg-orange-500/30 rounded-full blur-3xl animate-pulse" />
          </div>
        )}

        {/* Refresh Scan Beam Animation Effect */}
        {isRefreshing && (
          <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_25px_#38bdf8] animate-bounce" />
          </div>
        )}

        {/* Top-Left Floating Controls: GPS + Refresh + 2D/3D Toggle */}
        <div className="absolute top-4 left-4 z-30 flex flex-wrap items-center gap-2">
          {/* Recenter GPS */}
          <button
            onClick={handleFlyToUserLocation}
            className="px-3.5 py-2 rounded-2xl bg-slate-950/90 border border-cyan-500/40 text-cyan-300 font-extrabold text-xs shadow-xl backdrop-blur-md flex items-center gap-2 hover:scale-105 transition-all cursor-pointer"
          >
            <Compass className="w-4 h-4 animate-spin-slow text-cyan-400" />
            <span>Recenter GPS</span>
          </button>

          {/* Refresh Radar */}
          <button
            onClick={handleRefreshScan}
            disabled={isRefreshing}
            className="p-2 rounded-2xl bg-slate-950/90 border border-white/15 text-white shadow-xl backdrop-blur-md hover:scale-105 transition-all cursor-pointer"
            title="Refresh Live Radar Stream"
          >
            <RotateCw className={`w-4 h-4 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          {/* 2D/3D Perspective Toggle */}
          <button
            onClick={() => {
              setIs3dView(!is3dView);
              triggerToast(!is3dView ? '📐 3D Elevation Perspective Enabled' : '🗺️ Standard 2D View');
            }}
            className={`px-3 py-2 rounded-2xl border text-xs font-extrabold shadow-xl backdrop-blur-md transition-all cursor-pointer ${
              is3dView
                ? 'bg-cyan-500 text-slate-950 border-cyan-300'
                : 'bg-slate-950/90 border-white/15 text-slate-300 hover:text-white'
            }`}
          >
            {is3dView ? '3D View' : '2D View'}
          </button>
        </div>

        {/* Weather Indicator Card (When Weather Layer is Active) */}
        {showWeather && (
          <div className="absolute top-4 right-14 z-30 px-3.5 py-2 rounded-2xl bg-slate-950/90 border border-sky-500/40 text-sky-200 font-bold text-xs backdrop-blur-md flex items-center gap-2 animate-in fade-in">
            <CloudRain className="w-4 h-4 text-sky-400 animate-bounce" />
            <div>
              <span className="block text-white font-extrabold">29°C Partly Cloudy</span>
              <span className="text-[10px] text-sky-300 font-normal">Precipitation: 12% • Wind 14 km/h</span>
            </div>
          </div>
        )}

        {/* Collapsible Legend Drawer */}
        <div className="absolute bottom-4 left-4 z-30 space-y-1">
          <button
            onClick={() => setIsLegendOpen(!isLegendOpen)}
            className="px-3 py-1.5 rounded-xl bg-slate-950/90 border border-white/15 text-white font-extrabold text-[11px] backdrop-blur-md flex items-center gap-1.5 shadow-xl cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>Map Legend</span>
            {isLegendOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
          </button>

          {isLegendOpen && (
            <div className="p-3 rounded-2xl bg-slate-950/95 border border-white/15 backdrop-blur-xl shadow-2xl text-[11px] space-y-1.5 w-52 animate-in slide-in-from-bottom-2">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
                <span>Critical Severity (SLA &lt; 24h)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-3 h-3 rounded-full bg-orange-500 shadow-sm shadow-orange-500/50" />
                <span>High Severity (SLA 48h)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-3 h-3 rounded-full bg-teal-500 shadow-sm shadow-teal-500/50" />
                <span>Medium / Low Severity</span>
              </div>
              {showGovServices && (
                <div className="flex items-center gap-2 text-slate-300 border-t border-white/10 pt-1">
                  <span className="text-xs">🏛️</span>
                  <span>Government Facility</span>
                </div>
              )}
              {isRouteImpactMode && (
                <div className="flex items-center gap-2 text-purple-300 border-t border-white/10 pt-1 font-bold">
                  <span className="w-3 h-3 rounded-full bg-purple-500 animate-pulse" />
                  <span>Route Hazard Spot</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Floating "+ Report Issue at GPS Location" Button */}
        <button
          onClick={() => setReportingModalOpen(true)}
          className="absolute bottom-4 right-4 z-30 px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-xs shadow-xl shadow-orange-500/30 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>+ Report Issue at GPS</span>
        </button>

        {/* ------------------ ACTIVE MARKER BOTTOM INSPECTOR SHEET ------------------ */}
        {selectedMarker && !selectedGovAsset && (
          <div className={`absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[420px] p-4 rounded-3xl border shadow-2xl z-40 space-y-3.5 animate-in slide-in-from-bottom-5 duration-300 ${
            isLight
              ? 'bg-white/95 border-blue-500 shadow-xl text-gray-900'
              : 'bg-slate-950/95 border-cyan-500/50 backdrop-blur-2xl shadow-2xl text-white'
          }`}>
            {/* Header: Status + Close Button */}
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full font-black text-xs border flex items-center gap-1.5 ${
                isLight ? 'bg-blue-50 text-blue-900 border-blue-200' : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
              }`}>
                <CheckCircle2 className={`w-3.5 h-3.5 ${isLight ? 'text-blue-800' : 'text-cyan-400'}`} />
                <span>{selectedMarker.status}</span>
              </span>

              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono ${isLight ? 'text-gray-500' : 'text-slate-400'}`}>{selectedMarker.timestamp}</span>
                <button
                  onClick={() => setSelectedMarker(null)}
                  className={`p-1 rounded-full cursor-pointer ${isLight ? 'bg-gray-100 text-gray-500 hover:text-gray-900' : 'bg-white/10 text-slate-400 hover:text-white'}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Title & Location Address */}
            <div>
              <h4 className={`text-base font-black leading-tight ${isLight ? 'text-gray-900' : 'text-white'}`}>{selectedMarker.title}</h4>
              <p className={`text-xs flex items-center gap-1.5 mt-1 font-medium ${isLight ? 'text-gray-600' : 'text-slate-300'}`}>
                <MapPin className={`w-3.5 h-3.5 shrink-0 ${isLight ? 'text-blue-800' : 'text-cyan-400'}`} />
                <span>{selectedMarker.address}</span>
              </p>
            </div>

            {/* AI Summary Card */}
            {selectedMarker.aiSummary && (
              <div className={`p-3 rounded-2xl border text-xs space-y-1 ${
                isLight ? 'bg-blue-50/80 border-blue-200 text-blue-950' : 'bg-cyan-950/40 border-cyan-500/30 text-cyan-100'
              }`}>
                <span className={`text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${isLight ? 'text-blue-900' : 'text-cyan-400'}`}>
                  <Sparkles className="w-3 h-3" /> Krithiq AI Vision Analysis:
                </span>
                <p className={`leading-relaxed font-medium ${isLight ? 'text-gray-800' : 'text-slate-200'}`}>{selectedMarker.aiSummary}</p>
              </div>
            )}

            {/* Metrics Breakdown Bar */}
            <div className={`grid grid-cols-3 gap-2 p-2.5 rounded-2xl border text-center ${
              isLight ? 'bg-gray-50 border-gray-200' : 'bg-black/60 border-white/10'
            }`}>
              <div>
                <span className={`text-[10px] font-bold block ${isLight ? 'text-gray-500' : 'text-slate-400'}`}>Severity</span>
                <span
                  className={`text-xs font-black ${
                    selectedMarker.severity === 'Critical'
                      ? 'text-rose-600'
                      : selectedMarker.severity === 'High'
                      ? 'text-amber-600'
                      : 'text-teal-600'
                  }`}
                >
                  {selectedMarker.severity}
                </span>
              </div>

              <div>
                <span className={`text-[10px] font-bold block ${isLight ? 'text-gray-500' : 'text-slate-400'}`}>Supporters</span>
                <span className={`text-xs font-black ${isLight ? 'text-gray-900' : 'text-white'}`}>
                  {selectedMarker.supportersCount || 42} Upvoted
                </span>
              </div>

              <div>
                <span className={`text-[10px] font-bold block ${isLight ? 'text-gray-500' : 'text-slate-400'}`}>Distance</span>
                <span className={`text-xs font-black ${isLight ? 'text-blue-900' : 'text-cyan-300'}`}>
                  {selectedMarker.distanceKm || 0.4} km away
                </span>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {/* Navigate GPS */}
              <button
                onClick={() => {
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${selectedMarker.lat},${selectedMarker.lng}`,
                    '_blank'
                  );
                }}
                className={`py-2.5 rounded-2xl border font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isLight ? 'bg-gray-100 border-gray-200 text-gray-800 hover:bg-gray-200' : 'bg-white/10 border-white/15 text-white hover:bg-white/20'
                }`}
              >
                <Navigation className={`w-3.5 h-3.5 ${isLight ? 'text-blue-800' : 'text-cyan-400'}`} />
                <span>Navigate</span>
              </button>

              {/* Share Location */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `https://krithiq.ai/map?report=${selectedMarker.id}&lat=${selectedMarker.lat}&lng=${selectedMarker.lng}`
                  );
                  triggerToast('🔗 Incident Location Link Copied to Clipboard!');
                }}
                className={`py-2.5 rounded-2xl border font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isLight ? 'bg-gray-100 border-gray-200 text-gray-800 hover:bg-gray-200' : 'bg-white/10 border-white/15 text-white hover:bg-white/20'
                }`}
              >
                <Share2 className={`w-3.5 h-3.5 ${isLight ? 'text-teal-700' : 'text-teal-400'}`} />
                <span>Share</span>
              </button>

              {/* Inspect Official Dossier */}
              <button
                onClick={() => setActiveTab('civic')}
                className={`py-2.5 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md ${
                  isLight ? 'bg-blue-800 text-white hover:bg-blue-900 shadow-2xs' : 'bg-cyan-500 text-slate-950 hover:scale-102 shadow-cyan-500/20'
                }`}
              >
                <span>SLA Dossier</span>
              </button>
            </div>
          </div>
        )}

        {/* ------------------ GOVERNMENT ASSET BOTTOM INSPECTOR SHEET ------------------ */}
        {selectedGovAsset && !selectedMarker && (
          <div className={`absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[420px] p-4 rounded-3xl border shadow-2xl z-40 space-y-3.5 animate-in slide-in-from-bottom-5 duration-300 ${
            isLight
              ? 'bg-white/95 border-indigo-300 shadow-xl text-gray-900'
              : 'bg-slate-950/95 border-indigo-500/50 backdrop-blur-2xl shadow-2xl text-white'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full font-black text-xs border flex items-center gap-1.5 ${
                isLight ? 'bg-indigo-50 text-indigo-900 border-indigo-200' : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
              }`}>
                <span>{selectedGovAsset.icon}</span>
                <span>{selectedGovAsset.categoryLabel}</span>
              </span>

              <button
                onClick={() => setSelectedGovAsset(null)}
                className={`p-1 rounded-full cursor-pointer ${isLight ? 'bg-gray-100 text-gray-500 hover:text-gray-900' : 'bg-white/10 text-slate-400 hover:text-white'}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h4 className={`text-base font-black ${isLight ? 'text-gray-900' : 'text-white'}`}>{selectedGovAsset.name}</h4>
              <p className={`text-xs flex items-center gap-1.5 mt-1 font-medium ${isLight ? 'text-gray-600' : 'text-slate-300'}`}>
                <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>{selectedGovAsset.address}</span>
              </p>
            </div>

            <div className={`p-3 rounded-2xl border text-xs space-y-2 ${
              isLight ? 'bg-indigo-50/60 border-indigo-200 text-indigo-950' : 'bg-indigo-950/40 border-indigo-500/30 text-indigo-100'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`font-bold ${isLight ? 'text-gray-600' : 'text-slate-400'}`}>Helpline / Phone:</span>
                <span className={`font-mono font-black ${isLight ? 'text-indigo-900' : 'text-indigo-300'}`}>{selectedGovAsset.phone}</span>
              </div>
              <div className={`flex items-center justify-between border-t pt-1.5 ${isLight ? 'border-indigo-200' : 'border-indigo-500/20'}`}>
                <span className={`font-bold ${isLight ? 'text-gray-600' : 'text-slate-400'}`}>Operating Hours:</span>
                <span className={`font-bold ${isLight ? 'text-gray-800' : 'text-slate-200'}`}>{selectedGovAsset.operatingHours}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  window.open(`tel:${selectedGovAsset.phone.split('/')[0].trim()}`, '_self');
                  triggerToast(`📞 Dialing ${selectedGovAsset.name} Helpline...`);
                }}
                className={`py-2.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                  isLight ? 'bg-indigo-700 text-white hover:bg-indigo-800 shadow-2xs' : 'bg-indigo-500 text-slate-950 hover:scale-102 shadow-indigo-500/20'
                }`}
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Helpline</span>
              </button>

              <button
                onClick={() => {
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${selectedGovAsset.lat},${selectedGovAsset.lng}`,
                    '_blank'
                  );
                }}
                className={`py-2.5 rounded-2xl border font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isLight ? 'bg-gray-100 border-gray-200 text-gray-800 hover:bg-gray-200' : 'bg-white/10 border-white/15 text-white hover:bg-white/20'
                }`}
              >
                <Navigation className="w-4 h-4 text-indigo-600" />
                <span>Navigate</span>
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
