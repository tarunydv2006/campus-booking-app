import { BellRing, CheckCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import EmptyState from '../components/EmptyState';
import { formatDateTime } from '../utils/constants';

const Notifications = () => {
  const [items, setItems] = useState([]);

  const load = () => api.get('/notifications').then(({ data }) => setItems(data));
  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    await api.patch(`/notifications/${id}/read`);
    load();
  };

  return (
    <section className="page">
      <h2 className="mb-6 text-3xl font-black">Notifications</h2>
      {items.length ? (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item._id} className={`glass rounded-lg p-5 ${!item.isRead ? 'ring-2 ring-teal-400/30' : ''}`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-3">
                  <BellRing className="mt-1 h-5 w-5 text-teal-500" />
                  <div>
                    <h3 className="font-black">{item.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.message}</p>
                    <p className="mt-1 text-xs text-slate-400">{formatDateTime(item.createdAt)}</p>
                  </div>
                </div>
                {!item.isRead && <button onClick={() => markRead(item._id)} className="btn-secondary"><CheckCheck className="h-4 w-4" /> Mark read</button>}
              </div>
            </div>
          ))}
        </div>
      ) : <EmptyState title="No notifications" />}
    </section>
  );
};

export default Notifications;
