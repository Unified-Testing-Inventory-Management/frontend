import React from 'react'
import {
  Package,
  LayoutDashboard,
  ShoppingCart,
  TrendingUp,
  Users,
  User,
  LogOut,
  Activity,
  ArchiveIcon,
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
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { useLogoutUserMutation, UserData } from '@/services/user_services'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

interface DashboardSidebarProps {
  activeSection: 'overview' | 'products' | 'sales' | 'stocks' | 'settings' | 'transactions' | 'archive'
  onSectionChange: (section: 'overview' | 'products' | 'sales' | 'stocks' | 'settings' | 'transactions' | 'archive') => void
}

export function DashboardSidebar({ activeSection, onSectionChange }: DashboardSidebarProps) {
  const { open } = React.useContext(SidebarContext)
  const user = UserData()
  const navigate = useNavigate()
  const logout = useLogoutUserMutation()
  const queryClient = useQueryClient()

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

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', value: 'overview' },
    { icon: Package, label: 'Products', value: 'products' },
    { icon: ShoppingCart, label: 'Sales', value: 'sales' },
    { icon: TrendingUp, label: 'Stocks', value: 'stocks' },
    { icon: Activity, label: 'Transactions', value: 'transactions' },
  ]

  const othersItem = [
    { icon: ArchiveIcon, label: 'Archive', value: 'archive' }
  ]

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Package className="h-4 w-4" />
          </div>
          {open && (
            <div className="flex flex-col">
              <span className="font-semibold">StockWise</span>
              <span className="text-xs text-muted-foreground">Management</span>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {open && <SidebarGroupLabel>Dashboard</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu className={`${!open ? "flex flex-col justify-center items-center" : ""}`}>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton
                    onClick={() => onSectionChange(item.value as any)}
                    isActive={activeSection === item.value}
                    tooltip={!open ? item.label : undefined}
                    title={item.label}
                  >
                    <item.icon />
                    {open && <span>{item.label}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          {open && <SidebarGroupLabel>Others</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu className={`${!open ? "flex flex-col justify-center items-center" : ""}`}>
              {othersItem.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton
                    onClick={() => onSectionChange(item.value as any)}
                    isActive={activeSection === item.value}
                    tooltip={!open ? item.label : undefined}
                    title={item.label}
                  >
                    <item.icon />
                    {open && <span>{item.label}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
                  {open && (
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
                  )}
                </SidebarMenuButton>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2" align="end" side="top">
                <div className="flex flex-col gap-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      onSectionChange('settings')
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
  )
}
