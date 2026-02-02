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
import { formatDateTime } from '@/utils/formatDateTime'
import { formatCurrency } from '@/utils/formatCurrency'
import { Input } from '../ui/input'
import { useState } from 'react'
import { useProductSales } from '@/data'
import { Button } from '../ui/button'

export function SalesSection() {
  const [searchInput, setSearchInput] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const { sales } = useProductSales(searchTerm)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription className='-mt-1'>Complete sales transaction history</CardDescription>
          <form onSubmit={(e) => {
            e.preventDefault();
            setSearchTerm(searchInput)
          }} method="post">
            <div className='flex flex-row gap-2'>
              <div className='w-sm'>
                <Input className='py-6 px-4' placeholder='Search product sale...' onChange={(e) => setSearchInput(e.target.value)} />
              </div>
              <Button className='py-6 px-6'>
                Search
              </Button>
            </div>
          </form>
        </CardHeader>
        <CardContent>
          <div className="relative max-h-180 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {[
                    "Sale ID",
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
                {sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.id}</TableCell>
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
            {sales.length == 0 && (
              <div className="w-full h-90 mt-5 flex flex-col justify-center items-center gap-2 py-4">
                <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Don't have sales right now.
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
