import { useEffect } from 'react'
import { initDatabase } from './services/database'
import { useConfiguratorStore } from './store/useConfiguratorStore'
import Scene from './features/configurator/components/Scene'

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
    initDatabase().then(() => {
      fetchInitialData()
    })
  }, [fetchInitialData])

  if (isLoading) {
    return (
      <main className="mx-auto flex items-center justify-center p-8">
        <p className="font-mono text-xl">Initializing 3D Visualizer...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="mx-auto flex items-center justify-center p-8 text-red-500">
        <p className="text-xl">Error: {error}</p>
      </main>
    )
  }

  return (
    <main className="mx-auto p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight">
          3D Shop Visualizer
        </h1>
        <p className="text-slate-200">Local-First SQL Configurator</p>
      </header>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Scene />

        <div className="flex flex-col justify-center gap-6">
          <div>
            <h2 className="text-2xl font-bold">{product?.name}</h2>
            <p className="mt-2 font-mono text-3xl">${price.toFixed(2)}</p>
          </div>

          <div className="flex gap-4">
            {variants.map((v) => (
              <button
                key={v.id}
                onClick={() => selectVariant(v.id)}
                className={`rounded-md px-4 py-2 transition-all ${
                  selectedVariant?.id === v.id
                    ? 'scale-105 bg-black text-white shadow-lg'
                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                }`}
              >
                {v.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

export default App
