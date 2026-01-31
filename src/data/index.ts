import type { ArchiveProductsData, Product, SaleDetail, SaleWithDetails } from '../@types/index';
import { useAllArchivesProducts, useAllProductsQuery, useSearchArchiveProduct, useSearchProducts } from '@/services/product_services'
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
    sales: query.data?.data as SaleWithDetails[] & SaleDetail[] || [],
    isLoading: query.isLoading,
    error: query?.error
  }
}

export const useAllArchiveProducts = (searchTerm?: string) => {
  const query = searchTerm ? useSearchArchiveProduct(searchTerm) : useAllArchivesProducts()

  return {
    archives: query.data?.data as ArchiveProductsData[] || [],
    isLoading: query.isLoading,
    error: query.error
  }
}
