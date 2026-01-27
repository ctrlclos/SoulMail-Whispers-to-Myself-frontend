import { useState, useRef } from 'react';
import useReadingDirection from '../hooks/useReadingDirection';
import './FlipLetter.css';

const FlipLetter = ({ front, back }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const direction = useReadingDirection();
    const containerRef = useRef(null);

    // touch handling for swipe
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };
    const handleCornerClick = (e) => {
        e.stopPropegtion();
        handleFlip();
    };
    // Touch handlers for swipe
    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        const swipeDistance = touchStartX.current - touchEndX.current;
        const minSwipeDistance = 50;

        if (direction === 'ltr') {
            if (swipeDistance > minSwipeDistance && !isFlipped) {
                setIsFlipped(true);
            } else if (swipeDistance < -minSwipeDistance && isFlipped) {
                setIsFlipped(false);
            }
        } else {
            if (swipeDistance < -minSwipeDistance && !isFlipped) {
                setIsFlipped(true);
            } else if (swipeDistance > minSwipeDistance && isFlipped) {
                setIsFlipped(false);
            }
        }
    };

    return (
        <div
           ref={containerRef}
           className={`flip-container ${direction}`}
           onTouchStart={handleTouchStart}
           onTouchMove={handleTouchMove}
           onTouchEnd={handleTouchEnd}
           >
            <div className={`flip-card ${isFlipped ? 'flipped' : ''}`}>
                {/* front Side */}
            <div className='flip-card-front'>{front}</div>
                {/* Corner Curl */}
            <div className={`page-corner ${isHovering ? 'hover' : ''}`}
                 onMouseEnter={() => setIsHovering(true)}
                 onMouseLeave={() => setIsHovering(false)}
                 onClick={handleCornerClick}
                 >
                   <div className='corner-fold'>
                    <span className='corner-hint'>
                        {isFlipped ? '← Back' : 'Reflect →'}
                    </span>
                   </div>
               </div>    
           </div>

           {/* back Side */}
           <div className='flip-card-back'>
            {back}

            {/* Corner Curl */}
            <div className={`page-corner ${isHovering ? 'hover' : ''}`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={{handleCornerClick}}
            >
                

            </div>
        </div> 
    )
}