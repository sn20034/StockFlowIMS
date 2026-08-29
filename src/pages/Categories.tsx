import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, FolderTree, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Modal } from '../components/Modal';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { LoadingState, EmptyState } from '../components/LoadingState';
import { categoryService, type Category } from '../services/categoryService';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/helpers';

export const Categories = () => {
  const { isAdmin } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '' });
    setModalOpen(true);
  };

  const openEdit = (c: Category) => {
    setEditing(c);
    setForm({ name: c.name, description: c.description });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Category name is required');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await categoryService.update(editing._id, form);
        toast.success('Category updated');
      } else {
        await categoryService.create(form);
        toast.success('Category created');
      }
      setModalOpen(false);
      fetchCategories();
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
      await categoryService.delete(deleteTarget._id);
      toast.success('Category deleted');
      setDeleteTarget(null);
      fetchCategories();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 text-sm mt-1">Organize your products into categories.</p>
        </div>
        {isAdmin && (
          <button onClick={openCreate} className="btn-primary">
            <Plus size={18} /> Add Category
          </button>
        )}
      </div>

      {loading ? (
        <LoadingState text="Loading categories..." />
      ) : categories.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={<FolderTree size={48} />}
            title="No categories yet"
            description="Create your first category to organize products."
            action={isAdmin ? <button onClick={openCreate} className="btn-primary"><Plus size={18} /> Add Category</button> : undefined}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => (
            <div key={c._id} className="card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-11 h-11 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <FolderTree className="text-primary-600" size={22} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 truncate">{c.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{c.productCount} product{c.productCount !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                {isAdmin && (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg text-gray-400 hover:bg-primary-50 hover:text-primary-600">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => setDeleteTarget(c)} className="p-1.5 rounded-lg text-gray-400 hover:bg-error-50 hover:text-error-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
              {c.description && <p className="text-sm text-gray-600 mt-3 line-clamp-2">{c.description}</p>}
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Category' : 'Add Category'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Name *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" placeholder="Category name" />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input" rows={3} placeholder="Optional description" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : editing ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmationDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? Categories with linked products cannot be deleted.`}
        confirmText="Delete"
        loading={deleting}
      />
    </DashboardLayout>
  );
};
