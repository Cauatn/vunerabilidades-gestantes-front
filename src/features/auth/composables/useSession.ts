import { useCallback, useSyncExternalStore } from 'react'

import { getSessionUser, isAuthenticated, removeSession } from '@/features/core/service/tokenService'

function subscribe(callback: () => void) {
	window.addEventListener('storage', callback)
	window.addEventListener('auth:session-changed', callback)
	return () => {
		window.removeEventListener('storage', callback)
		window.removeEventListener('auth:session-changed', callback)
	}
}

export function useSession() {
	const user = useSyncExternalStore(subscribe, getSessionUser, () => null)
	const authenticated = useSyncExternalStore(subscribe, isAuthenticated, () => false)

	const logout = useCallback(() => {
		removeSession()
		window.dispatchEvent(new CustomEvent('auth:session-changed'))
	}, [])

	return { user, authenticated, logout }
}
