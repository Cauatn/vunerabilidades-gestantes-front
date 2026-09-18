import { normalizeText } from '@/features/core/utils/text'
import type { Vulnerabilidade } from '@/features/gestantes/data/mock'

export function toVulnerabilidade(level: string): Vulnerabilidade {
	const normalized = normalizeText(level).toLowerCase()
	if (normalized.includes('alta')) return 'alta'
	if (normalized.includes('moderada')) return 'moderada'
	if (normalized.includes('media')) return 'media'
	return 'baixa'
}
