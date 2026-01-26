import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import NavBar from '../NavBar/NavBar';
import * as letterService from '../../services/letterService';
import './LetterDetails.css';

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

    return (
        <div className="page-container">
            <div className="header">
                <img src="/images/logo.png" alt="SoulMail Logo" className="logo-image" />
                <NavBar />
            </div>

            <div className="letter-details-wrapper">
                <Link to="/" className="back-link">← Back to Dashboard</Link>

                <div className="letter-details-box">
                    <div className="letter-header-section">
                        <h1 className="letter-title-display">{letter.title}</h1>
                        <p className="letter-delivery-date">
                            Delivered on {formatDate(letter.deliveredAt)}
                        </p>
                    </div>

                    <div className="letter-metadata">
                        {letter.mood && moods[letter.mood] && (
                            <div className="metadata-item">
                                <span className="metadata-label">Mood:</span>
                                <span className="metadata-value">
                                    {moods[letter.mood].emoji} {moods[letter.mood].label}
                                </span>
                            </div>
                        )}

                        {letter.weather && weatherIcons[letter.weather] && (
                            <div className="metadata-item">
                                <span className="metadata-label">Weather:</span>
                                <span className="metadata-value">
                                    {weatherIcons[letter.weather]} {letter.weather.charAt(0).toUpperCase() + letter.weather.slice(1)}
                                </span>
                            </div>
                        )}

                        {letter.temperature && (
                            <div className="metadata-item">
                                <span className="metadata-label">Temperature:</span>
                                <span className="metadata-value">{letter.temperature}°F</span>
                            </div>
                        )}

                        {letter.location && (
                            <div className="metadata-item">
                                <span className="metadata-label">Location:</span>
                                <span className="metadata-value">{letter.location}</span>
                            </div>
                        )}

                        {letter.currentSong && (
                            <div className="metadata-item">
                                <span className="metadata-label">Song:</span>
                                <span className="metadata-value">{letter.currentSong}</span>
                            </div>
                        )}

                        {letter.topHeadLine && (
                            <div className="metadata-item">
                                <span className="metadata-label">Top Headline:</span>
                                <span className="metadata-value">{letter.topHeadLine}</span>
                            </div>
                        )}
                    </div>

                    <div className="letter-content-section">
                        <h3>Your Letter</h3>
                        <div className="letter-content-display">
                            {letter.content}
                        </div>
                    </div>

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

                    <div className="letter-reflections-section">
                        <h3>Reflections</h3>

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
                    </div>

                    <div className="letter-actions-section">
                        <button onClick={handleDelete} className="delete-btn-large">
                            Delete Letter
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LetterDetails;
