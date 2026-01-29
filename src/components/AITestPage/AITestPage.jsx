import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import NavBar from '../NavBar/NavBar';
import * as aiService from '../../services/aiService';
import * as letterService from '../../services/letterService';

const AITestPage = () => {
  const { user } = useContext(UserContext);

  // Affirmation state
  const [affirmation, setAffirmation] = useState('');
  const [affirmationLoading, setAffirmationLoading] = useState(false);
  const [affirmationTime, setAffirmationTime] = useState('morning');

  // Writing prompts state
  const [writingPrompts, setWritingPrompts] = useState([]);
  const [promptsLoading, setPromptsLoading] = useState(false);
  const [promptMood, setPromptMood] = useState('');
  const [promptTheme, setPromptTheme] = useState('');
  const [promptCount, setPromptCount] = useState(3);

  // Reflection prompt state
  const [reflectionPrompt, setReflectionPrompt] = useState('');
  const [reflectionLoading, setReflectionLoading] = useState(false);
  const [deliveredLetters, setDeliveredLetters] = useState([]);
  const [selectedLetterId, setSelectedLetterId] = useState('');

  // Error state
  const [error, setError] = useState('');

  // Fetch delivered letters on mount
  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const letters = await letterService.index();
        const delivered = letters.filter((l) => l.isDelivered);
        setDeliveredLetters(delivered);
        if (delivered.length > 0) {
          setSelectedLetterId(delivered[0]._id);
        }
      } catch (err) {
        console.log('Error fetching letters:', err);
      }
    };
    fetchLetters();
  }, []);

  // Handle getting affirmation
  const handleGetAffirmation = async () => {
    setAffirmationLoading(true);
    setError('');
    try {
      const result = await aiService.getAffirmation(affirmationTime);
      setAffirmation(result.affirmation);
    } catch (err) {
      setError(`Affirmation error: ${err.message}`);
    } finally {
      setAffirmationLoading(false);
    }
  };

  // Handle getting writing prompts
  const handleGetWritingPrompts = async () => {
    setPromptsLoading(true);
    setError('');
    try {
      const options = {};
      if (promptMood) options.mood = promptMood;
      if (promptTheme) options.theme = promptTheme;
      if (promptCount) options.count = promptCount;

      const result = await aiService.getWritingPrompts(options);
      setWritingPrompts(result.prompts);
    } catch (err) {
      setError(`Writing prompts error: ${err.message}`);
    } finally {
      setPromptsLoading(false);
    }
  };

  // Handle getting reflection prompt
  const handleGetReflectionPrompt = async () => {
    if (!selectedLetterId) {
      setError('Please select a delivered letter first');
      return;
    }
    setReflectionLoading(true);
    setError('');
    try {
      const result = await aiService.getReflectionPrompt(selectedLetterId);
      setReflectionPrompt(result.prompt);
    } catch (err) {
      setError(`Reflection prompt error: ${err.message}`);
    } finally {
      setReflectionLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="header">
        <img src="/images/logo.png" alt="SoulMail Logo" className="logo-image" />
        <NavBar />
      </div>

      <div className="dashboard-wrapper">
        <div className="greeting">AI Features Test Page</div>
        <p className="dashboard-tagline">Test the AI endpoints</p>

        {error && (
          <div style={{
            background: '#ff6b6b',
            color: 'white',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        {/* Affirmation Section */}
        <div className="dashboard-section" style={{ marginBottom: '24px' }}>
          <div className="section-header">
            <h3>1. Positive Affirmation</h3>
          </div>
          <div className="section-content" style={{ padding: '16px' }}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>
                Time of Day:
              </label>
              <select
                value={affirmationTime}
                onChange={(e) => setAffirmationTime(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  width: '200px',
                }}
              >
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
                <option value="night">Night</option>
              </select>
            </div>
            <button
              onClick={handleGetAffirmation}
              disabled={affirmationLoading}
              className="action-btn"
              style={{ marginBottom: '12px' }}
            >
              {affirmationLoading ? 'Loading...' : 'Get Affirmation'}
            </button>
            {affirmation && (
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '20px',
                borderRadius: '12px',
                fontSize: '1.1em',
                fontStyle: 'italic',
              }}>
                "{affirmation}"
              </div>
            )}
          </div>
        </div>

        {/* Writing Prompts Section */}
        <div className="dashboard-section" style={{ marginBottom: '24px' }}>
          <div className="section-header">
            <h3>2. Writing Prompts</h3>
          </div>
          <div className="section-content" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px' }}>
                  Mood (optional):
                </label>
                <input
                  type="text"
                  value={promptMood}
                  onChange={(e) => setPromptMood(e.target.value)}
                  placeholder="e.g., hopeful, reflective"
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    width: '180px',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px' }}>
                  Theme (optional):
                </label>
                <input
                  type="text"
                  value={promptTheme}
                  onChange={(e) => setPromptTheme(e.target.value)}
                  placeholder="e.g., gratitude, goals"
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    width: '180px',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px' }}>
                  Count:
                </label>
                <select
                  value={promptCount}
                  onChange={(e) => setPromptCount(Number(e.target.value))}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    width: '80px',
                  }}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={handleGetWritingPrompts}
              disabled={promptsLoading}
              className="action-btn"
              style={{ marginBottom: '12px' }}
            >
              {promptsLoading ? 'Loading...' : 'Get Writing Prompts'}
            </button>
            {writingPrompts.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {writingPrompts.map((prompt, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#f8f9fa',
                      padding: '16px',
                      borderRadius: '8px',
                      borderLeft: '4px solid #667eea',
                    }}
                  >
                    <strong>Prompt {idx + 1}:</strong>
                    <p style={{ margin: '8px 0 0 0' }}>{prompt}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Reflection Prompt Section */}
        <div className="dashboard-section" style={{ marginBottom: '24px' }}>
          <div className="section-header">
            <h3>3. Reflection Prompt (for Delivered Letters)</h3>
          </div>
          <div className="section-content" style={{ padding: '16px' }}>
            {deliveredLetters.length === 0 ? (
              <p style={{ color: '#666' }}>
                No delivered letters found. You need at least one delivered letter to test this feature.
              </p>
            ) : (
              <>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '8px' }}>
                    Select a Delivered Letter:
                  </label>
                  <select
                    value={selectedLetterId}
                    onChange={(e) => setSelectedLetterId(e.target.value)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #ccc',
                      width: '100%',
                      maxWidth: '400px',
                    }}
                  >
                    {deliveredLetters.map((letter) => (
                      <option key={letter._id} value={letter._id}>
                        {letter.title || 'Untitled'} - {new Date(letter.deliveredAt).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleGetReflectionPrompt}
                  disabled={reflectionLoading}
                  className="action-btn"
                  style={{ marginBottom: '12px' }}
                >
                  {reflectionLoading ? 'Loading...' : 'Get Reflection Prompt'}
                </button>
              </>
            )}
            {reflectionPrompt && (
              <div style={{
                background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                color: 'white',
                padding: '20px',
                borderRadius: '12px',
                fontSize: '1.1em',
              }}>
                <strong>Reflection Question:</strong>
                <p style={{ margin: '12px 0 0 0', fontStyle: 'italic' }}>
                  "{reflectionPrompt}"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITestPage;
