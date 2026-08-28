import { api } from '@/features/core/service/apiService'
import type { InviteUsuarioPayload, UsuarioRole, UsuarioStatus } from '@/features/usuarios/types/usuario'

export const getUsuarios = (params: {
	page?: number
	pageSize?: number
	search?: string | null
	role?: UsuarioRole | null
	healthUnitId?: string | null
}) => api.get('/users', { params })

export const getUsuario = (id: string) => api.get(`/users/${id}`)

export const inviteUsuario = (payload: InviteUsuarioPayload) => api.post('/invitations', payload)

export const updateUsuarioStatus = (id: string, status: UsuarioStatus) =>
	api.patch(`/users/${id}/status`, { status })

export const setCurrentHealthUnit = (healthUnitId: string) =>
	api.patch('/users/me/current-health-unit', { healthUnitId })
