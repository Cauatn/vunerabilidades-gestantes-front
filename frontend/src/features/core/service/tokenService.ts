export interface SessionUser {
	id: string
	name: string
	email: string
	role: 'ADMIN' | 'DOCTOR' | 'NURSE'
	healthUnitIds: string[]
	currentHealthUnitId: string | null
}

const TOKEN_KEY = 'gestare.accessToken'
const USER_KEY = 'gestare.user'

let cachedRaw: string | null = null
let cachedUser: SessionUser | null = null

export function getAccessToken(): string | null {
	return localStorage.getItem(TOKEN_KEY)
}

export function getSessionUser(): SessionUser | null {
	const raw = localStorage.getItem(USER_KEY)
	if (raw === cachedRaw) return cachedUser
	cachedRaw = raw
	try {
		cachedUser = raw ? (JSON.parse(raw) as SessionUser) : null
	} catch {
		cachedUser = null
	}
	return cachedUser
}

export function handleUserSession(data: { accessToken: string; user: SessionUser }) {
	localStorage.setItem(TOKEN_KEY, data.accessToken)
	localStorage.setItem(USER_KEY, JSON.stringify(data.user))
	window.dispatchEvent(new CustomEvent('auth:session-changed'))
}

export function updateSessionUser(user: SessionUser) {
	localStorage.setItem(USER_KEY, JSON.stringify(user))
	window.dispatchEvent(new CustomEvent('auth:session-changed'))
}

export function removeSession() {
	localStorage.removeItem(TOKEN_KEY)
	localStorage.removeItem(USER_KEY)
	cachedRaw = null
	cachedUser = null
}

export function isAuthenticated(): boolean {
	return !!getAccessToken()
}
