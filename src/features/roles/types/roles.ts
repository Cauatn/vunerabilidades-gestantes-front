import type { UsuarioRole } from '@/features/usuarios/types/usuario'

export type Capability = 'users.manage' | 'questionnaire.configure' | 'assessments.apply' | 'health-units.manage'

export const ROLE_CAPABILITIES: Record<UsuarioRole, Capability[]> = {
	ADMIN: ['users.manage', 'questionnaire.configure', 'health-units.manage'],
	DOCTOR: ['assessments.apply'],
	NURSE: ['assessments.apply'],
}
