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
    const db = getDb()

    if (!db) {
      set({ error: 'Database not initialized', isLoading: false })
      return
    }

    try {
      // TODO: REFACTOR TO REPOSITORY PATTERN
      const query = productId
        ? 'SELECT * FROM products WHERE id = $productId'
        : 'SELECT * FROM products LIMIT 1'

      const stmt = db.prepare(query)
      if (productId) {
        stmt.bind({ $productId: productId })
      }

      if (!stmt.step()) {
        stmt.free()
        throw new Error('Product not found')
      }

      const product = stmt.getAsObject() as unknown as Product
      stmt.free()

      // Get all variants using prepared statement
      const vStmt = db.prepare(
        'SELECT * FROM variants WHERE product_id = $productId',
      )
      vStmt.bind({ $productId: product.id })

      const variants: Variant[] = []
      while (vStmt.step()) {
        variants.push(vStmt.getAsObject() as unknown as Variant)
      }
      vStmt.free()

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
