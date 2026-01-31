import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Register } from '@/components/Register'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeClosed } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { TLoginUserData } from '@/@types'
import {
  useCheckAuthQuery,
  useLoginUserMutation,
} from '@/services/user_services'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const navigate = useNavigate()
  const { data, isLoading } = useCheckAuthQuery()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [registerOpen, setRegisterOpen] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false)
  const [formData, setFormData] = useState<TLoginUserData>({
    username: '',
    password: '',
  })

  useEffect(() => {
    if (!isLoading && data) {
      navigate({ to: '/dashboard' })
    }
  }, [isLoading, data, navigate])

  const login = useLoginUserMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    await login.mutateAsync(formData, {
      onSuccess: (data) => {
        console.log(data)
        setIsSubmitting(false)
        navigate({ to: '/dashboard' })
      },
      onError: (err: any) => {
        if (err.response) {
          setIsSubmitting(false)
          console.log(err.response?.data.error)
          setError(err.response?.data.error)
        }
      },
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="">
          <CardTitle className="text-2xl font-bold text-center">
            Inventory System
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to your account to continue
            <p className="mt-1.5 text-red-500 text-[17px]">{error && error}</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
                autoFocus
                placeholder="Enter your username"
                className={`${error && 'ring-2 ring-red-500'}`}
              />
            </div>
            <div className="relative">
              <div className='space-y-2'>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type={isShowPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className={`${error && 'ring-2 ring-red-500'}`}
                />
              </div>
              {formData.password.length > 0 && (
                isShowPassword ? <Eye onClick={() => setIsShowPassword(false)} className='text-gray-300 text-sm absolute top-7 right-2.5' /> :
                  <EyeClosed onClick={() => setIsShowPassword(true)} className='text-gray-300 text-sm absolute top-7 right-2.5' />
              )
              }
            </div>
            <Button variant={`${formData.username.length && formData.password.length > 0 ? "default" : "secondary"}`} type="submit" className="w-full">
              {isSubmitting ? (
                <div className="w-full min-h-screen flex justify-center items-center">
                  <div className="loader-1"></div>
                </div>
              ) : (
                'Login'
              )}
            </Button>
            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                Don't have an account?{' '}
              </span>
              <Button
                type="button"
                variant="link"
                className=" p-0 h-auto font-semibold"
                onClick={() => setRegisterOpen(true)}
              >
                Register
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <Register open={registerOpen} onOpenChange={setRegisterOpen} />
    </div>
  )
}
