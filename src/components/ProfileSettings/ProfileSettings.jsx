import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import NavBar from '../NavBar/NavBar';
import * as userService from '../../services/userService';

const ProfileSettings = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const [profile, setProfile] = useState({
        name: '',
        birthday: ''
    });

    const [settings, setSettings] = useState({
        celebrationsEnabled: true,
        birthdayOomph: true,
        milestoneOomph: true,
        anniversaryOomph: true,
        letterDeliveryOomph: true,
        goalAccomplishedOomph: true,
        streakOomph: true
    });

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userData = await userService.getProfile();

                setProfile({
                    name: userData.name || '',
                    birthday: userData.birthday
                        ? new Date(userData.birthday).toISOString().split('T')[0]
                        : ''
                });

                setSettings({
                    celebrationsEnabled: userData.settings?.celebrationsEnabled ?? true,
                    birthdayOomph: userData.settings?.birthdayOomph ?? true,
                    milestoneOomph: userData.settings?.milestoneOomph ?? true,
                    anniversaryOomph: userData.settings?.anniversaryOomph ?? true,
                    letterDeliveryOomph: userData.settings?.letterDeliveryOomph ?? true,
                    goalAccomplishedOomph: userData.settings?.goalAccomplishedOomph ?? true,
                    streakOomph: userData.settings?.streakOomph ?? true,
                });
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleProfileChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleToggle = (setting) => {
        setSettings({ ...settings, [setting]: !settings[setting] });
    };

    const handleToggleAll = () => {
        const newValue = !settings.celebrationsEnabled;
        setSettings({
            celebrationsEnabled: newValue,
            birthdayOomph: newValue,
            milestoneOomph: newValue,
            anniversaryOomph: newValue,
            letterDeliveryOomph: newValue,
            goalAccomplishedOomph: newValue,
            streakOomph: newValue
        });
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
            await userService.updateProfile(profile);
            setMessage('Profile updated!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.log(err);
            setMessage('Failed to update profile');
        }
    };

    const handleSaveSettings = async () => {
        try {
            await userService.updateSettings(settings);
            setMessage('Settings saved!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.log(err);
            setMessage('Failed to save settings');
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="page-container">
            <div className="header">
                <img src="/images/logo.png" alt="SoulMail Logo" className="logo-image" />
                <NavBar />
            </div>

            <div className="create-letter-wrapper">
                <h1 className="page-title">Profile & Settings</h1>

                {message && <div className="settings-message">{message}</div>}

                <div className="form-inner-box">
                    <h2 className="section-title">👤 Profile</h2>
                    <form onSubmit={handleSaveProfile}>
                        <div className="form-row">
                            <label htmlFor="name">Name:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={profile.name}
                                onChange={handleProfileChange}
                            />
                        </div>

                        <div className="form-row birthday-field">
                            <label htmlFor="birthday">Birthday:</label>
                            <input
                                type="date"
                                id="birthday"
                                name="birthday"
                                value={profile.birthday}
                                onChange={handleProfileChange}
                            />
                            <p className="birthday-note">We'll celebrate with you! 🎂</p>
                        </div>
                        <button type="submit" className="submit-btn">Save Profile</button>
                    </form>
                </div>

                <div className="form-inner-box">
                    <h2 className="section-title">🎉 Celebration Animations</h2>
                    <p className="settings-description">
                        Toggle celebration animations on or off (15-20 seconds each)
                    </p>

                    <div className="toggle-row master-toggle">
                        <span>Enable All Celebrations</span>
                        <label className='toggle-switch'>
                            <input
                                type="checkbox"
                                checked={settings.celebrationsEnabled}
                                onChange={handleToggleAll}
                            />
                            <span className='toggle-slider'></span>
                        </label>
                    </div>

                    <div className="individual-toggles">
                        <div className="toggle-row">
                            <span>🎂 Birthday</span>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={settings.birthdayOomph}
                                    onChange={() => handleToggle('birthdayOomph')}
                                    disabled={!settings.celebrationsEnabled}
                                />
                                <span className='toggle-slider'></span>
                            </label>
                        </div>

                        <div className='toggle-row'>
                            <span>🏆 Milestones (1, 5, 10, 25... letters)</span>
                            <label className='toggle-switch'>
                                <input
                                    type="checkbox"
                                    checked={settings.milestoneOomph}
                                    onChange={() => handleToggle('milestoneOomph')}
                                    disabled={!settings.celebrationsEnabled}
                                />
                                <span className='toggle-slider'></span>
                            </label>
                        </div>

                        <div className="toggle-row">
                            <span>🎉 Account Anniversary</span>
                            <label className='toggle-switch'>
                                <input
                                    type="checkbox"
                                    checked={settings.anniversaryOomph}
                                    onChange={() => handleToggle('anniversaryOomph')}
                                    disabled={!settings.celebrationsEnabled}
                                />
                                <span className='toggle-slider'></span>
                            </label>
                        </div>

                        <div className="toggle-row">
                            <span>✉️ Letter Delivered</span>
                            <label className='toggle-switch'>
                                <input
                                    type="checkbox"
                                    checked={settings.letterDeliveryOomph}
                                    onChange={() => handleToggle('letterDeliveryOomph')}
                                    disabled={!settings.celebrationsEnabled}
                                />
                                <span className='toggle-slider'></span>
                            </label>
                        </div>

                        <div className="toggle-row">
                            <span>⭐️ Goal Accomplished</span>
                            <label className='toggle-switch'>
                                <input
                                    type="checkbox"
                                    checked={settings.goalAccomplishedOomph}
                                    onChange={() => handleToggle('goalAccomplishedOomph')}
                                    disabled={!settings.celebrationsEnabled}
                                />
                                <span className='toggle-slider'></span>
                            </label>
                        </div>

                        <div className="toggle-row">
                            <span>🔥 Milestones (7, 14, 30... days)</span>
                            <label className='toggle-switch'>
                                <input
                                    type="checkbox"
                                    checked={settings.streakOomph}
                                    onChange={() => handleToggle('streakOomph')}
                                    disabled={!settings.celebrationsEnabled}
                                />
                                <span className='toggle-slider'></span>
                            </label>
                        </div>
                    </div>
                    <button onClick={handleSaveSettings} className="submit-btn">Save Settings</button>
                </div>

                <div className="cancel-link">
                    <a onClick={() => navigate('/')}>← Back to Dashboard</a>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;