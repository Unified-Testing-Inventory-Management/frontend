export type TRegisterUserData = {
  firstName: string
  lastName: string
  username: string
  password: string
  role: string
}

export type TLoginUserData = {
  username: string
  password: string
}

export type User = {
  id: string
  username: string
  firstName: string
  lastName: string
  role: string
}

// Type definitions for dashboard
export type Product = {
  id: number
  productName: string
  category: string
  price: number
  stockQuantity: string
  createdAt: string
  lowStockLevel: number
  barCode: string
}

export type Sale = {
  Id: number
  UserId: number
  SaleDate: string
  TotalAmount: number
}

export type SaleDetail = {
  Id: number
  SaleId: number
  ProductId: number
  Quantity: number
  Price: number
  ProductName?: string
}

export type SaleWithDetails = Sale & {
  Items: SaleDetail[]
}

export type StockAlert = {
  id: number
  productName: string
  current: number
  min: number
  status: 'Low' | 'Out'
}

// Helper functions
export const getProductStatus = (
  product: Product,
): 'In Stock' | 'Low Stock' | 'Out of Stock' => {
  if (Number(product.stockQuantity) === 0) return 'Out of Stock'
  if (Number(product.stockQuantity) <= product.lowStockLevel) return 'Low Stock'
  return 'In Stock'
}

export const getStockAlertStatus = (product: Product): 'Low' | 'Out' => {
  return Number(product.stockQuantity) === 0 ? 'Out' : 'Low'
}
