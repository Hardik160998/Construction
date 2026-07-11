import React, { useState, useEffect } from 'react';
import { Building2, Layers, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface FloorListProps {
  towerId: string;
  towerName: string;
  totalFloors: number;
  onSelectFloor: (floorNumber: number) => void;
  onBack: () => void;
  unitType?: string;
  numberSeries?: string;
  projectType?: string;
}

export default function FloorList({ towerId, towerName, totalFloors, onSelectFloor, onBack, unitType = 'Floor', numberSeries, projectType = 'Flat' }: FloorListProps) {
  const [floorProgressMap, setFloorProgressMap] = useState<Record<number, number>>({});

  useEffect(() => {
    if (!towerId) return;
    const fetchProgress = async () => {
      try {
        const res = await fetch(`/api/admin/bulk-progress?towerId=${towerId}&projectType=${projectType}`);
        const data = await res.json();
        if (data.success && data.progressMap) {
          setFloorProgressMap(data.progressMap);
        }
      } catch (err) {
        console.error('Failed to fetch bulk progress', err);
      }
    };
    fetchProgress();
  }, [towerId, projectType]);

  // Generate array of floor numbers
  let floors: number[] = [];
  if (numberSeries) {
    const parts = numberSeries.split(',');
    parts.forEach(part => {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number);
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = start; i <= end; i++) {
            floors.push(i);
          }
        }
      } else {
        const num = Number(part);
        if (!isNaN(num)) floors.push(num);
      }
    });
  } else {
    floors = Array.from({ length: totalFloors || 0 }, (_, i) => i + 1);
  }

  return (
    <div className="w-full animation-fade-in">
      <div className="mb-10 flex items-center justify-between bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100/40 to-indigo-50/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-40 h-40 bg-gradient-to-tr from-emerald-50/30 to-transparent rounded-full blur-2xl translate-y-1/3 pointer-events-none" />
        
        <div className="flex items-center gap-6 relative z-10">
          <button onClick={onBack} className="w-12 h-12 flex items-center justify-center bg-white/80 border border-slate-200/80 rounded-2xl text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-white shadow-sm transition-all group shrink-0 backdrop-blur-md">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-2xl flex items-center justify-center shadow-[0_8px_20px_rgba(79,70,229,0.3)] shrink-0">
              <Building2 className="w-7 h-7" />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1 flex items-center gap-3">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                  {towerName} - {unitType}s
                </span>
              </h1>
              <p className="text-sm font-semibold text-slate-500">
                Select a {unitType.toLowerCase()} to manage its construction progress
              </p>
            </div>
          </div>
        </div>
      </div>

      {floors.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-2xl border border-slate-200">
          <Layers className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900">No {unitType.toLowerCase()}s found</h3>
          <p className="text-slate-500">This tower does not have any {unitType.toLowerCase()}s defined.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {floors.map((floorNum, index) => {
            const percentage = floorProgressMap[floorNum] || 0;
            return (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
                key={floorNum}
              >
                <button
                  onClick={() => onSelectFloor(floorNum)}
                  className="relative w-full bg-white border border-slate-200 rounded-2xl p-6 pt-8 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group flex flex-col items-center justify-center gap-3"
                >
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg text-xs font-bold border border-emerald-100">
                    {percentage}%
                  </div>
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Layers className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-slate-700 group-hover:text-blue-700">
                    {unitType} {floorNum}
                  </span>
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
