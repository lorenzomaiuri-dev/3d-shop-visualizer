/* eslint-disable */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useCartStore } from '../useCartStore'
import { getContainer } from '../../services/container'

vi.mock('../../services/container', () => ({
  getContainer: vi.fn(),
}))

vi.mock('../../services/database', () => ({
  getDb: vi.fn().mockReturnValue({}),
}))

describe('useCartStore', () => {
  const mockCartRepository = {
    findAll: vi.fn(),
    addItem: vi.fn(),
    removeItem: vi.fn(),
    updateQuantity: vi.fn(),
    clear: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(getContainer as any).mockReturnValue({
      cartRepository: mockCartRepository,
    })

    // Reset Zustand store state
    useCartStore.setState({ items: [], isLoading: false, error: null })
  })

  it('should fetch items correctly', async () => {
    const mockItems = [
      {
        id: 1,
        product_id: 1,
        variant_id: 1,
        quantity: 2,
        product_name: 'Test',
      },
    ]
    mockCartRepository.findAll.mockResolvedValue(mockItems)

    await useCartStore.getState().fetchItems()

    expect(useCartStore.getState().items).toEqual(mockItems)
    expect(mockCartRepository.findAll).toHaveBeenCalledTimes(1)
  })

  it('should handle errors during fetch', async () => {
    mockCartRepository.findAll.mockRejectedValue(new Error('Database error'))

    await useCartStore.getState().fetchItems()

    expect(useCartStore.getState().error).toBe('Database error')
    expect(useCartStore.getState().isLoading).toBe(false)
  })

  it('should add item and refresh list', async () => {
    mockCartRepository.addItem.mockResolvedValue(undefined)
    mockCartRepository.findAll.mockResolvedValue([{ id: 1, quantity: 1 }])

    await useCartStore.getState().addItem(1, 1, 1)

    expect(mockCartRepository.addItem).toHaveBeenCalledWith(1, 1, 1)
    expect(mockCartRepository.findAll).toHaveBeenCalledTimes(1)
    expect(useCartStore.getState().items).toHaveLength(1)
  })

  it('should remove item and refresh list', async () => {
    mockCartRepository.removeItem.mockResolvedValue(undefined)
    mockCartRepository.findAll.mockResolvedValue([])

    await useCartStore.getState().removeItem(1)

    expect(mockCartRepository.removeItem).toHaveBeenCalledWith(1)
    expect(mockCartRepository.findAll).toHaveBeenCalledTimes(1)
  })
})
