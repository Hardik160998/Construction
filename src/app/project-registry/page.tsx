'use client';

import { useState, useEffect, useMemo } from 'react';
import { Building2, Plus, LogOut, CheckCircle2, AlertCircle, Users, HardHat, MapPin, Sparkles, ChevronRight, List, X, UploadCloud, Image as ImageIcon, Briefcase, CreditCard, BarChart2, ArrowRightLeft, TrendingUp, Megaphone, Building } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import TowerProgress from '@/components/TowerProgress';

export default function BuilderDashboard() {
  const [activeTab, setActiveTab] = useState<'builder' | 'customer' | 'project'>('project');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Lists for tables
  const [builders, setBuilders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [towers, setTowers] = useState<any[]>([]);

  // Project Filters
  const [projectTypeFilter, setProjectTypeFilter] = useState('All');
  const [projectNameSearch, setProjectNameSearch] = useState('');
  const [customerTypeFilter, setCustomerTypeFilter] = useState('All');
  const [customerProjectFilter, setCustomerProjectFilter] = useState('All');

  // Show form toggles (now used for Modals)
  const [showBuilderForm, setShowBuilderForm] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showTowerForm, setShowTowerForm] = useState(false);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [announcementData, setAnnouncementData] = useState({ projectId: '', title: '', message: '' });

  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  const [showAnnouncementDetailsModal, setShowAnnouncementDetailsModal] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showCustomerDetailsModal, setShowCustomerDetailsModal] = useState(false);
  const [selectedProjectForSidebar, setSelectedProjectForSidebar] = useState<any>(null);
  const [activeProjectSubTab, setActiveProjectSubTab] = useState<'progress' | 'announcement' | 'flats' | 'staff' | null>(null);
  const [selectedTowerForProgress, setSelectedTowerForProgress] = useState<any>(null);

  // Form States
  const [builderData, setBuilderData] = useState({
    companyName: '', contactName: '', email: '', phone: '', projectId: '',
  });

  const [customerData, setCustomerData] = useState({
    builderId: '', customerType: '', projectId: '', firstName: '', lastName: '', email: '', phone: '', floor: '', towerName: '', flatName: '', flatNumber: '', areaSqft: '', bhk: ''
  });

  const [projectData, setProjectData] = useState({
    projectName: '', location: '', status: '', description: '', coverImgUrl: '', expectedPossession: '', customerId: '', projectType: '', bhk: '', areaSqft: '', roomNumber: '', roomNumber: ''
  });

  const [towerData, setTowerData] = useState({
    towerName: '', totalFloors: '', totalHouses: '', numberSeries: '', bhk: ''
  });

  const [projectTowers, setProjectTowers] = useState<any[]>([]);

  useEffect(() => {
    if (customerData.projectId) {
      const fetchTowersForCustomer = async () => {
        try {
          const res = await fetch(`/api/admin/tower?projectId=${customerData.projectId}`);
          if (res.ok) {
            const data = await res.json();
            setProjectTowers(data.towers || []);
          }
        } catch (error) {
          console.error('Error fetching towers:', error);
        }
      };
      fetchTowersForCustomer();

      // Auto-populate BHK and Area from selected project
      const selectedProject = projects.find(p => p.id === customerData.projectId);
      if (selectedProject) {
        setCustomerData(prev => ({
          ...prev,
          bhk: selectedProject.bhk || prev.bhk,
          areaSqft: selectedProject.area_sqft || prev.areaSqft
        }));
      }
    } else {
      setProjectTowers([]);
    }
  }, [customerData.projectId, activeTab]);

  const availableFlatNumbers = useMemo(() => {
    if (!customerData.towerName) return [];
    const tower = projectTowers.find(t => t.tower_name === customerData.towerName);
    if (!tower || !tower.number_series) return [];

    let numbers: string[] = [];
    const ranges = tower.number_series.split(',').map((s: string) => s.trim());
    for (const range of ranges) {
      if (range.includes('-')) {
        const parts = range.split('-');
        const start = parseInt(parts[0], 10);
        const end = parseInt(parts[1], 10);
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = start; i <= end; i++) {
            numbers.push(i.toString());
          }
        }
      } else {
        const val = parseInt(range, 10);
        if (!isNaN(val)) {
          numbers.push(val.toString());
        }
      }
    }

    // Map base numbers to the selected floor
    if (customerData.floor) {
      const floorStr = customerData.floor;
      numbers = numbers.map(n => {
        let suffix = n;
        // Extract the unit number (suffix) from the base number
        if (/^\d+$/.test(n)) {
          if (n.length >= 3) {
            if (n.startsWith('1')) {
              suffix = n.substring(1);
            } else {
              suffix = n.slice(-2);
            }
            
            if (floorStr === 'Ground') {
              return `G${suffix}`;
            } else {
              return `${floorStr}${suffix}`;
            }
          } else {
            // For 1-4 series, don't prepend the floor and don't zero-pad.
            // Just return the literal flat number '1', '2', '3', '4'.
            return n;
          }
        }

        if (floorStr === 'Ground') {
          return `G${suffix}`;
        } else {
          return `${floorStr}${suffix}`;
        }
      });
      // Remove duplicates just in case mapping creates overlaps
      numbers = Array.from(new Set(numbers));

      // Remove flats that are already booked by other customers
      if (customerData.projectId) {
        const bookedFlats = customers
          .filter(c => c.project_id === customerData.projectId && c.tower_name === customerData.towerName && c.floor === customerData.floor)
          .map(c => c.flat_number);
        numbers = numbers.filter(n => !bookedFlats.includes(n));
      }
    }

    return numbers;
  }, [customerData.towerName, customerData.floor, customerData.projectId, projectTowers, customers]);

  const availableFloors = useMemo(() => {
    if (!customerData.towerName) return [];
    const tower = projectTowers.find(t => t.tower_name === customerData.towerName);
    if (!tower || !tower.total_floors) return [];

    const floors: string[] = [];
    for (let i = 1; i <= tower.total_floors; i++) {
      floors.push(i.toString());
    }
    return floors;
  }, [customerData.towerName, projectTowers]);

  useEffect(() => {
    if (selectedProjectForSidebar) {
      fetchTowers(selectedProjectForSidebar.id || selectedProjectForSidebar._id);
      fetchAnnouncements(selectedProjectForSidebar.id || selectedProjectForSidebar._id);
      fetchStaff(selectedProjectForSidebar.id || selectedProjectForSidebar._id);
    } else {
      setTowers([]);
      setAnnouncements([]);
      setStaffList([]);
    }
  }, [selectedProjectForSidebar]);

  useEffect(() => {
    fetchBuilders();
    fetchCustomers();
    fetchProjects();

    const handlePopState = () => {
      const pathname = window.location.pathname;
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');

      if (pathname.includes('/customer-network') || tab === 'customer') {
        setActiveTab('customer');
      } else if (pathname.includes('/builder-network') || tab === 'builder') {
        setActiveTab('builder');
      } else {
        setActiveTab('project');
      }
    };

    // Initial check
    handlePopState();

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const fetchBuilders = async () => {
    try {
      const res = await fetch('/api/admin/builder');
      const data = await res.json();
      if (data.success) setBuilders(data.builders);
    } catch (err) {
      console.error('Failed to load builders', err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/admin/customer');
      const data = await res.json();
      if (data.success) setCustomers(data.customers);
    } catch (err) {
      console.error('Failed to load customers', err);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/admin/project');
      const data = await res.json();
      if (data.success) setProjects(data.projects);
    } catch (err) {
      console.error('Failed to load projects', err);
    }
  };

  const fetchTowers = async (projectId: string) => {
    try {
      const res = await fetch(`/api/admin/tower?projectId=${projectId}`);
      const data = await res.json();
      if (data.success) setTowers(data.towers || []);
    } catch (err) {
      console.error('Failed to load towers', err);
    }
  };

  const fetchAnnouncements = async (projectId: string) => {
    try {
      const res = await fetch(`/api/admin/announcement?projectId=${projectId}`);
      const data = await res.json();
      if (data.success) setAnnouncements(data.announcements || []);
    } catch (err) {
      console.error('Failed to load announcements', err);
    }
  };

  const fetchStaff = async (projectId: string) => {
    try {
      const res = await fetch(`/api/admin/staff?projectId=${projectId}`);
      const data = await res.json();
      if (data.success) setStaffList(data.staff || []);
    } catch (err) {
      console.error('Failed to load staff', err);
    }
  };

  const handleBuilderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBuilderData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCustomerData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setProjectData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to upload image');

      setProjectData(prev => ({ ...prev, coverImgUrl: data.url }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleBuilderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); setError(''); setSuccess(false);

    try {
      const response = await fetch('/api/admin/builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(builderData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to add builder');

      setSuccess(true);
      setBuilderData({ companyName: '', contactName: '', email: '', phone: '', projectId: '' });
      fetchBuilders();
      setTimeout(() => { setSuccess(false); setShowBuilderForm(false); }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true); setError(''); setSuccess(false);

    try {
      const response = await fetch('/api/admin/customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to add customer');

      setSuccess(true);
      setCustomerData({ builderId: '', customerType: '', projectId: '', firstName: '', lastName: '', email: '', phone: '', floor: '', towerName: '', flatName: '', flatNumber: '', areaSqft: '', bhk: '' });
      fetchCustomers();
      setTimeout(() => { setSuccess(false); setShowCustomerForm(false); }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); setError(''); setSuccess(false);

    try {
      const response = await fetch('/api/admin/project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to add project');

      setSuccess(true);
      setProjectData({ projectName: '', location: '', status: '', description: '', coverImgUrl: '', expectedPossession: '', customerId: '', projectType: '', bhk: '', areaSqft: '' });
      fetchProjects();
      setTimeout(() => { setSuccess(false); setShowProjectForm(false); }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTowerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTowerData({ ...towerData, [e.target.name]: e.target.value });
  };

  const handleTowerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(''); setSuccess(false);

    try {
      const response = await fetch('/api/admin/tower', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: selectedProjectForSidebar?.id || selectedProjectForSidebar?._id,
          towerName: towerData.towerName,
          totalFloors: towerData.totalFloors,
          totalHouses: towerData.totalHouses,
          numberSeries: towerData.numberSeries,
          bhk: towerData.bhk
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to add tower');

      setSuccess(true);
      fetchTowers(selectedProjectForSidebar?.id || selectedProjectForSidebar?._id);

      setTimeout(() => {
        setSuccess(false);
        setShowTowerForm(false);
        setTowerData({ towerName: '', totalFloors: '', totalHouses: '', numberSeries: '' });
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnnouncementChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setAnnouncementData({ ...announcementData, [e.target.name]: e.target.value });
  };

  const handleAnnouncementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(''); setSuccess(false);

    try {
      const response = await fetch('/api/admin/announcement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: announcementData.projectId,
          title: announcementData.title,
          message: announcementData.message
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to add announcement');

      setSuccess(true);
      fetchAnnouncements(selectedProjectForSidebar?.id || selectedProjectForSidebar?._id);

      setTimeout(() => {
        setSuccess(false);
        setShowAnnouncementForm(false);
        setAnnouncementData({ projectId: '', title: '', message: '' });
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const menuItems = [
    { id: 'project', label: 'Project Registry', icon: MapPin },
    { id: 'customer', label: 'Customer Network', icon: Users }
  ] as const;

  const handleTabChange = (tabId: 'builder' | 'customer' | 'project') => {
    setActiveTab(tabId);
    setError('');
    setSuccess(false);
    setShowBuilderForm(false);
    setShowCustomerForm(false);
    setShowProjectForm(false);
    setActiveProjectSubTab(null);

    // Sync with URL
    const newPath = tabId === 'customer' ? '/customer-network'
      : tabId === 'builder' ? '/project-registry/builder-network'
        : '/project-registry';
    window.history.pushState(null, '', newPath);
  };

  return (
    <div className="h-screen w-full bg-[#f4f7f9] flex flex-col text-slate-800 overflow-hidden font-sans selection:bg-blue-500/20">

      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-400/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-violet-400/10 blur-[120px]" />
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] rounded-full bg-emerald-400/5 blur-[120px]" />
      </div>

      {/* Premium Top Navbar */}
      <nav className="relative z-50 w-full border-b border-slate-200/60 bg-white/70 backdrop-blur-xl h-20 flex items-center justify-between px-8 shrink-0 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-blue-600 to-violet-600 p-2.5 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.2)] border border-blue-500/10">
            <Building2 className="text-white w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
              Builder Dashboard
            </span>
            <div className="text-[10px] uppercase tracking-[0.2em] text-blue-600 font-bold mt-0.5">Builder Workspace</div>
          </div>
        </div>
        <Link href="/login" className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-red-500 transition-all duration-300 bg-slate-100 hover:bg-red-50 px-5 py-2.5 rounded-full border border-slate-200 hover:border-red-200">
          <LogOut className="w-4 h-4" /> Sign Out
        </Link>
      </nav>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden relative z-10">

        {/* Glassmorphic Sidebar */}
        <aside className="w-80 bg-white/50 backdrop-blur-md border-r border-slate-200/60 p-6 shrink-0 flex flex-col gap-2 relative overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 mb-4">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Management</span>
          </div>

          <div className="flex flex-col gap-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <div key={item.id} className="flex flex-col">
                  <button
                    onClick={() => handleTabChange(item.id)}
                    className={`group relative flex items-center justify-between w-full px-4 py-4 rounded-2xl font-semibold transition-all duration-300 overflow-hidden ${isActive
                      ? 'text-blue-700 shadow-[0_0_20px_rgba(59,130,246,0.1)] border-blue-200/50'
                      : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-200/40'
                      } border`}
                  >
                    {/* Active Background Glow */}
                    {isActive && (
                      <motion.div layoutId="activeTab" className="absolute inset-0 bg-gradient-to-r from-blue-50 to-violet-50 rounded-2xl" />
                    )}

                    <div className="relative z-10 flex items-center gap-4 whitespace-nowrap">
                      <div className={`p-2 rounded-xl transition-colors duration-300 ${isActive ? 'bg-blue-100/50 text-blue-600' : 'bg-slate-100 group-hover:bg-slate-200'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="truncate">{item.label}</span>
                    </div>

                    {isActive && <ChevronRight className={`w-4 h-4 text-blue-600 relative z-10 transition-transform duration-300 ${item.id === 'project' && selectedProjectForSidebar ? 'rotate-90' : ''}`} />}
                  </button>

                  {/* Collapsible Sub-menu for Project Registry */}
                  <AnimatePresence>
                    {item.id === 'project' && selectedProjectForSidebar && activeTab === 'project' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden flex flex-col mt-3 pl-3 pr-2"
                      >
                        <div className="flex items-center justify-between px-4 py-3.5 mb-2 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100/60 rounded-2xl group relative z-20">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <Briefcase className="w-[18px] h-[18px] text-blue-600 shrink-0" />
                            <span className="text-[14px] font-bold text-slate-700 truncate pr-2">{selectedProjectForSidebar.project_name}</span>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); setSelectedProjectForSidebar(null); setActiveProjectSubTab(null); }} className="p-1 bg-white border border-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors shadow-sm shrink-0 flex items-center justify-center">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex flex-col gap-1 relative before:absolute before:left-[22px] before:top-2 before:bottom-4 before:w-[1.5px] before:bg-slate-100/80 before:rounded-full">
                          <button onClick={() => { setActiveProjectSubTab('progress'); setSelectedTowerForProgress(null); }} className={`w-full flex items-center gap-4 px-4 py-3 relative z-10 group transition-all rounded-xl ${activeProjectSubTab === 'progress' ? 'bg-blue-50/50' : ''}`}>
                            <div className="bg-[#f4f7f9] z-10 relative"><TrendingUp className={`w-[18px] h-[18px] transition-colors ${activeProjectSubTab === 'progress' ? 'text-blue-600' : 'text-slate-500 group-hover:text-blue-500'}`} /></div>
                            <span className={`text-[14.5px] font-bold transition-colors ${activeProjectSubTab === 'progress' ? 'text-blue-700' : 'text-slate-600 group-hover:text-slate-800'}`}>Progress</span>
                          </button>
                          <button onClick={() => setActiveProjectSubTab('announcement')} className={`w-full flex items-center gap-4 px-4 py-3 relative z-10 group transition-all rounded-xl ${activeProjectSubTab === 'announcement' ? 'bg-blue-50/50' : ''}`}>
                            <div className="bg-[#f4f7f9] z-10 relative"><Megaphone className={`w-[18px] h-[18px] transition-colors ${activeProjectSubTab === 'announcement' ? 'text-blue-600' : 'text-slate-500 group-hover:text-blue-500'}`} /></div>
                            <span className={`text-[14.5px] font-bold transition-colors ${activeProjectSubTab === 'announcement' ? 'text-blue-700' : 'text-slate-600 group-hover:text-slate-800'}`}>Announcement</span>
                          </button>

                          <button onClick={() => setActiveProjectSubTab('staff')} className={`w-full flex items-center gap-4 px-4 py-3 relative z-10 group transition-all rounded-xl ${activeProjectSubTab === 'staff' ? 'bg-blue-50/50' : ''}`}>
                            <div className="bg-[#f4f7f9] z-10 relative"><Users className={`w-[18px] h-[18px] transition-colors ${activeProjectSubTab === 'staff' ? 'text-blue-600' : 'text-slate-500 group-hover:text-blue-500'}`} /></div>
                            <span className={`text-[14.5px] font-bold transition-colors ${activeProjectSubTab === 'staff' ? 'text-blue-700' : 'text-slate-600 group-hover:text-slate-800'}`}>Staff</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8 lg:p-12 relative">
          <div className="w-full max-w-none">

            {activeProjectSubTab && selectedProjectForSidebar ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6 mt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button onClick={() => {
                      if (selectedTowerForProgress) {
                        setSelectedTowerForProgress(null);
                      } else {
                        setActiveProjectSubTab(null);
                      }
                    }} className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-slate-700 shadow-sm transition-colors">
                      <ChevronRight className="w-5 h-5 rotate-180" />
                    </button>
                    <div>
                      <h2 className="text-2xl font-extrabold text-slate-900 capitalize flex items-center gap-2">
                        {activeProjectSubTab === 'announcement' ? 'Announcements' : selectedProjectForSidebar.project_name}
                      </h2>
                      <p className="text-sm font-medium text-slate-500 mt-1">
                        {activeProjectSubTab === 'announcement' ? 'View announcements for this project' : (
                          <>Location: <span className="font-semibold text-slate-700">{selectedProjectForSidebar.location || 'N/A'}</span></>
                        )}
                      </p>
                    </div>
                  </div>

                  {activeProjectSubTab === 'progress' && selectedProjectForSidebar && (
                    <button onClick={() => setShowTowerForm(true)} className="px-5 py-2.5 font-bold text-sm rounded-xl transition-all shadow-[0_5px_15px_rgba(59,130,246,0.3)] bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-90 text-white flex items-center gap-2 shrink-0">
                      <Plus className="w-4 h-4" /> {selectedProjectForSidebar?.project_type === 'Society' ? 'Add Section' : 'Add Tower'}
                    </button>
                  )}
                  {activeProjectSubTab === 'announcement' && (
                    <button onClick={() => setShowAnnouncementForm(true)} className="px-5 py-2.5 font-bold text-sm rounded-xl transition-all shadow-[0_5px_15px_rgba(59,130,246,0.3)] bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-90 text-white flex items-center gap-2 shrink-0">
                      <Plus className="w-4 h-4" /> Add Announcement
                    </button>
                  )}
                </div>

                {activeProjectSubTab === 'progress' && selectedTowerForProgress ? (
                  <TowerProgress
                    towerId={selectedTowerForProgress.id}
                    towerName={selectedTowerForProgress.tower_name}
                    onBack={() => setSelectedTowerForProgress(null)}
                  />
                ) : activeProjectSubTab === 'progress' && towers.length > 0 ? (
                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {towers.map(tower => (
                      <div key={tower.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <Building className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-0.5">{tower.tower_name}</h3>
                            <p className="text-sm font-semibold text-slate-500">{tower.total_floors || tower.total_houses} {tower.total_floors ? 'Floors' : 'Houses'} {tower.bhk && <span className="ml-2 inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-lg">{tower.bhk}</span>}</p>
                          </div>
                        </div>
                        <button onClick={() => setSelectedTowerForProgress(tower)} className="mt-6 w-full block text-center py-2.5 bg-slate-50 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition-colors text-sm">
                          Manage Progress
                        </button>
                      </div>
                    ))}
                  </div>
                ) : activeProjectSubTab === 'announcement' && announcements.length > 0 ? (
                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {announcements.map((ann) => (
                      <div key={ann.id} onClick={() => { setSelectedAnnouncement(ann); setShowAnnouncementDetailsModal(true); }} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between cursor-pointer hover:border-indigo-300">
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-[11px] font-bold uppercase tracking-wider rounded-xl">
                              <Megaphone className="w-3.5 h-3.5" />
                              {projects.find(p => p.id === ann.project_id)?.project_name || selectedProjectForSidebar?.project_name || 'Unknown Project'}
                            </div>
                            <span className="text-xs font-bold text-slate-400 mt-1">{ann.created_at ? new Date(ann.created_at).toLocaleDateString() : ann.date}</span>
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 mb-2">{ann.title}</h3>
                          <p className="text-sm font-medium text-slate-600 line-clamp-3">{ann.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : activeProjectSubTab === 'staff' && staffList.length > 0 ? (
                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {staffList.map((staff) => (
                      <div key={staff.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between cursor-default">
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-[11px] font-bold uppercase tracking-wider rounded-xl">
                              <Briefcase className="w-3.5 h-3.5" />
                              {staff.role}
                            </div>
                            <span className="text-xs font-bold text-slate-400 mt-1">{staff.created_at ? new Date(staff.created_at).toLocaleDateString() : 'N/A'}</span>
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 mb-2">{staff.name}</h3>
                          <div className="space-y-1.5 mt-4">
                            {staff.phone && <p className="text-sm font-medium text-slate-600 flex items-center gap-2">📞 {staff.phone}</p>}
                            {staff.email && <p className="text-sm font-medium text-slate-600 flex items-center gap-2">✉️ {staff.email}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-8 flex items-center justify-center min-h-[400px]">
                    <p className="text-center text-slate-400/80 font-medium text-lg tracking-wide">
                      {activeProjectSubTab === 'announcement'
                        ? 'No announcement records found for this project.'
                        : activeProjectSubTab === 'staff'
                          ? 'No staff members assigned to this project yet.'
                          : `No ${activeProjectSubTab} records found for this project.`}
                    </p>
                  </div>
                )}
              </motion.div>
            ) : (
              <>
                {/* Header */}
                <motion.div
                  key={`header-${activeTab}`}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                  className="mb-12"
                >
                  <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-3 flex items-center gap-3">
                    {activeTab === 'builder' ? 'Builder Matrix' : activeTab === 'customer' ? 'Customer Network' : 'Project Registry'}
                    <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)]" />
                  </h1>
                  <p className="text-sm font-medium text-slate-500 mt-2">
                    {activeTab === 'builder'
                      ? 'Deploy new construction companies to the SuperAdmin ecosystem.'
                      : activeTab === 'customer'
                        ? 'Integrate new buyers and assign them directly to active builders.'
                        : 'Initialize new real estate projects for the global tracker.'}
                  </p>
                </motion.div>

                {/* Form or List Card */}
                <motion.div
                  key={`form-${activeTab}`}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="bg-white/80 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-[0_20px_60px_rgba(0,0,0,0.05)] overflow-hidden relative group"
                >

                  <div className="px-8 py-6 border-b border-slate-100 bg-white/50 flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-gradient-to-br from-blue-50 to-violet-50 text-blue-600 rounded-xl border border-blue-100">
                        <List className="w-5 h-5" />
                      </div>
                      <h2 className="font-bold text-xl text-slate-800">
                        {activeTab === 'builder' ? 'Active Builders' : activeTab === 'customer' ? 'Active Customers' : 'Active Projects'}
                      </h2>
                    </div>

                    {/* Add Button Toggles Modal */}
                    {activeTab === 'customer' && (
                      <button onClick={() => setShowCustomerForm(true)} className="px-5 py-2.5 font-bold text-sm rounded-xl transition-all shadow-[0_5px_15px_rgba(59,130,246,0.3)] bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-90 text-white flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Add Customer
                      </button>
                    )}
                    {activeTab === 'project' && (
                      <button onClick={() => setShowProjectForm(true)} className="px-5 py-2.5 font-bold text-sm rounded-xl transition-all shadow-[0_5px_15px_rgba(59,130,246,0.3)] bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-90 text-white flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Add Project
                      </button>
                    )}


                  </div>

                  <div className="p-8 sm:p-12 relative z-10">

                    {/* BUILDER LIST VIEW */}
                    {activeTab === 'builder' && (
                      <div className="overflow-x-auto -mx-4 sm:-mx-0">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                          <thead>
                            <tr className="border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-widest">
                              <th className="pb-4 px-4">Company Name</th>
                              <th className="pb-4 px-4">Contact</th>
                              <th className="pb-4 px-4">Email</th>
                              <th className="pb-4 px-4">Mobile No</th>
                            </tr>
                          </thead>
                          <tbody className="text-slate-700">
                            {builders.length === 0 ? (
                              <tr>
                                <td colSpan={4} className="py-12 text-center text-slate-500 font-medium">
                                  No builders deployed yet. Click 'Add Builder' to initialize one.
                                </td>
                              </tr>
                            ) : (
                              builders.map((builder) => (
                                <tr key={builder.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
                                  <td className="py-5 px-4 font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{builder.company_name}</td>
                                  <td className="py-5 px-4 text-slate-600 font-medium">{builder.contact_name}</td>
                                  <td className="py-5 px-4 text-slate-600 font-medium">{builder.email}</td>
                                  <td className="py-5 px-4 text-slate-600 font-medium">{builder.phone || 'N/A'}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* CUSTOMER LIST VIEW */}
                    {activeTab === 'customer' && (
                      <div className="flex flex-col gap-6">
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                          <div className="w-full sm:w-64">
                            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Filter by Type</label>
                            <div className="relative">
                              <select
                                value={customerTypeFilter}
                                onChange={(e) => setCustomerTypeFilter(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 font-semibold shadow-sm appearance-none cursor-pointer"
                              >
                                <option value="All">All Types</option>
                                <option value="Flat">Flat</option>
                                <option value="Commercial">Commercial</option>
                                <option value="Society">Society</option>
                              </select>
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
                              </div>
                            </div>
                          </div>
                          <div className="w-full sm:w-64">
                            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Filter by Project</label>
                            <div className="relative">
                              <select
                                value={customerProjectFilter}
                                onChange={(e) => setCustomerProjectFilter(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 font-semibold shadow-sm appearance-none cursor-pointer"
                              >
                                <option value="All">All Projects</option>
                                {projects.map(p => (
                                  <option key={p.id} value={p.id}>{p.project_name}</option>
                                ))}
                              </select>
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="overflow-x-auto -mx-4 sm:-mx-0 mt-6">
                          <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                              <tr className="border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-widest">
                                <th className="pb-4 px-4">Name</th>
                                <th className="pb-4 px-4">Contact Details</th>
                                <th className="pb-4 px-4">Tower / Flat</th>
                                <th className="pb-4 px-4 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="text-slate-700">
                              {customers
                                .filter(c => customerTypeFilter === 'All' || c.customer_type === customerTypeFilter)
                                .filter(c => customerProjectFilter === 'All' || c.project_id === customerProjectFilter)
                                .length === 0 ? (
                                <tr>
                                  <td colSpan={5} className="py-12 text-center text-slate-500 font-medium">
                                    No customers match the selected filters.
                                  </td>
                                </tr>
                              ) : (
                                customers
                                  .filter(c => customerTypeFilter === 'All' || c.customer_type === customerTypeFilter)
                                  .filter(c => customerProjectFilter === 'All' || c.project_id === customerProjectFilter)
                                  .map((customer) => (
                                    <tr key={customer.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
                                      <td className="py-5 px-4 font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                        {customer.first_name} {customer.last_name}
                                        {customer.customer_type && <div className="text-xs font-normal text-slate-500 mt-1">{customer.customer_type}</div>}
                                      </td>
                                      <td className="py-5 px-4 text-slate-600 font-medium">
                                        <div>{customer.email}</div>
                                        <div className="text-sm text-slate-500 mt-1">{customer.phone || 'N/A'}</div>
                                      </td>
                                      <td className="py-5 px-4 text-slate-600 font-medium">
                                        {customer.tower_name ? (
                                          <>
                                            <div className="font-semibold text-slate-800">{customer.tower_name}</div>
                                            <div className="text-sm text-slate-500 mt-1">Floor {customer.floor || '-'} | Flat {customer.flat_number || '-'}</div>
                                            {(customer.bhk || customer.area_sqft) && (
                                              <div className="text-xs text-slate-400 mt-1">
                                                {customer.bhk && <span>{customer.bhk}</span>}
                                                {customer.bhk && customer.area_sqft && <span> &bull; </span>}
                                                {customer.area_sqft && <span>{customer.area_sqft} sqft</span>}
                                              </div>
                                            )}
                                          </>
                                        ) : (
                                          <span className="text-slate-400 italic">Not Assigned</span>
                                        )}
                                      </td>
                                      <td className="py-5 px-4 text-right">
                                        <button
                                          onClick={() => { setSelectedCustomer(customer); setShowCustomerDetailsModal(true); }}
                                          className="inline-flex items-center justify-center px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                                        >
                                          View
                                        </button>
                                      </td>
                                    </tr>
                                  ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                    {/* PROJECT LIST VIEW */}
                    {activeTab === 'project' && !activeProjectSubTab && (
                      <div className="flex flex-col gap-6">
                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                          <div className="w-full sm:w-1/3">
                            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-widest">Filter by Type</label>
                            <select
                              value={projectTypeFilter}
                              onChange={(e) => { setProjectTypeFilter(e.target.value); setProjectNameSearch(''); }}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm appearance-none cursor-pointer"
                            >
                              <option value="All">All Types</option>
                              <option value="Flat">Flat</option>
                              <option value="Commercial">Commercial</option>
                              <option value="Society">Society</option>
                            </select>
                          </div>
                          <div className="w-full sm:w-2/3">
                            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-widest">Filter by Name</label>
                            <select
                              value={projectNameSearch}
                              onChange={(e) => setProjectNameSearch(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm appearance-none cursor-pointer"
                            >
                              <option value="">All Projects</option>
                              {projects
                                .filter(p => projectTypeFilter === 'All' || p.project_type === projectTypeFilter)
                                .map((project) => (
                                  <option key={project.id} value={project.project_name}>
                                    {project.project_name}
                                  </option>
                                ))}
                            </select>
                          </div>
                        </div>

                        <div className="overflow-x-auto -mx-4 sm:-mx-0">
                          <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                              <tr className="border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-widest">
                                <th className="pb-4 px-4">Project Name</th>
                                <th className="pb-4 px-4">Location</th>
                                <th className="pb-4 px-4">Expected Possession</th>
                                <th className="pb-4 px-4 text-right">Status</th>
                                <th className="pb-4 px-4 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="text-slate-700">
                              {projects
                                .filter(p => projectTypeFilter === 'All' || p.project_type === projectTypeFilter)
                                .filter(p => projectNameSearch === '' || p.project_name === projectNameSearch)
                                .length === 0 ? (
                                <tr>
                                  <td colSpan={5} className="py-12 text-center text-slate-500 font-medium">
                                    No projects found matching the filters.
                                  </td>
                                </tr>
                              ) : (
                                projects
                                  .filter(p => projectTypeFilter === 'All' || p.project_type === projectTypeFilter)
                                  .filter(p => projectNameSearch === '' || p.project_name === projectNameSearch)
                                  .map((project) => (
                                    <tr key={project.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
                                      <td className="py-5 px-4 font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                        {project.project_name}
                                      </td>
                                      <td className="py-5 px-4 text-slate-600 font-medium">{project.location || 'N/A'}</td>
                                      <td className="py-5 px-4 text-slate-600 font-medium">{project.expected_possession || project.expectedPossession || 'N/A'}</td>
                                      <td className="py-5 px-4 text-right">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold tracking-wider border ${project.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                          project.status === 'Under Construction' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                            'bg-blue-50 text-blue-600 border-blue-200'
                                          }`}>
                                          {project.status || 'Planning'}
                                        </span>
                                      </td>
                                      <td className="py-5 px-4 text-right">
                                        <button
                                          onClick={() => { setSelectedProjectForSidebar(project); setActiveProjectSubTab('progress'); }}
                                          className="inline-flex items-center justify-center px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                                        >
                                          View
                                        </button>
                                      </td>
                                    </tr>
                                  ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {(showBuilderForm || showCustomerForm || showProjectForm) && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 sm:p-8"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="bg-white w-full max-w-3xl rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-slate-200 overflow-hidden flex flex-col max-h-full"
            >
              {/* Modal Header */}
              <div className="px-8 py-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
                    <Plus className="w-5 h-5" />
                  </div>
                  <h2 className="font-bold text-xl text-slate-800">
                    {showBuilderForm ? 'Initialize New Builder' : showCustomerForm ? 'Initialize New Customer' : 'Initialize New Project'}
                  </h2>
                </div>
                <button
                  onClick={() => { setShowBuilderForm(false); setShowCustomerForm(false); setShowProjectForm(false); setError(''); setSuccess(false); }}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8 sm:p-10 overflow-y-auto">

                {/* Status Messages */}
                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-8">
                      <div className="p-5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-4 text-red-600 shadow-sm">
                        <AlertCircle className="w-6 h-6 shrink-0" />
                        <p className="text-sm font-bold">{error}</p>
                      </div>
                    </motion.div>
                  )}
                  {success && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-8">
                      <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-4 text-emerald-700 shadow-sm">
                        <CheckCircle2 className="w-6 h-6 shrink-0" />
                        <p className="text-sm font-bold">
                          {showBuilderForm ? 'Builder successfully integrated.' : showCustomerForm ? 'Customer successfully linked.' : 'Project successfully registered.'}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>



              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Customer Details Modal */}
      <AnimatePresence>
        {showCustomerDetailsModal && selectedCustomer && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Customer Details</h2>
                    <p className="text-sm font-semibold text-slate-500">View comprehensive information</p>
                  </div>
                </div>
                <button onClick={() => setShowCustomerDetailsModal(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto space-y-6 bg-white">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Full Name</p>
                    <p className="font-bold text-slate-900">{selectedCustomer.first_name} {selectedCustomer.last_name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
                    <p className="font-bold text-slate-900">{selectedCustomer.email}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Contact Number</p>
                    <p className="font-bold text-slate-900">{selectedCustomer.phone || 'N/A'}</p>
                  </div>
                  {(selectedCustomer.builder_id) && (
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Builder Assigned</p>
                      <p className="font-bold text-slate-900">{builders.find(b => b.id === selectedCustomer.builder_id)?.contact_name || 'N/A'} ({builders.find(b => b.id === selectedCustomer.builder_id)?.company_name || 'N/A'})</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Floor</p>
                    <p className="font-bold text-slate-900">{selectedCustomer.floor || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Tower Name</p>
                    <p className="font-bold text-slate-900">{selectedCustomer.tower_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Flat Name</p>
                    <p className="font-bold text-slate-900">{selectedCustomer.flat_name || 'N/A'}</p>
                  </div>
                  {(selectedCustomer.customer_type === 'Flat' || selectedCustomer.flat_number) && (
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Flat Number</p>
                      <p className="font-bold text-slate-900">{selectedCustomer.flat_number || 'N/A'}</p>
                    </div>
                  )}
                  {(selectedCustomer.bhk || projects.find(p => p.id === selectedCustomer.project_id)?.bhk) && (
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Project BHK</p>
                      <p className="font-bold text-slate-900">{selectedCustomer.bhk || projects.find(p => p.id === selectedCustomer.project_id)?.bhk}</p>
                    </div>
                  )}
                  {(selectedCustomer.area_sqft || projects.find(p => p.id === selectedCustomer.project_id)?.area_sqft) && (
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Area (sqft)</p>
                      <p className="font-bold text-slate-900">{selectedCustomer.area_sqft || projects.find(p => p.id === selectedCustomer.project_id)?.area_sqft} sqft</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Tower Modal */}
      <AnimatePresence>
        {showTowerForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">{selectedProjectForSidebar?.project_type === 'Society' ? 'Add Section' : 'Add Tower'}</h2>
                    <p className="text-sm font-semibold text-slate-500">Configure {selectedProjectForSidebar?.project_type === 'Society' ? 'section' : 'tower'} details</p>
                  </div>
                </div>
                <button onClick={() => setShowTowerForm(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto bg-white">
                {error && <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl font-semibold text-sm flex items-center gap-3"><AlertCircle className="w-5 h-5 shrink-0" />{error}</div>}
                {error && <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl font-semibold text-sm flex items-center gap-3"><AlertCircle className="w-5 h-5 shrink-0" />{error}</div>}
                {error && <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl font-semibold text-sm flex items-center gap-3"><AlertCircle className="w-5 h-5 shrink-0" />{error}</div>}
                {success && <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl font-semibold text-sm flex items-center gap-3"><CheckCircle2 className="w-5 h-5 shrink-0" />Tower added successfully!</div>}

                {!success && (
                  <form onSubmit={handleTowerSubmit} className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">{selectedProjectForSidebar?.project_type === 'Society' ? 'Section' : 'Tower'} Name / Number</label>
                      <input type="text" name="towerName" required value={towerData.towerName} onChange={handleTowerChange} placeholder={selectedProjectForSidebar?.project_type === 'Society' ? "e.g. Section A" : "e.g. Tower A"} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 font-semibold shadow-sm" />
                    </div>
                    {selectedProjectForSidebar?.project_type === 'Society' ? (
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Total House</label>
                        <input type="number" name="totalHouses" required min="1" value={towerData.totalHouses} onChange={handleTowerChange} placeholder="e.g. 50" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 font-semibold shadow-sm" />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Total Floors</label>
                        <input type="number" name="totalFloors" required min="1" value={towerData.totalFloors} onChange={handleTowerChange} placeholder="e.g. 15" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 font-semibold shadow-sm" />
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">BHK</label>
                      <input type="text" name="bhk" value={towerData.bhk} onChange={handleTowerChange} placeholder="e.g. 2BHK, 3BHK" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 font-semibold shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-3 uppercase tracking-widest">Number Series</label>
                      <div className="flex flex-wrap gap-4">
                        {['1-4', '101-104', '1001-1004'].map((series) => (
                          <label key={series} className={`flex items-center gap-2 px-4 py-3 border rounded-xl cursor-pointer transition-all ${towerData.numberSeries === series ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'}`}>
                            <input type="radio" name="numberSeries" value={series} checked={towerData.numberSeries === series} onChange={handleTowerChange} className="w-4 h-4 text-blue-600 focus:ring-blue-500" required />
                            <span className="font-semibold">{series}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="pt-6 mt-4 flex justify-end border-t border-slate-100">
                      <button type="submit" disabled={isSubmitting} className="group relative px-8 py-3.5 bg-slate-900 text-white font-extrabold rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 min-w-[160px] flex justify-center items-center">
                        {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Save Tower'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Announcement Modal */}
      <AnimatePresence>
        {showAnnouncementForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
                    <Megaphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Add Announcement</h2>
                    <p className="text-sm font-semibold text-slate-500">Create a new project announcement</p>
                  </div>
                </div>
                <button onClick={() => setShowAnnouncementForm(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto bg-white">
                {error && <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl font-semibold text-sm flex items-center gap-3"><AlertCircle className="w-5 h-5 shrink-0" />{error}</div>}
                {error && <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl font-semibold text-sm flex items-center gap-3"><AlertCircle className="w-5 h-5 shrink-0" />{error}</div>}
                {success && <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl font-semibold text-sm flex items-center gap-3"><CheckCircle2 className="w-5 h-5 shrink-0" />Announcement posted successfully!</div>}

                {!success && (
                  <form onSubmit={handleAnnouncementSubmit} className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Project Name</label>
                      <div className="relative">
                        <select
                          name="projectId" required value={announcementData.projectId} onChange={handleAnnouncementChange}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 font-semibold shadow-sm appearance-none cursor-pointer"
                        >
                          <option value="" className="text-slate-400">-- Select a Project --</option>
                          {projects.map(p => (
                            <option key={p.id} value={p.id} className="text-slate-900">{p.project_name}</option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                          <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Title</label>
                      <input type="text" name="title" required value={announcementData.title} onChange={handleAnnouncementChange} placeholder="e.g. Phase 1 Completion" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 font-semibold shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Message</label>
                      <textarea name="message" required value={announcementData.message} onChange={handleAnnouncementChange} placeholder="Write the announcement message here..." rows={4} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 font-semibold shadow-sm resize-none" />
                    </div>
                    <div className="pt-6 mt-4 flex justify-end border-t border-slate-100">
                      <button type="submit" disabled={isSubmitting} className="group relative px-8 py-3.5 bg-slate-900 text-white font-extrabold rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 min-w-[160px] flex justify-center items-center">
                        {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Submit Announcement'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Announcement Details Modal */}
      <AnimatePresence>
        {showAnnouncementDetailsModal && selectedAnnouncement && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 sm:p-8"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="bg-white w-full max-w-lg rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-slate-200 overflow-hidden flex flex-col"
            >
              <div className="px-8 py-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl">
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Announcement</h2>
                    <p className="text-sm font-medium text-slate-500 mt-1">
                      {selectedAnnouncement.created_at ? new Date(selectedAnnouncement.created_at).toLocaleDateString() : selectedAnnouncement.date}
                    </p>
                  </div>
                </div>
                <button onClick={() => setShowAnnouncementDetailsModal(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto">
                <div className="mb-6 inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-[11px] font-bold uppercase tracking-wider rounded-xl">
                  <Megaphone className="w-3.5 h-3.5" />
                  {projects.find(p => p.id === selectedAnnouncement.project_id)?.project_name || selectedProjectForSidebar?.project_name || 'Unknown Project'}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 leading-tight">{selectedAnnouncement.title}</h3>
                <div className="prose prose-slate prose-sm max-w-none">
                  <p className="text-slate-600 whitespace-pre-wrap leading-relaxed text-[15px]">{selectedAnnouncement.message}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Customer Modal */}
      <AnimatePresence>
        {showCustomerForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Add Customer</h2>
                    <p className="text-sm font-semibold text-slate-500">Add a new customer to the network</p>
                  </div>
                </div>
                <button onClick={() => setShowCustomerForm(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto bg-white">
                {error && <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl font-semibold text-sm flex items-center gap-3"><AlertCircle className="w-5 h-5 shrink-0" />{error}</div>}
                {error && <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl font-semibold text-sm flex items-center gap-3"><AlertCircle className="w-5 h-5 shrink-0" />{error}</div>}
                {success && <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl font-semibold text-sm flex items-center gap-3"><CheckCircle2 className="w-5 h-5 shrink-0" />Customer added successfully!</div>}

                {!success && (
                  <form onSubmit={handleCustomerSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Customer Type *</label>
                        <div className="relative">
                          <select
                            name="customerType" required value={customerData.customerType} onChange={handleCustomerChange}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 font-semibold shadow-sm appearance-none cursor-pointer"
                          >
                            <option value="" className="text-slate-400">-- Select a Type --</option>
                            <option value="Flat" className="text-slate-900">Flat</option>
                            <option value="Commercial" className="text-slate-900">Commercial</option>
                            <option value="Society" className="text-slate-900">Society</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
                          </div>
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Assign to Project (Optional)</label>
                        <div className="relative">
                          <select
                            name="projectId" value={customerData.projectId || ''} onChange={(e) => setCustomerData(prev => ({ ...prev, projectId: e.target.value }))}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 font-semibold shadow-sm appearance-none cursor-pointer"
                          >
                            <option value="" className="text-slate-400">-- Select a Project --</option>
                            {projects
                              .filter(p => !customerData.customerType || p.project_type === customerData.customerType)
                              .map(p => (
                                <option key={p.id} value={p.id} className="text-slate-900">{p.project_name}</option>
                              ))}
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">First Name *</label>
                        <input type="text" name="firstName" required value={customerData.firstName} onChange={handleCustomerChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 font-semibold shadow-sm" placeholder="Jane" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Last Name *</label>
                        <input type="text" name="lastName" required value={customerData.lastName} onChange={handleCustomerChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 font-semibold shadow-sm" placeholder="Smith" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Email Address *</label>
                        <input type="email" name="email" required value={customerData.email} onChange={handleCustomerChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 font-semibold shadow-sm" placeholder="jane@example.com" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Phone Number</label>
                        <input type="tel" name="phone" value={customerData.phone} onChange={handleCustomerChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 font-semibold shadow-sm" placeholder="+1 (555) 000-0000" />
                      </div>
                      {customerData.customerType === 'Flat' && customerData.phone.trim().length > 0 && (
                        <>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Flat Name</label>
                            <input type="text" name="flatName" value={customerData.flatName} onChange={handleCustomerChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 font-semibold shadow-sm" placeholder="e.g. Sunrise" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Tower Name</label>
                            <div className="relative">
                              <select
                                name="towerName"
                                value={customerData.towerName}
                                onChange={handleCustomerChange}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 font-semibold shadow-sm appearance-none cursor-pointer"
                              >
                                <option value="" className="text-slate-400">-- Select a Tower --</option>
                                {projectTowers.map(t => (
                                  <option key={t.id} value={t.tower_name} className="text-slate-900">{t.tower_name}</option>
                                ))}
                              </select>
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Floor</label>
                            <div className="relative">
                              <select
                                name="floor"
                                value={customerData.floor}
                                onChange={handleCustomerChange}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 font-semibold shadow-sm appearance-none cursor-pointer"
                              >
                                <option value="" className="text-slate-400">-- Select a Floor --</option>
                                {availableFloors.map(floor => (
                                  <option key={floor} value={floor} className="text-slate-900">{floor}</option>
                                ))}
                              </select>
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Flat Number</label>
                            <div className="relative">
                              <select
                                name="flatNumber"
                                value={customerData.flatNumber}
                                onChange={handleCustomerChange}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 font-semibold shadow-sm appearance-none cursor-pointer"
                              >
                                <option value="" className="text-slate-400">-- Select a Number --</option>
                                {availableFlatNumbers.map(num => (
                                  <option key={num} value={num} className="text-slate-900">{num}</option>
                                ))}
                              </select>
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
                              </div>
                            </div>
                          </div>
                          {(customerData.bhk || customerData.areaSqft) && (
                            <>
                              <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Project BHK</label>
                                <input type="text" readOnly value={customerData.bhk || ''} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-600 font-semibold cursor-not-allowed" placeholder="N/A" />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Project Area (sqft)</label>
                                <input type="text" readOnly value={customerData.areaSqft || ''} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-600 font-semibold cursor-not-allowed" placeholder="N/A" />
                              </div>
                            </>
                          )}
                        </>
                      )}

                    </div>
                    <div className="pt-6 mt-4 flex justify-end border-t border-slate-100">
                      <button type="submit" disabled={isSubmitting || success} className="group relative px-8 py-3.5 bg-slate-900 text-white font-extrabold rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 min-w-[160px] flex justify-center items-center overflow-hidden">
                        <span className="relative z-10">{isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Add Customer'}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Project Modal */}
      <AnimatePresence>
        {showProjectForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Add Project</h2>
                    <p className="text-sm font-semibold text-slate-500">Create a new real estate project</p>
                  </div>
                </div>
                <button onClick={() => setShowProjectForm(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto bg-white">
                {error && <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl font-semibold text-sm flex items-center gap-3"><AlertCircle className="w-5 h-5 shrink-0" />{error}</div>}
                {error && <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl font-semibold text-sm flex items-center gap-3"><AlertCircle className="w-5 h-5 shrink-0" />{error}</div>}
                {success && <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl font-semibold text-sm flex items-center gap-3"><CheckCircle2 className="w-5 h-5 shrink-0" />Project added successfully!</div>}

                {!success && (
                  <form onSubmit={handleProjectSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">


                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Project Type *</label>
                        <div className="relative">
                          <select
                            name="projectType" required value={projectData.projectType} onChange={handleProjectChange}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 font-semibold shadow-sm appearance-none cursor-pointer"
                          >
                            <option value="" className="text-slate-400">-- Select Type --</option>
                            <option value="Flat" className="text-slate-900">Flat</option>
                            <option value="Society" className="text-slate-900">Society</option>
                            <option value="Commercial" className="text-slate-900">Commercial</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
                          </div>
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Project Name *</label>
                        <input type="text" name="projectName" required value={projectData.projectName} onChange={handleProjectChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 font-semibold shadow-sm" placeholder="e.g. Skyline Towers" />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 mb-3 uppercase tracking-widest">Status *</label>
                        <div className="flex flex-wrap gap-4">
                          {['Planning', 'Under Construction', 'Completed'].map((status) => (
                            <label key={status} className={`flex items-center gap-2 px-4 py-3 border rounded-xl cursor-pointer transition-all ${projectData.status === status ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'}`}>
                              <input type="radio" name="status" value={status} checked={projectData.status === status} onChange={handleProjectChange} className="w-4 h-4 text-blue-600 focus:ring-blue-500" required />
                              <span className="font-semibold">{status}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Area (sqft)</label>
                        <input type="text" name="areaSqft" value={projectData.areaSqft} onChange={handleProjectChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 font-semibold shadow-sm" placeholder="e.g. 1500" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Expected Possession</label>
                        <input type="date" name="expectedPossession" value={projectData.expectedPossession} onChange={handleProjectChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 font-semibold shadow-sm" />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Description</label>
                        <textarea name="description" value={projectData.description} onChange={handleProjectChange as any} rows={3} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 font-semibold shadow-sm resize-none" placeholder="Brief description of the project..."></textarea>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Location</label>
                        <input type="text" name="location" value={projectData.location} onChange={handleProjectChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 font-semibold shadow-sm" placeholder="e.g. Downtown Metro" />
                      </div>





                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Cover Image</label>
                        <div className="relative group">
                          {projectData.coverImgUrl ? (
                            <div className="relative w-full h-48 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
                              <img src={projectData.coverImgUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <label className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-lg font-bold text-sm shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
                                  {isUploading ? <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                                  {isUploading ? 'Uploading...' : 'Change Image'}
                                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                                </label>
                              </div>
                            </div>
                          ) : (
                            <label className={`w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${isUploading ? 'border-slate-300 bg-slate-50' : 'border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 bg-slate-50/50'}`}>
                              {isUploading ? (
                                <div className="flex flex-col items-center gap-2 text-slate-400">
                                  <div className="w-6 h-6 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin" />
                                  <span className="text-xs font-bold uppercase tracking-widest">Uploading...</span>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center gap-2 text-slate-500 group-hover:text-blue-600 transition-colors">
                                  <ImageIcon className="w-6 h-6" />
                                  <span className="text-sm font-semibold">Click to browse or drag & drop</span>
                                  <span className="text-xs font-medium text-slate-400">JPG, PNG, WEBP (Max 5MB)</span>
                                </div>
                              )}
                              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="pt-6 mt-4 flex justify-end border-t border-slate-100">
                      <button type="submit" disabled={isSubmitting || success} className="group relative px-8 py-3.5 bg-slate-900 text-white font-extrabold rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 min-w-[160px] flex justify-center items-center overflow-hidden">
                        <span className="relative z-10">{isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Add Project'}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Tower Modal */}
      <AnimatePresence>
        {showTowerForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">{selectedProjectForSidebar?.project_type === 'Society' ? 'Add Section' : 'Add Tower'}</h2>
                    <p className="text-sm font-semibold text-slate-500">Create a new {selectedProjectForSidebar?.project_type === 'Society' ? 'section' : 'tower'} for this project</p>
                  </div>
                </div>
                <button onClick={() => setShowTowerForm(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto bg-white">
                {error && <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl font-semibold text-sm flex items-center gap-3"><AlertCircle className="w-5 h-5 shrink-0" />{error}</div>}
                {error && <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl font-semibold text-sm flex items-center gap-3"><AlertCircle className="w-5 h-5 shrink-0" />{error}</div>}
                {success && <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl font-semibold text-sm flex items-center gap-3"><CheckCircle2 className="w-5 h-5 shrink-0" />Tower added successfully!</div>}

                {!success && (
                  <form onSubmit={handleTowerSubmit} className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">{selectedProjectForSidebar?.project_type === 'Society' ? 'Section Name *' : 'Tower Name *'}</label>
                      <input type="text" name="towerName" required value={towerData.towerName} onChange={handleTowerChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 font-semibold shadow-sm" placeholder={selectedProjectForSidebar?.project_type === 'Society' ? "e.g. Section A" : "e.g. Tower A"} />
                    </div>
                    {selectedProjectForSidebar?.project_type === 'Society' ? (
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Total House</label>
                        <input type="number" name="totalHouses" required min="1" value={towerData.totalHouses} onChange={handleTowerChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 font-semibold shadow-sm" placeholder="e.g. 50" />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Total Floors</label>
                        <input type="number" name="totalFloors" required min="1" value={towerData.totalFloors} onChange={handleTowerChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 font-semibold shadow-sm" placeholder="e.g. 15" />
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">BHK</label>
                      <input type="text" name="bhk" value={towerData.bhk} onChange={handleTowerChange} placeholder="e.g. 2BHK, 3BHK" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 font-semibold shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-3 uppercase tracking-widest">Number Series</label>
                      <div className="flex flex-wrap gap-4">
                        {['1-4', '101-104', '1001-1004'].map((series) => (
                          <label key={series} className={`flex items-center gap-2 px-4 py-3 border rounded-xl cursor-pointer transition-all ${towerData.numberSeries === series ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'}`}>
                            <input type="radio" name="numberSeries" value={series} checked={towerData.numberSeries === series} onChange={handleTowerChange} className="w-4 h-4 text-blue-600 focus:ring-blue-500" required />
                            <span className="font-semibold">{series}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 mt-4 flex justify-end border-t border-slate-100">
                      <button type="submit" disabled={isSubmitting || success} className="group relative px-8 py-3.5 bg-slate-900 text-white font-extrabold rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 min-w-[160px] flex justify-center items-center overflow-hidden">
                        <span className="relative z-10">{isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (selectedProjectForSidebar?.project_type === 'Society' ? 'Save Section' : 'Add Tower')}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
