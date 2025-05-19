import mongoose, { Schema } from 'mongoose';
import { ISalesRep } from './SalesRepsManagement.interface';

// SalesRep Schema
const salesRepSchema: Schema = new Schema(
     {
          salesRepName: {
               type: String,
               required: true,
          },
          email: {
               type: String,
               required: true,
               unique: true,
          },
          assignedRetailer: {
               type: [mongoose.Schema.Types.ObjectId],
               ref: 'User',
               default: [],
          },
          totalSales: {
               type: Number,
               required: true,
          },
          commission: {
               type: Number,
               required: true,
          },
     },
     {
          timestamps: true,
     },
);

// Create a Mongoose model
export const SalesRep = mongoose.model<ISalesRep>('SalesRep', salesRepSchema);
