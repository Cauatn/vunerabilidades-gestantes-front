export interface HealthUnit {
	id: string
	name: string
	city: string
	state: string
	cnes: string | null
	address: string | null
	isActive: boolean
	createdAt: string
	updatedAt: string
}

export interface PaginatedHealthUnits {
	data: HealthUnit[]
	meta: { page: number; limit: number; total: number; totalPages: number }
}

export interface CreateHealthUnitPayload {
	name: string
	city: string
	state: string
	cnes?: string
	address?: string
}

export type UpdateHealthUnitPayload = Partial<CreateHealthUnitPayload> & { isActive?: boolean }
