import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { allProductSales, transactionProducts } from "@/api/sale_api";

export const useAllProductSalesQuery = () => {
    return useQuery({
        queryFn: allProductSales,
        queryKey: ["transactions"],
    })
}

export const useTransactionProduct = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: transactionProducts,
        mutationKey: ["transactions"],
        onSuccess: ()=> {
            queryClient.invalidateQueries({queryKey: ["transactions"]})
        }
    })
}