import type { Paginated, PaginationParams } from '@/features/core/types/pagination'

export interface HealthUnit {
	id: string
	name: string
	code: string
	city: string
	state: string
	address: string | null
	active: boolean
	createdAt: string
}

export type ListHealthUnitsParams = PaginationParams & {
	name?: string
	active?: boolean
}

export type PaginatedHealthUnits = Paginated<HealthUnit>

export interface CreateHealthUnitPayload {
	name: string
	code: string
	city: string
	state: string
	address?: string
}

export interface UpdateHealthUnitPayload {
	name?: string
	city?: string
	state?: string
	address?: string | null
	active?: boolean
}
