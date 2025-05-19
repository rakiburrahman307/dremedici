import mongoose from 'mongoose';
export interface ICard {
     cardHolderName: string;
     cardNumber: string;
     expiryDate: string;
     cvv: string;
     zipCode: string;
}
export interface IAddUser {
     name: string;
     email: string;
     address: string;
     card: ICard;
}
export interface ISalesRep {
     salesRepName: string;
     email: string;
     assignedRetailer: mongoose.Types.ObjectId[];
     totalSales: number;
     commission: number;
}
