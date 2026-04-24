import { useState } from 'react'
import { useProducts } from '../../../hooks/useProducts'
import { useCategories } from '../../../hooks/useCategories'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Link } from 'react-router-dom'

export default function ProductGrid() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const products = useProducts(search, selectedCategory)
  const categories = useCategories()

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-4">
          <Input
            placeholder="Search products in SQL database..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Badge variant="secondary" className="shrink-0">
            Found {products.length} items
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === 'All' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('All')}
            className="rounded-full"
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((p) => (
          <Card
            key={p.id}
            className="group overflow-hidden transition-all hover:shadow-xl"
          >
            <CardContent className="p-0">
              <div className="aspect-square overflow-hidden bg-slate-100">
                <img
                  src={p.thumbnail}
                  alt={p.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-110"
                />
              </div>
              <div className="space-y-1 p-4">
                <p className="text-xs font-medium text-blue-600 uppercase">
                  {p.category}
                </p>
                <h3 className="text-lg font-bold">{p.name}</h3>
                <p className="font-mono text-xl">${p.base_price}</p>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button asChild className="w-full">
                <Link to={`/configurator/${p.id}`}>Configure in 3D</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed">
          <p className="text-slate-500">
            No products found matching your criteria.
          </p>
        </div>
      )}
    </div>
  )
}
