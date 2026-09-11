import { api } from '@/features/core/service/apiService'
import type {
	InviteUsuarioPayload,
	ListUsuariosParams,
	PaginatedUsuarios,
	UpdateUsuarioPayload,
	Usuario,
	UsuarioStatus,
} from '@/features/usuarios/types/usuario'

export const getUsuarios = (params: ListUsuariosParams) =>
	api.get<PaginatedUsuarios>('/users', { params })

export const getUsuario = (id: string) => api.get<Usuario>(`/users/${id}`)

export const inviteUsuario = (payload: InviteUsuarioPayload) => api.post('/invitations', payload)

export const updateUsuario = (id: string, payload: UpdateUsuarioPayload) =>
	api.patch<Usuario>(`/users/${id}`, payload)

export const updateUsuarioStatus = (id: string, status: UsuarioStatus) =>
	api.patch(`/users/${id}/status`, { status })

export const setCurrentHealthUnit = (healthUnitId: string) =>
	api.patch('/users/me/current-health-unit', { healthUnitId })
