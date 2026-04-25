import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Header from '../Header'

vi.mock('../CartSheet', () => ({
  default: () => <div data-testid="mock-cart">Cart</div>,
}))

describe('Header', () => {
  it('renders the logo and shop name', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    )

    expect(screen.getByText('Shop Visualizer')).toBeInTheDocument()
    expect(screen.getByText('3D')).toBeInTheDocument()
  })

  it('renders the navigation links', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: /catalog/i })).toBeInTheDocument()
  })

  it('renders the CartSheet component', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    )

    expect(screen.getByTestId('mock-cart')).toBeInTheDocument()
  })
})
