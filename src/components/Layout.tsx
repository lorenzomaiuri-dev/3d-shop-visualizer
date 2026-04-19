import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { useAppStore } from '../store/useAppStore'
import { Skeleton } from '@/components/ui/skeleton'

export default function Layout() {
  const { isDbReady, isLoading, error, initialize } = useAppStore()

  useEffect(() => {
    if (!isDbReady) {
      initialize()
    }
  }, [isDbReady, initialize])

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <h1 className="mb-2 text-2xl font-bold text-red-600">
          Database Initialization Failed
        </h1>
        <p className="text-slate-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      <Header />
      <main className="container mx-auto flex-grow px-4 py-8 md:py-12">
        {!isDbReady || isLoading ? (
          <div className="space-y-8">
            <Skeleton className="h-12 w-1/3" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="aspect-[4/5] rounded-xl" />
              ))}
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
      <Footer />
    </div>
  )
}
