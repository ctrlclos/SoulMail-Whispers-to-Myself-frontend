const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/ai`;

/**
 * Get authorization headers with JWT token
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

/**
 * Get a positive affirmation
 * timeOfDay - morning, afternoon, evening, night (optional)
 */
const getAffirmation = async (timeOfDay = null) => {
  const params = timeOfDay ? `?timeOfDay=${timeOfDay}` : '';
  const res = await fetch(`${BASE_URL}/affirmation${params}`, {
    headers: getAuthHeaders(),
  });

  const data = await res.json();

  if (!data.success) {
    throw new Error(data.error?.message || 'Failed to get affirmation');
  }

  return data.data;
};

/**
 * Get AI-generated writing prompts
 * options - Optional parameters
 * options.mood - Current mood
 * options.theme - Theme for prompts
 * options.count - Number of prompts (1-5)
 */
const getWritingPrompts = async (options = {}) => {
  const params = new URLSearchParams();
  if (options.mood) params.append('mood', options.mood);
  if (options.theme) params.append('theme', options.theme);
  if (options.count) params.append('count', options.count);

  const queryString = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${BASE_URL}/writing-prompts${queryString}`, {
    headers: getAuthHeaders(),
  });

  const data = await res.json();

  if (!data.success) {
    throw new Error(data.error?.message || 'Failed to get writing prompts');
  }

  return data.data;
};

/**
 * Get a personalized reflection prompt for a delivered letter
 *  letterId - ID of the delivered letter
 */
const getReflectionPrompt = async (letterId) => {
  const res = await fetch(`${BASE_URL}/reflection-prompt`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ letterId }),
  });

  const data = await res.json();

  if (!data.success) {
    throw new Error(data.error?.message || 'Failed to get reflection prompt');
  }

  return data.data;
};

export { getAffirmation, getWritingPrompts, getReflectionPrompt };
