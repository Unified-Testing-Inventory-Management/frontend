import { ArchiveRestoreIcon, CheckCircle2Icon, PackageIcon, Trash2Icon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { useAllArchiveProducts } from "@/data";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDateTime } from "@/utils/formatDateTime";
import { useDeleteProductById, useRestoreProductById } from "@/services/product_services";
import { Activity, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Alert, AlertTitle } from "../ui/alert";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { getProductStatus } from "@/@types";
import FilteredByStatus from "../FilteredByStatus";

type FilterStatus = 'All' | 'In Stock' | 'Low Stock' | 'Out of Stock'

export default function ArchiveSection() {
  const [searchInput, setSearchInput] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const { archives } = useAllArchiveProducts(searchTerm)
  const restoreProduct = useRestoreProductById()
  const deleteProduct = useDeleteProductById()
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('All')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState<boolean>(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')

  const handleRestoreProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    await restoreProduct.mutateAsync(selectedId, {
      onSuccess: (data: any) => {
        setIsRestoreModalOpen(false)
        setIsSuccess(true)
        setMessage(data.message)

        setTimeout(() => {
          setIsSuccess(false)
          setMessage("")
          setSelectedId(null)
        }, 3500)
      },
      onError: (err: any) => {
        console.log(err.response?.data.error)
        setIsError(err.response?.data.error)
        console.log(isError)
      }
    })
  }

  const handleDeleteProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    await deleteProduct.mutateAsync(selectedId, {
      onSuccess: (data: any) => {
        setIsDeleteModalOpen(false)
        setIsSuccess(true)
        setMessage(data.message)

        setTimeout(() => {
          setIsSuccess(false)
          setMessage("")
          setSelectedId(null)
        }, 3500)
      },
      onError: (err: any) => {
        console.log(err.response?.data.error)
        setIsError(err.response?.data.error)
        console.log(isError)
      }
    })
  }

  const filteredProducts = useMemo(() => {
    return archives.filter((product) => {
      if (filterStatus === 'All') return true
      return getProductStatus(product) === filterStatus
    })
  }, [archives, filterStatus])

  const totalFiltered = filteredProducts.length


  return (
    <>
      <Activity mode={isSuccess ? 'visible' : 'hidden'}>
        <Alert className="animate-fade-in-out bg-green-500 w-70 absolute right-2 top-4">
          <CheckCircle2Icon color="white" />
          <AlertTitle>
            <span className="text-white text-[16px] font-bold">{message}</span>
          </AlertTitle>
        </Alert>
      </Activity >

      {/* Archive Product Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Archive</CardTitle>
              <CardDescription>Manage your archive products</CardDescription>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <form onSubmit={(e: React.FormEvent) => {
              e.preventDefault()
              setSearchTerm(searchInput)
            }} method="post">
              <div className="w-md flex flex-row gap-2">
                <Input placeholder="Search archive product..." className="py-6 px-4" onChange={(e) => setSearchInput(e.target.value)} />
                <Button
                  type='button'
                  className="py-6 px-6"
                >
                  Search
                </Button>
              </div>
            </form>
            <div className='mt-2 -mb-5'>
              <FilteredByStatus
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                totalFiltered={totalFiltered}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative min-h-150 overflow-hidden">
            <div className="max-h-150 overflow-y-auto">
              <div className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {["ID", "Product ID", "Name", "Category", "Price", "Stock", "Status", "BarCode", "Deleted At", "Action"].map((item) => (
                        <TableHead key={item}>{item}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((archive) => {
                      const status = getProductStatus(archive)
                      return (
                        <TableRow key={archive.id}>
                          <TableCell>{archive.id}</TableCell>
                          <TableCell>{archive.productId}</TableCell>
                          <TableCell>{archive.productName}</TableCell>
                          <TableCell>{archive.category}</TableCell>
                          <TableCell>&#8369;{formatCurrency(archive.price)}</TableCell>
                          <TableCell>{archive.stockQuantity}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                status === 'In Stock'
                                  ? 'default'
                                  : status === 'Low Stock'
                                    ? 'secondary'
                                    : 'destructive'
                              }
                            >
                              {status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <img
                              className="w-12 h-12 object-cover rounded"
                              src={`data:image/png;base64,${archive.barCode}`}
                              alt="barcode img"
                            />
                          </TableCell>
                          <TableCell>{formatDateTime(archive.deletedAt)}</TableCell>
                          <TableCell>
                            <div className="flex flex-row gap-1.5">
                              <button title="Restore Item" onClick={() => {
                                setSelectedId(archive.productId);
                                setIsRestoreModalOpen(true)
                              }}>
                                <ArchiveRestoreIcon className="text-orange-500 hover:text-orange-700" />
                              </button>
                              <button title="Delete Item" onClick={() => {
                                setSelectedId(archive.productId);
                                setIsDeleteModalOpen(true)
                              }}>
                                <Trash2Icon className="text-red-500 hover:text-red-700" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                    {archives.length == 0 && (
                      <TableRow>
                        <TableCell colSpan={9}>
                          <div className="flex flex-col h-120 items-center justify-center py-10 text-muted-foreground">
                            <PackageIcon className="mb-3 h-10 w-10 text-gray-400" />
                            <p className="text-base font-medium">
                              No archived products found. Products you archive will appear here.
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Restore Product Modal */}
      <Dialog open={isRestoreModalOpen} onOpenChange={setIsRestoreModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restore Item</DialogTitle>
            <DialogDescription>
              This item will be restored to your active list.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="flex flex-row gap-1.5">
              <Button
                variant={'secondary'}
                onClick={() => setIsRestoreModalOpen(false)}
              >
                Cancel
              </Button>
              <form onSubmit={handleRestoreProduct} method="post">
                <Button variant={'destructive'}>
                  <span className="font-bold">Yes, Restore now</span>
                </Button>
              </form>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Product Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete this item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="flex flex-row gap-1.5">
              <Button
                variant={'secondary'}
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <form onSubmit={handleDeleteProduct} method="post">
                <Button variant={'destructive'}>
                  <span className="font-bold">Yes, Delete now</span>
                </Button>
              </form>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
