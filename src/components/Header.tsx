import { Link } from 'react-router-dom'
import { ShoppingCart, Box } from 'lucide-react'
import { Button } from './ui/button'

export default function Header() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-black">
          <Box className="h-6 w-6 text-blue-600" />
          <span>
            <span className="text-blue-600">3D</span> Shop Visualizer
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link to="/">Catalog</Link>
          </Button>
          <Button variant="outline" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
              0
            </span>
          </Button>
        </div>
      </div>
    </nav>
  )
}
