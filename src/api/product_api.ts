import type { UpdateProductData } from './../@types/index';
import type { Product } from '@/@types'
import { api } from './axios_api'

export const getAllProducts = async () => {
  const res = await api.get('/products')
  return res.data
}

export const getProductById = async (id: string) => {
  const res = await api.get(`/products/${id}`)
  return res.data
}

export const searchProductName = async (searchTerm: string) => {
  const res = await api.get('/products/search', {
    params: { productName: searchTerm }
  })
  return res.data
}

export const registerProduct = async (
  data: Omit<Product, 'id' | 'createdAt' | 'barCode' | 'updatedAt'>,
) => {

  const form = new FormData()

  form.append("productName", data.productName)
  form.append("category", data.category)
  form.append("price", String(data.price))
  form.append("stockQuantity", String(data.stockQuantity))

  if (data.image) {
    form.append("image", data.image)
  }

  const res = await api.post('/products', form)
  return res.data
}

export const updateProduct = async ({ id, data }: UpdateProductData) => {

  const form = new FormData()

  form.append("productName", data.productName)
  form.append("category", data.category)
  form.append("price", String(data.price))
  form.append("stockQuantity", String(data.stockQuantity))

  const res = await api.patch(`/products/${id}`, form)
  return res.data
}

export const archiveProduct = async (id: string | number | null) => {
  const res = await api.delete(`/products/${id}`)
  return res.data
}

export const searchArchiveProductName = async (searchTerm: string) => {
  const res = await api.get('/products/archive/search', { params: { productName: searchTerm } })
  return res.data
}

export const restoreProduct = async (id: string | number | null) => {
  const res = await api.delete(`/products/archive/${id}/restore`)
  return res.data
}

export const deleteProduct = async (id: string | number | null) => {
  const res = await api.delete(`/products/archive/${id}`)
  return res.data
}

export const getAllArchiveProducts = async () => {
  const res = await api.get("/products/archive");
  return res.data
}

export const importProductFromExcel = async (file: File) => {
  const data = new FormData()
  data.append("file", file)

  const res = await api.post("/products/import-excel", data);
  console.log(res)
  
  return res.data
}

export const productInSights = async () => {
  const res = await api.get("/products/product-insights");
  console.log(res.data)
  return res.data
}