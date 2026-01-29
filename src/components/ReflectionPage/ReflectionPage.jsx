import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import NavBar from '../NavBar/NavBar';
import * as letterService from '../../services/letterService';
import { ReflectionPrompt } from '../AI';

const ReflectionPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [letter, setLetter] = useState(null);
    const [reflectionData, setReflectionData] = useState({
        reflectionText: '',
        goalsProgress: [],
        wantsRedelivery: false,
        redeliveryDate: ''
    });

    useEffect(() => {
        const fetchLetter = async () => {
            try {
                const fetchedLetter = await letterService.show(id);
                setLetter(fetchedLetter);

                // Initialize goals progress if letter has goals
                if (fetchedLetter?.goals) {
                    setReflectionData(prev => ({
                        ...prev,
                        goalsProgress: fetchedLetter.goals.map(goal => ({
                            goalText: goal.text,
                            status: 'in-progress'
                        }))
                    }));
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchLetter();
    }, [id]);

    const handleReflectionChange = (e) => {
        setReflectionData({ ...reflectionData, reflectionText: e.target.value });
    };

    const handleGoalStatusChange = (index, status) => {
        const updatedGoals = [...reflectionData.goalsProgress];
        updatedGoals[index].status = status;
        setReflectionData({ ...reflectionData, goalsProgress: updatedGoals });
    };

    const handleRedeliveryChange = (value) => {
        setReflectionData({
            ...reflectionData,
            wantsRedelivery: value,
            redeliveryDate: value ? reflectionData.redeliveryDate : ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await letterService.addReflection(id, reflectionData);
            navigate('/');
        } catch (err) {
            console.error('Error submitting reflection:', err);
        }
    };

    if (!letter) {
        return <div>Loading...</div>;
    }

    return (
        <div className="page-container">
            <div className="header">
                <img src="/images/logo.png" alt="SoulMail Logo" className="logo-image" />
                <NavBar />
            </div>

            <div className="reflection-form-wrapper">
<h2 className="page-title">Reflect on Your Letter to Yourself</h2>
                <p className="reflection-subtitle">Looking back on what you wrote, how do you feel now?</p>

                <form onSubmit={handleSubmit}>
                    {/* AI-Generated Reflection Question */}
                    <div className="ai-reflection-prompt">
                        <ReflectionPrompt
                            letterId={id}
                            className="reflection-question"
                            loadingText="Generating a reflection question for you..."
                        />
                    </div>

                    {/* Reflection Text */}
                    <div className="form-section">
                        <label className="large-label">Your Reflection:</label>
                        <textarea
                            name="reflectionText"
                            value={reflectionData.reflectionText}
                            onChange={handleReflectionChange}
                            rows="10"
                            placeholder="Write your thoughts and reflections here..."
                            required
                        />
                    </div>

                    {/* Goals Progress - only show if letter has goals */}
                    {letter?.goals && letter.goals.length > 0 && (
                        <div className="form-section">
                            <label>How did you do with your goals?</label>
                            <div className="goals-progress-list">
                                {reflectionData.goalsProgress.map((goal, index) => (
                                    <div key={index} className="goal-progress-item">
                                        <p className="goal-text">{goal.goalText}</p>
                                        <div className="goal-status-options">
                                            <label className="radio-option">
                                                <input
                                                    type="radio"
                                                    name={`goal-${index}`}
                                                    value="achieved"
                                                    checked={goal.status === 'achieved'}
                                                    onChange={() => handleGoalStatusChange(index, 'achieved')}
                                                />
                                                Achieved
                                            </label>
                                            <label className="radio-option">
                                                <input
                                                    type="radio"
                                                    name={`goal-${index}`}
                                                    value="in-progress"
                                                    checked={goal.status === 'in-progress'}
                                                    onChange={() => handleGoalStatusChange(index, 'in-progress')}
                                                />
                                                In Progress
                                            </label>
                                            <label className="radio-option">
                                                <input
                                                    type="radio"
                                                    name={`goal-${index}`}
                                                    value="not-met"
                                                    checked={goal.status === 'not-met'}
                                                    onChange={() => handleGoalStatusChange(index, 'not-met')}
                                                />
                                                Not Met
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Re-delivery Option */}
                    <div className="form-section">
                        <label>Would you like to receive this letter again?</label>
                        <div className="redelivery-options">
                            <label className="radio-option">
                                <input
                                    type="radio"
                                    name="redelivery"
                                    value="yes"
                                    checked={reflectionData.wantsRedelivery === true}
                                    onChange={() => handleRedeliveryChange(true)}
                                />
                                Yes
                            </label>
                            <label className="radio-option">
                                <input
                                    type="radio"
                                    name="redelivery"
                                    value="no"
                                    checked={reflectionData.wantsRedelivery === false}
                                    onChange={() => handleRedeliveryChange(false)}
                                />
                                No
                            </label>
                        </div>

                        {/* Show date picker if Yes */}
                        {reflectionData.wantsRedelivery && (
                            <div style={{ marginTop: '15px' }}>
                                <label>When would you like to receive it?</label>
                                <input
                                    type="date"
                                    value={reflectionData.redeliveryDate}
                                    onChange={(e) => setReflectionData({ ...reflectionData, redeliveryDate: e.target.value })}
                                    min={(() => {
                                        const date = new Date();
                                        date.setDate(date.getDate() + 7);
                                        return date.toISOString().split('T')[0];
                                    })()}
                                    required={reflectionData.wantsRedelivery}
                                />
                            </div>
                        )}
                    </div>

                    {/* Submit and Cancel */}
                    <div className="reflection-actions">
                        <button type="submit" className="submit-btn">Submit Reflection</button>
                        <div className="cancel-link">
                            <a onClick={() => navigate('/')}>Cancel and return to Dashboard</a>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReflectionPage;