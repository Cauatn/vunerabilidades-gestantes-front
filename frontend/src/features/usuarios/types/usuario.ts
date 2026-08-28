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
	regiaoUf: string | null
	regiaoMunicipio: string | null
	healthUnitIds: string[]
	currentHealthUnitId: string | null
	firstAccess: boolean
	createdAt: string
	updatedAt: string
}

export interface PaginatedUsuarios {
	data: Usuario[]
	meta: { page: number; limit: number; total: number; totalPages: number }
}

export interface CreateUsuarioPayload {
	email: string
	name?: string
	role: UsuarioRole
	professionalRegistration?: string
	regiaoUf?: string
	regiaoMunicipio?: string
	healthUnitIds?: string[]
}

export type UpdateUsuarioPayload = Partial<Omit<CreateUsuarioPayload, 'email'>>
