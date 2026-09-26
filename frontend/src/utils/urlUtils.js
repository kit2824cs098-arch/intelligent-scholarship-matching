/**
 * Utility functions for validating and parsing Official Scholarship Application URLs
 */

export const getValidOfficialUrl = (scholarship) => {
  if (!scholarship) return null;
  const rawUrl = (scholarship.officialApplicationUrl || scholarship.officialUrl || '').trim();
  if (!rawUrl) return null;

  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return rawUrl;
    }
  } catch (e) {
    // If rawUrl doesn't have protocol but is a valid domain like www.google.com
    if (rawUrl.startsWith('www.')) {
      return `https://${rawUrl}`;
    }
  }
  
  if (rawUrl.startsWith('https://') || rawUrl.startsWith('http://')) {
    return rawUrl;
  }

  return null;
};

export const getDomainFromUrl = (urlStr) => {
  if (!urlStr) return 'official-provider-portal.org';
  try {
    const parsed = new URL(urlStr);
    return parsed.hostname.replace(/^www\./, '');
  } catch (e) {
    return 'official-provider-portal.org';
  }
};
