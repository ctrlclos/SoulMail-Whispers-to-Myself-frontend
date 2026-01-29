import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import NavBar from '../NavBar/NavBar';
import DrawingCanvas from '../DrawingCanvas/DrawingCanvas';
import * as letterService from '../../services/letterService';
import * as itunesService from '../../services/itunesService';
import { useWritingPrompts } from '../AI';
import SongPreview from '../SongPreview/SongPreview';

const CreateLetter = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const [showCanvas, setShowCanvas] = useState(false);
    const [drawing, setDrawing] = useState(null);

    // const today = new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        mood: '',
        weather: '',
        temperature: '',
        location: '',
        currentSong: '',
        topHeadline: '',
        deliveredAt: '',
        deliveryInterval: '',
        goals: []
    });

    const [goalInput, setGoalInput] = useState('');
    const [showPrompts, setShowPrompts] = useState(false);
    const { prompts, loading: promptsLoading, fetch: fetchPrompts } = useWritingPrompts();

    // Song search state
    const [songSearchTerm, setSongSearchTerm] = useState('');
    const [songResults, setSongResults] = useState([]);
    const [songSearchLoading, setSongSearchLoading] = useState(false);
    const [selectedSong, setSelectedSong] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleWeatherSelect = (weather) => {
        setFormData({ ...formData, weather });
    };

    const handleAddGoal = () => {
        if (goalInput.trim()) {
            if (formData.goals.length >= 3) {
                alert('You can only add up to 3 goals');
                return;
            }
            setFormData({
                ...formData,
                goals: [...formData.goals, { text: goalInput, completed: false }]
            });
            setGoalInput('');
        }
    };

    const handleRemoveGoal = (index) => {
        setFormData({
            ...formData,
            goals: formData.goals.filter((_, i) => i !== index)
        });
    };

    const handleSaveDrawing = (imageData) => {
        setDrawing(imageData);
        setShowCanvas(false);
    };

    const handleRemoveDrawing = () => {
        setDrawing(null);
    }

    const handleSongSearch = async () => {
        if (!songSearchTerm.trim()) return;

        setSongSearchLoading(true);
        try {
            const results = await itunesService.searchSongs(songSearchTerm);
            setSongResults(results);
        } catch (err) {
            console.error('Error searching songs:', err);
            setSongResults([]);
        } finally {
            setSongSearchLoading(false);
        }
    };

    const handleSelectSong = (song) => {
        setSelectedSong({
            trackName: song.trackName,
            artistName: song.artistName,
            artworkUrl: song.artworkUrl100,
            previewUrl: song.previewUrl
        });
        setSongResults([]);
        setSongSearchTerm('');
    };

    const handleRemoveSong = () => {
        setSelectedSong(null);
    };
    const calculateDeliveryDate = (interval) => {
        const today = new Date();

        switch (interval) {
            case '1week':
                today.setDate(today.getDate() + 7);
                break;
            case '1month':
                today.setMonth(today.getMonth() + 1);
                break;
            case '6months':
                today.setMonth(today.getMonth() + 6);
                break;
            case '1year':
                today.setFullYear(today.getFullYear() + 1);
                break;
            case '5years':
                today.setFullYear(today.getFullYear() + 5);
                break;
            default:
                return formData.deliveredAt;
        }

        return today.toISOString().split('T')[0];
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let deliveryDate;
            if (formData.deliveryInterval === 'custom') {
                deliveryDate = formData.deliveredAt;
            } else {
                deliveryDate = calculateDeliveryDate(formData.deliveryInterval);
            }
            const formattedGoals = formData.goals.map(goal => ({
                text: goal.text
            }));

            const dataToSend = {
                ...formData,
                deliveredAt: deliveryDate,
                goals: formattedGoals,
                drawing: drawing,
                song: selectedSong
            };

            if (!dataToSend.mood || dataToSend.mood === '') {
                delete dataToSend.mood;
            }

            await letterService.create(dataToSend);
            navigate('/');
        } catch (err) {
            console.error('Error creating letter:', err);
        }
    };

    const moods = [
        { value: '☺️', label: 'Happy' },
        { value: '😢', label: 'Sad' },
        { value: '😰', label: 'Anxious' },
        { value: '🤩', label: 'Excited' },
        { value: '🙏', label: 'Grateful' },
        { value: '😫', label: 'Frustrated' }
    ];

    return (
        <div className="page-container">
            <div className="header">
                <img src="/images/logo.png" alt="SoulMail Logo" className="logo-image" />
                <NavBar />
            </div>

            <div className="create-letter-wrapper">
                <div className="greeting">This page belongs to you, {user?.username}</div>

                <div className="form-inner-box">
                    <h2 className="page-title">Create a Letter</h2>
                    <p className="required-note">* Required fields</p>
                    <form onSubmit={handleSubmit}>

                        <div className="form-row">
                            <label>Title:</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-row-split">
                            <div className="form-col-half">
                                <label>Delivery Interval:</label>
                                <select
                                    value={formData.deliveryInterval || ''}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setFormData({
                                            ...formData,
                                            deliveryInterval: value,
                                            deliveredAt: value === 'custom' ? formData.deliveredAt : ''
                                        });
                                    }}
                                    required
                                >
                                    <option value="">Select delivery time...</option>
                                    <option value="1week">One Week</option>
                                    <option value="1month">One Month</option>
                                    <option value="6months">6 Months</option>
                                    <option value="1year">One Year</option>
                                    <option value="5years">5 Years</option>
                                    <option value="custom">Custom Date</option>
                                </select>

                                {formData.deliveryInterval === 'custom' && (
                                    <>
                                        <p className="form-note">
                                            Custom dates must be at least one week from today
                                        </p>
                                        <input
                                            type="date"
                                            name="deliveredAt"
                                            value={formData.deliveredAt}
                                            onChange={handleChange}
                                            className="custom-date-input"
                                            min={(() => {
                                                const date = new Date();
                                                date.setDate(date.getDate() + 7);
                                                return date.toISOString().split('T')[0];
                                            })()}
                                            required
                                        />
                                    </>
                                )}
                            </div>

                            <div className="form-col-half">
                                <label>Mood:</label>
                                <select
                                    value={formData.mood}
                                    onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                                    className="mood-dropdown"
                                >
                                    <option value="">Select your mood...</option>
                                    {moods.map(mood => (
                                        <option key={mood.value} value={mood.value}>
                                            {mood.value} {mood.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-row-split">
                            <div className="form-col-half">
                                <div className="weather-temp-row">
                                    <div className="weather-col">
                                        <label>Weather:</label>
                                        <div className="weather-selector">
                                            <button type="button" className={`weather-btn ${formData.weather === 'sunny' ? 'selected' : ''}`} onClick={() => handleWeatherSelect('sunny')} title="Sunny">☀️</button>
                                            <button type="button" className={`weather-btn ${formData.weather === 'cloudy' ? 'selected' : ''}`} onClick={() => handleWeatherSelect('cloudy')} title="Cloudy">☁️</button>
                                            <button type="button" className={`weather-btn ${formData.weather === 'rainy' ? 'selected' : ''}`} onClick={() => handleWeatherSelect('rainy')} title="Rainy">🌧️</button>
                                            <button type="button" className={`weather-btn ${formData.weather === 'snowy' ? 'selected' : ''}`} onClick={() => handleWeatherSelect('snowy')} title="Snowy">❄️</button>
                                        </div>
                                    </div>
                                    <div className="temp-col">
                                        <label>Temp:</label>
                                        <input type="number" name="temperature" value={formData.temperature} onChange={handleChange} placeholder="°F" />
                                    </div>
                                </div>
                            </div>

                            <div className="form-col-half">
                                <label>Your current location:</label>
                                <input type="text" name="location" value={formData.location} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="form-row">
                            <label>Song I'm currently listening to:</label>

                            {/* Selected song display */}
                            {selectedSong ? (
                                <>
                                    <div className="selected-song">
                                        <img
                                            src={selectedSong.artworkUrl}
                                            alt={selectedSong.trackName}
                                            className="song-artwork"
                                        />
                                        <div className="song-info">
                                            <span className="song-track">{selectedSong.trackName}</span>
                                            <span className="song-artist">{selectedSong.artistName}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleRemoveSong}
                                            className="remove-song-btn"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <SongPreview
                                        url={selectedSong.previewUrl}
                                        trackName={selectedSong.trackName}
                                        artistName={selectedSong.artistName}
                                        artworkUrl={selectedSong.artworkUrl}
                                    />
                                </>
                            ) : (
                                <>
                                    {/* Song search input */}
                                    <div className="song-search-row">
                                        <input
                                            type="text"
                                            value={songSearchTerm}
                                            onChange={(e) => setSongSearchTerm(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    handleSongSearch();
                                                }
                                            }}
                                            placeholder="Search for a song..."
                                        />
                                        <button
                                            type="button"
                                            onClick={handleSongSearch}
                                            disabled={songSearchLoading}
                                        >
                                            {songSearchLoading ? 'Searching...' : 'Search'}
                                        </button>
                                    </div>

                                    {/* Search results */}
                                    {songResults.length > 0 && (
                                        <div className="song-results">
                                            {songResults.map((song) => (
                                                <div
                                                    key={song.trackId}
                                                    className="song-result-item"
                                                    onClick={() => handleSelectSong(song)}
                                                >
                                                    <img
                                                        src={song.artworkUrl100}
                                                        alt={song.trackName}
                                                        className="song-result-artwork"
                                                    />
                                                    <div className="song-result-info">
                                                        <span className="song-result-track">{song.trackName}</span>
                                                        <span className="song-result-artist">{song.artistName}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="form-row">
                            <label>Top Headline:</label>
                            <input
                                type="text"
                                name="topHeadline"
                                value={formData.topHeadline}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Writing Inspiration */}
                        <div className="writing-inspiration">
                            <button
                                type="button"
                                className="inspiration-btn"
                                onClick={() => {
                                    setShowPrompts(!showPrompts);
                                    if (!prompts.length && !promptsLoading) {
                                        fetchPrompts({ mood: formData.mood, count: 3 });
                                    }
                                }}
                            >
                                {showPrompts ? 'Hide Inspiration' : 'Need Writing Inspiration?'}
                            </button>
                            {showPrompts && (
                                <div className="prompts-list">
                                    {promptsLoading ? (
                                        <p className="prompts-loading">Getting inspiration...</p>
                                    ) : (
                                        prompts.map((prompt, idx) => (
                                            <p key={idx} className="prompt-item">{prompt}</p>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Your Letter */}
                        <div className="form-section">
                            <label className="large-label">What's on your mind?</label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                rows="12"
                                placeholder="Write your letter to yourself here..."
                                required
                            />
                        </div>
                        {/* ADD: Drawing Section */}
                        <div className = 'form-section'>
                            <label className='large-label'>✏️ Add a Drawing/Doodle</label>

                            {!showCanvas && !drawing && (
                                <button
                                    type='button'
                                    onClick={() => setShowCanvas(true)}
                                    className='add-drawing-btn'>
                                        🎨 Open Drawing Canvas
                                    </button>
                            )}

                            {showCanvas && (
                                <div className='drawing-section'>
                                    <DrawingCanvas onSave={handleSaveDrawing} />
                                    <button
                                        type='button'
                                        onClick={() => setShowCanvas(false)}
                                        className='cancel-drawing-btn'>Cancel</button>
                                </div>        
                            )}

                            {drawing && !showCanvas && (
                                <div className='drawing-preview'>
                                    <p>Your drawing:</p>
                                    <img src={drawing} alt='Your drawing' className='drawing-preview-img' />
                                    <div className='drawing-preview-actions'>
                                        <button type='button' onClick={() => setShowCanvas(true)}>✏️ Edit</button>
                                        <button type='button' onClick={handleRemoveDrawing}>🗑️ Trash it</button>

                                    </div>
                                </div>
                            )}
                        </div>    

                        <div className="form-section">
                            <label>Your Goals: <span className="goal-max-note">(Maximum 3 goals)</span></label>
                            <div className="goal-input-row">
                                <input
                                    type="text"
                                    value={goalInput}
                                    onChange={(e) => setGoalInput(e.target.value)}
                                    placeholder="Enter a goal"
                                    disabled={formData.goals.length >= 3}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddGoal}
                                    disabled={formData.goals.length >= 3}
                                >
                                    Add Goal
                                </button>
                            </div>
                            
                            <div className="goals-list">
                                {formData.goals.length === 0 ? (
                                    <p className="goals-placeholder">Your goals will appear here</p>
                                ) : (
                                    formData.goals.map((goal, index) => (
                                        <div key={index} className="goal-item">
                                            <input type="checkbox" disabled />
                                            <span>{goal.text}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveGoal(index)}
                                                className="remove-goal-btn"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <button type="submit" className="submit-btn">Create Letter</button>

                        <div className="cancel-link">
                            <a onClick={() => navigate('/')}>Cancel and return to Dashboard</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateLetter;