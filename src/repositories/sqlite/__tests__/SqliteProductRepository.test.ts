import { describe, it, expect, beforeEach } from 'vitest'
import initSqlJs from 'sql.js'
import type { Database } from 'sql.js'
import { SqliteProductRepository } from '../SqliteProductRepository'

describe('SqliteProductRepository', () => {
  let db: Database
  let repository: SqliteProductRepository

  beforeEach(async () => {
    const SQL = await initSqlJs()
    db = new SQL.Database()

    db.run(`
      CREATE TABLE products (
        id INTEGER PRIMARY KEY,
        name TEXT,
        base_price REAL,
        description TEXT,
        model_path TEXT,
        category TEXT,
        thumbnail TEXT
      );

      INSERT INTO products VALUES (1, 'Sneakers', 120.0, '3D sneakers', '/models/Shoe.glb', 'Footwear', 'shoe.jpg');
      INSERT INTO products VALUES (2, 'Watch', 499.0, 'Mechanical watch', '/models/Watch.glb', 'Accessories', 'watch.jpg');
    `)

    repository = new SqliteProductRepository(db)
  })

  it('should find all products', async () => {
    const products = await repository.findAll()
    expect(products).toHaveLength(2)
  })

  it('should filter products by search term', async () => {
    const products = await repository.findAll({ search: 'Sneak' })
    expect(products).toHaveLength(1)
    expect(products[0].name).toBe('Sneakers')
  })

  it('should filter products by category', async () => {
    const products = await repository.findAll({ category: 'Accessories' })
    expect(products).toHaveLength(1)
    expect(products[0].category).toBe('Accessories')
  })

  it('should find product by id', async () => {
    const product = await repository.findById(2)
    expect(product).not.toBeNull()
    expect(product?.name).toBe('Watch')
  })

  it('should return null for non-existent product', async () => {
    const product = await repository.findById(999)
    expect(product).toBeNull()
  })

  it('should get unique categories', async () => {
    const categories = await repository.getCategories()
    expect(categories).toContain('Footwear')
    expect(categories).toContain('Accessories')
    expect(categories).toHaveLength(2)
  })
})
