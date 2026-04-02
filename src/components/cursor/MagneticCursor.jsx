import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useLocation } from 'react-router-dom';

const MagneticCursor = () => {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    let xToCursor = gsap.quickTo(cursorRef.current, "x", { duration: 0.1, ease: "power3" });
    let yToCursor = gsap.quickTo(cursorRef.current, "y", { duration: 0.1, ease: "power3" });
    let xToRing = gsap.quickTo(ringRef.current, "x", { duration: 0.2, ease: "power3" });
    let yToRing = gsap.quickTo(ringRef.current, "y", { duration: 0.2, ease: "power3" });

    const moveCursor = (e) => {
      xToCursor(e.clientX);
      yToCursor(e.clientY);
      xToRing(e.clientX);
      yToRing(e.clientY);
    };

    window.addEventListener("mousemove", moveCursor);

    const handleEnter = (e) => {
      gsap.to(ringRef.current, { scale: 1.5, borderColor: e.target.tagName === 'A' ? '#0ea5e9' : '#00ff88', duration: 0.3 });
    };
    const handleLeave = () => {
      gsap.to(ringRef.current, { scale: 1, borderColor: 'rgba(0, 255, 136, 0.5)', duration: 0.3 });
    };

    const attachListeners = () => {
      const triggers = document.querySelectorAll('button, a, input, select');
      triggers.forEach(el => {
        el.addEventListener('mouseenter', handleEnter);
        el.addEventListener('mouseleave', handleLeave);
      });
    };

    attachListeners();
    // Re-attach if DOM changes (simplified)
    const observer = new MutationObserver(() => attachListeners());
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      observer.disconnect();
    };
  }, [location.pathname]);

  return (
    <>
      <div 
        ref={ringRef}
        className="fixed top-0 left-0 w-10 h-10 border border-[rgba(0,255,136,0.5)] rounded-full pointer-events-none z-[100] transform -translate-x-1/2 -translate-y-1/2 transition-colors duration-300"
      />
      <div 
        ref={cursorRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-primary rounded-full pointer-events-none z-[100] transform -translate-x-1/2 -translate-y-1/2"
      />
    </>
  );
};

export default MagneticCursor;
