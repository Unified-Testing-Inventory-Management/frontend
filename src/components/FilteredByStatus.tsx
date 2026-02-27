import { ChevronDown } from 'lucide-react'
import { Button } from './ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger
} from './ui/dropdown-menu'
import type { TFilterStatus } from '@/@types'

interface FilteredByStatusProps {
    filterStatus: TFilterStatus
    setFilterStatus: (value: TFilterStatus) => void
    totalFiltered: number;
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
                <Button
                    variant="secondary"
                    className="flex items-center gap-2 rounded-md px-4"
                >
                    <span className="text-sm text-muted-foreground">Filtered by:</span>
                    <span className="font-medium">{filterStatus} ( <span className='text-red-500 font-bold'>{totalFiltered}</span> )</span>
                    <ChevronDown className="h-4 w-4 opacity-60" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                side="bottom"
                align="end"
                sideOffset={6}
                className="z-50"
            >
                <DropdownMenuGroup>
                    {FILTERS.map((filter) => (
                        <DropdownMenuItem
                            key={filter.value}
                            onSelect={() => setFilterStatus(filter.value)}
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
