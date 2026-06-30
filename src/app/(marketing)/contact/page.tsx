'use client';

import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Loader2, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message.');
      }

      setIsSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong while sending your request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-24 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Our Sales Team</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">Book a personalized demo and see how BuilderFlow can transform your operations.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden">
            
            {isSuccess ? (
              <div className="absolute inset-0 bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-8 text-center z-10">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Request Sent!</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">Thank you for reaching out. Our team will contact you shortly to set up your builder account.</p>
                <Button onClick={() => setIsSuccess(false)} variant="outline">Send Another</Button>
              </div>
            ) : null}

            <h3 className="text-2xl font-bold mb-6">Book a Demo</h3>
            
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">First Name</label>
                  <input required value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} type="text" className="w-full border rounded-lg p-3 dark:bg-slate-800 dark:border-slate-700" placeholder="John" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Last Name</label>
                  <input required value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} type="text" className="w-full border rounded-lg p-3 dark:bg-slate-800 dark:border-slate-700" placeholder="Doe" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Company Name</label>
                <input required value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} type="text" className="w-full border rounded-lg p-3 dark:bg-slate-800 dark:border-slate-700" placeholder="XYZ Builders Pvt Ltd" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Work Email</label>
                <input required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} type="email" className="w-full border rounded-lg p-3 dark:bg-slate-800 dark:border-slate-700" placeholder="john@xyzbuilders.com" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Message</label>
                <textarea required value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full border rounded-lg p-3 h-32 dark:bg-slate-800 dark:border-slate-700" placeholder="Tell us about your projects..."></textarea>
              </div>
              <Button disabled={isSubmitting} type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-lg mt-4">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                Submit Request
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-1">Call Us / WhatsApp</h4>
                <p className="text-slate-600 dark:text-slate-400">+91 98765 43210</p>
                <p className="text-sm text-slate-500 mt-1">Mon-Fri from 9am to 6pm IST</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-1">Email</h4>
                <p className="text-slate-600 dark:text-slate-400">sales@builderflow.com</p>
                <p className="text-sm text-slate-500 mt-1">We'll respond within 24 hours.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-1">Office</h4>
                <p className="text-slate-600 dark:text-slate-400">Level 5, Tech Park Phase 1<br />Bengaluru, Karnataka 560001</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
