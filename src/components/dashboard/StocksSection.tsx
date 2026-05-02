import { AlertCircle, CheckCircle2, Package } from 'lucide-react'
import type { Product } from '@/@types'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { getProductStatus } from '@/@types'

interface StocksSectionProps {
  products: Array<Product>
  lowStockItems: number
  outOfStockItems: number
}

export function StocksSection({ products, lowStockItems, outOfStockItems }: StocksSectionProps) {
  const LOW_STOCK_THRESHOLD = 5

  const statCards = [
    {
      label: 'Total Items',
      value: products.length,
      sub: 'Across all products',
    },
    {
      label: 'Low Stock',
      value: lowStockItems,
      sub: 'Below threshold',
      valueClass: 'text-amber-600',
    },
    {
      label: 'Out of Stock',
      value: outOfStockItems,
      sub: 'Unavailable items',
      valueClass: 'text-red-600',
    },
  ]

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        {statCards.map((card) => (
          <Card key={card.label} className="border-zinc-100 shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500">{card.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold text-zinc-900 ${card.valueClass ?? ''}`}>
                {card.value}
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">{card.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-zinc-100 shadow-none">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-zinc-900">Stock Levels</CardTitle>
          <CardDescription className="text-zinc-400">Current inventory status for all products</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-100">
                {['Product', 'Category', 'Stock', 'Status'].map((h) => (
                  <TableHead key={h} className="text-xs text-zinc-400 font-medium">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    <div className="flex flex-col items-center gap-2 text-zinc-300">
                      <Package className="h-7 w-7" />
                      <p className="text-sm">No products in stock</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => {
                  const status = getProductStatus(product)
                  return (
                    <TableRow key={product.id} className="border-zinc-50">
                      <TableCell className="font-medium text-zinc-900">{product.productName}</TableCell>
                      <TableCell className="text-zinc-500">{product.category}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-900 font-medium">{product.stockQuantity}</span>
                          {Number(product.stockQuantity) <= LOW_STOCK_THRESHOLD && Number(product.stockQuantity) > 0 && (
                            <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                          )}
                          {Number(product.stockQuantity) === 0 && (
                            <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                          )}
                          {Number(product.stockQuantity) > LOW_STOCK_THRESHOLD && (
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={status === 'In Stock' ? 'default' : status === 'Low Stock' ? 'secondary' : 'destructive'}
                          className="text-xs"
                        >
                          {status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
