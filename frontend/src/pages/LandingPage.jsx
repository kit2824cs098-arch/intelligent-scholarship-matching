import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Search, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';
import HeroIllustration from '../components/HeroIllustration';
import ScholarshipCard from '../components/ScholarshipCard';
import API from '../services/api';

const LandingPage = () => {
  const navigate = useNavigate();
  const [featuredScholarships, setFeaturedScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await API.get('/scholarships');
        setFeaturedScholarships(res.data.scholarships ? res.data.scholarships.slice(0, 3) : []);
      } catch (err) {
        console.error('Failed to fetch featured scholarships:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-16 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Headline & Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Trust Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/80 border border-orange-200 text-[#C2410C] text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-[#EA580C]" />
                <span>Built for simple, clear & transparent student discovery</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F172A] tracking-tight font-serif leading-[1.15]">
                Find the scholarships that <span className="text-[#EA580C]">fit your journey.</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl">
                Discover funding opportunities matched to your education, background, goals and eligibility — all in one place.
              </p>

              {/* Primary Call to Actions */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => navigate('/onboarding')}
                  className="px-7 py-4 rounded-2xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-base font-extrabold shadow-xl shadow-orange-900/15 hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center gap-2 group cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 text-[#FEF3C7]" />
                  Find My Scholarships
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => navigate('/discover')}
                  className="px-6 py-4 rounded-2xl bg-white hover:bg-orange-50/60 text-slate-800 border border-[#EAE3D9] text-base font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Search className="w-5 h-5 text-[#EA580C]" />
                  Explore Scholarships
                </button>
              </div>

              {/* Trust Highlights Section */}
              <div className="pt-6 border-t border-[#EAE3D9] grid grid-cols-3 gap-4 text-left">
                <div>
                  <p className="text-2xl font-extrabold text-slate-900 font-serif">100%</p>
                  <p className="text-xs text-slate-500 font-medium">Transparent Matching Score</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-[#EA580C] font-serif">₹25 Cr+</p>
                  <p className="text-xs text-slate-500 font-medium">Tracked Funding Pool</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-[#D97706] font-serif">0</p>
                  <p className="text-xs text-slate-500 font-medium">Confusing AI Jargon</p>
                </div>
              </div>

            </div>

            {/* Right Hero Visual Illustration */}
            <div className="lg:col-span-5 flex justify-center">
              <HeroIllustration />
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#EA580C]">Step-by-Step Guidance</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif mt-1">
            How ScholarNest Works For You
          </h2>
          <p className="text-slate-600 text-base mt-2">
            No endless dead-end searches or confusing eligibility forms. Get matched in 3 simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="warm-card p-8 text-left relative group">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#EA580C] font-extrabold text-xl flex items-center justify-center mb-6">
              1
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-serif mb-2">Build Your Student Profile</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Fill in your education level, course, academic CGPA, family income range, and state eligibility in our multi-step setup.
            </p>
          </div>

          <div className="warm-card p-8 text-left relative group">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#D97706] font-extrabold text-xl flex items-center justify-center mb-6">
              2
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-serif mb-2">Get Transparent Match Scores</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Our engine evaluates your academic, financial, and course fit with an explicit breakdown (e.g. 92% Match with satisfied & missing factors).
            </p>
          </div>

          <div className="warm-card p-8 text-left relative group">
            <div className="w-12 h-12 rounded-2xl bg-[#0F172A] text-white font-extrabold text-xl flex items-center justify-center mb-6">
              3
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-serif mb-2">Track Deadlines & Documents</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Use your personal journey pipeline and document checklists to ensure 100% preparation before applying.
            </p>
          </div>

        </div>
      </section>

      {/* Featured Scholarships Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#EA580C]">Active Opportunities</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif mt-1">
              Featured Scholarships For Students
            </h2>
          </div>
          <Link
            to="/discover"
            className="text-sm font-extrabold text-[#EA580C] hover:underline flex items-center gap-1"
          >
            View All Opportunities <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="warm-card p-6 h-64 animate-pulse bg-slate-100"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredScholarships.map(scholarship => (
              <ScholarshipCard key={scholarship._id} scholarship={scholarship} />
            ))}
          </div>
        )}
      </section>

      {/* Guarantee Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#EA580C] to-[#0F172A] text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FEF3C7]">No Black-Box AI</span>
            <h3 className="text-3xl font-extrabold font-serif">
              “Why am I eligible?” Explained with total clarity.
            </h3>
            <p className="text-sm sm:text-base text-orange-100 leading-relaxed">
              Unlike generic AI platforms that spit out arbitrary scores without context, ScholarNest shows you exact checkmarks for your course, academic marks, income bracket, and state domicile — plus what documents you need to prepare.
            </p>
            <div className="pt-4">
              <button
                onClick={() => navigate('/onboarding')}
                className="px-6 py-3.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-extrabold text-sm shadow-md transition-all cursor-pointer"
              >
                Create Your Profile Now
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
