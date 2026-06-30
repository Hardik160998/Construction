import { Building2, Users, Shield, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="py-24 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">About BuilderFlow</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 text-center mb-16">
          We are on a mission to digitize the Indian Real Estate sector by providing an all-in-one digital operating system built specifically for developers.
        </p>

        <div className="space-y-16">
          <section>
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-2"><Building2 className="text-blue-600" /> Our Mission & Vision</h2>
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              Our mission is to replace chaotic WhatsApp groups and scattered Excel sheets with a unified, transparent, and efficient software ecosystem. We envision a future where real estate transactions and construction updates are as seamless and transparent as ordering a package online.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-2"><Zap className="text-blue-600" /> Why BuilderFlow?</h2>
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              Generic CRMs like Salesforce or HubSpot are brilliant, but they don't understand 'Towers', 'Floors', 'RERA', or 'Construction Milestones'. We built BuilderFlow from the ground up for the nuances of Indian real estate.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-2"><Shield className="text-blue-600" /> Technology & Security</h2>
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              Built on a highly scalable Next.js and Supabase stack, we utilize strictly enforced Row Level Security (RLS) to ensure that every builder's data is 100% isolated and secure. We comply with modern data protection standards and offer role-based access control.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
