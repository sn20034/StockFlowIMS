import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Truck, Mail, Phone, MapPin, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Modal } from '../components/Modal';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { LoadingState, EmptyState } from '../components/LoadingState';
import { supplierService, type Supplier } from '../services/supplierService';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/helpers';

const emptyForm = { name: '', contactPerson: '', email: '', phone: '', address: '' };

export const Suppliers = () => {
  const { isAdmin } = useAuth();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Supplier | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await supplierService.getAll();
      setSuppliers(data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (s: Supplier) => {
    setEditing(s);
    setForm({ name: s.name, contactPerson: s.contactPerson, email: s.email, phone: s.phone, address: s.address });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Supplier name is required');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await supplierService.update(editing._id, form);
        toast.success('Supplier updated');
      } else {
        await supplierService.create(form);
        toast.success('Supplier created');
      }
      setModalOpen(false);
      fetchSuppliers();
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
      await supplierService.delete(deleteTarget._id);
      toast.success('Supplier deleted');
      setDeleteTarget(null);
      fetchSuppliers();
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
          <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your supplier contacts.</p>
        </div>
        {isAdmin && (
          <button onClick={openCreate} className="btn-primary">
            <Plus size={18} /> Add Supplier
          </button>
        )}
      </div>

      {loading ? (
        <LoadingState text="Loading suppliers..." />
      ) : suppliers.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={<Truck size={48} />}
            title="No suppliers yet"
            description="Add your first supplier to start linking products."
            action={isAdmin ? <button onClick={openCreate} className="btn-primary"><Plus size={18} /> Add Supplier</button> : undefined}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {suppliers.map((s) => (
            <div key={s._id} className="card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-11 h-11 rounded-lg bg-accent-100 flex items-center justify-center flex-shrink-0">
                    <Truck className="text-accent-600" size={22} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 truncate">{s.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{s.productCount} product{s.productCount !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                {isAdmin && (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg text-gray-400 hover:bg-primary-50 hover:text-primary-600">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => setDeleteTarget(s)} className="p-1.5 rounded-lg text-gray-400 hover:bg-error-50 hover:text-error-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
              <div className="space-y-1.5 text-sm text-gray-600">
                {s.contactPerson && (
                  <div className="flex items-center gap-2"><User size={14} className="text-gray-400" /> {s.contactPerson}</div>
                )}
                {s.email && (
                  <div className="flex items-center gap-2"><Mail size={14} className="text-gray-400" /> {s.email}</div>
                )}
                {s.phone && (
                  <div className="flex items-center gap-2"><Phone size={14} className="text-gray-400" /> {s.phone}</div>
                )}
                {s.address && (
                  <div className="flex items-center gap-2"><MapPin size={14} className="text-gray-400" /> {s.address}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Supplier' : 'Add Supplier'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Name *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" placeholder="Supplier name" />
            </div>
            <div>
              <label className="label">Contact Person</label>
              <input value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} className="input" placeholder="Contact person" />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" placeholder="contact@supplier.com" />
            </div>
            <div>
              <label className="label">Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" placeholder="+1-555-0100" />
            </div>
          </div>
          <div>
            <label className="label">Address</label>
            <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input" rows={2} placeholder="Supplier address" />
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
        title="Delete Supplier"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? Suppliers with linked products cannot be deleted.`}
        confirmText="Delete"
        loading={deleting}
      />
    </DashboardLayout>
  );
};
