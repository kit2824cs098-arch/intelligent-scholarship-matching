import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Edit3, 
  RotateCcw,
  ExternalLink,
  AlertTriangle,
  Globe
} from 'lucide-react';

const AdminPage = () => {
  const { user } = useAuth();
  
  const [stats, setStats] = useState(null);
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    provider: '',
    providerWebsite: 'https://official-provider.org',
    officialApplicationUrl: 'https://official-provider.org/apply',
    description: '',
    amount: 100000,
    currency: '₹',
    fundingType: 'One-time Grant',
    deadline: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    location: 'All India',
    educationLevelInput: 'Undergraduate, Postgraduate',
    fieldsInput: 'Engineering, Computer Science',
    minAcademicPercentage: 60,
    maxFamilyIncome: 500000,
    requiredDocumentsInput: 'Academic transcript, Income certificate, ID proof',
    linkVerified: true
  });

  const [urlValidationError, setUrlValidationError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, schRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/scholarships')
      ]);
      setStats(statsRes.data);
      setScholarships(schRes.data.scholarships || []);
    } catch (err) {
      console.error('Failed to load admin panel data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const validateUrl = (urlStr) => {
    if (!urlStr || !urlStr.trim()) return 'Application URL cannot be empty';
    try {
      const parsed = new URL(urlStr);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return 'URL must start with http:// or https://';
      }
      return '';
    } catch (e) {
      return 'Invalid URL format (e.g. https://official-provider.org/apply)';
    }
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setUrlValidationError('');
    setFormData({
      title: '',
      provider: '',
      providerWebsite: 'https://official-provider.org',
      officialApplicationUrl: 'https://official-provider.org/apply',
      description: '',
      amount: 100000,
      currency: '₹',
      fundingType: 'One-time Grant',
      deadline: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      location: 'All India',
      educationLevelInput: 'Undergraduate, Postgraduate',
      fieldsInput: 'Engineering, Computer Science',
      minAcademicPercentage: 60,
      maxFamilyIncome: 500000,
      requiredDocumentsInput: 'Academic transcript, Income certificate, ID proof',
      linkVerified: true
    });
    setModalOpen(true);
  };

  const handleEditClick = (sch) => {
    setEditingId(sch._id);
    setUrlValidationError('');
    setFormData({
      title: sch.title,
      provider: sch.provider,
      providerWebsite: sch.providerWebsite || '',
      officialApplicationUrl: sch.officialApplicationUrl || sch.officialUrl || '',
      description: sch.description,
      amount: sch.amount,
      currency: sch.currency || '₹',
      fundingType: sch.fundingType || 'One-time Grant',
      deadline: new Date(sch.deadline).toISOString().split('T')[0],
      location: sch.location || 'All India',
      educationLevelInput: sch.educationLevel ? sch.educationLevel.join(', ') : 'All',
      fieldsInput: sch.fieldsOfStudy ? sch.fieldsOfStudy.join(', ') : 'All',
      minAcademicPercentage: sch.minAcademicPercentage || 0,
      maxFamilyIncome: sch.maxFamilyIncome || 10000000,
      requiredDocumentsInput: sch.requiredDocuments ? sch.requiredDocuments.join(', ') : 'Academic transcript',
      linkVerified: sch.linkVerified !== undefined ? sch.linkVerified : true
    });
    setModalOpen(true);
  };

  const handleSaveScholarship = async (e) => {
    e.preventDefault();
    
    // Validate HTTPS/HTTP Application URL
    const err = validateUrl(formData.officialApplicationUrl);
    if (err) {
      setUrlValidationError(err);
      return;
    }

    const payload = {
      ...formData,
      officialUrl: formData.officialApplicationUrl,
      amount: Number(formData.amount),
      minAcademicPercentage: Number(formData.minAcademicPercentage),
      maxFamilyIncome: Number(formData.maxFamilyIncome),
      educationLevel: formData.educationLevelInput.split(',').map(s => s.trim()).filter(Boolean),
      fieldsOfStudy: formData.fieldsInput.split(',').map(s => s.trim()).filter(Boolean),
      requiredDocuments: formData.requiredDocumentsInput.split(',').map(s => s.trim()).filter(Boolean),
      lastVerifiedDate: new Date()
    };

    try {
      if (editingId) {
        await API.put(`/scholarships/${editingId}`, payload);
      } else {
        await API.post('/scholarships', payload);
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save scholarship');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this scholarship entry?')) return;
    try {
      await API.delete(`/scholarships/${id}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete scholarship');
    }
  };

  const handleToggleVerify = async (id) => {
    try {
      await API.patch(`/admin/verify/${id}`);
      fetchData();
    } catch (err) {
      alert('Failed to update verification status');
    }
  };

  const handleResetSeed = async () => {
    if (!window.confirm('Reset database with initial 16 verified sample scholarships?')) return;
    try {
      await API.post('/admin/seed-reset');
      fetchData();
    } catch (err) {
      alert('Failed to reset dataset');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <ShieldCheck className="w-16 h-16 text-amber-600 mx-auto" />
        <h2 className="text-2xl font-bold font-serif text-slate-900">Admin Access Required</h2>
        <p className="text-sm text-slate-600">Please sign in as an admin (e.g. admin@scholarnest.edu) to access this dashboard.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE3D9] pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
            Administrative Control Panel
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 font-serif mt-1 flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-amber-700" />
            Scholarship Data & URL Management
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetSeed}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            Reset Seed Data
          </button>
          
          <button
            onClick={handleOpenAddModal}
            className="px-5 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-200" />
            Add Scholarship
          </button>
        </div>
      </div>

      {/* Stats Counter Bar */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="warm-card p-4">
            <p className="text-xs text-slate-500 font-bold uppercase">Registered Students</p>
            <p className="text-2xl font-extrabold text-slate-900 font-serif mt-1">{stats.totalStudents}</p>
          </div>
          <div className="warm-card p-4">
            <p className="text-xs text-slate-500 font-bold uppercase">Total Scholarships</p>
            <p className="text-2xl font-extrabold text-[#EA580C] font-serif mt-1">{stats.totalScholarships}</p>
          </div>
          <div className="warm-card p-4">
            <p className="text-xs text-slate-500 font-bold uppercase">Total Applications</p>
            <p className="text-2xl font-extrabold text-amber-800 font-serif mt-1">{stats.totalApplications}</p>
          </div>
          <div className="warm-card p-4">
            <p className="text-xs text-slate-500 font-bold uppercase">Total Funding Pool</p>
            <p className="text-2xl font-extrabold text-orange-700 font-serif mt-1">
              ₹{(stats.totalFundingPool / 100000).toFixed(1)} Lakhs
            </p>
          </div>
        </div>
      )}

      {/* Scholarship Catalog Table */}
      <div className="warm-card overflow-hidden">
        <div className="p-4 bg-[#FFFDF9] border-b border-[#EAE3D9] flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900 font-serif">Scholarship Catalog & Official URLs</h3>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">Loading catalog...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                <tr>
                  <th className="px-4 py-3">Scholarship & Provider</th>
                  <th className="px-4 py-3">Official Application URL</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Deadline</th>
                  <th className="px-4 py-3">Link Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {scholarships.map((sch) => {
                  const url = sch.officialApplicationUrl || sch.officialUrl || '#';
                  let domain = sch.providerDomain;
                  if (!domain) {
                    try { domain = new URL(url).hostname.replace(/^www\./, ''); } catch(e) { domain = 'portal.org'; }
                  }

                  return (
                    <tr key={sch._id} className="hover:bg-orange-50/40 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-bold text-slate-900 line-clamp-1">{sch.title}</p>
                        <p className="text-[11px] text-slate-500">{sch.provider}</p>
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#EA580C] font-bold hover:underline flex items-center gap-1 max-w-[220px] truncate"
                        >
                          <Globe className="w-3.5 h-3.5 shrink-0 text-orange-600" />
                          {domain}
                          <ExternalLink className="w-3 h-3 shrink-0 opacity-60" />
                        </a>
                      </td>
                      <td className="px-4 py-3 font-bold text-emerald-700">
                        {sch.currency || '₹'}{sch.amount ? sch.amount.toLocaleString('en-IN') : '0'}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-700">
                        {new Date(sch.deadline).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleVerify(sch._id)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                            sch.verified ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {sch.verified ? '✓ Official link verified' : '⚠ Needs verification'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          onClick={() => handleEditClick(sch)}
                          className="p-1.5 text-slate-500 hover:text-orange-700 cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(sch._id)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-[#EAE3D9] rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden max-h-[90vh] flex flex-col">
            
            <div className="bg-[#EA580C] text-white p-5 flex items-center justify-between">
              <h3 className="text-lg font-bold font-serif">
                {editingId ? 'Edit Scholarship & Official URL' : 'Add New Scholarship Entry'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-white hover:opacity-80">✕</button>
            </div>

            <form onSubmit={handleSaveScholarship} className="p-6 overflow-y-auto space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Scholarship Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Official Provider Name</label>
                  <input
                    type="text"
                    required
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              {/* Official Application URL Field with Validation */}
              <div className="p-3 bg-orange-50/60 border border-orange-200 rounded-xl space-y-2">
                <label className="block font-extrabold text-orange-950 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-[#EA580C]" />
                  Official Application URL (Destination Website)
                </label>
                <input
                  type="url"
                  required
                  value={formData.officialApplicationUrl}
                  onChange={(e) => {
                    setFormData({ ...formData, officialApplicationUrl: e.target.value });
                    setUrlValidationError(validateUrl(e.target.value));
                  }}
                  placeholder="https://official-provider-domain.org/apply"
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-mono text-xs focus:outline-none focus:border-[#EA580C]"
                />
                
                {urlValidationError ? (
                  <p className="text-[11px] text-rose-600 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {urlValidationError}
                  </p>
                ) : (
                  <p className="text-[10px] text-slate-500">
                    Must be a valid HTTPS/HTTP URL. ScholarNest does not modify or shorten destination URLs.
                  </p>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                ></textarea>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Funding Type</label>
                  <select
                    value={formData.fundingType}
                    onChange={(e) => setFormData({ ...formData, fundingType: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="One-time Grant">One-time Grant</option>
                    <option value="Fully Funded">Fully Funded</option>
                    <option value="Tuition Fee Waiver">Tuition Fee Waiver</option>
                    <option value="Monthly Stipend">Monthly Stipend</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Deadline Date</label>
                  <input
                    type="date"
                    required
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Location / State</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Education Levels (Comma Separated)</label>
                  <input
                    type="text"
                    value={formData.educationLevelInput}
                    onChange={(e) => setFormData({ ...formData, educationLevelInput: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Required Documents Checklist (Comma Separated)</label>
                <input
                  type="text"
                  value={formData.requiredDocumentsInput}
                  onChange={(e) => setFormData({ ...formData, requiredDocumentsInput: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!!urlValidationError}
                  className="px-6 py-2 rounded-xl bg-[#EA580C] text-white font-bold cursor-pointer disabled:opacity-50"
                >
                  Save Entry & Verify Link
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPage;
