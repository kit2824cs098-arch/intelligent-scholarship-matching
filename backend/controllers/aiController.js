const Scholarship = require('../models/Scholarship');
const StudentProfile = require('../models/StudentProfile');
const { processNaturalQuery } = require('../services/aiAssistantService');
const { calculateMatchScore } = require('../services/matchingService');

exports.askNestGuide = async (req, res) => {
  try {
    const { query } = req.body;
    let studentProfile = null;
    if (req.user && req.user.id) {
      studentProfile = await StudentProfile.findOne({ user: req.user.id });
    }

    const allScholarships = await Scholarship.find({});
    
    // Enrich scholarships with match percentages
    const enriched = allScholarships.map(sch => {
      const match = calculateMatchScore(studentProfile, sch);
      return {
        ...sch.toObject(),
        matchPercentage: match.matchPercentage
      };
    });

    const result = processNaturalQuery(query, enriched, studentProfile);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMissingRequirementsAnalysis = async (req, res) => {
  try {
    const { scholarshipId } = req.params;
    const scholarship = await Scholarship.findById(scholarshipId);
    if (!scholarship) return res.status(404).json({ error: 'Scholarship not found' });

    let studentProfile = null;
    if (req.user && req.user.id) {
      studentProfile = await StudentProfile.findOne({ user: req.user.id });
    }

    const matchResult = calculateMatchScore(studentProfile, scholarship);
    
    res.json({
      scholarshipTitle: scholarship.title,
      matchPercentage: matchResult.matchPercentage,
      matchedCriteria: matchResult.matchedCriteria,
      missingCriteria: matchResult.missingCriteria,
      eligibilityRisks: matchResult.eligibilityRisks,
      requiredDocuments: scholarship.requiredDocuments,
      almostThereMessage: `You meet ${matchResult.matchedCriteria.length} of ${matchResult.matchedCriteria.length + matchResult.missingCriteria.length} major requirements.`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
