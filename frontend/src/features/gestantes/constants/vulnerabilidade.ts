import type { Vulnerabilidade } from '@/features/gestantes/types/gestante'

export const VULNERABILIDADE_LABEL: Record<Vulnerabilidade, string> = {
	baixa: 'Baixa',
	moderada: 'Moderada',
	alta: 'Alta',
}

export const VULNERABILIDADE_BADGE_VARIANT: Record<Vulnerabilidade, 'green' | 'yellow' | 'red'> = {
	baixa: 'green',
	moderada: 'yellow',
	alta: 'red',
}

export const VULNERABILIDADE_OPCOES: Vulnerabilidade[] = ['baixa', 'moderada', 'alta']
