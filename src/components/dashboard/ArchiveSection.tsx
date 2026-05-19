import { ArchiveRestoreIcon, CheckCircle2Icon, PackageIcon, Search, Trash2Icon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { useAllArchiveProducts } from '@/data'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDateTime } from '@/utils/formatDateTime'
import { useDeleteProductById, useRestoreProductById } from '@/services/product_services'
import { Activity, useMemo, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Alert, AlertTitle } from '../ui/alert'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { getProductStatus } from '@/@types'
import FilteredByStatus from '../FilteredByStatus'

type FilterStatus = 'All' | 'In Stock' | 'Low Stock' | 'Out of Stock'

export default function ArchiveSection() {
  const [searchInput, setSearchInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const { archives } = useAllArchiveProducts(searchTerm)
  const restoreProduct = useRestoreProductById()
  const deleteProduct = useDeleteProductById()
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('All')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [message, setMessage] = useState('')

  const handleRestoreProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    await restoreProduct.mutateAsync(selectedId, {
      onSuccess: (data: any) => {
        setIsRestoreModalOpen(false)
        setIsSuccess(true)
        setMessage(data.message)
        setTimeout(() => { setIsSuccess(false); setMessage(''); setSelectedId(null) }, 3500)
      },
    })
  }

  const handleDeleteProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    await deleteProduct.mutateAsync(selectedId, {
      onSuccess: (data: any) => {
        setIsDeleteModalOpen(false)
        setIsSuccess(true)
        setMessage(data.message)
        setTimeout(() => { setIsSuccess(false); setMessage(''); setSelectedId(null) }, 3500)
      },
    })
  }

  const filteredProducts = useMemo(() => {
    return archives.filter((product) => {
      if (filterStatus === 'All') return true
      return getProductStatus(product) === filterStatus
    })
  }, [archives, filterStatus])

  return (
    <>
      <Activity mode={isSuccess ? 'visible' : 'hidden'}>
        <Alert className="animate-fade-in-out bg-zinc-900 w-72 absolute right-2 top-4 border-0">
          <CheckCircle2Icon color="white" className="size-4" />
          <AlertTitle>
            <span className="text-white text-sm font-medium">{message}</span>
          </AlertTitle>
        </Alert>
      </Activity>

      <Card className="border-zinc-100 shadow-none">
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div>
              <CardTitle className="text-base font-semibold text-zinc-900">Archive</CardTitle>
              <CardDescription className="text-zinc-400">Manage your archived products</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <form
                onSubmit={(e: React.FormEvent) => { e.preventDefault(); setSearchTerm(searchInput) }}
                className="flex items-center gap-2"
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                  <Input
                    placeholder="Search archive..."
                    className="pl-9 h-9 w-64 rounded-lg bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-300 focus-visible:border-zinc-900 focus-visible:ring-zinc-900/10"
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="h-9 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
                >
                  Search
                </button>
              </form>
              <FilteredByStatus
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                totalFiltered={filteredProducts.length}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="max-h-[600px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-100">
                  {['Product ID', 'Name', 'Category', 'Price', 'Stock', 'Status', 'Barcode', 'Deleted At', 'Actions'].map((h) => (
                    <TableHead key={h} className="text-xs text-zinc-400 font-medium">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((archive) => {
                  const status = getProductStatus(archive)
                  return (
                    <TableRow key={archive.id} className="border-zinc-50">
                      <TableCell className="text-zinc-500 text-sm">{archive.productId}</TableCell>
                      <TableCell className="font-medium text-zinc-900">{archive.productName}</TableCell>
                      <TableCell className="text-zinc-500">{archive.category}</TableCell>
                      <TableCell className="text-zinc-900 font-medium">₱{formatCurrency(archive.price)}</TableCell>
                      <TableCell className="text-zinc-700">{archive.stockQuantity}</TableCell>
                      <TableCell>
                        <Badge variant={status === 'In Stock' ? 'default' : status === 'Low Stock' ? 'secondary' : 'destructive'} className="text-xs">
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <img className="w-10 h-10 object-cover rounded border border-zinc-100" src={`data:image/png;base64,${archive.barCode}`} alt="barcode" />
                      </TableCell>
                      <TableCell className="text-xs text-zinc-400">{formatDateTime(archive.deletedAt)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <button
                            title="Restore"
                            onClick={() => { setSelectedId(archive.productId); setIsRestoreModalOpen(true) }}
                            className="inline-flex items-center gap-1.5 rounded-md border border-amber-100 bg-amber-50 px-2.5 py-1.5 text-xs font-medium text-amber-600 hover:bg-amber-100 transition-colors"
                          >
                            <ArchiveRestoreIcon className="size-3.5" />
                            Restore
                          </button>
                          <button
                            title="Delete"
                            onClick={() => { setSelectedId(archive.productId); setIsDeleteModalOpen(true) }}
                            className="inline-flex items-center gap-1.5 rounded-md border border-red-100 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors"
                          >
                            <Trash2Icon className="size-3.5" />
                            Delete
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {archives.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} className="h-40 text-center">
                      <div className="flex flex-col items-center gap-2 text-zinc-300">
                        <PackageIcon className="h-8 w-8" />
                        <p className="text-sm">No archived products</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Restore Modal */}
      <Dialog open={isRestoreModalOpen} onOpenChange={setIsRestoreModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-zinc-900 font-bold">Restore Item</DialogTitle>
            <DialogDescription className="text-zinc-400">This item will be restored to your active list.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button onClick={() => setIsRestoreModalOpen(false)} className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors">
              Cancel
            </button>
            <form onSubmit={handleRestoreProduct}>
              <button type="submit" className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 transition-colors">
                Yes, Restore
              </button>
            </form>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-zinc-900 font-bold">Delete Item</DialogTitle>
            <DialogDescription className="text-zinc-400">This action is permanent and cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button onClick={() => setIsDeleteModalOpen(false)} className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors">
              Cancel
            </button>
            <form onSubmit={handleDeleteProduct}>
              <button type="submit" className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors">
                Yes, Delete
              </button>
            </form>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
