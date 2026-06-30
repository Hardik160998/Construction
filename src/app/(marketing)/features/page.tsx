import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';

export default function FeaturesPage() {
  return (
    <div className="py-24 bg-white dark:bg-slate-950 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blue-600">BuilderFlow Features</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-12">
          Discover the complete ecosystem designed to digitize Indian Real Estate.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div className="p-6 border rounded-xl shadow-sm bg-slate-50 dark:bg-slate-900">
            <h3 className="text-2xl font-bold mb-3">Construction Progress Portal</h3>
            <p className="mb-4 text-slate-600 dark:text-slate-400">Drone video uploads, tower-wise progress tracking, and possession countdown.</p>
            <Link href="/features/construction" className={buttonVariants({ variant: "outline" })}>View Details</Link>
          </div>
          <div className="p-6 border rounded-xl shadow-sm bg-slate-50 dark:bg-slate-900">
            <h3 className="text-2xl font-bold mb-3">Builder CRM</h3>
            <p className="mb-4 text-slate-600 dark:text-slate-400">Lead management, site visits, automated follow-ups, and sales pipelines.</p>
            <Link href="/features/crm" className={buttonVariants({ variant: "outline" })}>View Details</Link>
          </div>
          <div className="p-6 border rounded-xl shadow-sm bg-slate-50 dark:bg-slate-900">
            <h3 className="text-2xl font-bold mb-3">Customer Portal</h3>
            <p className="mb-4 text-slate-600 dark:text-slate-400">Payments, receipts, demand letters, complaints, and warranty tracking.</p>
            <Link href="/features/customer-portal" className={buttonVariants({ variant: "outline" })}>View Details</Link>
          </div>
          <div className="p-6 border rounded-xl shadow-sm bg-slate-50 dark:bg-slate-900">
            <h3 className="text-2xl font-bold mb-3">Material & Inventory</h3>
            <p className="mb-4 text-slate-600 dark:text-slate-400">Purchase orders, vendor management, and daily stock consumption.</p>
            <Link href="/features/material-management" className={buttonVariants({ variant: "outline" })}>View Details</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
