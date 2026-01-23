import { createFileRoute } from '@tanstack/react-router'
import { StocksSection } from '@/components/dashboard/StocksSection'
import { useProducts } from '@/data/dashboard-data'
import type { Product } from '@/@types'

export const Route = createFileRoute('/stocks')({
  component: StocksRouteComponent,
})

function StocksRouteComponent() {
  const { products } = useProducts()
  // Calculate stock statistics
  const lowStockItems = products.filter(
    (p: Product) => Number(p.stockQuantity) <= Number(p.stockQuantity)
  ).length
  const outOfStockItems = products.filter((p: Product) => Number(p.stockQuantity) === 0).length

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Stock Management</h1>
        <p className="text-muted-foreground mt-2">Monitor and manage your inventory levels</p>
      </div>
      <StocksSection
        products={products}
        lowStockItems={lowStockItems}
        outOfStockItems={outOfStockItems}
      />
    </div>
  )
}
