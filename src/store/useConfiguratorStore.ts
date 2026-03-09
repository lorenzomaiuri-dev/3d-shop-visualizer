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
      // TODO: REFACTOR TO USE PARAMETRIZED QUERIES WITH PREPARED STATEMENTS WITH REPOSITORY PATTERN
      const productRes = db.exec('SELECT * FROM products LIMIT 1')

      if (
        !productRes ||
        productRes.length === 0 ||
        productRes[0].values.length === 0
      ) {
        throw new Error('No products found in database')
      }

      const cols = productRes[0].columns
      const vals = productRes[0].values[0]
      const product = cols.reduce(
        (acc, col, i) => ({ ...acc, [col]: vals[i] }),
        {},
      ) as Product

      console.log('Mapped product:', product)

      // Get all variants
      const variantsRes = db.exec(
        `SELECT * FROM variants WHERE product_id = ${product.id}`,
      )
      const variants: Variant[] = []

      if (variantsRes && variantsRes.length > 0) {
        const vCols = variantsRes[0].columns
        variantsRes[0].values.forEach((vVals) => {
          const variant = vCols.reduce(
            (acc, col, i) => ({ ...acc, [col]: vVals[i] }),
            {},
          ) as Variant
          variants.push(variant)
        })
      }

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
