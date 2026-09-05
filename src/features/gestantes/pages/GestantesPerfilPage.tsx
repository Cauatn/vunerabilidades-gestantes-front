import { useNavigate, useParams } from 'react-router-dom'

import { Page } from '@/components/Layout/Page'
import { AvaliacoesTimeline } from '@/features/gestantes/components/AvaliacoesTimeline'
import { DadosPessoaisCard } from '@/features/gestantes/components/DadosPessoaisCard'
import { SectionDivider } from '@/features/gestantes/components/SectionDivider'
import { useGetGestante } from '@/features/gestantes/composables/useGetGestante'
import { usePatientAssessments } from '@/features/avaliacao/composables/useAssessments'
import { normalizeText } from '@/features/core/utils/text'
import type { AvaliacaoTimelineItem, Vulnerabilidade } from '@/features/gestantes/data/mock'

export function GestantesPerfilPage() {
	const navigate = useNavigate()
	const { id } = useParams<{ id: string }>()
	const { data } = useGetGestante(id)
	const { data: historico } = usePatientAssessments(id)
	const avaliacoes: AvaliacaoTimelineItem[] = (historico?.data.assessments.items ?? []).map((assessment) => {
		const result = assessment.result
		return {
			id: assessment.id,
			data: new Intl.DateTimeFormat('pt-BR').format(new Date(assessment.appliedAt)),
			titulo: `Avaliação #${assessment.id}`,
			vulnerabilidade: toVulnerabilidade(result.vulnerabilityLevel ?? 'BAIXA'),
			descricao: `Pontuação: ${result.totalScore ?? 0}.`,
		}
	})

	return (
		<Page
			title={data ? `Perfil de ${data.name}` : 'Perfil'}
			description={
				data ? `Acesse os dados e o histórico de aplicações da gestante ${data.name}.` : 'Carregando…'
			}
			withButton
			buttonText="Imprimir"
			buttonProps={{ onClick: () => navigate(`/gestantes/${id}/imprimir`) }}
		>
			<div className="flex flex-col gap-4">
				<section className="flex flex-col gap-3">
					<SectionDivider label="Dados pessoais" />
					{data ? <DadosPessoaisCard gestante={data} /> : null}
				</section>

				<section className="flex flex-col gap-3">
					<SectionDivider label="Histórico de avaliações" />
					<AvaliacoesTimeline items={avaliacoes} onViewDetails={(assessmentId) => navigate(`/historico/${assessmentId}`)} />
				</section>
			</div>
		</Page>
	)
}

function toVulnerabilidade(level: string): Vulnerabilidade {
	const normalized = normalizeText(level).toLowerCase()
	if (normalized.includes('alta')) return 'alta'
	if (normalized.includes('moderada')) return 'moderada'
	if (normalized.includes('media')) return 'media'
	return 'baixa'
}
