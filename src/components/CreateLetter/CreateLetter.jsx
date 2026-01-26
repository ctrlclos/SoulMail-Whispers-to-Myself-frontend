import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import NavBar from '../NavBar/NavBar';
import * as letterService from '../../services/letterService';

const CreateLetter = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
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

    const calculateDeliveryDate = (interval) => {
        const today = new Date();
        
        switch(interval) {
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
            
            const dataToSend = {
                ...formData,
                deliveredAt: deliveryDate,
                goal1: formData.goals[0]?.text || '',
                goal2: formData.goals[1]?.text || '',
                goal3: formData.goals[2]?.text || ''
            };

            // Remove fields the backend doesn't use
            delete dataToSend.goals;
            delete dataToSend.deliveryInterval;
            
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
                <div className="welcome">This page belongs to you, {user?.username}</div>

                <div className="form-inner-box">
                    <h2 className="form-title">Create a Letter</h2>
                    <p className="required-note">* Required fields</p>
                    <form onSubmit={handleSubmit}>

                        {/* Title - full width */}
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

                        {/* Delivery Interval and Mood - side by side */}
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
                                    <option value="1week">In One Week</option>
                                    <option value="1month">In One Month</option>
                                    <option value="6months">In 6 Months</option>
                                    <option value="1year">In One Year</option>
                                    <option value="5years">In 5 Years</option>
                                    <option value="custom">Custom Date</option>
                                </select>

                                {/* Show date picker only if "Custom Date" is selected */}
                                {formData.deliveryInterval === 'custom' && (
                                    <input
                                        type="date"
                                        name="deliveredAt"
                                        value={formData.deliveredAt}
                                        onChange={handleChange}
                                        style={{ marginTop: '10px' }}
                                        required
                                    />
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

                        {/* Weather/Temp and Location Row */}
                        <div className="form-row-split">
                            <div className="form-col-half">
                                <div style={{ display: 'flex', gap: '20px' }}>
                                    <div style={{ flex: 1 }}>
                                        <label>Weather:</label>
                                        <div className="weather-selector">
                                            <button type="button" className={`weather-btn ${formData.weather === 'sunny' ? 'selected' : ''}`} onClick={() => handleWeatherSelect('sunny')} title="Sunny">☀️</button>
                                            <button type="button" className={`weather-btn ${formData.weather === 'cloudy' ? 'selected' : ''}`} onClick={() => handleWeatherSelect('cloudy')} title="Cloudy">☁️</button>
                                            <button type="button" className={`weather-btn ${formData.weather === 'rainy' ? 'selected' : ''}`} onClick={() => handleWeatherSelect('rainy')} title="Rainy">🌧️</button>
                                            <button type="button" className={`weather-btn ${formData.weather === 'snowy' ? 'selected' : ''}`} onClick={() => handleWeatherSelect('snowy')} title="Snowy">❄️</button>
                                        </div>
                                    </div>
                                    <div style={{ flex: 0.5 }}>
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

                        {/* Current Song */}
                        <div className="form-row">
                            <label>Song I'm currently listening to:</label>
                            <input
                                type="text"
                                name="currentSong"
                                value={formData.currentSong}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Top Headline */}
                        <div className="form-row">
                            <label>Top Headline:</label>
                            <input
                                type="text"
                                name="topHeadline"
                                value={formData.topHeadline}
                                onChange={handleChange}
                            />
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

                        {/* Goals */}
                        <div className="form-section">
                            <label>Your Goals: <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#666' }}>(Maximum 3 goals)</span></label>
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
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="submit-btn">Create Letter</button>

                        {/* Cancel link */}
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