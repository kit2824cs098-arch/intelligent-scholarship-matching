import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck, Heart, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0F172A] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EA580C] text-white flex items-center justify-center font-bold">
                <GraduationCap className="w-6 h-6 text-[#FEF3C7]" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight font-serif">
                Scholar<span className="text-[#F97316]">Nest</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              ScholarNest is an intelligent scholarship discovery & transparent eligibility matching portal dedicated to helping students access genuine higher education funding.
            </p>
            <div className="flex items-center gap-2 text-xs text-orange-400 bg-orange-950/60 border border-orange-800/60 rounded-lg px-3 py-1.5 w-fit">
              <ShieldCheck className="w-4 h-4 text-orange-400" />
              Verified & Transparent Student Matching
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/discover" className="hover:text-orange-400 transition-colors">Find Scholarships</Link>
              </li>
              <li>
                <Link to="/deadlines" className="hover:text-orange-400 transition-colors">Deadlines Tracker</Link>
              </li>
              <li>
                <Link to="/onboarding" className="hover:text-orange-400 transition-colors">Student Profile Setup</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-orange-400 transition-colors">My Scholarship Journey</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-orange-400 transition-colors">Matching Transparency</Link>
              </li>
            </ul>
          </div>

          {/* Scholarship Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Popular Categories</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/discover?field=Engineering" className="hover:text-orange-400 transition-colors">Engineering & Tech</Link>
              </li>
              <li>
                <Link to="/discover?fullyFunded=true" className="hover:text-orange-400 transition-colors">Fully Funded Grants</Link>
              </li>
              <li>
                <Link to="/discover?search=Women" className="hover:text-orange-400 transition-colors">Women in STEM Scholarships</Link>
              </li>
              <li>
                <Link to="/discover?search=First" className="hover:text-orange-400 transition-colors">First-Generation Student Grants</Link>
              </li>
              <li>
                <Link to="/discover?educationLevel=Postgraduate" className="hover:text-orange-400 transition-colors">Postgraduate & PhD Fellowships</Link>
              </li>
            </ul>
          </div>

          {/* Contact / Help */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Student Assistance</h4>
            <p className="text-sm text-slate-400 mb-4">
              Have questions regarding eligibility documents or application deadlines?
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-200">
              <Mail className="w-4 h-4 text-orange-400" />
              support@scholarnest.edu
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-500">
              Note: Sample scholarship data is clearly flagged with demo badges for institutional presentation.
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} ScholarNest. Built for simple, clear, and un-overwhelming scholarship discovery.</p>
          <div className="flex items-center gap-1 text-slate-400">
            Crafted with <Heart className="w-3.5 h-3.5 text-orange-500 fill-orange-500 mx-0.5" /> for student empowerment
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
