import type { CategoriaProfissional } from '@/features/usuarios/types/usuario'

export const CATEGORIA_PROFISSIONAL_OPCOES: CategoriaProfissional[] = ['medico', 'enfermeiro', 'administrador']

export const CATEGORIA_PROFISSIONAL_LABEL: Record<CategoriaProfissional, string> = {
	medico: 'Médico(a)',
	enfermeiro: 'Enfermeiro(a)',
	administrador: 'Administrador(a)',
}

export const REGISTRO_PROFISSIONAL_LABEL: Partial<Record<CategoriaProfissional, string>> = {
	medico: 'CRM',
	enfermeiro: 'COREN',
}
