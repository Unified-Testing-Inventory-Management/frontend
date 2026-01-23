import { createFileRoute, useNavigate } from '@tanstack/react-router'
import React, { useState } from 'react'
import {
  BarChart3,
  Settings,
  Package,
  LayoutDashboard,
  ShoppingCart,
  TrendingUp,
  Users,
  User,
  LogOut,
  Activity
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarContext,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { OverviewSection } from '@/components/dashboard/OverviewSection'
import { ProductsSection } from '@/components/dashboard/ProductsSection'
import { SalesSection } from '@/components/dashboard/SalesSection'
import { StocksSection } from '@/components/dashboard/StocksSection'
import { SettingsSection } from '@/components/dashboard/SettingsSection'
import { saleDetails, useProductSales } from '@/data/dashboard-data'
import { useProducts } from '@/data/dashboard-data'
import { getStockAlertStatus } from '@/@types'
import type { SaleWithDetails, StockAlert } from '@/@types'
import { ProtectedRoute } from '@/middleware'
import { useLogoutUserMutation, UserData } from '@/services/user_services'
import { useQueryClient } from '@tanstack/react-query'
import TransactionSection from '@/components/dashboard/TransactionSection'

export const Route = createFileRoute('/dashboard')({
  component: () => (
    <ProtectedRoute>
      <RouteComponent />
    </ProtectedRoute>
  ),
})

function RouteComponent() {
  const [activeSection, setActiveSection] = useState<
    'overview' | 'products' | 'sales' | 'stocks' | 'settings' | 'transactions'
  >('overview')
  const { open: sidebarOpen } = React.useContext(SidebarContext)
  const user = UserData()
  const navigate = useNavigate()
  const logout = useLogoutUserMutation()
  const queryClient = useQueryClient()
  const { products } = useProducts()
  const { sales } = useProductSales();

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault()

    logout.mutateAsync(undefined, {
      onSuccess: () => {
        queryClient.clear()
        navigate({ to: '/' })
      },
      onError: (err: any) => {
        if (err.response) {
          console.log(err.response?.data.error)
        }
      },
    })
  }

  const salesWithDetails: SaleWithDetails[] = sales.map((sale) => {
    const details = saleDetails.filter((sd) => sd.SaleId === sale.Id)
    const saleItems = details.map((detail) => {
      const product = products.find((p) => p.id === detail.ProductId)
      return {
        ...detail,
        ProductName: product?.productName || 'Unknown Product',
      }
    })
    return {
      ...sale,
      Items: saleItems,
    }
  })

  const stockAlerts: StockAlert[] = products
    .filter((p) => Number(p.stockQuantity) <= 10)
    .map((p) => ({
      id: Number(p.id),
      productName: p.productName,
      current: Number(p.stockQuantity),
      min: 10,
      status: getStockAlertStatus(p),
    }))


  const totalRevenue = sales.reduce((sum, sale) => sum + sale.TotalAmount, 0)
  const totalProducts = products.length
  const lowStockItems = products.filter(
    (p) => Number(p.stockQuantity) <= 5 && Number(p.stockQuantity) > 0,
  ).length
  const outOfStockItems = products.filter(
    (p) => Number(p.stockQuantity) === 0,
  ).length
  const totalSales = sales.length

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', value: 'overview' },
    { icon: Package, label: 'Products', value: 'products' },
    { icon: ShoppingCart, label: 'Sales', value: 'sales' },
    { icon: TrendingUp, label: 'Stocks', value: 'stocks' },
    { icon: Activity, label: 'Transactions', value: 'transactions' },
  ]

  return (
    <SidebarProvider>
      <Sidebar className="border-r w-52">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Package className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">Inventory</span>
              <span className="text-xs text-muted-foreground">Management</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.value}>
                    <SidebarMenuButton
                      onClick={() => setActiveSection(item.value as any)}
                      isActive={activeSection === item.value}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>System</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <BarChart3 />
                    <span>Analytics</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Settings />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <Popover>
                <PopoverTrigger asChild>
                  <SidebarMenuButton size="lg">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                      <Users className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user
                          ? `${user.firstName} ${user.lastName}`
                          : 'Admin User'}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {user ? user.username : 'admin@example.com'}
                      </span>
                    </div>
                  </SidebarMenuButton>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2" align="end" side="top">
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        setActiveSection('settings')
                      }}
                    >
                      <User className="mr-2 h-4 w-4" />
                      My Account
                    </Button>
                    <form onSubmit={handleLogout}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-destructive hover:text-destructive"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </form>
                  </div>
                </PopoverContent>
              </Popover>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset
        className={`transition-[margin] duration-300 ease-linear ${sidebarOpen ? 'lg:ml-[var(--sidebar-width)]' : 'lg:ml-[var(--sidebar-width-icon)]'}`}
      >
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <div className="flex flex-1 items-center gap-2">
            <h1 className="text-lg font-semibold">
              {activeSection === 'overview' && 'Dashboard Overview'}
              {activeSection === 'products' && 'Products Management'}
              {activeSection === 'sales' && 'Sales Overview'}
              {activeSection === 'stocks' && 'Stock Management'}
              {activeSection === 'settings' && 'My Account'}
              {activeSection === 'transactions' && 'Transactions'}
            </h1>
          </div>
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
            <ProductsSection products={products} />
          )}

          {activeSection === 'sales' && (
            <SalesSection salesWithDetails={salesWithDetails} />
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
            <TransactionSection products={products} />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
