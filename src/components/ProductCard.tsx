import type { Product } from '../types'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imgError, setImgError] = useState(false)

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price)

  const imageUrl = product.images?.[0]?.replace(/[\[\]"]/g, '') ?? ''

  return (
    <div className="group relative bg-surface-container-lowest rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-on-surface/5 flex flex-col h-full font-manrope">
      <div className="aspect-[4/5] overflow-hidden bg-surface-container relative">
        {!imgError && imageUrl ? (
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-outline-variant bg-surface-container">
             <span className="material-symbols-outlined text-4xl">image_not_supported</span>
          </div>
        )}
        
        <div className="absolute top-4 left-4">
          <span className="bg-primary-fixed text-on-primary-fixed text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
            {product.category?.id === 1 ? 'Clothes' :
             product.category?.id === 2 ? 'Electronics' :
             product.category?.id === 3 ? 'Furniture' :
             product.category?.id === 4 ? 'Shoes' :
             product.category?.id === 5 ? 'Others' :
             (product.category?.name ?? 'Uncategorized')}
          </span>
        </div>
        
        <button className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-lg flex items-center justify-center text-primary opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 cursor-pointer">
          <span className="material-symbols-outlined">add_shopping_cart</span>
        </button>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2 gap-4">
          <h3 className="font-manrope font-bold text-lg text-on-surface group-hover:text-primary transition-colors line-clamp-2">
            {product.title}
          </h3>
          <span className="font-inter font-semibold text-primary whitespace-nowrap">
            {formatPrice(product.price)}
          </span>
        </div>
        <div className="mt-auto flex items-center gap-2 text-xs text-on-surface-variant opacity-60">
          <span className="material-symbols-outlined text-sm">inventory</span>
          <span>In Stock</span>
        </div>
      </div>
    </div>
  )
}
