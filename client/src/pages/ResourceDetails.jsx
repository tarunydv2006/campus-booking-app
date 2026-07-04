import { CalendarPlus, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';
import PageTransition from '../components/PageTransition';

const ResourceDetails = () => {
  const { id } = useParams();
  const [resource, setResource] = useState(null);

  useEffect(() => {
    api.get(`/resources/${id}`).then(({ data }) => setResource(data));
  }, [id]);

  if (!resource) return <PageTransition><div className="floating-card skeleton-shimmer h-96" /></PageTransition>;

  return (
    <PageTransition>
      <div className="floating-card overflow-hidden">
        <img src={resource.image} alt={resource.title} className="h-80 w-full object-cover" />
        <div className="grid gap-8 p-6 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="eyebrow">{resource.category}</p>
            <h2 className="mt-2 text-4xl font-black tracking-tight">{resource.title}</h2>
            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-300">{resource.description}</p>
            <div className="mt-5 flex flex-wrap gap-4 text-slate-500 dark:text-slate-300">
              <span className="flex items-center gap-2"><Users className="h-5 w-5" /> Capacity {resource.capacity}</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {resource.features?.map((feature) => <span key={feature} className="chip">{feature}</span>)}
            </div>
          </div>
          <div className="surface-card p-5">
            <h3 className="text-xl font-black">Reserve this resource</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Choose a date-time slot and submit your request for approval.</p>
            <Link to={`/book/${resource._id}`} className="btn-primary mt-5 w-full"><CalendarPlus className="h-4 w-4" /> Book now</Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ResourceDetails;
