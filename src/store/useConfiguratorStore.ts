import { create } from 'zustand'
import { getContainer } from '../services/container'
import type { Product, Variant } from '../types/database'

interface ConfiguratorState {
  product: Product | null
  variants: Variant[]
  selectedVariant: Variant | null
  price: number
  isLoading: boolean
  error: string | null

  // Actions
  fetchInitialData: (productId?: number) => Promise<void>
  selectVariant: (variantId: number) => void
}

export const useConfiguratorStore = create<ConfiguratorState>((set, get) => ({
  product: null,
  variants: [],
  selectedVariant: null,
  price: 0,
  isLoading: false,
  error: null,

  fetchInitialData: async (productId?: number) => {
    set({ isLoading: true, error: null })

    try {
      const { productRepository, variantRepository } = getContainer()

      const product = productId
        ? await productRepository.findById(productId)
        : (await productRepository.findAll({}))[0]

      if (!product) {
        throw new Error('Product not found')
      }

      const variants = await variantRepository.findByProductId(product.id)
      const selectedVariant = variants[0] || null
      const price = product.base_price + (selectedVariant?.price_modifier || 0)

      set({
        product,
        variants,
        selectedVariant,
        price,
        isLoading: false,
      })
    } catch (err) {
      console.error('Store fetch error:', err)
      set({ error: (err as Error).message, isLoading: false })
    }
  },

  selectVariant: (variantId: number) => {
    const { variants, product } = get()
    const selectedVariant = variants.find((v) => v.id === variantId) || null

    if (selectedVariant && product) {
      set({
        selectedVariant,
        price: product.base_price + selectedVariant.price_modifier,
      })
    }
  },
}))
