import { motion, useReducedMotion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import AnimatedList from '../components/AnimatedList';
import EmptyState from '../components/EmptyState';
import PageTransition from '../components/PageTransition';
import StatusBadge from '../components/StatusBadge';
import { formatDateTime } from '../utils/constants';
import { cardHover, itemVariants, quickTransition } from '../utils/motion';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [remarks, setRemarks] = useState({});
  const reduceMotion = useReducedMotion();

  const load = () => api.get('/bookings/all').then(({ data }) => setBookings(data));
  useEffect(() => { load(); }, []);

  const act = async (id, action) => {
    await api.patch(`/bookings/${id}/${action}`, { remark: remarks[id] || (action === 'approve' ? 'Approved' : 'Rejected') });
    load();
  };

  return (
    <PageTransition>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Admin queue</p>
          <h2 className="display-title mt-2">Manage bookings</h2>
        </div>
      </div>
      {bookings.length ? (
        <AnimatedList className="space-y-3">
          {bookings.map((booking) => (
            <motion.div key={booking._id} variants={reduceMotion ? undefined : itemVariants} whileHover={reduceMotion ? undefined : cardHover} transition={quickTransition} className="data-row">
              <div className="grid gap-4 lg:grid-cols-[1fr_280px] lg:items-center">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-black">{booking.resource?.title}</h3>
                    <StatusBadge status={booking.status} />
                  </div>
                  <p className="text-sm text-slate-500">{booking.user?.name} • {booking.user?.role} • {booking.user?.department}</p>
                  <p className="mt-1 text-sm text-slate-500">{formatDateTime(booking.startDate)} to {formatDateTime(booking.endDate)}</p>
                  <p className="mt-2">{booking.purpose}</p>
                </div>
                <div className="space-y-2">
                  <input className="input" placeholder="Admin remark" value={remarks[booking._id] || ''} onChange={(e) => setRemarks({ ...remarks, [booking._id]: e.target.value })} />
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => act(booking._id, 'approve')} className="btn-primary" disabled={booking.status === 'approved'}><Check className="h-4 w-4" /> Approve</button>
                    <button onClick={() => act(booking._id, 'reject')} className="btn-secondary text-rose-500" disabled={booking.status === 'rejected'}><X className="h-4 w-4" /> Reject</button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatedList>
      ) : <EmptyState title="No bookings yet" />}
    </PageTransition>
  );
};

export default AdminBookings;
