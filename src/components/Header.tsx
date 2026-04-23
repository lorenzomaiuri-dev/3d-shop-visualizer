import { Link } from 'react-router-dom'
import { Box } from 'lucide-react'
import { Button } from './ui/button'
import CartSheet from './CartSheet'

export default function Header() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
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
          <CartSheet />
        </div>
      </div>
    </nav>
  )
}
