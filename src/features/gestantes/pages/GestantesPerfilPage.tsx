import { useNavigate, useParams } from 'react-router-dom'

import { GestantesShell } from '@/features/gestantes/components/GestantesShell'
import { AvaliacoesTimeline } from '@/features/gestantes/components/AvaliacoesTimeline'
import { DadosPessoaisCard } from '@/features/gestantes/components/DadosPessoaisCard'
import { SectionDivider } from '@/features/gestantes/components/SectionDivider'
import { useGetGestante } from '@/features/gestantes/composables/useGetGestante'
import { usePatientAssessments } from '@/features/avaliacao/composables/useAssessments'
import type { AvaliacaoTimelineItem, Vulnerabilidade } from '@/features/gestantes/data/mock'

export function GestantesPerfilPage() {
	const navigate = useNavigate()
	const { id } = useParams<{ id: string }>()
	const { data } = useGetGestante(id)
	const { data: historico } = usePatientAssessments(id)
	const avaliacoes: AvaliacaoTimelineItem[] = (historico?.data.assessments.items ?? []).map((assessment) => ({
		id: assessment.id,
		data: new Intl.DateTimeFormat('pt-BR').format(new Date(assessment.appliedAt)),
		titulo: `Avaliação #${assessment.id}`,
		vulnerabilidade: toVulnerabilidade(assessment.result.vulnerabilityLevel),
		descricao: `Pontuação: ${assessment.result.totalScore}.`,
	}))

	return (
		<GestantesShell
			title={data ? `Perfil de ${data.name}` : 'Perfil'}
			subtitle={
				data ? `Acesse os dados e o histórico de aplicações da gestante ${data.name}.` : 'Carregando…'
			}
			action={{ label: 'Imprimir', onClick: () => navigate(`/gestantes/${id}/imprimir`) }}
		>
			<div className="flex flex-col gap-4">
				<section className="flex flex-col gap-3">
					<SectionDivider label="Dados pessoais" />
					{data ? <DadosPessoaisCard gestante={data} /> : null}
				</section>

				<section className="flex flex-col gap-3">
					<SectionDivider label="Histórico de avaliações" />
					<AvaliacoesTimeline items={avaliacoes} />
				</section>
			</div>
		</GestantesShell>
	)
}

function toVulnerabilidade(level: string): Vulnerabilidade {
	const normalized = level.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
	if (normalized.includes('alta')) return 'alta'
	if (normalized.includes('moderada')) return 'moderada'
	if (normalized.includes('media')) return 'media'
	return 'baixa'
}
