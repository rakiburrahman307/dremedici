export interface IProduct {
     name: string;
     category: string;
     quantity: number;
     price: number;
     totalInventoryValue: number;
     images: string[];
     lowStockAlert: boolean;
     isDeleted: boolean;
}
