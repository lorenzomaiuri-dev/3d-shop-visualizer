import type { Variant } from '../../types/database'

export interface IVariantRepository {
  findByProductId(productId: number): Promise<Variant[]>
}
