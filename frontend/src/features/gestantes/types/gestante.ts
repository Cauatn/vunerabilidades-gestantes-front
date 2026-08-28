export type Vulnerabilidade = 'baixa' | 'moderada' | 'alta'

export interface Gestante {
	id: string
	name: string
	cpf: string | null
	cns: string | null
	birthDate: string
	motherName: string | null
	phone: string | null
	isActive: boolean
	createdAt: string
	updatedAt: string
}

export interface PaginatedGestantes {
	data: Gestante[]
	meta: { page: number; limit: number; total: number; totalPages: number }
}

export interface CreateGestantePayload {
	name: string
	cpf?: string
	cns?: string
	birthDate: string
	motherName?: string
	phone?: string
}

export type UpdateGestantePayload = Partial<CreateGestantePayload> & { isActive?: boolean }
