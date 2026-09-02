import type { Assessment } from '@/features/avaliacao/types/assessment'
import { classificarNivel } from '@/features/avaliacao/utils/vulnerabilidade'
import { formatarDataBr } from '@/features/core/utils/date'
import type { AvaliacaoTimelineItem, Vulnerabilidade } from '@/features/gestantes/data/mock'

const CLASSIFICACAO_PARA_VULNERABILIDADE: Record<string, Vulnerabilidade> = {
	BAIXA: 'baixa',
	MODERADA: 'moderada',
	ALTA: 'alta',
}

export function atendimentoParaTimeline(atendimento: Assessment): AvaliacaoTimelineItem {
	const classificacao = classificarNivel(
		atendimento.result.vulnerabilityLevel,
		atendimento.snapshot.vulnerabilityBands,
		atendimento.result.vulnerabilityBandId,
	)

	return {
		id: atendimento.id,
		data: formatarDataBr(atendimento.appliedAt.slice(0, 10)),
		titulo: `Avaliação #${atendimento.id}`,
		vulnerabilidade: CLASSIFICACAO_PARA_VULNERABILIDADE[classificacao] ?? 'moderada',
		descricao: `Pontuação ${atendimento.result.totalScore} — vulnerabilidade ${atendimento.result.vulnerabilityLevel}.`,
	}
}
