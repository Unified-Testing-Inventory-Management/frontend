import type { TransactionData } from "@/@types";
import { api } from "./axios_api";

type transactionData = {
  data: Omit<TransactionData, "id" | "image" | "stockQuantity" | "createdAt" | "barCode" | "updatedAt">
}

export const allProductSales = async () => {
  const res = await api.get("/transactions");
  return res.data;
}

export const searchProductName = async (searchTerm: string) => {
  const res = await api.get("/transactions", {
    params: { productName: searchTerm }
  });
  return res.data;
}

export const transactionProducts = async ({ data }: transactionData) => {
  const res = await api.post("/transactions", data);
  return res.data
}
