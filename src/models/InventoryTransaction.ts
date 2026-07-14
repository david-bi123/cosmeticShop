import { Schema, model, models, Model, Types } from 'mongoose';

export interface IInventoryTransaction {
  _id: string;
  product: Types.ObjectId | string;
  type: 'purchase' | 'adjustment' | 'restock' | 'damage' | 'return' | 'sale';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason?: string;
  performedBy: Types.ObjectId | string;
  createdAt: Date;
}

const schema = new Schema<IInventoryTransaction>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    type: {
      type: String,
      enum: ['purchase', 'adjustment', 'restock', 'damage', 'return', 'sale'],
      required: true,
    },
    quantity: { type: Number, required: true },
    previousStock: { type: Number, required: true },
    newStock: { type: Number, required: true },
    reason: String,
    performedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const InventoryTransaction: Model<IInventoryTransaction> =
  models.InventoryTransaction || model<IInventoryTransaction>('InventoryTransaction', schema);
