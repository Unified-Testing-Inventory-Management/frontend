import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { TRegisterUserData } from '@/@types'
import { useRegisterUserMutation } from '@/services/user_services'
import { Eye, EyeOff } from 'lucide-react'

interface RegisterProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function Register({ open, onOpenChange }: RegisterProps) {
  const register = useRegisterUserMutation()
  const [isShowPassword, setIsShowPassword] = useState(false)
  const [isShowConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState<TRegisterUserData>({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: '',
  })

  const passwordMismatch =
    formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword

  const isFormValid =
    formData.firstName &&
    formData.lastName &&
    formData.username &&
    formData.password &&
    formData.confirmPassword &&
    !passwordMismatch

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.confirmPassword !== formData.password) {
      setMessage('Passwords do not match')
      return
    }
    register.mutate(formData, {
      onSuccess: () => {
        onOpenChange(false)
        setFormData({ firstName: '', lastName: '', username: '', password: '', confirmPassword: '' })
      },
      onError: (err: any) => {
        if (err.response) setMessage(err.response?.data.error)
      },
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (message) setMessage('')
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const inputCls = 'h-10 rounded-lg bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-300 hover:border-zinc-300 focus-visible:border-zinc-900 focus-visible:ring-zinc-900/10 transition-colors'
  const labelCls = 'text-zinc-500 text-xs font-medium uppercase tracking-widest'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-zinc-900">Create an account</DialogTitle>
          <DialogDescription className="text-zinc-400 text-sm">
            Fill in your details to register for StockWise.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="firstName" className={labelCls}>First Name</Label>
              <Input id="firstName" name="firstName" type="text" value={formData.firstName} onChange={handleChange} required placeholder="First name" className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName" className={labelCls}>Last Name</Label>
              <Input id="lastName" name="lastName" type="text" value={formData.lastName} onChange={handleChange} required placeholder="Last name" className={inputCls} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="username" className={labelCls}>Username</Label>
            <Input id="username" name="username" type="text" value={formData.username} onChange={handleChange} required placeholder="Choose a username" className={inputCls} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className={labelCls}>Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={isShowPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Create a password"
                className={`${inputCls} pr-10`}
              />
              {formData.password.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsShowPassword((v) => !v)}
                  tabIndex={-1}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-zinc-300 hover:text-zinc-600 transition-colors"
                >
                  {isShowPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className={labelCls}>Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={isShowConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
                className={`${inputCls} pr-10 ${message ? 'border-red-300 focus-visible:border-red-400' : ''}`}
              />
              {formData.confirmPassword.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  tabIndex={-1}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-zinc-300 hover:text-zinc-600 transition-colors"
                >
                  {isShowConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              )}
            </div>
            {message && <p className="text-xs text-red-500">{message}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Create account
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
