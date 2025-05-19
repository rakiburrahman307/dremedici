import { Document, Types } from 'mongoose';

export interface IReward extends Document {
     _id: Types.ObjectId;
     title: string;
     description: string;
     target: number;
     tier: 'Silver' | 'Gold' | 'Platinum';
     isActive: boolean;
     isDeleted: boolean;
}

export interface ILoyaltyProgram extends Document {
     _id: Types.ObjectId;
     memberId: string;
     userId: Types.ObjectId;
     membershipTier: 'Silver' | 'Gold' | 'Platinum';
     totalSpent: number;
     memberSince: Date;
     rewardsRedeemed: Types.ObjectId[] | IReward[];
}
