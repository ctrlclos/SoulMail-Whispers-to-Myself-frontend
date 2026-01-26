import { useEffect, useState } from 'react';
import Confetti from './Confetti';

const CelebrationModal = ({ celebration, onClose }) => {
    const [visible, setVisible] = useState(true);
    const [countdown, setCountdown] = useState(Math.floor((celebration?.duration || 20000) / 1000));

    const duration = celebration?. duration || 20000;

    useEffect(() => {
        // Countdown timer
        const countdownInterval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(countdownInterval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        // Auto close aftr duration
        const timer = setTimeout(() => {
            setVisible(false);
            if (onClose) onClose();
        }, duration);
        return () => {
            clearTimeout(timer);
            clearInterval(countdownInterval);
        };
    }, [duration, onClose]);

    const handleClose = () => {
        setVisible(false);
        if (onClose) onClose();
    };
    if (!visible || !celebration) return null;

    return (
        <div className="celebration-overlay">
            <Confetti duration={duration} />

            <div className="celebration-modal">
                <div className="celebration-content">
                    <h1 className="celbration-title">{celebration.title}</h1>
                    <p className="celebration-message">{celebration.message}</p>
                    <span className="celebration-countdown">Closing in {countdown}s</span>
                    <button className="celebration-close-btn" onClick={handleClose}>
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CelebrationModal;