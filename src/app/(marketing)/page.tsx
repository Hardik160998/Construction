'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, CheckCircle2, PhoneOff, Smartphone, ShieldCheck, TrendingUp, Sparkles, Building, BarChart3, ChevronRight, HardHat, Truck, ClipboardCheck, Users } from 'lucide-react';
import { useRef } from 'react';

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
  };

  return (
    <div className="flex flex-col w-full bg-slate-50 text-slate-900 overflow-hidden" ref={containerRef}>
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-24 pb-20 lg:pt-36 lg:pb-32 overflow-hidden px-4 min-h-[90vh] flex flex-col justify-center">
        {/* Abstract Premium Light Background */}
        <div className="absolute inset-0 -z-10 bg-slate-50 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-300/40 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-300/30 blur-[120px]" />
          <div className="absolute top-[20%] left-[40%] w-[30%] h-[30%] rounded-full bg-purple-200/40 blur-[120px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-multiply" />
        </div>

        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/70 shadow-sm border border-slate-200/60 text-blue-600 mb-8 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold tracking-wide">The New Standard in Real Estate</span>
          </motion.div>
          
          <motion.h1 
            {...fadeIn}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-slate-900 via-slate-700 to-slate-500 max-w-5xl mx-auto mb-8 leading-[1.1]"
          >
            Build the Future.<br/>Manage it with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">BuilderFlow.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}
            className="text-lg md:text-2xl text-slate-600 max-w-3xl mx-auto mb-12 font-medium leading-relaxed"
          >
            An elite operating system for real estate developers. Unify your CRM, construction milestones, and customer experience into one breathtaking platform.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }}
            className="flex flex-col sm:flex-row gap-5 justify-center items-center"
          >
            <Button size="lg" className="h-14 px-8 text-lg bg-blue-600 text-white hover:bg-blue-700 rounded-full font-semibold group transition-all duration-300 shadow-[0_10px_40px_rgba(37,99,235,0.2)] hover:shadow-[0_15px_60px_rgba(37,99,235,0.3)]">
              <Link href="/contact" className="flex items-center">
                Request Private Access
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-slate-300/80 hover:bg-slate-100/50 text-slate-700 bg-white/40 backdrop-blur-md transition-all duration-300">
              <Link href="#platform">Explore Platform</Link>
            </Button>
          </motion.div>
          
          {/* Dashboard Premium Mockup Wrapper */}
          <motion.div 
            style={{ y }}
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 1 }}
            className="mt-24 relative mx-auto max-w-6xl perspective-1000"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 rounded-3xl blur-xl opacity-60 animate-pulse" />
            <div className="relative aspect-[16/9] bg-white/80 backdrop-blur-2xl rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-slate-200/50 overflow-hidden flex flex-col items-center justify-center group transform transition-transform duration-700 hover:scale-[1.02]">
               <div className="absolute top-0 inset-x-0 h-12 bg-slate-50/80 border-b border-slate-200/50 flex items-center px-4 gap-2 backdrop-blur-md">
                 <div className="w-3 h-3 rounded-full bg-red-400" />
                 <div className="w-3 h-3 rounded-full bg-yellow-400" />
                 <div className="w-3 h-3 rounded-full bg-green-400" />
               </div>
               <BarChart3 className="w-16 h-16 text-slate-300 group-hover:text-blue-500 transition-colors duration-500 mb-4" />
               <span className="text-slate-500 font-semibold tracking-widest text-sm uppercase">Interactive Dashboard Canvas</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. TRUSTED BY SECTION */}
      <section className="py-16 bg-white/60 border-y border-slate-200/50 backdrop-blur-md">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-10">Entrusted by Visionary Builders</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-60 mix-blend-multiply">
            {['Lodha', 'Godrej', 'Prestige', 'Sobha', 'Brigade'].map((builder) => (
              <span key={builder} className="text-2xl font-bold tracking-tight text-slate-800 hover:text-blue-600 transition-colors duration-300 cursor-default">{builder}</span>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PROBLEMS & SOLUTION GRID */}
      <section id="platform" className="py-32 relative bg-white">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-24">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight text-slate-900">Engineering precision, <br/><span className="text-slate-400">without the chaos.</span></h2>
            <p className="text-xl text-slate-600 font-medium">Transcend outdated spreadsheets and fragmented communication. BuilderFlow brings absolute clarity to your operations.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              { title: 'Intelligent CRM', icon: PhoneOff, desc: 'Zero lead leakage. Automated follow-ups and AI-driven insights ensure every prospect is nurtured to possession.', color: 'from-blue-500/10 to-blue-500/0', border: 'hover:border-blue-300', iconBg: 'bg-blue-100 text-blue-600' },
              { title: 'Unified Inventory', icon: Building, desc: 'Real-time inventory syncing across all brokers and sales channels. Eliminate double-bookings forever.', color: 'from-indigo-500/10 to-indigo-500/0', border: 'hover:border-indigo-300', iconBg: 'bg-indigo-100 text-indigo-600' },
              { title: 'Client Portal', icon: Smartphone, desc: 'A stunning mobile experience for buyers to track construction progress, pay demands, and raise tickets.', color: 'from-purple-500/10 to-purple-500/0', border: 'hover:border-purple-300', iconBg: 'bg-purple-100 text-purple-600' }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className={`group relative p-8 rounded-[2rem] bg-white border border-slate-200 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] ${feature.border} transition-all duration-500 overflow-hidden flex flex-col`}
              >
                <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-b ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-[2rem] -z-10`} />
                <div className={`${feature.iconBg} p-4 rounded-2xl w-fit mb-8 group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed font-medium flex-grow">{feature.desc}</p>
                <div className="mt-8 flex items-center text-sm font-bold text-slate-400 group-hover:text-slate-900 transition-colors cursor-pointer uppercase tracking-wider">
                  Explore Feature <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3.5. CONSTRUCTOR BUILDER SECTION */}
      <section className="py-32 relative bg-slate-900 text-slate-50 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay" />
        <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-center max-w-7xl mx-auto">
            
            <div className="lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-8"
              >
                <HardHat className="w-4 h-4" />
                <span className="text-sm font-semibold tracking-wide">For Constructor Builders</span>
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="text-4xl md:text-6xl font-extrabold mb-8 tracking-tight text-white leading-tight"
              >
                Command your site from <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">ground zero.</span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                className="text-xl text-slate-400 mb-12 font-medium"
              >
                Go beyond sales. BuilderFlow gives your project managers and site engineers the ultimate toolkit to track progress, manage labor, and control material procurement in real-time.
              </motion.p>

              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { title: 'Subcontractor Tracking', icon: Users, desc: 'Monitor attendance, labor output, and release daily wages instantly.' },
                  { title: 'Material Procurement', icon: Truck, desc: 'Automate POs, track vendor deliveries, and stop material pilferage.' },
                  { title: 'Gantt Scheduling', icon: BarChart3, desc: 'Live timeline tracking. Know exactly when a slab is cast or brickwork begins.' },
                  { title: 'Quality & Safety', icon: ClipboardCheck, desc: 'Digital checklists for QA/QC and safety compliance on site.' }
                ].map((feature, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + (i * 0.1) }}
                    className="flex gap-4 items-start"
                  >
                    <div className="bg-white/10 p-3 rounded-xl shrink-0">
                      <feature.icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">{feature.title}</h4>
                      <p className="text-sm text-slate-400">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2 w-full">
               <motion.div 
                  initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
                  className="relative aspect-square md:aspect-[4/3] bg-slate-800 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col"
               >
                 {/* Mock Construction App UI */}
                 <div className="h-16 bg-slate-900 border-b border-slate-800 flex items-center px-6 justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <HardHat className="text-white w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm">Tower B Construction</h4>
                        <p className="text-slate-400 text-xs">Phase 2 • 45% Complete</p>
                      </div>
                    </div>
                    <div className="w-24 h-8 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-xs font-bold">On Schedule</div>
                 </div>
                 <div className="flex-grow p-6 flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
                         <p className="text-slate-400 text-xs mb-1">Labor Force Today</p>
                         <p className="text-2xl font-bold text-white">142 <span className="text-xs text-emerald-400 ml-2">↑ 12</span></p>
                      </div>
                      <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
                         <p className="text-slate-400 text-xs mb-1">Cement Stock</p>
                         <p className="text-2xl font-bold text-white">850 <span className="text-xs font-normal text-slate-500">bags</span></p>
                      </div>
                    </div>
                    <div className="flex-grow bg-slate-900 rounded-xl border border-slate-800 p-4">
                       <p className="text-white font-bold text-sm mb-4">Milestone Progress</p>
                       <div className="space-y-4">
                         {['Foundation Layout', 'Basement Excavation', 'Ground Floor Slab'].map((task, i) => (
                           <div key={i} className="flex flex-col gap-2">
                             <div className="flex justify-between text-xs">
                               <span className="text-slate-300">{task}</span>
                               <span className={i === 2 ? 'text-blue-400' : 'text-emerald-400'}>{i === 2 ? 'In Progress' : 'Completed'}</span>
                             </div>
                             <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                               <div className={`h-full ${i === 2 ? 'w-1/2 bg-blue-500' : 'w-full bg-emerald-500'}`} />
                             </div>
                           </div>
                         ))}
                       </div>
                    </div>
                 </div>
               </motion.div>
            </div>
            
          </div>
        </div>
      </section>

      {/* 4. STATISTICS */}
      <section className="py-32 relative overflow-hidden bg-slate-50">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-multiply" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-400/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
           <div className="grid lg:grid-cols-2 gap-20 items-center max-w-7xl mx-auto">
             <div>
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                  <h2 className="text-4xl md:text-6xl font-extrabold mb-8 tracking-tight text-slate-900 leading-tight">Quantifiable <br/>excellence.</h2>
                  <p className="text-xl text-slate-600 mb-12 font-medium">Data-driven architecture designed to optimize margins, slash administrative overhead, and elevate the buyer experience.</p>
                </motion.div>
                
                <div className="grid sm:grid-cols-2 gap-8">
                  {[
                    { stat: '80%', text: 'Reduction in Support Calls' },
                    { stat: '3x', text: 'Faster Sales Conversions' },
                    { stat: 'Zero', text: 'Inventory Clashes' },
                    { stat: '40%', text: 'Lower Admin Costs' }
                  ].map((s, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + 0.3 }}
                      className="border-l-4 border-blue-500 pl-6 py-2 bg-gradient-to-r from-blue-50 to-transparent"
                    >
                      <div className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">{s.stat}</div>
                      <div className="text-slate-600 font-semibold">{s.text}</div>
                    </motion.div>
                  ))}
                </div>
             </div>
             
             {/* Premium Abstract Visual */}
             <div className="relative aspect-square lg:aspect-[4/5] bg-gradient-to-tr from-white to-blue-50 rounded-[3rem] border border-slate-200 shadow-[0_20px_60px_rgba(0,0,0,0.05)] flex items-center justify-center overflow-hidden group">
                 <ShieldCheck className="w-40 h-40 text-blue-500/20 group-hover:text-blue-500/50 group-hover:scale-110 transition-all duration-700" />
                 <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/80 backdrop-blur-xl border border-white shadow-lg rounded-3xl">
                    <div className="h-2 w-1/3 bg-blue-500 rounded-full mb-4 opacity-80" />
                    <div className="h-2 w-full bg-slate-200 rounded-full mb-2" />
                    <div className="h-2 w-4/5 bg-slate-200 rounded-full" />
                 </div>
             </div>
           </div>
        </div>
      </section>

      {/* 5. CTA */}
      <section className="py-32 relative bg-white">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-50/50" />
        <div className="container mx-auto px-4 text-center max-w-4xl relative z-10">
          <Sparkles className="w-12 h-12 text-blue-500 mx-auto mb-8 animate-bounce" />
          <h2 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tighter text-slate-900">Step into the future.</h2>
          <p className="text-xl md:text-2xl text-slate-600 mb-12 font-medium">
            Join the vanguard of real estate developers transforming their operations with BuilderFlow.
          </p>
          <Button size="lg" className="h-16 px-10 text-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-bold hover:shadow-[0_20px_40px_rgba(79,70,229,0.3)] hover:-translate-y-1 transition-all duration-300">
            <Link href="/contact">Request Your Private Demo</Link>
          </Button>
        </div>
      </section>

    </div>
  );
}
