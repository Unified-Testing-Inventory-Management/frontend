import { ArchiveIcon, CheckCircle2Icon, EditIcon, Plus } from 'lucide-react'
import { Activity, useState } from 'react'
import type { Product } from '@/@types'
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
import { Button } from '@/components/ui/button'
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
import {
  useArchiveProductById,
  useRegisterProductMutation,
} from '@/services/product_services'
import { Alert, AlertTitle } from '../ui/alert'

interface ProductsSectionProps {
  products: Array<Product>
}

export function ProductsSection({ products }: ProductsSectionProps) {
  const register = useRegisterProductMutation()
  const archive = useArchiveProductById()
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState<boolean>(false)
  const [productId, setProductId] = useState<string | number | null>(null)
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] =
    useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [productFormData, setProductFormData] = useState<
    Omit<Product, 'id' | 'createdAt' | 'barCode'>
  >({
    image: null,
    productName: '',
    category: '',
    price: 0,
    stockQuantity: 0,
  })

  const handleProductFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target

    if (name === 'image' && files) {
      const file = files[0]
      setProductFormData((prev) => ({
        ...prev,
        image: file || null,
      }))
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)

      return
    }

    setProductFormData((prev) => ({
      ...prev,
      [name]:
        name === 'productName' ||
          name === 'category' ||
          name === 'stockQuantity'
          ? value
          : parseFloat(value) || 0,
    }))
  }

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setIsError(false)
    setIsSuccess(false)
    setMessage('')

    register.mutate(productFormData, {
      onSuccess: (data) => {
        setIsSuccess(true)
        setMessage(data.message)
        setIsAddProductDialogOpen(false)

        setTimeout(() => {
          setProductFormData({
            image: null,
            productName: '',
            category: '',
            price: 0,
            stockQuantity: 0,
          })
          setIsSuccess(false)
          setMessage('')
          setIsSubmitting(false)
        }, 3500)
      },
      onError: (err: any) => {
        setIsError(true)
        setIsSubmitting(false)
        setIsAddProductDialogOpen(true)
        if (err.response) {
          setMessage(err.response?.data.error)
          console.error('Error registering product:', err.response?.data.error)
        }
      },
    })
  }

  const handleArchiveProduct = (e: React.FormEvent) => {
    e.preventDefault()
    archive.mutate(productId, {
      onSuccess: (data) => {
        setIsSuccess(true)
        setMessage(data.message)
        setIsError(true)
        setIsArchiveModalOpen(false)

        setTimeout(() => {
          setIsSuccess(false)
          setMessage('')
          setProductId(null)
          setIsError(false)
        }, 3500)
      },
    })
  }

  return (
    <>
      <Activity mode={isSuccess ? 'visible' : 'hidden'}>
        <Alert className="animate-fade-in-out bg-green-500 w-70 absolute right-2 top-4">
          <CheckCircle2Icon className="bg-green-500 text-green-500" />
          <AlertTitle>
            <span className="text-white text-[16px] font-bold">{message}</span>
          </AlertTitle>
        </Alert>
      </Activity>
      <Card className="h-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Products</CardTitle>
              <CardDescription>Manage your product inventory</CardDescription>
            </div>
            <Button onClick={() => setIsAddProductDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative max-h-160 overflow-hidden">
            <div className="max-h-176 overflow-y-auto">
              <Table className="w-full">
                <TableHeader className="sticky top-0 bg-white z-10">
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>BarCode</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {products.map((product) => {
                    const status = getProductStatus(product)
                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          {product.image ? (
                            <img
                              className="w-12 h-12 object-cover rounded"
                              src={typeof product.image == "string" ? product.image : ""}
                              alt={product.productName || "Product image"}
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
                          &#8369; {product.price.toFixed(2)}
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
                        <TableCell>
                          <img
                            className="w-12 h-12 object-cover rounded"
                            src={`data:image/png;base64,${product.barCode}`}
                            alt="barcode img"
                          />
                        </TableCell>
                        <TableCell>{product.createdAt}</TableCell>
                        <TableCell>
                          <div className="flex flex-row gap-1.5">
                            <EditIcon className="text-shadow-blue-500" />
                            <ArchiveIcon
                              onClick={() => {
                                setIsArchiveModalOpen(true)
                                setProductId(product.id)
                              }}
                              className="text-orange-500"
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Product Modal */}
      <Dialog
        open={isAddProductDialogOpen}
        onOpenChange={setIsAddProductDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Enter the product details below to add a new item to your
              inventory.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleProductSubmit} className="space-y-4" encType="multipart/form-data">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input
                type='input'
                id="productName"
                name="productName"
                value={productFormData.productName}
                onChange={handleProductFormChange}
                placeholder="Enter product name"
                required
                className={`${isError ? 'ring-2 ring-red-500' : ''}`}
              />
              <Activity mode={isError ? 'visible' : 'hidden'}>
                <p className="text-red-500 text-sm">{message}</p>
              </Activity>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                type='input'
                id="category"
                name="category"
                value={productFormData.category}
                onChange={handleProductFormChange}
                placeholder="Enter category"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                type='input'
                id="price"
                name="price"
                min="1"
                value={productFormData.price}
                onChange={handleProductFormChange}
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stockQuantity">Stock Quantity</Label>
              <Input
                id="stockQuantity"
                name="stockQuantity"
                type="input"
                value={productFormData.stockQuantity}
                onChange={handleProductFormChange}
                placeholder="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                name="image"
                type="file"
                accept='image/*'
                onChange={handleProductFormChange}
                required
              />
              <Activity mode={imagePreview ? "visible" : "hidden"}>
                <div className='flex justify-center items-center'>
                  <img
                    src={imagePreview!!}
                    alt="Product preview"
                    className="mt-2 h-30 w-35 object-cover rounded border"
                  />
                </div>
              </Activity>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddProductDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isSubmitting ? (
                  <div className="w-full min-h-screen flex justify-center items-center">
                    <div className="loader-1"></div>
                  </div>
                ) : (
                  'Add Product'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Archive Modal */}
      <Dialog open={isArchiveModalOpen} onOpenChange={setIsArchiveModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive Item</DialogTitle>
            <DialogDescription>
              Do you want to archive this item ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="flex flex-row gap-1.5">
              <Button
                variant={'secondary'}
                onClick={() => setIsArchiveModalOpen(false)}
              >
                Cancel
              </Button>
              <form onSubmit={handleArchiveProduct} method="post">
                <Button variant={'destructive'}>
                  <span className="font-bold">Yes, Archive now</span>
                </Button>
              </form>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
