import { Schema, model, models, Model, Types } from 'mongoose';

export interface IProductVariant {
  size?: string;
  color?: string;
  shade?: string;
  weight?: string;
  stock?: number;
  image?: string;
  priceDelta?: number;
}

const productVariantSchema = new Schema<IProductVariant>({
  size: String,
  color: String,
  shade: String,
  weight: String,
  stock: { type: Number, default: 0 },
  image: String,
  priceDelta: { type: Number, default: 0 },
});

export interface IProductImage {
  url: string;
  publicId?: string;
}

const productImageSchema = new Schema<IProductImage>(
  {
    url: { type: String, required: true },
    publicId: { type: String },
  },
  { _id: false }
);

export interface IReview {
  user: Types.ObjectId;
  name: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

const reviewSchema = new Schema<IReview>({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  name: String,
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  category: Types.ObjectId | string;
  brand: Types.ObjectId | string;
  supplier?: Types.ObjectId | string;
  images: IProductImage[];
  price: number;
  costPrice: number;
  discountPrice?: number;
  sku: string;
  barcode: string;
  stock: number;
  lowStockThreshold: number;
  variants?: IProductVariant[];
  sizes?: string[];
  colors?: string[];
  shades?: string[];
  weight?: string;
  manufactureDate?: Date;
  expiryDate?: Date;
  rating?: number;
  ratingCount?: number;
  reviews?: IReview[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isActive?: boolean;
  views?: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true, index: 'text' },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String },
    shortDescription: { type: String },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true, index: true },
    supplier: { type: Schema.Types.ObjectId, ref: 'Supplier' },
    images: [productImageSchema],
    price: { type: Number, required: true, min: 0 },
    costPrice: { type: Number, min: 0, default: 0 },
    discountPrice: { type: Number, min: 0 },
    sku: { type: String, required: true, unique: true, index: true },
    barcode: { type: String, unique: true },
    stock: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 10 },
    variants: [productVariantSchema],
    sizes: [{ type: String }],
    colors: [{ type: String }],
    shades: [{ type: String }],
    weight: String,
    manufactureDate: Date,
    expiryDate: Date,
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    reviews: [reviewSchema],
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
    metaTitle: String,
    metaDescription: String,
  },
  { timestamps: true }
);

productSchema.pre('validate', function (this: IProduct & { slug?: string }) {
  if (this.slug) return;
  this.slug = (this.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
});

export const Product: Model<IProduct> = models.Product || model<IProduct>('Product', productSchema);
