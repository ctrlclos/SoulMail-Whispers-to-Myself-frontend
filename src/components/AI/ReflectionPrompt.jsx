import { useEffect } from 'react';
import useReflectionPrompt from './hooks/useReflectionPrompt';

/**
 * Reflection prompt component for delivered letters.
 * Generates a personalized reflection question based on letter content.
 *
 * props
 * props.letterId - ID of the delivered letter (required)
 * props.autoFetch - Fetch on mount (default: true)
 * props.className - CSS class for container
 * props.onLoad - Callback when prompt loads
 * props.showRegenerate - Show regenerate button (default: true)
 *
 * // Simple usage
 * <ReflectionPrompt letterId={letter._id} />
 *
 * // Custom rendering
 * <ReflectionPrompt letterId={id} autoFetch={false}>
 *   {({ prompt, loading, fetch }) => (
 *     <div>
 *       <button onClick={fetch}>Generate Reflection</button>
 *       {prompt && <blockquote>{prompt}</blockquote>}
 *     </div>
 *   )}
 * </ReflectionPrompt>
 */
const ReflectionPrompt = ({
  letterId,
  autoFetch = true,
  className = '',
  onLoad = null,
  onError = null,
  loadingText = 'Generating reflection question...',
  showRegenerate = true,
  children = null,
}) => {
  const { prompt, loading, error, fetch } = useReflectionPrompt();

  useEffect(() => {
    if (autoFetch && letterId) {
      fetch(letterId).then((result) => {
        if (result && onLoad) onLoad(result);
      });
    }
  }, [autoFetch, letterId, fetch, onLoad]);

  useEffect(() => {
    if (error && onError) onError(error);
  }, [error, onError]);

  const handleRegenerate = () => {
    fetch(letterId);
  };

  // Allow custom rendering via children
  if (children) {
    return children({ prompt, loading, error, fetch: () => fetch(letterId) });
  }

  if (loading) return <div className={className}>{loadingText}</div>;
  if (error) {
    return (
      <div className={`${className} reflection-prompt-container`}>
        <span>Unable to generate reflection</span>
        {showRegenerate && (
          <button
            type="button"
            className="regenerate-btn"
            onClick={handleRegenerate}
            disabled={loading}
          >
            Try Again
          </button>
        )}
      </div>
    );
  }
  if (!prompt) return null;

  return (
    <div className={`${className} reflection-prompt-container`}>
      <span>{prompt}</span>
      {showRegenerate && (
        <button
          type="button"
          className="regenerate-btn"
          onClick={handleRegenerate}
          disabled={loading}
          title="Get a different question"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 2v6h-6" />
            <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
            <path d="M3 22v-6h6" />
            <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
          </svg>
          <span className="regenerate-text">New Question</span>
        </button>
      )}
    </div>
  );
};

export default ReflectionPrompt;
