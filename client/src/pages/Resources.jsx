import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import EmptyState from '../components/EmptyState';
import ResourceCard from '../components/ResourceCard';
import Skeleton from '../components/Skeleton';
import { categories } from '../utils/constants';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', category: '' });

  useEffect(() => {
    setLoading(true);
    api.get('/resources', { params: filters }).then(({ data }) => setResources(data)).finally(() => setLoading(false));
  }, [filters]);

  return (
    <section className="page">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-500">Catalog</p>
          <h2 className="mt-2 text-3xl font-black">Campus resources</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
          <label className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input className="input pl-9" placeholder="Search resources..." value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
          </label>
          <select className="input" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
            <option value="">All categories</option>
            {categories.map((category) => <option key={category}>{category}</option>)}
          </select>
        </div>
      </div>
      {loading ? <Skeleton /> : resources.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {resources.map((resource) => <ResourceCard key={resource._id} resource={resource} />)}
        </div>
      ) : <EmptyState title="No resources found" text="Try a different search or category." />}
    </section>
  );
};

export default Resources;
