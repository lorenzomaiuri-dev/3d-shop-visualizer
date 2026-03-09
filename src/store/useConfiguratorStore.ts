import { create } from 'zustand'
import { getDb } from '../services/database'
import type { Product, Variant } from '../types/database'

interface ConfiguratorState {
  product: Product | null
  variants: Variant[]
  selectedVariant: Variant | null
  price: number
  isLoading: boolean
  error: string | null

  // Actions
  fetchInitialData: () => Promise<void>
  selectVariant: (variantId: number) => void
}

export const useConfiguratorStore = create<ConfiguratorState>((set, get) => ({
  product: null,
  variants: [],
  selectedVariant: null,
  price: 0,
  isLoading: false,
  error: null,

  fetchInitialData: async () => {
    set({ isLoading: true, error: null })
    const db = getDb()

    if (!db) {
      set({ error: 'Database not initialized', isLoading: false })
      return
    }

    try {
      // TODO: HANDLE INIT DATA BETTER
      const productStmt = db.prepare('SELECT * FROM products LIMIT 1')
      const product = productStmt.getAsObject() as unknown as Product
      productStmt.free()

      console.log('Fetched product:', product)

      if (!product || !product.id) {
        throw new Error('No products found in database')
      }

      // Get all variants for this product
      const variantsStmt = db.prepare(
        'SELECT * FROM variants WHERE product_id = :pid',
      )
      const variants: Variant[] = []
      variantsStmt.bind({ ':pid': product.id })
      while (variantsStmt.step()) {
        variants.push(variantsStmt.getAsObject() as unknown as Variant)
      }
      variantsStmt.free()

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
