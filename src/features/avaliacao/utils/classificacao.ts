import { normalizeText } from '@/features/core/utils/text'

import type { Classificacao } from '../constants'

export function toClassificacao(level: string): Classificacao {
	const normalized = normalizeText(level).toUpperCase()
	if (normalized.includes('ALTA')) return 'ALTA'
	if (normalized.includes('MODERADA') || normalized.includes('MEDIA')) return 'MODERADA'
	return 'BAIXA'
}
