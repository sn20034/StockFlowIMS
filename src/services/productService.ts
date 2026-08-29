import api from './api';

export interface Product {
  _id: string;
  name: string;
  sku: string;
  description: string;
  category: { _id: string; name: string };
  supplier: { _id: string; name: string };
  quantity: number;
  unitPrice: number;
  reorderThreshold: number;
  image: string;
  stockValue?: number;
  stockStatus?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

export interface ProductQuery {
  search?: string;
  category?: string;
  supplier?: string;
  stockStatus?: string;
  sort?: string;
  order?: string;
  page?: number;
  limit?: number;
}

export const productService = {
  getAll: async (query: ProductQuery = {}): Promise<PaginatedResponse<Product>> => {
    const res = await api.get('/products', { params: query });
    return res.data.data;
  },

  get: async (id: string): Promise<Product> => {
    const res = await api.get(`/products/${id}`);
    return res.data.data;
  },

  getLowStock: async (): Promise<Product[]> => {
    const res = await api.get('/products/low-stock');
    return res.data.data;
  },

  create: async (data: Record<string, unknown>): Promise<Product> => {
    const res = await api.post('/products', data);
    return res.data.data;
  },

  update: async (id: string, data: Record<string, unknown>): Promise<Product> => {
    const res = await api.put(`/products/${id}`, data);
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};
