export interface HealthUnit {
	id: string
	name: string
	city: string
	state: string
	address: string | null
	active: boolean
	createdAt: string
}

export interface PaginatedHealthUnits {
	items: HealthUnit[]
	total: number
	page: number
	pageSize: number
}

export interface CreateHealthUnitPayload {
	name: string
	code: string
	city: string
	state: string
	address?: string
}

export type UpdateHealthUnitPayload = Partial<Omit<CreateHealthUnitPayload, 'code'>> & {
	active?: boolean
}
