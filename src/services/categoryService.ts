import api from './api';

export interface Category {
  _id: string;
  name: string;
  description: string;
  productCount?: number;
  createdAt: string;
}

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const res = await api.get('/categories');
    return res.data.data;
  },

  get: async (id: string): Promise<Category> => {
    const res = await api.get(`/categories/${id}`);
    return res.data.data;
  },

  create: async (data: { name: string; description?: string }): Promise<Category> => {
    const res = await api.post('/categories', data);
    return res.data.data;
  },

  update: async (id: string, data: { name: string; description?: string }): Promise<Category> => {
    const res = await api.put(`/categories/${id}`, data);
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};
