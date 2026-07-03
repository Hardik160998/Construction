import React, { useState, useEffect } from 'react';
import { ArrowLeft, Building2, LayoutGrid, UploadCloud, Image as ImageIcon, Camera, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TowerProgressProps {
  towerId: string;
  towerName: string;
  onBack: () => void;
}

export default function TowerProgress({ towerId, towerName, onBack }: TowerProgressProps) {
  const [phases, setPhases] = useState([
    { id: 'foundation', name: 'Foundation', progress: 0, imageUrl: null },
    { id: 'structure', name: 'Structure', progress: 0, imageUrl: null },
    { id: 'brickwork', name: 'Brickwork', progress: 0, imageUrl: null },
    { id: 'plastering', name: 'Plastering', progress: 0, imageUrl: null },
    { id: 'electrical', name: 'Electrical', progress: 0, imageUrl: null },
    { id: 'plumbing', name: 'Plumbing', progress: 0, imageUrl: null },
    { id: 'flooring', name: 'Flooring', progress: 0, imageUrl: null },
    { id: 'painting', name: 'Painting', progress: 0, imageUrl: null },
    { id: 'handover', name: 'Handover', progress: 0, imageUrl: null },
  ]);

  const [uploadingPhaseId, setUploadingPhaseId] = useState<string | null>(null);
  const [showImageAnalysis, setShowImageAnalysis] = useState(false);

  useEffect(() => {
    if (!towerId) return;
    const fetchTower = async () => {
      try {
        const res = await fetch(`/api/admin/tower?id=${towerId}`);
        const data = await res.json();
        if (data.success && data.towers.length > 0) {
          const tower = data.towers[0];
          setPhases(prev => prev.map(p => ({
            ...p,
            progress: tower[`${p.id}_completed`] ? 100 : 0,
            imageUrl: tower[`${p.id}_image`] || null,
          })));
        }
      } catch (err) {
        console.error('Failed to load tower progress', err);
      }
    };
    fetchTower();
  }, [towerId]);

  const togglePhase = async (id: string, completed: boolean) => {
    setPhases(prev => prev.map(p => p.id === id ? { ...p, progress: completed ? 100 : 0 } : p));
    
    if (towerId) {
      try {
        await fetch('/api/admin/tower', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: towerId,
            updates: { [`${id}_completed`]: completed }
          })
        });
      } catch (err) {
        console.error('Failed to update phase status', err);
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, phaseId: string) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploadingPhaseId(phaseId);

    try {
      const uploadedUrls = [];
      const phase = phases.find(p => p.id === phaseId);
      let existingUrls: string[] = [];
      if (phase?.imageUrl) {
        try {
          const parsed = JSON.parse(phase.imageUrl);
          existingUrls = Array.isArray(parsed) ? parsed : [phase.imageUrl];
        } catch {
          existingUrls = [phase.imageUrl];
        }
      }

      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.error || 'Failed to upload image');
        uploadedUrls.push(data.url);
      }
      
      const allUrls = [...existingUrls, ...uploadedUrls];
      const newImageUrlString = JSON.stringify(allUrls);
      
      setPhases(prev => prev.map(p => p.id === phaseId ? { ...p, imageUrl: newImageUrlString } : p));
      
      if (towerId) {
        await fetch('/api/admin/tower', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: towerId,
            updates: { [`${phaseId}_image`]: newImageUrlString }
          })
        });
      }
    } catch (err: any) {
      console.error(err.message);
      alert('Failed to upload image(s)');
    } finally {
      setUploadingPhaseId(null);
    }
  };

  return (
    <div className="w-full animation-fade-in">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-violet-600 text-white rounded-xl flex items-center justify-center shadow-md shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{towerName}</h1>
              </div>
              <p className="text-slate-500 font-medium ml-[52px]">Track construction phases and update progress</p>
            </div>
          </div>
          
          <button 
            onClick={() => setShowImageAnalysis(true)} 
            className="px-5 py-2.5 font-bold text-sm rounded-xl transition-all shadow-[0_5px_15px_rgba(59,130,246,0.3)] bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-90 text-white flex items-center gap-2 shrink-0"
          >
            <Camera className="w-4 h-4" /> Img Analysis
          </button>
        </div>

        {/* Progress Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {phases.map((phase, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={phase.id} 
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-[0_10px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.06)] transition-shadow group flex flex-col justify-between h-auto min-h-[220px]"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center border border-slate-100 shrink-0">
                      <LayoutGrid className="w-5 h-5" />
                    </div>
                    <h3 className="font-extrabold text-lg text-slate-900">{phase.name}</h3>
                  </div>
                  <span className="font-black text-2xl text-slate-300 group-hover:text-blue-600 transition-colors">{phase.progress}%</span>
                </div>
                
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-6 shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000 ease-out relative"
                    style={{ width: `${phase.progress}%` }}
                  >
                    {phase.progress > 0 && (
                      <div className="absolute inset-0 bg-white/20 w-full h-full" style={{ backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem' }} />
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-4">
                <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl p-2 mb-2">
                  <span className="text-sm font-bold text-slate-500 px-2">Status</span>
                  <div className="flex px-3 py-1.5 rounded-lg bg-white shadow-sm border border-slate-200">
                    <span className={`text-xs font-bold ${phase.progress === 100 ? 'text-blue-600' : 'text-slate-600'}`}>
                      {phase.progress === 100 ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                </div>

                {/* Proof Image Section if Completed */}
                {phase.progress === 100 && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3">
                    {phase.imageUrl ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {(() => {
                          let urls: string[] = [];
                          try {
                            const parsed = JSON.parse(phase.imageUrl);
                            urls = Array.isArray(parsed) ? parsed : [phase.imageUrl];
                          } catch {
                            urls = [phase.imageUrl];
                          }
                          return urls.map((url, idx) => (
                            <div key={idx} className="relative w-full h-24 rounded-xl overflow-hidden border border-slate-200 shadow-sm group">
                              <img src={url} alt={`Phase Proof ${idx+1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <a href={url} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-colors shadow-lg flex items-center justify-center">
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                </a>
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    ) : (
                      <div className="w-full h-12 border-2 border-dashed rounded-xl flex items-center justify-center border-slate-200 bg-slate-50">
                        <span className="text-xs font-bold text-slate-400">No Proof Uploaded</span>
                      </div>
                    )}
                  </motion.div>
                )}
                
                {/* Image Upload Input */}
                {phase.progress === 100 && (
                  <div className="mt-3 relative">
                    <input 
                      type="file" 
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageUpload(e, phase.id)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      disabled={uploadingPhaseId === phase.id}
                    />
                    <div className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors">
                      {uploadingPhaseId === phase.id ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <UploadCloud className="w-4 h-4" />
                          {phase.imageUrl ? 'Replace Proof' : 'Upload Proof'}
                        </>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Checkbox for Status */}
                <div className="mt-3 flex items-center gap-3 p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => togglePhase(phase.id, phase.progress === 0)}>
                  <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${phase.progress === 100 ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
                    {phase.progress === 100 && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className="text-sm font-bold text-slate-700 select-none">Mark as Completed</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Image Analysis Modal */}
        <AnimatePresence>
          {showImageAnalysis && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900 tracking-tight">Image Analysis - {towerName}</h2>
                      <p className="text-sm font-semibold text-slate-500">View detailed visual analytics of construction progress</p>
                    </div>
                  </div>
                  <button onClick={() => setShowImageAnalysis(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-8 overflow-y-auto bg-white min-h-[400px]">
                  {phases.some(p => p.imageUrl) ? (
                    <div className="space-y-8">
                      {phases.filter(p => p.imageUrl).map(phase => {
                        let urls: string[] = [];
                        try {
                          const parsed = JSON.parse(phase.imageUrl!);
                          urls = Array.isArray(parsed) ? parsed : [phase.imageUrl!];
                        } catch {
                          urls = [phase.imageUrl!];
                        }
                        return (
                          <div key={phase.id} className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                              <LayoutGrid className="w-5 h-5 text-blue-500" />
                              {phase.name} Phase Images
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                              {urls.map((url, idx) => (
                                <div key={idx} className="relative w-full aspect-square rounded-xl overflow-hidden border border-slate-200 shadow-sm group">
                                  <img src={url} alt={`${phase.name} Proof ${idx+1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <a href={url} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-colors shadow-lg">
                                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                    </a>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center py-10">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm">
                        <ImageIcon className="w-8 h-8 text-slate-300" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 mb-2">No Images Uploaded</h3>
                      <p className="text-sm text-slate-500 max-w-md mx-auto">
                        There are currently no proof images uploaded across any construction phases for {towerName}.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
}
