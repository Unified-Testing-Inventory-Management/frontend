import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { registerProduct, getAllProducts } from '@/api/product_api'

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
