/* eslint-disable */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAppStore } from '../useAppStore'
import { initDatabase } from '../../services/database'

vi.mock('../../services/database', () => ({
  initDatabase: vi.fn(),
}))

describe('useAppStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAppStore.setState({ isDbReady: false, isLoading: false, error: null })
  })

  it('should initialize database correctly', async () => {
    ;(initDatabase as any).mockResolvedValue(undefined)

    await useAppStore.getState().initialize()

    const state = useAppStore.getState()
    expect(state.isDbReady).toBe(true)
    expect(state.isLoading).toBe(false)
    expect(initDatabase).toHaveBeenCalledTimes(1)
  })

  it('should handle initialization errors', async () => {
    ;(initDatabase as any).mockRejectedValue(new Error('WASM failed to load'))

    await useAppStore.getState().initialize()

    const state = useAppStore.getState()
    expect(state.isDbReady).toBe(false)
    expect(state.error).toBe('WASM failed to load')
    expect(state.isLoading).toBe(false)
  })
})
