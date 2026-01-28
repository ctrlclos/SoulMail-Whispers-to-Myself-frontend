import { useState, useCallback } from 'react';
import * as aiService from '../../../services/aiService';

/**
 * Hook to fetch AI-generated writing prompts.
 *
 * @example
 * const { prompts, loading, error, fetch } = useWritingPrompts();
 *
 * // Fetch with options
 * fetch({ mood: 'hopeful', theme: 'gratitude', count: 3 });
 *
 * // Display prompts
 * prompts.map(prompt => <p>{prompt}</p>)
 */
const useWritingPrompts = () => {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetch = useCallback(async (options = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await aiService.getWritingPrompts(options);
      setPrompts(result.prompts);
      return result.prompts;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setPrompts([]);
    setError(null);
  }, []);

  return { prompts, loading, error, fetch, clear };
};

export default useWritingPrompts;
