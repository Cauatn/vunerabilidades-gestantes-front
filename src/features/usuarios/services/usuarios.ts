import { api } from '@/features/core/service/apiService'
import type {
	CreateUsuarioPayload,
	UpdateUsuarioPayload,
	UsuarioRole,
	UsuarioStatus,
} from '@/features/usuarios/types/usuario'

export const getUsuarios = (params: {
	page?: number
	limit?: number
	search?: string | null
	role?: UsuarioRole | null
	status?: UsuarioStatus | null
	healthUnitId?: string | null
}) => api.get('/users', { params })

export const getUsuario = (id: string) => api.get(`/users/${id}`)

export const createUsuario = (payload: CreateUsuarioPayload) => api.post('/users', payload)

export const updateUsuario = (id: string, payload: UpdateUsuarioPayload) => api.patch(`/users/${id}`, payload)

export const updateUsuarioStatus = (id: string, status: UsuarioStatus) =>
	api.patch(`/users/${id}/status`, { status })

export const setCurrentHealthUnit = (healthUnitId: string) =>
	api.patch('/users/me/current-health-unit', { healthUnitId })
