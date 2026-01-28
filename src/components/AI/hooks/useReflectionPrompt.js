import { useState, useCallback } from 'react';
import * as aiService from '../../../services/aiService';

/**
 * Hook to fetch AI-generated reflection prompts for delivered letters.
 *
 * @example
 * const { prompt, loading, error, fetch } = useReflectionPrompt();
 *
 * // Fetch for a specific letter
 * fetch(letterId);
 *
 * // Display the prompt
 * {prompt && <p>{prompt}</p>}
 */
const useReflectionPrompt = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetch = useCallback(async (letterId) => {
    if (!letterId) {
      setError('Letter ID is required');
      return null;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await aiService.getReflectionPrompt(letterId);
      setPrompt(result.prompt);
      return result.prompt;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setPrompt('');
    setError(null);
  }, []);

  return { prompt, loading, error, fetch, clear };
};

export default useReflectionPrompt;
