export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
}

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OUT_OF_STOCK = 'out_of_stock',
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  SHIPPING = 'shipping',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RETURNED = 'returned',
}

export enum PaymentStatus {
  UNPAID = 'unpaid',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  COD = 'cod',
  BANK_TRANSFER = 'bank_transfer',
  VNPAY = 'vnpay',
  MOMO = 'momo',
  PAYPAL = 'paypal',
}

export enum CouponType {
  PERCENT = 'percent',
  FIXED = 'fixed',
  FREE_SHIPPING = 'free_shipping',
}

export enum NotificationType {
  SYSTEM = 'system',
  ORDER = 'order',
  PAYMENT = 'payment',
  PROMOTION = 'promotion',
  INVENTORY = 'inventory',
}

export enum ContactStatus {
  NEW = 'new',
  PROCESSING = 'processing',
  RESOLVED = 'resolved',
}

export enum InventoryLogType {
  IMPORT = 'import',
  EXPORT = 'export',
  ADJUST = 'adjust',
  ORDER = 'order',
  RETURN = 'return',
}

export enum SettingValueType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  JSON = 'json',
}
