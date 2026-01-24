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

interface SalesSectionProps {
  salesWithDetails: Array<SaleWithDetails>
}

export function SalesSection({ salesWithDetails }: SalesSectionProps) {

  return (
    <div className="space-y-4">
      <Card className='h-150'>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>Complete sales transaction history</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sale ID</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Sale Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesWithDetails.map((sale) => (
                <TableRow key={sale.Id}>
                  <TableCell className="font-medium">#{sale.Id}</TableCell>
                  <TableCell>User #{sale.UserId}</TableCell>
                  <TableCell>
                    {sale.Items.map((item, idx) => (
                      <div key={idx} className="text-sm">
                        {item.ProductName} (${item.Price.toFixed(2)})
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    {sale.Items.reduce((sum, item) => sum + item.Quantity, 0)}
                  </TableCell>
                  <TableCell>${sale.TotalAmount}</TableCell>
                  <TableCell>{sale.SaleDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div>
            {salesWithDetails.length == 0 && (
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
