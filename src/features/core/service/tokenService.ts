import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

export interface SessionUser {
	id: string
	name: string
	email: string
	role: 'ADMIN' | 'DOCTOR' | 'NURSE'
	healthUnitIds: string[]
	currentHealthUnitId: string | null
}

export const TOKEN_KEY = 'gestare-access-token'
export const USER_KEY = 'gestare-user'

interface JwtPayload {
	sub: string
	email: string
	role: string
	exp?: number
}

const getCookieOptions = (expires: Date) => ({
	secure: typeof window !== 'undefined' && window.location.protocol === 'https:',
	sameSite: 'lax' as const,
	expires,
})

let cachedRaw: string | undefined
let cachedUser: SessionUser | null = null

export function getAccessToken(): string | undefined {
	return Cookies.get(TOKEN_KEY)
}

export function getSessionUser(): SessionUser | null {
	const raw = Cookies.get(USER_KEY)
	if (raw === cachedRaw) return cachedUser
	cachedRaw = raw
	try {
		cachedUser = raw ? (JSON.parse(raw) as SessionUser) : null
	} catch {
		cachedUser = null
	}
	return cachedUser
}

function tokenExpiry(token: string): Date {
	try {
		const { exp } = jwtDecode<JwtPayload>(token)
		if (exp) return new Date(exp * 1000)
	} catch {
		/* token sem exp legível — cai no fallback */
	}
	return new Date(Date.now() + 8 * 60 * 60 * 1000)
}

export function handleUserSession(data: { accessToken: string; user: SessionUser }) {
	const expires = tokenExpiry(data.accessToken)
	Cookies.set(TOKEN_KEY, data.accessToken, getCookieOptions(expires))
	Cookies.set(USER_KEY, JSON.stringify(data.user), getCookieOptions(expires))
	window.dispatchEvent(new CustomEvent('auth:session-changed'))
}

export function updateSessionUser(user: SessionUser) {
	const token = getAccessToken()
	const expires = token ? tokenExpiry(token) : new Date(Date.now() + 8 * 60 * 60 * 1000)
	Cookies.set(USER_KEY, JSON.stringify(user), getCookieOptions(expires))
	window.dispatchEvent(new CustomEvent('auth:session-changed'))
}

export function removeSession() {
	Cookies.remove(TOKEN_KEY)
	Cookies.remove(USER_KEY)
	cachedRaw = undefined
	cachedUser = null
}

export function isAuthenticated(): boolean {
	return !!getAccessToken()
}
