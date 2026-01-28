import { useState, useEffect } from 'react';
import { CelebrationModal } from '../Celebrations';
import { getCelebrationMessage } from '../../utils/celebrationUtils';
import './DemoPanel.css';

const DemoPanel = () => {
    const [celebration, setCelebration] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    // Secret Press Ctrl+Shift+D to toggle
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const triggerCelebration = (type) => {
        const data = {
            name: 'Demo User',
            count: 10,
            years: 1,
            days: 30,
            goalText: 'Complete my presentation!'
        };
        setCelebration({
            type,
            ...getCelebrationMessage(type, data)
        });
        setIsOpen(false);
    };

    return (
        <>
        {celebration && (
            <CelebrationModal
            celebration={celebration}
            onClose={() => setCelebration(null)}
            />
        )}
        {isOpen && (
            <div className='demo-panel'>
                <h3>🎬 Demo Mode</h3>
                <div className='demo-buttons'>
                    <button onClick={() => triggerCelebration('birthday')}>🎂 Birthday</button>
                    <button onClick={() => triggerCelebration('milestone')}>🏆 Milestone</button>
                    <button onClick={() => triggerCelebration('letterDelivered')}>✉️ Letter</button>
                    <button onClick={() => triggerCelebration('goalCompleted')}>⭐️ Goal</button>
                    <button onClick={() => triggerCelebration('streak')}>🔥 Streak</button>
                </div>
                <button className='demo-close' onClick={() => setIsOpen(false)}>Close</button>
            </div>
        )}
        </>
    );
};
export default DemoPanel;