import { useState } from 'react'
import { useProducts } from '../../../hooks/useProducts'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Link } from 'react-router-dom'

export default function ProductGrid() {
  const [search, setSearch] = useState('')
  const products = useProducts(search)

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search products in SQL database..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Badge variant="secondary">Found {products.length} items</Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
    </div>
  )
}
