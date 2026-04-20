import { getDb } from '../services/database'

export function useCategories() {
  const db = getDb()
  if (!db) return []

  const stmt = db.prepare('SELECT DISTINCT category FROM products')
  const result: string[] = []

  while (stmt.step()) {
    const row = stmt.getAsObject()
    if (row.category) {
      result.push(row.category as string)
    }
  }
  stmt.free()

  return result
}
