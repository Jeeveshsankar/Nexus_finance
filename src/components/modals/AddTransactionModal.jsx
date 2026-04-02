import { useState, useRef } from 'react';
import { X, Plus, Calendar, Tag, CreditCard, CheckCircle2 } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import useFinanceStore from '../../store/useFinanceStore';
import toast from 'react-hot-toast';

const AddTransactionModal = ({ isOpen, onClose }) => {
  const { addTransaction } = useFinanceStore();
  const modalRef = useRef(null);
  const contentRef = useRef(null);

  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    description: '',
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
    status: 'completed'
  });

  const [errors, setErrors] = useState({});

  useGSAP(() => {
    if (isOpen) {
      gsap.fromTo(modalRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(contentRef.current, { scale: 0.9, y: 20 }, { scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' });
    }
  }, [isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Enter a valid amount > 0';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.date) newErrors.date = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the errors');
      return;
    }

    const newTx = {
      id: `TX-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      ...formData,
      amount: parseFloat(formData.amount)
    };

    addTransaction(newTx);
    toast.success('Transaction added');
    onClose();
    setFormData({
      amount: '',
      category: 'Food',
      description: '',
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
      status: 'completed'
    });
  };

  if (!isOpen) return null;

  return (
    <div ref={modalRef} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        ref={contentRef}
        className="w-full max-w-lg bg-[#0d1117] border border-white/10 rounded-3xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
      >
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Plus size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">New Entry</h3>
              <p className="text-[10px] text-gray-500 font-mono uppercase tracking-[0.2em]">Transaction Registry</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">Type</label>
            <div className="grid grid-cols-2 gap-3">
              {['income', 'expense'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, type })}
                  className={`py-3 rounded-xl border font-bold capitalize transition-all ${
                    formData.type === type 
                    ? (type === 'income' ? 'bg-primary/20 border-primary text-primary' : 'bg-danger/20 border-danger text-danger') 
                    : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">Amount (₹)</label>
              <div className="relative">
                 <input 
                   autoFocus
                   type="number" 
                   step="0.01"
                   placeholder="0.00"
                   value={formData.amount}
                   onChange={(e) => {
                     setFormData({ ...formData, amount: e.target.value });
                     if (errors.amount) setErrors({...errors, amount: null});
                   }}
                   className={`w-full bg-white/5 border ${errors.amount ? 'border-danger animate-shake' : 'border-white/10'} rounded-xl py-3 px-4 text-xl font-bold font-mono text-white focus:outline-none focus:border-primary transition-all`} 
                 />
                 {errors.amount && <p className="text-[10px] text-danger mt-1 ml-1">{errors.amount}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">Date</label>
              <div className="relative">
                <input 
                  type="date" 
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-primary font-sans h-[50px]" 
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1 text-gray-500">Category</label>
            <select 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white appearance-none outline-none focus:border-primary"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {['Food', 'Rent', 'Shopping', 'Travel', 'Salary', 'Groceries', 'Entertainment', 'Others'].map(c => (
                <option key={c} value={c} className="bg-background">{c}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">Description (Optional)</label>
            <textarea 
              placeholder="What was this for?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-primary resize-none h-20"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-primary text-background font-black rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_15px_30px_rgba(0,255,136,0.2)] mt-4"
          >
            Confirm Entry
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
