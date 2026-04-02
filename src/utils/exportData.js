import toast from 'react-hot-toast';

export const exportToCSV = async (transactions) => {
  const loadingToast = toast.loading('Exporting to CSV...');
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const headers = ['ID', 'Date', 'Type', 'Category', 'Amount', 'Status'];
  const rows = transactions.map(tx => [
    tx.id,
    new Date(tx.date).toLocaleDateString('en-IN'),
    tx.type,
    tx.category,
    tx.amount,
    tx.status
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(e => e.join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `nexus-finance-export-${new Date().getTime()}.csv`;
  link.click();
  
  toast.success('Successfully exported to CSV', { id: loadingToast });
};

export const exportToJSON = async (transactions) => {
  const loadingToast = toast.loading('Exporting to JSON...');
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const jsonString = JSON.stringify(transactions, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `nexus-finance-export-${new Date().getTime()}.json`;
  link.click();
  
  toast.success('Successfully exported to JSON', { id: loadingToast });
};
