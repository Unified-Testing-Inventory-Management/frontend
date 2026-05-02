import {
  ArchiveIcon,
  CheckCircle2Icon,
  EditIcon,
  PackageIcon,
  Plus,
  Search,
} from 'lucide-react'
import React, { Activity, useEffect, useMemo, type FormEvent } from 'react'
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
import { useProducts } from '@/data'
import FilteredByStatus from '../FilteredByStatus'
import ExcelImportButton from '../ExcelImportButton'
import {
  useError,
  useFilterProductStore,
  useMessage,
  useModalProductStore,
  useProductStore,
  useSetError,
  useSetMessage,
  useSetSubmitting,
  useSetSuccess,
  useSubmitting,
  useSuccess,
} from '@/stores/product-state'

export function ProductsSection() {
  const {
    productData,
    setProductData,
    resetProductData,
    searchInput,
    setSearchInput,
    searchTerm,
    setSearchTerm,
    imagePreview,
    setImagePreview,
    productId,
    setProductId,
    editProductData,
    setEditProductData,
  } = useProductStore()

  const { filterStatus, setFilterStatus } = useFilterProductStore()
  const { editProductModalOpen, setEditProductModalOpen, archiveProductModalOpen, setArchiveProductModalOpen, addProductDialogOpen, setAddProductDialogOpen } = useModalProductStore()

  const { products } = useProducts(searchTerm)
  const register = useRegisterProductMutation()
  const updateProduct = useUpdateProductMutation()
  const archive = useArchiveProductById()

  const isError = useError()
  const setIsError = useSetError()
  const isSuccess = useSuccess()
  const setIsSuccess = useSetSuccess()
  const message = useMessage()
  const setMessage = useSetMessage()
  const isSubmitting = useSubmitting()
  const setIsSubmitting = useSetSubmitting()

  const getProductDetails = products.find((p) => p.id == productId)

  useEffect(() => {
    if (editProductModalOpen && getProductDetails) {
      setEditProductData({
        productName: getProductDetails.productName,
        category: getProductDetails.category,
        price: getProductDetails.price,
        stockQuantity: getProductDetails.stockQuantity,
      })
    }
  }, [editProductModalOpen, getProductDetails])

  const handleProductFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target
    if (name === 'image' && files) {
      const file = files[0]
      setProductData({ image: file || null })
      setImagePreview(URL.createObjectURL(file))
      return
    }
    setProductData({
      [name]: name === 'productName' || name === 'category' || name === 'stockQuantity' ? value : parseFloat(value) || 0,
    })
  }

  const handleOpenEditModal = (product: Product) => {
    setProductId(product.id)
    setEditProductData({ productName: product.productName, category: product.category, price: product.price, stockQuantity: product.stockQuantity })
    setEditProductModalOpen(true)
  }

  const handleUpdateProductDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditProductData({ [name]: name === 'productName' || name === 'category' ? value : Number(value) })
  }

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setIsError(false)
    setIsSuccess(false)
    setMessage('')
    await register.mutateAsync(productData, {
      onSuccess: (data) => {
        setIsSuccess(true)
        setMessage(data.message)
        setAddProductDialogOpen(false)
        setTimeout(() => { resetProductData(); setIsSuccess(false); setMessage(''); setIsSubmitting(false) }, 3500)
      },
      onError: (err: any) => {
        setIsError(true)
        setIsSubmitting(false)
        setAddProductDialogOpen(true)
        if (err.response) setMessage(err.response?.data.error)
      },
    })
  }

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!productId) return
    await updateProduct.mutateAsync({ id: productId as string, data: editProductData }, {
      onSuccess: (data) => {
        setIsSuccess(true)
        setMessage(data.message)
        setEditProductModalOpen(false)
        setTimeout(() => { setEditProductData({ productName: '', category: '', price: 0, stockQuantity: 0 }); setIsSuccess(false); setMessage(''); setIsSubmitting(false) }, 3500)
      },
      onError: (err: any) => {
        setIsError(true)
        setMessage(err.response?.data?.error || 'Update failed')
      },
    })
  }

  const handleArchiveProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    await archive.mutateAsync(productId, {
      onSuccess: (data) => {
        setIsSuccess(true)
        setMessage(data.message)
        setArchiveProductModalOpen(false)
        setTimeout(() => { setIsSuccess(false); setMessage(''); setProductId(null) }, 3500)
      },
    })
  }

  const filteredProducts = useMemo(() => {
    return products.filter((p) => filterStatus === 'All' || getProductStatus(p) === filterStatus)
  }, [products, filterStatus])

  const inputCls = 'h-10 rounded-lg bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-300 hover:border-zinc-300 focus-visible:border-zinc-900 focus-visible:ring-zinc-900/10 transition-colors'
  const labelCls = 'text-zinc-500 text-xs font-medium uppercase tracking-widest'

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
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-zinc-900">Products</CardTitle>
                <CardDescription className="text-zinc-400">Manage your product inventory</CardDescription>
              </div>
              <button
                onClick={() => setAddProductDialogOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700 transition-colors"
              >
                <Plus className="size-4" />
                <span className="hidden sm:inline">Add Product</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <form onSubmit={(e: FormEvent) => { e.preventDefault(); setSearchTerm(searchInput) }} className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                  <Input
                    className={`pl-9 h-9 w-64 ${inputCls}`}
                    placeholder="Search product..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </div>
                <button type="submit" className="h-9 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-700 transition-colors">
                  Search
                </button>
              </form>
              <div className="flex items-center gap-2">
                <FilteredByStatus filterStatus={filterStatus} setFilterStatus={setFilterStatus} totalFiltered={filteredProducts.length} />
                <ExcelImportButton />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="max-h-[600px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-100">
                  {['Image', 'Name', 'Category', 'Price', 'Stock', 'Status', 'Barcode', 'Created', 'Updated', 'Actions'].map((h) => (
                    <TableHead key={h} className="sticky top-0 bg-white text-xs text-zinc-400 font-medium z-10">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const status = getProductStatus(product)
                  return (
                    <TableRow key={product.id} className="border-zinc-50">
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
                      <TableCell>
                        <img className="w-10 h-10 object-cover rounded border border-zinc-100" src={`data:image/png;base64,${product.barCode}`} alt="barcode" />
                      </TableCell>
                      <TableCell className="text-xs text-zinc-400">{formatDateTime(product.createdAt)}</TableCell>
                      <TableCell className="text-xs text-zinc-400">{formatDateTime(product.updatedAt)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <button
                            title="Edit"
                            onClick={() => handleOpenEditModal(product)}
                            className="inline-flex items-center gap-1.5 rounded-md border border-blue-100 bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100 transition-colors"
                          >
                            <EditIcon className="size-3.5" />
                            Edit
                          </button>
                          <button
                            title="Archive"
                            onClick={() => { setArchiveProductModalOpen(true); setProductId(product.id) }}
                            className="inline-flex items-center gap-1.5 rounded-md border border-amber-100 bg-amber-50 px-2.5 py-1.5 text-xs font-medium text-amber-600 hover:bg-amber-100 transition-colors"
                          >
                            <ArchiveIcon className="size-3.5" />
                            Archive
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {products.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} className="h-40 text-center">
                      <div className="flex flex-col items-center gap-2 text-zinc-300">
                        <PackageIcon className="h-8 w-8" />
                        <p className="text-sm font-medium">No products found</p>
                        <p className="text-xs">Click "Add Product" to create your first item</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Product Modal */}
      <Dialog open={addProductDialogOpen} onOpenChange={setAddProductDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-zinc-900 font-bold">Add New Product</DialogTitle>
            <DialogDescription className="text-zinc-400">Enter product details to add to your inventory.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleProductSubmit} className="space-y-4" encType="multipart/form-data">
            <div className="space-y-1.5">
              <Label htmlFor="productName" className={labelCls}>Product Name</Label>
              <Input id="productName" name="productName" value={productData.productName} onChange={handleProductFormChange} placeholder="Enter product name" required className={`${inputCls} ${isError ? 'border-red-300' : ''}`} />
              {isError && <p className="text-xs text-red-500">{message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="category" className={labelCls}>Category</Label>
              <Input id="category" name="category" value={productData.category} onChange={handleProductFormChange} placeholder="Enter category" required className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="price" className={labelCls}>Price</Label>
                <Input id="price" name="price" min="1" value={productData.price} onChange={handleProductFormChange} placeholder="0.00" required className={inputCls} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="stockQuantity" className={labelCls}>Stock Qty</Label>
                <Input id="stockQuantity" name="stockQuantity" value={productData.stockQuantity} onChange={handleProductFormChange} placeholder="0" required className={inputCls} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="image" className={labelCls}>Image <span className="text-zinc-300 normal-case tracking-normal">(optional)</span></Label>
              <Input id="image" name="image" type="file" accept="image/*" onChange={handleProductFormChange} className={inputCls} />
              {imagePreview && (
                <div className="flex justify-center mt-2">
                  <img src={imagePreview} alt="Preview" className="h-28 w-32 object-cover rounded-lg border border-zinc-100" />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setAddProductDialogOpen(false)} className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700 disabled:opacity-30 transition-colors flex items-center gap-2">
                {isSubmitting ? <div className="loader-1" /> : 'Add Product'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog open={editProductModalOpen} onOpenChange={setEditProductModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-zinc-900 font-bold">Edit Product</DialogTitle>
            <DialogDescription className="text-zinc-400">Update the product details below.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateProduct} className="space-y-4" encType="multipart/form-data">
            <div className="space-y-1.5">
              <Label htmlFor="edit-productName" className={labelCls}>Product Name</Label>
              <Input id="edit-productName" name="productName" value={editProductData.productName} onChange={handleUpdateProductDataChange} placeholder="Enter product name" required className={`${inputCls} ${isError ? 'border-red-300' : ''}`} />
              {isError && <p className="text-xs text-red-500">{message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-category" className={labelCls}>Category</Label>
              <Input id="edit-category" name="category" value={editProductData.category} onChange={handleUpdateProductDataChange} placeholder="Enter category" required className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="edit-price" className={labelCls}>Price</Label>
                <Input id="edit-price" name="price" min="1" value={editProductData.price} onChange={handleUpdateProductDataChange} placeholder="0.00" required className={inputCls} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-stockQuantity" className={labelCls}>Stock Qty</Label>
                <Input id="edit-stockQuantity" name="stockQuantity" value={editProductData.stockQuantity} onChange={handleUpdateProductDataChange} placeholder="0" required className={inputCls} />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setEditProductModalOpen(false)} className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700 disabled:opacity-30 transition-colors flex items-center gap-2">
                {isSubmitting ? <div className="loader-1" /> : 'Save Changes'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Archive Modal */}
      <Dialog open={archiveProductModalOpen} onOpenChange={setArchiveProductModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-zinc-900 font-bold">Archive Item</DialogTitle>
            <DialogDescription className="text-zinc-400">This item will be archived. You can restore it later.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button onClick={() => setArchiveProductModalOpen(false)} className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors">Cancel</button>
            <form onSubmit={handleArchiveProduct}>
              <button type="submit" className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 transition-colors">
                Yes, Archive
              </button>
            </form>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
