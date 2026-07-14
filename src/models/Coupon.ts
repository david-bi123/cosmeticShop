import { Schema, model, models, Model } from 'mongoose';

export interface ICoupon {
  _id: string;
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrder?: number;
  maxDiscount?: number;
  expiresAt?: Date;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, index: true },
    description: String,
    discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
    discountValue: { type: Number, required: true },
    minOrder: { type: Number, default: 0 },
    maxDiscount: Number,
    expiresAt: Date,
    usageLimit: Number,
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Coupon: Model<ICoupon> = models.Coupon || model<ICoupon>('Coupon', schema);
