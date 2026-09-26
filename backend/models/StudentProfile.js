const mongoose = require('mongoose');

const StudentProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  // Step 1: Education
  educationLevel: {
    type: String,
    enum: ['High School (10th/12th)', 'Undergraduate', 'Postgraduate', 'Doctorate/PhD', 'Diploma/Vocational'],
    default: 'Undergraduate'
  },
  degreeCourse: { type: String, default: '' }, // e.g. B.Tech / B.E., B.Sc, M.Tech, MBBS, B.Com
  specialization: { type: String, default: '' }, // e.g. Computer Science, Mechanical, Finance, BioTech
  institutionType: {
    type: String,
    enum: ['Government College / University', 'Private University', 'Deemed University', 'Autonomous Institute', 'School'],
    default: 'Government College / University'
  },
  yearOfStudy: { type: String, default: '1st Year' },
  gpaPercentage: { type: Number, default: 75 }, // Academic percentage or equivalent CGPA scale * 10

  // Step 2: Financial Background
  familyIncomeRange: {
    type: String,
    enum: ['Below ₹1,00,000', '₹1,00,000 - ₹2,50,000', '₹2,50,000 - ₹5,00,000', '₹5,00,000 - ₹8,00,000', 'Above ₹8,00,000'],
    default: '₹2,50,000 - ₹5,00,000'
  },
  annualIncomeAmount: { type: Number, default: 350000 }, // Numerical representation for rule evaluation
  needsAssistance: { type: Boolean, default: true },
  isFirstGeneration: { type: Boolean, default: false },
  additionalFinancialNotes: { type: String, default: '' },

  // Step 3: Personal Eligibility
  stateCountry: { type: String, default: 'National' }, // e.g. Maharashtra, Tamil Nadu, Delhi, All India
  gender: {
    type: String,
    enum: ['All', 'Female', 'Male', 'Non-Binary / Other', 'Prefer not to say'],
    default: 'All'
  },
  categoryCommunity: {
    type: String,
    enum: ['General', 'OBC', 'SC', 'ST', 'EWS', 'Minority', 'All'],
    default: 'General'
  },
  disabilityStatus: { type: Boolean, default: false },

  // Step 4: Achievements
  skills: [{ type: String }],
  certifications: [{ type: String }],
  extracurriculars: [{ type: String }],
  sportsAchievements: { type: String, default: '' },
  researchProjects: { type: String, default: '' },
  leadershipRoles: { type: String, default: '' },
  communityService: { type: String, default: '' },

  // Step 5: Preferences
  minFundingPreference: { type: Number, default: 10000 },
  studyDestination: { type: String, default: 'India' },
  preferredField: { type: String, default: '' },
  deadlinePreference: { type: String, default: 'Anytime' },

  // Metadata
  isProfileCompleted: { type: Boolean, default: false },
  completionPercentage: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StudentProfile', StudentProfileSchema);
