/**
 * Krithiq AI - Complete Location Services & Radius Radar Modal
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Navigation,
  X,
  AlertTriangle,
  Building2,
  Users,
  ShieldCheck,
  PhoneCall,
  Calendar,
  ShoppingBag,
  Compass,
  CheckCircle2,
} from 'lucide-react';

export const LocationPickerModal: React.FC = () => {
  const {
    currentLocation,
    setCurrentLocation,
    isLocationModalOpen,
    setLocationModalOpen,
    setActiveTab,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<
    'all' | 'complaints' | 'emergency' | 'civic' | 'community'
  >('all');

  const [isLocating, setIsLocating] = useState(false);

  if (!isLocationModalOpen) return null;

  const presets = [
    { name: 'Madhapur, Ward 107 (Current)', lat: 17.4486, lng: 78.3908 },
    { name: 'Cyber Towers Junction', lat: 17.4504, lng: 78.3811 },
    { name: 'Gachibowli IT Hub', lat: 17.4401, lng: 78.3489 },
    { name: 'Kondapur Main Commercial', lat: 17.4622, lng: 78.3681 },
    { name: 'Jubilee Hills Checkpost', lat: 17.4325, lng: 78.4071 },
  ];

  const nearbyEntities = [
    {
      id: 'e1',
      title: 'Hazardous Pothole on 100ft Road',
      type: 'complaint',
      category: 'Road Infrastructure',
      distKm: 0.4,
      status: 'In Progress (GHMC)',
      icon: AlertTriangle,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    },
    {
      id: 'e2',
      title: 'Emergency Help Point & SOS Pillar 14',
      type: 'emergency',
      category: 'Police Station / Safe Zone',
      distKm: 0.3,
      status: '24/7 Active Police Monitoring',
      icon: ShieldCheck,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    },
    {
      id: 'e3',
      title: 'Apollo Emergency & Trauma Hospital',
      type: 'emergency',
      category: 'Hospital (12 Beds Available)',
      distKm: 1.2,
      status: 'Open 24/7 • Hotline: 1066',
      icon: PhoneCall,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    },
    {
      id: 'e4',
      title: 'GHMC Ward 107 Circle Office',
      type: 'civic',
      category: 'Municipal & Revenue Office',
      distKm: 0.9,
      status: 'Officer Available (09:00 - 18:00)',
      icon: Building2,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    },
    {
      id: 'e5',
      title: 'Madhapur Ward 107 Citizens Alliance',
      type: 'community',
      category: 'Local Group (4,820 Citizens)',
      distKm: 0.5,
      status: 'Active Community',
      icon: Users,
      color: 'text-violet-400 bg-violet-500/10 border-violet-500/30',
    },
    {
      id: 'e6',
      title: 'Decentralized Rainwater Well Cleanup Event',
      type: 'community',
      category: 'Volunteer Drive',
      distKm: 1.1,
      status: 'Tomorrow 08:00 AM',
      icon: Calendar,
      color: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
    },
    {
      id: 'e7',
      title: 'Counterfeit Medicine Batch Raid Alert',
      type: 'complaint',
      category: 'Scam & Counterfeit Alert',
      distKm: 1.8,
      status: 'Verified High Alert',
      icon: AlertTriangle,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    },
  ];

  const handleFetchGps = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentLocation((prev) => ({
            ...prev,
            name: `GPS Live: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`,
            coordinates: { lat: pos.coords.latitude, lng: pos.coords.longitude },
            isGpsActive: true,
          }));
          setIsLocating(false);
        },
        () => {
          // Fallback if denied
          setIsLocating(false);
        }
      );
    } else {
      setIsLocating(false);
    }
  };

  const filteredEntities = nearbyEntities.filter((item) => {
    if (activeCategory === 'all') return item.distKm <= currentLocation.radiusKm;
    if (activeCategory === 'complaints') return item.type === 'complaint' && item.distKm <= currentLocation.radiusKm;
    if (activeCategory === 'emergency') return item.type === 'emergency' && item.distKm <= currentLocation.radiusKm;
    if (activeCategory === 'civic') return item.type === 'civic' && item.distKm <= currentLocation.radiusKm;
    if (activeCategory === 'community') return item.type === 'community' && item.distKm <= currentLocation.radiusKm;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in zoom-in-95 duration-200">
      <div className="w-full max-w-3xl bg-slate-950 border border-teal-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative">
        
        {/* Close Button */}
        <button
          onClick={() => setLocationModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 cursor-pointer z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-950 via-teal-950/60 to-slate-950 border-b border-white/10 shrink-0 space-y-4">
          <div className="flex items-center gap-3 pr-8">
            <div className="p-3 rounded-2xl bg-teal-500/20 border border-teal-500/40 text-teal-400">
              <Compass className="w-7 h-7 animate-spin" style={{ animationDuration: '10s' }} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                Krithiq AI Location Radar & Services
              </h2>
              <p className="text-xs text-slate-300">
                Detect nearby complaints, emergency centers, civic offices & volunteer networks
              </p>
            </div>
          </div>

          {/* Location Controls & GPS trigger */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-black/60 p-3 rounded-2xl border border-white/10">
            {/* GPS Fetch Button */}
            <button
              onClick={handleFetchGps}
              className="px-3 py-2 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-teal-500/20 hover:bg-teal-400"
            >
              <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Detecting GPS...' : 'Use Live GPS'}</span>
            </button>

            {/* Manual Presets */}
            <select
              value={currentLocation.name}
              onChange={(e) => {
                const sel = presets.find((p) => p.name === e.target.value);
                if (sel) {
                  setCurrentLocation((prev) => ({
                    ...prev,
                    name: sel.name,
                    coordinates: { lat: sel.lat, lng: sel.lng },
                  }));
                }
              }}
              className="bg-white/10 text-slate-200 border border-white/15 rounded-xl px-3 py-2 text-xs focus:outline-none"
            >
              {presets.map((p, i) => (
                <option key={i} value={p.name} className="bg-slate-900 text-white">
                  📍 {p.name}
                </option>
              ))}
            </select>

            {/* Radius Filter */}
            <div className="flex items-center gap-2 text-xs text-slate-300 px-2 bg-white/5 rounded-xl border border-white/10">
              <span className="font-bold text-teal-300 whitespace-nowrap">Radius:</span>
              <select
                value={currentLocation.radiusKm}
                onChange={(e) =>
                  setCurrentLocation((prev) => ({
                    ...prev,
                    radiusKm: Number(e.target.value),
                  }))
                }
                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer w-full"
              >
                <option value={1} className="bg-slate-900">1 km</option>
                <option value={3} className="bg-slate-900">3 km</option>
                <option value={5} className="bg-slate-900">5 km</option>
                <option value={10} className="bg-slate-900">10 km</option>
                <option value={20} className="bg-slate-900">20 km</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-5 pt-3 bg-slate-900/60 border-b border-white/10 flex items-center gap-2 overflow-x-auto shrink-0">
          {[
            { id: 'all', label: 'All Nearby' },
            { id: 'complaints', label: 'Complaints & Scams' },
            { id: 'emergency', label: 'Hospitals & Police' },
            { id: 'civic', label: 'Civic Offices' },
            { id: 'community', label: 'Communities & Events' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`py-2 px-3.5 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'border-teal-400 text-teal-300 bg-teal-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Entities Feed */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {filteredEntities.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-white/5 rounded-2xl">
              No items found within {currentLocation.radiusKm} km radius. Try increasing radius filter to 10 km!
            </div>
          ) : (
            filteredEntities.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs transition-all ${item.color}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{item.title}</span>
                        <span className="px-2 py-0.2 rounded-full bg-black/60 text-[10px] font-mono text-teal-300 font-bold border border-teal-500/30">
                          {item.distKm} km away
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5">{item.category}</p>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{item.status}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setLocationModalOpen(false);
                      setActiveTab('map');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-black/80 hover:bg-black text-white text-[11px] font-bold border border-white/15 cursor-pointer shrink-0"
                  >
                    View Map
                  </button>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
