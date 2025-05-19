import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../../../shared/catchAsync';
import sendResponse from '../../../../../shared/sendResponse';
import { SalesRepsManagementService } from './SalesRepsManagement.service';

const getSalesRep = catchAsync(async (req, res) => {
     const result = await SalesRepsManagementService.getSalesReps(req.query);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Sales rep retrieved successfully',
          data: result.result,
          pagination: result.meta,
     });
});
const getSalesRepById = catchAsync(async (req, res) => {
     const { id } = req.params;
     const result = await SalesRepsManagementService.getSalesRepsById(id);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Reps retrieved successfully',
          data: result,
     });
});
const getUnaprovedSalesRep = catchAsync(async (req, res) => {
     const result = await SalesRepsManagementService.getUnapprovedSalesReps(req.query);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Unapproved sales rep retrieved successfully',
          data: result.result,
          pagination: result.meta,
     });
});
const aprovedSalesRepByAdmin = catchAsync(async (req, res) => {
     const { id } = req.params;
     const result = await SalesRepsManagementService.aprovedSalesRepByAdmin(id);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Sales rep aproved successfully',
          data: result,
     });
});
const getUnassignRetailer = catchAsync(async (req, res) => {
     const result = await SalesRepsManagementService.getUnassignRetailer();
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Sales rep added successfully',
          data: result,
     });
});
const addSalesRepByAdmin = catchAsync(async (req, res) => {
     const result = await SalesRepsManagementService.addedSalesRep(req.body);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Sales rep added successfully',
          data: result,
     });
});
const salesRepAnalysis = catchAsync(async (req, res) => {
     const result = await SalesRepsManagementService.salesRepAnalysis(req.params.id);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Sales rep analysis retrieved successfully',
          data: result,
     });
});
const salesRepRetailers = catchAsync(async (req, res) => {
     const result = await SalesRepsManagementService.getSalesRepRetailers(req.params.id, req.query);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Sales rep retailer retrieved successfully',
          data: result,
     });
});
const salesRepCommission = catchAsync(async (req, res) => {
     const result = await SalesRepsManagementService.getSalesRepCommission(req.params.id, req.query);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Sales rep retailer retrieved successfully',
          data: result,
     });
});
const addRetailerToSalesRep = catchAsync(async (req, res) => {
     const result = await SalesRepsManagementService.addRetailerToSalesRep(req.params.id, req.body);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Sales rep retailer retrieved successfully',
          data: result,
     });
});
const getRetailerToSalesRep = catchAsync(async (req, res) => {
     const result = await SalesRepsManagementService.getRetailerDetails(req.params.id);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Retailer retrieved successfully',
          data: result,
     });
});
const removeRetailerFromSales = catchAsync(async (req, res) => {
     const { salesId } = req.body;
     const result = await SalesRepsManagementService.removeRetailerFromSales(salesId, req.params.id);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Retailer retrieved successfully',
          data: result,
     });
});
const deleteSaleasRep = catchAsync(async (req, res) => {
     const result = await SalesRepsManagementService.deleteSalesRep(req.params.id);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Sales rep deleted successfully',
          data: result,
     });
});

export const SalesRepsManagementController = {
     getUnaprovedSalesRep,
     aprovedSalesRepByAdmin,
     addSalesRepByAdmin,
     getSalesRep,
     getSalesRepById,
     getUnassignRetailer,
     salesRepAnalysis,
     salesRepRetailers,
     salesRepCommission,
     addRetailerToSalesRep,
     getRetailerToSalesRep,
     removeRetailerFromSales,
     deleteSaleasRep,
};
