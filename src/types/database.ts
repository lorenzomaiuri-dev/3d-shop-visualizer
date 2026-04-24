export interface Product {
  id: number
  name: string
  base_price: number
  description: string
  model_path: string
  category: string
  thumbnail: string
}

export interface Variant {
  id: number
  product_id: number
  name: string
  color: string
  price_modifier: number
  target_mesh: string
}

export interface CartItem {
  id: number
  product_id: number
  variant_id: number
  quantity: number
  product_name?: string
  variant_name?: string
  unit_price?: number
  thumbnail?: string
}

export interface ProductFilters {
  search?: string
  category?: string
}
