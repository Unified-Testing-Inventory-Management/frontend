import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { checkAuth, loginUser, registerUser, logoutUser, updateUser } from '@/api/user_api'
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
        queryFn: checkAuth,
        queryKey: ['me'],
        retry: false,
        staleTime: 1000 * 60,
    })
}

export const useUpdateUserMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: updateUser,
        mutationKey: ["update-profile"],
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["me"] })
        }
    })
}

export const useLogoutUserMutation = () => {
    return useMutation({
        mutationFn: logoutUser,
        mutationKey: ['logout'],
    })
}
