import { useEffect, useState } from 'react'
import { getContainer } from '../services/container'

export function useCategories() {
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    try {
      const { productRepository } = getContainer()
      productRepository.getCategories().then(setCategories)
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }, [])

  return categories
}
