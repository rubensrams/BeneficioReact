import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';

const Captcha = forwardRef(({ onVerify }, ref) => {
    const canvasRef = useRef(null);
    const [captchaText, setCaptchaText] = useState('');
    const [userInput, setUserInput] = useState('');

    const generateCaptcha = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let text = '';
        for (let i = 0; i < 6; i++) {
            text += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCaptchaText(text);
        setUserInput('');
        drawCaptcha(text);
    };

    const drawCaptcha = (text) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Limpiar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Fondo
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Líneas de ruido
        for (let i = 0; i < 5; i++) {
            ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3)`;
            ctx.beginPath();
            ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.stroke();
        }
        
        // Puntos de ruido
        for (let i = 0; i < 50; i++) {
            ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`;
            ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
        }
        
        // Texto del captcha
        ctx.font = 'bold 30px Arial';
        ctx.textBaseline = 'middle';
        
        for (let i = 0; i < text.length; i++) {
            ctx.save();
            const x = 20 + i * 30;
            const y = canvas.height / 2;
            const angle = (Math.random() - 0.5) * 0.4;
            
            ctx.translate(x, y);
            ctx.rotate(angle);
            
            ctx.fillStyle = `rgb(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 100})`;
            ctx.fillText(text[i], 0, 0);
            
            ctx.restore();
        }
    };

    const handleVerify = () => {
        const isValid = userInput.toUpperCase() === captchaText;
        return isValid;
    };

    // Exponer método para que el componente padre pueda validar
    useImperativeHandle(ref, () => ({
        verify: () => {
            const isValid = handleVerify();
            if (!isValid) {
                generateCaptcha();
            }
            return isValid;
        },
        reset: () => {
            generateCaptcha();
        }
    }));

    useEffect(() => {
        generateCaptcha();
    }, []);

    return (
        <div className="captcha-container">
            <div className="text-center">
                <p className="mb-2">Ingresa los siguientes caracteres: <span className="text-danger">*</span></p>
                <canvas 
                    ref={canvasRef} 
                    width="200" 
                    height="60" 
                    style={{ border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#f0f0f0' }}
                />
                <div className="mt-2">
                    <a 
                        href="#" 
                        onClick={(e) => {
                            e.preventDefault();
                            generateCaptcha();
                        }}
                        style={{ textDecoration: 'none', cursor: 'pointer' }}
                    >
                        🔄 Generar nuevo captcha
                    </a>
                </div>
                <input 
                    type="text" 
                    className="form-control mt-2" 
                    placeholder="Escribe los caracteres" 
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    style={{ maxWidth: '200px', margin: '10px auto' }}
                />
            </div>
        </div>
    );
});

export default Captcha;
