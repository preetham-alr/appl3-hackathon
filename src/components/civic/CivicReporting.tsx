/**
 * Krithiq AI - Civic Reporting Modal & Component
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { categorizeCivicReport } from '../../services/api';
import { CivicReport, ComplaintCategory } from '../../types';
import {
  AlertTriangle,
  Camera,
  Mic,
  MapPin,
  Sparkles,
  CheckCircle2,
  Loader2,
  FileText,
  Clock,
  ShieldAlert,
  Upload,
  X,
} from 'lucide-react';

export const CivicReporting: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { addCivicReport, user, theme } = useApp();
  const isLight = theme === 'light';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('Madhapur, Ward 107, Hyderabad');
  const [mediaImage, setMediaImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiDraft, setAiDraft] = useState<any>(null);

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      setMediaImage(evt.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRunAiAnalysis = async () => {
    if (!title.trim() && !description.trim() && !mediaImage) {
      alert('Please provide a title, description, or upload a photo to analyze.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await categorizeCivicReport(title, description, locationName, mediaImage || undefined);
      setAiDraft(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmitFinalReport = () => {
    const finalReport: CivicReport = {
      id: aiDraft?.trackingId || `VRX-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      title: title || 'Reported Civic Defect',
      description: description || 'Issue reported via Krithiq AI Civic Intelligence.',
      category: (aiDraft?.category as ComplaintCategory) || 'potholes_roads',
      severity: aiDraft?.severity || 'High',
      urgencyDays: aiDraft?.urgencyDays || 2,
      status: 'Submitted',
      locationName: locationName || 'Local Ward Area',
      coordinates: { lat: 17.4486 + (Math.random() - 0.5) * 0.01, lng: 78.3908 + (Math.random() - 0.5) * 0.01 },
      media: mediaImage ? [{ type: 'image', url: mediaImage }] : [{ type: 'image', url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80' }],
      authorName: user.name,
      authorId: user.id,
      assignedDepartment: aiDraft?.assignedDepartment || 'GHMC Municipal Infrastructure Wing',
      slaTargetHours: aiDraft?.slaTargetHours || 48,
      slaHoursRemaining: aiDraft?.slaTargetHours || 48,
      isEscalated: false,
      timeline: [
        {
          status: 'Submitted',
          timestamp: new Date().toLocaleString(),
          description: 'Report filed with AI vision analysis and draft petition.',
          actor: user.name,
        },
        {
          status: 'AI Analysis',
          timestamp: new Date().toLocaleString(),
          description: `AI assigned category ${aiDraft?.category || 'potholes_roads'} and predicted SLA ${aiDraft?.slaTargetHours || 48}h.`,
          actor: 'Krithiq AI Engine',
        },
      ],
      upvotesCount: 1,
      createdTimestamp: new Date().toISOString(),
      updatedTimestamp: new Date().toISOString(),
    };

    addCivicReport(finalReport);
    if (onClose) onClose();
  };

  return (
    <div className={`p-6 rounded-3xl space-y-5 max-w-2xl mx-auto text-left relative transition-all duration-300 ${
      isLight
        ? 'bg-white border border-slate-200 shadow-xl text-slate-900'
        : 'bg-slate-950 border border-orange-500/40 shadow-2xl text-white'
    }`}>
      
      {onClose && (
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full cursor-pointer transition-colors ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              : 'bg-white/10 hover:bg-white/20 text-slate-300'
          }`}
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-2xl border ${
          isLight
            ? 'bg-orange-50 border-orange-200 text-orange-600'
            : 'bg-orange-500/20 border-orange-500/40 text-orange-400'
        }`}>
          <AlertTriangle className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h3 className={`text-xl font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
            AI Civic Reporting & Auto-SLA Dispatch
          </h3>
          <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
            File potholes, waste dumps, broken streetlights, or drainage issues.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className={`text-xs font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Issue Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Hazardous deep pothole near Cyber Towers flyover"
            className={`w-full mt-1 px-4 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none transition-all ${
              isLight
                ? 'bg-white border border-slate-200 text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'
                : 'bg-black/60 border border-white/10 text-white focus:border-orange-500'
            }`}
          />
        </div>

        <div>
          <label className={`text-xs font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Description / Voice Note:</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the defect, safety impact, and landmark..."
            className={`w-full mt-1 px-4 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none transition-all ${
              isLight
                ? 'bg-white border border-slate-200 text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'
                : 'bg-black/60 border border-white/10 text-white focus:border-orange-500'
            }`}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={`text-xs font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Location (Auto GPS):</label>
            <div className={`flex items-center gap-2 mt-1 px-3 py-2 rounded-xl border text-xs ${
              isLight
                ? 'bg-slate-50 border-slate-200 text-slate-900'
                : 'bg-black/60 border-white/10 text-slate-200'
            }`}>
              <MapPin className={`w-4 h-4 shrink-0 ${isLight ? 'text-orange-600' : 'text-orange-400'}`} />
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className={`bg-transparent w-full focus:outline-none text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}
              />
            </div>
          </div>

          <div>
            <label className={`text-xs font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Photo / Evidence:</label>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="file"
                id="civicMedia"
                onChange={handleMediaUpload}
                accept="image/*"
                className="hidden"
              />
              <label
                htmlFor="civicMedia"
                className={`w-full px-3 py-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  isLight
                    ? 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'
                }`}
              >
                <Camera className={`w-4 h-4 ${isLight ? 'text-orange-600' : 'text-orange-400'}`} />
                {mediaImage ? '✓ Photo Attached' : 'Attach Camera Photo'}
              </label>
            </div>
          </div>
        </div>

        <button
          onClick={handleRunAiAnalysis}
          disabled={isAnalyzing}
          className={`w-full py-3 rounded-2xl font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
            isLight
              ? 'bg-blue-700 hover:bg-blue-800 text-white shadow-blue-700/20'
              : 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-orange-500/25 hover:scale-102'
          }`}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              AI Analyzing Damage & Predicting SLA...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Run AI Auto-Classification & Draft Complaint
            </>
          )}
        </button>
      </div>

      {/* AI Draft & Prediction Results */}
      {aiDraft && (
        <div className={`p-4 rounded-2xl border space-y-3 animate-in fade-in duration-300 ${
          isLight
            ? 'bg-slate-50 border-slate-200 text-slate-900'
            : 'bg-black/60 border-orange-500/30 text-white'
        }`}>
          <div className={`flex items-center justify-between text-xs border-b pb-2 ${
            isLight ? 'border-slate-200' : 'border-white/10'
          }`}>
            <span className={`font-bold flex items-center gap-1.5 ${isLight ? 'text-emerald-700' : 'text-orange-400'}`}>
              <CheckCircle2 className="w-4 h-4" />
              AI Analysis Ready
            </span>
            <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>ID: {aiDraft.trackingId}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-[11px] text-center">
            <div className={`p-2 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-white/5 border-white/5'}`}>
              <div className={isLight ? 'text-slate-500' : 'text-slate-400'}>Category</div>
              <div className={`font-bold mt-0.5 capitalize ${isLight ? 'text-slate-900' : 'text-white'}`}>{aiDraft.category?.replace('_', ' ')}</div>
            </div>
            <div className={`p-2 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-white/5 border-white/5'}`}>
              <div className={isLight ? 'text-slate-500' : 'text-slate-400'}>Severity</div>
              <div className={`font-bold mt-0.5 ${isLight ? 'text-amber-700' : 'text-orange-400'}`}>{aiDraft.severity}</div>
            </div>
            <div className={`p-2 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-white/5 border-white/5'}`}>
              <div className={isLight ? 'text-slate-500' : 'text-slate-400'}>Predicted SLA</div>
              <div className={`font-bold mt-0.5 ${isLight ? 'text-blue-700' : 'text-cyan-400'}`}>{aiDraft.slaTargetHours} Hours</div>
            </div>
          </div>

          <div>
            <div className={`text-xs font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Assigned Department:</div>
            <div className={`text-xs font-extrabold ${isLight ? 'text-blue-900' : 'text-amber-300'}`}>{aiDraft.assignedDepartment}</div>
          </div>

          <div>
            <div className={`text-xs font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Generated Official Legal Petition Draft:</div>
            <pre className={`p-3 rounded-xl text-[11px] leading-relaxed font-sans whitespace-pre-wrap max-h-32 overflow-y-auto border ${
              isLight
                ? 'bg-white text-slate-800 border-slate-200'
                : 'bg-slate-900 text-slate-300 border-white/10'
            }`}>
              {aiDraft.draftComplaintText}
            </pre>
          </div>

          <button
            onClick={handleSubmitFinalReport}
            className={`w-full py-3 rounded-2xl font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isLight
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:scale-102'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Confirm & Dispatch Official Petition
          </button>
        </div>
      )}

    </div>
  );
};
