const Scholarship = require('../models/Scholarship');
const StudentProfile = require('../models/StudentProfile');
const { calculateMatchScore } = require('../services/matchingService');

exports.getAllScholarships = async (req, res) => {
  try {
    const { 
      search, 
      location, 
      educationLevel, 
      field, 
      minAmount, 
      maxIncome, 
      fullyFunded,
      urgentDeadline 
    } = req.query;

    let filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { provider: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (location && location !== 'All') {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (educationLevel && educationLevel !== 'All') {
      filter.educationLevel = { $in: [educationLevel, 'All'] };
    }

    if (field && field !== 'All') {
      filter.fieldsOfStudy = { $in: [new RegExp(field, 'i'), 'All'] };
    }

    if (minAmount) {
      filter.amount = { $gte: Number(minAmount) };
    }

    if (maxIncome) {
      filter.maxFamilyIncome = { $lte: Number(maxIncome) };
    }

    if (fullyFunded === 'true') {
      filter.fundingType = { $in: ['Fully Funded', 'Tuition Fee Waiver'] };
    }

    if (urgentDeadline === 'true') {
      const thirtyDays = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      filter.deadline = { $lte: thirtyDays, $gte: new Date() };
    }

    let scholarships = await Scholarship.find(filter).sort({ deadline: 1 });

    // If user is logged in as a student, attach calculated match details
    let studentProfile = null;
    if (req.user && req.user.id) {
      studentProfile = await StudentProfile.findOne({ user: req.user.id });
    }

    const results = scholarships.map(sch => {
      const matchResult = calculateMatchScore(studentProfile, sch);
      return {
        ...sch.toObject(),
        matchPercentage: matchResult.matchPercentage,
        matchBreakdown: matchResult.breakdown,
        matchedCriteria: matchResult.matchedCriteria,
        missingCriteria: matchResult.missingCriteria,
        eligibilityRisks: matchResult.eligibilityRisks
      };
    });

    // Sort by match percentage descending by default
    results.sort((a, b) => b.matchPercentage - a.matchPercentage);

    // Calculate aggregated stats
    const totalMatchingCount = results.length;
    const totalFundingAvailable = results.reduce((sum, item) => sum + item.amount, 0);
    const upcomingDeadlinesCount = results.filter(item => {
      const days = Math.ceil((new Date(item.deadline) - new Date()) / (86400000));
      return days >= 0 && days <= 15;
    }).length;

    res.json({
      totalCount: totalMatchingCount,
      totalFundingAvailable,
      upcomingDeadlinesCount,
      profileCompletion: studentProfile ? studentProfile.completionPercentage : 0,
      scholarships: results
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getScholarshipById = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) {
      return res.status(404).json({ error: 'Scholarship not found' });
    }

    let studentProfile = null;
    if (req.user && req.user.id) {
      studentProfile = await StudentProfile.findOne({ user: req.user.id });
    }

    const matchResult = calculateMatchScore(studentProfile, scholarship);

    res.json({
      scholarship,
      matchPercentage: matchResult.matchPercentage,
      matchBreakdown: matchResult.breakdown,
      matchedCriteria: matchResult.matchedCriteria,
      missingCriteria: matchResult.missingCriteria,
      eligibilityRisks: matchResult.eligibilityRisks,
      requirementsMet: matchResult.requirementsMet
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createScholarship = async (req, res) => {
  try {
    const newScholarship = await Scholarship.create({
      ...req.body,
      isSampleData: false // manually created scholarships are non-sample by default
    });
    res.status(201).json({ message: 'Scholarship created successfully', scholarship: newScholarship });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateScholarship = async (req, res) => {
  try {
    const updated = await Scholarship.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Scholarship not found' });
    res.json({ message: 'Scholarship updated successfully', scholarship: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteScholarship = async (req, res) => {
  try {
    const deleted = await Scholarship.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Scholarship not found' });
    res.json({ message: 'Scholarship deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
