import { create } from 'zustand'
import type { Product, TFilterStatus } from '@/@types'

type productFormData = Omit<
  Product,
  'id' | 'createdAt' | 'barCode' | 'updatedAt'
>

type editProductFormData = Omit<
  Product,
  'id' | 'image' | 'createdAt' | 'barCode' | 'updatedAt'
>

type productStoreTypes = {
  data: productFormData
  editProductData: editProductFormData
  setProductData: (data: productFormData) => void
  setEditProductData: (data: editProductFormData) => void
  resetProductData: () => void
  searchInput: string,
  searchTerm: string,
  setSearchInput: (value: string) => void,
  setSearchTerm: (value: string) => void,
  imagePreview: string | null,
  setImagePreview: (value: string) => void
  productId: string | number | null
  setProductId: (value: string | number | null) => void
}

type filterProductTypes = {
  filterStatus: TFilterStatus,
  setFilterStatus: (value: TFilterStatus) => void
}

type modalProductTypes = {
  editProductModalOpen: boolean,
  archiveModalOpen: boolean,
  setEditProductModalOpen: (value: boolean) => void
  setArchiveModalOpen: (value: boolean) => void
  addProductDialogOpen: boolean
  setAddProductDialogOpen: (value: boolean) => void
}

type exceptionsTypes = {
  error: boolean
  success: boolean
  message: string
  submitting: boolean
  setError: (value: boolean) => void
  setSuccess: (value: boolean) => void
  setMessage: (value: string) => void
  setSubmitting: (value: boolean) => void
}

const productStore = create<productStoreTypes>((set) => ({
  data: {
    image: null,
    productName: '',
    category: '',
    price: 0,
    stockQuantity: 0,
  },
  editProductData: {
    productName: "",
    category: "",
    price: 0,
    stockQuantity: 0
  },
  searchInput: "",
  searchTerm: "",
  imagePreview: null,
  productId: null,
  setProductData: (data) =>
    set((state) => ({
      data: { ...state.data, ...data },
    })),
  setEditProductData: (data) => set((state) => ({
    editProductData: { ...state.editProductData, ...data }
  })),
  resetProductData: () =>
    set(() => ({
      data: {
        image: null,
        productName: '',
        category: '',
        price: 0,
        stockQuantity: 0,
      },
    })),
  setSearchInput: (value) => set(() => ({ searchInput: value })),
  setSearchTerm: (value) => set(() => ({ searchTerm: value })),
  setImagePreview: (value) => set(() => ({ imagePreview: value })),
  setProductId: (value) => set(() => ({ productId: value }))

}))

const filterProductStore = create<filterProductTypes>((set) => ({
  filterStatus: "All",
  setFilterStatus: (value: TFilterStatus) =>
    set({ filterStatus: value }),
}))

const modalProductStore = create<modalProductTypes>((set) => ({
  editProductModalOpen: false,
  archiveModalOpen: false,
  addProductDialogOpen: false,
  setEditProductModalOpen: (value) => set(() => ({ editProductModalOpen: value })),
  setArchiveModalOpen: (value) => set(() => ({ archiveModalOpen: value })),
  setAddProductDialogOpen: (value) => set(() => ({ addProductDialogOpen: value }))
}))

const exceptionsStore = create<exceptionsTypes>((set) => ({
  error: false,
  setError: (value) => set(() => ({ error: value })),
  success: false,
  message: "",
  submitting: false,
  setSuccess: (value) => set(() => ({ success: value })),
  setMessage: (value) => set(() => ({ message: value })),
  setSubmitting: (value) => set(() => ({ submitting: value }))
}))

export const useProductStore = () => productStore((state) => ({
  productData: state.data,
  setProductData: state.setProductData,
  resetProductData: state.resetProductData,
  searchInput: state.searchInput,
  setSearchInput: state.setSearchInput,
  searchTerm: state.searchTerm,
  setSearchTerm: state.setSearchTerm,
  imagePreview: state.imagePreview,
  setImagePreview: state.setImagePreview,
  productId: state.productId,
  setProductId: state.setProductId,
  editProductData: state.editProductData,
  setEditProductData: state.setEditProductData
}))

export const useFilterProductStore = () => filterProductStore((state) => ({
  filterStatus: state.filterStatus,
  setFilterStatus: state.setFilterStatus
}))

export const useModalProductStore = () => modalProductStore((state) => ({
  editProductModalOpen: state.editProductModalOpen,
  setEditProductModalOpen: state.setEditProductModalOpen,
  archiveProductModalOpen: state.archiveModalOpen,
  setArchiveProductModalOpen: state.setArchiveModalOpen,
  addProductDialogOpen: state.addProductDialogOpen,
  setAddProductDialogOpen: state.setAddProductDialogOpen
}))

export const useError = () => exceptionsStore((state) => state.error)
export const useSetError = () => exceptionsStore((state) => state.setError)
export const useSuccess = () => exceptionsStore((state) => state.success)
export const useSetSuccess = () => exceptionsStore((state) => state.setSuccess)
export const useMessage = () => exceptionsStore((state) => state.message)
export const useSetMessage = () => exceptionsStore((state) => state.setMessage)
export const useSubmitting = () => exceptionsStore((state) => state.submitting)
export const useSetSubmitting = () => exceptionsStore((state) => state.setSubmitting)
