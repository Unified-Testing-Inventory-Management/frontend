export type TRegisterUserData = {
  firstName: string
  lastName: string;
  username: string
  password: string
  role: string
}

export type TLoginUserData = {
    username: string;
    password: string;
}

export type User = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
}

// Type definitions for dashboard
export type Product = {
  Id: number
  ProductName: string
  Category: string
  Price: number
  StockQuantity: number
  LowStockLevel: number
  CreatedAt: string
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
  Id: number
  ProductName: string
  Current: number
  Min: number
  Status: 'Low' | 'Out'
}

// Helper functions
export const getProductStatus = (product: Product): 'In Stock' | 'Low Stock' | 'Out of Stock' => {
  if (product.StockQuantity === 0) return 'Out of Stock'
  if (product.StockQuantity <= product.LowStockLevel) return 'Low Stock'
  return 'In Stock'
}

export const getStockAlertStatus = (product: Product): 'Low' | 'Out' => {
  return product.StockQuantity === 0 ? 'Out' : 'Low'
}
