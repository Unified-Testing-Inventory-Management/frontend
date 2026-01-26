import { ShoppingCart } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { SaleWithDetails } from '@/@types'
import { formatDateTime } from '@/utils/formatDateTime'
import { formatCurrency } from '@/utils/formatCurrency'
import { Input } from '../ui/input'
import { useMemo, useState } from 'react'

interface SalesSectionProps {
  salesWithDetails: Array<SaleWithDetails>
}

export function SalesSection({ salesWithDetails }: SalesSectionProps) {
  const [search, setSearch] = useState<string>("")

  //Filtered product base on the search
  const filteredSaleProduct = useMemo(() => {
    const query = search.toLowerCase().trim()

    if (!query) return salesWithDetails

    return salesWithDetails.filter((sale) =>
      sale.saleDetails.some((item) =>
        item.productName?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query)
      )
    )
  }, [search, salesWithDetails])

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>Complete sales transaction history</CardDescription>
          <div className='w-sm'>
            <Input className='py-6 px-4' placeholder='Search product sale...' onChange={(e) => setSearch(e.target.value)}></Input>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative max-h-180 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {[
                    "Sale ID",
                    "User ID",
                    "Products",
                    "Category",
                    "Quantity",
                    "Total Amount",
                    "Sale Date",
                  ].map((item) => (
                    <TableHead
                      key={item}
                      className="sticky top-0 z-10 bg-white"
                    >
                      {item}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSaleProduct.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.id}</TableCell>
                    <TableCell>{sale.userId}</TableCell>

                    <TableCell>
                      {sale.saleDetails.map((item, idx) => (
                        <div key={idx} className="text-sm">
                          {item.productName} (&#8369;{formatCurrency(item.price)})
                        </div>
                      ))}
                    </TableCell>

                    <TableCell>
                      {sale.saleDetails.map((item, idx) => (
                        <div key={idx}>{item.category}</div>
                      ))}
                    </TableCell>

                    <TableCell>
                      {sale.saleDetails.reduce(
                        (sum, item) => sum + item.quantity,
                        0
                      )}
                    </TableCell>

                    <TableCell>
                      &#8369;{formatCurrency(sale.totalAmount)}
                    </TableCell>

                    <TableCell>
                      {formatDateTime(sale.saleDate)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div>
            {salesWithDetails.length == 0 && (
              <div className="w-full h-90 mt-5 flex flex-col justify-center items-center gap-2 py-4">
                <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Don't have sales right now.
                </span>
              </div>
            )}
            {filteredSaleProduct.length == 0 && (
              <div className="w-full h-90 mt-5 flex flex-col justify-center items-center gap-2 py-4">
                <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  No products found for "{search}"
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
