import type { GrauConfig, LimitesEscala } from '@/features/instrumentos/types/escala'
import type { QuestionnaireVersionApi, ReplaceVulnerabilityBandsPayload } from '@/features/instrumentos/types/questionnaireApi'

export function toEscala(version: QuestionnaireVersionApi): { limites: LimitesEscala; graus: GrauConfig[] } {
	const bands = [...version.vulnerabilityBands].sort((a, b) => a.order - b.order)

	const graus: GrauConfig[] = bands.map((band) => ({
		id: band.id,
		nome: band.level,
		cor: band.color,
		min: band.minScore,
		max: band.maxScore,
		recomendacoes: band.recommendations.map((recommendation) => ({
			id: recommendation.id,
			texto: recommendation.text,
		})),
	}))

	const limites: LimitesEscala = {
		min: bands[0]?.minScore ?? 0,
		max: bands[bands.length - 1]?.maxScore ?? 0,
	}

	return { limites, graus }
}

export function toReplaceVulnerabilityBandsPayload(graus: GrauConfig[]): ReplaceVulnerabilityBandsPayload {
	return {
		bands: graus.map((grau, order) => ({
			level: grau.nome.trim(),
			color: grau.cor,
			minScore: grau.min,
			maxScore: grau.max,
			order,
			recommendations: grau.recomendacoes.map((recomendacao, recomendacaoOrder) => ({
				text: recomendacao.texto.trim(),
				order: recomendacaoOrder,
			})),
		})),
	}
}
