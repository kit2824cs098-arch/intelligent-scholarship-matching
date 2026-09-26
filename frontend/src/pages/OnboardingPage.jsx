import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import confetti from 'canvas-confetti';
import { 
  GraduationCap, 
  DollarSign, 
  UserCheck, 
  Award, 
  SlidersHorizontal, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles 
} from 'lucide-react';

const OnboardingPage = () => {
  const { user, profile, updateProfileState, openLoginModal } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State initialized with existing profile if available
  const [formData, setFormData] = useState({
    educationLevel: 'Undergraduate',
    degreeCourse: 'B.Tech / B.E.',
    specialization: 'Computer Science',
    institutionType: 'Government College / University',
    yearOfStudy: '2nd Year',
    gpaPercentage: 80,

    familyIncomeRange: '₹2,50,000 - ₹5,00,000',
    needsAssistance: true,
    isFirstGeneration: false,
    additionalFinancialNotes: '',

    stateCountry: 'Maharashtra',
    gender: 'Male',
    categoryCommunity: 'General',
    disabilityStatus: false,

    skillsInput: 'JavaScript, Python, Problem Solving',
    certificationsInput: 'Fullstack Dev Certification',
    extracurricularsInput: 'Debate Club Secretary',
    sportsAchievements: '',
    researchProjects: '',
    leadershipRoles: 'Student Council Representative',
    communityService: 'Volunteered at local literacy camp',

    minFundingPreference: 50000,
    studyDestination: 'India',
    preferredField: 'Engineering & Technology',
    deadlinePreference: 'Anytime'
  });

  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        educationLevel: profile.educationLevel || prev.educationLevel,
        degreeCourse: profile.degreeCourse || prev.degreeCourse,
        specialization: profile.specialization || prev.specialization,
        institutionType: profile.institutionType || prev.institutionType,
        yearOfStudy: profile.yearOfStudy || prev.yearOfStudy,
        gpaPercentage: profile.gpaPercentage || prev.gpaPercentage,

        familyIncomeRange: profile.familyIncomeRange || prev.familyIncomeRange,
        needsAssistance: profile.needsAssistance !== undefined ? profile.needsAssistance : prev.needsAssistance,
        isFirstGeneration: profile.isFirstGeneration !== undefined ? profile.isFirstGeneration : prev.isFirstGeneration,
        additionalFinancialNotes: profile.additionalFinancialNotes || prev.additionalFinancialNotes,

        stateCountry: profile.stateCountry || prev.stateCountry,
        gender: profile.gender || prev.gender,
        categoryCommunity: profile.categoryCommunity || prev.categoryCommunity,
        disabilityStatus: profile.disabilityStatus !== undefined ? profile.disabilityStatus : prev.disabilityStatus,

        skillsInput: profile.skills ? profile.skills.join(', ') : prev.skillsInput,
        certificationsInput: profile.certifications ? profile.certifications.join(', ') : prev.certificationsInput,
        extracurricularsInput: profile.extracurriculars ? profile.extracurriculars.join(', ') : prev.extracurricularsInput,
        sportsAchievements: profile.sportsAchievements || prev.sportsAchievements,
        researchProjects: profile.researchProjects || prev.researchProjects,
        leadershipRoles: profile.leadershipRoles || prev.leadershipRoles,
        communityService: profile.communityService || prev.communityService,

        minFundingPreference: profile.minFundingPreference || prev.minFundingPreference,
        studyDestination: profile.studyDestination || prev.studyDestination,
        preferredField: profile.preferredField || prev.preferredField,
        deadlinePreference: profile.deadlinePreference || prev.deadlinePreference
      }));
    }
  }, [profile]);

  const stepsList = [
    { id: 1, name: 'Education', icon: GraduationCap },
    { id: 2, name: 'Background', icon: DollarSign },
    { id: 3, name: 'Eligibility', icon: UserCheck },
    { id: 4, name: 'Achievements', icon: Award },
    { id: 5, name: 'Preferences', icon: SlidersHorizontal }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSaveProfile = async () => {
    if (!user) {
      openLoginModal();
      return;
    }

    setLoading(true);

    const payload = {
      ...formData,
      skills: formData.skillsInput.split(',').map(s => s.trim()).filter(Boolean),
      certifications: formData.certificationsInput.split(',').map(c => c.trim()).filter(Boolean),
      extracurriculars: formData.extracurricularsInput.split(',').map(e => e.trim()).filter(Boolean)
    };

    try {
      const res = await API.put('/profile', payload);
      updateProfileState(res.data.profile);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      navigate('/discover');
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      
      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C] bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
          Personalized Discovery Engine
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif mt-2">
          Setup Your Student Profile
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Provide your details to calculate exact weighted eligibility scores for 20+ active scholarships.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-10">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[#EAE3D9] -z-10"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#EA580C] transition-all duration-300 -z-10"
            style={{ width: `${((step - 1) / 4) * 100}%` }}
          ></div>

          {stepsList.map((s) => {
            const isDone = s.id < step;
            const isCurrent = s.id === step;

            return (
              <div key={s.id} className="flex flex-col items-center">
                <button
                  onClick={() => setStep(s.id)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-xs cursor-pointer ${
                    isCurrent
                      ? 'bg-[#EA580C] text-white ring-4 ring-orange-100'
                      : isDone
                      ? 'bg-amber-600 text-white'
                      : 'bg-white text-slate-400 border border-slate-300'
                  }`}
                >
                  {isDone ? <Check className="w-5 h-5" /> : s.id}
                </button>
                <span className={`text-[11px] font-bold mt-2 hidden sm:block ${
                  isCurrent ? 'text-[#EA580C]' : 'text-slate-500'
                }`}>
                  {s.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Container */}
      <div className="warm-card p-6 sm:p-10 shadow-lg">
        
        {/* Step 1: Education */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <h3 className="text-lg font-bold text-slate-900 font-serif border-b pb-3 border-[#EAE3D9] flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#EA580C]" />
              Step 1 — Education Level & Academic Track
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Current Education Level</label>
                <select
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleChange}
                  className="w-full text-sm p-3 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="High School (10th/12th)">High School (10th/12th)</option>
                  <option value="Undergraduate">Undergraduate (B.Tech, B.Sc, B.Com, MBBS, etc.)</option>
                  <option value="Postgraduate">Postgraduate (M.Tech, M.Sc, MBA, etc.)</option>
                  <option value="Doctorate/PhD">Doctorate / PhD</option>
                  <option value="Diploma/Vocational">Diploma / Vocational Track</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Degree / Course Name</label>
                <input
                  type="text"
                  name="degreeCourse"
                  value={formData.degreeCourse}
                  onChange={handleChange}
                  placeholder="e.g. B.Tech, B.Sc Computer Science, MBBS"
                  className="w-full text-sm p-3 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Specialization / Major</label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  placeholder="e.g. Artificial Intelligence, Data Science, Finance"
                  className="w-full text-sm p-3 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Institution Type</label>
                <select
                  name="institutionType"
                  value={formData.institutionType}
                  onChange={handleChange}
                  className="w-full text-sm p-3 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Government College / University">Government College / University</option>
                  <option value="Private University">Private University</option>
                  <option value="Deemed University">Deemed University</option>
                  <option value="Autonomous Institute">Autonomous Institute</option>
                  <option value="School">School</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Year of Study</label>
                <select
                  name="yearOfStudy"
                  value={formData.yearOfStudy}
                  onChange={handleChange}
                  className="w-full text-sm p-3 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year / Final Year">4th Year / Final Year</option>
                  <option value="Postgraduate Year 1">Postgraduate Year 1</option>
                  <option value="Postgraduate Year 2">Postgraduate Year 2</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Academic Score / Percentage ({formData.gpaPercentage}%)
                </label>
                <input
                  type="range"
                  min="40"
                  max="100"
                  step="1"
                  name="gpaPercentage"
                  value={formData.gpaPercentage}
                  onChange={handleChange}
                  className="w-full accent-[#EA580C]"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Enter your latest percentage score (or multiply CGPA by 9.5/10)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Financial Background */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <h3 className="text-lg font-bold text-slate-900 font-serif border-b pb-3 border-[#EAE3D9] flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#D97706]" />
              Step 2 — Financial Background & Income Criteria
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Annual Family Income Range</label>
                <select
                  name="familyIncomeRange"
                  value={formData.familyIncomeRange}
                  onChange={handleChange}
                  className="w-full text-sm p-3 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Below ₹1,00,000">Below ₹1,00,000 (EWS / Ultra Low Income)</option>
                  <option value="₹1,00,000 - ₹2,50,000">₹1,00,000 - ₹2,50,000 (Low Income Ceiling)</option>
                  <option value="₹2,50,000 - ₹5,00,000">₹2,50,000 - ₹5,00,000 (Lower Middle Income)</option>
                  <option value="₹5,00,000 - ₹8,00,000">₹5,00,000 - ₹8,00,000 (Middle Income)</option>
                  <option value="Above ₹8,00,000">Above ₹8,00,000 (Higher Income)</option>
                </select>
              </div>

              <div className="p-4 bg-[#FFFDF9] border border-[#F5EBE0] rounded-xl space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isFirstGeneration"
                    checked={formData.isFirstGeneration}
                    onChange={handleChange}
                    className="w-5 h-5 accent-[#EA580C] rounded"
                  />
                  <div>
                    <span className="text-sm font-bold text-slate-900">First-Generation Student</span>
                    <p className="text-xs text-slate-500">Check this if you are the first member of your immediate family to pursue a university degree.</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="needsAssistance"
                    checked={formData.needsAssistance}
                    onChange={handleChange}
                    className="w-5 h-5 accent-[#EA580C] rounded"
                  />
                  <div>
                    <span className="text-sm font-bold text-slate-900">Financial Assistance Requirement</span>
                    <p className="text-xs text-slate-500">Actively seeking tuition waivers or accommodation stipends.</p>
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Additional Financial Context (Optional)</label>
                <textarea
                  name="additionalFinancialNotes"
                  value={formData.additionalFinancialNotes}
                  onChange={handleChange}
                  rows={2}
                  placeholder="e.g. Single parent household, agricultural income certificate, etc."
                  className="w-full text-sm p-3 rounded-xl border border-slate-300"
                ></textarea>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Personal Eligibility */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in">
            <h3 className="text-lg font-bold text-slate-900 font-serif border-b pb-3 border-[#EAE3D9] flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#EA580C]" />
              Step 3 — State Domicile & Demographics
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">State / Domicile Location</label>
                <select
                  name="stateCountry"
                  value={formData.stateCountry}
                  onChange={handleChange}
                  className="w-full text-sm p-3 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="All India">All India / National</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Delhi">Delhi NCR</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Other State">Other State</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Gender Eligibility</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full text-sm p-3 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-Binary / Other">Non-Binary / Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category / Community (Contextually Appropriate)</label>
                <select
                  name="categoryCommunity"
                  value={formData.categoryCommunity}
                  onChange={handleChange}
                  className="w-full text-sm p-3 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="General">General Category</option>
                  <option value="OBC">OBC (Other Backward Classes)</option>
                  <option value="SC">SC (Scheduled Castes)</option>
                  <option value="ST">ST (Scheduled Tribes)</option>
                  <option value="EWS">EWS (Economically Weaker Section)</option>
                  <option value="Minority">Minority Community</option>
                </select>
              </div>

              <div className="flex items-center pt-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="disabilityStatus"
                    checked={formData.disabilityStatus}
                    onChange={handleChange}
                    className="w-5 h-5 accent-[#EA580C] rounded"
                  />
                  <div>
                    <span className="text-sm font-bold text-slate-900">Benchmark Disability Status (40%+)</span>
                    <p className="text-xs text-slate-500">Eligible for Samarth & special inclusive education grants.</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Achievements */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in">
            <h3 className="text-lg font-bold text-slate-900 font-serif border-b pb-3 border-[#EAE3D9] flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-600" />
              Step 4 — Skills, Projects & Extracurriculars
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Skills & Technical Competencies (Comma Separated)</label>
                <input
                  type="text"
                  name="skillsInput"
                  value={formData.skillsInput}
                  onChange={handleChange}
                  placeholder="e.g. Python, Machine Learning, Accounting, Creative Writing"
                  className="w-full text-sm p-3 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Certifications & Courses</label>
                <input
                  type="text"
                  name="certificationsInput"
                  value={formData.certificationsInput}
                  onChange={handleChange}
                  placeholder="e.g. AWS Certified, NPTEL Online Course"
                  className="w-full text-sm p-3 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Leadership Roles</label>
                  <input
                    type="text"
                    name="leadershipRoles"
                    value={formData.leadershipRoles}
                    onChange={handleChange}
                    placeholder="e.g. Code Club Lead, Class Representative"
                    className="w-full text-sm p-3 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Community Service / Volunteering</label>
                  <input
                    type="text"
                    name="communityService"
                    value={formData.communityService}
                    onChange={handleChange}
                    placeholder="e.g. NSS Volunteer, Literacy Campaign"
                    className="w-full text-sm p-3 rounded-xl border border-slate-300"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Preferences */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in">
            <h3 className="text-lg font-bold text-slate-900 font-serif border-b pb-3 border-[#EAE3D9] flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-orange-600" />
              Step 5 — Scholarship Preferences
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Study Destination</label>
                <select
                  name="studyDestination"
                  value={formData.studyDestination}
                  onChange={handleChange}
                  className="w-full text-sm p-3 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="India">Study in India</option>
                  <option value="International">International Study (USA/UK/Germany/Canada)</option>
                  <option value="Both">Both Domestic & Abroad Opportunities</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Deadline Preference</label>
                <select
                  name="deadlinePreference"
                  value={formData.deadlinePreference}
                  onChange={handleChange}
                  className="w-full text-sm p-3 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Anytime">Show All Active Opportunities</option>
                  <option value="Closing Soon (Within 30 Days)">Closing Soon (Within 30 Days)</option>
                  <option value="Next 3 Months">Next 3 Months</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-[#EAE3D9] flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={step === 1}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm disabled:opacity-40 flex items-center gap-2 hover:bg-slate-100 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>

          {step < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-3 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-sm flex items-center gap-2 shadow-md cursor-pointer"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={loading}
              className="px-7 py-3 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-extrabold text-sm shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              {loading ? 'Saving Profile...' : 'Save Profile & Discover Scholarships'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default OnboardingPage;
