import { Activity, useRef, useState } from 'react'
import { CheckCircle2Icon, Upload } from 'lucide-react'
import { useImportProductFromExcel } from '@/services/product_services'
import { Alert, AlertTitle } from './ui/alert'

export default function ExcelImportButton() {
  const [isSuccess, setIsSuccess] = useState(false)
  const [message, setMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const importProduct = useImportProductFromExcel()

  const handleClick = () => fileInputRef.current?.click()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      await importProduct.mutateAsync(file, {
        onSuccess: (data) => {
          setIsSuccess(true)
          setMessage(data.message)
          e.target.value = ''
          setTimeout(() => {
            setIsSuccess(false)
            setMessage('')
          }, 3500)
        },
      })
    } catch (error) {
      console.error('Import failed:', error)
    }
  }

  return (
    <div>
      <Activity mode={isSuccess ? 'visible' : 'hidden'}>
        <Alert className="animate-fade-in-out bg-zinc-900 w-72 absolute right-2 top-4 border-0">
          <CheckCircle2Icon color="white" className="size-4" />
          <AlertTitle>
            <span className="text-white text-sm font-medium">{message}</span>
          </AlertTitle>
        </Alert>
      </Activity>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 transition-colors"
      >
        <Upload className="size-3.5 text-zinc-400" />
        Import Excel
      </button>
    </div>
  )
}
