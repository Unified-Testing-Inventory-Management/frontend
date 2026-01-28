import type { TransactionData } from "@/@types";
import { api } from "./axios_api";

type transactionData = {
  data: Omit<TransactionData, "id" | "image" | "stockQuantity" | "createdAt" | "barCode">
}

export const allProductSales = async () => {
  const res = await api.get("/api/v1/transactions");
  return res.data;
}

export const searchProductName = async (searchTerm: string) => {
  const res = await api.get("/api/v1/transactions", {
    params: { productName: searchTerm }
  });
  return res.data;
}

export const transactionProducts = async ({ data }: transactionData) => {
  const res = await api.post("/api/v1/transactions", data);
  return res.data
}
