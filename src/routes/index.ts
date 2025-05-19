import express from 'express';
import { UserRouter } from '../app/modules/user/user.route';
import { AuthRouter } from '../app/modules/auth/auth.route';
import { ProductsRoutes } from '../app/modules/AdminRetailerSales/admin/inventoryManagement/inventory.routes';
import { SubscriptionRoutes } from '../app/modules/AdminRetailerSales/admin/subscription/subscription.route';
import { SubscriptionPurchaseRoutes } from '../app/modules/AdminRetailerSales/retailer/subscriptionPurchase/subscription.purchase.route';
import { RetailerDashboardRoutes } from '../app/modules/AdminRetailerSales/retailer/dashboard/dashboard.route';
import { SalesRepsManagementRouter } from '../app/modules/AdminRetailerSales/admin/SalesRepsManagement/SalesRepsManagement.route';
import { OrderRoutes } from '../app/modules/AdminRetailerSales/admin/orderManagement/orderManagement.routes';
import { CategoryRoutes } from '../app/modules/category/category.route';
import { RetailerRoutes } from '../app/modules/AdminRetailerSales/admin/retailerManagement/retailerManagement.route';
import { DashboardRoutes } from '../app/modules/AdminRetailerSales/admin/dashboard/dashboard.route';
import SettingsRouter from '../app/modules/sattings/sattings.route';
import { SalesRoutes } from '../app/modules/AdminRetailerSales/sales/myRetailers/myRetailers.route';
import { SubscriptionManageRouter } from '../app/modules/AdminRetailerSales/admin/subscriptionManagemant/subscriptionManagemant.router';
import { CommissionRouter } from '../app/modules/AdminRetailerSales/sales/commission/commission.router';
import { MySalesOrderRoutes } from '../app/modules/AdminRetailerSales/sales/myOrder/myOrder.route';
import { MySalesRoutes } from '../app/modules/AdminRetailerSales/sales/mySales/mySales.route';
import { LoyaltyRouter } from '../app/modules/AdminRetailerSales/admin/loyalty/loyalty.route';

const router = express.Router();
const routes = [
     {
          path: '/auth',
          route: AuthRouter,
     },
     {
          path: '/users',
          route: UserRouter,
     },
     {
          path: '/admin/inventory',
          route: ProductsRoutes,
     },
     {
          path: '/admin/subscription',
          route: SubscriptionRoutes,
     },
     {
          path: '/admin/subscription/managment',
          route: SubscriptionManageRouter,
     },
     {
          path: '/admin/category',
          route: CategoryRoutes,
     },
     {
          path: '/admin/repmanagement',
          route: SalesRepsManagementRouter,
     },
     {
          path: '/admin/retailer/managment',
          route: RetailerRoutes,
     },
     {
          path: '/admin/dashboard',
          route: DashboardRoutes,
     },
     {
          path: '/admin/orders/managment',
          route: OrderRoutes,
     },
     {
          path: '/admin/settings',
          route: SettingsRouter,
     },
     {
          path: '/retailer/subscription',
          route: SubscriptionPurchaseRoutes,
     },
     {
          path: '/retailer/dashboard',
          route: RetailerDashboardRoutes,
     },
     {
          path: '/sales/dashboard',
          route: SalesRoutes,
     },
     {
          path: '/sales/commission',
          route: CommissionRouter,
     },
     {
          path: '/sales/orders',
          route: MySalesOrderRoutes,
     },
     {
          path: '/sales',
          route: MySalesRoutes,
     },
     {
          path: '/retailer',
          route: LoyaltyRouter,
     },
     {
          path: '/admin/retailer',
          route: LoyaltyRouter,
     },
];

routes.forEach((element) => {
     if (element?.path && element?.route) {
          router.use(element?.path, element?.route);
     }
});

export default router;
