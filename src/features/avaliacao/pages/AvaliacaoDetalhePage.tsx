import { Page } from '@/components/Layout/Page'
import { Badge } from '@/components/ui/badge'
import { Divider } from '@/components/ui/divider'
import { ResultadoAvaliacao } from '@/features/avaliacao/components/ResultadoAvaliacao'
import { useAssessment } from '@/features/avaliacao/composables/useAssessments'
import { CATEGORIA_PROFISSIONAL_LABEL } from '@/features/usuarios/constants/categoriaProfissional'
import { ROLE_TO_CATEGORIA } from '@/features/usuarios/types/usuario'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { AvaliacaoRecomendacoesGestante } from '../components/AvaliacaoRecomendacoesGestante'
import { GestanteResumoCard } from '../components/GestanteResumoCard'
import { ResumoAplicacaoCard } from '../components/ResumoAplicacaoCard'
import { groupAnswersBySection } from '../utils/groupAnswersBySection'
import { AvaliacaoRespostasAgrupadas } from '../components/AvaliacaoRespostasAgrupadas'

export function AvaliacaoDetalhePage() {
	const { id } = useParams<{ id: string }>()
	const { data: assessment, isLoading, isError } = useAssessment(id)

	const groupedAnswers = useMemo(
		() => groupAnswersBySection(assessment),
		[assessment],
	)

	if (isLoading)
		return <Page title="Avaliação" description="Carregando avaliação..." />
	if (isError || !assessment)
		return (
			<Page
				title="Avaliação"
				description="Não foi possível carregar esta avaliação."
			/>
		)

	return (
		<Page
			title={`Avaliação #${assessment.id}`}
			description="Dados registrados no momento da aplicação."
		>
			<div className="flex flex-col gap-6 pb-10">
				<section className="flex flex-col gap-3">
					<Divider text="Resumo da aplicação" />
					<ResumoAplicacaoCard
						appliedAt={assessment.appliedAt}
						ubs={assessment.healthUnit.name}
						aplicador={assessment.appliedByUser.name}
						categoriaProfissional={
							CATEGORIA_PROFISSIONAL_LABEL[
								ROLE_TO_CATEGORIA[assessment.appliedByUser.role]
							]
						}
						crmCoren={
							assessment.appliedByUser.professionalRegistration
						}
						email={assessment.appliedByUser.email}
					/>
				</section>

				<section className="flex flex-col gap-3">
					<Divider text="Gestante" />
					<GestanteResumoCard gestante={assessment.patient} />
				</section>

				<section className="flex flex-col gap-3">
					<Divider text="Resultado" />
					<ResultadoAvaliacao
						nomeGestante={assessment.patient.name}
						pontuacao={assessment.result.totalScore}
						vulnerabilityLevel={
							assessment.result.vulnerabilityLevel
						}
						vulnerabilityBandId={
							assessment.result.vulnerabilityBandId
						}
						bands={assessment.snapshot.props.vulnerabilityBands}
					/>
				</section>

				<section className="flex flex-col gap-3">
					<Divider text="Respostas" />
					<AvaliacaoRespostasAgrupadas groupedAnswers={groupedAnswers} />
				</section>

				<section className="flex flex-col gap-3">
					<Divider text="Recomendações" />
					<AvaliacaoRecomendacoesGestante
						recomendacoes={assessment.recommendations}
					/>
				</section>
			</div>
		</Page>
	)
}
