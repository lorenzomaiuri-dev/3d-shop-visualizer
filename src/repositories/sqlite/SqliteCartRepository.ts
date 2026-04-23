import type { Database } from 'sql.js'
import type { CartItem } from '../../types/database'
import type { ICartRepository } from '../interfaces/ICartRepository'

export class SqliteCartRepository implements ICartRepository {
  constructor(private db: Database) {}

  async findAll(): Promise<CartItem[]> {
    const query = `
      SELECT 
        c.id, 
        c.product_id, 
        c.variant_id, 
        c.quantity,
        p.name as product_name,
        v.name as variant_name,
        (p.base_price + v.price_modifier) as unit_price,
        p.thumbnail
      FROM cart c
      JOIN products p ON c.product_id = p.id
      JOIN variants v ON c.variant_id = v.id
    `

    const stmt = this.db.prepare(query)
    const result: CartItem[] = []

    try {
      while (stmt.step()) {
        result.push(stmt.getAsObject() as unknown as CartItem)
      }
    } finally {
      stmt.free()
    }

    return result
  }

  async addItem(
    productId: number,
    variantId: number,
    quantity: number,
  ): Promise<void> {
    // Check if item already exists
    const checkStmt = this.db.prepare(
      'SELECT id, quantity FROM cart WHERE product_id = $pId AND variant_id = $vId',
    )
    try {
      checkStmt.bind({ $pId: productId, $vId: variantId })
      if (checkStmt.step()) {
        const row = checkStmt.getAsObject() as { id: number; quantity: number }
        const newQuantity = row.quantity + quantity
        this.db.run('UPDATE cart SET quantity = $qty WHERE id = $id', {
          $qty: newQuantity,
          $id: row.id,
        })
        return
      }
    } finally {
      checkStmt.free()
    }

    // Otherwise insert new
    this.db.run(
      'INSERT INTO cart (product_id, variant_id, quantity) VALUES ($pId, $vId, $qty)',
      { $pId: productId, $vId: variantId, $qty: quantity },
    )
  }

  async removeItem(id: number): Promise<void> {
    this.db.run('DELETE FROM cart WHERE id = $id', { $id: id })
  }

  async updateQuantity(id: number, quantity: number): Promise<void> {
    if (quantity <= 0) {
      await this.removeItem(id)
      return
    }
    this.db.run('UPDATE cart SET quantity = $qty WHERE id = $id', {
      $qty: quantity,
      $id: id,
    })
  }

  async clear(): Promise<void> {
    this.db.run('DELETE FROM cart')
  }
}
