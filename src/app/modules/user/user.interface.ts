import mongoose, { Model } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';
export type IUser = {
     name: string;
     role: USER_ROLES;
     email: string;
     password: string;
     image?: string;
     isDeleted: boolean;
     address: string;
     phone: string;
     language: string;
     assignedSalesRep: mongoose.Types.ObjectId;
     assignedRetailers: mongoose.Types.ObjectId[];
     status: 'active' | 'blocked';
     verified: boolean;
     verifiedByAdmin: boolean;
     authentication?: {
          isResetPassword: boolean;
          oneTimeCode: number;
          expireAt: Date;
     };
};

export type UserModel = {
     isExistUserById(id: string): any;
     isExistUserByEmail(email: string): any;
     isExistUserByPhone(contact: string): any;
     isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;
