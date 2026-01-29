const ITUNES_API_URL = 'https://itunes.apple.com/search';

/**
 * Search for songs on iTunes
 * searchTerm - The search query (artist name, song title, etc.)
 * returns Array of song results from iTunes
 */
const searchSongs = async (searchTerm) => {
  if (!searchTerm || !searchTerm.trim()) {
    return [];
  }

  const term = searchTerm.trim().replace(/\s+/g, '+');
  const params = new URLSearchParams({
    term,
    limit: '5',
    entity: 'song',
  });

  const res = await fetch(`${ITUNES_API_URL}?${params.toString()}`);

  if (!res.ok) {
    throw new Error('Failed to search iTunes');
  }

  const data = await res.json();

  return data.results || [];
};

export { searchSongs };
