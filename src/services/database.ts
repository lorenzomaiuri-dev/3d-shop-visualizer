import initSqlJs from 'sql.js'
import type { Database } from 'sql.js'

let db: Database | null = null

export const initDatabase = async () => {
  if (db) return db

  const SQL = await initSqlJs({
    locateFile: (file) => {
      const baseUrl = import.meta.env.BASE_URL || '/'
      const path = `${baseUrl}${file}`.replace(/\/+/g, '/')
      console.log('Locating WASM:', path)
      return path
    },
  })

  db = new SQL.Database()

  // Initial seeding
  db.run(`
    CREATE TABLE products (
      id INTEGER PRIMARY KEY,
      name TEXT,
      base_price REAL,
      description TEXT
    );

    CREATE TABLE variants (
      id INTEGER PRIMARY KEY,
      product_id INTEGER,
      name TEXT,
      color TEXT,
      price_modifier REAL,
      FOREIGN KEY(product_id) REFERENCES products(id)
    );

    INSERT INTO products VALUES (1, 'Sneakers', 120.0, 'High-performance 3D sneakers');
    INSERT INTO variants VALUES (1, 1, 'Classic White', '#ffffff', 0.0);
    INSERT INTO variants VALUES (2, 1, 'Cyber Punk', '#ff00ff', 15.0);
    INSERT INTO variants VALUES (3, 1, 'Deep Ocean', '#0000ff', 10.0);
  `)

  return db
}

export const getDb = () => db
