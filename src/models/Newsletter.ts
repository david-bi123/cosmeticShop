import { Schema, model, models, Model } from 'mongoose';

export interface INewsletter {
  _id: string;
  email: string;
  subscribed: boolean;
  createdAt: Date;
}

const schema = new Schema<INewsletter>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  subscribed: { type: Boolean, default: true },
});

export const Newsletter: Model<INewsletter> = models.Newsletter || model<INewsletter>('Newsletter', schema);
