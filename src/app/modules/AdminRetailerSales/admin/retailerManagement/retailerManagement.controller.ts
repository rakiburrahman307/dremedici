import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { RetailerService } from './retailerManagement.service';
import sendResponse from '../../../../../shared/sendResponse';
import catchAsync from '../../../../../shared/catchAsync';

const getAllRetailers = catchAsync(async (req, res) => {
     const result = await RetailerService.getAllRetailers(req.query);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Retailers retrieved successfully',
          data: result.result,
          pagination: result.meta,
     });
});

const getSingleRetailer = catchAsync(async (req, res) => {
     const result = await RetailerService.getSingleRetailer(req.params.id);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Retailer retrieved successfully',
          data: result,
     });
});

const createRetailer = catchAsync(async (req, res) => {
     const result = await RetailerService.createRetailer(req.body);
     sendResponse(res, {
          statusCode: StatusCodes.CREATED,
          success: true,
          message: 'Retailer created successfully',
          data: result,
     });
});

const updateRetailer = catchAsync(async (req, res) => {
     const result = await RetailerService.updateRetailer(req.params.id, req.body);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Retailer updated successfully',
          data: result,
     });
});

const deleteRetailer = catchAsync(async (req, res) => {
     const result = await RetailerService.deleteRetailer(req.params.id);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Retailer deleted successfully',
          data: result,
     });
});

export const RetailerController = {
     getAllRetailers,
     getSingleRetailer,
     createRetailer,
     updateRetailer,
     deleteRetailer,
};
