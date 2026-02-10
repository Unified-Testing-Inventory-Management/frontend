import { Activity, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { User, Building2, Edit2, Save, X, AtSign, Shield, CheckCircle2Icon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { TUpdateUserData, User as TUserData } from '@/@types'
import { UserData, useUpdateUserMutation } from '@/services/user_services'
import { Alert, AlertTitle } from '../ui/alert'

export function SettingsSection() {
  const user = UserData()
  const update = useUpdateUserMutation()
  const [isEditing, setIsEditing] = useState(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')
  const [profile] = useState<Omit<TUserData, "id" | "password"> | null>(
    user || null
  )

  const [editForm, setEditForm] = useState<TUpdateUserData>(user || {
    firstName: '',
    lastName: '',
    username: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    update.mutate(editForm, {
      onSuccess: (data) => {
        setIsEditing(false)
        setMessage(data.message)
        setIsSuccess(true)

        setTimeout(() => {
          setMessage("")
          setIsSuccess(false)
        }, 3500)
      },
      onError: (err: any) => {
        setIsEditing(true)
        if (err.response) console.log(err.response.data.error)
      }
    })
  }

  const handleCancel = () => {
    setEditForm(profile!)
    setIsEditing(false)
  }

  const getInitials = () => {
    if (!profile?.firstName || !profile.lastName) return 'U'
    return `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase()
  }

  const getRoleColor = (role?: string) => {
    const colors: Record<string, string> = {
      Owner: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800',
      Admin: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
      Manager: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
      Employee: 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-800',
    }
    return colors[role!] || colors.Employee
  }

  return (
    <>
      <Activity mode={isSuccess ? 'visible' : 'hidden'}>
        <Alert className="animate-fade-in-out bg-green-500 w-70 absolute right-2 top-4">
          <CheckCircle2Icon color='white' />
          <AlertTitle>
            <span className="text-white text-[16px] font-bold">{message}</span>
          </AlertTitle>
        </Alert>
      </Activity>
      <div className="w-full max-w-7xl mx-auto space-y-6">
        {/* Hero Profile Section */}
        <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-background via-background to-muted/30">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
            <CardContent className="relative p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Avatar Section */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-3xl font-bold text-primary-foreground shadow-lg ring-4 ring-background transition-transform duration-300 group-hover:scale-105">
                    {getInitials()}
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1 space-y-3">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                      {profile?.firstName} {profile?.lastName}
                    </h1>
                    <p className="text-muted-foreground mt-1 flex items-center gap-2">
                      <AtSign className="h-4 w-4" />
                      {profile?.username}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge className={cn('px-3 py-1 font-medium border', getRoleColor(profile?.role))}>
                      <Shield className="h-3.5 w-3.5 mr-1.5" />
                      {profile?.role}
                    </Badge>
                  </div>
                </div>

                {/* Action Button */}
                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    size="lg"
                    className="shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Details Card - Takes 2/3 width */}
          <Card className="lg:col-span-2 shadow-md">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Account Details</CardTitle>
                  <CardDescription className="mt-1">
                    {isEditing
                      ? 'Update your personal information'
                      : 'View and manage your account information'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {isEditing ? (
                <form className="space-y-8" onSubmit={handleSave}>
                  {/* Personal Information Section */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Personal Information
                      </h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-sm font-medium">
                            First Name
                          </Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={editForm.firstName}
                            onChange={handleChange}
                            className="h-11"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-sm font-medium">
                            Last Name
                          </Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={editForm.lastName}
                            onChange={handleChange}
                            className="h-11"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Account Information Section */}
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Account Information
                      </h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="username" className="text-sm font-medium flex items-center gap-2">
                            <AtSign className="h-4 w-4 text-muted-foreground" />
                            Username
                          </Label>
                          <Input
                            id="username"
                            name="username"
                            value={editForm.username}
                            onChange={handleChange}
                            className="h-11"
                            required
                          />
                          <span className='text-[14px] -mt-4 text-gray-500/60 '><b>Note:`</b> Once you update this username, it will be used for login. Make sure to remember it.</span>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="role" className="text-sm font-medium flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            Role
                          </Label>
                          <select
                            disabled
                            id="role"
                            name="role"
                            value={profile?.role}
                            onChange={handleChange}
                            className={cn(
                              'flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
                              'ring-offset-background focus-visible:outline-none focus-visible:ring-2',
                              'focus-visible:ring-ring focus-visible:ring-offset-2',
                              'disabled:cursor-not-allowed disabled:opacity-50',
                              'transition-colors'
                            )}
                            required
                          >
                            <option value="Owner">Owner</option>
                            <option value="Admin">Admin</option>
                            <option value="Manager">Manager</option>
                            <option value="Employee">Employee</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Form Actions */}
                  <div className="flex justify-end gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      className="min-w-[100px]"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="min-w-[140px] shadow-sm hover:shadow-md transition-shadow"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-8">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Personal Information
                    </h3>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          First Name
                        </Label>
                        <p className="text-base font-medium">{profile?.firstName}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Last Name
                        </Label>
                        <p className="text-base font-medium">{profile?.lastName}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Account Information */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Account Information
                    </h3>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                          <AtSign className="h-3.5 w-3.5" />
                          Username
                        </Label>
                        <p className="text-base font-medium">{profile?.username}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                          <Building2 className="h-3.5 w-3.5" />
                          Role
                        </Label>
                        <Badge className={cn('px-3 py-1 font-medium border', getRoleColor(profile?.role))}>
                          {profile?.role}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Info Sidebar - Takes 1/3 width */}
          <div className="space-y-6">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Full Name</p>
                      <p className="text-sm font-medium">{profile?.firstName} {profile?.lastName}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <AtSign className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Username</p>
                      <p className="text-sm font-medium truncate">{profile?.username}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Role</p>
                      <Badge className={cn('mt-1 px-2 py-0.5 text-xs font-medium border', getRoleColor(profile?.role))}>
                        {profile?.role}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Status Card */}
            <Card className="shadow-md border-2 border-primary/10">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Account Status</p>
                    <p className="text-xs text-muted-foreground mt-1">Active</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
