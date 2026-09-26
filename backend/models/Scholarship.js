const mongoose = require('mongoose');

const ScholarshipSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  provider: { type: String, required: true, trim: true }, // e.g. National Talent Foundation
  providerWebsite: { type: String, default: '' },
  providerDomain: { type: String, default: '' },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: '₹' },
  fundingType: {
    type: String,
    enum: ['Fully Funded', 'Partial Funding', 'Tuition Fee Waiver', 'One-time Grant', 'Monthly Stipend'],
    default: 'One-time Grant'
  },
  deadline: { type: Date, required: true },
  location: { type: String, default: 'All India' },
  educationLevel: [{
    type: String,
    enum: ['High School (10th/12th)', 'Undergraduate', 'Postgraduate', 'Doctorate/PhD', 'Diploma/Vocational', 'All']
  }],
  fieldsOfStudy: [{ type: String }],
  
  // Eligibility criteria rules
  minAcademicPercentage: { type: Number, default: 0 },
  maxFamilyIncome: { type: Number, default: 10000000 },
  genderEligibility: [{ type: String }],
  categoryEligibility: [{ type: String }],
  firstGenOnly: { type: Boolean, default: false },
  disabilityOnly: { type: Boolean, default: false },

  // Application & Checklist details
  requiredDocuments: [{ type: String }],
  selectionProcess: { type: String, default: 'Merit-cum-Means screening followed by an online interview.' },
  
  // Official URL & Redirect Verification
  officialApplicationUrl: { type: String, required: true, default: 'https://scholarships.gov.in' },
  officialUrl: { type: String, default: 'https://scholarships.gov.in' }, // backwards compatibility
  linkVerified: { type: Boolean, default: true },
  lastVerifiedDate: { type: Date, default: Date.now },

  // Tags and Badges
  verified: { type: Boolean, default: true },
  isSampleData: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Helper pre-save hook to extract domain automatically
ScholarshipSchema.pre('save', function(next) {
  const urlToUse = this.officialApplicationUrl || this.officialUrl;
  if (urlToUse) {
    try {
      const parsed = new URL(urlToUse);
      this.providerDomain = parsed.hostname.replace(/^www\./, '');
    } catch (e) {
      this.providerDomain = 'official-portal.org';
    }
  }
  next();
});

module.exports = mongoose.model('Scholarship', ScholarshipSchema);
