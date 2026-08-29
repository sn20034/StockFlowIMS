import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, trim: true, uppercase: true },
    description: { type: String, trim: true, default: '' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    quantity: { type: Number, required: true, default: 0, min: 0 },
    unitPrice: { type: Number, required: true, default: 0, min: 0 },
    reorderThreshold: { type: Number, required: true, default: 10, min: 0 },
    image: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

productSchema.virtual('stockValue').get(function () {
  return this.quantity * this.unitPrice;
});

productSchema.virtual('stockStatus').get(function () {
  if (this.quantity <= 0) return 'Out of Stock';
  if (this.quantity < this.reorderThreshold) return 'Low Stock';
  return 'In Stock';
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

export default mongoose.model('Product', productSchema);
