import { motion, useReducedMotion } from 'framer-motion';
import { Pencil, Plus, Power, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import AnimatedList from '../components/AnimatedList';
import EmptyState from '../components/EmptyState';
import PageTransition from '../components/PageTransition';
import { categories } from '../utils/constants';
import { cardHover, itemVariants, quickTransition } from '../utils/motion';

const blank = {
  title: '',
  category: 'Labs',
  capacity: 1,
  image: '',
  description: '',
  features: ''
};

const AdminResources = () => {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState(null);
  const reduceMotion = useReducedMotion();

  const load = () => api.get('/resources', { params: { active: 'all' } }).then(({ data }) => setResources(data));
  useEffect(() => { load(); }, []);

  const submit = async (event) => {
    event.preventDefault();
    const { location, ...formWithoutLocation } = form;
    const payload = {
      ...formWithoutLocation,
      capacity: Number(form.capacity),
      features: form.features.split(',').map((item) => item.trim()).filter(Boolean)
    };
    if (editingId) await api.put(`/resources/${editingId}`, payload);
    else await api.post('/resources', payload);
    setForm(blank);
    setEditingId(null);
    load();
  };

  const edit = (resource) => {
    setEditingId(resource._id);
    setForm({ ...resource, features: resource.features?.join(', ') || '' });
  };

  return (
    <PageTransition>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Admin</p>
          <h2 className="display-title mt-2">Manage resources</h2>
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <form onSubmit={submit} className="floating-card p-5">
          <h3 className="mb-4 flex items-center gap-2 text-xl font-black"><Plus className="h-5 w-5" /> {editingId ? 'Edit resource' : 'Add resource'}</h3>
          <div className="space-y-3">
            <input className="input" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {categories.map((category) => <option key={category}>{category}</option>)}
            </select>
            <input className="input" type="number" min="1" placeholder="Capacity" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} required />
            <input className="input" placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            <textarea className="input min-h-24" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            <input className="input" placeholder="Features, comma separated" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} />
            <button className="btn-primary w-full">{editingId ? 'Save changes' : 'Create resource'}</button>
          </div>
        </form>
        <AnimatedList className="space-y-3">
          {resources.length ? resources.map((resource) => (
            <motion.div key={resource._id} variants={reduceMotion ? undefined : itemVariants} whileHover={reduceMotion ? undefined : cardHover} transition={quickTransition} className="data-row">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex gap-4">
                  <img src={resource.image} alt={resource.title} className="h-20 w-24 rounded-lg object-cover" />
                  <div>
                    <h3 className="font-black">{resource.title}</h3>
                    <p className="text-sm text-slate-500">{resource.category} • Capacity {resource.capacity}</p>
                    <p className={`mt-1 text-xs font-bold ${resource.isActive ? 'text-emerald-500' : 'text-rose-500'}`}>{resource.isActive ? 'Active' : 'Inactive'}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => edit(resource)} className="btn-secondary px-3"><Pencil className="h-4 w-4" /></button>
                  <button onClick={async () => { await api.patch(`/resources/${resource._id}/toggle-active`); load(); }} className={`btn-secondary px-3 ${resource.isActive ? 'text-emerald-500' : 'text-rose-500'}`} title={resource.isActive ? 'Set inactive' : 'Set active'}>
                    <Power className="h-4 w-4" />
                  </button>
                  <button onClick={async () => { await api.delete(`/resources/${resource._id}`); load(); }} className="btn-secondary px-3 text-rose-500"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </motion.div>
          )) : <EmptyState title="No resources" />}
        </AnimatedList>
      </div>
    </PageTransition>
  );
};

export default AdminResources;
