import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import NavBar from '../NavBar/NavBar';
import { CelebrationModal } from '../Celebrations';
import { getCelebrationMessage, CELEBRATION_TYPES } from '../../utils/celebrationUtils';
import * as letterService from '../../services/letterService';
import './LetterDetails.css';
import FlipLetter from '../FlipLetter/FlipLetter';
import DrawingOverlay from '../DrawingOverlay/DrawingOverlay'

const LetterDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const [letter, setLetter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reflectionInput, setReflectionInput] = useState('');
    const [submittingReflection, setSubmittingReflection] = useState(false);
    const [formError, setFormError] = useState(null);

    const [celebration, setCelebration] = useState(null);
    const [goalReflections, setGoalReflections] = useState({});
    const [showCarryForward, setShowCarryForward] = useState(null);
    const [availableLetters, setAvailableLetters] = useState([]);
    const [selectedLetter, setSelectedLetter] = useState('');

    const [drawingMode, setDrawingMode] = useState(false);
    const moods = {
        '☺️': { emoji: '☺️', label: 'Happy' },
        '😢': { emoji: '😢', label: 'Sad' },
        '😰': { emoji: '😰', label: 'Anxious' },
        '🤩': { emoji: '🤩', label: 'Excited' },
        '🙏': { emoji: '🙏', label: 'Grateful' },
        '😫': { emoji: '😫', label: 'Exhausted' }
    };

    const weatherIcons = {
        sunny: '☀️',
        cloudy: '☁️',
        rainy: '🌧️',
        snowy: '❄️'
    };

    useEffect(() => {
        const fetchLetter = async () => {
            try {
                setLoading(true);
                const fetchedLetter = await letterService.show(id);
                setLetter(fetchedLetter);
                setError(null);
            } catch (err) {
                console.error(err);
                setError('Failed to load letter. It may not exist or you may not have permission to view it.');
            } finally {
                setLoading(false);
            }
        };

        if (user && id) {
            fetchLetter();
        }
    }, [user, id]);

    useEffect(() => {
        const fetchAvailableLetters = async () => {
            if (!showCarryForward) return;
            try {
                const letters = await letterService.index();
                const available = letters.filter(l => !l.isDelivered && l._id !== id);
                setAvailableLetters(available);
            } catch (err) {
                console.log(err);
            }
        };
        fetchAvailableLetters();
    }, [showCarryForward, id]);

    const handleDelete = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this letter? This action cannot be undone.');

        if (!confirmDelete) return;

        try {
            await letterService.deleteLetter(id);
            navigate('/');
        } catch (err) {
            console.error(err);
            setError('Failed to delete letter.');
        }
    };

    const handleAddReflection = async (e) => {
        e.preventDefault();
        setFormError(null);

        if (!reflectionInput.trim()) return;

        try {
            setSubmittingReflection(true);
            const updatedLetter = await letterService.addReflection(id, { reflection: reflectionInput });
            setLetter(updatedLetter);
            setReflectionInput('');
        } catch (err) {
            console.error(err);
            setFormError(err.message);
        } finally {
            setSubmittingReflection(false);
        }
    };

    const handleDeleteReflection = async (reflectionId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this reflection?');

        if (!confirmDelete) return;

        try {
            setFormError(null);
            const updatedLetter = await letterService.deleteReflection(id, reflectionId);
            setLetter(updatedLetter);
        } catch (err) {
            console.error(err);
            setFormError(err.message);
        }
    };

    const handleGoalStatusChange = async (goalId, status) => {
        try {
            const updatedLetter = await letterService.updateGoalStatus(id, goalId, { status });
            setLetter(updatedLetter);

            if (status === 'accomplished') {
                const goals = letter.goals?.find(g => g._id === goalId);
                setCelebration({
                    type: CELEBRATION_TYPES.GOAL_ACCOMPLISHED,
                    ...getCelebrationMessage('goalAccomplished', { goalText: goals?.text })
            });
            }
        } catch (err) {
            console.log(err);
            setFormError(err.message);
        }
    };

    const handleAddGoalReflection = async (goalId) => {
        try {
            const reflection = goalReflections[goalId];
            if (!reflection?.trim()) return;

            const updatedLetter =await letterService.addGoalReflection(id, goalId, reflection);
            setLetter(updatedLetter);
            setGoalReflections({ ...goalReflections, [goalId]: '' });
        } catch (err) {
            console.log(err)
            setFormError(err.message);
        }
    };
    
    const handleCarryForward = async (goalId) => {
        try {
            if (!selectedLetter) return;

            const result = await letterService.carryGoalForward(id, goalId, selectedLetter);
            setLetter(result.oldLetter);
            setShowCarryForward(null);
            setSelectedLetter('');
        } catch (err) {
            console.log(err);
            setFormError(err.message);
        }
    };

    const handleCelebrationClose = () => {
        setCelebration(null);
    };

    // Handle Drawing overlay
    const handleSaveOverlay = async (imagedata) => {
        try {
            const updatedLetter = await letterService.addOverlayDrawing(id, {overlayDrawing: imagedata});
            setLetter(updatedLetter);
            setDrawingMode(false);
        } catch (err) {
            console.log(err);
            setDrawingMode(false);
        }
    };

    // Handle delete Drawing
    const handleDeleteDrawing = async () => {
        const confirmDelete = window.confirm('Are you sure?')
        if(!confirmDelete) return;

        try {
            const updatedLetter = await letterService.deleteDrawing(id);
            setLetter(updatedLetter);
        } catch (err) {
            console.log(err);
            setFormError('Failed to delete drawing');
        }
    };
    
    const getStatusEmoji = (status) => {
        const emojis = {
            pending: '⏳',
            accomplished: '✅',
            inProgress: '🔄',
            abandoned: '🛑',
            carriedForward: '➡️'
        };
        return emojis[status] || '⏳';
    };
    const getStatusLabel = (status) => {
        const labels = {
            pending: 'Pending',
            accomplished: 'Accomplished',
            inProgress: 'In Progress',
            abandoned: 'Release',
            carriedForward: 'Carried Forward'
        };
        return labels[status] || 'Pending';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="header">
                    <img src="/images/logo.png" alt="SoulMail Logo" className="logo-image" />
                    <NavBar />
                </div>
                <div className="letter-details-wrapper">
                    <p className="loading-message">Loading your letter...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-container">
                <div className="header">
                    <img src="/images/logo.png" alt="SoulMail Logo" className="logo-image" />
                    <NavBar />
                </div>
                <div className="letter-details-wrapper">
                    <p className="error-message">{error}</p>
                    <Link to="/" className="back-link">Back to Dashboard</Link>
                </div>
            </div>
        );
    }

    if (!letter) {
        return (
            <div className="page-container">
                <div className="header">
                    <img src="/images/logo.png" alt="SoulMail Logo" className="logo-image" />
                    <NavBar />
                </div>
                <div className="letter-details-wrapper">
                    <p className="error-message">Letter not found.</p>
                    <Link to="/" className="back-link">Back to Dashboard</Link>
                </div>
            </div>
        );
    }

    // FRONT SIDE letter Content
    const letterFront = (
        <div className='letter-front-content'>
            <div className='letter-header-section'>
                <h1 className='letter-title-display'>{letter.title}</h1>
                <p className='letter-delivery-date'>
                    Delivered on {formatDate(letter.deliveredAt)}
                </p>
            </div>
            <div className='letter-metadata'>
                {letter.mood && moods[letter.mood] && (
                    <div className='metadata-item'>
                        <span className='metadata-label'>Mood:</span>
                        <span className='metadata-value'>
                            {moods[letter.mood].emoji} {moods[letter.mood].label}
                        </span>
                    </div>    
                )}

                {letter.weather && weatherIcons[letter.weather] && (
                    <div className='metadata-item'>
                        <span className='metadata-label'>Weather:</span>
                        <span className='metadata-value'>
                            {weatherIcons[letter.weather]} {letter.weather.charAt(0).toUpperCase() + letter.weather.slice(1)}
                        </span>
                     </div>   
                )}

                {letter.temperature && (
                    <div className='metadata-item'>
                        <span className='metadata-label'>Temperature:</span>
                        <span className='metadata-value'>{letter.temperature}℉</span>
                    </div>    
                )}

                {letter.location && (
                    <div className='metadata-item'>
                        <span className='metadata-label'>Location:</span>
                        <span className='metadata-value'>{letter.location}</span>
                    </div>
                )}

                {letter.currentSong && (
                    <div className='metadata-item'>
                        <span className='metadata-label'>Song:</span>
                        <span className='metadata-value'>{letter.currentSong}</span>
                    </div>
                )}

                {letter.topHeadLine && (
                    <div className='metadata-item'>
                        <span className='metadata-label'>Top Headline:</span>
                        <span className='metadata-value'>{letter.topHeadLine}</span>
                    </div>
                )}
            </div>

            <div className='letter-content-section'>
                <h3>Your Letter</h3>
                <div className='letter-content-display'>
                    {letter.content}
                </div>
            </div>

            {/* Display overlay drawing */}
            {letter.drawing && (
                <div className='letter-drawing-section'>
                    <h3>Your Drawing</h3>
                    <img src={letter.drawing} alt='Your drawing' className='letter-drawing-img' />
                </div>    
            )}

            {letter.overlayDrawing && (
                <div className='letter-overlay-section'>
                    <h3>Your Annotations</h3>
                    <img src={letter.overlayDrawing} alt='Your annotations' className='letter-overlay-img' />
                </div>    
            )}

            {/* Old Goals Format */}
                    {(letter.goal1 || letter.goal2 || letter.goal3) && (
                        <div className="letter-goals-section">
                            <h3>Goals You Set</h3>
                            <div className="goals-list-display">
                                {[letter.goal1, letter.goal2, letter.goal3]
                                    .filter(goal => goal)
                                    .map((goal, index) => (
                                        <div key={index} className="goal-item-display">
                                            <span>{goal}</span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                    {/* New Goals Array Format */}
                    {letter.goals && letter.goals.length > 0 && (
                        <div className='letter-goals-section'>
                            <h3>Your Goals ({letter.goals.length})</h3>

                            {letter.goals.map((goal) => (
                                <div key={goal._id} className='goal-card'>
                                    <div className='goal-header'>
                                        <span className='goal-status-emoji'>{getStatusEmoji(goal.status)}</span>
                                        <span className='goal-text'>{goal.text}</span>
                                        <span className='goal-status-label'>{getStatusLabel(goal.status)}</span>
                                    </div>
                    {goal.reflection && (
                        <div className='goal-reflection-display'>
                            <p><em>"{goal.reflection}"</em></p>
                            </div>
                    )}  

                    {/* Carried Forward */}
                    {goal.carriedForwardTo && (
                        <p className='carried-forward-info'>➡️ Carried forward to another letter</p>
                    )}
                    {goal.carriedForwardFrom && (
                        <p className='carried-forward-info'>⬅️ Carried forward from previous letter</p>
                    )}

                    {/* Goal Actions */}
                    {letter.isDelivered && goal.status === 'pending' && (
                        <div className='goal-actions'>
                            <button
                            className='goal-btn-accomplished'
                            onClick={() => handleGoalStatusChange(goal._id, 'accomplished')}>✅ Accomplished</button>
                            <button
                            className='goal-btn-in-progress'
                            onClick={() => handleGoalStatusChange(goal._id, 'inProgress')}>🔄 In Progess</button>
'                           <button
                            className='goal-btn-carry-forward'
                            onClick={() => setShowCarryForward(goal._id, 'carryForward')}>➡️ Carry Forward</button>
                            <button
                            className='goal-btn-abandon'
                            onClick={() => handleGoalStatusChange(goal._id, 'abandoned')}>🛑 Release</button>
                        </div>    
                    )}

                    {/* In Progress to be completed */}
                    {letter.isDelivered && goal.status === 'inProgress' && (
                        <div className='goal-actions'>
                            <button
                            className='goal-btn-accomplished'
                            onClick={() => handleGoalStatusChange(goal._id, 'accomplished')}>✅ Mark Accomplished</button>
                            <button
                            className='goal-btn-carry-forward'
                            onClick={() => setShowCarryForward(goal._id, 'carryForward')}>➡️ Carry Forward</button>
                        </div>    
                    )}

                    {/* Add Goal Reflection */}
                    {letter.isDelievered && goal.status !== 'pending' && !goal.reflection && (
                        <div className='goal-reflection-form'>
                            <input
                                type='text'
                                placeholder='Add a note about this goal...'
                                value= {goalReflections[goal._id] || ''}
                                onChange={(e) => setGoalReflections({
                                    ...goalReflections,
                                    [goal._id]: e.target.value
                                })}
                                maxLength={175}
                                />
                            <button onClick={() => handleAddGoalReflection(goal._id)}>Add</button>
                        </div>    
                    )}
                    {/* Carry Forward Modal */}
                    {showCarryForward === goal._id && (
                        <div className='carry-forward-modal'>
                            <h4>Carry this goal to:</h4>
                            {availableLetters.length === 0 ? (
                                <p>No undelivered letters available. Create a new letter first!</p>
                            ) : (
                                <>
                                <select 
                                    value={selectedLetter}
                                    onChange={(e) => setSelectedLetters(e.target.value)}>

                                   <option value="">Select a letter...</option>
                                   {availableLetters.map((l) => (
                                        <option key={l._id} value={l._id}>
                                            {l.title} (Delivers:{formatDate(l.deliveredAt)})
                                        </option>
                                   ))} 
                                </select>
                                <div className='carry-forward-actions'>
                                    <button onClick={() => handleCarryForward(goal._id)}>Carry Forward</button>
                                    <button onClick={() => setShowCarryForward(null)}>Cancel</button>
                                    </div>    
                                </>
                            )}
                        </div>    
                    )}
                </div>    
            ))}
        </div>          
    )}
    <p className='flip-hint'>Flip the page to add or view reflections 👉</p>
</div>
    );

    const letterBack = (
        <div className='letter-back-content'>
            <div className='letter-header-section'>
                <h2>✨ Reflections</h2>
                <p className='letter-delivery-date'>Lokking back at: {letter.title}</p>
        </div>
                        
                        {letter.reflections && letter.reflections.length > 0 ? (
                            <div className="reflections-list">
                                {letter.reflections.map((reflection) => (
                                    <div key={reflection._id} className="reflection-item">
                                        <div className="reflection-content">
                                            {reflection.reflection}
                                        </div>
                                        <div className="reflection-footer">
                                            <span className="reflection-date">
                                                {formatDate(reflection.date)}
                                            </span>
                                            <button
                                                onClick={() => handleDeleteReflection(reflection._id)}
                                                className="reflection-delete-btn"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="no-reflections">No reflections yet. Add one below!</p>
                        )}

                        <form onSubmit={handleAddReflection} className="reflection-form">
                            {formError && (
                                <div className="form-error-inline">
                                    <span className="form-error-message">{formError}</span>
                                    <button
                                        type="button"
                                        className="form-error-dismiss"
                                        onClick={() => setFormError(null)}
                                    >
                                        ×
                                    </button>
                                </div>
                            )}
                            <textarea
                                value={reflectionInput}
                                onChange={(e) => {
                                    setReflectionInput(e.target.value);
                                    if (formError) setFormError(null);
                                }}
                                placeholder="Write a reflection on how you feel reading this letter now..."
                                rows="4"
                                disabled={submittingReflection}
                                className={formError ? 'input-error' : ''}
                            />
                            <div className="reflection-form-footer">
                                <span className={`char-count ${reflectionInput.length < 50 ? 'char-count-warning' : ''}`}>
                                    {reflectionInput.length}/50 minimum characters
                                </span>
                                <button
                                    type="submit"
                                    className="submit-btn"
                                    disabled={submittingReflection || !reflectionInput.trim()}
                                >
                                    {submittingReflection ? 'Adding...' : 'Add Reflection'}
                                </button>
                            </div>
                        </form>
                        <p className='flip-hint'>Flip back to read your letter 👉</p>
        </div>
        );

        {/* Main Render */}
    return (
        <div className="page-container">
            {/* Celebration Modal */}
            {celebration && (
                <CelebrationModal
                celebration={celebration}
                onClose={handleCelebrationClose}
                />
            )}

            <div className="header">
                <img src="/images/logo.png" alt="SoulMail Logo" className="logo-image" />
                <NavBar />
            </div>

            <div className="letter-details-wrapper">
                <Link to="/" className="back-link">← Back to Dashboard</Link>


                {/* Drawing Overlay */}
                <DrawingOverlay
                    isActive={drawingMode}
                    onSave={handleSaveOverlay}
                    onClose={() => setDrawingMode(false)}
                    />
                </div>

                {/* Draw on Letter Button */}
                <div className='letter-actions-secton'>
                    <button
                        onClick={() => setDrawingMode(true)}
                        className='draw-btn'
                        disabled={drawingMode}>✏️ Draw on Letter</button>

                    {(letter.drawing || letter.overlayDrawinging)} && (
                    <button onClick={handleDeleteDrawing} className='delete-drawing-btn'>🗑️ Delete Drawing</button>
                    )
                </div>

                {/* Flip Letter Component */}
                <FlipLetter front={letterFront} back={letterBack} />

                    <div className="letter-actions-section">
                        <button onClick={handleDelete} className="delete-btn-large">
                            Delete Letter
                        </button>
                    </div>
                </div>
    );
};

export default LetterDetails;
