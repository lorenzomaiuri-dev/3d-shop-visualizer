import ProductGrid from '../features/catalog/components/ProductGrid'
import { Badge } from '@/components/ui/badge'

export default function CatalogPage() {
  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <Badge
          variant="outline"
          className="font-mono text-[10px] tracking-widest uppercase"
        >
          Catalog
        </Badge>
        <h1 className="text-4xl font-black tracking-tighter text-slate-900 sm:text-5xl lg:text-6xl">
          Discover our{' '}
          <span className="text-blue-600 underline decoration-blue-200 decoration-8 underline-offset-8">
            Collection
          </span>
        </h1>
        <p className="max-w-2xl text-lg text-slate-500">
          Browse through our high-quality products and experience them in 3D
          before you buy. Powered by a real-time local SQL database.
        </p>
      </header>

      <ProductGrid />
    </div>
  )
}
