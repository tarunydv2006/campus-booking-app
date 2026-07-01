import mongoose from 'mongoose';

const approvalLogSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, enum: ['approved', 'rejected'], required: true },
    remark: { type: String, default: '' }
  },
  { timestamps: true }
);

const ApprovalLog = mongoose.model('ApprovalLog', approvalLogSchema);
export default ApprovalLog;
