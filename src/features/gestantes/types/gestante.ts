import type { Paginated, PaginationParams } from '@/features/core/types/pagination'

export interface Gestante {
	id: string
	name: string
	identifiers: { cpf: string | null; cns: string | null }
	birthDate: string
	phone: string | null
	motherName: string | null
	lastMenstrualPeriod: string | null
	createdAt: string
	updatedAt: string
}

export type ListGestantesParams = PaginationParams & {
	name?: string
}

export type PaginatedGestantes = Paginated<Gestante>

export interface CreateGestantePayload {
	name: string
	cpf?: string
	cns?: string
	birthDate: string
	phone?: string
	motherName?: string
	lastMenstrualPeriod?: string
}

export interface UpdateGestantePayload {
	name?: string
	cpf?: string
	cns?: string
	birthDate?: string
	phone?: string | null
	motherName?: string | null
	lastMenstrualPeriod?: string | null
}
