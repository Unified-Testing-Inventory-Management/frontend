import { AlertCircle, Package, ShoppingCart, TrendingUp } from 'lucide-react'
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
      const dayKey = Number.isNaN(d.getTime()) ? sale.saleDate : d.toISOString().slice(0, 10)
      dayToRevenue.set(dayKey, (dayToRevenue.get(dayKey) ?? 0) + sale.totalAmount)
    }
    const fmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit' })
    return Array.from(dayToRevenue.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([day, revenue]) => {
        const d = new Date(day)
        return { day, label: Number.isNaN(d.getTime()) ? day : fmt.format(d), revenue: Number(revenue.toFixed(2)) }
      })
  })()

  const topSalesData = salesWithDetails
    .slice()
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, 10)
    .map((sale) => ({ sale: `#${sale.id}`, revenue: sale.totalAmount }))

  const statCards = [
    {
      label: 'Total Revenue',
      value: `₱${formatCurrency(totalRevenue)}`,
      sub: `From ${totalSales} sales`,
      icon: <span className="text-base font-bold text-zinc-400">₱</span>,
    },
    {
      label: 'Total Products',
      value: totalProducts,
      sub: 'Products in inventory',
      icon: <Package className="h-4 w-4 text-zinc-400" />,
    },
    {
      label: 'Low Stock',
      value: lowStockItems,
      sub: 'Items need restocking',
      icon: <AlertCircle className="h-4 w-4 text-amber-400" />,
      valueClass: 'text-amber-600',
    },
    {
      label: 'Out of Stock',
      value: outOfStockItems,
      sub: 'Items unavailable',
      icon: <AlertCircle className="h-4 w-4 text-red-400" />,
      valueClass: 'text-red-600',
    },
  ]

  return (
    <div className="space-y-5">
      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.label} className="border-zinc-100 shadow-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-zinc-500">{card.label}</CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold text-zinc-900 ${card.valueClass ?? ''}`}>
                {card.value}
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">{card.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-zinc-100 shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-zinc-900">Revenue Trend</CardTitle>
            <CardDescription className="text-zinc-400">Daily revenue from sales</CardDescription>
          </CardHeader>
          <CardContent>
            {revenueTrendData.length === 0 ? (
              <div className="flex h-52 items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-zinc-300">
                  <TrendingUp className="h-8 w-8" />
                  <p className="text-sm">No sales data yet</p>
                </div>
              </div>
            ) : (
              <ChartContainer className="h-52 w-full" config={{ revenue: { label: 'Revenue', color: 'hsl(var(--primary))' } }}>
                <AreaChart data={revenueTrendData} margin={{ left: 12, right: 12 }}>
                  <ChartGrid vertical={false} />
                  <ChartXAxis dataKey="label" tickMargin={8} />
                  <ChartYAxis tickMargin={8} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent formatter={(v) => { const n = typeof v === 'number' ? v : Number(v); return `₱${Number.isNaN(n) ? v : formatCurrency(n)}` }} />} />
                  <Area dataKey="revenue" type="monotone" fill="var(--color-revenue)" fillOpacity={0.1} stroke="var(--color-revenue)" strokeWidth={2} />
                </AreaChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-zinc-100 shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-zinc-900">Top Sales</CardTitle>
            <CardDescription className="text-zinc-400">Highest-revenue transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {topSalesData.length === 0 ? (
              <div className="flex h-52 items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-zinc-300">
                  <ShoppingCart className="h-8 w-8" />
                  <p className="text-sm">No sales data yet</p>
                </div>
              </div>
            ) : (
              <ChartContainer className="h-52 w-full" config={{ revenue: { label: 'Revenue', color: 'hsl(var(--primary))' } }}>
                <BarChart data={topSalesData} margin={{ left: 12, right: 12 }}>
                  <ChartGrid vertical={false} />
                  <ChartXAxis dataKey="sale" tickMargin={8} />
                  <ChartYAxis tickMargin={8} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent formatter={(v) => { const n = typeof v === 'number' ? v : Number(v); return `₱${Number.isNaN(n) ? formatCurrency(v) : formatCurrency(n)}` }} />} />
                  <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tables */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-zinc-100 shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-zinc-900">Recent Sales</CardTitle>
            <CardDescription className="text-zinc-400">Latest transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-100">
                    {['Product', 'User ID', 'Amount', 'Date'].map((h) => (
                      <TableHead key={h} className="text-xs text-zinc-400 font-medium">{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesWithDetails.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        <div className="flex flex-col items-center gap-2 text-zinc-300">
                          <ShoppingCart className="h-7 w-7" />
                          <p className="text-sm">No recent sales</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    salesWithDetails.slice(0, 10).map((sale) => (
                      <TableRow key={sale.id} className="border-zinc-50">
                        <TableCell className="text-sm font-medium text-zinc-900">
                          {sale.saleDetails.map((i) => i.productName).join(', ')}
                        </TableCell>
                        <TableCell className="text-sm text-zinc-500">{sale.userId}</TableCell>
                        <TableCell className="text-sm text-zinc-900 font-medium">₱{formatCurrency(sale.totalAmount)}</TableCell>
                        <TableCell className="text-xs text-zinc-400">{formatDateTime(sale.saleDate)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-100 shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-zinc-900">Stock Alerts</CardTitle>
            <CardDescription className="text-zinc-400">Items requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 overflow-y-auto space-y-2">
              {!stockAlerts || stockAlerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 h-full text-zinc-300">
                  <AlertCircle className="h-7 w-7" />
                  <p className="text-sm">No stock alerts</p>
                </div>
              ) : (
                stockAlerts.map((alert, index) => (
                  <div key={index} className="flex items-center justify-between rounded-lg border border-zinc-100 px-3 py-2.5">
                    <div>
                      <p className="text-sm font-medium text-zinc-900">{alert.productName}</p>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Current: {alert.current} · Min: {alert.minimum}
                      </p>
                    </div>
                    <Badge
                      variant={alert.status === 'Out' ? 'destructive' : 'secondary'}
                      className="text-xs"
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
