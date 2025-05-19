import mongoose, { Schema } from 'mongoose';
import { IReward, ILoyaltyProgram } from './loyalty.interface';

const rewardSchema = new Schema<IReward>({
     title: { type: String, required: true },
     description: { type: String, required: true },
     target: { type: Number, required: true },
     tier: { type: String, enum: ['Silver', 'Gold', 'Platinum'], required: true },
     isActive: { type: Boolean, default: true },
     isDeleted: { type: Boolean, default: false },
});

const loyaltyProgramSchema = new Schema<ILoyaltyProgram>({
     userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
     memberId: {
          type: String,
          default: function () {
               const randomNumber = Math.floor(100000 + Math.random() * 900000);
               return `MEMBER#${randomNumber}`;
          },
     },
     membershipTier: { type: String, enum: ['Silver', 'Gold', 'Platinum'], default: 'Silver' },
     totalSpent: { type: Number, default: 0 },
     memberSince: { type: Date, default: Date.now },
     rewardsRedeemed: [{ type: Schema.Types.ObjectId, ref: 'Reward' }],
});

loyaltyProgramSchema.pre('find', function (next) {
     this.find({ isDeleted: { $ne: true } });
     next();
});

loyaltyProgramSchema.pre('findOne', function (next) {
     this.find({ isDeleted: { $ne: true } });
     next();
});

loyaltyProgramSchema.pre('aggregate', function (next) {
     this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
     next();
});
rewardSchema.pre('find', function (next) {
     this.find({ isDeleted: { $ne: true } });
     next();
});

rewardSchema.pre('findOne', function (next) {
     this.find({ isDeleted: { $ne: true } });
     next();
});

rewardSchema.pre('aggregate', function (next) {
     this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
     next();
});

export const Reward = mongoose.model<IReward>('Reward', rewardSchema);
export const LoyaltyProgram = mongoose.model<ILoyaltyProgram>('LoyaltyProgram', loyaltyProgramSchema);
