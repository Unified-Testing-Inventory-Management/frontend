import { useMutation, useQuery } from '@tanstack/react-query'
import { checkAuth, loginUser, registerUser, logoutUser } from '@/api/user_api'
import type { User } from '@/@types'

export const UserData = (): User | null => {
    const { data } = useCheckAuthQuery()
    return data || null
}

export const useRegisterUserMutation = () => {
    return useMutation({
        mutationFn: registerUser,
        mutationKey: ['register'],
    })
}

export const useLoginUserMutation = () => {
    return useMutation({
        mutationFn: loginUser,
        mutationKey: ['login'],
    })
}

export const useCheckAuthQuery = () => {
    return useQuery({
        queryKey: ['me'],
        queryFn: checkAuth,
        retry: false,
        staleTime: 1000 * 60,
    })
}

export const useLogoutUserMutation = () => {
    return useMutation({
        mutationFn: logoutUser,
        mutationKey: ['logout'],
    })
}
