import { CalendarPlus, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';

const ResourceDetails = () => {
  const { id } = useParams();
  const [resource, setResource] = useState(null);

  useEffect(() => {
    api.get(`/resources/${id}`).then(({ data }) => setResource(data));
  }, [id]);

  if (!resource) return <section className="page"><div className="glass h-96 animate-pulse rounded-lg" /></section>;

  return (
    <section className="page">
      <div className="glass overflow-hidden rounded-lg">
        <img src={resource.image} alt={resource.title} className="h-80 w-full object-cover" />
        <div className="grid gap-8 p-6 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="font-bold text-teal-500">{resource.category}</p>
            <h2 className="mt-2 text-4xl font-black">{resource.title}</h2>
            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-300">{resource.description}</p>
            <div className="mt-5 flex flex-wrap gap-4 text-slate-500 dark:text-slate-300">
              <span className="flex items-center gap-2"><Users className="h-5 w-5" /> Capacity {resource.capacity}</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {resource.features?.map((feature) => <span key={feature} className="rounded-full bg-slate-950/5 px-3 py-1 text-sm font-semibold dark:bg-white/10">{feature}</span>)}
            </div>
          </div>
          <div className="rounded-lg bg-white/65 p-5 dark:bg-white/5">
            <h3 className="text-xl font-black">Reserve this resource</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Choose a date-time slot and submit your request for approval.</p>
            <Link to={`/book/${resource._id}`} className="btn-primary mt-5 w-full"><CalendarPlus className="h-4 w-4" /> Book now</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResourceDetails;
