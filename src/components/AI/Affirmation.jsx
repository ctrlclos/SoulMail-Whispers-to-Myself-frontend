import { useEffect } from 'react';
import useAffirmation from './hooks/useAffirmation';

/**
 * Simple affirmation display component.
 * Fetches an affirmation on mount or when refresh is called.
 *
 * props
 * props.timeOfDay - 'morning' | 'afternoon' | 'evening' | 'night'
 * props.autoFetch - Fetch automatically on mount (default: true)
 * props.className - CSS class for the container
 * props.onLoad - Callback when affirmation loads
 * props.onError - Callback on error
 *
 * // Auto-fetch on mount
 * <Affirmation timeOfDay="morning" />
 *
 * // Manual fetch with ref
 * const ref = useRef();
 * <Affirmation ref={ref} autoFetch={false} />
 * <button onClick={() => ref.current.refresh()}>Refresh</button>
 */
const Affirmation = ({
  timeOfDay = null,
  autoFetch = true,
  className = '',
  onLoad = null,
  onError = null,
  loadingText = 'Loading affirmation...',
  children = null,
}) => {
  const { affirmation, loading, error, fetch } = useAffirmation();

  useEffect(() => {
    if (autoFetch) {
      fetch(timeOfDay).then((result) => {
        if (result && onLoad) onLoad(result);
      });
    }
  }, [autoFetch, timeOfDay, fetch, onLoad]);

  useEffect(() => {
    if (error && onError) onError(error);
  }, [error, onError]);

  // Allow custom rendering via children
  if (children) {
    return children({ affirmation, loading, error, refresh: () => fetch(timeOfDay) });
  }

  if (loading) return <div className={className}>{loadingText}</div>;
  if (error) return <div className={className}>Unable to load affirmation</div>;
  if (!affirmation) return null;

  return <div className={className}>{affirmation}</div>;
};

export default Affirmation;
