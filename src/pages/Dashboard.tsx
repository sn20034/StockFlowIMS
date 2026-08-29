import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  Legend,
} from 'recharts';
import { ArrowLeftRight, ArrowDownToLine, ArrowUpFromLine, Package, AlertTriangle, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { DashboardCard } from '../components/DashboardCard';
import { LoadingState, EmptyState } from '../components/LoadingState';
import { StockBadge } from '../components/StockBadge';
import { reportService, type DashboardData } from '../services/reportService';
import { formatCurrency, formatNumber, formatDateTime } from '../utils/helpers';

export const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboard = await reportService.getDashboard();
        setData(dashboard);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <DashboardLayout><LoadingState text="Loading dashboard..." /></DashboardLayout>;
  if (!data) return <DashboardLayout><EmptyState title="No data available" /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of your inventory and stock movements.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <DashboardCard title="Total Products" value={formatNumber(data.stats.totalProducts)} icon="products" />
        <DashboardCard title="Total Stock Value" value={formatCurrency(data.stats.totalStockValue)} icon="value" />
        <DashboardCard title="Low Stock Items" value={formatNumber(data.stats.lowStockCount)} icon="low" />
        <DashboardCard title="Out of Stock" value={formatNumber(data.stats.outOfStockCount)} icon="out" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="card p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-1">Stock Levels by Category</h3>
          <p className="text-xs text-gray-500 mb-4">Quantity distribution across categories</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.stockByCategory} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }}
                cursor={{ fill: '#f8fafc' }}
              />
              <Bar dataKey="quantity" fill="#2563eb" radius={[4, 4, 0, 0]} name="Quantity" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-1">Stock Movement (Last 30 Days)</h3>
          <p className="text-xs text-gray-500 mb-4">Stock in vs stock out over time</p>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data.stockMovement} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Area type="monotone" dataKey="stockIn" stroke="#22c55e" fill="url(#colorIn)" name="Stock In" strokeWidth={2} />
              <Area type="monotone" dataKey="stockOut" stroke="#ef4444" fill="url(#colorOut)" name="Stock Out" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Link to="/products" className="card p-4 hover:shadow-md transition-shadow flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
            <Package className="text-primary-600" size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Products</p>
            <p className="text-xs text-gray-500">Manage catalog</p>
          </div>
        </Link>
        <Link to="/transactions" className="card p-4 hover:shadow-md transition-shadow flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center">
            <ArrowLeftRight className="text-accent-600" size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Transactions</p>
            <p className="text-xs text-gray-500">Record stock movement</p>
          </div>
        </Link>
        <Link to="/categories" className="card p-4 hover:shadow-md transition-shadow flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-success-100 flex items-center justify-center">
            <Package className="text-success-600" size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Categories</p>
            <p className="text-xs text-gray-500">Organize products</p>
          </div>
        </Link>
        <Link to="/reports" className="card p-4 hover:shadow-md transition-shadow flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-warning-100 flex items-center justify-center">
            <AlertTriangle className="text-warning-600" size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Reports</p>
            <p className="text-xs text-gray-500">Export & analyze</p>
          </div>
        </Link>
      </div>

      {/* Recent transactions + Low stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900">Recent Transactions</h3>
            <Link to="/transactions" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-0.5">
              View all <ChevronRight size={16} />
            </Link>
          </div>
          {data.recentTransactions.length === 0 ? (
            <EmptyState title="No transactions yet" />
          ) : (
            <div className="space-y-3">
              {data.recentTransactions.map((tx) => (
                <div key={tx._id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      tx.type === 'in' ? 'bg-success-100' : 'bg-error-100'
                    }`}
                  >
                    {tx.type === 'in' ? (
                      <ArrowDownToLine className="text-success-600" size={16} />
                    ) : (
                      <ArrowUpFromLine className="text-error-600" size={16} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{tx.product.name}</p>
                    <p className="text-xs text-gray-500">{tx.user.name} · {formatDateTime(tx.createdAt)}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-sm font-semibold ${tx.type === 'in' ? 'text-success-600' : 'text-error-600'}`}>
                      {tx.type === 'in' ? '+' : '-'}{tx.quantity}
                    </p>
                    <p className="text-xs text-gray-400">{tx.product.sku}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900">Low Stock Alerts</h3>
            <Link to="/products" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-0.5">
              View all <ChevronRight size={16} />
            </Link>
          </div>
          {data.lowStockProducts.length === 0 ? (
            <EmptyState title="All products well stocked" icon={<AlertTriangle size={40} />} />
          ) : (
            <div className="space-y-3">
              {data.lowStockProducts.slice(0, 6).map((p) => (
                <div key={p._id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                  <div className="w-9 h-9 rounded-lg bg-warning-100 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="text-warning-600" size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.sku} · {p.category.name}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-warning-600">{p.quantity} left</p>
                    <p className="text-xs text-gray-400">Min: {p.reorderThreshold}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
