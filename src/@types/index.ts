export type User = {
  id: string
  username: string
  firstName: string
  lastName: string
  password: string
  role: string
}

export type TFilterStatus = 'All' | 'In Stock' | 'Low Stock' | 'Out of Stock'

export type TRegisterUserData = Omit<User, "id" | "role"> & {
  confirmPassword: string
}

export type TLoginUserData = Pick<User, "username" | "password">

export type TUpdateUserData = Pick<User, "firstName" | "lastName" | "username">

// Type definitions for dashboard
export type Product = {
  [x: string]: any
  id: string | number
  image: File | null | string
  productName: string
  category: string
  price: number
  stockQuantity: number
  createdAt: string
  updatedAt: string
  barCode: string
  userId?: string
}

export type ArchiveProductsData = Product & {
  productId: string,
  userId: string
  category: string,
  price: number,
  stockQuantity: number,
  deletedAt: string
}

export type TransactionData = Omit<Product, "barCode" | "createdAt" | "updatedAt" | "id" | "image" | "stockQuantity"> & {
  productId: string,
  totalAmount: number,
  quantity: number,
  price: number
}

export type UpdateProductData = {
  id: string | number;
  data: Omit<Product, "id" | "createdAt" | "barCode" | "image" | "updatedAt">
}

export type Sale = {
  id: number
  userId: number
  saleDate: string
  totalAmount: number
}

export type SaleDetail = {
  id: number
  saleId: number
  productId: number
  quantity: number
  price: number
  productName: string
  category: string
}

export type SaleWithDetails = Sale & {
  saleDetails: SaleDetail[]
}

export type StockAlert = {
  id: number
  productName: string
  current: number
  minimum: number
  status: 'Low' | 'Out'
}

// Helper functions
export const getProductStatus = (
  product: Product,
): 'In Stock' | 'Low Stock' | 'Out of Stock' => {
  if (Number(product.stockQuantity) === 0) return 'Out of Stock'
  if (Number(product.stockQuantity) <= 5) return 'Low Stock'
  return 'In Stock'
}

export const getStockAlertStatus = (product: Product): 'Low' | 'Out' => {
  return Number(product.stockQuantity) === 0 ? 'Out' : 'Low'
}

export type TProductInSights = Pick<Product, "productName" | "stockQuantity"> & {
  productId: string;
  userId: string;
  status: string
  message: string
}
