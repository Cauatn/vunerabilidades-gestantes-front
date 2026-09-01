import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'

import { getAccessToken, removeSession } from './tokenService'

export const AUTH_UNAUTHORIZED_EVENT = 'auth:unauthorized'

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	timeout: 15000,
})

api.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		const token = getAccessToken()
		if (token && config.headers) {
			config.headers.Authorization = `Bearer ${token}`
		}
		if (config.params) {
			config.params = dropEmptyParams(config.params)
		}
		return config
	},
	(error) => Promise.reject(error),
)

api.interceptors.response.use(
	(response) => response,
	(error: AxiosError) => {
		const isLoginCall = error.config?.url?.includes('/auth/login')
		if (error.response?.status === 401 && !isLoginCall) {
			removeSession()
			window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT))
		}
		return Promise.reject(error)
	},
)

function dropEmptyParams(params: Record<string, unknown>): Record<string, unknown> {
	return Object.fromEntries(
		Object.entries(params).filter(([, value]) => value !== null && value !== undefined && value !== ''),
	)
}
