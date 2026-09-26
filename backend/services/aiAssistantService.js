/**
 * NestGuide Intelligent Assistant Service
 * Natural language processing & scholarship guidance assistant
 */

function processNaturalQuery(queryText, scholarships, studentProfile = null) {
  if (!queryText || typeof queryText !== 'string') {
    return {
      reply: "I am ready to help! Ask me about scholarships by course, state, income limit, or funding amount.",
      filteredScholarships: scholarships.slice(0, 6),
      suggestedFilters: {}
    };
  }

  const query = queryText.toLowerCase();
  let matched = [...scholarships];
  let extractedCriteria = [];

  // Parse Income
  const incomeMatch = query.match(/(?:below|under|less than|<)\s*₹?\s*(\d+)(?:\s*lakh|\s*lakhs|\s*l)?/i) || query.match(/(\d+)\s*lakh/i);
  let incomeCap = null;
  if (incomeMatch) {
    const lakhVal = parseFloat(incomeMatch[1]);
    if (!isNaN(lakhVal)) {
      incomeCap = lakhVal * 100000;
      extractedCriteria.push(`Max Income: ≤ ₹${lakhVal} Lakhs`);
      matched = matched.filter(s => s.maxFamilyIncome <= incomeCap || s.maxFamilyIncome >= 10000000);
    }
  }

  // Parse Gender
  if (query.includes('female') || query.includes('women') || query.includes('girl')) {
    extractedCriteria.push(`Target Group: Women / Female Students`);
    matched = matched.filter(s => s.genderEligibility.includes('Female') || s.genderEligibility.includes('All'));
  }

  // Parse Field / Course
  if (query.includes('computer science') || query.includes('cse') || query.includes('it') || query.includes('tech') || query.includes('engineering')) {
    extractedCriteria.push(`Field: Engineering & Tech`);
    matched = matched.filter(s => s.fieldsOfStudy.includes('All') || s.fieldsOfStudy.some(f => /engineering|computer science|technology/i.test(f)));
  } else if (query.includes('medicine') || query.includes('mbbs') || query.includes('medical') || query.includes('health')) {
    extractedCriteria.push(`Field: Medicine & Health Sciences`);
    matched = matched.filter(s => s.fieldsOfStudy.includes('All') || s.fieldsOfStudy.some(f => /medicine|health|mbbs|nursing/i.test(f)));
  } else if (query.includes('commerce') || query.includes('finance') || query.includes('b.com') || query.includes('management')) {
    extractedCriteria.push(`Field: Commerce & Management`);
    matched = matched.filter(s => s.fieldsOfStudy.includes('All') || s.fieldsOfStudy.some(f => /commerce|finance|management|business/i.test(f)));
  }

  // Parse Location / State
  const states = ['tamil nadu', 'maharashtra', 'delhi', 'karnataka', 'kerala', 'uttar pradesh', 'west bengal', 'gujarat'];
  for (const state of states) {
    if (query.includes(state)) {
      extractedCriteria.push(`Location: ${state.toUpperCase()}`);
      matched = matched.filter(s => s.location.toLowerCase().includes(state) || s.location.toLowerCase().includes('all india'));
      break;
    }
  }

  // Parse Deadline / Closing soon
  if (query.includes('closing this month') || query.includes('urgent') || query.includes('soon') || query.includes('deadline')) {
    extractedCriteria.push(`Urgency: Closing Soon`);
    const thirtyDays = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    matched = matched.filter(s => new Date(s.deadline) <= thirtyDays);
  }

  // Parse Fully Funded
  if (query.includes('fully funded') || query.includes('100%')) {
    extractedCriteria.push(`Funding: Fully Funded / Tuition Waiver`);
    matched = matched.filter(s => s.fundingType === 'Fully Funded' || s.fundingType === 'Tuition Fee Waiver');
  }

  // Response synthesis
  let reply = '';
  if (extractedCriteria.length > 0) {
    reply = `I found **${matched.length} scholarships** matching your query (${extractedCriteria.join(' • ')}). Here are the top recommendations tailored for your journey:`;
  } else {
    reply = `Based on your search "${queryText}", I found **${matched.length} relevant scholarship opportunities**:`;
  }

  return {
    reply,
    extractedCriteria,
    filteredScholarships: matched.slice(0, 10),
    totalCount: matched.length
  };
}

module.exports = { processNaturalQuery };
