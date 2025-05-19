import { Request, Response } from 'express';

import catchAsync from '../../../../../shared/catchAsync';
import sendResponse from '../../../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { ProductService } from './inventory.service';

const createProduct = catchAsync(async (req: Request, res: Response) => {
     const result = await ProductService.createProduct(req.body);
     sendResponse(res, {
          statusCode: StatusCodes.CREATED,
          success: true,
          message: 'Product created successfully',
          data: result,
     });
});

const getAllProduct = catchAsync(async (req: Request, res: Response) => {
     const result = await ProductService.getAllProduct(req.query);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Product retrieved successfully',
          data: result.products,
          pagination: result.meta,
     });
});

const getSingleProduct = catchAsync(async (req: Request, res: Response) => {
     const result = await ProductService.getSingleProduct(req.params.id);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Product retrieved successfully',
          data: result,
     });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
     const result = await ProductService.updateProduct(req.params.id, req.body);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Product updated successfully',
          data: result,
     });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
     const result = await ProductService.deleteProduct(req.params.id);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Product deleted successfully',
          data: result,
     });
});
const getProductTotalAnalysis = catchAsync(async (req, res) => {
     const result = await ProductService.getProductMetrics();
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Product analysis successfully',
          data: result,
     });
});
const updateProductQuantity = catchAsync(async (req, res) => {
     const { quantity } = req.body;
     const result = await ProductService.updateProductQuantity(req.params.id, quantity);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Product quantity updated successfully',
          data: result,
     });
});
export const ProductController = {
     createProduct,
     getAllProduct,
     getSingleProduct,
     updateProduct,
     deleteProduct,
     getProductTotalAnalysis,
     updateProductQuantity,
};
