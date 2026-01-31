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
import { Button } from '@/components/ui/button'
import { getProductStatus } from '@/@types'
import { CheckCircle2Icon, PackageIcon, ShoppingCart } from 'lucide-react'
import { formatCurrency } from '@/utils/formatCurrency'
import { useTransactionProduct } from '@/services/sale_services'
import { Alert, AlertTitle } from '../ui/alert'
import { useProducts } from '@/data'

function TransactionSection() {
  const transactionProduct = useTransactionProduct()
  const [message, setMessage] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const { products } = useProducts(searchTerm)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [quantity, setQuantity] = useState<number>(1)

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

  const calculateTotal = () => {
    if (!selectedProduct) return 0
    return selectedProduct.price * quantity
  }

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
      quantity: quantity,
      price: Number(selectedProduct?.price)
    }

    await transactionProduct.mutateAsync({ data: transactionDetails }, {
      onSuccess: (data: any) => {
        setIsSuccess(true)
        setMessage(data.message)
        handleCloseDialog()

        setTimeout(() => {
          setIsSuccess(false)
          setMessage("")
        }, 3500)
      },
      onError: (err: any) => {
        if (err.response) {
          setMessage(err.response?.data.error)
          setIsError(true)
          console.log(isError)
        }
      }
    })
  }

  return (
    <>
      <Activity mode={isSuccess ? 'visible' : 'hidden'}>
        <Alert className="animate-fade-in-out bg-green-500 w-70 absolute right-2 top-4">
          <CheckCircle2Icon color='white' />
          <AlertTitle>
            <span className="text-white text-[16px] font-bold">{message}</span>
          </AlertTitle>
        </Alert>
      </Activity>
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>
              Click on a product to create a transaction
            </CardDescription>
          </div>
          <div className='w-sm'>
            <form onSubmit={(e: FormEvent) => {
              e.preventDefault()
              setSearchTerm(searchInput)
            }} method="post">
              <div className='w-md flex flex-row gap-2'>
                <Input
                  className="py-6 px-4"
                  placeholder="Search your product..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <Button
                  type='button'
                  className="py-6 px-6"
                >
                  Search
                </Button>
              </div>
            </form>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative max-h-150 overflow-hidden">
            <div className="max-h-150 overflow-y-auto">
              <Table className="w-full">
                <TableHeader className="sticky top-0 bg-white z-10">
                  <TableRow>
                    {['Image', 'Name', 'Category', 'Price', 'Stock', 'Status'].map(
                      (item) => (
                        <TableHead key={item}>{item}</TableHead>
                      ),
                    )}
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {products.map((product) => {
                    const status = getProductStatus(product)
                    return (
                      <TableRow
                        key={product.id}
                        onClick={() => handleProductClick(product)}
                        className="cursor-pointer hover:bg-muted/50"
                      >
                        <TableCell>
                          {product.image ? (
                            <img
                              className="w-12 h-12 object-cover rounded"
                              src={
                                typeof product.image === 'string'
                                  ? product.image
                                  : ''
                              }
                              alt={product.productName || 'Product image'}
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
                              No Image
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{product.productName}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>
                          &#8369; {formatCurrency(product.price)}
                        </TableCell>
                        <TableCell>{product.stockQuantity}</TableCell>
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
                      </TableRow>
                    )
                  })}
                  {products.length == 0 && (
                    <TableRow>
                      <TableCell colSpan={9}>
                        <div className="flex flex-col h-120 items-center justify-center py-10 text-muted-foreground">
                          <PackageIcon className="mb-3 h-10 w-10 text-gray-400" />
                          <p className="text-base font-medium">
                            No products found
                          </p>
                          <p className="text-sm">
                            No products found for transaction "{searchTerm}"
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          <div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-none sm:max-w-[95vw] w-[50vw]">
          <DialogHeader>
            <DialogTitle>Create Transaction</DialogTitle>
            <DialogDescription>
              Review product details and enter quantity
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <form onSubmit={handleTransaction} className="space-y-4">
              <div className="flex gap-6">
                {/* Left side - Product Image */}
                <div className="shrink-0">
                  {selectedProduct.image ? (
                    <img
                      className="w-64 h-64 object-cover rounded-lg border"
                      src={
                        typeof selectedProduct.image === 'string'
                          ? selectedProduct.image
                          : ''
                      }
                      alt={selectedProduct.productName || 'Product image'}
                    />
                  ) : (
                    <div className="w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                      No Image Available
                    </div>
                  )}
                </div>

                {/* Right side - Product Details */}
                <div className="flex-1 space-y-4">
                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground">
                      Product Name
                    </Label>
                    <p className="text-lg font-semibold">
                      {selectedProduct.productName}
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground">
                      Category
                    </Label>
                    <p className="text-base">{selectedProduct.category}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground">
                      Price
                    </Label>
                    <p className="text-lg font-semibold text-primary">
                      &#8369; {formatCurrency(selectedProduct.price)}
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground">
                      Available Stock
                    </Label>
                    <p className="text-base">{selectedProduct.stockQuantity}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground">
                      Status
                    </Label>
                    <div className="mt-1">
                      <Badge
                        variant={
                          getProductStatus(selectedProduct) === 'In Stock'
                            ? 'default'
                            : getProductStatus(selectedProduct) === 'Low Stock'
                              ? 'secondary'
                              : 'destructive'
                        }
                      >
                        {getProductStatus(selectedProduct)}
                      </Badge>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Label htmlFor="quantity" className="text-sm font-semibold">
                      Quantity
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      max={selectedProduct.stockQuantity}
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="mt-2"
                      required
                    />
                    {quantity > selectedProduct.stockQuantity && (
                      <p className="text-sm text-destructive mt-1">
                        Quantity exceeds available stock
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <Label className="text-lg font-semibold">Total Amount</Label>
                      <p className="text-2xl font-bold text-primary">
                        &#8369; {formatCurrency(calculateTotal())}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    quantity <= 0 ||
                    quantity > selectedProduct.stockQuantity ||
                    selectedProduct.stockQuantity === 0
                  }
                >
                  Complete Transaction
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default TransactionSection