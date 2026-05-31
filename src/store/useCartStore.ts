import { create } from 'zustand'
import { getContainer } from '../services/container'
import { getDb } from '../services/database'
import type { CartItem } from '../types/database'

interface CartState {
  items: CartItem[]
  isLoading: boolean
  error: string | null

  // Actions
  fetchItems: () => Promise<void>
  addItem: (
    productId: number,
    variantId: number,
    quantity?: number,
  ) => Promise<void>
  removeItem: (id: number) => Promise<void>
  updateQuantity: (id: number, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchItems: async () => {
    if (!getDb()) return
    set({ isLoading: true, error: null })
    try {
      const { cartRepository } = getContainer()
      const items = await cartRepository.findAll()
      set({ items, isLoading: false })
    } catch (err) {
      console.error('Failed to fetch cart items:', err)
      set({ error: (err as Error).message, isLoading: false })
    }
  },

  addItem: async (
    productId: number,
    variantId: number,
    quantity: number = 1,
  ) => {
    set({ isLoading: true, error: null })
    try {
      const { cartRepository } = getContainer()
      await cartRepository.addItem(productId, variantId, quantity)
      await get().fetchItems()
    } catch (err) {
      console.error('Failed to add cart item:', err)
      set({ error: (err as Error).message, isLoading: false })
    }
  },

  removeItem: async (id: number) => {
    set({ isLoading: true, error: null })
    try {
      const { cartRepository } = getContainer()
      await cartRepository.removeItem(id)
      await get().fetchItems()
    } catch (err) {
      console.error('Failed to remove cart item:', err)
      set({ error: (err as Error).message, isLoading: false })
    }
  },

  updateQuantity: async (id: number, quantity: number) => {
    try {
      const { cartRepository } = getContainer()
      await cartRepository.updateQuantity(id, quantity)
      await get().fetchItems()
    } catch (err) {
      console.error('Failed to update cart quantity:', err)
      set({ error: (err as Error).message })
    }
  },

  clearCart: async () => {
    set({ isLoading: true, error: null })
    try {
      const { cartRepository } = getContainer()
      await cartRepository.clear()
      set({ items: [], isLoading: false })
    } catch (err) {
      console.error('Failed to clear cart:', err)
      set({ error: (err as Error).message, isLoading: false })
    }
  },
}))
