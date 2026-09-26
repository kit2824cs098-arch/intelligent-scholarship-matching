/**
 * ScholarNest Intelligent Matching Engine
 * 
 * Calculates weighted match score for a given student profile against a scholarship:
 * - Academic eligibility: 25%
 * - Financial eligibility: 20%
 * - Course / Field: 20%
 * - Location: 15%
 * - Demographic eligibility: 10%
 * - Achievements & Leadership: 10%
 */

function calculateMatchScore(profile, scholarship) {
  if (!profile) {
    return {
      matchPercentage: 70, // default placeholder for guest users
      breakdown: {
        academicScore: 25,
        financialScore: 20,
        courseScore: 15,
        locationScore: 10,
        demographicScore: 10,
        achievementScore: 5
      },
      matchedCriteria: ['General eligibility preview'],
      missingCriteria: ['Complete your profile for precise matching'],
      eligibilityRisks: [],
      readyToApply: false
    };
  }

  let matchedCriteria = [];
  let missingCriteria = [];
  let eligibilityRisks = [];

  // 1. Academic Eligibility (Max 25 points)
  let academicScore = 0;
  const studentGpa = profile.gpaPercentage || 0;
  const reqGpa = scholarship.minAcademicPercentage || 0;

  if (reqGpa === 0 || studentGpa >= reqGpa) {
    academicScore = 25;
    matchedCriteria.push(`Academic score (${studentGpa}%) meets requirement (${reqGpa === 0 ? 'No min req' : 'Min ' + reqGpa + '%'})`);
  } else if (studentGpa >= reqGpa - 5) {
    academicScore = 15;
    missingCriteria.push(`Academic score (${studentGpa}%) is slightly below required (${reqGpa}%)`);
    eligibilityRisks.push(`Academic waiver or recommendation letter may be required`);
  } else {
    academicScore = 5;
    missingCriteria.push(`Academic score (${studentGpa}%) does not meet minimum requirement (${reqGpa}%)`);
  }

  // 2. Financial Eligibility (Max 20 points)
  let financialScore = 0;
  const studentIncome = profile.annualIncomeAmount || 350000;
  const maxIncome = scholarship.maxFamilyIncome || 10000000;

  if (maxIncome >= 10000000) {
    financialScore = 20;
    matchedCriteria.push(`Open to all income slabs (No upper financial cap)`);
  } else if (studentIncome <= maxIncome) {
    financialScore = 20;
    matchedCriteria.push(`Family income (₹${(studentIncome / 100000).toFixed(1)}L) falls within eligible limit (Max ₹${(maxIncome / 100000).toFixed(1)}L)`);
  } else {
    financialScore = 5;
    missingCriteria.push(`Family income (₹${(studentIncome / 100000).toFixed(1)}L) exceeds specified ceiling (₹${(maxIncome / 100000).toFixed(1)}L)`);
    eligibilityRisks.push(`Requires verified income certificate / salary slip`);
  }

  // 3. Course / Field / Education Level (Max 20 points)
  let courseScore = 0;
  const studentLevel = profile.educationLevel || '';
  const studentField = (profile.degreeCourse + ' ' + profile.specialization).toLowerCase();
  
  const matchesLevel = scholarship.educationLevel.includes('All') || 
                       scholarship.educationLevel.includes(studentLevel);

  let matchesField = scholarship.fieldsOfStudy.includes('All') || scholarship.fieldsOfStudy.length === 0;
  if (!matchesField) {
    matchesField = scholarship.fieldsOfStudy.some(field => 
      studentField.includes(field.toLowerCase()) || field.toLowerCase().includes('all')
    );
  }

  if (matchesLevel && matchesField) {
    courseScore = 20;
    matchedCriteria.push(`Your level (${studentLevel}) and study field match requirement`);
  } else if (matchesLevel) {
    courseScore = 12;
    matchedCriteria.push(`Education level (${studentLevel}) matches requirement`);
    missingCriteria.push(`Field of study may require specific relevance verification`);
  } else {
    courseScore = 5;
    missingCriteria.push(`Education level (${studentLevel}) differs from target levels (${scholarship.educationLevel.join(', ')})`);
  }

  // 4. Location Eligibility (Max 15 points)
  let locationScore = 0;
  const studentState = (profile.stateCountry || 'All India').toLowerCase();
  const reqLocation = (scholarship.location || 'All India').toLowerCase();

  if (reqLocation === 'all india' || reqLocation === 'national' || reqLocation === 'any' || studentState.includes(reqLocation) || reqLocation.includes(studentState)) {
    locationScore = 15;
    matchedCriteria.push(`Location (${profile.stateCountry || 'National'}) is eligible`);
  } else {
    locationScore = 5;
    missingCriteria.push(`Scholarship target location (${scholarship.location}) differs from state (${profile.stateCountry})`);
  }

  // 5. Demographic Eligibility (Gender & Category) (Max 10 points)
  let demographicScore = 0;
  const genderOk = scholarship.genderEligibility.includes('All') || scholarship.genderEligibility.includes(profile.gender);
  const categoryOk = scholarship.categoryEligibility.includes('All') || scholarship.categoryEligibility.includes(profile.categoryCommunity);

  if (genderOk && categoryOk) {
    demographicScore = 10;
    matchedCriteria.push(`Gender and category demographics match eligibility`);
  } else if (genderOk) {
    demographicScore = 6;
    matchedCriteria.push(`Gender eligibility (${profile.gender}) met`);
    missingCriteria.push(`Category requirement (${scholarship.categoryEligibility.join('/')}) should be checked`);
  } else {
    demographicScore = 2;
    missingCriteria.push(`Specific demographic criteria targeted (${scholarship.genderEligibility.join('/')})`);
  }

  // 6. Achievements & Skills (Max 10 points)
  let achievementScore = 5; // base score for profile existence
  if (profile.skills && profile.skills.length > 0) achievementScore += 2;
  if (profile.certifications && profile.certifications.length > 0) achievementScore += 1;
  if (profile.isFirstGeneration && scholarship.firstGenOnly) {
    achievementScore += 2;
    matchedCriteria.push(`First-generation student priority matched`);
  }
  achievementScore = Math.min(10, achievementScore);
  matchedCriteria.push(`Skills & achievements profile factored into eligibility evaluation`);

  // Calculate Total Match Percentage
  const totalScore = academicScore + financialScore + courseScore + locationScore + demographicScore + achievementScore;
  const matchPercentage = Math.min(99, Math.max(25, Math.round(totalScore)));

  // Check deadline risk
  const daysLeft = Math.ceil((new Date(scholarship.deadline) - new Date()) / (1000 * 60 * 60 * 24));
  if (daysLeft < 7 && daysLeft >= 0) {
    eligibilityRisks.push(`Application deadline is approaching in ${daysLeft} day${daysLeft === 1 ? '' : 's'}!`);
  } else if (daysLeft < 0) {
    eligibilityRisks.push(`Scholarship deadline has passed for current cycle.`);
  }

  return {
    matchPercentage,
    breakdown: {
      academicScore,
      financialScore,
      courseScore,
      locationScore,
      demographicScore,
      achievementScore
    },
    matchedCriteria,
    missingCriteria,
    eligibilityRisks,
    requirementsMet: `${matchedCriteria.length} of ${matchedCriteria.length + missingCriteria.length} criteria met`
  };
}

module.exports = { calculateMatchScore };
