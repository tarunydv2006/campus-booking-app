import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['Labs', 'Seminar Halls', 'Projectors', 'Equipment', 'Classrooms']
    },
    capacity: { type: Number, default: 1, min: 1 },
    image: { type: String, default: '' },
    description: { type: String, required: true },
    features: [{ type: String, trim: true }],
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

const Resource = mongoose.model('Resource', resourceSchema);
export default Resource;
