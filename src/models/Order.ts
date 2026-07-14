import { Schema, model, models, Model, Types } from 'mongoose';

export interface IOrderItem {
  product: Types.ObjectId | string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant?: { size?: string; color?: string; shade?: string; weight?: string };
  sku: string;
}

const orderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  image: String,
  price: Number,
  quantity: Number,
  variant: { size: String, color: String, shade: String, weight: String },
  sku: String,
});

export interface IOrder {
  _id: string;
  orderNumber: string;
  customer: Types.ObjectId | string;
  customerName?: string;
  customerPhone?: string;
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  paymentRef?: string;
  coupon?: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    region: string;
    landmark?: string;
  };
  notes?: string;
  trackingNumber?: string;
  deliveredAt?: Date;
  history?: { status: string; at: Date; by: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    customer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    customerName: String,
    customerPhone: String,
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'processing', 'packed', 'ready', 'delivered', 'cancelled', 'refunded'],
      default: 'pending',
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ['mobile_money', 'cash_on_delivery'],
      default: 'cash_on_delivery',
    },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    paymentRef: String,
    coupon: String,
    shippingAddress: {
      fullName: String,
      phone: String,
      street: String,
      city: String,
      region: String,
      landmark: String,
    },
    notes: String,
    trackingNumber: String,
    deliveredAt: Date,
    history: [{ status: String, at: Date, by: String }],
  },
  { timestamps: true }
);

export const Order: Model<IOrder> = models.Order || model<IOrder>('Order', orderSchema);
