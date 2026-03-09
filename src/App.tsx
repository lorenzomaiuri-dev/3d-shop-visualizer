import { useEffect } from 'react'
import { initDatabase } from './services/database'
import { useConfiguratorStore } from './store/useConfiguratorStore'
import Scene from './features/configurator/components/Scene'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'

function App() {
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
    initDatabase().then(() => fetchInitialData())
  }, [fetchInitialData])

  if (error) {
    return (
      <div className="flex items-center justify-center">
        <Card className="border-destructive bg-destructive/10 p-6">
          <p className="text-destructive font-semibold">Error: {error}</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-bg-slate-50/50">
      <main className="mx-auto max-w-6xl p-6 lg:p-12">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900">
              3D Shop Visualizer
            </h1>
            <Badge
              variant="outline"
              className="mt-1 font-mono text-[10px] tracking-widest uppercase"
            >
              Local-First SQL Engine
            </Badge>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Card className="overflow-hidden border-none bg-white shadow-2xl shadow-blue-500/10">
              <CardContent className="p-0">
                {isLoading ? <Skeleton className="w-full" /> : <Scene />}
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col justify-center lg:col-span-5">
            {isLoading ? (
              <div className="space-y-6">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-20" />
                  <Skeleton className="h-10 w-20" />
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                    {product?.name}
                  </h2>
                  <p className="mt-4 text-slate-500">{product?.description}</p>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium text-slate-400">
                    Total Price
                  </span>
                  <p className="text-4xl font-black text-slate-900">
                    ${price.toFixed(2)}
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <p className="text-sm font-bold tracking-widest text-slate-400 uppercase">
                    Select Variant
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {variants.map((v) => (
                      <Button
                        key={v.id}
                        variant={
                          selectedVariant?.id === v.id ? 'default' : 'outline'
                        }
                        onClick={() => selectVariant(v.id)}
                        className="h-12 px-6 font-semibold transition-all hover:scale-105"
                      >
                        {v.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button className="w-full py-7 text-lg font-bold shadow-xl shadow-blue-500/20">
                  Add to Cart
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
