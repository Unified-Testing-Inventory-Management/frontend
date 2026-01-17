import { useCheckAuthQuery } from '@/services/user_services'
import { Navigate } from '@tanstack/react-router'

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { data, isLoading, error } = useCheckAuthQuery()

    if (isLoading)
        return (
            <div className="w-full min-h-screen flex justify-center items-center">
                <div className="loader"></div>
            </div>
        )

    if (error) {
        const isUnauthorized = (error as any)?.response?.status === 401
        if (isUnauthorized) {
            return <Navigate to="/" />
        }
        return <Navigate to="/" />
    }

    if (!data) return <Navigate to="/" />

    return <>{children}</>
}
