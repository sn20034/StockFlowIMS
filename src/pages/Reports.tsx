import { useEffect, useState } from 'react';
import { Download, FileBarChart, Package, ArrowLeftRight, Filter, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { LoadingState, EmptyState } from '../components/LoadingState';
import { reportService, type ReportRow } from '../services/reportService';
import { categoryService, type Category } from '../services/categoryService';
import { supplierService, type Supplier } from '../services/supplierService';
import { exportToCSV, formatCurrency, getErrorMessage } from '../utils/helpers';

type Tab = 'inventory' | 'transactions';

export const Reports = () => {
  const [tab, setTab] = useState<Tab>('inventory');
  const [rows, setRows] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const [categoryFilter, setCategoryFilter] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [cats, sups] = await Promise.all([categoryService.getAll(), supplierService.getAll()]);
        setCategories(cats);
        setSuppliers(sups);
      } catch (error) {
        // silent
      }
    };
    fetchFilters();
  }, []);

  const fetchReport = async () => {
    setLoading(true);
    try {
      if (tab === 'inventory') {
        const query: { category?: string; supplier?: string; stockStatus?: string } = {};
        if (categoryFilter) query.category = categoryFilter;
        if (supplierFilter) query.supplier = supplierFilter;
        if (stockFilter) query.stockStatus = stockFilter;
        const data = await reportService.getInventoryReport(query);
        setRows(data);
      } else {
        const query: { type?: string; startDate?: string; endDate?: string } = {};
        if (typeFilter) query.type = typeFilter;
        if (startDate) query.startDate = startDate;
        if (endDate) query.endDate = endDate;
        const data = await reportService.getTransactionReport(query);
        setRows(data);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, categoryFilter, supplierFilter, stockFilter, typeFilter, startDate, endDate]);

  const handleExport = () => {
    if (!rows.length) {
      toast.error('No data to export');
      return;
    }
    const filename = tab === 'inventory' ? 'inventory_report.csv' : 'transaction_report.csv';
    exportToCSV(rows, filename);
    toast.success('CSV exported successfully');
  };

  const clearFilters = () => {
    setCategoryFilter('');
    setSupplierFilter('');
    setStockFilter('');
    setTypeFilter('');
    setStartDate('');
    setEndDate('');
  };

  const hasFilters = categoryFilter || supplierFilter || stockFilter || typeFilter || startDate || endDate;

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500 text-sm mt-1">Generate and export inventory reports.</p>
        </div>
        <button onClick={handleExport} disabled={!rows.length} className="btn-primary">
          <Download size={18} /> Export CSV
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b border-gray-200">
        <button
          onClick={() => setTab('inventory')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            tab === 'inventory' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Package size={16} /> Inventory Report
        </button>
        <button
          onClick={() => setTab('transactions')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            tab === 'transactions' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <ArrowLeftRight size={16} /> Transaction Report
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-4">
        {tab === 'inventory' ? (
          <div className="flex flex-col lg:flex-row gap-3">
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="input lg:w-48">
              <option value="">All Categories</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <select value={supplierFilter} onChange={(e) => setSupplierFilter(e.target.value)} className="input lg:w-48">
              <option value="">All Suppliers</option>
              {suppliers.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
            <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)} className="input lg:w-40">
              <option value="">All Stock Status</option>
              <option value="in">In Stock</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>
            {hasFilters && <button onClick={clearFilters} className="btn-secondary whitespace-nowrap"><X size={16} /> Clear</button>}
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-3">
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="input lg:w-40">
              <option value="">All Types</option>
              <option value="in">Stock In</option>
              <option value="out">Stock Out</option>
            </select>
            <div className="flex items-center gap-2">
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input" />
              <span className="text-gray-400 text-sm">to</span>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input" />
            </div>
            {hasFilters && <button onClick={clearFilters} className="btn-secondary whitespace-nowrap"><X size={16} /> Clear</button>}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <LoadingState text="Generating report..." />
        ) : rows.length === 0 ? (
          <EmptyState icon={<FileBarChart size={48} />} title="No data available" description="Try adjusting your filters." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  {Object.keys(rows[0]).map((key) => (
                    <th key={key} className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    {Object.entries(row).map(([key, val]) => {
                      const isCurrency = key === 'unitPrice' || key === 'stockValue';
                      const isStatus = key === 'stockStatus';
                      const statusStyle = val === 'In Stock' ? 'bg-success-100 text-success-700' : val === 'Low Stock' ? 'bg-warning-100 text-warning-700' : val === 'Out of Stock' ? 'bg-error-100 text-error-700' : '';
                      return (
                        <td key={key} className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                          {isStatus ? (
                            <span className={`badge ${statusStyle}`}>{String(val)}</span>
                          ) : isCurrency ? (
                            formatCurrency(Number(val))
                          ) : (
                            String(val)
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {!loading && rows.length > 0 && (
        <p className="text-sm text-gray-500 mt-3">{rows.length} record{rows.length !== 1 ? 's' : ''} found</p>
      )}
    </DashboardLayout>
  );
};
