import { api } from '@/features/core/service/apiService'
import type {
	CreateHealthUnitPayload,
	ListHealthUnitsParams,
	PaginatedHealthUnits,
	UpdateHealthUnitPayload,
} from '@/features/healthUnits/types/healthUnit'

export const getHealthUnits = (params: ListHealthUnitsParams) =>
	api.get<PaginatedHealthUnits>('/health-units', { params })

export const createHealthUnit = (payload: CreateHealthUnitPayload) => api.post('/health-units', payload)

export const updateHealthUnit = (id: string, payload: UpdateHealthUnitPayload) =>
	api.patch(`/health-units/${id}`, payload)
