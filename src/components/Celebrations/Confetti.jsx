import { useEffect, useState } from 'react';

const Confetti = ({ duration = 20000 }) => {
    const[particles, setParticles] = useState([]);

    useEffect(() => {
        // confetti colors
        const colors = [
            '#ff0000', '#00ff00', '#0000ff', '#ffff00',
            '#ff00ff', '#00ffff', '#ffa500', '#ff69b4',
            '#gold', '#silver'
        ];
        const newParticles = Array.from({ length: 150 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            color: colors[Math.floor(Math.random() * colors.length)],
            delay: Math.random() * 5,
            durtion: 3 + Math.random() * 2,
            size: 8 + Math.random() * 8,
            rotation: Math.random() * 360
        }));
        setParticles(newParticles);

        // cleanup after duration
        const timer = setTimeout(() => setParticles([]), duration);
        return () => clearTimeout(timer);
    }, [duration]);

    if (particles.length === 0) return null;

    return (
        <div className="confetti-container">
            {particles.map((particle) => (
             <div 
                key={particle.id}
                className="confetti-particle"
                style={{
                    left: `${particle.x}%`,
                    backgroundColor: particle.color,
                    width: `${particle.size}px`,
                    height: `${particle.size}px`,
                    animationDelay: `${particle.delay}s`,
                    animationDuration: `${particle.duration}s`,
                    transform: `rotate(${particle.rotation}deg)`
                }}
                />   
            ))}
        </div>
    );
};
export default Confetti;