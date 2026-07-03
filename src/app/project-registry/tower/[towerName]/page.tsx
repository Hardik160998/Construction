'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Building2, LayoutGrid, UploadCloud, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TowerProgressPage({ params }: { params: Promise<{ towerName: string }> }) {
  const resolvedParams = use(params);
  const towerName = decodeURIComponent(resolvedParams.towerName);
  const searchParams = useSearchParams();
  const towerId = searchParams.get('id');

  const [phases, setPhases] = useState<{ id: string; name: string; progress: number; imageUrl: string | null }[]>([
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
    <div className="min-h-screen bg-[#f4f7f9] p-8 lg:p-12 font-sans selection:bg-blue-500/20">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/project-registry" className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-slate-800 hover:border-slate-300 shadow-sm transition-all group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Link>
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
        </div>

        {/* Progress Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <input type="file" id={`upload-${phase.id}`} className="hidden" accept="image/*" multiple onChange={(e) => handleImageUpload(e, phase.id)} disabled={uploadingPhaseId === phase.id} />
                    <label htmlFor={`upload-${phase.id}`} className="flex items-center justify-center gap-2 w-full py-2 mb-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer transition-colors">
                      <UploadCloud className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-bold text-slate-600">{uploadingPhaseId === phase.id ? 'Uploading...' : 'Add Evidence'}</span>
                    </label>
                    
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
                                <a href={url} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-colors shadow-lg">
                                  <ExternalLink className="w-4 h-4" />
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
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
