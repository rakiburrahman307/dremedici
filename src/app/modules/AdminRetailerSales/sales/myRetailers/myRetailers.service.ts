import { StatusCodes } from 'http-status-codes';
import AppError from '../../../../../errors/AppError';
import { User } from '../../../user/user.model';
import QueryBuilder from '../../../../builder/QueryBuilder';
import Order from '../../admin/orderManagement/orderManagement.model';
import mongoose from 'mongoose';
import { SubscriptionPurchase } from '../../retailer/subscriptionPurchase/subscription.purchase.model';
import { Product } from '../../admin/inventoryManagement/inventory.model';
interface IUserOrderSummary {
     name?: string;
     phone: string;
     address?: string;
     card?: {
          cardHolderName: string;
          cardNumber: string;
          expiryDate: string;
          cvv: string;
          zipCode: string;
     };
}
const getMyRetailers = async (userId: string, query: Record<string, unknown>) => {
     // Find the user by id
     const user = await User.findById(userId);
     if (!user) {
          throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
     }

     // assignedRetailers is array of ObjectIds
     const assignedRetailers = user.assignedRetailers || [];

     // If no assigned retailers, return empty result early
     if (assignedRetailers.length === 0) {
          return {
               meta: { total: 0, page: 1, limit: 10, totalPage: 0 },
               assignedRetailers: [],
          };
     }

     // Query the assigned retailers directly by their _id
     const queryBuilder = new QueryBuilder(User.find({ _id: { $in: assignedRetailers } }), query);

     const assignedRetailersData = await queryBuilder.search(['name', 'email']).filter().sort().paginate().modelQuery.exec();

     const meta = await queryBuilder.countTotal();

     return {
          meta,
          assignedRetailers: assignedRetailersData,
     };
};
const getSingleRetailer = async (id: string) => {
     const result = await User.findById(id);
     if (!result) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Retailer not found');
     }
     return result;
};
const getAnalysis = async (userId: string) => {
     // Find the user by id
     const id = new mongoose.Types.ObjectId(userId);
     const totalOrders = await Order.aggregate([
          {
               $match: {
                    userId: id,
               },
          },
          {
               $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: '$totalAmount' },
               },
          },
     ]);
     return totalOrders[0];
};
const getOrders = async (userId: string, query: Record<string, unknown>) => {
     const queryBuilder = new QueryBuilder(
          Order.find({ userId }).populate({
               path: 'userId',
               select: 'name email',
               populate: {
                    path: 'assignedSalesRep',
                    select: 'name email',
               },
          }),
          query,
     );
     const orders = await queryBuilder.search(['orderId']).filter().sort().paginate().modelQuery.exec();
     const meta = await queryBuilder.countTotal();
     return { orders, meta };
};
const getSingleOrder = async (orderId: string) => {
     const result = await Order.findById(orderId)
          .populate('products.productId', 'name image')

          .populate({
               path: 'userId',
               select: 'name email',
               populate: {
                    path: 'assignedSalesRep',
                    select: 'name email',
               },
          });
     const findProduct = result?.products.map((product) => product.productId);
     const getProducts = await Product.find({ _id: { $in: findProduct } });
     console.log(getProducts);

     if (!result) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Order not found');
     }

     return result;
};
const getRetailerInfo = async (userId: string) => {
     const result = await User.findById(userId).populate('assignedSalesRep', 'name email');
     if (!result) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Retailer not found');
     }
     const getCard = await SubscriptionPurchase.findOne({ userId });
     if (!getCard) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Card not found');
     }
     const getTotalOrders = await Order.countDocuments({ userId });

     const totalSales = await Order.aggregate([
          {
               $match: {
                    userId: new mongoose.Types.ObjectId(userId),
               },
          },
          {
               $group: {
                    _id: null,
                    totalSales: { $sum: '$totalAmount' },
               },
          },
     ]);
     const totalSalesAmount = totalSales.length > 0 ? totalSales[0].totalSales : 0;

     const data = {
          totalSales: totalSalesAmount,
          totalOrders: getTotalOrders,
          card: getCard.card,
          retailerInfo: result,
     };
     return data;
};
const updateRetailerInfo = async (userId: string, payload: Partial<IUserOrderSummary>) => {
     const { card } = payload;
     if (card) {
          const { cardHolderName, cardNumber, expiryDate, cvv, zipCode } = card;
          if (!cardHolderName || !cardNumber || !expiryDate || !cvv || !zipCode) {
               throw new AppError(StatusCodes.BAD_REQUEST, 'Card information is missing');
          }
     }

     const result = await User.findByIdAndUpdate(userId, payload, {
          new: true,
     });
     const updateCardInfo = await SubscriptionPurchase.findOneAndUpdate({ userId }, { card }, { new: true });
     if (!updateCardInfo) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Card not found');
     }
     if (!result) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Retailer not found');
     }
     return result;
};
export const MyRetailersService = {
     getMyRetailers,
     getSingleRetailer,
     getAnalysis,
     getOrders,
     getSingleOrder,
     getRetailerInfo,
     updateRetailerInfo,
};
