import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Register } from '@/components/Register'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, ShieldCheck, BarChart3, Package } from 'lucide-react'
import type { TLoginUserData } from '@/@types'
import {
  useCheckAuthQuery,
  useLoginUserMutation,
} from '@/services/user_services'
import logo from '../assets/logo1.webp'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const navigate = useNavigate()
  const { data, isLoading } = useCheckAuthQuery()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)
  const [error, setError] = useState('')
  const [isShowPassword, setIsShowPassword] = useState(false)
  const [formData, setFormData] = useState<TLoginUserData>({
    identifier: '',
    password: '',
  })

  useEffect(() => {
    if (!isLoading && data) navigate({ to: '/dashboard' })
  }, [isLoading, data, navigate])

  const login = useLoginUserMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    await login.mutateAsync(formData, {
      onSuccess: () => {
        setIsSubmitting(false)
        navigate({ to: '/dashboard' })
      },
      onError: (err: any) => {
        setIsSubmitting(false)
        setError(err.response?.data?.error ?? 'Something went wrong.')
      },
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (error) setError('')
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const isFormValid = formData.identifier.length > 0 && formData.password.length > 0

  return (
    <div className="min-h-screen flex">

      {/* ── Left panel — black ── */}
      <div className="hidden lg:flex lg:w-[65%] flex-col justify-between p-14 bg-black relative overflow-hidden">

        {/* Dot grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        {/* Glow */}
        <div className="pointer-events-none absolute -bottom-20 -left-20 w-80 h-80 bg-white/8 rounded-full blur-[100px]" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <img src={logo} alt="logo" className="w-9 h-9 rounded-xl object-cover" />
          <span className="text-white font-semibold text-sm tracking-tight">
            Technopreneurship
          </span>
        </div>

        {/* Main copy */}
        <div className="relative z-10 space-y-10">
          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
              Business Management
            </p>
            <h2 className="text-4xl font-bold text-white leading-[1.15] tracking-tight">
              Everything you need to run your business.
            </h2>
            <p className="text-zinc-400 text-base leading-relaxed max-w-xs">
              Manage products, track sales, and monitor inventory — all from one clean dashboard.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3">
            {[
              { icon: Package,     label: 'Product & inventory management' },
              { icon: BarChart3,   label: 'Sales analytics & reporting'    },
              { icon: ShieldCheck, label: 'Secure role-based access'        },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg border border-white/10 bg-white/5 shrink-0">
                  <Icon className="size-4 text-zinc-400" />
                </div>
                <span className="text-sm text-zinc-400">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-xs text-zinc-600">
          &copy; {new Date().getFullYear()} Technopreneurship System
        </p>
      </div>

      {/* ── Right panel — white ── */}
      <div className="flex-1 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-sm space-y-8">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 lg:hidden">
            <img src={logo} alt="logo" className="w-8 h-8 rounded-xl object-cover" />
            <span className="text-zinc-900 font-semibold text-sm">Technopreneurship</span>
          </div>

          {/* Heading */}
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Welcome back</h1>
            <p className="text-sm text-zinc-400">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              <span className="shrink-0 mt-px">⚠</span>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="identifier"
                className="text-zinc-500 text-xs font-medium uppercase tracking-widest"
              >
                Username
              </Label>
              <Input
                id="identifier"
                name="identifier"
                type="text"
                value={formData.identifier}
                onChange={handleChange}
                required
                autoFocus
                placeholder="Enter your username"
                className={`
                  h-11 rounded-xl bg-zinc-50 border-zinc-200 text-zinc-900
                  placeholder:text-zinc-300
                  hover:border-zinc-300
                  focus-visible:border-zinc-900 focus-visible:ring-zinc-900/10
                  transition-colors
                  ${error ? 'border-red-300 focus-visible:border-red-400 focus-visible:ring-red-100' : ''}
                `}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-zinc-500 text-xs font-medium uppercase tracking-widest"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={isShowPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className={`
                    h-11 rounded-xl pr-11 bg-zinc-50 border-zinc-200 text-zinc-900
                    placeholder:text-zinc-300
                    hover:border-zinc-300
                    focus-visible:border-zinc-900 focus-visible:ring-zinc-900/10
                    transition-colors
                    ${error ? 'border-red-300 focus-visible:border-red-400 focus-visible:ring-red-100' : ''}
                  `}
                />
                {formData.password.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsShowPassword((v) => !v)}
                    aria-label={isShowPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                    className="absolute inset-y-0 right-0 flex items-center px-3.5 text-zinc-300 hover:text-zinc-600 transition-colors"
                  >
                    {isShowPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="
                w-full h-11 rounded-xl font-semibold text-sm
                bg-zinc-900 text-white
                hover:bg-zinc-700
                disabled:opacity-30 disabled:cursor-not-allowed
                transition-all duration-150
                flex items-center justify-center
                shadow-sm
              "
            >
              {isSubmitting ? <div className="loader-1" /> : 'Sign in'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-zinc-100" />
            <span className="text-xs text-zinc-300">or</span>
            <div className="flex-1 h-px bg-zinc-100" />
          </div>

          <p className="text-center text-sm text-zinc-400">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => setRegisterOpen(true)}
              className="text-zinc-900 hover:text-zinc-600 font-semibold transition-colors"
            >
              Create one
            </button>
          </p>
        </div>
      </div>

      <Register open={registerOpen} onOpenChange={setRegisterOpen} />
    </div>
  )
}
