import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { allProductSales, searchProductName, transactionProducts } from "@/api/sale_api";

export const useAllProductSalesQuery = () => {
    return useQuery({
        queryFn: allProductSales,
        queryKey: ["transactions"],
    })
}

export const useSearchSaleProducts = (searchTerm: string) => {
    return useQuery({
        queryFn: () => searchProductName(searchTerm),
        queryKey: ["transactions", "search", searchTerm],
        enabled: searchTerm.length > 0
    })
}

export const useTransactionProduct = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: transactionProducts,
        mutationKey: ["transactions"],
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] })
            queryClient.invalidateQueries({ queryKey: ["products"] })
        }
    })
}