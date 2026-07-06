'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Building2 } from 'lucide-react';
import FloorList from '@/components/FloorList';
import TowerProgress from '@/components/TowerProgress';

export default function TowerProgressPage({ params }: { params: Promise<{ towerName: string }> }) {
  const resolvedParams = use(params);
  const towerName = decodeURIComponent(resolvedParams.towerName);
  const searchParams = useSearchParams();
  const towerId = searchParams.get('id');

  const [towerDetails, setTowerDetails] = useState<any>(null);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);

  useEffect(() => {
    if (!towerId) return;
    const fetchTower = async () => {
      try {
        const res = await fetch(`/api/admin/tower?id=${towerId}`);
        const data = await res.json();
        if (data.success && data.towers.length > 0) {
          setTowerDetails(data.towers[0]);
        }
      } catch (err) {
        console.error('Failed to load tower details', err);
      }
    };
    fetchTower();
  }, [towerId]);

  if (!towerId) {
    return <div className="p-8">No tower ID provided.</div>;
  }

  return (
    <div className="min-h-screen bg-[#f4f7f9] p-8 lg:p-12 font-sans selection:bg-blue-500/20">
      <div className="max-w-6xl mx-auto">
        
        {/* Custom Header for back navigation if not in a floor view */}
        {!selectedFloor && (
          <div className="mb-10 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/superadmin?tab=project" className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-slate-800 hover:border-slate-300 shadow-sm transition-all group">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        )}

        {selectedFloor ? (
          <TowerProgress
            towerId={towerId}
            towerName={towerName}
            floorNumber={selectedFloor}
            unitType={towerDetails?.total_houses ? 'House' : 'Floor'}
            onBack={() => setSelectedFloor(null)}
          />
        ) : (
          <FloorList
            towerId={towerId}
            towerName={towerName}
            totalFloors={towerDetails?.total_floors || towerDetails?.total_houses || 0}
            numberSeries={towerDetails?.number_series}
            unitType={towerDetails?.total_houses ? 'House' : 'Floor'}
            onSelectFloor={(floor) => setSelectedFloor(floor)}
            onBack={() => window.history.back()}
          />
        )}
      </div>
    </div>
  );
}
