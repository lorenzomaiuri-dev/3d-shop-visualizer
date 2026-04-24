import type { Product, ProductFilters } from '../../types/database'

export interface IProductRepository {
  findAll(filters?: ProductFilters): Promise<Product[]>
  findById(id: number): Promise<Product | null>
  getCategories(): Promise<string[]>
}
