import mongoose from 'mongoose';
import { IProduct } from './inventory.interface';

const productSchema = new mongoose.Schema<IProduct>(
     {
          name: {
               type: String,
               required: true,
          },
          category: {
               type: String,
               required: true,
          },
          totalInventoryValue: {
               type: Number,
               required: true,
          },
          quantity: {
               type: Number,
               required: true,
          },
          price: {
               type: Number,
               required: true,
          },
          images: {
               type: [String],
               required: true,
               default: [],
          },
          lowStockAlert: {
               type: Boolean,
               default: false,
          },
          isDeleted: {
               type: Boolean,
               default: false,
          },
     },
     {
          timestamps: true,
     },
);
// Query Middleware
productSchema.pre('find', function (next) {
     this.find({ isDeleted: { $ne: true } });
     next();
});

productSchema.pre('findOne', function (next) {
     this.find({ isDeleted: { $ne: true } });
     next();
});

productSchema.pre('aggregate', function (next) {
     this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
     next();
});
export const Product = mongoose.model('Product', productSchema);
