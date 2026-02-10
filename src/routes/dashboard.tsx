import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Bell, PanelLeft } from 'lucide-react'
import {
  SidebarContext,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import React from 'react'
import { OverviewSection } from '@/components/dashboard/OverviewSection'
import { ProductsSection } from '@/components/dashboard/ProductsSection'
import { SalesSection } from '@/components/dashboard/SalesSection'
import { StocksSection } from '@/components/dashboard/StocksSection'
import { SettingsSection } from '@/components/dashboard/SettingsSection'
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar'
import { useProductSales } from '@/data'
import { useProducts } from '@/data'
import { getStockAlertStatus } from '@/@types'
import type { SaleWithDetails, StockAlert } from '@/@types'
import { ProtectedRoute } from '@/middleware'
import TransactionSection from '@/components/dashboard/TransactionSection'
import ArchiveSection from '@/components/dashboard/ArchiveSection'

export const Route = createFileRoute('/dashboard')({
  component: () => (
    <ProtectedRoute>
      <RouteComponent />
    </ProtectedRoute>
  ),
})

function RouteComponent() {
  const [activeSection, setActiveSection] = useState<
    'overview' | 'products' | 'sales' | 'stocks' | 'settings' | 'transactions' | 'archive'
  >('overview')

  return (
    <SidebarProvider className='flex flex-row relative' data-collapsible="icon">
      <DashboardContent activeSection={activeSection} setActiveSection={setActiveSection} />
    </SidebarProvider>
  )
}

function DashboardContent({ activeSection, setActiveSection }: {
  activeSection: 'overview' | 'products' | 'sales' | 'stocks' | 'settings' | 'transactions' | 'archive'
  setActiveSection: (section: 'overview' | 'products' | 'sales' | 'stocks' | 'settings' | 'transactions' | 'archive') => void
}) {
  const { open } = React.useContext(SidebarContext)
  const { products } = useProducts()
  const { sales } = useProductSales()

  const salesWithDetails: SaleWithDetails[] = sales.map((sale) => {
    const details = sales.filter((sd) => sd.id === sale.id)
    const saleItems = details.map((detail) => {
      const product = products.find((p) => p.id === detail.id)
      return {
        ...detail,
        productName: product?.productName || 'Unknown Product',
      }
    })
    return {
      ...sale,
      Items: saleItems,
    }
  })

  const stockAlerts: StockAlert[] = products
    .filter((p) => Number(p.stockQuantity) <= 5)
    .map((p) => ({
      id: Number(p.id),
      productName: p.productName,
      current: Number(p.stockQuantity),
      minimum: 5,
      status: getStockAlertStatus(p),
    }))


  const totalRevenue = sales.reduce((sum, sale) => sum + Number(sale.totalAmount), 0)
  const totalProducts = products.length
  const lowStockItems = products.filter(
    (p) => Number(p.stockQuantity) <= 5 && Number(p.stockQuantity) > 0,
  ).length
  const outOfStockItems = products.filter(
    (p) => Number(p.stockQuantity) === 0,
  ).length
  const totalSales = sales.length

  return (
    <>
      <DashboardSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <SidebarInset className={`flex-1 transition-[margin] duration-300 ease-linear ${open ? 'lg:ml-[var(--sidebar-width)]' : 'lg:ml-[var(--sidebar-width-icon)]'}`}>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <div className="flex flex-1 items-center gap-2">
            <SidebarTrigger>
              <PanelLeft className="h-4 w-4" />
            </SidebarTrigger>
            <h1 className="text-lg font-semibold">
              {activeSection === 'overview' && 'Dashboard Overview'}
              {activeSection === 'products' && 'Products Management'}
              {activeSection === 'sales' && 'Sales Overview'}
              {activeSection === 'stocks' && 'Stock Management'}
              {activeSection === 'settings' && 'My Account'}
              {activeSection === 'transactions' && 'Transactions'}
              {activeSection === 'archive' && 'Archive Management'}
            </h1>
          </div>
          <Bell size={20} />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 overflow-auto">
          {activeSection === 'overview' && (
            <OverviewSection
              totalRevenue={totalRevenue}
              totalSales={totalSales}
              totalProducts={totalProducts}
              lowStockItems={lowStockItems}
              outOfStockItems={outOfStockItems}
              salesWithDetails={salesWithDetails}
              stockAlerts={stockAlerts}
            />
          )}

          {activeSection === 'products' && (
            <ProductsSection />
          )}

          {activeSection === 'sales' && (
            <SalesSection />
          )}

          {activeSection === 'stocks' && (
            <StocksSection
              products={products}
              lowStockItems={lowStockItems}
              outOfStockItems={outOfStockItems}
            />
          )}

          {activeSection === 'settings' && <SettingsSection />}

          {activeSection === 'transactions' && (
            <TransactionSection />
          )}

          {activeSection === 'archive' && (<ArchiveSection />)}
        </div>
      </SidebarInset>
    </>
  )
}
