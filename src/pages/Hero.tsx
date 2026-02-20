import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        const frameCount = 254;
        const imagesDesktop: HTMLImageElement[] = [];
        const imagesMobile: HTMLImageElement[] = [];
        const prefixDesktop = "original-3b362f19987e09fbeb2b092dc029db17-";
        const prefixMobile = "original-3b362f19987e09fbeb2b092dc029db17 (1)-";

        // Preload images
        for (let i = 0; i < frameCount; i++) {
            const imgD = new Image();
            imgD.src = `/assets/${prefixDesktop}${i}.jpg`;
            imagesDesktop.push(imgD);

            const imgM = new Image();
            imgM.src = `/assetsmobile/${prefixMobile}${i}.jpg`;
            imagesMobile.push(imgM);
        }

        let animationFrameId: number;
        let lastTime = 0;
        const fpsInterval = 1000 / 24; // 24 frames per second
        let currentFrame = 0;
        let fallbackTime = 0;

        const drawFallbackAnimation = (time: number) => {
            ctx.fillStyle = "#050505";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.lineWidth = 1;

            for (let i = 0; i < 20; i++) {
                ctx.beginPath();
                const colorFactor = (Math.sin(time + i * 0.2) + 1) / 2;
                const r = Math.floor(0 + colorFactor * 230);
                const g = Math.floor(229 * (1 - colorFactor) + 25 * colorFactor);
                const b = Math.floor(255 * (1 - colorFactor) + 25 * colorFactor);

                ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.2)`;

                for (let x = 0; x < canvas.width; x += 20) {
                    const y = canvas.height / 2 + Math.sin(x * 0.01 + time + i * 0.2) * (50 + i * 15);
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            }
        };

        const renderLoop = (timestamp: number) => {
            animationFrameId = requestAnimationFrame(renderLoop);

            if (!lastTime) lastTime = timestamp;
            const elapsed = timestamp - lastTime;

            if (elapsed > fpsInterval) {
                lastTime = timestamp - (elapsed % fpsInterval);

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                const isMobile = window.innerWidth < 1100;
                const activeImages = isMobile ? imagesMobile : imagesDesktop;

                // Check if the current frame image is fully loaded and has no error
                const img = activeImages[currentFrame % activeImages.length];

                if (img && img.complete && img.naturalHeight !== 0) {
                    // Draw image covering canvas
                    const hRatio = canvas.width / img.width;
                    const vRatio = canvas.height / img.height;
                    const ratio = Math.max(hRatio, vRatio);
                    const centerShift_x = (canvas.width - img.width * ratio) / 2;
                    const centerShift_y = (canvas.height - img.height * ratio) / 2;

                    ctx.drawImage(
                        img,
                        0,
                        0,
                        img.width,
                        img.height,
                        centerShift_x,
                        centerShift_y,
                        img.width * ratio,
                        img.height * ratio
                    );

                    currentFrame++;
                } else {
                    // Render fallback if images are not loaded yet
                    fallbackTime += 0.01;
                    drawFallbackAnimation(fallbackTime);
                }
            }
        };

        animationFrameId = requestAnimationFrame(renderLoop);

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <section className="hero" id="home">
            <canvas id="hero-canvas" ref={canvasRef}></canvas>
            <div className="hero-overlay"></div>
            <div className="container hero-content">
                <div className="hero-text-wrapper flex flex-col items-center">
                    <img
                        src="/images/bigsomazul.png"
                        alt="Big Som Logo"
                        className="w-16 md:w-24 mb-2 -mt-24 slide-up drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                    />
                    <h1 className="hero-title slide-up">
                        BIG<span className="text-neon">SOM</span>
                    </h1>
                </div>
                <div className="hero-bottom-wrapper">
                    <p className="hero-slogan slide-up delay-1">
                        Para os apaixonados por carros
                    </p>
                    <div className="hero-buttons slide-up delay-2">
                        <a href="#servicos" className="btn btn-primary">Ver Serviços</a>
                        <Link to="/orcamento" className="btn btn-outline">Solicitar Orçamento</Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
