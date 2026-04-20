import { getDb } from '../services/database'
import type { Product } from '../types/database'

export function useProducts(search: string = '', category: string = 'All') {
  const db = getDb()
  if (!db) return []

  let query = 'SELECT * FROM products WHERE 1=1'
  const params: Record<string, string> = {}

  if (search) {
    query += ' AND name LIKE $search'
    params['$search'] = `%${search}%`
  }
  if (category !== 'All') {
    query += ' AND category = $category'
    params['$category'] = category
  }

  const stmt = db.prepare(query)
  const result: Product[] = []

  stmt.bind(params)
  while (stmt.step()) {
    result.push(stmt.getAsObject() as unknown as Product)
  }
  stmt.free()

  return result
}
