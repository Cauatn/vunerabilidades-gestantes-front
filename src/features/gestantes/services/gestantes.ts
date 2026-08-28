import { api } from '@/features/core/service/apiService'
import type {
	CreateGestantePayload,
	UpdateGestantePayload,
} from '@/features/gestantes/types/gestante'

export const getGestantes = (params: {
	page?: number
	limit?: number
	search?: string | null
	isActive?: boolean
}) => api.get('/patients', { params })

export const getGestante = (id: string) => api.get(`/patients/${id}`)

export const createGestante = (payload: CreateGestantePayload) => api.post('/patients', payload)

export const updateGestante = (id: string, payload: UpdateGestantePayload) =>
	api.patch(`/patients/${id}`, payload)

export const deactivateGestante = (id: string) => api.delete(`/patients/${id}`)
