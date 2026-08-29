import type { Paginated, PaginationParams } from '@/features/core/types/pagination'

export type IdentifierType = 'CPF' | 'SUS_CARD'

export interface Gestante {
	id: string
	name: string
	identifier: { type: IdentifierType; value: string }
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
	identifierType: IdentifierType
	identifierValue: string
	birthDate: string
	phone?: string
	motherName?: string
	lastMenstrualPeriod?: string
}

export interface UpdateGestantePayload {
	name?: string
	birthDate?: string
	phone?: string | null
	motherName?: string | null
	lastMenstrualPeriod?: string | null
}
