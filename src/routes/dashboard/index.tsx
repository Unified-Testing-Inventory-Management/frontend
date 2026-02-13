import { createFileRoute } from '@tanstack/react-router'
import { Activity, useState } from 'react'
import { AlertCircle, Bell, BellDot, PanelLeft } from 'lucide-react'
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
import { useProductSales, useProducts, useProductSights } from '@/data'
import { getStockAlertStatus } from '@/@types'
import type { SaleWithDetails, StockAlert } from '@/@types'
import { ProtectedRoute } from '@/middleware'
import TransactionSection from '@/components/dashboard/TransactionSection'
import ArchiveSection from '@/components/dashboard/ArchiveSection'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/dashboard/')({
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
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false)
  const { open } = React.useContext(SidebarContext)
  const { products } = useProducts()
  const { sales } = useProductSales()
  const { insights } = useProductSights()

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
          <Popover>
            <PopoverTrigger asChild>
              <div className='relative' onClick={() => setIsNotificationOpen(prev => !prev)} >
                <div className='absolute -top-3 left-2 bg-red-500 w-4.5 h-4.5 rounded-full flex justify-center items-center'>
                  <span className='text-white text-[10px] font-bold'>{Number(insights.length)}</span>
                </div>
                <Bell size={20} />
              </div>
            </PopoverTrigger>
            <PopoverContent className='mr-6 w-96 p-0'>
              <Activity mode={isNotificationOpen ? "visible" : "hidden"}>
                <div className='p-4'>
                  <header className='mb-4 pb-4 border-b'>
                    <div className='flex flex-row gap-2 items-center mb-2'>
                      <div className='p-1.5 rounded-lg bg-primary/10'>
                        <BellDot size={18} className='text-primary' />
                      </div>
                      <h1 className='text-lg font-semibold text-foreground'>Notifications</h1>
                    </div>
                    <p className='text-sm text-muted-foreground ml-10'>Important notifications about your inventory</p>
                  </header>
                  <div className='space-y-2 max-h-[400px] overflow-y-auto'>
                    {Number(insights.length) === 0 ? (
                      <div className='flex flex-col items-center justify-center py-8 text-center'>
                        <Bell size={32} className='text-muted-foreground mb-2 opacity-50' />
                        <p className='text-sm text-muted-foreground'>No notifications at this time</p>
                      </div>
                    ) : (
                      insights.map((item) => (
                        <div
                          key={item.productId}
                          className='group relative p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer'
                        >
                          <div className='flex items-start gap-3'>
                            <div className='mt-0.5 p-1.5 rounded-full bg-destructive/10 group-hover:bg-destructive/20 transition-colors'>
                              <AlertCircle size={16} className='text-destructive' />
                            </div>
                            <div className='flex-1 min-w-0'>
                              <div className='flex items-start justify-between gap-2 mb-1.5'>
                                <h3 className='font-semibold text-sm text-foreground leading-tight'>
                                  {item.productName}
                                </h3>
                                <Badge
                                  variant={item.stockQuantity === 0 ? 'destructive' : 'secondary'}
                                  className='shrink-0 text-xs'
                                >
                                  {item.status}
                                </Badge>
                              </div>
                              <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                                <span className='font-medium'>{item.stockQuantity}</span>
                                <span className='text-muted-foreground/60'>units remaining</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </Activity>
            </PopoverContent>
          </Popover>
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
