import type { UsuarioRole } from '@/features/usuarios/types/usuario'

export type Capability = 'users.manage' | 'questionnaire.configure'

export const ROLE_CAPABILITIES: Record<UsuarioRole, Capability[]> = {
	ADMIN: ['users.manage', 'questionnaire.configure'],
	DOCTOR: [],
	NURSE: [],
}
