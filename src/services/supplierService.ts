import api from './api';

export interface Supplier {
  _id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  productCount?: number;
  createdAt: string;
}

export const supplierService = {
  getAll: async (): Promise<Supplier[]> => {
    const res = await api.get('/suppliers');
    return res.data.data;
  },

  get: async (id: string): Promise<Supplier> => {
    const res = await api.get(`/suppliers/${id}`);
    return res.data.data;
  },

  create: async (data: Partial<Supplier>): Promise<Supplier> => {
    const res = await api.post('/suppliers', data);
    return res.data.data;
  },

  update: async (id: string, data: Partial<Supplier>): Promise<Supplier> => {
    const res = await api.put(`/suppliers/${id}`, data);
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/suppliers/${id}`);
  },
};
