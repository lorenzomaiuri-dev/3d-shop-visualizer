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
      description TEXT,
      model_path TEXT,
      category TEXT,
      thumbnail TEXT
    );

    CREATE TABLE variants (
      id INTEGER PRIMARY KEY,
      product_id INTEGER,
      name TEXT,
      color TEXT,
      price_modifier REAL,
      target_mesh TEXT,
      FOREIGN KEY(product_id) REFERENCES products(id)
    );

    INSERT INTO products VALUES (1, 'Sneakers', 120.0, 'High-performance 3D sneakers', '/models/Shoe.glb', 'Footwear', 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28');
    INSERT INTO products VALUES (2, 'Watch', 499.0, 'Sapphire crystal with mechanical movement', '/models/Watch.glb', 'Accessories', 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49');
    INSERT INTO variants VALUES (1, 1, 'Classic White', '#ffffff', 0.0, 'Retopo_3DModel_mesh014');
    INSERT INTO variants VALUES (2, 1, 'Cyber Punk', '#ff00ff', 15.0, 'Retopo_3DModel_mesh014');
    INSERT INTO variants VALUES (3, 1, 'Deep Ocean', '#0000ff', 10.0, 'Retopo_3DModel_mesh014');
    INSERT INTO variants VALUES (4, 2, 'Silver Steel', '#c0c0c0', 0.0, 'Bracelet');
    INSERT INTO variants VALUES (5, 2, 'Gold Edition', '#ffd700', 150.0, 'Bracelet');
  `)

  return db
}

export const getDb = () => db
