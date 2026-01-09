import { useEffect, useRef } from 'react';

export default function SmokeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let mouseX = 0;
    let mouseY = 0;
    let isMoving = false;
    let timeout: NodeJS.Timeout;

    // Load smoke image
    const smokeImg = new Image();
    smokeImg.src = "/images/smoke-puff.png";

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    class Particle {
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      rotation: number;
      rotationSpeed: number;
      opacity: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 40 + 20; // Initial size
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = Math.random() * -1 - 0.5; // Float up
        this.life = 0;
        this.maxLife = Math.random() * 60 + 40;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.opacity = 0.5;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;
        this.life++;
        this.size += 0.5; // Expand
        this.opacity = 1 - (this.life / this.maxLife); // Fade out
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity * 0.4; // Base opacity
        ctx.globalCompositeOperation = 'screen'; // Blend mode for smoke
        
        // If image is loaded, draw it, else draw a circle
        if (smokeImg.complete) {
             ctx.drawImage(smokeImg, -this.size / 2, -this.size / 2, this.size, this.size);
        } else {
             ctx.beginPath();
             ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
             ctx.fillStyle = 'rgba(200, 200, 200, 0.5)';
             ctx.fill();
        }
        
        ctx.restore();
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        isMoving = true;
        
        // Spawn particles on move
        for(let i=0; i<3; i++) {
             particles.push(new Particle(mouseX, mouseY));
        }

        clearTimeout(timeout);
        timeout = setTimeout(() => { isMoving = false; }, 100);
    };
    
    // Add listener to the window to track mouse even if not directly over canvas sometimes, 
    // but here we want it scoped to the section usually. 
    // Let's attach to window for smoother trails across the section.
    // Actually, attaching to canvas parent is better if we could, but window is easiest for global mouse tracking
    // But we need coordinate relative to canvas.
    canvas.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, index) => {
        p.update();
        p.draw(ctx);
        if (p.life >= p.maxLife) {
          particles.splice(index, 1);
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-auto w-full h-full"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}