import React from 'react'
import {
  Package,
  LayoutDashboard,
  ShoppingCart,
  TrendingUp,
  Activity,
  ArchiveIcon,
  Users,
  User,
  LogOut,
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
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
    })
  }

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview',     value: 'overview'      },
    { icon: Package,         label: 'Products',     value: 'products'      },
    { icon: ShoppingCart,    label: 'Sales',        value: 'sales'         },
    { icon: TrendingUp,      label: 'Stocks',       value: 'stocks'        },
    { icon: Activity,        label: 'Transactions', value: 'transactions'  },
  ]

  const othersItems = [
    { icon: ArchiveIcon, label: 'Archive', value: 'archive' },
  ]

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2.5 px-2 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white shrink-0">
            <Package className="h-4 w-4" />
          </div>
          {open && (
            <div className="flex flex-col">
              <span className="font-semibold text-zinc-900 text-sm">StockWise</span>
              <span className="text-xs text-zinc-400">Management</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {open && <SidebarGroupLabel className="text-xs text-zinc-400 uppercase tracking-widest px-2">Dashboard</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu className={!open ? 'flex flex-col items-center' : ''}>
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
          {open && <SidebarGroupLabel className="text-xs text-zinc-400 uppercase tracking-widest px-2">Others</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu className={!open ? 'flex flex-col items-center' : ''}>
              {othersItems.map((item) => (
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
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-zinc-900 text-white shrink-0">
                    <Users className="size-4" />
                  </div>
                  {open && (
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold text-zinc-900">
                        {user ? `${user.firstName} ${user.lastName}` : 'Admin User'}
                      </span>
                      <span className="truncate text-xs text-zinc-400">
                        {user ? user.username : 'admin'}
                      </span>
                    </div>
                  )}
                </SidebarMenuButton>
              </PopoverTrigger>
              <PopoverContent className="w-52 p-1.5" align="end" side="top">
                <div className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    onClick={() => onSectionChange('settings')}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 transition-colors w-full text-left"
                  >
                    <User className="h-4 w-4 text-zinc-400" />
                    My Account
                  </button>
                  <form onSubmit={handleLogout}>
                    <button
                      type="submit"
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
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
