import mongoose from 'mongoose';
// Define the Card interface for TypeScript
export interface ICard {
     cardHolderName: string;
     cardNumber: string;
     expiryDate: string;
     cvv: string;
     zipCode: string;
}
export interface ISubscriptionPurchase {
     userId: mongoose.Schema.Types.ObjectId;
     tier: string;
     subscription: string;
     freeShipping: string;
     noCreditCardFee: string;
     exclusiveProducts: string;
     limitedReleases: string;
     card: ICard;
     termsAndConditionsAccepted: boolean;
     termsAndConditions: string;
     billingDate: Date;
     status: string;
}
