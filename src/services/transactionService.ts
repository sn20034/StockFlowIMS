import api from './api';
import type { PaginatedResponse } from './productService';

export interface Transaction {
  _id: string;
  product: { _id: string; name: string; sku: string };
  type: 'in' | 'out';
  quantity: number;
  user: { _id: string; name: string };
  notes: string;
  createdAt: string;
}

export interface TransactionQuery {
  type?: string;
  product?: string;
  user?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export const transactionService = {
  getAll: async (query: TransactionQuery = {}): Promise<PaginatedResponse<Transaction>> => {
    const res = await api.get('/transactions', { params: query });
    return res.data.data;
  },

  create: async (data: { product: string; type: 'in' | 'out'; quantity: number; notes?: string }): Promise<Transaction> => {
    const res = await api.post('/transactions', data);
    return res.data.data;
  },

  get: async (id: string): Promise<Transaction> => {
    const res = await api.get(`/transactions/${id}`);
    return res.data.data;
  },
};
