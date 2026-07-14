export const UserRole = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  STAFF: 'staff',
  CUSTOMER: 'customer',
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

export const OrderStatus = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  PROCESSING: 'processing',
  PACKED: 'packed',
  READY: 'ready',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const;

export type OrderStatusType = (typeof OrderStatus)[keyof typeof OrderStatus];

export const ORDER_STATUS_LABELS: Record<OrderStatusType, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  processing: 'Processing',
  packed: 'Packed',
  ready: 'Ready for Pickup',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

export const ORDER_STATUS_COLORS: Record<OrderStatusType, string> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  accepted: 'bg-blue-100 text-blue-800 border-blue-200',
  processing: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  packed: 'bg-purple-100 text-purple-800 border-purple-200',
  ready: 'bg-teal-100 text-teal-800 border-teal-200',
  delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  cancelled: 'bg-rose-100 text-rose-800 border-rose-200',
  refunded: 'bg-slate-100 text-slate-800 border-slate-200',
};

export const PaymentMethod = {
  MOBILE_MONEY: 'mobile_money',
  CASH_ON_DELIVERY: 'cash_on_delivery',
} as const;

export type PaymentMethodType = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export const PaymentStatus = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

export type PaymentStatusType = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethodType, string> = {
  mobile_money: 'Mobile Money',
  cash_on_delivery: 'Cash on Delivery',
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatusType, string> = {
  pending: 'Pending',
  paid: 'Paid',
  failed: 'Failed',
  refunded: 'Refunded',
};

export const StaffPermissions = {
  MANAGE_PRODUCTS: 'manage_products',
  MANAGE_ORDERS: 'manage_orders',
  MANAGE_CUSTOMERS: 'manage_customers',
  MANAGE_INVENTORY: 'manage_inventory',
  VIEW_REPORTS: 'view_reports',
  MANAGE_STAFF: 'manage_staff',
} as const;

export type StaffPermission = (typeof StaffPermissions)[keyof typeof StaffPermissions];

export const ALL_PERMISSIONS: StaffPermission[] = Object.values(StaffPermissions);
