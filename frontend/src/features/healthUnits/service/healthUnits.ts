import { api } from '@/features/core/service/apiService'
import type {
	CreateHealthUnitPayload,
	UpdateHealthUnitPayload,
} from '@/features/healthUnits/types/healthUnit'

export const getHealthUnits = (params: { page?: number; limit?: number; search?: string | null; isActive?: boolean }) =>
	api.get('/health-units', { params })

export const getHealthUnit = (id: string) => api.get(`/health-units/${id}`)

export const createHealthUnit = (payload: CreateHealthUnitPayload) => api.post('/health-units', payload)

export const updateHealthUnit = (id: string, payload: UpdateHealthUnitPayload) =>
	api.patch(`/health-units/${id}`, payload)
