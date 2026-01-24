import { api } from "./axios_api";

export const allProductSales = async () => {
    const res = await api.get("/api/v1/transactions");
    return res.data;
}

export const transactionProducts = async () => {
  const res = await api.post("/api/v1/transactions");
  return  res.data
}
