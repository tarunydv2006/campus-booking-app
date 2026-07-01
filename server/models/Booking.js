import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resource: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    purpose: { type: String, required: true, trim: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    adminRemark: { type: String, default: '' }
  },
  { timestamps: true }
);

bookingSchema.index({ resource: 1, startDate: 1, endDate: 1, status: 1 });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
