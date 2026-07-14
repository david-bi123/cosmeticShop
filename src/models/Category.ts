import { Schema, model, models, Model, Types } from 'mongoose';

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  parent?: Types.ObjectId | null;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String },
    image: { type: String },
    icon: { type: String },
    parent: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

categorySchema.pre('validate', function (this: ICategory & { slug?: string }) {
  if (this.slug) return;
  this.slug = (this.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
});

export const Category: Model<ICategory> = models.Category || model<ICategory>('Category', categorySchema);
