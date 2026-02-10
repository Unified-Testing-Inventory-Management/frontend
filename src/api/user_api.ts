import type { TLoginUserData, TRegisterUserData, TUpdateUserData, User } from '@/@types'
import { api } from './axios_api'

export const checkAuth = async (): Promise<User> => {
    const res = await api.get<User>('/api/v1/users/auth/me')
    return res.data
}

export const registerUser = async (data: Omit<TRegisterUserData, "confirmPassword">) => {
    const res = await api.post('/api/v1/users/auth/register', data)
    return res.data
}

export const loginUser = async (data: TLoginUserData) => {
    const res = await api.post('/api/v1/users/auth/login', data)
    return res.data
}

export const updateUser = async (data: TUpdateUserData) => {
    const res = await api.patch("/api/v1/users/auth/update-profile", data)
    return res.data
}

export const logoutUser = async () => {
    const res = await api.post('/api/v1/users/auth/logout')
    return res.data
}
