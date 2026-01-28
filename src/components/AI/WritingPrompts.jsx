import { useEffect } from 'react';
import useWritingPrompts from './hooks/useWritingPrompts';

/**
 * Writing prompts display component.
 * Fetches AI-generated writing prompts.
 *
 * props
 * props.mood - User's current mood
 * props.theme - Theme for prompts (gratitude, goals, etc.)
 * props.count - Number of prompts (1-5, default: 3)
 * props.autoFetch - Fetch on mount (default: true)
 * props.className - CSS class for container
 * props.promptClassName - CSS class for each prompt
 * props.onLoad - Callback when prompts load
 *
 * example
 * // Simple usage
 * <WritingPrompts mood="hopeful" count={3} />
 *
 * example
 * // Custom rendering
 * <WritingPrompts autoFetch={false}>
 *   {({ prompts, loading, fetch }) => (
 *     <div>
 *       <button onClick={() => fetch({ mood: 'happy' })}>Get Prompts</button>
 *       {prompts.map(p => <p key={p}>{p}</p>)}
 *     </div>
 *   )}
 * </WritingPrompts>
 */
const WritingPrompts = ({
  mood = null,
  theme = null,
  count = 3,
  autoFetch = true,
  className = '',
  promptClassName = '',
  onLoad = null,
  onError = null,
  loadingText = 'Getting writing inspiration...',
  children = null,
}) => {
  const { prompts, loading, error, fetch } = useWritingPrompts();

  const fetchOptions = { mood, theme, count };

  useEffect(() => {
    if (autoFetch) {
      fetch(fetchOptions).then((result) => {
        if (result?.length && onLoad) onLoad(result);
      });
    }
  }, [autoFetch]);

  useEffect(() => {
    if (error && onError) onError(error);
  }, [error, onError]);

  // Allow custom rendering via children
  if (children) {
    return children({ prompts, loading, error, fetch });
  }

  if (loading) return <div className={className}>{loadingText}</div>;
  if (error) return <div className={className}>Unable to load prompts</div>;
  if (!prompts.length) return null;

  return (
    <div className={className}>
      {prompts.map((prompt, idx) => (
        <div key={idx} className={promptClassName}>
          {prompt}
        </div>
      ))}
    </div>
  );
};

export default WritingPrompts;
