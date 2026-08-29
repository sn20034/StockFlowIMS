import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    type: { type: String, enum: ['in', 'out'], required: true },
    quantity: { type: Number, required: true, min: 1 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    notes: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Transaction', transactionSchema);
