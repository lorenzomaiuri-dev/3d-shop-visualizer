/* eslint-disable */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useConfiguratorStore } from '../useConfiguratorStore'
import { getContainer } from '../../services/container'

vi.mock('../../services/container', () => ({
  getContainer: vi.fn(),
}))

describe('useConfiguratorStore', () => {
  const mockProductRepository = {
    findById: vi.fn(),
    findAll: vi.fn(),
    getCategories: vi.fn(),
  }
  const mockVariantRepository = {
    findByProductId: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(getContainer as any).mockReturnValue({
      productRepository: mockProductRepository,
      variantRepository: mockVariantRepository,
    })

    useConfiguratorStore.setState({
      product: null,
      variants: [],
      selectedVariant: null,
      price: 0,
      isLoading: false,
      error: null,
    })
  })

  it('should fetch product and variants correctly', async () => {
    const mockProduct = { id: 1, name: 'Test Product', base_price: 100 }
    const mockVariants = [
      { id: 1, product_id: 1, name: 'Red', price_modifier: 10 },
    ]

    mockProductRepository.findById.mockResolvedValue(mockProduct)
    mockVariantRepository.findByProductId.mockResolvedValue(mockVariants)

    await useConfiguratorStore.getState().fetchInitialData(1)

    const state = useConfiguratorStore.getState()
    expect(state.product).toEqual(mockProduct)
    expect(state.variants).toEqual(mockVariants)
    expect(state.selectedVariant).toEqual(mockVariants[0])
    expect(state.price).toBe(110)
    expect(state.isLoading).toBe(false)
  })

  it('should handle product not found', async () => {
    mockProductRepository.findById.mockResolvedValue(null)

    await useConfiguratorStore.getState().fetchInitialData(1)

    expect(useConfiguratorStore.getState().error).toBe('Product not found')
    expect(useConfiguratorStore.getState().isLoading).toBe(false)
  })

  it('should select variant and update price', () => {
    const mockProduct = { id: 1, name: 'Test Product', base_price: 100 }
    const mockVariants = [
      { id: 1, product_id: 1, name: 'Red', price_modifier: 10 },
      { id: 2, product_id: 1, name: 'Blue', price_modifier: 0 },
    ]

    useConfiguratorStore.setState({
      product: mockProduct as any,
      variants: mockVariants as any,
      selectedVariant: mockVariants[0] as any,
      price: 110,
    })

    useConfiguratorStore.getState().selectVariant(2)

    const state = useConfiguratorStore.getState()
    expect(state.selectedVariant).toEqual(mockVariants[1])
    expect(state.price).toBe(100)
  })
})
