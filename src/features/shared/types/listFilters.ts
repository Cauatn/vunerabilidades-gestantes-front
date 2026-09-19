export interface ListFilters {
	healthUnitId?: string
	appliedByUserId?: string
	patientId?: string
	doctorId?: string
	vulnerabilityLevel?: string
	state?: string
	city?: string
	from?: string
	to?: string
}

// Datas do calendário representam dias locais, incluindo todo o último dia.
export function assessmentFilterParams(filters: ListFilters) {
	return {
		healthUnitId: filters.healthUnitId,
		appliedByUserId: filters.appliedByUserId,
		patientId: filters.patientId,
		vulnerabilityLevel: filters.vulnerabilityLevel,
		appliedFrom: filters.from
			? new Date(`${filters.from}T00:00:00`).toISOString()
			: undefined,
		appliedTo: filters.to
			? new Date(`${filters.to}T23:59:59.999`).toISOString()
			: undefined,
	}
}

export function activeFilterCount(filters: ListFilters) {
	const { from, to, ...others } = filters
	return Object.values(others).filter(Boolean).length + (from || to ? 1 : 0)
}
