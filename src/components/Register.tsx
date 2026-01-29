import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { TRegisterUserData } from '@/@types'
import { useRegisterUserMutation } from '@/services/user_services'

interface RegisterProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function Register({ open, onOpenChange }: RegisterProps) {
  const [formData, setFormData] = useState<TRegisterUserData>({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    role: "Owner"
  })
  const register = useRegisterUserMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    console.log('Register:', formData)

    register.mutate(formData, {
      onSuccess: () => {
        onOpenChange(false)
        setFormData({
          firstName: "",
          lastName: "",
          username: "",
          password: "",
          role: ""
        });
      },
      onError: (err: any) => {
        if (err.response) {
          console.log(err.response?.data.error);
        }
      }
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-130">
        <DialogHeader>
          <DialogTitle>Register for Inventory System</DialogTitle>
          <DialogDescription>
            Create a new account to access the inventory system. Please fill in
            all the required information.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              required
              placeholder="Enter your first name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              required
              placeholder="Enter your last name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Choose a username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a password"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button variant={`${formData.firstName.length && formData.lastName.length && formData.username.length && formData.password.length > 0 ? "default" : "secondary"}`} type="submit">Register</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
