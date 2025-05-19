import { StatusCodes } from 'http-status-codes';
import AppError from '../../../../../errors/AppError';
import { IProduct } from './inventory.interface';
import { Product } from './inventory.model';
import QueryBuilder from '../../../../builder/QueryBuilder';
import unlinkFile from '../../../../../shared/unlinkFile';
// create a new product
const createProduct = async (payload: IProduct) => {
     const result = await Product.create(payload);
     if (!result) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create product');
     }
     return result;
};
// get all products
const getAllProduct = async (query: Record<string, unknown>) => {
     const querBuilder = new QueryBuilder(Product.find({}), query);
     const products = await querBuilder.fields().filter().sort().paginate().search(['name', 'category']).modelQuery.exec();
     const meta = await querBuilder.countTotal();
     return {
          products,
          meta,
     };
};
// get single product
const getSingleProduct = async (id: string): Promise<IProduct | null> => {
     const result = await Product.findById(id);
     if (!result) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Failed to get product');
     }
     return result;
};
// update product
const updateProduct = async (id: string, payload: Partial<IProduct>): Promise<IProduct | null> => {
     const isExist: any = await Product.findById(id);
     if (!isExist) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Product not found');
     }
     if (payload.images && isExist.images) {
          isExist.images.map((image: string) => {
               unlinkFile(image);
          });
     }
     const result = await Product.findByIdAndUpdate(id, payload, { new: true });
     if (!result) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to update product');
     }
     return result;
};
// delete product
const deleteProduct = async (id: string): Promise<IProduct | null> => {
     const result = await Product.findByIdAndUpdate(id, { $set: { isDeleted: true } }, { new: true });
     if (!result) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to delete product');
     }
     return result;
};
const getProductMetrics = async () => {
     // Total Product Available: Aggregate to get total quantity of products
     const totalProducts = await Product.countDocuments({ isDeleted: false });
     const totalQuantity = await Product.aggregate([
          {
               $group: {
                    _id: null, // Group all the products together
                    total: { $sum: '$quantity' }, // Sum up the quantity field
               },
          },
     ]);

     // Low Stock Alert: Count how many products have quantity <= 5
     const lowStockCount = await Product.aggregate([
          {
               $match: { quantity: { $lte: 5 } }, // Only products with quantity <= 5
          },
          {
               $count: 'lowStockAlertCount', // Count matching documents
          },
     ]);

     // Stock Value: Calculate total stock value (quantity * price)
     const totalStockValue = await Product.aggregate([
          {
               $group: {
                    _id: null,
                    stockValue: { $sum: { $multiply: ['$quantity', '$price'] } }, // Calculate stock value
               },
          },
     ]);

     // Extract the results, defaulting to 0 if no result is returned
     const total = totalProducts ? totalProducts : 0;
     const totalQty = totalQuantity[0] ? totalQuantity[0].total : 0;
     const lowStock = lowStockCount[0] ? lowStockCount[0].lowStockAlertCount : 0;
     const stockValue = totalStockValue[0] ? totalStockValue[0].stockValue : 0;

     return {
          totalProductsAvailable: total,
          lowStockAlert: lowStock,
          stockValue: stockValue,
          totalQty: totalQty,
     };
};
const updateProductQuantity = async (id: string, quantity: number) => {
     const result = await Product.findByIdAndUpdate(id, { $inc: { quantity: quantity } }, { new: true });
     if (!result) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to update product');
     }
     return result;
};
export const ProductService = {
     createProduct,
     getAllProduct,
     getSingleProduct,
     updateProduct,
     deleteProduct,
     getProductMetrics,
     updateProductQuantity,
};
