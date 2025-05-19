import { StatusCodes } from 'http-status-codes';
import AppError from '../../../../../errors/AppError';
import { User } from '../../../user/user.model';
import Order from '../../admin/orderManagement/orderManagement.model';

const getMySales = async (userId: string, query: Record<string, unknown>) => {
     const isUserExist = await User.findById(userId);
     if (!isUserExist) {
          throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
     }

     if (!Array.isArray(isUserExist.assignedRetailers) || isUserExist.assignedRetailers.length === 0) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'User has no assigned retailers');
     }

     const yearsParam = query.years as string;
     if (!yearsParam) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Years parameter is required');
     }

     const years = yearsParam
          .split(',')
          .map(Number)
          .filter((y) => !isNaN(y));

     const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

     // MongoDB aggregation pipeline
     const salesData = await Order.aggregate([
          {
               $match: {
                    userId: { $in: isUserExist.assignedRetailers },
                    createdAt: {
                         $gte: new Date(`${Math.min(...years)}-01-01`),
                         $lte: new Date(`${Math.max(...years)}-12-31`),
                    },
               },
          },
          {
               $addFields: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
               },
          },
          {
               $match: {
                    year: { $in: years },
               },
          },
          {
               $group: {
                    _id: { year: '$year', month: '$month' },
                    totalSales: { $sum: '$totalAmount' },
               },
          },
          {
               $sort: { '_id.year': 1, '_id.month': 1 },
          },
     ]);

     // Initialize result with months and zero sales
     const result: Record<number, { month: string; sales: number }[]> = {};

     years.forEach((year) => {
          result[year] = monthNames.map((month) => ({
               month,
               sales: 0,
          }));
     });

     // Fill sales data from aggregation result
     salesData.forEach(({ _id, totalSales }) => {
          const year = _id.year;
          const monthIndex = _id.month - 1;
          if (result[year]) {
               result[year][monthIndex].sales = totalSales;
          }
     });

     return result;
};

export const MySalesService = { getMySales };
