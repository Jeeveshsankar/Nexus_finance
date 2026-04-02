import React, { useRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Card = React.forwardRef(({ className, children, ...props }, ref) => {
  const localRef = useRef(null);
  const combinedRef = ref || localRef;

  const handleMouseMove = (e) => {
    if (!combinedRef.current) return;
    const { left, top } = combinedRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    combinedRef.current.style.setProperty('--mouse-x', `${x}px`);
    combinedRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={combinedRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative rounded-[1.5rem] border border-card-border bg-card backdrop-blur-2xl p-6 overflow-hidden group transition-all duration-500",
        "before:absolute before:inset-0 before:-z-10 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500",
        "before:bg-[radial-gradient(400px_circle_at_var(--mouse-x)_var(--mouse-y),rgba(16,185,129,0.06),transparent_80%)]",
        className
      )}
      {...props}
    >
      {/* Dynamic Border Glow */}
      <div className="absolute inset-px -z-10 rounded-[1.5rem] bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      {children}
    </div>
  );
});
Card.displayName = "Card";
