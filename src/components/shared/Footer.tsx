import Link from 'next/link';
import { Building2 } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Building2 className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                BuilderFlow
              </span>
            </Link>
            <p className="text-sm text-slate-400 mb-6">
              Complete Digital Operating System for Real Estate Builders. Manage Projects, Sales, Construction, Customers and Possession from One Platform.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link href="/features" className="hover:text-blue-400 transition-colors">Features</Link></li>
              <li><Link href="/features/crm" className="hover:text-blue-400 transition-colors">Builder CRM</Link></li>
              <li><Link href="/features/customer-portal" className="hover:text-blue-400 transition-colors">Customer Portal</Link></li>
              <li><Link href="/features/project-management" className="hover:text-blue-400 transition-colors">Project Management</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link href="/blog" className="hover:text-blue-400 transition-colors">Blog</Link></li>
              <li><Link href="/docs" className="hover:text-blue-400 transition-colors">Documentation</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Help Center</Link></li>
              <li><Link href="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact Sales</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            &copy; {currentYear} BuilderFlow SaaS. All rights reserved. Built for Indian Real Estate.
          </p>
          <div className="flex gap-4 text-slate-500">
             {/* Social icons can go here */}
          </div>
        </div>
      </div>
    </footer>
  );
}
