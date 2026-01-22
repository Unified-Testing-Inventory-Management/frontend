import { useQuery } from "@tanstack/react-query";
import { allProductSales } from "@/api/sale_api";

export const useAllProductSalesQuery = () => {
    return useQuery({
        queryFn: allProductSales,
        queryKey: ["transactions"],
    })
}