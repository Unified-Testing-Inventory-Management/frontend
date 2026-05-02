import { ShoppingCart, Search } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDateTime } from '@/utils/formatDateTime'
import { formatCurrency } from '@/utils/formatCurrency'
import { Input } from '../ui/input'
import { useState } from 'react'
import { useProductSales } from '@/data'

export function SalesSection() {
  const [searchInput, setSearchInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const { sales } = useProductSales(searchTerm)

  return (
    <div className="space-y-4">
      <Card className="border-zinc-100 shadow-none">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-base font-semibold text-zinc-900">Sales Overview</CardTitle>
              <CardDescription className="text-zinc-400">Complete sales transaction history</CardDescription>
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); setSearchTerm(searchInput) }}
              className="flex items-center gap-2"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                <Input
                  className="pl-9 h-9 w-64 rounded-lg bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-300 focus-visible:border-zinc-900 focus-visible:ring-zinc-900/10"
                  placeholder="Search product sale..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="h-9 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </CardHeader>
        <CardContent>
          {sales.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-20 text-zinc-300">
              <ShoppingCart className="h-8 w-8" />
              <p className="text-sm">No sales yet</p>
            </div>
          ) : (
            <div className="relative max-h-[600px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-100">
                    {['Sale ID', 'Products', 'Category', 'Qty', 'Total', 'Date'].map((h) => (
                      <TableHead key={h} className="sticky top-0 bg-white text-xs text-zinc-400 font-medium z-10">{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.map((sale) => (
                    <TableRow key={sale.id} className="border-zinc-50">
                      <TableCell className="font-medium text-zinc-900">#{sale.id}</TableCell>
                      <TableCell>
                        {sale.saleDetails.map((item, idx) => (
                          <div key={idx} className="text-sm text-zinc-700">
                            {item.productName}
                            <span className="text-zinc-400 ml-1">(₱{formatCurrency(item.price)})</span>
                          </div>
                        ))}
                      </TableCell>
                      <TableCell>
                        {sale.saleDetails.map((item, idx) => (
                          <div key={idx} className="text-sm text-zinc-500">{item.category}</div>
                        ))}
                      </TableCell>
                      <TableCell className="text-zinc-700">
                        {sale.saleDetails.reduce((sum, item) => sum + item.quantity, 0)}
                      </TableCell>
                      <TableCell className="font-semibold text-zinc-900">
                        ₱{formatCurrency(sale.totalAmount)}
                      </TableCell>
                      <TableCell className="text-xs text-zinc-400">
                        {formatDateTime(sale.saleDate)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
