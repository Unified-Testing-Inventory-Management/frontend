import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  registerProduct,
  getAllProducts,
  getProductById,
  archiveProduct,
  updateProduct,
} from '@/api/product_api'

export const useRegisterProductMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: registerProduct,
    mutationKey: ['products'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export const useAllProductsQuery = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: getAllProducts,
  })
}

export const useGetProductById = (id: string) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => getProductById(id),
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

export const useArchiveProductById = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: archiveProduct,
    mutationKey: ['products'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
