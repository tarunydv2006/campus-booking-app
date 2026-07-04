import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import AnimatedList from '../components/AnimatedList';
import EmptyState from '../components/EmptyState';
import PageTransition from '../components/PageTransition';
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
    <PageTransition>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Catalog</p>
          <h2 className="display-title mt-2">Campus resources</h2>
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
        <AnimatedList className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {resources.map((resource) => <ResourceCard key={resource._id} resource={resource} />)}
        </AnimatedList>
      ) : <EmptyState title="No resources found" text="Try a different search or category." />}
    </PageTransition>
  );
};

export default Resources;
