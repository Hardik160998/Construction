import React from 'react';
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
}

export default function FloorList({ towerId, towerName, totalFloors, onSelectFloor, onBack, unitType = 'Floor', numberSeries }: FloorListProps) {
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
      <div className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-xl flex items-center justify-center shadow-md shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{towerName} - {unitType}s</h1>
            </div>
            <p className="text-slate-500 font-medium ml-[52px]">Select a {unitType.toLowerCase()} to manage its construction progress</p>
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
          {floors.map((floorNum, index) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02 }}
              key={floorNum}
            >
              <button
                onClick={() => onSelectFloor(floorNum)}
                className="w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group flex flex-col items-center justify-center gap-3"
              >
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Layers className="w-6 h-6" />
                </div>
                <span className="font-bold text-slate-700 group-hover:text-blue-700">
                  {unitType} {floorNum}
                </span>
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
