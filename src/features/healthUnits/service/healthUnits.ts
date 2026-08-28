import { api } from '@/features/core/service/apiService'
import type {
	CreateHealthUnitPayload,
	UpdateHealthUnitPayload,
} from '@/features/healthUnits/types/healthUnit'

export const getHealthUnits = (params: { page?: number; pageSize?: number; name?: string | null }) =>
	api.get('/health-units', { params })

export const createHealthUnit = (payload: CreateHealthUnitPayload) => api.post('/health-units', payload)

export const updateHealthUnit = (id: string, payload: UpdateHealthUnitPayload) =>
	api.patch(`/health-units/${id}`, payload)
