export type Vulnerabilidade = 'baixa' | 'moderada' | 'alta'

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
