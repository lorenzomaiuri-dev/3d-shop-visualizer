import type { Database } from 'sql.js'
import type { Product, ProductFilters } from '../../types/database'
import type { IProductRepository } from '../interfaces/IProductRepository'

export class SqliteProductRepository implements IProductRepository {
  private db: Database

  constructor(db: Database) {
    this.db = db
  }

  async findAll(filters?: ProductFilters): Promise<Product[]> {
    let query = 'SELECT * FROM products WHERE 1=1'
    const params: Record<string, string> = {}

    if (filters?.search) {
      query += ' AND name LIKE $search'
      params['$search'] = `%${filters.search}%`
    }

    if (filters?.category && filters.category !== 'All') {
      query += ' AND category = $category'
      params['$category'] = filters.category
    }

    const stmt = this.db.prepare(query)
    const result: Product[] = []

    try {
      stmt.bind(params)
      while (stmt.step()) {
        result.push(stmt.getAsObject() as unknown as Product)
      }
    } finally {
      stmt.free()
    }

    return result
  }

  async findById(id: number): Promise<Product | null> {
    const stmt = this.db.prepare('SELECT * FROM products WHERE id = $id')
    try {
      stmt.bind({ $id: id })
      if (stmt.step()) {
        return stmt.getAsObject() as unknown as Product
      }
    } finally {
      stmt.free()
    }
    return null
  }

  async getCategories(): Promise<string[]> {
    const stmt = this.db.prepare('SELECT DISTINCT category FROM products')
    const result: string[] = []

    try {
      while (stmt.step()) {
        const row = stmt.getAsObject()
        if (row.category) {
          result.push(row.category as string)
        }
      }
    } finally {
      stmt.free()
    }

    return result
  }
}
