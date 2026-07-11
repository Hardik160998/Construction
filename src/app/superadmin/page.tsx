'use client';

import { useState, useEffect } from 'react';
import { Building2, Plus, LogOut, CheckCircle2, AlertCircle, Users, HardHat, MapPin, Sparkles, ChevronRight, List, X, UploadCloud, Image as ImageIcon, Briefcase, CreditCard, BarChart2, ArrowRightLeft, TrendingUp, Megaphone, Building, MessageSquare, ArrowLeft, Camera, ChevronLeft, ExternalLink, Layers, Zap, Droplets, LayoutGrid, Home, Package, Wrench } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import CustomSelect from '@/components/CustomSelect';
import FloorList from '@/components/FloorList';
import TowerProgress from '@/components/TowerProgress';
import ProjectImageAnalysisView from '@/components/ProjectImageAnalysisView';

// ── Shimmer Skeletons ──────────────────────────────────────────────────────────
const FloorListSkeleton = () => (
  <div className="w-full">
    <div className="mb-10 flex items-center justify-between bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 relative overflow-hidden">
      <div className="flex items-center gap-6 relative z-10">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-slate-200 rounded-2xl animate-pulse"></div>
          <div className="flex flex-col justify-center gap-2">
            <div className="h-8 w-48 bg-slate-200 rounded-md animate-pulse"></div>
            <div className="h-4 w-64 bg-slate-200 rounded-md animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {[1,2,3,4,5,6,7,8,9,10,11,12].map((i) => (
        <div key={i} className="relative w-full bg-white border border-slate-200 rounded-2xl p-6 pt-8 h-32 animate-pulse flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
          <div className="h-4 w-16 bg-slate-200 rounded-md"></div>
        </div>
      ))}
    </div>
  </div>
);

