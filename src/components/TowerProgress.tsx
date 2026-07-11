'use client';
import React, { useState, useEffect } from 'react';
import {
  Building2, LayoutGrid, UploadCloud, Image as ImageIcon,
  Camera, X, CheckCircle2, Layers, Zap, Droplets,
  HardHat, Wrench, Package, Home, ExternalLink,
  ChevronLeft, ChevronRight, ZoomIn, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


interface TowerProgressProps {
  towerId: string;
  towerName: string;
  floorNumber: number;
  unitType?: string;
  projectType?: string;
  onBack: () => void;
}

const PHASE_META: Record<string, { icon: React.ElementType; color: string; gradient: string }> = {
  foundation: { icon: HardHat,    color: 'text-orange-600', gradient: 'from-orange-500 to-amber-500'   },
  structure:  { icon: Building2,  color: 'text-blue-600',   gradient: 'from-blue-500 to-cyan-500'      },
  brickwork:  { icon: Layers,     color: 'text-red-600',    gradient: 'from-red-500 to-rose-500'       },
  plastering: { icon: Wrench,     color: 'text-yellow-600', gradient: 'from-yellow-500 to-amber-400'   },
  electrical: { icon: Zap,        color: 'text-violet-600', gradient: 'from-violet-500 to-purple-500'  },
  plumbing:   { icon: Droplets,   color: 'text-cyan-600',   gradient: 'from-cyan-500 to-teal-500'      },
  flooring:   { icon: LayoutGrid, color: 'text-emerald-600',gradient: 'from-emerald-500 to-green-500'  },
  painting:   { icon: ZoomIn,     color: 'text-pink-600',   gradient: 'from-pink-500 to-rose-400'      },
  handover:   { icon: Home,       color: 'text-indigo-600', gradient: 'from-indigo-500 to-blue-600'    },
};


const PHASES_DEFAULT = [
  { id: 'foundation', name: 'Foundation',  progress: 0, imageUrl: null as string | null },
  { id: 'structure',  name: 'Structure',   progress: 0, imageUrl: null as string | null },
  { id: 'brickwork',  name: 'Brickwork',   progress: 0, imageUrl: null as string | null },
  { id: 'plastering', name: 'Plastering',  progress: 0, imageUrl: null as string | null },
  { id: 'electrical', name: 'Electrical',  progress: 0, imageUrl: null as string | null },
  { id: 'plumbing',   name: 'Plumbing',    progress: 0, imageUrl: null as string | null },
  { id: 'flooring',   name: 'Flooring',    progress: 0, imageUrl: null as string | null },
  { id: 'painting',   name: 'Painting',    progress: 0, imageUrl: null as string | null },
  { id: 'handover',   name: 'Handover',    progress: 0, imageUrl: null as string | null },
];

function parseImageUrls(imageUrl: string | null): string[] {
  if (!imageUrl) return [];
  try {
    const p = JSON.parse(imageUrl);
    return Array.isArray(p) ? p : [imageUrl];
  } catch {
    return [imageUrl];
  }
}

/* ── Skeleton ──────────────────────────────────────────────────────────────── */
const Skeleton = () => (
  <div className="w-full animate-pulse">
    {/* Header skeleton */}
    <div className="mb-8 h-40 bg-gradient-to-r from-slate-200 to-slate-100 rounded-3xl" />
    {/* Cards skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm h-44 flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-slate-200 rounded-2xl" />
            <div className="space-y-2">
              <div className="h-5 w-28 bg-slate-200 rounded-md" />
              <div className="h-3 w-16 bg-slate-100 rounded-md" />
            </div>
          </div>
          <div className="h-10 bg-slate-100 rounded-xl" />
        </div>
      ))}
    </div>
  </div>
);

/* ── Analysis Viewer Sub-Component ─────────────────────────────────────────── */
interface AnalysisViewerProps {
  phases: { id: string; name: string; progress: number; imageUrl: string | null }[];
  towerName: string;
  unitType: string;
  floorNumber: number;
  onClose: () => void;
  onOpenLightbox: (urls: string[], idx: number) => void;
}

function AnalysisViewer({ phases, towerName, unitType, floorNumber, onClose, onOpenLightbox }: AnalysisViewerProps) {
  const phasesWithImages = phases.filter(p => p.imageUrl);
  const [activePhaseId, setActivePhaseId] = useState(phasesWithImages[0]?.id ?? null);
  const [activeImgIdx, setActiveImgIdx]   = useState(0);

  const activePhase = phasesWithImages.find(p => p.id === activePhaseId) ?? phasesWithImages[0];
  const activeUrls  = parseImageUrls(activePhase?.imageUrl ?? null);
  const totalImgs   = phasesWithImages.reduce((sum, p) => sum + parseImageUrls(p.imageUrl).length, 0);

  const prev = () => setActiveImgIdx(i => (i - 1 + activeUrls.length) % activeUrls.length);
  const next = () => setActiveImgIdx(i => (i + 1) % activeUrls.length);

  // reset image index when phase changes
  const handlePhaseClick = (id: string) => { setActivePhaseId(id); setActiveImgIdx(0); };

  if (phasesWithImages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
        <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <ImageIcon className="w-10 h-10 text-white/20" />
        </div>
        <h3 className="text-xl font-bold text-white">No Images Uploaded</h3>
        <p className="text-slate-400 text-sm max-w-xs">Mark phases as completed and upload proof photos to analyse them here.</p>
        <button onClick={onClose} className="mt-2 px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors">
          Close
        </button>
      </div>
    );
  }

  const activeMeta = PHASE_META[activePhase?.id ?? ''] ?? { icon: Package, gradient: 'from-slate-500 to-slate-600', color: 'text-slate-400' };
  const ActiveIcon = activeMeta.icon;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
            <Camera className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white tracking-tight">{towerName} · {unitType} {floorNumber} — Image Analysis</h2>
            <p className="text-[11px] font-semibold text-slate-500">{phasesWithImages.length} phases · {totalImgs} total photos</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body: sidebar + main */}
      <div className="flex-1 flex overflow-hidden">

        {/* LEFT: Phase list sidebar */}
        <div className="w-64 shrink-0 border-r border-white/10 overflow-y-auto flex flex-col gap-1 p-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 px-2 pt-1 pb-2">Phases</p>
          {phasesWithImages.map(phase => {
            const meta  = PHASE_META[phase.id] ?? { icon: Package, gradient: 'from-slate-500 to-slate-600', color: 'text-slate-400' };
            const Icon  = meta.icon;
            const urls  = parseImageUrls(phase.imageUrl);
            const isActive = phase.id === activePhaseId;
            return (
              <button
                key={phase.id}
                onClick={() => handlePhaseClick(phase.id)}
                className={`w-full text-left rounded-2xl p-3 transition-all flex items-center gap-3 ${isActive ? 'bg-white/10 ring-1 ring-white/20' : 'hover:bg-white/5'}`}
              >
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center shrink-0`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold truncate ${isActive ? 'text-white' : 'text-slate-400'}`}>{phase.name}</p>
                  <p className="text-[11px] text-slate-600 font-semibold">{urls.length} photo{urls.length !== 1 ? 's' : ''}</p>
                </div>
              </button>
            );
          })}

          {/* Thumbnail strip for active phase */}
          {activeUrls.length > 1 && (
            <div className="mt-3 px-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2">Photos</p>
              <div className="grid grid-cols-3 gap-1.5">
                {activeUrls.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImgIdx(i)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${i === activeImgIdx ? 'border-blue-400 scale-105' : 'border-white/10 opacity-50 hover:opacity-80'}`}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Hero image panel */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {activePhase && activeUrls.length > 0 ? (
            <>
              {/* Main image */}
              <div className="flex-1 relative flex items-center justify-center p-6 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={`${activePhaseId}-${activeImgIdx}`}
                    src={activeUrls[activeImgIdx]}
                    alt=""
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl cursor-zoom-in"
                    onClick={() => onOpenLightbox(activeUrls, activeImgIdx)}
                  />
                </AnimatePresence>

                {/* Phase info overlay — bottom left */}
                <div className="absolute bottom-8 left-8 flex items-center gap-3 bg-black/50 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-white/10">
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${activeMeta.gradient} flex items-center justify-center shrink-0`}>
                    <ActiveIcon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white">{activePhase.name} Phase</p>
                    <p className="text-[10px] text-slate-400 font-semibold">{activeImgIdx + 1} / {activeUrls.length}</p>
                  </div>
                </div>

                {/* Open full screen button — top right */}
                <button
                  onClick={() => onOpenLightbox(activeUrls, activeImgIdx)}
                  className="absolute top-8 right-8 p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white rounded-xl border border-white/10 transition-colors"
                  title="Open full screen"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>

                {/* Prev / Next buttons */}
                {activeUrls.length > 1 && (
                  <>
                    <button
                      onClick={prev}
                      className="absolute left-8 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/70 backdrop-blur-md text-white rounded-full border border-white/10 flex items-center justify-center transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={next}
                      className="absolute right-8 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/70 backdrop-blur-md text-white rounded-full border border-white/10 flex items-center justify-center transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Bottom dots indicator */}
              {activeUrls.length > 1 && (
                <div className="flex justify-center gap-1.5 pb-4">
                  {activeUrls.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImgIdx(i)}
                      className={`rounded-full transition-all ${i === activeImgIdx ? 'w-5 h-1.5 bg-blue-400' : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'}`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-600">
              <p className="text-sm font-semibold">Select a phase to view images</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────────────────────── */
export default function TowerProgress({ towerId, towerName, floorNumber, onBack, unitType = 'Floor', projectType = 'Flat' }: TowerProgressProps) {
  const [phases, setPhases] = useState(PHASES_DEFAULT.map(p => ({ ...p })));
  const [isLoading, setIsLoading]       = useState(true);
  const [uploadingId, setUploadingId]   = useState<string | null>(null);
  const [lightboxUrls, setLightboxUrls] = useState<string[] | null>(null);
  const [lightboxIdx, setLightboxIdx]   = useState(0);
  const [showAnalysis, setShowAnalysis] = useState(false);

  /* fetch */
  useEffect(() => {
    if (!towerId || floorNumber === undefined) return;
    setIsLoading(true);
    fetch(`/api/admin/floor-progress?towerId=${towerId}&floorNumber=${floorNumber}&projectType=${projectType}`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.progress) {
          const d = data.progress;
          setPhases(prev => prev.map(p => ({
            ...p,
            progress: d[`${p.id}_completed`] ? 100 : 0,
            imageUrl: d[`${p.id}_image`] || null,
          })));
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [towerId, floorNumber, projectType]);

  const togglePhase = async (id: string, completed: boolean) => {
    setPhases(prev => prev.map(p => p.id === id ? { ...p, progress: completed ? 100 : 0 } : p));
    await fetch('/api/admin/floor-progress', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ towerId, floorNumber, projectType, updates: { [`${id}_completed`]: completed } }),
    }).catch(console.error);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, phaseId: string) => {
    if (!e.target.files?.length) return;
    setUploadingId(phaseId);
    try {
      const existing = parseImageUrls(phases.find(p => p.id === phaseId)?.imageUrl ?? null);
      const uploaded: string[] = [];
      for (const file of Array.from(e.target.files)) {
        const fd = new FormData();
        fd.append('file', file);
        const res  = await fetch('/api/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        uploaded.push(data.url);
      }
      const all = JSON.stringify([...existing, ...uploaded]);
      setPhases(prev => prev.map(p => p.id === phaseId ? { ...p, imageUrl: all } : p));
      await fetch('/api/admin/floor-progress', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ towerId, floorNumber, projectType, updates: { [`${phaseId}_image`]: all } }),
      });
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    } finally {
      setUploadingId(null);
    }
  };

  const completedCount = phases.filter(p => p.progress === 100).length;
  const overallPct     = Math.round((completedCount / phases.length) * 100);

  if (isLoading) return <Skeleton />;

  return (
    <div className="w-full">

      {/* ── HEADER CARD ─────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-white/5"
      >
        {/* Glow blobs */}
        <div className="pointer-events-none absolute -top-20 -left-20 w-72 h-72 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-10 w-64 h-64 rounded-full bg-violet-600/20 blur-3xl" />

        <div className="relative z-10 p-7 flex flex-col sm:flex-row sm:items-center gap-6 justify-between">
          {/* Left: identity */}
          <div className="flex items-center gap-5">
            <button onClick={onBack} className="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-slate-300 hover:text-white hover:border-white/20 shadow-sm transition-all group shrink-0 backdrop-blur-md">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-[0_8px_24px_rgba(99,102,241,0.4)] shrink-0">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400 mb-1">{towerName}</p>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {unitType} {floorNumber}
              </h1>
              <p className="text-sm font-medium text-slate-400 mt-0.5">Construction phase tracker</p>
            </div>
          </div>

          {/* Right: stats + button */}
          <div className="flex items-center gap-5 sm:gap-6 flex-wrap">
            {/* Overall progress ring */}
            <div className="flex flex-col items-center gap-1">
              <div className="relative w-16 h-16">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
                  <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
                  <circle
                    cx="28" cy="28" r="22" fill="none"
                    stroke="url(#prog)" strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 22}`}
                    strokeDashoffset={`${2 * Math.PI * 22 * (1 - overallPct / 100)}`}
                    style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                  />
                  <defs>
                    <linearGradient id="prog" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#60a5fa" />
                      <stop offset="100%" stopColor="#a78bfa" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-black text-white">{overallPct}%</span>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Overall</span>
            </div>

            {/* Completed count */}
            <div className="text-center">
              <p className="text-3xl font-black text-white">{completedCount}<span className="text-slate-500 text-lg font-bold">/{phases.length}</span></p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-0.5">Phases Done</p>
            </div>

            {/* Img Analysis button */}
            <button
              onClick={() => setShowAnalysis(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm font-bold transition-all backdrop-blur-sm"
            >
              <Camera className="w-4 h-4" />
              Img Analysis
            </button>
          </div>
        </div>

        {/* Progress bar strip */}
        <div className="h-1.5 w-full bg-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallPct}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-blue-400 to-violet-500 rounded-full"
          />
        </div>
      </motion.div>

      {/* ── PHASE CARDS ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {phases.map((phase, idx) => {
          const meta   = PHASE_META[phase.id] ?? { icon: Package, color: 'text-slate-600', gradient: 'from-slate-500 to-slate-600' };
          const Icon   = meta.icon;
          const done   = phase.progress === 100;
          const imgUrls = parseImageUrls(phase.imageUrl);

          return (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className={`group relative bg-white rounded-3xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col ${
                done ? 'border-emerald-200/80 shadow-emerald-50' : 'border-slate-200/80'
              }`}
            >
              {/* Completed top accent line */}
              {done && (
                <div className="h-1 w-full bg-gradient-to-r from-emerald-400 to-teal-400 absolute top-0 left-0" />
              )}

              <div className="p-5 flex flex-col gap-4 flex-1">
                {/* Phase header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center shadow-sm shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base leading-tight">{phase.name}</h3>
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                        {done ? 'Completed' : 'Pending'}
                      </p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-full ${
                    done
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}>
                    {done ? '✓ Done' : 'Pending'}
                  </span>
                </div>

                {/* Image thumbnails */}
                <AnimatePresence>
                  {done && imgUrls.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-3 gap-1.5"
                    >
                      {imgUrls.slice(0, 5).map((url, i) => (
                        <div
                          key={i}
                          className="relative aspect-square rounded-xl overflow-hidden cursor-pointer border border-slate-100 group/img"
                          onClick={() => { setLightboxUrls(imgUrls); setLightboxIdx(i); }}
                        >
                          <img src={url} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110" />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                            <ExternalLink className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      ))}
                      {imgUrls.length > 5 && (
                        <div
                          className="aspect-square rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center cursor-pointer"
                          onClick={() => { setLightboxUrls(imgUrls); setLightboxIdx(5); }}
                        >
                          <span className="text-xs font-black text-slate-500">+{imgUrls.length - 5}</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Upload & toggle row */}
                <div className="mt-auto flex flex-col gap-2">
                  {/* Upload proof (only when done) */}
                  {done && (
                    <label className="w-full flex items-center justify-center gap-2 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer">
                      <input
                        type="file" accept="image/*" multiple className="hidden"
                        onChange={e => handleUpload(e, phase.id)}
                        disabled={uploadingId === phase.id}
                      />
                      {uploadingId === phase.id
                        ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Uploading…</span></>
                        : <><UploadCloud className="w-3.5 h-3.5" /><span>{imgUrls.length > 0 ? 'Add More Proof' : 'Upload Proof'}</span></>
                      }
                    </label>
                  )}

                  {/* Mark complete toggle */}
                  <button
                    onClick={() => togglePhase(phase.id, !done)}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 border ${
                      done
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 ${done ? 'text-emerald-500' : 'text-slate-400'}`} />
                    {done ? 'Mark Incomplete' : 'Mark as Completed'}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── LIGHTBOX ─────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxUrls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightboxUrls(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={lightboxUrls[lightboxIdx]}
                alt=""
                className="w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
              />
              <div className="absolute top-3 right-3 flex gap-2">
                <a
                  href={lightboxUrls[lightboxIdx]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
                <button
                  onClick={() => setLightboxUrls(null)}
                  className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {lightboxUrls.length > 1 && (
                <div className="mt-4 flex gap-2 justify-center overflow-x-auto pb-1">
                  {lightboxUrls.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setLightboxIdx(i)}
                      className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${i === lightboxIdx ? 'border-blue-400 scale-105' : 'border-white/20 opacity-60 hover:opacity-100'}`}
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── IMAGE ANALYSIS MODAL ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {showAnalysis && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-slate-950/95 backdrop-blur-sm flex flex-col"
          >
            <AnalysisViewer
              phases={phases}
              towerName={towerName}
              unitType={unitType}
              floorNumber={floorNumber}
              onClose={() => setShowAnalysis(false)}
              onOpenLightbox={(urls, idx) => { setLightboxUrls(urls); setLightboxIdx(idx); setShowAnalysis(false); }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
