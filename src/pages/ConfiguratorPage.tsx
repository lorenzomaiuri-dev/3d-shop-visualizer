import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { initDatabase } from '../services/database'
import { useConfiguratorStore } from '../store/useConfiguratorStore'
import Scene from '../features/configurator/components/Scene'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { ChevronLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ConfiguratorPage() {
  const { id } = useParams<{ id: string }>()
  const {
    fetchInitialData,
    selectVariant,
    product,
    price,
    variants,
    selectedVariant,
    isLoading,
    error,
  } = useConfiguratorStore()

  useEffect(() => {
    const productId = id ? parseInt(id, 10) : undefined
    initDatabase().then(() => fetchInitialData(productId))
  }, [id, fetchInitialData])

  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Card className="border-destructive bg-destructive/5 max-w-md p-8 text-center">
          <p className="text-destructive mb-4 text-lg font-bold">
            Error loading product
          </p>
          <p className="mb-6 text-slate-600">{error}</p>
          <Button asChild variant="outline">
            <Link to="/">Back to Catalog</Link>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Button asChild variant="ghost" className="mb-4">
        <Link to="/" className="flex items-center gap-2">
          <ChevronLeft className="h-4 w-4" />
          Back to Catalog
        </Link>
      </Button>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Card className="overflow-hidden border-none bg-white shadow-2xl shadow-blue-500/10 dark:bg-slate-900">
            <CardContent className="p-0">
              {isLoading ? (
                <Skeleton className="aspect-square w-full" />
              ) : (
                <div className="aspect-square w-full">
                  <Scene />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col justify-center lg:col-span-5">
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-24 w-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <div className="flex gap-2">
                  <Skeleton className="h-12 w-24" />
                  <Skeleton className="h-12 w-24" />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div>
                <Badge
                  variant="secondary"
                  className="mb-4 text-[10px] tracking-widest uppercase"
                >
                  {product?.category || 'Product'}
                </Badge>
                <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                  {product?.name}
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-slate-500 dark:text-slate-400">
                  {product?.description}
                </p>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-sm font-bold tracking-wider text-slate-400 uppercase">
                  Price
                </span>
                <p className="text-5xl font-black text-slate-900 dark:text-white">
                  ${price.toFixed(2)}
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                  Select Configuration
                </p>
                <div className="flex flex-wrap gap-3">
                  {variants.map((v) => (
                    <Button
                      key={v.id}
                      variant={
                        selectedVariant?.id === v.id ? 'default' : 'outline'
                      }
                      onClick={() => selectVariant(v.id)}
                      className="h-12 px-6 font-bold transition-all hover:scale-105"
                    >
                      {v.name}
                    </Button>
                  ))}
                </div>
              </div>

              <Button className="w-full bg-blue-600 py-8 text-xl font-black shadow-xl shadow-blue-500/25 transition-all hover:bg-blue-700 active:scale-[0.98]">
                Add to Cart
              </Button>

              <p className="text-center text-xs text-slate-400">
                Free shipping on all orders. 30-day money-back guarantee.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
