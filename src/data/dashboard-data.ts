import type { Product, SaleDetail, SaleWithDetails } from './../@types/index';
import { useAllProductsQuery, useSearchProducts } from '@/services/product_services'
import { useAllProductSalesQuery, useSearchSaleProducts } from '@/services/sale_services'

export const useProducts = (searchTerm?: string) => {

  const query = searchTerm ? useSearchProducts(searchTerm) : useAllProductsQuery()

  return {
    products: query.data?.data as Product[] || [],
    isLoading: query.isLoading,
    error: query.error,
  }
}

export const useProductSales = (searchTerm?: string) => {
  const query = searchTerm ? useSearchSaleProducts(searchTerm) : useAllProductSalesQuery();

  return {
    sales: query.data?.data as SaleWithDetails[] || [],
    isLoading: query.isLoading,
    error: query?.error
  }
}

export const useSaleDetails = () => {
  const data = useAllProductSalesQuery();

  return {
    saleDetails: data.data?.data as SaleDetail[] || [],
    isLoading: data.isLoading,
    error: data.error
  }
}
