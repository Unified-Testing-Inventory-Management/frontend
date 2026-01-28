import { AlertCircle, Package, ShoppingCart } from 'lucide-react'
import type { SaleWithDetails, StockAlert } from '@/@types'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartGrid,
  ChartTooltip,
  ChartTooltipContent,
  ChartXAxis,
  ChartYAxis,
} from '@/components/ui/chart'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Area, AreaChart, Bar, BarChart } from 'recharts'
import { formatDateTime } from '@/utils/formatDateTime'
import { formatCurrency } from '@/utils/formatCurrency'

interface OverviewSectionProps {
  totalRevenue: number
  totalSales: number
  totalProducts: number
  lowStockItems: number
  outOfStockItems: number
  salesWithDetails: Array<SaleWithDetails>
  stockAlerts: Array<StockAlert>
}

export function OverviewSection({
  totalRevenue,
  totalSales,
  totalProducts,
  lowStockItems,
  outOfStockItems,
  salesWithDetails,
  stockAlerts,
}: OverviewSectionProps) {
  const revenueTrendData = (() => {
    const dayToRevenue = new Map<string, number>()

    for (const sale of salesWithDetails) {
      const d = new Date(sale.saleDate)
      const dayKey = Number.isNaN(d.getTime())
        ? sale.saleDate
        : d.toISOString().slice(0, 10)

      dayToRevenue.set(dayKey, (dayToRevenue.get(dayKey) ?? 0) + sale.totalAmount)
    }

    const fmt = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
    })

    return Array.from(dayToRevenue.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([day, revenue]) => {
        const d = new Date(day)
        return {
          day,
          label: Number.isNaN(d.getTime()) ? day : fmt.format(d),
          revenue: Number(revenue.toFixed(2)),
        }
      })
  })()

  const topSalesData = salesWithDetails
    .slice()
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, 10)
    .map((sale) => ({
      sale: `#${sale.id}`,
      revenue: sale.totalAmount,
    }))

  return (
    <div className="space-y-4">
      {/* Top Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

        {/* Total Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <span className='h-4 w-4 text-muted-foreground'>&#8369;</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              &#8369;
              {formatCurrency(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              From {totalSales} sales
            </p>
          </CardContent>
        </Card>

        {/* Total Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Products in inventory
            </p>
          </CardContent>
        </Card>

        {/* Low Stock Items */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock Items
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">
              Items need restocking
            </p>
          </CardContent>
        </Card>

        {/* Out of Stock */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {outOfStockItems}
            </div>
            <p className="text-xs text-muted-foreground">Items unavailable</p>
          </CardContent>
        </Card>
      </div>

      {/* Center Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/*Revenue Trend*/}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Revenue by day (from sales)</CardDescription>
          </CardHeader>
          <CardContent>
            {revenueTrendData.length === 0 ? (
              <div className="flex h-55 items-center justify-center text-sm text-muted-foreground">
                No sales yet — revenue trend will appear here.
              </div>
            ) : (
              <ChartContainer
                className="h-55 w-full"
                config={{
                  revenue: {
                    label: 'Revenue',
                    color: 'hsl(var(--primary))',
                  },
                }}
              >
                <AreaChart data={revenueTrendData} margin={{ left: 12, right: 12 }}>
                  <ChartGrid vertical={false} />
                  <ChartXAxis dataKey="label" tickMargin={8} />
                  <ChartYAxis tickMargin={8} />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        formatter={(value) => {
                          const n = typeof value === 'number' ? value : Number(value)
                          return `₱${Number.isNaN(n) ? value : formatCurrency(n)}`
                        }}
                      />
                    }
                  />
                  <Area
                    dataKey="revenue"
                    type="monotone"
                    fill="var(--color-revenue)"
                    fillOpacity={0.25}
                    stroke="var(--color-revenue)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/*Top Sales*/}
        <Card>
          <CardHeader>
            <CardTitle>Top Sales</CardTitle>
            <CardDescription>Highest-revenue sales</CardDescription>
          </CardHeader>
          <CardContent>
            {topSalesData.length === 0 ? (
              <div className="flex h-55 items-center justify-center text-sm text-muted-foreground">
                No sales yet — top sales will appear here.
              </div>
            ) : (
              <ChartContainer
                className="h-55 w-full"
                config={{
                  revenue: {
                    label: 'Revenue',
                    color: 'hsl(var(--primary))',
                  },
                }}
              >
                <BarChart data={topSalesData} margin={{ left: 12, right: 12 }}>
                  <ChartGrid vertical={false} />
                  <ChartXAxis dataKey="sale" tickMargin={8} />
                  <ChartYAxis tickMargin={8} />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        formatter={(value) => {
                          const n = typeof value === 'number' ? value : Number(value)
                          return `₱${Number.isNaN(n) ? formatCurrency(value) : formatCurrency(n)}`
                        }}
                      />
                    }
                  />
                  <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Sales Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>Latest transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-70 overflow-y-scroll">
              <Table>
                <TableHeader>
                  <TableRow>
                    {["Product", "User ID", "Amount", "Sale Date"].map((item) => (
                      <TableHead className="w-50" key={item}>{item}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    salesWithDetails.length == 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          <div className="flex flex-col items-center justify-center gap-2 py-4">
                            <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              No recent sales to display.
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      salesWithDetails.slice(0, 10)
                        .map((sale) => (
                          <TableRow key={sale.id}>
                            <TableCell className="font-medium">
                              {sale.saleDetails.map((item) => item.productName).join(', ')}
                            </TableCell>
                            <TableCell>{sale.userId}</TableCell>
                            <TableCell>&#8369;{formatCurrency(sale.totalAmount)}</TableCell>
                            <TableCell>{formatDateTime(sale.saleDate)}</TableCell>
                          </TableRow>
                        ))
                    )
                  }
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Stock Alert Table */}
        <Card>
          <CardHeader>
            <CardTitle>Stock Alerts</CardTitle>
            <CardDescription>Items requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 h-70 overflow-auto">
              {!stockAlerts || stockAlerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-4 h-full">
                  <AlertCircle className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No stock alerts to display.
                  </p>
                </div>
              ) : (
                stockAlerts.map((alert,index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{alert.productName}</p>
                      <p className="text-xs text-muted-foreground">
                        Current: {alert.current} | Min: {alert.minimum}
                      </p>
                    </div>
                    <Badge
                      variant={
                        alert.status === 'Out' ? 'destructive' : 'secondary'
                      }
                    >
                      {alert.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
