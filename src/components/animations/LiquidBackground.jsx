import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const LiquidBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const bubbles = gsap.utils.toArray('.blob');
    
    bubbles.forEach((bubble, i) => {
      gsap.to(bubble, {
        x: 'random(-100, 100)',
        y: 'random(-100, 100)',
        duration: 'random(10, 20)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.5
      });
      
      gsap.to(bubble, {
        scale: 'random(0.8, 1.2)',
        duration: 'random(5, 8)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    });
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-background">
      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3BaseFilter id='noiseFilter'%3BfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      
      {/* Animated Blobs */}
      <div className="blob absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-primary/20 rounded-full blur-[120px]" />
      <div className="blob absolute bottom-[-10%] right-[-5%] w-[35vw] h-[35vw] bg-secondary/20 rounded-full blur-[100px]" />
      <div className="blob absolute top-[20%] right-[10%] w-[25vw] h-[25vw] bg-accent/15 rounded-full blur-[80px]" />
      <div className="blob absolute bottom-[20%] left-[10%] w-[30vw] h-[30vw] bg-primary/10 rounded-full blur-[90px]" />
      
      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_100%)] opacity-60" />
    </div>
  );
};

export default LiquidBackground;
