'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  UploadCloud, Image as ImageIcon, Activity, CheckCircle, 
  AlertTriangle, ShieldAlert, Cpu, Sparkles, BarChart3, Maximize2 
} from 'lucide-react';

interface ProjectImageAnalysisViewProps {
  project: any;
}

export default function ProjectImageAnalysisView({ project }: ProjectImageAnalysisViewProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setAnalysisComplete(false);
    }
  };

  const runAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    // Simulate AI analysis delay
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 3000);
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setAnalysisComplete(false);
    setIsAnalyzing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col lg:flex-row h-[70vh] min-h-[600px] mt-8"
    >
      {/* Left Column - Image Area */}
      <div className="w-full lg:w-7/12 p-6 sm:p-8 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-200/80 bg-slate-50/50 relative">
        {!selectedImage ? (
          <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-[2rem] bg-white hover:bg-slate-50 transition-colors cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
            <div className="w-20 h-20 bg-violet-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-violet-100">
              <UploadCloud className="w-10 h-10 text-violet-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Upload Site Photo</h3>
            <p className="text-sm text-slate-500 text-center max-w-xs mb-8">
              Drag and drop a high-resolution image of the construction site or click to browse.
            </p>
            <button className="px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl shadow-md hover:bg-slate-800 transition-colors">
              Select Image
            </button>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
          </div>
        ) : (
          <div className="relative w-full h-full flex flex-col">
            <div className="relative w-full h-full flex-1 rounded-[2rem] overflow-hidden bg-slate-900 group shadow-inner">
              <img src={selectedImage} alt="Site Analysis" className={`w-full h-full object-cover transition-all duration-700 ${isAnalyzing ? 'scale-105 opacity-80 blur-[2px] grayscale-[30%]' : 'scale-100 opacity-100'}`} />
              
              {/* Scanning Overlay Animation */}
              {isAnalyzing && (
                <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                  <motion.div 
                    initial={{ top: '0%' }}
                    animate={{ top: '100%' }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="absolute left-0 right-0 h-1 bg-violet-400/80 shadow-[0_0_20px_4px_rgba(167,139,250,0.6)]"
                  />
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
                </div>
              )}
              
              {/* Floating Detected Boxes (Shown when complete) */}
              {analysisComplete && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="absolute inset-0 z-10 pointer-events-none">
                  <div className="absolute top-[20%] left-[30%] w-[15%] h-[25%] border-2 border-emerald-400 bg-emerald-400/10 rounded-lg flex items-start p-1">
                    <span className="bg-emerald-400 text-slate-900 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">Pillar Struct.</span>
                  </div>
                  <div className="absolute top-[45%] left-[55%] w-[20%] h-[30%] border-2 border-amber-400 bg-amber-400/10 rounded-lg flex items-start p-1">
                    <span className="bg-amber-400 text-slate-900 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">Pending Shuttering</span>
                  </div>
                  <div className="absolute top-[75%] left-[10%] w-[12%] h-[15%] border-2 border-red-500 bg-red-500/10 rounded-lg flex items-start p-1">
                    <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">Hazard: Debris</span>
                  </div>
                </motion.div>
              )}
              
              <button className="absolute top-4 right-4 p-2.5 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-white/20 transition-colors z-20">
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mt-5 flex flex-col sm:flex-row items-center justify-between shrink-0 gap-4">
              <button onClick={resetAnalysis} className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors px-4 py-2 hover:bg-slate-100 rounded-lg w-full sm:w-auto">
                Upload Different Image
              </button>
              {!analysisComplete && (
                <button 
                  onClick={runAnalysis}
                  disabled={isAnalyzing}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-violet-500/25 transition-all hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                  {isAnalyzing ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing AI Model...</>
                  ) : (
                    <><Sparkles className="w-4 h-4" /> Run Deep Analysis</>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right Column - Results Area */}
      <div className="w-full lg:w-5/12 p-6 sm:p-8 flex flex-col relative bg-white">
        <div className="flex-1 overflow-y-auto pr-2 pb-6 custom-scrollbar">
          {!selectedImage ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
              <BarChart3 className="w-16 h-16 text-slate-300 mb-4" />
              <h4 className="text-lg font-bold text-slate-400">Analysis Pending</h4>
              <p className="text-sm text-slate-400 mt-2 max-w-[200px]">Upload an image to generate structural and progress insights.</p>
            </div>
          ) : isAnalyzing ? (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center animate-pulse">
                  <Activity className="w-3.5 h-3.5 text-violet-600" />
                </div>
                <h4 className="text-base font-bold text-slate-800">Analyzing structure...</h4>
              </div>
              
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
                      <div className="h-4 w-10 bg-slate-200 rounded animate-pulse"></div>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-violet-200 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                <div className="h-4 w-32 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-3 w-full bg-slate-200 rounded animate-pulse"></div>
                <div className="h-3 w-4/5 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-3 w-5/6 bg-slate-200 rounded animate-pulse"></div>
              </div>
            </div>
          ) : analysisComplete ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
              
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-extrabold text-slate-900">Analysis Report</h3>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" /> High Confidence
                </span>
              </div>

              {/* Progress Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Est. Completion</span>
                  <div className="flex items-end gap-2 mt-1">
                    <span className="text-3xl font-black text-slate-800">42<span className="text-xl text-slate-400">%</span></span>
                    <span className="text-xs font-bold text-emerald-500 mb-1.5">+2% this week</span>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quality Score</span>
                  <div className="flex items-end gap-2 mt-1">
                    <span className="text-3xl font-black text-slate-800">A-</span>
                    <span className="text-xs font-bold text-emerald-500 mb-1.5">Standard</span>
                  </div>
                </div>
              </div>

              {/* Detection Tags */}
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-slate-400" /> Objects Detected
                </h4>
                <div className="flex flex-wrap gap-2">
                  {['RCC Pillars', 'Slab Framework', 'Scaffolding', 'Cranes', 'Workers (3)'].map((tag) => (
                    <span key={tag} className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg border border-slate-200">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Alerts */}
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
                <h4 className="text-sm font-bold text-red-800 mb-2 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" /> Safety Hazards (1)
                </h4>
                <div className="flex gap-3 text-sm text-red-700 bg-white/60 p-3 rounded-xl border border-red-100/50">
                  <AlertTriangle className="w-5 h-5 shrink-0 text-red-500" />
                  <p className="leading-snug font-medium">Unsecured debris detected on level 3 edge. Recommend immediate clearance to prevent falling objects.</p>
                </div>
              </div>

              {/* Summary */}
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-2">AI Summary</h4>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm">
                  Based on structural analysis, the current floor slab preparation is <span className="font-semibold text-slate-800">85% complete</span>. Rebar placement appears consistent with architectural models. Minor delays observed in the eastern wing scaffolding setup.
                </p>
              </div>

            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-violet-50 rounded-full flex items-center justify-center mb-4 border border-violet-100">
                <Cpu className="w-8 h-8 text-violet-400" />
              </div>
              <h4 className="text-lg font-bold text-slate-800">Ready to Analyze</h4>
              <p className="text-sm text-slate-500 mt-2 max-w-[220px]">Click "Run Deep Analysis" to process the image through our CV models.</p>
            </div>
          )}
        </div>
        
        {/* Action Footer */}
        {analysisComplete && (
          <div className="pt-4 mt-auto border-t border-slate-100">
            <button className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl shadow-md hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
              <UploadCloud className="w-4 h-4" /> Export Report
            </button>
          </div>
        )}
      </div>

    </motion.div>
  );
}
