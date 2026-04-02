import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, LineChart, Wallet, Settings, Shield, X } from 'lucide-react';
import useFinanceStore from '../../store/useFinanceStore';
import { cn } from '../ui/Card';

const navItems = [
  { path: '/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { path: '/transactions', label: 'Transactions', icon: Receipt          },
  { path: '/analytics',   label: 'Analytics',    icon: LineChart        },
  { path: '/budget',      label: 'Budget',       icon: Wallet           },
  { path: '/settings',    label: 'Settings',     icon: Settings         },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { role, setRole } = useFinanceStore();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-[90] md:hidden"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', transition: 'opacity 0.3s ease' }}
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 h-screen z-[100] flex flex-col overflow-hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        )}
        style={{
          width:           280,
          background:      'var(--background)',
          borderRight:     '1px solid var(--card-border)',
          backdropFilter:  'blur(24px)',
          transition:      'transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)',
          willChange:      'transform',
        }}
      >
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: '1px solid var(--card-border)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="relative w-8 h-8 flex items-center justify-center flex-shrink-0 rounded-full"
              style={{ border: '2px solid var(--primary)' }}
            >
              <div
                className="absolute inset-0 rounded-full border-2 border-t-transparent"
                style={{
                  borderColor:     'var(--primary)',
                  borderTopColor:  'transparent',
                  animation:       'spin 4s linear infinite',
                }}
              />
              <span
                className="text-xs font-black relative z-10"
                style={{ color: 'var(--foreground)' }}
              >
                NF
              </span>
            </div>
            <span
              className="font-black text-lg tracking-tight"
              style={{ color: 'var(--foreground)' }}
            >
              Nexus
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors md:hidden"
            style={{ color: 'var(--foreground)', opacity: 0.5 }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0.5'}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => window.innerWidth < 768 && onClose()}
              className="relative flex items-center gap-3.5 px-4 py-3 rounded-xl group overflow-hidden select-none"
              style={({ isActive }) => ({
                background:   isActive ? 'color-mix(in srgb, var(--primary) 12%, transparent)' : 'transparent',
                border:       isActive ? '1px solid color-mix(in srgb, var(--primary) 35%, transparent)' : '1px solid transparent',
                color:        isActive ? 'var(--primary)' : 'var(--foreground)',
                opacity:      isActive ? 1 : 0.65,
                transition:   'background 0.25s ease, border-color 0.25s ease, color 0.2s ease, opacity 0.2s ease',
              })}
              onMouseEnter={e => {
                const active = e.currentTarget.getAttribute('aria-current') === 'page';
                if (!active) {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.background = 'var(--card)';
                }
              }}
              onMouseLeave={e => {
                const active = e.currentTarget.getAttribute('aria-current') === 'page';
                if (!active) {
                  e.currentTarget.style.opacity = '0.6';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {({ isActive }) => (
                <>
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full"
                    style={{
                      height:     isActive ? '60%' : '0%',
                      background: 'var(--primary)',
                      boxShadow:  isActive ? '0 0 8px var(--primary)' : 'none',
                      transition: 'height 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                    }}
                  />
                  <Icon
                    size={20}
                    className="relative z-10 flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                  />
                  <span
                    className="relative z-10 text-sm font-semibold whitespace-nowrap"
                    style={{
                      fontWeight:  isActive ? 700 : 500,
                      textShadow:  isActive ? '0 0 12px var(--primary)' : 'none',
                      transition:  'text-shadow 0.25s ease',
                    }}
                  >
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div
          className="px-4 py-5"
          style={{ borderTop: '1px solid var(--card-border)' }}
        >
          <button
            onClick={() => setRole(role === 'admin' ? 'viewer' : 'admin')}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl group transition-all"
            style={{
              background: 'var(--card)',
              border:     '1px solid var(--card-border)',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--card-border)'}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
              style={{
                background:  role === 'admin' ? 'rgba(0,255,136,0.12)' : 'rgba(251,191,36,0.12)',
                border:      `1px solid ${role === 'admin' ? 'rgba(0,255,136,0.3)' : 'rgba(251,191,36,0.3)'}`,
                color:       role === 'admin' ? 'var(--primary)' : 'var(--warning)',
                transition:  'background 0.3s ease, border-color 0.3s ease',
              }}
            >
              <Shield size={18} />
            </div>
            <div className="text-left overflow-hidden">
              <p
                className="text-xs font-semibold"
                style={{ color: 'var(--foreground)' }}
              >
                Access Level
              </p>
              <p
                className="text-[10px] font-black uppercase tracking-widest font-mono mt-0.5"
                style={{ color: role === 'admin' ? 'var(--primary)' : 'var(--warning)' }}
              >
                {role} · Toggle
              </p>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
