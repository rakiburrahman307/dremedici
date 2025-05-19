import mongoose from 'mongoose';
import generateOrderNumber from '../../../../../utils/genarateOrderNumber';
import { IOrder, IOrderProduct } from './orderManagement.interface';
const orderProductsSchema = new mongoose.Schema<IOrderProduct>({
     productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
     },
     name: {
          type: String,
          required: true,
     },
     quantity: {
          type: Number,
          required: true,
     },
     totalAmount: {
          type: Number,
          required: true,
     },
     price: {
          type: Number,
          required: true,
     },
});
const orderSchema = new mongoose.Schema<IOrder>(
     {
          userId: {
               type: mongoose.Schema.Types.ObjectId,
               ref: 'User',
               required: true,
          },
          orderId: {
               type: String,
               default: () => generateOrderNumber('ODR'),
               unique: true,
          },
          note: {
               type: String,
               required: false,
          },
          products: [orderProductsSchema], // Array of products in the order
          source: {
               type: String,
               required: true, // Retailer, Supplier, etc.
          },
          orderBoxs: {
               type: Number,
               required: true,
          },
          totalAmount: {
               type: Number,
               required: true,
          },
          commission: {
               type: Number,
               default: 10,
          },
          orderStatus: {
               type: String,
               enum: ['pending', 'shipped', 'delivered', 'canceled'],
               default: 'pending', // Default order status is 'Pending'
          },
          shippingAddress: {
               type: String,
               required: true, // Full shipping address for delivery
          },
     },
     {
          timestamps: true, // Automatically adds createdAt and updatedAt
     },
);

// Create the model
const Order = mongoose.model('Order', orderSchema);

export default Order;
