export type Product = {
  id: string
  name: string
  price: number
  discount: number // percentage 0-100
  description: string
  stock: number
  image: string
  gallery?: string[]
  brand?: string
}

export type CartItem = {
  productId: string
  quantity: number
}

export type Address = {
  fullName: string
  mobile: string
  address: string
  city: string
  state: string
  pincode: string
}

export type PaymentMethod = "online" | "upi" | "netbanking"

export type PaymentStatus = "paid" | "pending" | "failed"

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Shipped"
  | "Delivered"
  | "Cancelled"

export type OrderLine = {
  productId: string
  name: string
  image: string
  price: number // unit price after discount
  quantity: number
}

export type Order = {
  id: string
  createdAt: number
  items: OrderLine[]
  amount: number
  address: Address
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  orderStatus: OrderStatus
  razorpayOrderId?: string
  razorpayPaymentId?: string
}

export type UserProfile = {
  name: string
  email: string
  phone: string
} | null

export const ORDER_STATUSES: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
]

export function discountedPrice(p: Product): number {
  if (!p.discount) return p.price
  return Math.round(p.price * (1 - p.discount / 100))
}
