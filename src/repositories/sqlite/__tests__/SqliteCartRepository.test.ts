/* eslint-disable */
import { describe, it, expect, beforeEach } from 'vitest'
import initSqlJs from 'sql.js'
import type { Database } from 'sql.js'
import { SqliteCartRepository } from '../SqliteCartRepository'

describe('SqliteCartRepository', () => {
  let db: Database
  let repository: SqliteCartRepository

  beforeEach(async () => {
    const SQL = await initSqlJs()
    db = new SQL.Database()

    db.run(`
      CREATE TABLE products (
        id INTEGER PRIMARY KEY,
        name TEXT,
        base_price REAL,
        thumbnail TEXT
      );
      CREATE TABLE variants (
        id INTEGER PRIMARY KEY,
        product_id INTEGER,
        name TEXT,
        price_modifier REAL,
        FOREIGN KEY(product_id) REFERENCES products(id)
      );
      CREATE TABLE cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER,
        variant_id INTEGER,
        quantity INTEGER DEFAULT 1,
        FOREIGN KEY(product_id) REFERENCES products(id),
        FOREIGN KEY(variant_id) REFERENCES variants(id)
      );

      INSERT INTO products VALUES (1, 'Test Product', 100.0, 'test.jpg');
      INSERT INTO variants VALUES (1, 1, 'Default', 0.0);
    `)

    repository = new SqliteCartRepository(db)
  })

  it('should add an item to the cart', async () => {
    await repository.addItem(1, 1, 1)
    const items = await repository.findAll()

    expect(items).toHaveLength(1)
    expect(items[0]).toMatchObject({
      product_id: 1,
      variant_id: 1,
      quantity: 1,
      product_name: 'Test Product',
      unit_price: 100.0,
    })
  })

  it('should increment quantity if item already exists', async () => {
    await repository.addItem(1, 1, 1)
    await repository.addItem(1, 1, 2)
    const items = await repository.findAll()

    expect(items).toHaveLength(1)
    expect(items[0].quantity).toBe(3)
  })

  it('should remove an item from the cart', async () => {
    await repository.addItem(1, 1, 1)
    let items = await repository.findAll()
    const itemId = (items[0] as any).id

    await repository.removeItem(itemId)
    items = await repository.findAll()
    expect(items).toHaveLength(0)
  })

  it('should update item quantity', async () => {
    await repository.addItem(1, 1, 1)
    let items = await repository.findAll()
    const itemId = (items[0] as any).id

    await repository.updateQuantity(itemId, 5)
    items = await repository.findAll()
    expect(items[0].quantity).toBe(5)
  })

  it('should clear the cart', async () => {
    await repository.addItem(1, 1, 1)
    await repository.clear()
    const items = await repository.findAll()
    expect(items).toHaveLength(0)
  })
})
