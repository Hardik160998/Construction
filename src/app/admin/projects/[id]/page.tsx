'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Hammer, Image as ImageIcon, Megaphone, Grid, Users, Plus, X } from 'lucide-react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectView() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState('progress');
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAddTower, setShowAddTower] = useState(false);
  const [towerForm, setTowerForm] = useState({ towerName: '', totalFloors: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [towers, setTowers] = useState<any[]>([]);

  const fetchTowers = async (projectId: string) => {
    try {
      const res = await fetch(`/api/admin/tower?projectId=${projectId}`);
      const data = await res.json();
      if (data.success) {
        setTowers(data.towers);
      }
    } catch (err) {
      console.error('Failed to fetch towers:', err);
    }
  };

  const handleTowerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !project) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/tower', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id || project._id,
          towerName: towerForm.towerName,
          totalFloors: towerForm.totalFloors
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowAddTower(false);
        setTowerForm({ towerName: '', totalFloors: '' });
        fetchTowers(project.id || project._id);
      } else {
        alert(data.error || 'Failed to save tower');
      }
    } catch (err) {
      console.error('Submit error:', err);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    async function fetchProject() {
      try {
        const response = await fetch('/api/admin/project');
        const data = await response.json();
        if (data.success) {
          const foundProject = data.projects.find((p: any) => p.id === params.id || p._id === params.id);
          if (foundProject) {
            setProject(foundProject);
            fetchTowers(foundProject.id || foundProject._id);
          } else {
            setProject({ project_name: 'Project Not Found', location: 'Unknown Location' });
          }
        }
      } catch (error) {
        console.error('Failed to fetch project:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProject();
  }, [params.id]);

  if (loading) {
    return <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">Loading...</div>;
  }

  const tabs = [
    { id: 'progress', label: 'Progress', icon: Hammer },
    { id: 'media', label: 'Media', icon: ImageIcon },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'flats', label: 'Flats', icon: Grid },
    { id: 'staff', label: 'Staff', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Back Button */}
        <div>
          <Link href="/admin" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
        </div>

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
              {activeTab === 'announcements' ? 'Announcements' : project?.project_name}
            </h1>
            <p className="text-sm font-medium text-slate-400 mt-1">
              {activeTab === 'announcements' ? 'Manage announcements for this project' : project?.location}
            </p>
          </div>
          <button 
            onClick={() => {
              if (activeTab === 'announcements') {
                // TODO: Add announcement modal logic
              } else {
                setShowAddTower(true);
              }
            }} 
            className="inline-flex items-center justify-center px-6 py-2.5 bg-[#0F172A] text-white text-sm font-semibold rounded-xl hover:bg-blue-600 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            {activeTab === 'announcements' ? 'Add Announcement' : 'Add Tower'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-100/80 p-1.5 rounded-xl w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-16 flex flex-col items-center justify-center min-h-[200px] shadow-sm">
          {activeTab === 'progress' && (
            towers.length === 0 ? (
              <p className="text-[#64748B] text-[15px] font-medium">No towers have been added yet.</p>
            ) : (
              <div className="w-full flex flex-col gap-4">
                {towers.map(tower => (
                  <div key={tower.id} className="w-full border border-slate-100 bg-slate-50 p-6 rounded-xl flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{tower.tower_name}</h3>
                      <p className="text-sm font-medium text-slate-500 mt-1">{tower.total_floors} Floors</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-lg">Active</span>
                  </div>
                ))}
              </div>
            )
          )}
          {activeTab === 'announcements' && (
            <p className="text-slate-400 text-[15px] font-medium">No announcement records found for this project.</p>
          )}
          {activeTab !== 'progress' && activeTab !== 'announcements' && (
            <p className="text-slate-400 text-sm font-medium capitalize">{activeTab} content coming soon.</p>
          )}
        </div>

      </div>

      {/* Add Tower Modal */}
      <AnimatePresence>
        {showAddTower && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 sm:p-8"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="bg-white w-full max-w-md rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-slate-200 overflow-hidden flex flex-col"
            >
              <div className="px-8 py-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Add New Tower</h2>
                    <p className="text-sm font-medium text-slate-500 mt-1">Add a tower to this project</p>
                  </div>
                </div>
                <button onClick={() => setShowAddTower(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto">
                <form onSubmit={handleTowerSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Tower Name</label>
                    <input type="text" required value={towerForm.towerName} onChange={(e) => setTowerForm({...towerForm, towerName: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 font-semibold shadow-sm" placeholder="e.g. Tower A" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Total Floors</label>
                    <input type="number" required min="1" value={towerForm.totalFloors} onChange={(e) => setTowerForm({...towerForm, totalFloors: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 font-semibold shadow-sm" placeholder="e.g. 15" />
                  </div>
                  <div className="pt-6 mt-4 flex justify-end border-t border-slate-100">
                    <button type="submit" disabled={isSubmitting} className="px-8 py-3.5 bg-slate-900 text-white font-extrabold rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 transition-all duration-300 min-w-[160px] disabled:opacity-50 flex items-center justify-center">
                      {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Save Tower'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
