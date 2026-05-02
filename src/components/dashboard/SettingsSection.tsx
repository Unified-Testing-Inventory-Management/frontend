import { Activity, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  const [isSuccess, setIsSuccess] = useState(false)
  const [message, setMessage] = useState('')
  const [profile] = useState<Omit<TUserData, 'id' | 'password'> | null>(user || null)
  const [editForm, setEditForm] = useState<TUpdateUserData>(user || { firstName: '', lastName: '', username: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    update.mutate(editForm, {
      onSuccess: (data) => {
        setIsEditing(false)
        setMessage(data.message)
        setIsSuccess(true)
        setTimeout(() => { setMessage(''); setIsSuccess(false) }, 3500)
      },
      onError: (err: any) => {
        setIsEditing(true)
        if (err.response) console.log(err.response.data.error)
      },
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

  const getRoleBadgeClass = (role?: string) => {
    const map: Record<string, string> = {
      Owner:    'bg-purple-50 text-purple-700 border-purple-200',
      Admin:    'bg-blue-50 text-blue-700 border-blue-200',
      Manager:  'bg-green-50 text-green-700 border-green-200',
      Employee: 'bg-zinc-100 text-zinc-600 border-zinc-200',
    }
    return map[role!] || map.Employee
  }

  const inputCls = 'h-10 rounded-lg bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-300 hover:border-zinc-300 focus-visible:border-zinc-900 focus-visible:ring-zinc-900/10 transition-colors'
  const labelCls = 'text-zinc-400 text-xs font-medium uppercase tracking-widest'

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

      <div className="w-full max-w-5xl mx-auto space-y-5">
        {/* Profile hero */}
        <Card className="border-zinc-100 shadow-none overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar */}
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-zinc-900 text-2xl font-bold text-white shrink-0">
                {getInitials()}
              </div>

              {/* Info */}
              <div className="flex-1 space-y-2">
                <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
                  {profile?.firstName} {profile?.lastName}
                </h1>
                <p className="text-sm text-zinc-400 flex items-center gap-1.5">
                  <AtSign className="h-3.5 w-3.5" />
                  {profile?.username}
                </p>
                <Badge className={cn('px-2.5 py-0.5 text-xs font-medium border', getRoleBadgeClass(profile?.role))}>
                  <Shield className="h-3 w-3 mr-1" />
                  {profile?.role}
                </Badge>
              </div>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  Edit Profile
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-5 lg:grid-cols-3">
          {/* Account details — 2/3 */}
          <Card className="lg:col-span-2 border-zinc-100 shadow-none">
            <CardHeader className="border-b border-zinc-100">
              <CardTitle className="text-base font-semibold text-zinc-900">Account Details</CardTitle>
              <CardDescription className="text-zinc-400">
                {isEditing ? 'Update your personal information' : 'Your account information'}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {isEditing ? (
                <form className="space-y-6" onSubmit={handleSave}>
                  <div>
                    <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <User className="h-3.5 w-3.5" /> Personal Information
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="firstName" className={labelCls}>First Name</Label>
                        <Input id="firstName" name="firstName" value={editForm.firstName} onChange={handleChange} className={inputCls} required />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="lastName" className={labelCls}>Last Name</Label>
                        <Input id="lastName" name="lastName" value={editForm.lastName} onChange={handleChange} className={inputCls} required />
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-zinc-100" />

                  <div>
                    <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Shield className="h-3.5 w-3.5" /> Account Information
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="username" className={labelCls}>Username</Label>
                        <Input id="username" name="username" value={editForm.username} onChange={handleChange} className={inputCls} required />
                        <p className="text-xs text-zinc-400">Once updated, use this username to log in.</p>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="role" className={labelCls}>Role</Label>
                        <select
                          disabled
                          id="role"
                          name="role"
                          value={profile?.role}
                          className={cn('flex h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50')}
                        >
                          <option value="Owner">Owner</option>
                          <option value="Admin">Admin</option>
                          <option value="Manager">Manager</option>
                          <option value="Employee">Employee</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-zinc-100" />

                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={handleCancel} className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors">
                      <X className="h-3.5 w-3.5" /> Cancel
                    </button>
                    <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700 transition-colors">
                      <Save className="h-3.5 w-3.5" /> Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <User className="h-3.5 w-3.5" /> Personal Information
                    </h3>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <p className={labelCls}>First Name</p>
                        <p className="text-sm font-medium text-zinc-900 mt-1">{profile?.firstName}</p>
                      </div>
                      <div>
                        <p className={labelCls}>Last Name</p>
                        <p className="text-sm font-medium text-zinc-900 mt-1">{profile?.lastName}</p>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-zinc-100" />

                  <div>
                    <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Shield className="h-3.5 w-3.5" /> Account Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className={`${labelCls} flex items-center gap-1.5`}><AtSign className="h-3 w-3" /> Username</p>
                        <p className="text-sm font-medium text-zinc-900 mt-1">{profile?.username}</p>
                      </div>
                      <div>
                        <p className={`${labelCls} flex items-center gap-1.5`}><Building2 className="h-3 w-3" /> Role</p>
                        <Badge className={cn('mt-1.5 px-2.5 py-0.5 text-xs font-medium border', getRoleBadgeClass(profile?.role))}>
                          {profile?.role}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick info — 1/3 */}
          <div className="space-y-4">
            <Card className="border-zinc-100 shadow-none">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-zinc-900">Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { icon: User,    label: 'Full Name', value: `${profile?.firstName} ${profile?.lastName}` },
                  { icon: AtSign,  label: 'Username',  value: profile?.username },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3 rounded-lg border border-zinc-100 p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 shrink-0">
                      <Icon className="h-4 w-4 text-zinc-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-zinc-400">{label}</p>
                      <p className="text-sm font-medium text-zinc-900 truncate">{value}</p>
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-3 rounded-lg border border-zinc-100 p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 shrink-0">
                    <Shield className="h-4 w-4 text-zinc-500" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400">Role</p>
                    <Badge className={cn('mt-1 px-2 py-0.5 text-xs font-medium border', getRoleBadgeClass(profile?.role))}>
                      {profile?.role}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-zinc-100 shadow-none">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">Account Status</p>
                    <p className="text-xs text-zinc-400 mt-0.5">Active</p>
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
