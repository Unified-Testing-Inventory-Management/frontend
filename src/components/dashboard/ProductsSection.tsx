import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus } from 'lucide-react'
import type { Product} from '@/@types'
import {getProductStatus } from '@/@types'

interface ProductsSectionProps {
  products: Product[]
}

export function ProductsSection({ products }: ProductsSectionProps) {
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false)
  const [productFormData, setProductFormData] = useState<Omit<Product, 'Id' | 'CreatedAt'>>({
    ProductName: '',
    Category: '',
    Price: 0,
    StockQuantity: 0,
    LowStockLevel: 0,
  })

  const handleProductFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProductFormData((prev) => ({
      ...prev,
      [name]: name === 'ProductName' || name === 'Category' ? value : parseFloat(value) || 0,
    }))
  }

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Add API call to create product
    console.log('Add Product:', productFormData)

    // Reset form and close dialog
    setProductFormData({
      ProductName: '',
      Category: '',
      Price: 0,
      StockQuantity: 0,
      LowStockLevel: 0,
    })
    setIsAddProductDialogOpen(false)
  }

  return (
    <>
      <Card>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Low Stock Level</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => {
                const status = getProductStatus(product)
                return (
                  <TableRow key={product.Id}>
                    <TableCell className="font-medium">#{product.Id}</TableCell>
                    <TableCell>{product.ProductName}</TableCell>
                    <TableCell>{product.Category}</TableCell>
                    <TableCell>{product.StockQuantity}</TableCell>
                    <TableCell>{product.LowStockLevel}</TableCell>
                    <TableCell>${product.Price.toFixed(2)}</TableCell>
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
                    <TableCell>{product.CreatedAt}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Enter the product details below to add a new item to your inventory.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleProductSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ProductName">Product Name</Label>
              <Input
                id="ProductName"
                name="ProductName"
                value={productFormData.ProductName}
                onChange={handleProductFormChange}
                placeholder="Enter product name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="Category">Category</Label>
              <Input
                id="Category"
                name="Category"
                value={productFormData.Category}
                onChange={handleProductFormChange}
                placeholder="Enter category"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="Price">Price</Label>
              <Input
                id="Price"
                name="Price"
                type="number"
                step="0.01"
                min="0"
                value={productFormData.Price}
                onChange={handleProductFormChange}
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="StockQuantity">Stock Quantity</Label>
              <Input
                id="StockQuantity"
                name="StockQuantity"
                type="number"
                min="0"
                value={productFormData.StockQuantity}
                onChange={handleProductFormChange}
                placeholder="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="LowStockLevel">Low Stock Level</Label>
              <Input
                id="LowStockLevel"
                name="LowStockLevel"
                type="number"
                min="0"
                value={productFormData.LowStockLevel}
                onChange={handleProductFormChange}
                placeholder="0"
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddProductDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Product</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
