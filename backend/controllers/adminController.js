const Scholarship = require('../models/Scholarship');
const User = require('../models/User');
const Application = require('../models/Application');
const seedDB = require('../seed/seedRunner');

exports.getAdminStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalScholarships = await Scholarship.countDocuments({});
    const totalApplications = await Application.countDocuments({});
    const sampleScholarshipsCount = await Scholarship.countDocuments({ isSampleData: true });
    
    // Total funding sum
    const scholarships = await Scholarship.find({}, 'amount');
    const totalFundingPool = scholarships.reduce((sum, s) => sum + (s.amount || 0), 0);

    res.json({
      totalStudents,
      totalScholarships,
      totalApplications,
      sampleScholarshipsCount,
      totalFundingPool
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.verifyScholarship = async (req, res) => {
  try {
    const { id } = req.params;
    const scholarship = await Scholarship.findById(id);
    if (!scholarship) return res.status(404).json({ error: 'Scholarship not found' });

    scholarship.verified = !scholarship.verified;
    await scholarship.save();
    res.json({ message: `Scholarship verified status updated to ${scholarship.verified}`, verified: scholarship.verified });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.runSeed = async (req, res) => {
  try {
    const seedResult = await seedDB();
    res.json({ message: 'Seed operation completed', result: seedResult });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
