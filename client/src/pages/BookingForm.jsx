import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import PageTransition from '../components/PageTransition';

const BookingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [form, setForm] = useState({ startDate: '', endDate: '', purpose: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get(`/resources/${id}`).then(({ data }) => setResource(data));
  }, [id]);

  const checkAvailability = async () => {
    if (!form.startDate || !form.endDate) return;
    const { data } = await api.get('/bookings/check-availability', { params: { resource: id, startDate: form.startDate, endDate: form.endDate } });
    setMessage(data.available ? 'Slot is available.' : 'This slot is already booked.');
  };

  const submit = async (event) => {
    event.preventDefault();
    setMessage('');
    try {
      await api.post('/bookings', { ...form, resource: id });
      navigate('/my-bookings');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <PageTransition>
      <form onSubmit={submit} className="glass mx-auto max-w-2xl rounded-lg p-6">
        <p className="font-bold text-teal-500">{resource?.category}</p>
        <h2 className="mt-2 text-3xl font-black">Book {resource?.title || 'resource'}</h2>
        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-bold">Start date and time</span>
            <input className="input" type="datetime-local" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} onBlur={checkAvailability} required />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold">End date and time</span>
            <input className="input" type="datetime-local" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} onBlur={checkAvailability} required />
          </label>
          <textarea className="input min-h-32" placeholder="Purpose of booking" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} required />
          {message && <p className="rounded-lg bg-slate-950/5 p-3 text-sm font-semibold dark:bg-white/10">{message}</p>}
          <button className="btn-primary w-full">Submit booking request</button>
        </div>
      </form>
    </PageTransition>
  );
};

export default BookingForm;
