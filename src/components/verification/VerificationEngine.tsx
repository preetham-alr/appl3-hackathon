/**
 * Krithiq AI - Multi-Asset AI Verification Engine
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { runVerification } from '../../services/api';
import { VerificationType, VerificationResult } from '../../types';
import { TrustMeter } from '../common/TrustMeter';
import {
  ShieldCheck,
  QrCode,
  FileSearch,
  MessageSquare,
  PackageCheck,
  Camera,
  Upload,
  Sparkles,
  AlertOctagon,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Loader2,
  FileText,
  Video,
  Award,
} from 'lucide-react';

export const VerificationEngine: React.FC = () => {
  const { addVerificationResult, verificationHistory, theme } = useApp();
  const isLight = theme === 'light';

  const [activeType, setActiveType] = useState<VerificationType>('fake_news');
  const [inputText, setInputText] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isScanningCamera, setIsScanningCamera] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeResult, setActiveResult] = useState<VerificationResult | null>(null);

  const verificationCategories = [
    { id: 'fake_news', label: 'Fake News & Claims', icon: FileSearch, color: 'emerald' },
    { id: 'product_counterfeit', label: 'Product & Barcode', icon: PackageCheck, color: 'emerald' },
    { id: 'qr_barcode', label: 'QR Code & Seal', icon: QrCode, color: 'emerald' },
    { id: 'fake_review', label: 'Fake Review Checker', icon: MessageSquare, color: 'emerald' },
    { id: 'deepfake_image', label: 'Deepfake & Media', icon: Camera, color: 'emerald' },
    { id: 'document_ocr', label: 'Document & Stamp', icon: FileText, color: 'emerald' },
  ];

  const handleRunVerify = async () => {
    if (!inputText.trim() && !uploadedImage) {
      alert('Please enter a claim URL/text, scan a QR code, or upload an image to verify.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await runVerification(
        activeType,
        inputText || 'Attached QR/Media Asset',
        uploadedImage || undefined
      );
      setActiveResult(res);
      addVerificationResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      setUploadedImage(evt.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSimulateQrScan = () => {
    setIsScanningCamera(true);
    setTimeout(() => {
      setIsScanningCamera(false);
      setInputText('https://verify.krithiq.ai/check/batch/SYN-2026-MED982');
      setUploadedImage('https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80');
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className={`p-6 rounded-3xl border shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        isLight
          ? 'bg-white border-gray-200 text-gray-900 shadow-2xs'
          : 'bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border-emerald-500/30 text-white shadow-2xl'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`p-3.5 rounded-2xl border ${
            isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
          }`}>
            <ShieldCheck className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h2 className={`text-2xl font-extrabold flex items-center gap-2 ${isLight ? 'text-gray-900' : 'text-white'}`}>
              AI Verification & Authenticity Engine
              <span className={`px-2.5 py-0.5 text-xs border rounded-full font-bold ${
                isLight ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}>
                Zero-Trust AI
              </span>
            </h2>
            <p className={`text-xs mt-1 ${isLight ? 'text-gray-600' : 'text-slate-300'}`}>
              Verify news claims, counterfeit products, QR stamps, fake reviews, deepfakes, and official documents.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateQrScan}
            className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer ${
              isLight
                ? 'bg-blue-800 text-white hover:bg-blue-900 shadow-2xs'
                : 'bg-emerald-500 text-slate-950 hover:scale-105 shadow-emerald-500/30'
            }`}
          >
            <QrCode className="w-4 h-4" />
            Live Camera Scanner
          </button>
        </div>
      </div>

      {/* Verification Type Selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {verificationCategories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeType === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveType(cat.id as any);
                setActiveResult(null);
              }}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer ${
                isActive
                  ? isLight
                    ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-2xs scale-105 font-bold'
                    : 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/20 scale-105 font-bold'
                  : isLight
                    ? 'bg-white border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs leading-tight">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Scanner & Input Card */}
      <div className={`p-6 rounded-3xl border shadow-xl space-y-4 ${
        isLight
          ? 'bg-white border-gray-200 shadow-2xs'
          : 'bg-slate-950/80 border-white/10 backdrop-blur-2xl shadow-2xl'
      }`}>
        
        {isScanningCamera ? (
          <div className={`p-8 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center space-y-3 animate-pulse ${
            isLight ? 'bg-blue-50 border-blue-400' : 'bg-emerald-500/10 border-emerald-500/50'
          }`}>
            <QrCode className={`w-12 h-12 animate-spin ${isLight ? 'text-blue-800' : 'text-emerald-400'}`} />
            <h4 className={`text-sm font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>Camera Scanner Active</h4>
            <p className={`text-xs ${isLight ? 'text-gray-600' : 'text-slate-300'}`}>Align QR code or product barcode inside the frame...</p>
          </div>
        ) : (
          <div className="space-y-3">
            <label className={`text-xs font-bold flex items-center gap-2 ${isLight ? 'text-gray-900' : 'text-slate-300'}`}>
              <Sparkles className={`w-4 h-4 ${isLight ? 'text-blue-800' : 'text-emerald-400'}`} />
              Enter Claim Text, News Article URL, or Product Batch Number:
            </label>

            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. Paste social media news post, product QR payload, or review text..."
              className={`w-full px-4 py-3 rounded-2xl border text-xs sm:text-sm focus:outline-none transition-colors ${
                isLight
                  ? 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-600 focus:bg-white placeholder-gray-400'
                  : 'bg-black/60 border-white/10 text-white focus:border-emerald-500'
              }`}
            />

            {/* Media Upload Area */}
            <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl border ${
              isLight ? 'bg-gray-50 border-gray-200' : 'bg-white/5 border-white/10'
            }`}>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  id="verifUpload"
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <label
                  htmlFor="verifUpload"
                  className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    isLight
                      ? 'bg-white border-gray-200 text-gray-800 hover:bg-gray-100 shadow-2xs'
                      : 'bg-white/10 border-white/10 text-slate-200 hover:bg-white/20'
                  }`}
                >
                  <Upload className={`w-4 h-4 ${isLight ? 'text-blue-800' : 'text-emerald-400'}`} />
                  Attach Image / Photo
                </label>
                {uploadedImage && <span className={`text-xs font-bold ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>✓ Media Attached</span>}
              </div>

              <button
                onClick={handleRunVerify}
                disabled={isAnalyzing}
                className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
                  isLight
                    ? 'bg-blue-800 text-white hover:bg-blue-900 shadow-2xs'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:scale-105 shadow-emerald-500/25'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Running AI Verification...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Verify Now
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Verification Result Display */}
      {activeResult && (
        <div className={`p-6 rounded-3xl border shadow-xl space-y-6 animate-in zoom-in-95 duration-300 ${
          isLight
            ? 'bg-white border-gray-200 shadow-2xs text-gray-900'
            : 'bg-slate-950 border-emerald-500/40 shadow-2xl text-white'
        }`}>
          
          <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b ${
            isLight ? 'border-gray-100' : 'border-white/10'
          }`}>
            <div>
              <span className={`px-3 py-1 rounded-full border text-xs font-extrabold uppercase tracking-wider ${
                isLight ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}>
                {activeResult.type} Audit Complete
              </span>
              <h3 className={`text-xl font-extrabold mt-2 ${isLight ? 'text-gray-900' : 'text-white'}`}>{activeResult.verdict}</h3>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-gray-600' : 'text-slate-400'}`}>Scanned Asset: "{activeResult.queryOrAsset}"</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className={`text-xs font-bold ${isLight ? 'text-gray-500' : 'text-slate-400'}`}>Risk Rating</div>
                <div
                  className={`text-sm font-black uppercase ${
                    activeResult.riskLevel === 'Low'
                      ? isLight ? 'text-emerald-800' : 'text-emerald-400'
                      : activeResult.riskLevel === 'Medium'
                      ? isLight ? 'text-amber-800' : 'text-amber-400'
                      : isLight ? 'text-rose-800' : 'text-rose-400'
                  }`}
                >
                  {activeResult.riskLevel} Risk
                </div>
              </div>
            </div>
          </div>

          <TrustMeter score={activeResult.trustScore} confidence={activeResult.confidenceScore} label="Verification Authenticity Score" />

          {/* Detailed Explanation */}
          <div className={`p-4 rounded-2xl border space-y-2 ${isLight ? 'bg-gray-50 border-gray-200' : 'bg-white/5 border-white/10'}`}>
            <h4 className={`text-xs font-bold flex items-center gap-2 ${isLight ? 'text-gray-900' : 'text-slate-300'}`}>
              <FileSearch className={`w-4 h-4 ${isLight ? 'text-blue-800' : 'text-emerald-400'}`} />
              AI Deep Findings & Audit Breakdown:
            </h4>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-gray-700 font-medium' : 'text-slate-200'}`}>{activeResult.explanation}</p>
          </div>

          {/* Authenticity Matrix & Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Authenticity Matrix */}
            <div className={`p-4 rounded-2xl border space-y-3 ${isLight ? 'bg-gray-50 border-gray-200' : 'bg-black/40 border-white/5'}`}>
              <h4 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-gray-900' : 'text-slate-300'}`}>Authenticity Metrics</h4>
              <div className="space-y-2">
                {activeResult.authenticityBreakdown?.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-medium ${isLight ? 'text-gray-700' : 'text-slate-300'}`}>{item.label}</span>
                      <span className={`font-bold ${isLight ? 'text-emerald-800' : 'text-emerald-400'}`}>{item.score}%</span>
                    </div>
                    <div className={`w-full h-1.5 rounded-full overflow-hidden ${isLight ? 'bg-gray-200' : 'bg-white/10'}`}>
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${isLight ? 'bg-emerald-600' : 'bg-emerald-400'}`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations & Product Traceability */}
            <div className={`p-4 rounded-2xl border space-y-3 ${isLight ? 'bg-gray-50 border-gray-200' : 'bg-black/40 border-white/5'}`}>
              <h4 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-gray-900' : 'text-slate-300'}`}>Recommended Actions</h4>
              <ul className={`space-y-1.5 text-xs ${isLight ? 'text-gray-700' : 'text-slate-300'}`}>
                {activeResult.recommendations?.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`} />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>

              {activeResult.productDetails && (
                <div className={`mt-3 pt-3 border-t text-[11px] space-y-1 ${isLight ? 'border-gray-200 text-gray-600' : 'border-white/10 text-slate-400'}`}>
                  <div>Brand: <strong className={isLight ? 'text-gray-900' : 'text-white'}>{activeResult.productDetails.brandName}</strong></div>
                  <div>Origin: <strong className={isLight ? 'text-gray-900' : 'text-white'}>{activeResult.productDetails.manufacturingOrigin}</strong></div>
                  <div>Batch: <strong className={isLight ? 'text-blue-900' : 'text-cyan-400'}>{activeResult.productDetails.batchNumber}</strong></div>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* History List */}
      {verificationHistory.length > 0 && (
        <div className="space-y-3">
          <h3 className={`text-sm font-bold ${isLight ? 'text-gray-900' : 'text-slate-300'}`}>Recent Verification Audits</h3>
          <div className="space-y-2">
            {verificationHistory.map((h) => (
              <div key={h.id} className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
                isLight ? 'bg-white border-gray-200 shadow-2xs' : 'bg-white/5 border-white/10'
              }`}>
                <div>
                  <span className={`font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>{h.verdict}</span>
                  <p className={`text-[11px] truncate max-w-md ${isLight ? 'text-gray-600' : 'text-slate-400'}`}>{h.queryOrAsset}</p>
                </div>
                <div className="text-right">
                  <span className={`font-bold ${isLight ? 'text-emerald-800' : 'text-emerald-400'}`}>{h.trustScore} Trust</span>
                  <div className={`text-[10px] ${isLight ? 'text-gray-400' : 'text-slate-500'}`}>{new Date(h.timestamp).toLocaleTimeString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
