import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const GhostCursor = () => {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;

    if (!dot || !ring) return;

    gsap.set([dot, ring], { x: -200, y: -200 });

    const dotX  = gsap.quickTo(dot,  'x', { duration: 0.12, ease: 'power3' });
    const dotY  = gsap.quickTo(dot,  'y', { duration: 0.12, ease: 'power3' });
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3' });

    let isHovering = false;

    const onMove = ({ clientX: x, clientY: y }) => {
      dotX(x); dotY(y);
      ringX(x); ringY(y);
    };

    const onDown = () => {
      gsap.to(dot,  { scale: 0.4, duration: 0.18, ease: 'power2.out' });
      gsap.to(ring, { scale: 0.7, duration: 0.25, ease: 'power2.out' });
    };

    const onUp = () => {
      gsap.to(dot,  { scale: isHovering ? 0   : 1, duration: 0.3, ease: 'elastic.out(1,0.5)' });
      gsap.to(ring, { scale: isHovering ? 1.5 : 1, duration: 0.3, ease: 'elastic.out(1,0.5)' });
    };

    const interactiveSelector = 'button, a, input, textarea, select, [role="button"], [data-cursor="pointer"]';

    const onOver = (e) => {
      const el = e.target.closest(interactiveSelector);
      if (el && !isHovering) {
        isHovering = true;
        gsap.to(dot, { scale: 0, opacity: 0, duration: 0.2, ease: 'power2.in' });
        gsap.to(ring, {
          scale:           1.65,
          borderColor:     '#00ff88',
          boxShadow:       '0 0 14px rgba(0,255,136,0.35), inset 0 0 8px rgba(0,255,136,0.08)',
          backgroundColor: 'rgba(0,255,136,0.04)',
          duration:        0.35,
          ease:            'power3.out',
        });
      }
    };

    const onOut = (e) => {
      const stillOnInteractive = e.relatedTarget?.closest(interactiveSelector);
      if (!stillOnInteractive && isHovering) {
        isHovering = false;
        gsap.to(dot, { scale: 1, opacity: 1, duration: 0.25, ease: 'power2.out' });
        gsap.to(ring, {
          scale:           1,
          borderColor:     'rgba(255,255,255,0.35)',
          boxShadow:       'none',
          backgroundColor: 'transparent',
          duration:        0.35,
          ease:            'power3.out',
        });
      }
    };

    const onLeave = () => gsap.to([dot, ring], { opacity: 0, duration: 0.3 });
    const onEnter = () => gsap.to([dot, ring], { opacity: 1, duration: 0.3 });

    window.addEventListener('mousemove',   onMove,  { passive: true });
    window.addEventListener('mousedown',   onDown);
    window.addEventListener('mouseup',     onUp);
    window.addEventListener('mouseleave',  onLeave);
    window.addEventListener('mouseenter',  onEnter);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout',  onOut);

    return () => {
      window.removeEventListener('mousemove',   onMove);
      window.removeEventListener('mousedown',   onDown);
      window.removeEventListener('mouseup',     onUp);
      window.removeEventListener('mouseleave',  onLeave);
      window.removeEventListener('mouseenter',  onEnter);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout',  onOut);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999] hidden md:block">
      <div
        ref={dotRef}
        style={{
          position:      'fixed',
          top:           0,
          left:          0,
          width:         8,
          height:        8,
          borderRadius:  '50%',
          background:    '#00ff88',
          boxShadow:     '0 0 8px rgba(0,255,136,0.8)',
          transform:     'translate(-50%,-50%)',
          willChange:    'transform',
          pointerEvents: 'none',
        }}
      />
      <div
        ref={ringRef}
        style={{
          position:      'fixed',
          top:           0,
          left:          0,
          width:         36,
          height:        36,
          borderRadius:  '50%',
          border:        '1.5px solid rgba(255,255,255,0.35)',
          transform:     'translate(-50%,-50%)',
          willChange:    'transform',
          pointerEvents: 'none',
          transition:    'background-color 0.35s, box-shadow 0.35s',
        }}
      />
    </div>
  );
};

export default GhostCursor;
