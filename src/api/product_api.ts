import type { UpdateProductData } from './../@types/index';
import type { Product } from '@/@types'
import { api } from './axios_api'

export const getAllProducts = async () => {
  const res = await api.get('/api/v1/products')
  return res.data
}

export const getProductById = async (id: string) => {
  const res = await api.get(`/api/v1/products/${id}`)
  return res.data
}

export const searchProductName = async (searchTerm: string) => {
  const res = await api.get('/api/v1/products/search', {
    params: { productName: searchTerm }
  })
  return res.data
}

export const registerProduct = async (
  data: Omit<Product, 'id' | 'createdAt' | 'barCode'>,
) => {

  const form = new FormData()

  form.append("productName", data.productName)
  form.append("category", data.category)
  form.append("price", String(data.price))
  form.append("stockQuantity", String(data.stockQuantity))

  if (data.image) {
    form.append("image", data.image)
  }

  const res = await api.post('/api/v1/products', form)
  return res.data
}

export const updateProduct = async ({ id, data }: UpdateProductData) => {

  const form = new FormData()

  form.append("productName", data.productName)
  form.append("category", data.category)
  form.append("price", String(data.price))
  form.append("stockQuantity", String(data.stockQuantity))

  const res = await api.patch(`/api/v1/products/${id}`, form)
  return res.data
}

export const archiveProduct = async (id: string | number | null) => {
  const res = await api.delete(`/api/v1/products/${id}`)
  return res.data
}

export const restoreProduct = async (id: string | number | null) => {
  const res = await api.delete(`/api/v1/products/archive/${id}/restore`)
  return res.data
}

export const deleteProduct = async (id: string | number | null) => {
  const res = await api.delete(`/api/v1/products/archive/${id}`)
  return res.data
}

export const getAllArchiveProducts = async () => {
  const res = await api.get("/api/v1/products/archive");
  return res.data
}
