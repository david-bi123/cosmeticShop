import { Schema, model, models, Model } from 'mongoose';
import { UserRole } from '@/lib/constants';

export interface Address {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  region: string;
  landmark?: string;
  isDefault?: boolean;
}

const addressSchema = new Schema<Address>({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  region: { type: String, required: true },
  landmark: { type: String },
  isDefault: { type: Boolean, default: false },
});

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: (typeof UserRole)[keyof typeof UserRole];
  avatar?: string;
  addresses: Address[];
  emailVerified: boolean;
  emailVerifyToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  permissions?: string[];
  blocked?: boolean;
  notes?: string;
  totalSpent?: number;
  totalOrders?: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true, select: false },
    phone: { type: String, trim: true },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.CUSTOMER, index: true },
    avatar: { type: String },
    addresses: [addressSchema],
    emailVerified: { type: Boolean, default: false },
    emailVerifyToken: { type: String },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    permissions: [{ type: String }],
    blocked: { type: Boolean, default: false },
    notes: { type: String },
    totalSpent: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const User: Model<IUser> = models.User || model<IUser>('User', userSchema);
