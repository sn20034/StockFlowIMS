import api from './api';

export interface DashboardData {
  stats: {
    totalProducts: number;
    totalStockValue: number;
    lowStockCount: number;
    outOfStockCount: number;
  };
  stockByCategory: { name: string; quantity: number; value: number }[];
  stockMovement: { date: string; stockIn: number; stockOut: number }[];
  recentTransactions: Array<{
    _id: string;
    product: { name: string; sku: string };
    type: string;
    quantity: number;
    user: { name: string };
    createdAt: string;
  }>;
  lowStockProducts: Array<{ _id: string; name: string; sku: string; quantity: number; reorderThreshold: number; category: { name: string } }>;
  outOfStockProducts: Array<{ _id: string; name: string; sku: string; category: { name: string } }>;
}

export interface ReportRow {
  [key: string]: string | number;
}

export const reportService = {
  getDashboard: async (): Promise<DashboardData> => {
    const res = await api.get('/reports/dashboard');
    return res.data.data;
  },

  getInventoryReport: async (query: { category?: string; supplier?: string; stockStatus?: string } = {}): Promise<ReportRow[]> => {
    const res = await api.get('/reports/inventory', { params: query });
    return res.data.data;
  },

  getTransactionReport: async (query: { type?: string; startDate?: string; endDate?: string } = {}): Promise<ReportRow[]> => {
    const res = await api.get('/reports/transactions', { params: query });
    return res.data.data;
  },
};
