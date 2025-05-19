import { populate } from 'dotenv';
import { USER_ROLES } from '../../../../../enums/user';
import QueryBuilder from '../../../../builder/QueryBuilder';
import { User } from '../../../user/user.model';
import Order from '../orderManagement/orderManagement.model';

const getTopPerformerSalesRep = async (query: Record<string, unknown>) => {
     // Parse page and limit safely from query, default to 1 and 10
     const page = query.page ? parseInt(query.page as string, 10) : 1;
     const limit = query.limit ? parseInt(query.limit as string, 10) : 10;
     const skip = (page - 1) * limit;

     const topPerformingSalesReps = await User.aggregate([
          { $match: { role: USER_ROLES.SALES } },
          {
               $lookup: {
                    from: 'orders', // your orders collection name
                    let: { assignedRetailers: '$assignedRetailers' },
                    pipeline: [
                         { $match: { $expr: { $in: ['$userId', '$$assignedRetailers'] } } },
                         { $group: { _id: null, totalSales: { $sum: '$totalAmount' } } },
                    ],
                    as: 'salesData',
               },
          },
          {
               $addFields: {
                    totalSales: { $ifNull: [{ $arrayElemAt: ['$salesData.totalSales', 0] }, 0] },
               },
          },
          { $sort: { totalSales: -1 } },
          { $skip: skip },
          { $limit: limit },
          {
               $project: {
                    name: 1,
                    email: 1,
                    totalSales: 1,
                    assignedRetailers: 1,
                    image: 1,
               },
          },
     ]);

     // Total count of sales reps (no pagination)
     const totalSalesReps = await User.countDocuments({ role: USER_ROLES.SALES });

     return {
          total: totalSalesReps,
          page,
          limit,
          totalPages: Math.ceil(totalSalesReps / limit),
          data: topPerformingSalesReps,
     };
};
const getAllOrders = async (query: Record<string, unknown>) => {
     const queryBuilder = new QueryBuilder(
          Order.find().populate({
               path: 'userId',
               select: 'name email',
               populate: {
                    path: 'assignedSalesRep', // nested populate of assignedSalesRep inside userId
                    select: 'name email',
               },
          }),
          query,
     );

     // Execute query builder methods
     let ordersQuery = queryBuilder.search(['orderId', 'userId.name']).filter().sort().paginate().modelQuery;

     //   // Populate userId with name and email
     //   ordersQuery = ordersQuery;

     const orders = await ordersQuery.exec();
     const meta = await queryBuilder.countTotal();

     return {
          meta,
          orders,
     };
};
const getTotalAnalysis = async () => {
     // Aggregate total sales, orders, commission for retailers
     const analysis = await Order.aggregate([
          {
               $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user',
               },
          },
          { $unwind: '$user' },
          { $match: { 'user.role': USER_ROLES.RETAILER } },
          {
               $addFields: {
                    commission: { $multiply: ['$totalAmount', 0.1] },
               },
          },
          {
               $group: {
                    _id: null,
                    totalSales: { $sum: '$totalAmount' },
                    totalOrders: { $sum: 1 },
                    totalCommission: { $sum: '$commission' },
               },
          },
     ]);

     const totalRetailers = await User.countDocuments({ role: USER_ROLES.RETAILER });

     return {
          totalSales: analysis[0]?.totalSales || 0,
          totalOrders: analysis[0]?.totalOrders || 0,
          totalCommission: analysis[0]?.totalCommission || 0,
          totalRetailers: totalRetailers || 0,
     };
};

const getMonthlyRevenueAllMonths = async () => {
     try {
          const monthlyRevenue = await Order.aggregate([
               {
                    $match: {
                         orderStatus: { $ne: 'canceled' },
                         createdAt: {
                              $gte: new Date(new Date().getFullYear(), 0, 1),
                              $lt: new Date(new Date().getFullYear() + 1, 0, 1),
                         },
                    },
               },
               {
                    $group: {
                         _id: { month: { $month: '$createdAt' } },
                         totalRevenue: { $sum: '$totalAmount' },
                    },
               },
               {
                    $project: {
                         _id: 0,
                         month: '$_id.month',
                         totalRevenue: 1,
                    },
               },
          ]);

          // Full months array
          const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

          // Create result with all months, fill missing with 0
          const fullMonthlyRevenue = months.map((monthName, index) => {
               const monthNumber = index + 1;
               const found = monthlyRevenue.find((m) => m.month === monthNumber);
               return {
                    month: monthName,
                    totalRevenue: found ? found.totalRevenue : 0,
               };
          });

          return fullMonthlyRevenue;
     } catch (error) {
          console.error('Error fetching monthly revenue:', error);
          return [];
     }
};

export const DashboardSearvice = {
     getTopPerformerSalesRep,
     getAllOrders,
     getTotalAnalysis,
     getMonthlyRevenueAllMonths,
};
