import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import useFinanceStore from '../store/useFinanceStore';
import { Card } from '../components/ui/Card';
import { Shield, Download, Moon, Sun, User, Bell, Lock, Globe, Cpu, Zap, Key } from 'lucide-react';
import toast from 'react-hot-toast';
import { exportToCSV, exportToJSON } from '../utils/exportData';

const SettingRow = ({ icon, label, desc, children }) => (
  <div className="flex items-center justify-between py-4 border-b border-foreground/5 last:border-0">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-foreground/5 border border-foreground/5 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-foreground">{label}</p>
        {desc && <p className="text-[11px] text-foreground-muted mt-0.5">{desc}</p>}
      </div>
    </div>
    <div className="shrink-0">{children}</div>
  </div>
);

const Toggle = ({ active, onClick, color = 'primary' }) => (
  <button
    onClick={onClick}
    className={`relative w-12 h-6 rounded-full transition-all duration-300 ${active ? `bg-${color}/30 border border-${color}/40` : 'bg-foreground/5 border border-foreground/10'}`}
  >
    <div className={`absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300 shadow-lg ${active ? `left-[calc(100%-1.375rem)] bg-${color} shadow-${color}/40` : 'left-0.5 bg-foreground/20'}`} />
  </button>
);

const Settings = () => {
  const containerRef = useRef(null);
  const { role, setRole, theme, toggleTheme, transactions } = useFinanceStore();

  useGSAP(() => {
    gsap.fromTo('.settings-section',
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out' }
    );
  }, { scope: containerRef });

  const handleRoleToggle = () => {
    const newRole = role === 'admin' ? 'viewer' : 'admin';
    setRole(newRole);
    toast.success(`Switched to ${newRole.toUpperCase()} mode`, {
      icon: <Shield className={newRole === 'admin' ? 'text-primary' : 'text-warning'} size={20} />
    });
  };

  return (
    <div ref={containerRef} className="w-full flex flex-col gap-6 pb-10">
      <div className="settings-section">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_10px_var(--secondary)]" />
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary">System_Configuration</span>
        </div>
        <h1 className="text-3xl font-bold font-sans tracking-tight text-foreground">Settings</h1>
        <p className="text-foreground-muted font-medium text-sm mt-1">Manage your preferences and protocol configurations.</p>
      </div>

      <Card className="settings-section p-6">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-foreground-muted mb-5 pb-3 border-b border-foreground/5">Identity Node</h3>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
          <div className="flex items-center gap-5 w-full">
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 flex items-center justify-center">
                <User size={28} className="text-primary/60" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-background shadow-[0_0_8px_var(--primary)]" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-foreground font-sans truncate">Jeevesh Sankar M</h2>
              <p className="text-foreground-muted font-mono text-[11px] mt-0.5 truncate">mjeeveshsankar@gmail.com</p>
              <div className="flex items-center gap-2 mt-2">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${role === 'admin' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-warning/10 border-warning/20 text-warning'}`}>
                  <Shield size={12} />
                  {role}
                </div>
                <span className="text-[10px] text-foreground-muted uppercase tracking-widest hidden sm:inline">Protocol Access</span>
              </div>
            </div>
          </div>
          <button className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground-muted text-xs font-bold uppercase tracking-wider hover:bg-foreground/10 hover:text-foreground transition-all">
            Edit Profile
          </button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="settings-section p-6">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-foreground-muted mb-4 pb-3 border-b border-foreground/5">Access Control</h3>
          <SettingRow
            icon={<Shield size={16} className={role === 'admin' ? 'text-primary' : 'text-warning'} />}
            label="Role Mode"
            desc={role === 'admin' ? 'Full write access to all nodes' : 'Read-only ledger access'}
          >
            <Toggle active={role === 'admin'} onClick={handleRoleToggle} color="primary" />
          </SettingRow>
          <SettingRow
            icon={<Lock size={16} className="text-foreground-muted" />}
            label="Two-Factor Auth"
            desc="Biometric verification on login"
          >
            <Toggle active={true} onClick={() => toast('2FA is always enabled')} color="secondary" />
          </SettingRow>
          <SettingRow
            icon={<Key size={16} className="text-foreground-muted" />}
            label="API Access"
            desc="Programmatic node access"
          >
            <button className="px-3 py-1.5 rounded-lg bg-foreground/5 border border-foreground/10 text-foreground-muted text-[10px] font-bold uppercase tracking-wider hover:bg-foreground/10 hover:text-foreground transition-all">
              Manage Keys
            </button>
          </SettingRow>
        </Card>

        <Card className="settings-section p-6">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-foreground-muted mb-4 pb-3 border-b border-foreground/5">Preferences</h3>
          <SettingRow
            icon={theme === 'dark' ? <Moon size={16} className="text-primary" /> : <Sun size={16} className="text-warning" />}
            label="Interface Theme"
            desc={theme === 'dark' ? 'Dark protocol mode' : 'Light protocol mode'}
          >
            <Toggle active={theme === 'light'} onClick={() => { toggleTheme(); toast('Theme toggled'); }} color="warning" />
          </SettingRow>
          <SettingRow
            icon={<Bell size={16} className="text-foreground-muted" />}
            label="Notifications"
            desc="Alert on transaction events"
          >
            <Toggle active={true} onClick={() => toast('Notification settings')} color="secondary" />
          </SettingRow>
          <SettingRow
            icon={<Globe size={16} className="text-foreground-muted" />}
            label="Currency Region"
            desc="Indian Rupee (₹ INR)"
          >
            <button className="px-3 py-1.5 rounded-lg bg-foreground/5 border border-foreground/10 text-foreground-muted text-[10px] font-bold uppercase tracking-wider hover:bg-foreground/10 hover:text-foreground transition-all">
              Change
            </button>
          </SettingRow>
        </Card>

        <Card className="settings-section p-6">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-foreground-muted mb-4 pb-3 border-b border-foreground/5">Data Export</h3>
          <p className="text-sm text-foreground-muted mb-5 leading-relaxed">
            Download your full transaction ledger. Supports CSV for spreadsheets and JSON for programmatic use.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => exportToCSV(transactions)}
              className="flex items-center justify-center gap-2 py-3.5 bg-foreground/5 hover:bg-primary/10 border border-foreground/10 hover:border-primary/30 rounded-xl text-foreground text-xs font-bold uppercase tracking-wider transition-all group"
            >
              <Download size={14} className="group-hover:text-primary transition-colors" /> Export CSV
            </button>
            <button
              onClick={() => exportToJSON(transactions)}
              className="flex items-center justify-center gap-2 py-3.5 bg-foreground/5 hover:bg-secondary/10 border border-foreground/10 hover:border-secondary/30 rounded-xl text-foreground text-xs font-bold uppercase tracking-wider transition-all group"
            >
              <Download size={14} className="group-hover:text-secondary transition-colors" /> Export JSON
            </button>
          </div>
        </Card>

        <Card className="settings-section p-6">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-foreground-muted mb-4 pb-3 border-b border-foreground/5">System Status</h3>
          {[
            { icon: <Cpu size={14} className="text-primary" />, label: 'Core Version', value: 'v2.1.0', status: 'Stable' },
            { icon: <Zap size={14} className="text-secondary" />, label: 'API Latency', value: '42ms', status: 'Optimal' },
            { icon: <Globe size={14} className="text-warning" />, label: 'Data Nodes', value: '3 Active', status: 'Online' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-foreground/5 last:border-0">
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="text-sm font-medium text-foreground">{item.label}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-foreground-muted">{item.value}</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">{item.status}</span>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

export default Settings;
