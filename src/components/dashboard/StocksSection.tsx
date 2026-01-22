import { AlertCircle, CheckCircle2 } from 'lucide-react'
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

export function StocksSection({
  products,
  lowStockItems,
  outOfStockItems,
}: StocksSectionProps) {
  const LOW_STOCK_THRESHOLD = 5

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Items across all products
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Low Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {lowStockItems}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Products below threshold
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">
              {outOfStockItems}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Items unavailable
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock Levels</CardTitle>
          <CardDescription>
            Current inventory status for all products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-sm text-muted-foreground"
                  >
                    <span className="inline-flex items-center justify-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      No products in stock.
                    </span>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => {
                  const status = getProductStatus(product)
                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        {product.productName}
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{product.stockQuantity}</span>
                          {Number(product.stockQuantity) <=
                            LOW_STOCK_THRESHOLD &&
                            Number(product.stockQuantity) > 0 && (
                              <AlertCircle className="h-4 w-4 text-yellow-600" />
                            )}
                          {Number(product.stockQuantity) === 0 && (
                            <AlertCircle className="h-4 w-4 text-destructive" />
                          )}
                          {Number(product.stockQuantity) >
                            LOW_STOCK_THRESHOLD && (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            status === 'In Stock'
                              ? 'default'
                              : status === 'Low Stock'
                                ? 'secondary'
                                : 'destructive'
                          }
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
