import type { Classificacao } from '@/features/avaliacao/constants'
import type { VulnerabilityBand } from '@/features/instrumentos/types/questionnaire'

function normalizar(texto: string) {
	return texto
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.trim()
}

export function classificarNivel(
	level: string,
	bands?: VulnerabilityBand[],
	bandId?: string,
): Classificacao {
	const alvo = normalizar(level)
	if (alvo.includes('baix')) return 'BAIXA'
	if (alvo.includes('alt') || alvo.includes('grav') || alvo.includes('sever')) return 'ALTA'
	if (alvo.includes('moder') || alvo.includes('medi') || alvo.includes('méd')) return 'MODERADA'

	if (bands && bands.length > 0 && bandId) {
		const ordenadas = [...bands].sort((a, b) => a.minScore - b.minScore)
		const indice = ordenadas.findIndex((banda) => banda.id === bandId)
		if (indice >= 0) {
			const fatia = indice / Math.max(ordenadas.length - 1, 1)
			if (fatia <= 0.34) return 'BAIXA'
			if (fatia >= 0.67) return 'ALTA'
			return 'MODERADA'
		}
	}

	return 'MODERADA'
}
