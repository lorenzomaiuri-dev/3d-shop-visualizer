import { describe, it, expect, beforeEach } from 'vitest'
import initSqlJs from 'sql.js'
import type { Database } from 'sql.js'
import { SqliteVariantRepository } from '../SqliteVariantRepository'

describe('SqliteVariantRepository', () => {
  let db: Database
  let repository: SqliteVariantRepository

  beforeEach(async () => {
    const SQL = await initSqlJs()
    db = new SQL.Database()

    db.run(`
      CREATE TABLE variants (
        id INTEGER PRIMARY KEY,
        product_id INTEGER,
        name TEXT,
        color TEXT,
        price_modifier REAL,
        target_mesh TEXT
      );

      INSERT INTO variants VALUES (1, 1, 'Red', '#ff0000', 10.0, 'mesh1');
      INSERT INTO variants VALUES (2, 1, 'Blue', '#0000ff', 0.0, 'mesh1');
      INSERT INTO variants VALUES (3, 2, 'Gold', '#ffd700', 100.0, 'mesh2');
    `)

    repository = new SqliteVariantRepository(db)
  })

  it('should find variants by product id', async () => {
    const variants = await repository.findByProductId(1)
    expect(variants).toHaveLength(2)
    expect(variants[0].name).toBe('Red')
    expect(variants[1].name).toBe('Blue')
  })

  it('should return empty array if no variants found', async () => {
    const variants = await repository.findByProductId(999)
    expect(variants).toHaveLength(0)
  })
})
