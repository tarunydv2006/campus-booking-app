import Booking from '../models/Booking.js';
import Resource from '../models/Resource.js';

export const adminStats = async (req, res) => {
  const [totalResources, pendingBookings, approvedBookings, rejectedBookings, mostBookedResources, trend] =
    await Promise.all([
      Resource.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'approved' }),
      Booking.countDocuments({ status: 'rejected' }),
      Booking.aggregate([
        { $group: { _id: '$resource', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $lookup: { from: 'resources', localField: '_id', foreignField: '_id', as: 'resource' } },
        { $unwind: '$resource' },
        { $project: { title: '$resource.title', category: '$resource.category', count: 1 } }
      ]),
      Booking.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } },
        { $limit: 14 }
      ])
    ]);

  res.json({ totalResources, pendingBookings, approvedBookings, rejectedBookings, mostBookedResources, trend });
};

export const userStats = async (req, res) => {
  const [total, pending, approved, rejected] = await Promise.all([
    Booking.countDocuments({ user: req.user._id }),
    Booking.countDocuments({ user: req.user._id, status: 'pending' }),
    Booking.countDocuments({ user: req.user._id, status: 'approved' }),
    Booking.countDocuments({ user: req.user._id, status: 'rejected' })
  ]);
  res.json({ total, pending, approved, rejected });
};
