export interface Product {
  id: number
  name: string
  base_price: number
  description: string
}

export interface Variant {
  id: number
  product_id: number
  name: string
  color: string
  price_modifier: number
}
