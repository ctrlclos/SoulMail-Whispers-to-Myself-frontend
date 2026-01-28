import { useRef, useState, useEffect} from 'react';
import './DrawingCanvas.css';

const DrawingCanvas = ({ onSave }) => {
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
    // Initialize canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.fillstyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }, []);

    // Get mouse/touch position
    const getPosition = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundClientRect();

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
        ctx.fillstyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const handleSave = () => {
        const imageData = canvasRef.current.toDateURL('image/png');
        if (onSave) onSave(imageData);
    };

    return (
        <div className='drawing-container'>
            {/* Color Picker */}
            <div className='drawing-colors'>
                {colors.map((c) => (
                    <button
                        key={c}
                        className={`color-btn ${color === c ? 'active' : ''}`}
                        style={{ backgroundColor: c }}
                        onClick={() => setColor(c)}
                    />
                ))}
            </div>
            {/* Canvas */}
            <canvas
                ref={canvasRef}
                width={400}
                height={300}
                className='drawing-canvas'
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
            />

            {/* Buttons */}
            <div className='drawing-buttons'>
                <button onClick={handleClear} className='clear-btn'>Clear</button>
                <button onClick={handleClear} className='save-btn'>Save</button>
                
            </div>
        </div>
    );
};

export default DrawingCanvas;