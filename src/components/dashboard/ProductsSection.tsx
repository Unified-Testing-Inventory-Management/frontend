import {
  ArchiveIcon,
  CheckCircle2Icon,
  EditIcon,
  PackageIcon,
  Plus,
} from 'lucide-react'
import React, { Activity, useState, type FormEvent } from 'react'
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
  useUpdateProductMutation,
} from '@/services/product_services'
import { Alert, AlertTitle } from '../ui/alert'
import { formatDateTime } from '@/utils/formatDateTime'
import { formatCurrency } from '@/utils/formatCurrency'
import { useProducts } from '@/data/dashboard-data'

export function ProductsSection() {
  const [searchInput, setSearchInput] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { products } = useProducts(searchTerm)
  const register = useRegisterProductMutation()
  const updateProduct = useUpdateProductMutation()
  const archive = useArchiveProductById()
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState<boolean>(false)
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
  const [editProductData, setEditProductData] = useState<
    Omit<Product, 'id' | 'createdAt' | 'barCode' | 'image'>
  >({
    productName: '',
    category: '',
    price: 0,
    stockQuantity: 0,
  })
  const getProductDetails = products.find((product) => product.id == productId);

  // Handle Add Product Change
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

  const handleOpenEditModal = (product: Product) => {
    setProductId(product.id)
    setEditProductData({
      productName: product.productName,
      category: product.category,
      price: product.price,
      stockQuantity: product.stockQuantity,
    })
    setIsEditProductModalOpen(true)
  }

  // Handle Edit Product Change
  const handleUpdateProductDataChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target

    setEditProductData((prev) => ({
      ...prev,
      [name]:
        name === 'productName' || name === 'category'
          ? value
          : Number(value),
    }))
  }

  // Submit Product Created
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

  // Update Product By Id
  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")

    if (!productId) return

    updateProduct.mutate(
      { id: productId as string, data: editProductData },
      {
        onSuccess: (data) => {
          setIsSuccess(true)
          setMessage(data.message)
          setIsEditProductModalOpen(false)

          setTimeout(() => {
            setEditProductData({
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
          setMessage(err.response?.data?.error || 'Update failed')
        },
      }
    )
  }

  // Archive Product
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

      {/* Product Card Table */}
      <Card className="h-200">
        <CardHeader>
          <div className='flex flex-col gap-4'>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Products</CardTitle>
                <CardDescription>Manage your product inventory</CardDescription>
              </div>
              <Button className='hidden md:flex' onClick={() => setIsAddProductDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
              <Button className='md:hidden' onClick={() => setIsAddProductDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
              </Button>
            </div>
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
          <div className="relative max-h-160 overflow-hidden">
            <div className="max-h-176 overflow-y-auto">
              <Table className="w-full">
                <TableHeader className="sticky top-0 bg-white z-10">
                  <TableRow>
                    {["Image", "Name", "Category", "Price", "Stock", "Status", "BarCode", "Created At", "Action"].map((item) => (
                      <TableHead key={item}>{item}</TableHead>
                    ))}
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
                              src={
                                typeof product.image == 'string'
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
                        <TableCell>
                          <img
                            className="w-12 h-12 object-cover rounded"
                            src={`data:image/png;base64,${product.barCode}`}
                            alt="barcode img"
                          />
                        </TableCell>
                        <TableCell>{formatDateTime(product.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex flex-row gap-1.5">
                            <EditIcon className="text-shadow-blue-500" onClick={() => { handleOpenEditModal(product) }} />
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
                  {products.length == 0 && (
                    <TableRow>
                      <TableCell colSpan={9}>
                        <div className="flex flex-col h-120 items-center justify-center py-10 text-muted-foreground">
                          <PackageIcon className="mb-3 h-10 w-10 text-gray-400" />
                          <p className="text-base font-medium">
                            No products found
                          </p>
                          <p className="text-sm">
                            Click &quot;Add Product&quot; to create your first
                            item.
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  {products.length == 0 && (
                    <TableRow>
                      <TableCell colSpan={9}>
                        <div className="flex flex-col h-120 items-center justify-center py-10 text-muted-foreground">
                          <PackageIcon className="mb-3 h-10 w-10 text-gray-400" />
                          <p className="text-base font-medium">
                            No products found
                          </p>
                          <p className="text-sm">
                            No products found for "{searchTerm}"
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
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
              <Label htmlFor="image">Image <small className='text-red-500'>(Optional)*</small></Label>
              <Input
                id="image"
                name="image"
                type="file"
                accept='image/*'
                onChange={handleProductFormChange}
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
              <Button type="submit" disabled={isSubmitting}>
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

      {/* Edit Product Modal */}
      <Dialog open={isEditProductModalOpen} onOpenChange={setIsEditProductModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product {getProductDetails?.productName}</DialogTitle>
            <DialogDescription>
              Update the product details
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateProduct} className="space-y-4" encType="multipart/form-data">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input
                type='input'
                id="productName"
                name="productName"
                value={editProductData.productName}
                onChange={handleUpdateProductDataChange}
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
                value={editProductData.category}
                onChange={handleUpdateProductDataChange}
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
                value={editProductData.price}
                onChange={handleUpdateProductDataChange}
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
                value={editProductData.stockQuantity}
                onChange={handleUpdateProductDataChange}
                placeholder="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image <small className='text-red-500'>(Optional)*</small></Label>
              <Input
                id="image"
                name="image"
                type="file"
                accept='image/*'
                onChange={handleUpdateProductDataChange}
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
                onClick={() => setIsEditProductModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isSubmitting ? (
                  <div className="w-full min-h-screen flex justify-center items-center">
                    <div className="loader-1"></div>
                  </div>
                ) : (
                  'Save Changes'
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
