import type { Database } from 'sql.js'
import type { Variant } from '../../types/database'
import type { IVariantRepository } from '../interfaces/IVariantRepository'

export class SqliteVariantRepository implements IVariantRepository {
  private db: Database

  constructor(db: Database) {
    this.db = db
  }

  async findByProductId(productId: number): Promise<Variant[]> {
    const stmt = this.db.prepare(
      'SELECT * FROM variants WHERE product_id = $productId',
    )
    const result: Variant[] = []

    try {
      stmt.bind({ $productId: productId })
      while (stmt.step()) {
        result.push(stmt.getAsObject() as unknown as Variant)
      }
    } finally {
      stmt.free()
    }

    return result
  }
}
