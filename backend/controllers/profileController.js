const StudentProfile = require('../models/StudentProfile');

// Helper to calculate profile completion percentage
function calculateCompletion(profileData) {
  let score = 0;
  // Step 1: Education
  if (profileData.educationLevel) score += 10;
  if (profileData.degreeCourse) score += 10;
  if (profileData.gpaPercentage > 0) score += 10;
  
  // Step 2: Financial
  if (profileData.familyIncomeRange) score += 15;
  if (profileData.needsAssistance !== undefined) score += 5;

  // Step 3: Eligibility
  if (profileData.stateCountry) score += 10;
  if (profileData.gender) score += 10;
  if (profileData.categoryCommunity) score += 10;

  // Step 4: Achievements
  if (profileData.skills && profileData.skills.length > 0) score += 10;
  if (profileData.certifications || profileData.extracurriculars || profileData.sportsAchievements) score += 5;

  // Step 5: Preferences
  if (profileData.preferredField || profileData.studyDestination) score += 5;

  return Math.min(100, score);
}

exports.getProfile = async (req, res) => {
  try {
    let profile = await StudentProfile.findOne({ user: req.user.id });
    if (!profile) {
      profile = await StudentProfile.create({ user: req.user.id });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    let profile = await StudentProfile.findOne({ user: req.user.id });
    if (!profile) {
      profile = new StudentProfile({ user: req.user.id });
    }

    // Merge request body
    Object.assign(profile, req.body);
    
    // Convert familyIncomeRange to approximate annualIncomeAmount for matching engine
    if (req.body.familyIncomeRange) {
      switch(req.body.familyIncomeRange) {
        case 'Below ₹1,00,000': profile.annualIncomeAmount = 80000; break;
        case '₹1,00,000 - ₹2,50,000': profile.annualIncomeAmount = 180000; break;
        case '₹2,50,000 - ₹5,00,000': profile.annualIncomeAmount = 350000; break;
        case '₹5,00,000 - ₹8,00,000': profile.annualIncomeAmount = 650000; break;
        case 'Above ₹8,00,000': profile.annualIncomeAmount = 1000000; break;
        default: profile.annualIncomeAmount = 350000;
      }
    }

    profile.completionPercentage = calculateCompletion(profile);
    profile.isProfileCompleted = profile.completionPercentage >= 70;
    profile.updatedAt = new Date();

    await profile.save();
    res.json({ message: 'Profile updated successfully', profile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
