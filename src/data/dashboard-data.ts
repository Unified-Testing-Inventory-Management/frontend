import type { Product, SaleWithDetails, SaleDetail, Sale } from '@/@types'
import { useAllProductsQuery } from '@/services/product_services'
import { useAllProductSalesQuery } from '@/services/sale_services'
import { useEffect, useState } from 'react'

export const useProducts = () => {
  const [products, setProducts] = useState<Product[] | []>([])
  const { data, isLoading, error } = useAllProductsQuery()

  useEffect(() => {
    setProducts(data?.data || [])
  }, [data])

  return {
    products,
    isLoading,
    error,
  }
}

export const useProductSales = () => {
  const [sales, setSales] = useState<SaleWithDetails[] | []>([])
  const { data, isLoading, error } = useAllProductSalesQuery();

  useEffect(() => {
    setSales(data?.data || [])
  }, [data])

  return {
    sales,
    isLoading,
    error
  }
}


export const sales: Sale[] = [
  { Id: 1, UserId: 1, SaleDate: '2024-01-15', TotalAmount: 1299.99 },
  { Id: 2, UserId: 2, SaleDate: '2024-01-15', TotalAmount: 29.99 },
  { Id: 3, UserId: 3, SaleDate: '2024-01-14', TotalAmount: 149.99 },
  { Id: 4, UserId: 4, SaleDate: '2024-01-14', TotalAmount: 399.99 },
  { Id: 5, UserId: 5, SaleDate: '2024-01-13', TotalAmount: 79.99 },
]

export const saleDetails: SaleDetail[] = [
  { Id: 1, SaleId: 1, ProductId: 1, Quantity: 1, Price: 1299.99 },
  { Id: 2, SaleId: 2, ProductId: 2, Quantity: 1, Price: 29.99 },
  { Id: 3, SaleId: 3, ProductId: 3, Quantity: 1, Price: 149.99 },
  { Id: 4, SaleId: 4, ProductId: 4, Quantity: 1, Price: 399.99 },
  { Id: 5, SaleId: 5, ProductId: 6, Quantity: 1, Price: 79.99 },
]
