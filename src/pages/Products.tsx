import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Package, Eye, Filter, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { SearchBar } from '../components/SearchBar';
import { Pagination } from '../components/Pagination';
import { StockBadge } from '../components/StockBadge';
import { Modal } from '../components/Modal';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { LoadingState, EmptyState } from '../components/LoadingState';
import { productService, type Product, type ProductQuery } from '../services/productService';
import { categoryService, type Category } from '../services/categoryService';
import { supplierService, type Supplier } from '../services/supplierService';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, getErrorMessage, getStockStatus } from '../utils/helpers';

const emptyForm = {
  name: '',
  sku: '',
  description: '',
  category: '',
  supplier: '',
  quantity: 0,
  unitPrice: 0,
  reorderThreshold: 10,
  image: '',
};

export const Products = () => {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [sort, setSort] = useState('createdAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const query: ProductQuery = { page, limit: 10, sort, order };
      if (search) query.search = search;
      if (categoryFilter) query.category = categoryFilter;
      if (supplierFilter) query.supplier = supplierFilter;
      if (stockFilter) query.stockStatus = stockFilter;
      const data = await productService.getAll(query);
      setProducts(data.items);
      setPagination(data.pagination);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [page, sort, order, search, categoryFilter, supplierFilter, stockFilter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      sku: p.sku,
      description: p.description,
      category: p.category._id,
      supplier: p.supplier._id,
      quantity: p.quantity,
      unitPrice: p.unitPrice,
      reorderThreshold: p.reorderThreshold,
      image: p.image,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.sku || !form.category || !form.supplier) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await productService.update(editing._id, form);
        toast.success('Product updated successfully');
      } else {
        await productService.create(form);
        toast.success('Product created successfully');
      }
      setModalOpen(false);
      fetchProducts();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await productService.delete(deleteTarget._id);
      toast.success('Product deleted');
      setDeleteTarget(null);
      fetchProducts();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setCategoryFilter('');
    setSupplierFilter('');
    setStockFilter('');
    setPage(1);
  };

  const hasFilters = search || categoryFilter || supplierFilter || stockFilter;

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your inventory catalog.</p>
        </div>
        {isAdmin && (
          <button onClick={openCreate} className="btn-primary">
            <Plus size={18} /> Add Product
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card p-4 mb-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search by name or SKU..." />
          <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }} className="input lg:w-44">
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <select value={supplierFilter} onChange={(e) => { setSupplierFilter(e.target.value); setPage(1); }} className="input lg:w-44">
            <option value="">All Suppliers</option>
            {suppliers.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
          <select value={stockFilter} onChange={(e) => { setStockFilter(e.target.value); setPage(1); }} className="input lg:w-40">
            <option value="">All Stock</option>
            <option value="in">In Stock</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
          <select value={`${sort}-${order}`} onChange={(e) => { const [s, o] = e.target.value.split('-'); setSort(s); setOrder(o as 'asc' | 'desc'); }} className="input lg:w-40">
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="quantity-asc">Quantity Low-High</option>
            <option value="quantity-desc">Quantity High-Low</option>
            <option value="unitPrice-desc">Price High-Low</option>
          </select>
          {hasFilters && (
            <button onClick={clearFilters} className="btn-secondary whitespace-nowrap">
              <X size={16} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <LoadingState text="Loading products..." />
        ) : products.length === 0 ? (
          <EmptyState
            icon={<Package size={48} />}
            title="No products found"
            description={hasFilters ? 'Try adjusting your filters.' : 'Get started by adding your first product.'}
            action={isAdmin && !hasFilters ? <button onClick={openCreate} className="btn-primary"><Plus size={18} /> Add Product</button> : undefined}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">SKU</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Qty</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                          {p.image ? <img src={p.image} alt={p.name} className="w-full h-full rounded-lg object-cover" /> : <Package className="text-gray-400" size={18} />}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 font-mono">{p.sku}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{p.category?.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">{p.quantity}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(p.unitPrice)}</td>
                    <td className="px-4 py-3"><StockBadge quantity={p.quantity} reorderThreshold={p.reorderThreshold} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setDetailProduct(p)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600" title="View">
                          <Eye size={16} />
                        </button>
                        {isAdmin && (
                          <>
                            <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-gray-400 hover:bg-primary-50 hover:text-primary-600" title="Edit">
                              <Pencil size={16} />
                            </button>
                            <button onClick={() => setDeleteTarget(p)} className="p-1.5 rounded-lg text-gray-400 hover:bg-error-50 hover:text-error-600" title="Delete">
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && products.length > 0 && (
          <div className="px-4 pb-4">
            <Pagination page={pagination.page} pages={pagination.pages} total={pagination.total} limit={pagination.limit} onPageChange={setPage} />
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Product' : 'Add Product'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Name *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" placeholder="Product name" />
            </div>
            <div>
              <label className="label">SKU *</label>
              <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value.toUpperCase() })} className="input" placeholder="ELEC-001" />
            </div>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input" rows={2} placeholder="Product description" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Category *</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input">
                <option value="">Select category</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Supplier *</label>
              <select value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} className="input">
                <option value="">Select supplier</option>
                {suppliers.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Quantity</label>
              <input type="number" min={0} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} className="input" />
            </div>
            <div>
              <label className="label">Unit Price ($)</label>
              <input type="number" min={0} step="0.01" value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: Number(e.target.value) })} className="input" />
            </div>
            <div>
              <label className="label">Reorder Threshold</label>
              <input type="number" min={0} value={form.reorderThreshold} onChange={(e) => setForm({ ...form, reorderThreshold: Number(e.target.value) })} className="input" />
            </div>
          </div>
          <div>
            <label className="label">Image URL</label>
            <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="input" placeholder="https://..." />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : editing ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      <Modal open={!!detailProduct} onClose={() => setDetailProduct(null)} title="Product Details" size="md">
        {detailProduct && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center">
                {detailProduct.image ? <img src={detailProduct.image} alt={detailProduct.name} className="w-full h-full rounded-xl object-cover" /> : <Package className="text-gray-400" size={32} />}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{detailProduct.name}</h3>
                <p className="text-sm text-gray-500 font-mono">{detailProduct.sku}</p>
                <div className="mt-1"><StockBadge quantity={detailProduct.quantity} reorderThreshold={detailProduct.reorderThreshold} /></div>
              </div>
            </div>
            {detailProduct.description && <p className="text-sm text-gray-600">{detailProduct.description}</p>}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Category</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{detailProduct.category?.name}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Supplier</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{detailProduct.supplier?.name}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Quantity</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{detailProduct.quantity}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Unit Price</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{formatCurrency(detailProduct.unitPrice)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Stock Value</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{formatCurrency(detailProduct.quantity * detailProduct.unitPrice)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Reorder Threshold</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{detailProduct.reorderThreshold}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirmation */}
      <ConfirmationDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        loading={deleting}
      />
    </DashboardLayout>
  );
};
