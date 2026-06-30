'use client';

import { useState, useEffect } from 'react';
import { Building2, Plus, LogOut, CheckCircle2, AlertCircle, Users, HardHat, MapPin, Sparkles, ChevronRight, List, X, UploadCloud, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'builder' | 'customer' | 'project'>('builder');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Lists for tables
  const [builders, setBuilders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  // Show form toggles (now used for Modals)
  const [showBuilderForm, setShowBuilderForm] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);

  // Form States
  const [builderData, setBuilderData] = useState({
    companyName: '', contactName: '', email: '', phone: '', projectId: '',
  });

  const [customerData, setCustomerData] = useState({
    builderId: '', firstName: '', lastName: '', email: '', phone: '', projectId: '',
  });

  const [projectData, setProjectData] = useState({
    projectName: '', location: '', status: '', description: '', coverImgUrl: '', expectedPossession: ''
  });

  useEffect(() => {
    fetchBuilders();
    fetchCustomers();
    fetchProjects();
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
      setCustomerData({ builderId: customerData.builderId, firstName: '', lastName: '', email: '', phone: '', projectId: '' });
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
      setProjectData({ projectName: '', location: '', status: '', description: '', coverImgUrl: '', expectedPossession: '' });
      fetchProjects();
      setTimeout(() => { setSuccess(false); setShowProjectForm(false); }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const menuItems = [
    { id: 'builder', label: 'Builder Matrix', icon: HardHat },
    { id: 'customer', label: 'Customer Network', icon: Users },
    { id: 'project', label: 'Project Registry', icon: MapPin }
  ] as const;

  const handleTabChange = (tabId: 'builder' | 'customer' | 'project') => {
    setActiveTab(tabId);
    setError('');
    setSuccess(false);
    setShowBuilderForm(false);
    setShowCustomerForm(false);
    setShowProjectForm(false);
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
              BuilderFlow
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
        <aside className="w-80 bg-white/50 backdrop-blur-md border-r border-slate-200/60 p-6 shrink-0 flex flex-col gap-2">
          <div className="flex items-center gap-2 px-4 py-2 mb-4">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Management</span>
          </div>
          
          <div className="flex flex-col gap-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button 
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`group relative flex items-center justify-between w-full px-4 py-4 rounded-2xl font-semibold transition-all duration-300 overflow-hidden ${
                    isActive 
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
                  
                  {isActive && <ChevronRight className="w-4 h-4 text-blue-600 relative z-10" />}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8 lg:p-12 relative">
           <div className="w-full max-w-none">
              
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
                <p className="text-slate-500 text-lg">
                  {activeTab === 'builder' 
                    ? 'Deploy new construction companies to the BuilderFlow ecosystem.' 
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
                   {activeTab === 'builder' && (
                     <button onClick={() => setShowBuilderForm(true)} className="px-5 py-2.5 font-bold text-sm rounded-xl transition-all shadow-[0_5px_15px_rgba(59,130,246,0.3)] bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-90 text-white flex items-center gap-2">
                       <Plus className="w-4 h-4" /> Add Builder
                     </button>
                   )}
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
                            <th className="pb-4 px-4 text-right">Project ID</th>
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
                                <td className="py-5 px-4 text-right">
                                  {builder.project_id ? (
                                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-extrabold tracking-wider border border-blue-200">
                                      {builder.project_id}
                                    </span>
                                  ) : (
                                    <span className="text-slate-400 font-medium text-sm">N/A</span>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
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
                            <th className="pb-4 px-4">Builder ID</th>
                            <th className="pb-4 px-4 text-right">Project ID</th>
                          </tr>
                        </thead>
                        <tbody className="text-slate-700">
                          {customers.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="py-12 text-center text-slate-500 font-medium">
                                No customers added yet. Click 'Add Customer' to initialize one.
                              </td>
                            </tr>
                          ) : (
                            customers.map((customer) => (
                              <tr key={customer.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
                                <td className="py-5 px-4 font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{customer.first_name} {customer.last_name}</td>
                                <td className="py-5 px-4 text-slate-600 font-medium">{customer.email}</td>
                                <td className="py-5 px-4 text-slate-600 font-medium text-xs">{customer.builder_id?.substring(0, 8)}...</td>
                                <td className="py-5 px-4 text-right">
                                  {customer.project_id ? (
                                    <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-extrabold tracking-wider border border-emerald-200">
                                      {customer.project_id}
                                    </span>
                                  ) : (
                                    <span className="text-slate-400 font-medium text-sm">N/A</span>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* PROJECT LIST VIEW */}
                  {activeTab === 'project' && (
                    <div className="overflow-x-auto -mx-4 sm:-mx-0">
                      <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-widest">
                            <th className="pb-4 px-4">Project Name</th>
                            <th className="pb-4 px-4">Location</th>
                            <th className="pb-4 px-4 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="text-slate-700">
                          {projects.length === 0 ? (
                            <tr>
                              <td colSpan={3} className="py-12 text-center text-slate-500 font-medium">
                                No projects registered yet. Click 'Add Project' to initialize one.
                              </td>
                            </tr>
                          ) : (
                            projects.map((project) => (
                              <tr key={project.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
                                <td className="py-5 px-4 font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{project.project_name}</td>
                                <td className="py-5 px-4 text-slate-600 font-medium">{project.location || 'N/A'}</td>
                                <td className="py-5 px-4 text-right">
                                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold tracking-wider border ${
                                    project.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                                    project.status === 'Under Construction' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                    'bg-blue-50 text-blue-600 border-blue-200'
                                  }`}>
                                    {project.status || 'Planning'}
                                  </span>
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
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Project ID</label>
                        <input type="text" name="projectId" value={builderData.projectId} onChange={handleBuilderChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 font-semibold shadow-sm" placeholder="e.g. PRJ-1001" />
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
                              <option key={b.id} value={b.id} className="text-slate-900">{b.company_name}</option>
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
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Project ID</label>
                        <input type="text" name="projectId" value={customerData.projectId} onChange={handleCustomerChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 font-semibold shadow-sm" placeholder="e.g. PRJ-1001" />
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
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Expected Possession</label>
                        <input type="text" name="expectedPossession" value={projectData.expectedPossession} onChange={handleProjectChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 font-semibold shadow-sm" placeholder="e.g. Q4 2026" />
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
    </div>
  );
}
