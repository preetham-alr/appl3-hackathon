/**
 * CivicAI - Interactive Profile Avatar Picker (Camera Capture, File Upload & Presets)
 */

import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Check, RefreshCw, X, Sparkles, Image as ImageIcon } from 'lucide-react';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
];

interface AvatarPickerProps {
  currentAvatar: string;
  onAvatarChange: (newAvatarUrl: string) => void;
  label?: string;
}

export const AvatarPicker: React.FC<AvatarPickerProps> = ({
  currentAvatar,
  onAvatarChange,
  label = 'Profile Photo',
}) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera stream when component unmounts or camera closes
  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setCameraError(null);
  };

  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  // Start live webcam camera
  const handleStartCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported on this device/browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 640 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError(
        err.message || 'Unable to access camera. Please allow camera permissions or upload a photo file.'
      );
    }
  };

  // Capture frame from video stream onto canvas
  const handleCapturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    const size = Math.min(video.videoWidth || 640, video.videoHeight || 640);
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Calculate crop centered square
      const sx = (video.videoWidth - size) / 2;
      const sy = (video.videoHeight - size) / 2;

      ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);

      // Convert canvas to Data URL
      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      onAvatarChange(dataUrl);

      // Haptic feedback
      if ('vibrate' in navigator) navigator.vibrate(30);

      stopCameraStream();
    }
  };

  // Handle local file upload from device photo gallery
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onAvatarChange(result);
        if ('vibrate' in navigator) navigator.vibrate(20);
      }
      setIsUploading(false);
    };

    reader.onerror = () => {
      alert('Failed to read selected image file.');
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
        <span>{label}</span>
        <span className="text-[10px] text-cyan-400 font-semibold">Camera & Custom File Supported</span>
      </label>

      {/* Primary Preview & Options */}
      <div className="p-4 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-xl flex flex-col sm:flex-row items-center gap-4">
        
        {/* Large Selected Avatar Preview */}
        <div className="relative group shrink-0">
          <img
            src={currentAvatar || AVATAR_PRESETS[0]}
            alt="Profile Avatar"
            className="w-20 h-20 rounded-2xl object-cover ring-4 ring-cyan-500/50 shadow-xl shadow-cyan-500/20"
          />
          <div className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-cyan-500 text-slate-950 shadow-md">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        </div>

        {/* Action Buttons: Camera & Custom File Upload */}
        <div className="flex-1 w-full space-y-2 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            
            {/* Take Photo with Camera */}
            <button
              type="button"
              onClick={handleStartCamera}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 text-xs font-black shadow-lg shadow-cyan-500/20 hover:scale-102 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Take Photo</span>
            </button>

            {/* Upload Custom File from Device */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold hover:border-cyan-400 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {isUploading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              ) : (
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
              )}
              <span>Upload Photo</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          <p className="text-[11px] text-slate-400 font-medium leading-tight">
            Take a selfie with your camera, upload any custom photo from device, or choose a preset avatar below.
          </p>
        </div>

      </div>

      {/* Preset Avatars Bar */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" /> Quick Preset Avatars:
        </span>
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
          {AVATAR_PRESETS.map((presetUrl, idx) => {
            const isSelected = currentAvatar === presetUrl;
            return (
              <img
                key={idx}
                src={presetUrl}
                alt={`Preset ${idx + 1}`}
                onClick={() => onAvatarChange(presetUrl)}
                className={`w-11 h-11 rounded-xl object-cover cursor-pointer transition-all shrink-0 ${
                  isSelected
                    ? 'ring-4 ring-cyan-400 scale-105 shadow-md shadow-cyan-500/30'
                    : 'opacity-60 hover:opacity-100 hover:scale-102 border border-white/10'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Camera Capture Modal View */}
      {isCameraActive && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-950 border border-cyan-500/50 rounded-3xl p-5 shadow-2xl relative space-y-4">
            
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-black text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-cyan-400 animate-pulse" />
                Capture Profile Photo
              </span>
              <button
                type="button"
                onClick={stopCameraStream}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Viewport / Error State */}
            {cameraError ? (
              <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center space-y-3">
                <p className="text-xs text-rose-300 font-medium">{cameraError}</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-black cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Upload className="w-4 h-4" />
                  Upload Photo from Device Instead
                </button>
              </div>
            ) : (
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-black border border-cyan-500/30 shadow-inner">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />

                {/* Face Overlay Guide */}
                <div className="absolute inset-0 border-2 border-cyan-400/40 rounded-full m-8 pointer-events-none border-dashed animate-pulse" />

                {/* Shutter Capture Button */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                  <button
                    type="button"
                    onClick={handleCapturePhoto}
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 flex items-center justify-center shadow-xl shadow-cyan-500/50 hover:scale-110 active:scale-95 transition-all cursor-pointer border-4 border-slate-950"
                    title="Snap Profile Photo"
                  >
                    <div className="w-7 h-7 rounded-full bg-slate-950 border-2 border-cyan-400" />
                  </button>
                </div>
              </div>
            )}

            {/* Hidden Canvas element for video frame extraction */}
            <canvas ref={canvasRef} className="hidden" />

            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span>Position face inside center frame</span>
              <button
                type="button"
                onClick={stopCameraStream}
                className="text-cyan-400 font-bold hover:underline cursor-pointer"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
