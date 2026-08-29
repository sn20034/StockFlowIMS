import { useEffect, useState, useCallback } from 'react';
import { Plus, ArrowDownToLine, ArrowUpFromLine, ArrowLeftRight, Filter, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { SearchBar } from '../components/SearchBar';
import { Pagination } from '../components/Pagination';
import { Modal } from '../components/Modal';
import { LoadingState, EmptyState } from '../components/LoadingState';
import { transactionService, type Transaction, type TransactionQuery } from '../services/transactionService';
import { productService, type Product } from '../services/productService';
import { formatDateTime, getErrorMessage } from '../utils/helpers';

export const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ product: '', type: 'in' as 'in' | 'out', quantity: 1, notes: '' });
  const [saving, setSaving] = useState(false);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const query: TransactionQuery = { page, limit: 10 };
      if (typeFilter) query.type = typeFilter;
      if (productFilter) query.product = productFilter;
      if (startDate) query.startDate = startDate;
      if (endDate) query.endDate = endDate;
      const data = await transactionService.getAll(query);
      setTransactions(data.items);
      setPagination(data.pagination);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [page, typeFilter, productFilter, startDate, endDate]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAll({ limit: 100 });
        setProducts(data.items);
      } catch (error) {
        // silent
      }
    };
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.product) {
      toast.error('Please select a product');
      return;
    }
    if (form.quantity < 1) {
      toast.error('Quantity must be at least 1');
      return;
    }
    setSaving(true);
    try {
      await transactionService.create(form);
      toast.success(form.type === 'in' ? 'Stock added successfully' : 'Stock removed successfully');
      setModalOpen(false);
      setForm({ product: '', type: 'in', quantity: 1, notes: '' });
      fetchTransactions();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const clearFilters = () => {
    setTypeFilter('');
    setProductFilter('');
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  const hasFilters = typeFilter || productFilter || startDate || endDate;

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-500 text-sm mt-1">Record stock movements and view history.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus size={18} /> New Transaction
        </button>
      </div>

      <div className="card p-4 mb-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }} className="input lg:w-40">
            <option value="">All Types</option>
            <option value="in">Stock In</option>
            <option value="out">Stock Out</option>
          </select>
          <select value={productFilter} onChange={(e) => { setProductFilter(e.target.value); setPage(1); }} className="input lg:w-48">
            <option value="">All Products</option>
            {products.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
          <div className="flex items-center gap-2">
            <input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setPage(1); }} className="input" />
            <span className="text-gray-400 text-sm">to</span>
            <input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setPage(1); }} className="input" />
          </div>
          {hasFilters && (
            <button onClick={clearFilters} className="btn-secondary whitespace-nowrap">
              <X size={16} /> Clear
            </button>
          )}
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <LoadingState text="Loading transactions..." />
        ) : transactions.length === 0 ? (
          <EmptyState
            icon={<ArrowLeftRight size={48} />}
            title="No transactions found"
            description={hasFilters ? 'Try adjusting your filters.' : 'Record your first stock movement.'}
            action={!hasFilters ? <button onClick={() => setModalOpen(true)} className="btn-primary"><Plus size={18} /> New Transaction</button> : undefined}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Quantity</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{formatDateTime(tx.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{tx.product?.name}</p>
                        <p className="text-xs text-gray-500 font-mono">{tx.product?.sku}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${tx.type === 'in' ? 'bg-success-100 text-success-700' : 'bg-error-100 text-error-700'}`}>
                        {tx.type === 'in' ? 'Stock In' : 'Stock Out'}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-sm font-semibold text-right ${tx.type === 'in' ? 'text-success-600' : 'text-error-600'}`}>
                      {tx.type === 'in' ? '+' : '-'}{tx.quantity}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{tx.user?.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 max-w-[200px] truncate">{tx.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && transactions.length > 0 && (
          <div className="px-4 pb-4">
            <Pagination page={pagination.page} pages={pagination.pages} total={pagination.total} limit={pagination.limit} onPageChange={setPage} />
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Stock Transaction">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Product *</label>
            <select value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} className="input">
              <option value="">Select a product</option>
              {products.map((p) => <option key={p._id} value={p._id}>{p.name} ({p.sku}) - Qty: {p.quantity}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Transaction Type *</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, type: 'in' })}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-lg border transition-all ${
                  form.type === 'in' ? 'border-success-500 bg-success-50 text-success-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <ArrowDownToLine size={18} />
                <div className="text-left">
                  <p className="text-sm font-medium">Stock In</p>
                  <p className="text-xs opacity-70">Restock / Purchase</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, type: 'out' })}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-lg border transition-all ${
                  form.type === 'out' ? 'border-error-500 bg-error-50 text-error-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <ArrowUpFromLine size={18} />
                <div className="text-left">
                  <p className="text-sm font-medium">Stock Out</p>
                  <p className="text-xs opacity-70">Sale / Usage</p>
                </div>
              </button>
            </div>
          </div>
          <div>
            <label className="label">Quantity *</label>
            <input type="number" min={1} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} className="input" />
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input" rows={2} placeholder="Optional notes" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Record Transaction'}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};
