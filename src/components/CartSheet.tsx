import { useEffect } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useCartStore } from '../store/useCartStore'
import { ShoppingCart, Trash2, Plus, Minus, Package } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function CartSheet() {
  const { items, fetchItems, updateQuantity, removeItem } = useCartStore()

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const total = items.reduce(
    (sum, item) => sum + (item.unit_price || 0) * item.quantity,
    0,
  )
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center bg-blue-600 p-0">
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Cart
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center space-y-4 text-slate-500">
              <Package className="h-12 w-12 opacity-20" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    <img
                      src={item.thumbnail}
                      alt={item.product_name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between">
                      <h4 className="text-sm font-bold">{item.product_name}</h4>
                      <p className="font-mono text-sm font-bold">
                        ${((item.unit_price || 0) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <p className="text-xs text-slate-500">
                      {item.variant_name}
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-md border">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-xs font-bold">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:text-destructive h-8 w-8 text-slate-400"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="space-y-4 pt-6">
            <Separator />
            <div className="flex items-end justify-between">
              <span className="text-sm text-slate-500">Subtotal</span>
              <span className="text-2xl font-black text-slate-900">
                ${total.toFixed(2)}
              </span>
            </div>
            <SheetFooter>
              <Button className="w-full bg-blue-600 py-6 text-lg font-bold shadow-lg shadow-blue-500/20">
                Checkout
              </Button>
            </SheetFooter>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
