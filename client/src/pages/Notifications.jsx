import { motion, useReducedMotion } from 'framer-motion';
import { BellRing, CheckCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import AnimatedList from '../components/AnimatedList';
import EmptyState from '../components/EmptyState';
import PageTransition from '../components/PageTransition';
import { formatDateTime } from '../utils/constants';
import { cardHover, itemVariants, quickTransition } from '../utils/motion';

const Notifications = () => {
  const [items, setItems] = useState([]);
  const reduceMotion = useReducedMotion();

  const load = () => api.get('/notifications').then(({ data }) => setItems(data));
  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    await api.patch(`/notifications/${id}/read`);
    load();
  };

  return (
    <PageTransition>
      <h2 className="mb-6 text-3xl font-black">Notifications</h2>
      {items.length ? (
        <AnimatedList className="space-y-3">
          {items.map((item) => (
            <motion.div key={item._id} variants={reduceMotion ? undefined : itemVariants} whileHover={reduceMotion ? undefined : cardHover} transition={quickTransition} className={`glass rounded-lg p-5 ${!item.isRead ? 'ring-2 ring-teal-400/30' : ''}`}>
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
            </motion.div>
          ))}
        </AnimatedList>
      ) : <EmptyState title="No notifications" />}
    </PageTransition>
  );
};

export default Notifications;
