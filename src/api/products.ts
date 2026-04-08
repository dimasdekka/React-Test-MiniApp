import api from '../lib/axios'
import type { Product, CreateProductPayload } from '../types'

export async function getProducts(offset: number = 0, limit: number = 12): Promise<Product[]> {
  const response = await api.get<Product[]>('/products', {
    params: { offset, limit },
  })
  return response.data
}

export async function createProduct(data: CreateProductPayload): Promise<Product> {
  const response = await api.post<Product>('/products', data)
  return response.data
}
