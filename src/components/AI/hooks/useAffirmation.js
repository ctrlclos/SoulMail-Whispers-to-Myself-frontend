import { useState, useCallback } from 'react';
import * as aiService from '../../../services/aiService';

/**
 * Hook to fetch AI-generated affirmations.
 *
 * @example
 * const { affirmation, loading, error, fetch } = useAffirmation();
 *
 * // Fetch on button click
 * <button onClick={() => fetch('morning')}>Get Affirmation</button>
 *
 * // Or fetch on mount
 * useEffect(() => { fetch(); }, []);
 */
const useAffirmation = () => {
  const [affirmation, setAffirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetch = useCallback(async (timeOfDay = null) => {
    setLoading(true);
    setError(null);
    try {
      const result = await aiService.getAffirmation(timeOfDay);
      setAffirmation(result.affirmation);
      return result.affirmation;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setAffirmation('');
    setError(null);
  }, []);

  return { affirmation, loading, error, fetch, clear };
};

export default useAffirmation;
