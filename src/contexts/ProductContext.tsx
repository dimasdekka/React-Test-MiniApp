import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Product } from '../types'

interface ProductContextType {
  newProducts: Product[]
  addNewProduct: (product: Product) => void
}

const ProductContext = createContext<ProductContextType | undefined>(undefined)

export function ProductProvider({ children }: { children: ReactNode }) {
  const [newProducts, setNewProducts] = useState<Product[]>([])

  const addNewProduct = (product: Product) => {
    setNewProducts((prev) => [product, ...prev])
  }

  return (
    <ProductContext.Provider value={{ newProducts, addNewProduct }}>
      {children}
    </ProductContext.Provider>
  )
}

export function useProduct() {
  const context = useContext(ProductContext)
  if (context === undefined) {
    throw new Error('useProduct must be used within a ProductProvider')
  }
  return context
}
