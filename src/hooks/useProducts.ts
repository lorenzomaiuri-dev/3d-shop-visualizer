import { useEffect, useState } from 'react'
import { getContainer } from '../services/container'
import type { Product } from '../types/database'

export function useProducts(search: string = '', category: string = 'All') {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    try {
      const { productRepository } = getContainer()
      productRepository.findAll({ search, category }).then(setProducts)
    } catch (err) {
      console.error('Failed to fetch products:', err)
    }
  }, [search, category])

  return products
}
