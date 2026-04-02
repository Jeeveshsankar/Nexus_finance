import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(TextPlugin);

const GlobalLoader = ({ onComplete }) => {
  const containerRef = useRef(null);
  
  useEffect(() => {

    document.body.style.overflow = 'hidden';
    
    const tl = gsap.timeline({ 
      onComplete: () => {
        document.body.style.overflow = '';
        if (onComplete) onComplete();
      }
    });
    
    tl.to('.loader-text', {
      duration: 1,
      text: "NEXUS FINANCE",
      ease: "none",
      delay: 0.2
    })
    .to('.loader-text', {
      opacity: 0,
      duration: 0.3,
      delay: 0.5
    })
    .to(containerRef.current, {
      y: '-100%',
      duration: 0.8,
      ease: 'power4.inOut'
    });
    
    gsap.to('.loading-progress', {
      scaleX: 1,
      duration: 1.5,
      ease: "power2.inOut",
      transformOrigin: "left"
    });
  }, [onComplete]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[99999] bg-[#030712] flex flex-col items-center justify-center">
      <div className="noise-overlay" />
      <div className="grid-bg" />
      <h1 className="loader-text text-3xl md:text-5xl font-mono font-bold text-primary tracking-widest uppercase relative z-10">
        SYSTEM_INIT
      </h1>
      <div className="absolute bottom-20 w-64 h-1 bg-white/10 rounded-full overflow-hidden z-10">
        <div className="loading-progress w-full h-full bg-primary scale-x-0"></div>
      </div>
    </div>
  );
};

export default GlobalLoader;
