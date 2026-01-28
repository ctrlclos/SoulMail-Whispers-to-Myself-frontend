import { useRef, useState, useEffect} from 'react';
import './DrawingOverlay.css';

const DrawingOverlay = ({ isActive, onSave, onClose }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#7b68a4');

    const colors = [
        '#7b68a4',
        '#000000',
        '#ff0000',
        '#4ecdc4',
        '#45b7d1',
        '#96ceb4'
    ];
    // Initialize  transparentvcanvas
    useEffect(() => {
        if (!isActive) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

    // Make Canvas size match parent
        const parent = canvas.parentElement;
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;

        // Keep transparent 
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, [isActive]);
    
    const getPosition = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        if (e.touches) {
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top
            };
        }
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
        };
    };

    const startDrawing = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const { x,y } = getPosition(e);
        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round'
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        e.preventDefault();
        e.stopPropagation();
        const { x, y } = getPosition(e);
        const ctx = canvasRef.current.getContext('2d');
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const handleClear = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

    };

    const handleSave = () => {
        const imageData = canvasRef.current.toDateURL('image/png');
        if (onSave) onSave(imageData);
    };

    return (
        <div className='drawing-overlay-container'>
            {/* Toolbar */}
            <div className='overlay-toolbar'>
                <div className='overlay-colors'>
                {colors.map((c) => (
                    <button
                        key={c}
                        className={`overlay-color-btn ${color === c ? 'active' : ''}`}
                        style={{ backgroundColor: c }}
                        onClick={() => setColor(c)}
                    />
                ))}
            </div>

            <div className='overlay-actions'>
                <button onClick={handleClear} className='overlay-btn-clear'>🗑️ Clear</button>
                <button onClick={handleSave} className='overlay-btn-save'>💾 Save</button>
                <button onClick={onClose} className='overlay-btn-close'>✖️ Done</button>
            </div>
        </div>

            {/* Transparent Canvas */}
            <canvas
                ref={canvasRef}
                className='drawing-overlay-canvas'
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
            />

            </div>
    );
};

export default DrawingOverlay;