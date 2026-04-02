import { useRef, useState, useMemo, memo, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Search, Plus, Edit2, Trash2, Download, ArrowUpDown } from 'lucide-react';
import { Card } from '../components/ui/Card';
import useFinanceStore from '../store/useFinanceStore';
import toast from 'react-hot-toast';
import AddTransactionModal from '../components/modals/AddTransactionModal';

const TransactionRow = memo(({ tx, role, onDelete }) => {
  const rowRef = useRef(null);
  const isIncome = tx?.type === 'income';

  return (
    <tr ref={rowRef} className="tx-item hover:bg-foreground/[0.02] transition-colors group">
      <td className="py-4 md:py-6 pl-4 md:pl-8">
        <p className="text-foreground font-bold text-sm tracking-tight">{tx?.date ? new Date(tx.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}</p>
        <p className="text-[9px] text-foreground-muted font-bold uppercase tracking-[0.2em] mt-1">{(tx?.id || 'id_null').toUpperCase()}</p>
      </td>
      <td className="py-4 md:py-6">
        <span className="inline-flex items-center px-4 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-widest bg-foreground/[0.03] text-foreground-muted group-hover:text-primary transition-all">
          {tx?.category || 'General'}
        </span>
      </td>
      <td className="py-4 md:py-6 font-mono font-bold text-base md:text-lg text-right pr-4 md:pr-8 tracking-tighter">
        <span className={isIncome ? 'text-primary' : 'text-foreground'}>
          {isIncome ? '+' : '-'}₹{(tx?.amount || 0).toLocaleString('en-IN')}
        </span>
      </td>
      <td className="py-4 md:py-6">
        <div className="flex items-center gap-3">
          <span className={`w-2 h-2 rounded-full ${(tx?.status || 'pending') === 'completed' ? 'bg-primary shadow-[0_0_10px_var(--primary)]' : 'bg-warning shadow-[0_0_10px_var(--warning)]'}`}></span>
          <span className="text-[10px] text-foreground-muted font-black uppercase tracking-widest">{tx?.status || 'unknown'}</span>
        </div>
      </td>
      {role === 'admin' && (
        <td className="py-4 md:py-6 pr-4 md:pr-8">
          <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-3 text-foreground-muted hover:text-primary hover:bg-primary/10 rounded-xl transition-all">
              <Edit2 size={14} />
            </button>
            <button 
              onClick={() => onDelete(tx.id, rowRef.current)}
              className="p-3 text-foreground-muted hover:text-danger hover:bg-danger/10 rounded-xl transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </td>
      )}
    </tr>
  );
});

const SkeletonRow = ({ role }) => (
  <tr className="border-b border-white/5 animate-pulse">
    <td className="py-4 pl-4"><div className="h-4 w-24 bg-white/5 rounded mb-2" /><div className="h-2 w-32 bg-white/5 rounded" /></td>
    <td className="py-4"><div className="h-6 w-20 bg-white/5 rounded-full" /></td>
    <td className="py-4 pr-4"><div className="h-4 w-16 bg-white/5 rounded ml-auto" /></td>
    <td className="py-4"><div className="h-4 w-12 bg-white/5 rounded" /></td>
    {role === 'admin' && <td className="py-4 pr-4"><div className="h-8 w-20 bg-white/5 rounded ml-auto" /></td>}
  </tr>
);

const Transactions = () => {
  const containerRef = useRef(null);
  const { transactions, role, deleteTransaction } = useFinanceStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [dateRange] = useState({ start: '', end: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const categories = useMemo(() => 
    ['All', ...new Set(transactions.map(t => t.category))], 
  [transactions]);
  
  const filtered = useMemo(() => {
    return transactions.filter(tx => {
      const s = searchTerm.toLowerCase();
      const category = tx?.category || 'General';
      const description = tx?.description || '';
      const amount = (tx?.amount || 0).toString();

      const matchesSearch = category.toLowerCase().includes(s) || 
                            amount.includes(s) ||
                            description.toLowerCase().includes(s);
      
      const matchesType = filterType === 'All' || (tx?.type || 'expense') === filterType.toLowerCase();
      const matchesCategory = filterCategory === 'All' || category === filterCategory;
      
      const txDate = tx?.date ? new Date(tx.date) : new Date();
      const matchesStart = !dateRange.start || txDate >= new Date(dateRange.start);
      const matchesEnd = !dateRange.end || txDate <= new Date(dateRange.end);

      return matchesSearch && matchesType && matchesCategory && matchesStart && matchesEnd;
    }).sort((a, b) => {
      const order = sortOrder === 'asc' ? 1 : -1;
      if (sortBy === 'amount') return (a.amount - b.amount) * order;
      return (new Date(a.date) - new Date(b.date)) * order;
    });
  }, [transactions, searchTerm, filterType, filterCategory, dateRange, sortBy, sortOrder]);

  const handleExport = () => {
    const headers = ['Date', 'Category', 'Amount', 'Type', 'Status'];
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + filtered.map(tx => `${new Date(tx.date).toLocaleDateString()},${tx.category},${tx.amount},${tx.type},${tx.status}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `nexus_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    toast.success('Exporting CSV...');
  };

  const toggleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
  };

  useGSAP(() => {
    gsap.from('.header-anim', { y: 20, opacity: 0, duration: 0.5, stagger: 0.1 });
    gsap.from('.tx-item', { 
      y: 30, opacity: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out', clearProps: 'all' 
    });
  }, [filterType, searchTerm]);

  const handleDelete = (id, elRef) => {
    gsap.to(elRef, {
      x: -10, yoyo: true, repeat: 3, duration: 0.05,
      onComplete: () => {
        gsap.to(elRef, {
          height: 0, opacity: 0, marginTop: 0, marginBottom: 0, padding: 0, duration: 0.3,
          onComplete: () => {
            deleteTransaction(id);
            toast.success('Transaction deleted');
          }
        });
      }
    });
  };

  return (
    <div ref={containerRef} className="w-full flex flex-col gap-8 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-2 header-anim">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
             <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Ledger_Sync_Active</span>
          </div>
          <h1 className="text-3xl md:text-2xl font-bold font-sans tracking-tight text-foreground">Transactions</h1>
          <p className="text-foreground-muted font-medium text-sm mt-1">Every byte of your financial throughput, verified.</p>
        </div>
      </div>

      <Card className="header-anim p-0 overflow-hidden shadow-2xl border-card-border">
        <div className="p-4 md:p-6 border-b border-card-border flex flex-col md:flex-row gap-4 justify-between items-center bg-card-bg/30 backdrop-blur-xl">
          <div className="relative w-full md:w-1/3">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" />
            <input 
              type="text" 
              placeholder="Search Ledger..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/[0.01] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all text-foreground placeholder-foreground-muted/20"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-card-border rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all outline-none focus:ring-1 focus:ring-primary/30 bg-card text-foreground"
            >
              <option value="All">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border border-card-border rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all outline-none focus:ring-1 focus:ring-primary/30 bg-card text-foreground"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <button 
              onClick={handleExport}
              className="flex items-center gap-2 border border-card-border rounded-xl px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all bg-card text-foreground"
            >
              <Download size={14} /> Export
            </button>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-card-border bg-foreground/[0.02] text-foreground-muted text-[10px] uppercase font-black tracking-[0.3em]">
                <th className="py-4 md:py-6 pl-4 md:pl-8 cursor-pointer hover:text-primary transition-colors" onClick={() => toggleSort('date')}>
                   <div className="flex items-center gap-3">TX_DATE <ArrowUpDown size={12} className={sortBy === 'date' ? 'text-primary' : 'opacity-20'} /></div>
                </th>
                <th className="py-4 md:py-6">DESTINATION</th>
                <th className="py-4 md:py-6 text-right pr-4 md:pr-8 cursor-pointer hover:text-primary transition-colors" onClick={() => toggleSort('amount')}>
                   <div className="flex items-center justify-end gap-3">QUANTUM <ArrowUpDown size={12} className={sortBy === 'amount' ? 'text-primary' : 'opacity-20'} /></div>
                </th>
                <th className="py-4 md:py-6">STATUS</th>
                {role === 'admin' && <th className="py-4 md:py-6 pr-4 md:pr-8 text-right">PROTOCOL</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {isLoading ? (
                [1,2,3,4,5,6,7,8].map(i => <SkeletonRow key={i} role={role} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-40">
                    <div className="flex flex-col items-center">
                       <div className="w-20 h-20 rounded-[2rem] bg-foreground/5 flex items-center justify-center mb-8 transform rotate-12">
                          <Search size={32} className="text-foreground-muted" />
                       </div>
                       <h4 className="text-2xl font-black font-heading text-foreground tracking-tighter">Query Error.</h4>
                       <p className="text-foreground-muted mt-2 max-w-xs">No records matching hash parameters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => (
                   <TransactionRow key={tx.id} tx={tx} role={role} onDelete={handleDelete} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {role === 'admin' && (
        <button 
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-background rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,255,136,0.4)] hover:scale-110 active:scale-95 transition-all z-50 group overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <Plus size={24} className="relative z-10" />
        </button>
      )}

      <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Transactions;
