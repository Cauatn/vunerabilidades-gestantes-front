import { api } from '@/features/core/service/apiService'
import type {
	CreateGestantePayload,
	Gestante,
	ListGestantesParams,
	PaginatedGestantes,
	UpdateGestantePayload,
} from '@/features/gestantes/types/gestante'

export const getGestantes = (params: ListGestantesParams) =>
	api.get<PaginatedGestantes>('/patients', { params })

export const getGestante = (id: string) => api.get<Gestante>(`/patients/${id}`)

export const createGestante = (payload: CreateGestantePayload) => api.post('/patients', payload)

export const updateGestante = (id: string, payload: UpdateGestantePayload) =>
	api.patch(`/patients/${id}`, payload)
