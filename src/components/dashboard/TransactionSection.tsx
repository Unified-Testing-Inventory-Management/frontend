import React, { Activity, useState, type FormEvent } from 'react'
import type { Product, TransactionData } from '@/@types'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getProductStatus } from '@/@types'
import { CheckCircle2Icon, PackageIcon, Search } from 'lucide-react'
import { formatCurrency } from '@/utils/formatCurrency'
import { useTransactionProduct } from '@/services/sale_services'
import { Alert, AlertTitle } from '../ui/alert'
import { useProducts } from '@/data'

function TransactionSection() {
  const transactionProduct = useTransactionProduct()
  const [message, setMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const { products } = useProducts(searchTerm)
  const [isSuccess, setIsSuccess] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setQuantity(1)
    setIsDialogOpen(true)
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1
    if (value > 0 && selectedProduct && value <= selectedProduct.stockQuantity) {
      setQuantity(value)
    }
  }

  const calculateTotal = () => (selectedProduct ? selectedProduct.price * quantity : 0)

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setSelectedProduct(null)
    setQuantity(1)
  }

  const handleTransaction = async (e: React.FormEvent) => {
    e.preventDefault()
    const transactionDetails: TransactionData = {
      productId: String(selectedProduct?.id),
      productName: String(selectedProduct?.productName),
      category: String(selectedProduct?.category),
      totalAmount: calculateTotal(),
      quantity,
      price: Number(selectedProduct?.price),
    }
    await transactionProduct.mutateAsync({ data: transactionDetails }, {
      onSuccess: (data: any) => {
        setIsSuccess(true)
        setMessage(data.message)
        handleCloseDialog()
        setTimeout(() => { setIsSuccess(false); setMessage('') }, 3500)
      },
      onError: (err: any) => {
        if (err.response) setMessage(err.response?.data.error)
      },
    })
  }

  const inputCls = 'h-10 rounded-lg bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-300 hover:border-zinc-300 focus-visible:border-zinc-900 focus-visible:ring-zinc-900/10 transition-colors'

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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-base font-semibold text-zinc-900">Transactions</CardTitle>
              <CardDescription className="text-zinc-400">Click a product to create a transaction</CardDescription>
            </div>
            <form
              onSubmit={(e: FormEvent) => { e.preventDefault(); setSearchTerm(searchInput) }}
              className="flex items-center gap-2"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                <Input
                  className={`pl-9 h-9 w-64 ${inputCls}`}
                  placeholder="Search product..."
                  value={searchInput}
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
          </div>
        </CardHeader>
        <CardContent>
          <div className="max-h-[600px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-100">
                  {['Image', 'Name', 'Category', 'Price', 'Stock', 'Status'].map((h) => (
                    <TableHead key={h} className="sticky top-0 bg-white text-xs text-zinc-400 font-medium z-10">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => {
                  const status = getProductStatus(product)
                  const isOutOfStock = product.stockQuantity === 0
                  return (
                    <TableRow
                      key={product.id}
                      onClick={() => !isOutOfStock && handleProductClick(product)}
                      className={`border-zinc-50 transition-colors ${isOutOfStock ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:bg-zinc-50'}`}
                    >
                      <TableCell>
                        {product.image ? (
                          <img className="w-10 h-10 object-cover rounded-lg border border-zinc-100" src={typeof product.image === 'string' ? product.image : ''} alt={product.productName} />
                        ) : (
                          <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center text-zinc-400 text-xs">N/A</div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium text-zinc-900">{product.productName}</TableCell>
                      <TableCell className="text-zinc-500">{product.category}</TableCell>
                      <TableCell className="text-zinc-900 font-medium">₱{formatCurrency(product.price)}</TableCell>
                      <TableCell className="text-zinc-700">{product.stockQuantity}</TableCell>
                      <TableCell>
                        <Badge variant={status === 'In Stock' ? 'default' : status === 'Low Stock' ? 'secondary' : 'destructive'} className="text-xs">
                          {status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {products.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-40 text-center">
                      <div className="flex flex-col items-center gap-2 text-zinc-300">
                        <PackageIcon className="h-8 w-8" />
                        <p className="text-sm">No products found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-zinc-900">Create Transaction</DialogTitle>
            <DialogDescription className="text-zinc-400">Review product details and enter quantity</DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <form onSubmit={handleTransaction} className="space-y-5">
              <div className="flex gap-6">
                {/* Product image */}
                <div className="shrink-0">
                  {selectedProduct.image ? (
                    <img
                      className="w-52 h-52 object-cover rounded-xl border border-zinc-100"
                      src={typeof selectedProduct.image === 'string' ? selectedProduct.image : ''}
                      alt={selectedProduct.productName}
                    />
                  ) : (
                    <div className="w-52 h-52 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-400 text-sm">
                      No Image
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-xs text-zinc-400 uppercase tracking-widest font-medium mb-0.5">Product</p>
                    <p className="text-lg font-bold text-zinc-900">{selectedProduct.productName}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-zinc-400 uppercase tracking-widest font-medium mb-0.5">Category</p>
                      <p className="text-sm text-zinc-700">{selectedProduct.category}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400 uppercase tracking-widest font-medium mb-0.5">Price</p>
                      <p className="text-sm font-semibold text-zinc-900">₱{formatCurrency(selectedProduct.price)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400 uppercase tracking-widest font-medium mb-0.5">Available</p>
                      <p className="text-sm text-zinc-700">{Number(selectedProduct.stockQuantity) - quantity}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400 uppercase tracking-widest font-medium mb-0.5">Status</p>
                      <Badge variant={getProductStatus(selectedProduct) === 'In Stock' ? 'default' : getProductStatus(selectedProduct) === 'Low Stock' ? 'secondary' : 'destructive'} className="text-xs mt-0.5">
                        {getProductStatus(selectedProduct)}
                      </Badge>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-100">
                    <Label htmlFor="quantity" className="text-xs text-zinc-400 uppercase tracking-widest font-medium">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      max={selectedProduct.stockQuantity}
                      value={quantity}
                      onChange={handleQuantityChange}
                      className={`mt-1.5 ${inputCls}`}
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
                    <p className="text-sm font-medium text-zinc-500">Total Amount</p>
                    <p className="text-2xl font-bold text-zinc-900">₱{formatCurrency(calculateTotal())}</p>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <button type="button" onClick={handleCloseDialog} className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={quantity <= 0 || quantity > selectedProduct.stockQuantity}
                  className="rounded-lg bg-zinc-900 px-5 py-2 text-sm font-semibold text-white hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Complete Transaction
                </button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default TransactionSection
