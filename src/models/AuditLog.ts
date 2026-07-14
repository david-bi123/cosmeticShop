import { Schema, model, models, Model, Types } from 'mongoose';

export interface IAuditLog {
  _id: string;
  action: string;
  entity: string;
  entityId?: string;
  performedBy?: Types.ObjectId | string;
  performedByRole?: string;
  details?: string;
  ip?: string;
  createdAt: Date;
}

const schema = new Schema<IAuditLog>(
  {
    action: { type: String, required: true },
    entity: { type: String, required: true },
    entityId: String,
    performedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    performedByRole: String,
    details: String,
    ip: String,
  },
  { timestamps: true }
);

export const AuditLog: Model<IAuditLog> = models.AuditLog || model<IAuditLog>('AuditLog', schema);
