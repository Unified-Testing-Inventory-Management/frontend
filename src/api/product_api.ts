import type { Product } from '@/@types'
import { api } from './axios_api'

export const getAllProducts = async () => {
  const res = await api.get('/api/v1/products')
  return res.data
}

export const registerProduct = async (
  data: Omit<Product, 'id' | 'createdAt' | 'lowStockLevel' | 'barCode'>,
) => {
  const res = await api.post('/api/v1/products', data)
  return res.data
}
