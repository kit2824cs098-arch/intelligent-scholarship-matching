import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  Search, 
  User, 
  LogOut, 
  ShieldCheck, 
  Menu, 
  X, 
  Calendar, 
  CheckSquare,
  Sparkles
} from 'lucide-react';

const Navbar = () => {
  const { user, profile, logout, openLoginModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#EAE3D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#EA580C] to-[#F97316] text-white flex items-center justify-center shadow-md shadow-orange-900/10 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6 text-[#FEF3C7]" />
            </div>
            <div>
              <span className="text-2xl font-extrabold text-[#0F172A] tracking-tight font-serif">
                Scholar<span className="text-[#EA580C]">Nest</span>
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-[#D97706]">
                Student Funding Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-colors ${
                isActive('/') ? 'bg-[#FFEDD5] text-[#C2410C]' : 'text-slate-700 hover:text-[#EA580C] hover:bg-orange-50/60'
              }`}
            >
              Home
            </Link>
            <Link
              to="/discover"
              className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-1.5 ${
                isActive('/discover') ? 'bg-[#FFEDD5] text-[#C2410C]' : 'text-slate-700 hover:text-[#EA580C] hover:bg-orange-50/60'
              }`}
            >
              <Search className="w-4 h-4 text-[#EA580C]" />
              Find Scholarships
            </Link>
            <Link
              to="/deadlines"
              className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-1.5 ${
                isActive('/deadlines') ? 'bg-[#FFEDD5] text-[#C2410C]' : 'text-slate-700 hover:text-[#EA580C] hover:bg-orange-50/60'
              }`}
            >
              <Calendar className="w-4 h-4 text-[#D97706]" />
              Deadlines
            </Link>
            <Link
              to="/dashboard"
              className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-1.5 ${
                isActive('/dashboard') ? 'bg-[#FFEDD5] text-[#C2410C]' : 'text-slate-700 hover:text-[#EA580C] hover:bg-orange-50/60'
              }`}
            >
              <CheckSquare className="w-4 h-4 text-amber-600" />
              My Journey
            </Link>
            <Link
              to="/about"
              className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-colors ${
                isActive('/about') ? 'bg-[#FFEDD5] text-[#C2410C]' : 'text-slate-700 hover:text-[#EA580C] hover:bg-orange-50/60'
              }`}
            >
              About
            </Link>

            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`px-3.5 py-2 rounded-xl text-sm font-bold text-amber-900 bg-amber-100/90 border border-amber-300 flex items-center gap-1.5 hover:bg-amber-200/90 transition-colors`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                Admin Panel
              </Link>
            )}
          </nav>

          {/* Right Controls / Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#EAE3D9] hover:border-orange-300 shadow-xs transition-all text-slate-800 font-medium text-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-[#EA580C] text-white flex items-center justify-center font-bold text-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-bold leading-tight text-slate-900">{user.name}</p>
                    <p className="text-[10px] text-slate-500 capitalize">{user.role}</p>
                  </div>
                </button>

                {/* Dropdown menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#EAE3D9] py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      {profile && (
                        <div className="mt-2 bg-orange-50 border border-orange-200 rounded-lg p-1.5 text-center">
                          <span className="text-[11px] font-bold text-[#EA580C]">
                            Profile Completion: {profile.completionPercentage}%
                          </span>
                        </div>
                      )}
                    </div>

                    <Link
                      to="/onboarding"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-orange-50/60"
                    >
                      <User className="w-4 h-4 text-[#EA580C]" />
                      Edit Profile / Onboarding
                    </Link>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-orange-50/60"
                    >
                      <CheckSquare className="w-4 h-4 text-amber-600" />
                      Saved & Applications
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-amber-900 hover:bg-amber-50"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-700" />
                        Admin Panel
                      </Link>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                        navigate('/');
                      }}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={openLoginModal}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-slate-700 hover:text-[#EA580C] hover:bg-orange-50/60 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/onboarding')}
                  className="px-5 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-sm font-extrabold shadow-md shadow-orange-900/15 hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#FEF3C7]" />
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex items-center md:hidden gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF8F5] border-b border-[#EAE3D9] px-4 pt-2 pb-6 space-y-2 shadow-lg">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-800 hover:bg-orange-50"
          >
            Home
          </Link>
          <Link
            to="/discover"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-800 hover:bg-orange-50"
          >
            Find Scholarships
          </Link>
          <Link
            to="/deadlines"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-800 hover:bg-orange-50"
          >
            Deadlines Tracker
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-800 hover:bg-orange-50"
          >
            My Journey
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-800 hover:bg-orange-50"
          >
            About
          </Link>

          {user?.role === 'admin' && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-bold text-amber-900 bg-amber-100"
            >
              Admin Panel
            </Link>
          )}

          <div className="pt-4 border-t border-slate-200">
            {user ? (
              <div className="space-y-2">
                <div className="px-3 py-1">
                  <p className="text-sm font-bold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate('/');
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-rose-600 font-semibold text-sm hover:bg-rose-50"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openLoginModal();
                  }}
                  className="w-full py-2.5 rounded-xl border border-slate-300 text-slate-800 font-bold text-center"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/onboarding');
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#EA580C] text-white font-bold text-center shadow-xs"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
