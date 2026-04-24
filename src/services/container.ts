import { getDb } from './database'
import type { IProductRepository } from '../repositories/interfaces/IProductRepository'
import type { IVariantRepository } from '../repositories/interfaces/IVariantRepository'
import type { ICartRepository } from '../repositories/interfaces/ICartRepository'
import { SqliteProductRepository } from '../repositories/sqlite/SqliteProductRepository'
import { SqliteVariantRepository } from '../repositories/sqlite/SqliteVariantRepository'
import { SqliteCartRepository } from '../repositories/sqlite/SqliteCartRepository'

export interface IContainer {
  productRepository: IProductRepository
  variantRepository: IVariantRepository
  cartRepository: ICartRepository
}

let container: IContainer | null = null

export const getContainer = (): IContainer => {
  if (container) return container

  const db = getDb()
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.')
  }

  container = {
    productRepository: new SqliteProductRepository(db),
    variantRepository: new SqliteVariantRepository(db),
    cartRepository: new SqliteCartRepository(db),
  }

  return container
}
