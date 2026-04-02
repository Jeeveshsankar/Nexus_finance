import { Bell, Search, Menu, Sun, Moon } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import useFinanceStore from '../../store/useFinanceStore';

const Header = ({ onMenuOpen }) => {
  const headerRef = useRef(null);
  const { theme, toggleTheme } = useFinanceStore();

  useGSAP(() => {
    gsap.from(headerRef.current, {
      y: -50, opacity: 0,
      duration: 1, ease: 'power3.out', delay: 0.5,
    });
  }, []);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-[100] flex items-center justify-between gap-4 py-2.5 backdrop-blur-md"
      style={{
        background:   'var(--background)',
        borderBottom: '1px solid var(--card-border)',
        opacity:       1,
      }}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuOpen}
          className="p-3 rounded-xl transition-all md:hidden"
          style={{
            background:   'var(--card)',
            border:       '1px solid var(--card-border)',
            color:        'var(--foreground)',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--foreground)'}
        >
          <Menu size={20} />
        </button>
        <div className="flex flex-col md:hidden">
          <span className="text-xs font-bold" style={{ color: 'var(--foreground)' }}>Nexus</span>
          <span className="text-[10px]"       style={{ color: 'var(--foreground)', opacity: 0.5 }}>Finance_Protocol</span>
        </div>
      </div>

      <div
        className="flex items-center gap-1.5 p-1 rounded-2xl transition-all"
        style={{
          background: 'var(--card)',
          border:     '1px solid var(--card-border)',
        }}
      >
        <div className="relative group hidden lg:block">
          <Search
            size={14}
            className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: 'var(--foreground)', opacity: 0.4 }}
          />
          <input
            type="text"
            placeholder="Search Protocol..."
            className="w-40 xl:w-60 bg-transparent border-none rounded-xl py-2 pl-11 pr-4 text-[9px] font-bold uppercase tracking-[0.2em] focus:outline-none transition-all"
            style={{ color: 'var(--foreground)' }}
          />
        </div>

        <div
          className="flex items-center gap-1 rounded-xl p-0.5 shrink-0"
          style={{ background: 'var(--card)', border: '1px solid var(--card-border)' }}
        >
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-all"
            title="Toggle Theme"
            style={{ color: 'var(--foreground)', opacity: 0.6 }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.opacity = '1'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--foreground)'; e.currentTarget.style.opacity = '0.6'; }}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <div className="w-px h-4 mx-0.5" style={{ background: 'var(--card-border)' }} />

          <button
            className="relative p-2 rounded-lg transition-all"
            style={{ color: 'var(--foreground)', opacity: 0.6 }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.opacity = '1'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--foreground)'; e.currentTarget.style.opacity = '0.6'; }}
          >
            <Bell size={15} />
            <span
              className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full"
              style={{ background: 'var(--danger)', boxShadow: '0 0 6px var(--danger)' }}
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
