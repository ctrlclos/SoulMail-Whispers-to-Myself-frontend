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
        deliverAt: '',
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
            setFormData({
                ...formData,
                goals: [...formData.goals, { text: goalInput, completed: false }]
            });
            setGoalInput('');
        }
    };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await letterService.create(formData);
    navigate('/');
  } catch (err) {
    console.error(err);
  }
};

    const moods = [
        { value: 'happy', emoji: '😊', label: 'Happy' },
        { value: 'sad', emoji: '😢', label: 'Sad' },
        { value: 'angry', emoji: '😠', label: 'Angry' },
        { value: 'anxious', emoji: '😰', label: 'Anxious' },
        { value: 'excited', emoji: '🤩', label: 'Excited' },
        { value: 'calm', emoji: '😌', label: 'Calm' }
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

                        {/* Date and Mood - side by side */}
                        <div className="form-row-split">
                            <div className="form-col-half">
                                <label>Date you want to receive your letter?</label>
                                <input
                                    type="date"
                                    name="deliverAt"
                                    value={formData.deliverAt}
                                    onChange={handleChange}
                                    required
                                />
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
                                            {mood.emoji} {mood.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Weather, Temp, Location Row */}
                        <div className="form-row-group">
                            <div className="form-col">
                                <label>Weather:</label>
                                <div className="weather-selector">
                                    <button
                                        type="button"
                                        className={`weather-btn ${formData.weather === 'sunny' ? 'selected' : ''}`}
                                        onClick={() => handleWeatherSelect('sunny')}
                                        title="Sunny"
                                    >
                                        ☀️
                                    </button>
                                    <button
                                        type="button"
                                        className={`weather-btn ${formData.weather === 'cloudy' ? 'selected' : ''}`}
                                        onClick={() => handleWeatherSelect('cloudy')}
                                        title="Cloudy"
                                    >
                                        ☁️
                                    </button>
                                    <button
                                        type="button"
                                        className={`weather-btn ${formData.weather === 'rainy' ? 'selected' : ''}`}
                                        onClick={() => handleWeatherSelect('rainy')}
                                        title="Rainy"
                                    >
                                        🌧️
                                    </button>
                                    <button
                                        type="button"
                                        className={`weather-btn ${formData.weather === 'snowy' ? 'selected' : ''}`}
                                        onClick={() => handleWeatherSelect('snowy')}
                                        title="Snowy"
                                    >
                                        ❄️
                                    </button>
                                </div>
                            </div>
                            <div className="form-col">
                                <label>Temperature:</label>
                                <input
                                    type="number"
                                    name="temperature"
                                    value={formData.temperature}
                                    onChange={handleChange}
                                    placeholder="°F"
                                />
                            </div>
                            <div className="form-col">
                                <label>Your current location:</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                />
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
                            <label>Your Goals:</label>
                            <div className="goal-input-row">
                                <input
                                    type="text"
                                    value={goalInput}
                                    onChange={(e) => setGoalInput(e.target.value)}
                                    placeholder="Enter a goal"
                                />
                                <button type="button" onClick={handleAddGoal}>Add Goal</button>
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