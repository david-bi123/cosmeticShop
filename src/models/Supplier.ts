import { Schema, model, models, Model, Types } from 'mongoose';

export interface ISupplier {
  _id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  productsSupplied?: number;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const supplierSchema = new Schema<ISupplier>(
  {
    name: { type: String, required: true, trim: true },
    contactPerson: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: String, required: true },
    city: { type: String, required: true },
    productsSupplied: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Supplier: Model<ISupplier> = models.Supplier || model<ISupplier>('Supplier', supplierSchema);
