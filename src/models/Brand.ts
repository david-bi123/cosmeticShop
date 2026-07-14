import { Schema, model, models, Model } from 'mongoose';

export interface IBrand {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  country?: string;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const brandSchema = new Schema<IBrand>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String },
    logo: { type: String },
    country: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

brandSchema.pre('validate', function (this: IBrand & { slug?: string }) {
  if (this.slug) return;
  this.slug = (this.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
});

export const Brand: Model<IBrand> = models.Brand || model<IBrand>('Brand', brandSchema);
