import type { CartItem } from '../../types/database'

export interface ICartRepository {
  findAll(): Promise<CartItem[]>
  addItem(productId: number, variantId: number, quantity: number): Promise<void>
  removeItem(id: number): Promise<void>
  updateQuantity(id: number, quantity: number): Promise<void>
  clear(): Promise<void>
}
