import ApprovalLog from '../models/ApprovalLog.js';
import Booking from '../models/Booking.js';
import Notification from '../models/Notification.js';
import Resource from '../models/Resource.js';

const hasConflict = async (resource, startDate, endDate, excludeBookingId = null) => {
  const query = {
    resource,
    status: { $in: ['pending', 'approved'] },
    startDate: { $lt: endDate },
    endDate: { $gt: startDate }
  };
  if (excludeBookingId) query._id = { $ne: excludeBookingId };
  return Booking.exists(query);
};

export const createBooking = async (req, res) => {
  const { resource, startDate, endDate, purpose } = req.body;
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (!resource || !startDate || !endDate || !purpose) {
    return res.status(400).json({ message: 'Resource, start date, end date, and purpose are required' });
  }
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start >= end) {
    return res.status(400).json({ message: 'Please choose a valid date range' });
  }

  const resourceDoc = await Resource.findOne({ _id: resource, isActive: true });
  if (!resourceDoc) return res.status(404).json({ message: 'Active resource not found' });

  if (await hasConflict(resource, start, end)) {
    return res.status(409).json({ message: 'This resource is already booked for the selected time slot' });
  }

  const booking = await Booking.create({ user: req.user._id, resource, startDate: start, endDate: end, purpose });
  await Notification.create({
    user: req.user._id,
    title: 'Booking request submitted',
    message: `${resourceDoc.title} is pending admin approval.`
  });

  res.status(201).json(await booking.populate('resource'));
};

export const getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('resource')
    .sort({ createdAt: -1 });
  res.json(bookings);
};

export const getAllBookings = async (req, res) => {
  const bookings = await Booking.find()
    .populate('resource')
    .populate('user', 'name email role department')
    .sort({ createdAt: -1 });
  res.json(bookings);
};

export const approveBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('user').populate('resource');
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  if (booking.status === 'approved') return res.status(400).json({ message: 'Booking is already approved' });

  if (await hasConflict(booking.resource._id, booking.startDate, booking.endDate, booking._id)) {
    return res.status(409).json({ message: 'Another pending or approved booking conflicts with this slot' });
  }

  booking.status = 'approved';
  booking.adminRemark = req.body.remark || 'Approved';
  await booking.save();
  await ApprovalLog.create({ booking: booking._id, admin: req.user._id, action: 'approved', remark: booking.adminRemark });
  await Notification.create({
    user: booking.user._id,
    title: 'Booking approved',
    message: `${booking.resource.title} has been approved.`
  });

  res.json(booking);
};

export const rejectBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('user').populate('resource');
  if (!booking) return res.status(404).json({ message: 'Booking not found' });

  booking.status = 'rejected';
  booking.adminRemark = req.body.remark || 'Rejected';
  await booking.save();
  await ApprovalLog.create({ booking: booking._id, admin: req.user._id, action: 'rejected', remark: booking.adminRemark });
  await Notification.create({
    user: booking.user._id,
    title: 'Booking rejected',
    message: `${booking.resource.title} was rejected. Remark: ${booking.adminRemark}`
  });

  res.json(booking);
};

export const checkAvailability = async (req, res) => {
  const { resource, startDate, endDate } = req.query;
  if (!resource || !startDate || !endDate) return res.status(400).json({ message: 'Missing query parameters' });
  const unavailable = await hasConflict(resource, new Date(startDate), new Date(endDate));
  res.json({ available: !unavailable });
};