const TowerProgressSkeleton = () => (
  <div className="w-full">
    <div className="mb-10 flex items-center justify-between bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80">
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 bg-slate-200 rounded-2xl animate-pulse"></div>
        <div className="flex flex-col justify-center gap-2">
          <div className="h-8 w-48 bg-slate-200 rounded-md animate-pulse"></div>
          <div className="h-4 w-64 bg-slate-200 rounded-md animate-pulse"></div>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {[1,2,3,4,5,6].map((i) => (
        <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between animate-pulse h-48">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
                <div className="h-6 w-32 bg-slate-200 rounded-md"></div>
              </div>
              <div className="h-6 w-20 bg-slate-200 rounded-lg"></div>
            </div>
          </div>
          <div className="mt-auto">
            <div className="h-10 w-full bg-slate-100 rounded-xl"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
// ──────────────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const pathname = usePathname();
  const [hasHydrated, setHasHydrated] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'builder' | 'customer' | 'project' | 'inquiry'>(() => {
    if (typeof window !== 'undefined') {
      if (pathname?.includes('/customer')) return 'customer';
      if (pathname?.includes('/project')) return 'project';
      if (pathname?.includes('/inquiry')) return 'inquiry';
    }
    return 'builder';
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Lists for tables
  const [builders, setBuilders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [towers, setTowers] = useState<any[]>([]);
  const [isTowersLoading, setIsTowersLoading] = useState(false);
  const [towerProgressMap, setTowerProgressMap] = useState<Record<string, number>>({});
  const [inquiries, setInquiries] = useState<any[]>([]);

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
  
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [showInquiryDetailsModal, setShowInquiryDetailsModal] = useState(false);
  
  const [selectedBuilder, setSelectedBuilder] = useState<any>(null);
  const [showBuilderDetailsModal, setShowBuilderDetailsModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showCustomerDetailsModal, setShowCustomerDetailsModal] = useState(false);
  const [selectedProjectForSidebar, setSelectedProjectForSidebar] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const projectId = params.get('projectId');
      if (projectId) return { id: projectId, _id: projectId, project_name: 'Loading Project Data...' };
    }
    return null;
  });
  const [activeProjectSubTab, setActiveProjectSubTab] = useState<'progress' | 'announcement' | 'tower_view' | 'staff' | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('projectId')) {
        return (params.get('subtab') as any) || 'progress';
      }
    }
    return null;
  });
  const [selectedTowerForView, setSelectedTowerForView] = useState<any>(null);
  const [selectedFloorForView, setSelectedFloorForView] = useState<number | null>(null);
  const [showProjectImgAnalysis, setShowProjectImgAnalysis] = useState(false);

  // Pagination States
  const [builderPage, setBuilderPage] = useState(1);
  const [builderPerPage, setBuilderPerPage] = useState(10);
  const [customerPage, setCustomerPage] = useState(1);
  const [customerPerPage, setCustomerPerPage] = useState(10);
  const [projectPage, setProjectPage] = useState(1);
  const [projectPerPage, setProjectPerPage] = useState(10);
  const [projectBuilderFilter, setProjectBuilderFilter] = useState('');
  const [builderCompanyFilter, setBuilderCompanyFilter] = useState('');
  const [customerBuilderFilter, setCustomerBuilderFilter] = useState('');
  const [builderSort, setBuilderSort] = useState<{ field: 'company_name' | 'contact_name', order: 'asc' | 'desc' } | null>(null);

  // Form States
  const [builderData, setBuilderData] = useState({
    companyName: '', contactName: '', email: '', phone: '', projectId: '',
  });

  const [customerData, setCustomerData] = useState({
    builderId: '', firstName: '', lastName: '', email: '', phone: '', floor: '', towerName: '', flatName: '', areaSqft: ''
  });

  const [projectData, setProjectData] = useState({
    projectName: '', location: '', status: '', description: '', coverImgUrl: '', expectedPossession: '', builderId: '', projectType: '', googleMapUrl: ''
  });

  const [towerData, setTowerData] = useState({
    towerName: '', totalFloors: '', totalHouses: '', numberSeries: ''
  });

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
    const fetchInitialData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchBuilders(),
        fetchCustomers(),
        fetchProjects(),
        fetchInquiries()
      ]);
      setIsLoading(false);
    };
    fetchInitialData();

    const handlePopState = () => {
      const pathname = window.location.pathname;
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      
      if (pathname.includes('/customer') || tab === 'customer') {
        setActiveTab('customer');
      } else if (pathname.includes('/project') || tab === 'project') {
        setActiveTab('project');
      } else if (pathname.includes('/inquiry') || tab === 'inquiry') {
        setActiveTab('inquiry');
      } else {
        setActiveTab('builder');
      }
    };

    // Initial check
    handlePopState();

    setHasHydrated(true);

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
      if (data.success) {
        setProjects(data.projects);
        
        // Restore project subtab state if exists
        const params = new URLSearchParams(window.location.search);
        const projectId = params.get('projectId');
        if (projectId) {
          const foundProject = data.projects.find((p: any) => p.id === projectId || p._id === projectId);
          if (foundProject) {
            setSelectedProjectForSidebar(foundProject);
            const subtab = params.get('subtab');
            if (subtab) setActiveProjectSubTab(subtab as any);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load projects', err);
    }
  };

  const fetchInquiries = async () => {
    try {
      const res = await fetch('/api/admin/contact');
      const data = await res.json();
      if (data.success) setInquiries(data.contacts || []);
    } catch (err) {
      console.error('Failed to load inquiries', err);
    }
  };

  const fetchTowers = async (projectId: string) => {
    setIsTowersLoading(true);
    try {
      const res = await fetch(`/api/admin/tower?projectId=${projectId}`);
      const data = await res.json();
      if (data.success) {
        const fetchedTowers = data.towers || [];
        setTowers(fetchedTowers);
        
        if (fetchedTowers.length > 0) {
          const projectType = fetchedTowers[0].project_type || selectedProjectForSidebar?.project_type || 'Flat';
          const bulkRes = await fetch('/api/admin/bulk-progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ towers: fetchedTowers, projectType })
          });
          const bulkData = await bulkRes.json();
          if (bulkData.success) {
            setTowerProgressMap(bulkData.towerProgressMap || {});
          }
          
          // Restore tower selection from URL if present
          if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const towerId = params.get('towerId');
            if (towerId) {
              const foundTower = fetchedTowers.find((t: any) => t.id === towerId || t._id === towerId);
              if (foundTower) {
                setSelectedTowerForView(foundTower);
                const floor = params.get('floor');
                if (floor) {
                  setSelectedFloorForView(parseInt(floor));
                }
              }
            }
          }
        } else {
          setTowerProgressMap({});
        }
      }
    } catch (err) {
      console.error('Failed to load towers', err);
    } finally {
      setIsTowersLoading(false);
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
    if (!customerData.builderId) {
      setError('Please select a builder first.');
      return;
    }
    
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
      setCustomerData({ builderId: customerData.builderId, firstName: '', lastName: '', email: '', phone: '', floor: '', towerName: '', flatName: '', areaSqft: '' });
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
      setProjectData({ projectName: '', location: '', status: '', description: '', coverImgUrl: '', expectedPossession: '', builderId: '', projectType: '', googleMapUrl: '' });
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
          numberSeries: towerData.numberSeries
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
    { id: 'builder', label: 'Builder', icon: HardHat },
    { id: 'project', label: 'Project', icon: MapPin },
    { id: 'customer', label: 'Customer', icon: Users },
    { id: 'inquiry', label: 'Inquiries', icon: MessageSquare }
  ] as const;

  // We add ArrowLeft to the icons imported from lucide-react if not present, wait it is imported? 
  // Let's make sure ArrowLeft is imported.

  const handleTabChange = (tabId: 'builder' | 'customer' | 'project' | 'inquiry') => {
    setActiveTab(tabId);
    setError('');
    setSuccess(false);
    setShowBuilderForm(false);
    setShowCustomerForm(false);
    setShowProjectForm(false);
    setActiveProjectSubTab(null);
    
    // Sync with URL
    const newPath = tabId === 'customer' ? '/superadmin/customer' 
                  : tabId === 'project' ? '/superadmin/project' 
                  : tabId === 'inquiry' ? '/superadmin/inquiry'
                  : '/superadmin/builder-matrix';
    window.history.pushState(null, '', newPath);
  };

  if (!hasHydrated) {
    return (
      <div className="h-screen w-full bg-[#f4f7f9] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

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
              SuperAdmin
            </span>
            <div className="text-[10px] uppercase tracking-[0.2em] text-blue-600 font-bold mt-0.5">Admin Workspace</div>
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
                    className={`group relative flex items-center justify-between w-full px-5 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                      isActive 
                        ? 'text-blue-700 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-slate-200' 
                        : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-100'
                    } border`}
                  >
                    {/* Active Background Glow */}
                    {isActive && (
                      <motion.div layoutId="activeTab" className="absolute inset-0 bg-blue-50/40 rounded-2xl" />
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
                          <button onClick={(e) => { 
                            e.stopPropagation(); 
                            setSelectedProjectForSidebar(null); 
                            setActiveProjectSubTab(null); 
                            window.history.pushState(null, '', '/superadmin/project');
                          }} className="p-1 bg-white border border-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors shadow-sm shrink-0 flex items-center justify-center">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        
                        <div className="flex flex-col gap-1 relative before:absolute before:left-[22px] before:top-2 before:bottom-4 before:w-[1.5px] before:bg-slate-100/80 before:rounded-full">
                          <button onClick={() => {
                            setActiveProjectSubTab('progress');
                            window.history.pushState(null, '', `/superadmin/project?projectId=${selectedProjectForSidebar?.id || selectedProjectForSidebar?._id}&subtab=progress`);
                          }} className={`w-full flex items-center gap-4 px-4 py-3 relative z-10 group transition-all rounded-xl ${activeProjectSubTab === 'progress' ? 'bg-blue-50/50' : ''}`}>
                            <div className="bg-[#f4f7f9] z-10 relative"><TrendingUp className={`w-[18px] h-[18px] transition-colors ${activeProjectSubTab === 'progress' ? 'text-blue-600' : 'text-slate-500 group-hover:text-blue-500'}`} /></div>
                            <span className={`text-[14.5px] font-bold transition-colors ${activeProjectSubTab === 'progress' ? 'text-blue-700' : 'text-slate-600 group-hover:text-slate-800'}`}>Progress</span>
                          </button>
                          <button onClick={() => {
                            setActiveProjectSubTab('announcement');
                            window.history.pushState(null, '', `/superadmin/project?projectId=${selectedProjectForSidebar?.id || selectedProjectForSidebar?._id}&subtab=announcement`);
                          }} className={`w-full flex items-center gap-4 px-4 py-3 relative z-10 group transition-all rounded-xl ${activeProjectSubTab === 'announcement' ? 'bg-blue-50/50' : ''}`}>
                            <div className="bg-[#f4f7f9] z-10 relative"><Megaphone className={`w-[18px] h-[18px] transition-colors ${activeProjectSubTab === 'announcement' ? 'text-blue-600' : 'text-slate-500 group-hover:text-blue-500'}`} /></div>
                            <span className={`text-[14.5px] font-bold transition-colors ${activeProjectSubTab === 'announcement' ? 'text-blue-700' : 'text-slate-600 group-hover:text-slate-800'}`}>Announcement</span>
                          </button>

                          <button onClick={() => {
                            setActiveProjectSubTab('staff');
                            window.history.pushState(null, '', `/superadmin/project?projectId=${selectedProjectForSidebar?.id || selectedProjectForSidebar?._id}&subtab=staff`);
                          }} className={`w-full flex items-center gap-4 px-4 py-3 relative z-10 group transition-all rounded-xl ${activeProjectSubTab === 'staff' ? 'bg-blue-50/50' : ''}`}>
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
                  {activeProjectSubTab !== 'tower_view' && (
                  <div className="flex items-center justify-between bg-white/60 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-5 shadow-sm">
                    <div className="flex items-center gap-5">
                      <button onClick={() => {
                        if (showProjectImgAnalysis) {
                          setShowProjectImgAnalysis(false);
                        } else {
                          setActiveProjectSubTab(null);
                          window.history.pushState(null, '', `/superadmin/project?projectId=${selectedProjectForSidebar?.id || selectedProjectForSidebar?._id}`);
                        }
                      }} className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-all group shrink-0">
                        <ChevronRight className="w-5 h-5 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
                      </button>
                      
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
                          activeProjectSubTab === 'announcement' 
                            ? 'bg-gradient-to-br from-indigo-100 to-blue-50 text-indigo-600' 
                            : activeProjectSubTab === 'staff'
                            ? 'bg-gradient-to-br from-emerald-100 to-teal-50 text-emerald-600'
                            : 'bg-gradient-to-br from-violet-100 to-fuchsia-50 text-violet-600'
                        }`}>
                          {activeProjectSubTab === 'announcement' ? <Megaphone className="w-6 h-6" /> : activeProjectSubTab === 'staff' ? <Briefcase className="w-6 h-6" /> : <Building className="w-6 h-6" />}
                        </div>
                        <div>
                          <h2 className="text-2xl font-black text-slate-900 tracking-tight capitalize flex items-center gap-2">
                            {activeProjectSubTab === 'announcement' ? 'Announcements' : selectedProjectForSidebar.project_name}
                          </h2>
                          <p className="text-sm font-semibold text-slate-500 mt-0.5 flex items-center gap-1.5">
                            {activeProjectSubTab === 'announcement' ? (
                              'View announcements for this project'
                            ) : (
                              <>
                                <MapPin className="w-3.5 h-3.5" /> 
                                <span>{selectedProjectForSidebar.location || 'Location N/A'}</span>
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {activeProjectSubTab === 'progress' && !showProjectImgAnalysis && towers.length > 0 && (
                      <button
                        onClick={() => setShowProjectImgAnalysis(true)}
                        className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white text-sm font-bold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all"
                      >
                        <Camera className="w-4 h-4" />
                        Img Analysis
                      </button>
                    )}
                  </div>
                  )}


                  {activeProjectSubTab === 'progress' ? (
                    showProjectImgAnalysis ? (
                      <ProjectImageAnalysisView project={selectedProjectForSidebar} />
                    ) : isTowersLoading ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-slate-200 rounded-xl animate-pulse"></div>
                              <div>
                                <div className="h-5 w-24 bg-slate-200 rounded-md animate-pulse mb-1.5"></div>
                                <div className="h-3 w-16 bg-slate-200 rounded-md animate-pulse"></div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <div className="h-8 w-12 bg-slate-200 rounded-md animate-pulse"></div>
                              <div className="h-2 w-14 bg-slate-200 rounded-md animate-pulse"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : towers.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {towers.map(tower => (
                          <div 
                            key={tower.id} 
                            onClick={() => { 
                              setSelectedTowerForView(tower); 
                              setSelectedFloorForView(null); 
                              setActiveProjectSubTab('tower_view'); 
                              const url = new URL(window.location.href);
                              url.searchParams.set('subtab', 'tower_view');
                              url.searchParams.set('towerId', tower.id || tower._id);
                              url.searchParams.delete('floor');
                              window.history.pushState(null, '', url.toString());
                            }}
                            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group flex items-center justify-between cursor-pointer hover:border-blue-300 block"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                <Building className="w-6 h-6" />
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-0.5">{tower.tower_name}</h3>
                                <p className="text-sm font-semibold text-slate-500">{tower.total_floors} Floors</p>
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-1">
                              <span className="text-2xl font-black text-emerald-600 tracking-tight">
                                {towerProgressMap[tower.id] || 0}%
                              </span>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                Completed
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-8 py-16 bg-slate-50/50 border border-slate-200/60 border-dashed rounded-3xl flex flex-col items-center justify-center text-center px-4">
                        <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                          <Building className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-extrabold text-slate-900 mb-2">No Towers or Sections Found</h3>
                        <p className="text-slate-500 max-w-sm">This project doesn't have any towers or commercial sections initialized yet.</p>
                      </div>
                    )
                  ) : activeProjectSubTab === 'tower_view' ? (
                    !selectedTowerForView 
                      ? (selectedFloorForView !== null || (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('floor'))
                          ? <TowerProgressSkeleton key="tower-progress-sk" />
                          : <FloorListSkeleton key="floor-list-sk" />)
                      : (
                    <div className="mt-4">
                      {selectedFloorForView ? (
                        <TowerProgress
                          towerId={selectedTowerForView.id}
                          towerName={selectedTowerForView.tower_name}
                          floorNumber={selectedFloorForView}
                          unitType={selectedTowerForView.total_houses ? 'House' : 'Floor'}
                          onBack={() => {
                            setSelectedFloorForView(null);
                            const url = new URL(window.location.href);
                            url.searchParams.delete('floor');
                            window.history.pushState(null, '', url.toString());
                          }}
                        />
                      ) : (
                        <FloorList
                          towerId={selectedTowerForView.id}
                          towerName={selectedTowerForView.tower_name}
                          totalFloors={selectedTowerForView.total_floors || selectedTowerForView.total_houses || 0}
                          numberSeries={selectedTowerForView.number_series}
                          unitType={selectedTowerForView.total_houses ? 'House' : 'Floor'}
                          onSelectFloor={(floor) => {
                            setSelectedFloorForView(floor);
                            const url = new URL(window.location.href);
                            url.searchParams.set('floor', floor.toString());
                            window.history.pushState(null, '', url.toString());
                          }}
                          onBack={() => { 
                            setActiveProjectSubTab('progress'); 
                            setSelectedTowerForView(null); 
                            const url = new URL(window.location.href);
                            url.searchParams.set('subtab', 'progress');
                            url.searchParams.delete('towerId');
                            url.searchParams.delete('floor');
                            window.history.pushState(null, '', url.toString());
                          }}
                        />
                      )}
                    </div>
                    )
                  ) : activeProjectSubTab === 'announcement' ? (
                    announcements.length > 0 ? (
                      <motion.div 
                        initial="hidden" 
                        animate="visible" 
                        variants={{
                          hidden: { opacity: 0 },
                          visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                        }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      >
                        {announcements.map((ann) => (
                          <motion.div 
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                            key={ann.id} 
                            onClick={() => { setSelectedAnnouncement(ann); setShowAnnouncementDetailsModal(true); }} 
                            className="relative bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 group cursor-pointer overflow-hidden flex flex-col justify-between min-h-[220px] hover:-translate-y-1 hover:border-indigo-300/50"
                          >
                            {/* Decorative background glow */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-indigo-500/10 to-purple-500/5 rounded-full blur-3xl group-hover:from-indigo-500/20 group-hover:to-purple-500/10 transition-colors pointer-events-none -mr-12 -mt-12" />
                            
                            <div className="relative z-10">
                              <div className="flex justify-between items-start mb-5">
                                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 text-[10px] font-black uppercase tracking-widest rounded-xl shadow-sm border border-indigo-100/50">
                                  <Megaphone className="w-3.5 h-3.5" />
                                  <span className="truncate max-w-[120px]">{projects.find(p => p.id === ann.project_id)?.project_name || selectedProjectForSidebar?.project_name || 'Project'}</span>
                                </div>
                                <span className="text-[11px] font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm">
                                  {ann.created_at ? new Date(ann.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : ann.date}
                                </span>
                              </div>
                              <h3 className="text-xl font-extrabold text-slate-900 mb-3 leading-tight group-hover:text-indigo-700 transition-colors line-clamp-2">{ann.title}</h3>
                              <p className="text-sm font-medium text-slate-500 leading-relaxed line-clamp-3">{ann.message}</p>
                            </div>
                            
                            <div className="relative z-10 mt-6 pt-4 border-t border-slate-100/80 flex items-center justify-between">
                              <span className="text-xs font-bold text-indigo-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                                Read Announcement <ChevronRight className="w-3.5 h-3.5" />
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      <div className="bg-white/50 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                          <Megaphone className="w-10 h-10 text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900 mb-2">No Announcements</h3>
                        <p className="text-sm font-medium text-slate-500 max-w-sm">There are no announcements for this project yet.</p>
                      </div>
                    )
                  ) : activeProjectSubTab === 'staff' && staffList.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <div className="flex items-center justify-center min-h-[400px]">
                      <p className="text-center text-slate-400/80 font-medium text-lg tracking-wide">
                        {activeProjectSubTab === 'staff'
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
                initial={{ opacity: isLoading ? 1 : 0, y: isLoading ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                className="mb-10 relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 p-8 sm:p-10 shadow-2xl border border-white/10"
              >
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-violet-500/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3" />
                
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2 flex items-center gap-4">
                      <div className="p-3 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
                        {activeTab === 'builder' ? <HardHat className="w-8 h-8 text-blue-400" /> : 
                         activeTab === 'customer' ? <Users className="w-8 h-8 text-blue-400" /> : 
                         activeTab === 'inquiry' ? <MessageSquare className="w-8 h-8 text-blue-400" /> : 
                         <MapPin className="w-8 h-8 text-blue-400" />}
                      </div>
                      <span className="drop-shadow-sm">
                        {activeTab === 'builder' ? 'Builders' : activeTab === 'customer' ? 'Customers' : activeTab === 'inquiry' ? 'Inquiries' : 'Projects'}
                      </span>
                    </h1>
                    <p className="text-[15px] font-medium text-blue-100/80 mt-4 max-w-2xl leading-relaxed">
                        {activeTab === 'builder' 
                        ? 'Deploy new construction companies to the SuperAdmin ecosystem.' 
                        : activeTab === 'customer' 
                          ? 'Integrate new buyers and assign them directly to active builders.'
                          : activeTab === 'inquiry'
                            ? 'View and manage contact inquiries from the website.'
                            : 'Initialize new real estate projects for the global tracker.'}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Form or List Card */}
              <motion.div 
                key={`form-${activeTab}`}
                initial={{ opacity: isLoading ? 1 : 0, y: isLoading ? 0 : 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}
                className="bg-white/80 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-[0_20px_60px_rgba(0,0,0,0.05)] overflow-hidden relative group"
              >
                <div className="px-8 py-6 border-b border-slate-100 bg-white/50 flex items-center justify-between relative z-30">
                   <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-gradient-to-br from-blue-50 to-violet-50 text-blue-600 rounded-xl border border-blue-100">
                        <List className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-8">
                        <h2 className="font-bold text-xl text-slate-800">
                          {activeTab === 'builder' ? 'Active Builders' : activeTab === 'customer' ? 'Active Customers' : activeTab === 'inquiry' ? 'Recent Inquiries' : 'Active Projects'}
                        </h2>
                        
                        {/* Global Company Filter Dropdown */}
                        {(activeTab === 'builder' || activeTab === 'customer' || (activeTab === 'project' && !activeProjectSubTab)) && (
                          <div className="hidden sm:flex items-center gap-3">
                            <span className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">Filter:</span>
                            <CustomSelect 
                              value={activeTab === 'builder' ? builderCompanyFilter : activeTab === 'customer' ? customerBuilderFilter : projectBuilderFilter}
                              onChange={(val) => { 
                                if (activeTab === 'builder') {
                                  setBuilderCompanyFilter(val);
                                  setBuilderPage(1);
                                } else if (activeTab === 'customer') {
                                  setCustomerBuilderFilter(val);
                                  setCustomerPage(1);
                                } else {
                                  setProjectBuilderFilter(val);
                                  setProjectPage(1);
                                }
                              }}
                              options={[
                                { label: 'All Companies', value: '' },
                                ...(activeTab === 'builder' 
                                  ? Array.from(new Set(builders.map(b => b.company_name))).sort().map(name => ({ label: name, value: name }))
                                  : builders.map(b => ({ label: b.company_name, value: b.id }))
                                )
                              ]}
                              className="min-w-[200px]"
                              dropdownPosition="bottom"
                            />
                          </div>
                        )}
                      </div>
                   </div>
                   
                   {/* Add Button Toggles Modal */}
                   {activeTab === 'project' && activeProjectSubTab === 'progress' && selectedProjectForSidebar && (
                      <button onClick={() => setShowTowerForm(true)} className="px-5 py-2.5 font-bold text-sm rounded-xl transition-all shadow-[0_5px_15px_rgba(59,130,246,0.3)] bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-90 text-white flex items-center gap-2 shrink-0">
                        <Plus className="w-4 h-4" /> {selectedProjectForSidebar?.project_type === 'Society' ? 'Add Section' : 'Add Tower'}
                      </button>
                    )}
                   {activeTab === 'builder' && (
                     <button onClick={() => setShowBuilderForm(true)} className="px-5 py-2.5 font-bold text-sm rounded-xl transition-all shadow-[0_5px_15px_rgba(59,130,246,0.3)] bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-90 text-white flex items-center gap-2">
                       <Plus className="w-4 h-4" /> Add Builder
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
                            <th className="pb-4 px-4">
                              <div className="flex items-center gap-2">
                                Contact Builder
                                <button 
                                  onClick={() => setBuilderSort(prev => prev?.field === 'contact_name' ? (prev.order === 'asc' ? { field: 'contact_name', order: 'desc' } : null) : { field: 'contact_name', order: 'asc' })}
                                  className="px-1.5 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-500 transition-colors"
                                  title="Sort Alphabetically"
                                >
                                  {builderSort?.field === 'contact_name' ? (builderSort.order === 'desc' ? 'Z-A' : 'A-Z') : 'Sort'}
                                </button>
                              </div>
                            </th>
                            <th className="pb-4 px-4">
                              <div className="flex items-center gap-2">
                                Company Name
                                <button 
                                  onClick={() => setBuilderSort(prev => prev?.field === 'company_name' ? (prev.order === 'asc' ? { field: 'company_name', order: 'desc' } : null) : { field: 'company_name', order: 'asc' })}
                                  className="px-1.5 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-500 transition-colors"
                                  title="Sort Alphabetically"
                                >
                                  {builderSort?.field === 'company_name' ? (builderSort.order === 'desc' ? 'Z-A' : 'A-Z') : 'Sort'}
                                </button>
                              </div>
                            </th>
                            <th className="pb-4 px-4">Email</th>
                            <th className="pb-4 px-4">Mobile No</th>
                            <th className="pb-4 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="text-slate-700">
                          {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                              <tr key={`skeleton-${i}`} className="border-b border-slate-100">
                                <td className="py-5 px-4"><div className="h-4 w-32 bg-slate-200 rounded-md animate-pulse"></div></td>
                                <td className="py-5 px-4"><div className="h-4 w-40 bg-slate-200 rounded-md animate-pulse"></div></td>
                                <td className="py-5 px-4"><div className="h-4 w-48 bg-slate-200 rounded-md animate-pulse"></div></td>
                                <td className="py-5 px-4"><div className="h-4 w-28 bg-slate-200 rounded-md animate-pulse"></div></td>
                                <td className="py-5 px-4"><div className="h-8 w-16 bg-slate-200 rounded-lg animate-pulse ml-auto"></div></td>
                              </tr>
                            ))
                          ) : builders.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="py-12 text-center text-slate-500 font-medium">
                                No builders deployed yet. Click 'Add Builder' to initialize one.
                              </td>
                            </tr>
                          ) : (() => {
                            const filteredBuilders = builders.filter(b => builderCompanyFilter ? b.company_name === builderCompanyFilter : true);
                            
                            if (filteredBuilders.length === 0) {
                              return (
                                <tr>
                                  <td colSpan={5} className="py-12 text-center text-slate-500 font-medium">
                                    No builders match the selected company.
                                  </td>
                                </tr>
                              );
                            }

                            return [...filteredBuilders]
                              .sort((a, b) => {
                                if (!builderSort) return 0;
                                const nameA = (a[builderSort.field] || '').toLowerCase();
                                const nameB = (b[builderSort.field] || '').toLowerCase();
                                if (builderSort.order === 'asc') return nameA.localeCompare(nameB);
                                return nameB.localeCompare(nameA);
                              })
                              .slice((builderPage - 1) * builderPerPage, builderPage * builderPerPage)
                              .map((builder) => (
                              <tr 
                                key={builder.id} 
                                onClick={() => { setSelectedBuilder(builder); setShowBuilderDetailsModal(true); }}
                                className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group cursor-pointer"
                              >
                                <td className="py-5 px-4 font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{builder.contact_name}</td>
                                <td className="py-5 px-4 text-slate-600 font-medium">{builder.company_name}</td>
                                <td className="py-5 px-4 text-slate-600 font-medium">{builder.email}</td>
                                <td className="py-5 px-4 text-slate-600 font-medium">{builder.phone || 'N/A'}</td>
                                <td className="py-5 px-4 text-right">
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); setSelectedBuilder(builder); setShowBuilderDetailsModal(true); }}
                                    className="inline-flex items-center justify-center px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                                  >
                                    View
                                  </button>
                                </td>
                              </tr>
                              ));
                          })()}
                        </tbody>
                      </table>
                      
                      {/* Pagination Controls */}
                      {(() => {
                        const filteredBuilders = builders.filter(b => builderCompanyFilter ? b.company_name === builderCompanyFilter : true);
                        if (filteredBuilders.length === 0) return null;
                        
                        return (
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-slate-500 font-medium">Rows per page:</span>
                              <select
                                value={builderPerPage}
                                onChange={(e) => {
                                  setBuilderPerPage(Number(e.target.value));
                                  setBuilderPage(1);
                                }}
                                className="px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                              </select>
                            </div>
                            
                            <div className="flex items-center gap-4">
                              <span className="text-sm font-medium text-slate-500">
                                Page {builderPage} of {Math.ceil(filteredBuilders.length / builderPerPage) || 1}
                              </span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setBuilderPage(p => Math.max(1, p - 1))}
                                  disabled={builderPage === 1}
                                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  Previous
                                </button>
                                <button
                                  onClick={() => setBuilderPage(p => Math.min(Math.ceil(filteredBuilders.length / builderPerPage) || 1, p + 1))}
                                  disabled={builderPage === (Math.ceil(filteredBuilders.length / builderPerPage) || 1)}
                                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  Next
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* CUSTOMER LIST VIEW */}
                  {activeTab === 'customer' && (
                    <div className="overflow-x-auto -mx-4 sm:-mx-0">
                      <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-widest">
                            <th className="pb-4 px-4">Name</th>
                            <th className="pb-4 px-4">Email</th>
                            <th className="pb-4 px-4">Contact No</th>
                            <th className="pb-4 px-4">Builder Company</th>
                            <th className="pb-4 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="text-slate-700">
                          {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                              <tr key={`skeleton-${i}`} className="border-b border-slate-100">
                                <td className="py-5 px-4"><div className="h-4 w-32 bg-slate-200 rounded-md animate-pulse"></div></td>
                                <td className="py-5 px-4"><div className="h-4 w-40 bg-slate-200 rounded-md animate-pulse"></div></td>
                                <td className="py-5 px-4"><div className="h-4 w-28 bg-slate-200 rounded-md animate-pulse"></div></td>
                                <td className="py-5 px-4"><div className="h-4 w-48 bg-slate-200 rounded-md animate-pulse"></div></td>
                                <td className="py-5 px-4"><div className="h-8 w-16 bg-slate-200 rounded-lg animate-pulse ml-auto"></div></td>
                              </tr>
                            ))
                          ) : (() => {
                            const filteredCustomers = customers.filter(c => customerBuilderFilter ? c.builder_id === customerBuilderFilter : true);
                            
                            if (filteredCustomers.length === 0) {
                              return (
                                <tr>
                                  <td colSpan={5} className="py-12 text-center text-slate-500 font-medium">
                                    {customers.length === 0 ? 'No customers found in the network yet.' : 'No customers match the selected company.'}
                                  </td>
                                </tr>
                              );
                            }

                            return filteredCustomers.slice((customerPage - 1) * customerPerPage, customerPage * customerPerPage).map((customer) => (
                              <tr 
                                key={customer.id} 
                                onClick={() => { setSelectedCustomer(customer); setShowCustomerDetailsModal(true); }}
                                className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group cursor-pointer"
                              >
                                <td className="py-5 px-4 font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{customer.first_name} {customer.last_name}</td>
                                <td className="py-5 px-4 text-slate-600 font-medium">{customer.email}</td>
                                <td className="py-5 px-4 text-slate-600 font-medium">{customer.phone || 'N/A'}</td>
                                <td className="py-5 px-4 text-slate-600 font-medium">
                                  {builders.find(b => b.id === customer.builder_id)?.company_name || 'N/A'}
                                </td>
                                <td className="py-5 px-4 text-right">
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); setSelectedCustomer(customer); setShowCustomerDetailsModal(true); }}
                                    className="inline-flex items-center justify-center px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                                  >
                                    View
                                  </button>
                                </td>
                              </tr>
                            ));
                          })()}
                        </tbody>
                      </table>
                      
                      {/* Pagination Controls */}
                      {(() => {
                        const filteredCustomers = customers.filter(c => customerBuilderFilter ? c.builder_id === customerBuilderFilter : true);
                        if (filteredCustomers.length === 0) return null;
                        
                        return (
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-slate-500 font-medium">Rows per page:</span>
                              <select
                                value={customerPerPage}
                                onChange={(e) => {
                                  setCustomerPerPage(Number(e.target.value));
                                  setCustomerPage(1);
                                }}
                                className="px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                              </select>
                            </div>
                            
                            <div className="flex items-center gap-4">
                              <span className="text-sm font-medium text-slate-500">
                                Page {customerPage} of {Math.ceil(filteredCustomers.length / customerPerPage) || 1}
                              </span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setCustomerPage(p => Math.max(1, p - 1))}
                                  disabled={customerPage === 1}
                                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  Previous
                                </button>
                                <button
                                  onClick={() => setCustomerPage(p => Math.min(Math.ceil(filteredCustomers.length / customerPerPage) || 1, p + 1))}
                                  disabled={customerPage === (Math.ceil(filteredCustomers.length / customerPerPage) || 1)}
                                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  Next
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                  {/* PROJECT LIST VIEW */}
                  {activeTab === 'project' && !activeProjectSubTab && (
                    <div className="overflow-x-auto -mx-4 sm:-mx-0">
                      <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-widest">
                            <th className="pb-4 px-4">Project Name</th>
                            <th className="pb-4 px-4">Location</th>
                            <th className="pb-4 px-4">Builder</th>
                            <th className="pb-4 px-4">Expected Possession</th>
                            <th className="pb-4 px-4 text-right">Status</th>
                            <th className="pb-4 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="text-slate-700">
                          {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                              <tr key={`skeleton-${i}`} className="border-b border-slate-100">
                                <td className="py-5 px-4"><div className="h-4 w-32 bg-slate-200 rounded-md animate-pulse"></div></td>
                                <td className="py-5 px-4"><div className="h-4 w-40 bg-slate-200 rounded-md animate-pulse"></div></td>
                                <td className="py-5 px-4"><div className="h-4 w-32 bg-slate-200 rounded-md animate-pulse"></div></td>
                                <td className="py-5 px-4"><div className="h-4 w-28 bg-slate-200 rounded-md animate-pulse"></div></td>
                                <td className="py-5 px-4"><div className="h-6 w-24 bg-slate-200 rounded-full animate-pulse ml-auto"></div></td>
                                <td className="py-5 px-4"><div className="h-8 w-16 bg-slate-200 rounded-lg animate-pulse ml-auto"></div></td>
                              </tr>
                            ))
                          ) : (() => {
                            const filteredProjects = projects.filter(p => projectBuilderFilter ? p.builder_id === projectBuilderFilter : true);
                            
                            if (filteredProjects.length === 0) {
                              return (
                                <tr>
                                  <td colSpan={6} className="py-12 text-center text-slate-500 font-medium">
                                    {projects.length === 0 ? 'No projects registered in the network yet.' : 'No projects found for the selected company.'}
                                  </td>
                                </tr>
                              );
                            }

                            return filteredProjects.slice((projectPage - 1) * projectPerPage, projectPage * projectPerPage).map((project) => (
                              <tr 
                                key={project.id} 
                                onClick={() => { 
                                  setSelectedProjectForSidebar(project); 
                                  setActiveProjectSubTab('progress'); 
                                  window.history.pushState(null, '', `/superadmin/project?projectId=${project.id}&subtab=progress`);
                                }}
                                className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group cursor-pointer"
                              >
                                <td className="py-5 px-4 font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{project.project_name}</td>
                                <td className="py-5 px-4 text-slate-600 font-medium">{project.location || 'N/A'}</td>
                                <td className="py-5 px-4 text-slate-600 font-medium">
                                  {project.builder_id ? (
                                    builders.find(b => b.id === project.builder_id)?.company_name || 'Unknown Builder'
                                  ) : (
                                    <span className="text-red-500 italic">Unassigned (Null)</span>
                                  )}
                                </td>
                                <td className="py-5 px-4 text-slate-600 font-medium">{project.expected_possession || project.expectedPossession || 'N/A'}</td>
                                <td className="py-5 px-4 text-right">
                                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold tracking-wider border ${
                                    project.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                                    project.status === 'Under Construction' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                    'bg-blue-50 text-blue-600 border-blue-200'
                                  }`}>
                                    {project.status || 'Planning'}
                                  </span>
                                </td>
                                <td className="py-5 px-4 text-right">
                                  <button 
                                    onClick={(e) => { 
                                      e.stopPropagation(); 
                                      setSelectedProjectForSidebar(project); 
                                      setActiveProjectSubTab('progress'); 
                                      window.history.pushState(null, '', `/superadmin/project?projectId=${project.id}&subtab=progress`);
                                    }}
                                    className="inline-flex items-center justify-center px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                                  >
                                    View
                                  </button>
                                </td>
                              </tr>
                            ));
                          })()}
                        </tbody>
                      </table>
                      
                      {/* Pagination Controls */}
                      {(() => {
                        const filteredProjects = projects.filter(p => projectBuilderFilter ? p.builder_id === projectBuilderFilter : true);
                        if (filteredProjects.length === 0) return null;
                        
                        return (
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-slate-500 font-medium">Rows per page:</span>
                              <select
                                value={projectPerPage}
                                onChange={(e) => {
                                  setProjectPerPage(Number(e.target.value));
                                  setProjectPage(1);
                                }}
                                className="px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                              </select>
                            </div>
                            
                            <div className="flex items-center gap-4">
                              <span className="text-sm font-medium text-slate-500">
                                Page {projectPage} of {Math.ceil(filteredProjects.length / projectPerPage) || 1}
                              </span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setProjectPage(p => Math.max(1, p - 1))}
                                  disabled={projectPage === 1}
                                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  Previous
                                </button>
                                <button
                                  onClick={() => setProjectPage(p => Math.min(Math.ceil(filteredProjects.length / projectPerPage) || 1, p + 1))}
                                  disabled={projectPage === (Math.ceil(filteredProjects.length / projectPerPage) || 1)}
                                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  Next
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* INQUIRY LIST VIEW */}
                  {activeTab === 'inquiry' && (
                    <div className="overflow-x-auto -mx-4 sm:-mx-0">
                      <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-widest">
                            <th className="pb-4 px-4">Date</th>
                            <th className="pb-4 px-4">Name</th>
                            <th className="pb-4 px-4">Email</th>
                            <th className="pb-4 px-4">Company</th>
                            <th className="pb-4 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="text-slate-700">
                          {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                              <tr key={`skeleton-inquiry-${i}`} className="border-b border-slate-100">
                                <td className="py-5 px-4"><div className="h-4 w-24 bg-slate-200 rounded-md animate-pulse"></div></td>
                                <td className="py-5 px-4"><div className="h-4 w-32 bg-slate-200 rounded-md animate-pulse"></div></td>
                                <td className="py-5 px-4"><div className="h-4 w-48 bg-slate-200 rounded-md animate-pulse"></div></td>
                                <td className="py-5 px-4"><div className="h-4 w-32 bg-slate-200 rounded-md animate-pulse"></div></td>
                                <td className="py-5 px-4"><div className="h-8 w-16 bg-slate-200 rounded-lg animate-pulse ml-auto"></div></td>
                              </tr>
                            ))
                          ) : inquiries.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="py-12 text-center text-slate-500 font-medium">
                                No inquiries found.
                              </td>
                            </tr>
                          ) : (
                            inquiries.map((inq) => (
                              <tr key={inq.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
                                <td className="py-5 px-4 font-mono text-xs text-slate-500">{new Date(inq.created_at).toLocaleDateString()}</td>
                                <td className="py-5 px-4 font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{inq.first_name} {inq.last_name}</td>
                                <td className="py-5 px-4 text-slate-600 font-medium">{inq.email}</td>
                                <td className="py-5 px-4 text-slate-600 font-medium">{inq.company_name || 'N/A'}</td>
                                <td className="py-5 px-4 text-right">
                                  <button 
                                    onClick={() => { setSelectedInquiry(inq); setShowInquiryDetailsModal(true); }}
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

                {/* BUILDER FORM */}
                {showBuilderForm && (
                  <form onSubmit={handleBuilderSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Company Name *</label>
                        <input type="text" name="companyName" required value={builderData.companyName} onChange={handleBuilderChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 font-semibold shadow-sm" placeholder="e.g. Prestige Estates" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Primary Contact *</label>
                        <input type="text" name="contactName" required value={builderData.contactName} onChange={handleBuilderChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 font-semibold shadow-sm" placeholder="John Doe" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Email Address *</label>
                        <input type="email" name="email" required value={builderData.email} onChange={handleBuilderChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 font-semibold shadow-sm" placeholder="john@prestige.com" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Phone Number</label>
                        <input type="tel" name="phone" value={builderData.phone} onChange={handleBuilderChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 font-semibold shadow-sm" placeholder="+1 (555) 000-0000" />
                      </div>

                    </div>
                    <div className="pt-6 mt-4 flex justify-end border-t border-slate-100">
                      <button type="submit" disabled={isSubmitting || success} className="group relative px-8 py-3.5 bg-slate-900 text-white font-extrabold rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 min-w-[160px] flex justify-center items-center overflow-hidden">
                        <span className="relative z-10">{isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Add Builder'}</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* CUSTOMER FORM */}
                {showCustomerForm && (
                  <form onSubmit={handleCustomerSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Assign to Builder *</label>
                        <div className="relative">
                          <select 
                            name="builderId" required value={customerData.builderId} onChange={handleCustomerChange}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 font-semibold shadow-sm appearance-none cursor-pointer"
                          >
                            <option value="" className="text-slate-400">-- Select a Builder --</option>
                            {builders.map(b => (
                              <option key={b.id} value={b.id} className="text-slate-900">{b.contact_name} ({b.company_name})</option>
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
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Floor</label>
                        <input type="text" name="floor" value={customerData.floor} onChange={handleCustomerChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 font-semibold shadow-sm" placeholder="e.g. 14" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Tower Name</label>
                        <input type="text" name="towerName" value={customerData.towerName} onChange={handleCustomerChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 font-semibold shadow-sm" placeholder="e.g. Tower A" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Flat Name / No.</label>
                        <input type="text" name="flatName" value={customerData.flatName} onChange={handleCustomerChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 font-semibold shadow-sm" placeholder="e.g. 1402" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Area (sqft)</label>
                        <input type="text" name="areaSqft" value={customerData.areaSqft} onChange={handleCustomerChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 font-semibold shadow-sm" placeholder="e.g. 1500" />
                      </div>

                    </div>
                    <div className="pt-6 mt-4 flex justify-end border-t border-slate-100">
                      <button type="submit" disabled={isSubmitting || success} className="group relative px-8 py-3.5 bg-slate-900 text-white font-extrabold rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 min-w-[160px] flex justify-center items-center overflow-hidden">
                        <span className="relative z-10">{isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Add Customer'}</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* PROJECT FORM */}
                {showProjectForm && (
                  <form onSubmit={handleProjectSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">


                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Project Name *</label>
                        <input type="text" name="projectName" required value={projectData.projectName} onChange={handleProjectChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 font-semibold shadow-sm" placeholder="e.g. Skyline Towers" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Description</label>
                        <textarea name="description" value={projectData.description} onChange={handleProjectChange as any} rows={3} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 font-semibold shadow-sm resize-none" placeholder="Brief description of the project..."></textarea>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Location</label>
                        <input type="text" name="location" value={projectData.location} onChange={handleProjectChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 font-semibold shadow-sm" placeholder="e.g. Downtown Metro" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Status</label>
                        <div className="relative">
                          <select 
                            name="status" value={projectData.status} onChange={handleProjectChange}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 font-semibold shadow-sm appearance-none cursor-pointer"
                          >
                            <option value="" className="text-slate-400">-- Select Status --</option>
                            <option value="Planning" className="text-slate-900">Planning</option>
                            <option value="Under Construction" className="text-slate-900">Under Construction</option>
                            <option value="Completed" className="text-slate-900">Completed</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Expected Possession</label>
                        <input type="date" name="expectedPossession" value={projectData.expectedPossession} onChange={handleProjectChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 font-semibold shadow-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Project Type</label>
                        <div className="relative">
                          <select 
                            name="projectType" value={projectData.projectType} onChange={handleProjectChange}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 font-semibold shadow-sm appearance-none cursor-pointer"
                          >
                            <option value="" className="text-slate-400">-- Select Type --</option>
                            <option value="Flat" className="text-slate-900">flat</option>
                            <option value="Society" className="text-slate-900">society</option>
                            <option value="Commercial" className="text-slate-900">commercial</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Assign Builder</label>
                        <div className="relative">
                          <select 
                            name="builderId" value={projectData.builderId || ''} onChange={handleProjectChange}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 font-semibold shadow-sm appearance-none cursor-pointer"
                            required
                          >
                            <option value="" className="text-slate-400">-- Select Builder --</option>
                            {builders.map(b => (
                              <option key={b.id} value={b.id} className="text-slate-900">
                                {b.contact_name} ({b.company_name})
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
                          </div>
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Google Map URL</label>
                        <input type="text" name="googleMapUrl" value={projectData.googleMapUrl} onChange={handleProjectChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 font-semibold shadow-sm" placeholder="e.g. https://maps.google.com/..." />
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

      {/* Builder Details Modal */}
      <AnimatePresence>
        {showBuilderDetailsModal && selectedBuilder && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Builder Details</h2>
                    <p className="text-sm font-semibold text-slate-500">View comprehensive company information</p>
                  </div>
                </div>
                <button onClick={() => setShowBuilderDetailsModal(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-8 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Company Name</span>
                    <span className="text-lg font-bold text-slate-900">{selectedBuilder.company_name}</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Contact Name</span>
                    <span className="text-lg font-bold text-slate-900">{selectedBuilder.contact_name}</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</span>
                    <span className="text-base font-semibold text-slate-700">{selectedBuilder.email}</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Mobile No</span>
                    <span className="text-base font-semibold text-slate-700">{selectedBuilder.phone || 'N/A'}</span>
                  </div>
                  <div className="sm:col-span-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Assigned Projects</span>
                    <span className="text-base font-semibold text-slate-700">
                      {projects.filter(p => p.builder_id === selectedBuilder.id).length} Project(s)
                    </span>
                  </div>
                </div>
              </div>
              <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex justify-end">
                <button onClick={() => setShowBuilderDetailsModal(false)} className="px-6 py-2.5 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition-colors">
                  Close
                </button>
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
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Builder Assigned</p>
                    <p className="font-bold text-slate-900">{builders.find(b => b.id === selectedCustomer.builder_id)?.contact_name || 'N/A'} ({builders.find(b => b.id === selectedCustomer.builder_id)?.company_name || 'N/A'})</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Floor</p>
                    <p className="font-bold text-slate-900">{selectedCustomer.floor || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Tower Name</p>
                    <p className="font-bold text-slate-900">{selectedCustomer.tower_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Flat Name / No.</p>
                    <p className="font-bold text-slate-900">{selectedCustomer.flat_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Area (sqft)</p>
                    <p className="font-bold text-slate-900">{selectedCustomer.area_sqft ? `${selectedCustomer.area_sqft} sqft` : 'N/A'}</p>
                  </div>
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
                        <span className="relative z-10">{isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (selectedProjectForSidebar?.project_type === 'Society' ? 'Save Section' : 'Save Tower')}</span>
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
      {/* Inquiry Details Modal */}
      <AnimatePresence>
        {showInquiryDetailsModal && selectedInquiry && (
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
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Inquiry Details</h2>
                    <p className="text-sm font-medium text-slate-500 mt-1">
                      {new Date(selectedInquiry.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button onClick={() => setShowInquiryDetailsModal(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div>
                    <span className="block text-slate-400 font-bold uppercase tracking-wider text-xs mb-1">Name</span>
                    <span className="font-semibold text-slate-800">{selectedInquiry.first_name} {selectedInquiry.last_name}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 font-bold uppercase tracking-wider text-xs mb-1">Company</span>
                    <span className="font-semibold text-slate-800">{selectedInquiry.company_name || 'N/A'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-slate-400 font-bold uppercase tracking-wider text-xs mb-1">Email</span>
                    <span className="font-semibold text-slate-800">{selectedInquiry.email}</span>
                  </div>
                </div>
                
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Message</h3>
                <div className="prose prose-slate prose-sm max-w-none bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-slate-700 whitespace-pre-wrap leading-relaxed text-[15px] m-0">{selectedInquiry.message}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
