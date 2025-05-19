import mongoose from 'mongoose';
export interface IOrderProduct {
     productId: mongoose.Types.ObjectId;
     name: string;
     quantity: number;
     price: number;
     totalAmount: number;
}
export interface IOrder {
     userId: mongoose.Types.ObjectId;
     orderId: string;
     userName: string;
     note: string;
     source: string;
     products: IOrderProduct[];
     orderBoxs: Number;
     totalAmount: number;
     commission: number;
     orderStatus: 'pending' | 'shipped' | 'delivered' | 'processing' | 'cancelled';
     shippingAddress: string;
}
