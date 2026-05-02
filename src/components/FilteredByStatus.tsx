import { ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import type { TFilterStatus } from '@/@types'

interface FilteredByStatusProps {
  filterStatus: TFilterStatus
  setFilterStatus: (value: TFilterStatus) => void
  totalFiltered: number
}

const FILTERS = [
  { label: 'All', value: 'All' },
  { label: 'In Stock', value: 'In Stock' },
  { label: 'Low Stock', value: 'Low Stock' },
  { label: 'Out of Stock', value: 'Out of Stock' },
] as const

function FilteredByStatus({ filterStatus, setFilterStatus, totalFiltered }: FilteredByStatusProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 transition-colors">
          <span className="text-zinc-400">Filter:</span>
          <span className="font-medium text-zinc-900">{filterStatus}</span>
          <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-xs font-semibold text-zinc-700">
            {totalFiltered}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" sideOffset={6} className="z-50 min-w-40">
        <DropdownMenuGroup>
          {FILTERS.map((filter) => (
            <DropdownMenuItem
              key={filter.value}
              onSelect={() => setFilterStatus(filter.value)}
              className={filterStatus === filter.value ? 'font-medium' : ''}
            >
              {filter.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default FilteredByStatus
