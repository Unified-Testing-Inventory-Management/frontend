import type { Product, SaleDetail, Sale } from '@/@types'
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
  const [sales, setSales] = useState<Sale[] | []>([])
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


export const saleDetails: SaleDetail[] = [
  { id: 1, saleId: 1, productId: 1, quantity: 1, price: 1299.99 },
  { id: 2, saleId: 2, productId: 2, quantity: 1, price: 29.99 },
  { id: 3, saleId: 3, productId: 3, quantity: 1, price: 149.99 },
  { id: 4, saleId: 4, productId: 4, quantity: 1, price: 399.99 },
  { id: 5, saleId: 5, productId: 6, quantity: 1, price: 79.99 },
]
