import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  registerProduct,
  getAllProducts,
  getProductById,
  archiveProduct,
  updateProduct,
  searchProductName,
  getAllArchiveProducts,
  restoreProduct,
  deleteProduct,
  searchArchiveProductName,
  importProductFromExcel,
  productInSights
} from '@/api/product_api'

export const useRegisterProductMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: registerProduct,
    mutationKey: ['products'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] }),
      queryClient.invalidateQueries({ queryKey: ["product-insights"] })
    },
  })
}

export const useAllProductsQuery = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: getAllProducts,
    staleTime: 1000 * 60 * 5,
  })
}

export const useGetProductById = (id: string) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => getProductById(id),
    enabled: !!id
  })
}


export const useSearchProducts = (searchTerm: string) => {
  return useQuery({
    queryKey: ['products', 'search', searchTerm],
    queryFn: () => searchProductName(searchTerm),
    enabled: searchTerm.length > 0,
  })
}

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateProduct,
    mutationKey: ['products'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export const useSearchArchiveProduct = (searchTerm: string) => {
  return useQuery({
    queryKey: ['archive', 'search'],
    queryFn: () => searchArchiveProductName(searchTerm),
    enabled: searchTerm.length > 0
  })
}

export const useArchiveProductById = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: archiveProduct,
    mutationKey: ['products'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['archive'] })
    },
  })
}

export const useRestoreProductById = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: restoreProduct,
    mutationKey: ["restore"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['archive'] })
    },
  })
}

export const useDeleteProductById = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteProduct,
    mutationKey: ["archive"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['archive'] })
    },
  })
}

export const useAllArchivesProducts = () => {
  return useQuery({
    queryFn: getAllArchiveProducts,
    queryKey: ['archive'],
    staleTime: 1000 * 60 * 5,
  })
}

export const useImportProductFromExcel = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: importProductFromExcel,
    mutationKey: ["import-excel"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export const useProductInSights = () => {
  return useQuery({
    queryFn: productInSights,
    queryKey: ["product-insights"]
  })
}