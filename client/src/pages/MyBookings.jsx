import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import AnimatedList from '../components/AnimatedList';
import EmptyState from '../components/EmptyState';
import PageTransition from '../components/PageTransition';
import StatusBadge from '../components/StatusBadge';
import { formatDateTime } from '../utils/constants';
import { cardHover, itemVariants, quickTransition } from '../utils/motion';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    api.get('/bookings/my').then(({ data }) => setBookings(data));
  }, []);

  return (
    <PageTransition>
      <h2 className="mb-6 text-3xl font-black">My booking history</h2>
      {bookings.length ? (
        <AnimatedList className="space-y-3">
          {bookings.map((booking) => (
            <motion.div key={booking._id} variants={reduceMotion ? undefined : itemVariants} whileHover={reduceMotion ? undefined : cardHover} transition={quickTransition} className="glass rounded-lg p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-black">{booking.resource?.title}</h3>
                  <p className="text-sm text-slate-500">{formatDateTime(booking.startDate)} to {formatDateTime(booking.endDate)}</p>
                  <p className="mt-2 text-sm">{booking.purpose}</p>
                  {booking.adminRemark && <p className="mt-1 text-sm text-slate-500">Admin remark: {booking.adminRemark}</p>}
                </div>
                <StatusBadge status={booking.status} />
              </div>
            </motion.div>
          ))}
        </AnimatedList>
      ) : <EmptyState title="No bookings yet" text="Your reservations will appear here." />}
    </PageTransition>
  );
};

export default MyBookings;
