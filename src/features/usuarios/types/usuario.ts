import type { Paginated, PaginationParams } from '@/features/core/types/pagination'

export type UsuarioRole = 'ADMIN' | 'DOCTOR' | 'NURSE'
export type UsuarioStatus = 'ACTIVE' | 'INACTIVE'
export type CategoriaProfissional = 'administrador' | 'medico' | 'enfermeiro'

export const ROLE_TO_CATEGORIA: Record<UsuarioRole, CategoriaProfissional> = {
	ADMIN: 'administrador',
	DOCTOR: 'medico',
	NURSE: 'enfermeiro',
}

export const CATEGORIA_TO_ROLE: Record<CategoriaProfissional, UsuarioRole> = {
	administrador: 'ADMIN',
	medico: 'DOCTOR',
	enfermeiro: 'NURSE',
}

export interface Usuario {
	id: string
	name: string
	email: string
	role: UsuarioRole
	status: UsuarioStatus
	professionalRegistration: string | null
	healthUnitIds: string[]
	currentHealthUnitId: string | null
	createdAt: string
}

export type ListUsuariosParams = PaginationParams & {
	search?: string
	role?: UsuarioRole
	healthUnitId?: string
}

export type PaginatedUsuarios = Paginated<Usuario>

export interface InviteUsuarioPayload {
	email: string
	role: UsuarioRole
	healthUnitIds?: string[]
}
