import { useEffect } from 'react'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'

import { AUTH_UNAUTHORIZED_EVENT } from '@/features/core/service/apiService'
import { useSession } from '@/features/auth/composables/useSession'

export function RequireAuth() {
	const { authenticated } = useSession()
	const location = useLocation()
	const navigate = useNavigate()

	useEffect(() => {
		function onUnauthorized() {
			navigate('/login', { replace: true })
		}
		window.addEventListener(AUTH_UNAUTHORIZED_EVENT, onUnauthorized)
		return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, onUnauthorized)
	}, [navigate])

	if (!authenticated) {
		return <Navigate to="/login" replace state={{ from: location.pathname }} />
	}

	return <Outlet />
}
