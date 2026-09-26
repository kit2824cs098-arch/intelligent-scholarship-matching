import React from 'react';
import { ShieldCheck, Heart, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-orange-100 text-[#EA580C] flex items-center justify-center mx-auto text-2xl font-bold shadow-xs">
          <GraduationCap className="w-8 h-8 text-[#EA580C]" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 font-serif">
          About ScholarNest
        </h1>
        <p className="text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
          An intelligent scholarship discovery and transparent eligibility matching platform built specifically for students.
        </p>
      </div>

      {/* Mission Section */}
      <div className="warm-card p-8 space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 font-serif flex items-center gap-2">
          <Heart className="w-6 h-6 text-[#EA580C]" />
          Our Mission
        </h2>
        <p className="text-sm text-slate-700 leading-relaxed">
          Every year, millions of deserving students miss out on higher education scholarships simply because discovery is scattered, eligibility rules are hidden behind legal jargon, and application deadlines pass silently without clear tracking.
        </p>
        <p className="text-sm text-slate-700 leading-relaxed">
          ScholarNest changes this by combining clean personal finance tracking with an explainable matching engine that evaluates academic marks, family income caps, state domiciles, and field requirements with 100% transparency.
        </p>
      </div>

      {/* Weighted Matching Methodology */}
      <div className="warm-card p-8 space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 font-serif flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-[#EA580C]" />
          Transparent Weighted Matching Architecture
        </h2>

        <p className="text-sm text-slate-700">
          Rather than returning opaque AI confidence percentages, ScholarNest evaluates eligibility based on 6 quantitative criteria weights:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-extrabold text-[#EA580C] text-base">Academic Eligibility — 25%</span>
            <p className="text-xs text-slate-600 mt-1">Evaluates minimum GPA/percentage thresholds and marks requirements.</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-extrabold text-[#D97706] text-base">Financial Eligibility — 20%</span>
            <p className="text-xs text-slate-600 mt-1">Evaluates family annual income ceiling and financial assistance needs.</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-extrabold text-orange-600 text-base">Course & Field — 20%</span>
            <p className="text-xs text-slate-600 mt-1">Matches degree level, stream (STEM, Medicine, Commerce, Arts) and major.</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-extrabold text-amber-700 text-base">Location & Domicile — 15%</span>
            <p className="text-xs text-slate-600 mt-1">Matches state nativity rules (e.g. Maharashtra, Tamil Nadu, Delhi, National).</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-extrabold text-amber-800 text-base">Demographics — 10%</span>
            <p className="text-xs text-slate-600 mt-1">Factors gender and legally/contextually appropriate community options.</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-extrabold text-rose-700 text-base">Achievements & Skills — 10%</span>
            <p className="text-xs text-slate-600 mt-1">First-generation student status, skills, and extracurricular contributions.</p>
          </div>
        </div>
      </div>

      {/* Student CTA */}
      <div className="text-center pt-4">
        <Link
          to="/onboarding"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-base font-extrabold shadow-xl transition-all"
        >
          Build Your Student Profile Now
        </Link>
      </div>

    </div>
  );
};

export default AboutPage;
