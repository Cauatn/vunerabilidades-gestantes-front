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

export function AvaliacaoDetalhePage() {
	const { id } = useParams<{ id: string }>()
	const { data: assessment, isLoading, isError } = useAssessment(id)

	const groupedAnswers = useMemo(() => {
		if (!assessment) return {}

		return assessment.answers.reduce(
			(acc, answer) => {
				const question = assessment.snapshot.props.questions.find(
					(q) => q.id === answer.questionId,
				)
				const section = question?.section || 'Outros'

				if (!acc[section]) {
					acc[section] = { answers: [], totalScore: 0 }
				}
				acc[section].answers.push(answer)
				acc[section].totalScore += answer.score || 0

				return acc
			},
			{} as Record<
				string,
				{ answers: typeof assessment.answers; totalScore: number }
			>,
		)
	}, [assessment])

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
					<div className="flex flex-col gap-6 text-sm text-n-700">
						{Object.entries(groupedAnswers).map(
							([section, data], index) => {
								return (
									<div
										key={section}
										className="flex flex-col gap-3"
									>
										<div className="flex items-center gap-2">
											<h3 className="font-semibold text-t-400 text-lg">
												{index + 1}. {section}
											</h3>
											<Badge variant="blue">
												{data.totalScore} pts.
											</Badge>
										</div>
										<ul className="space-y-2">
											{data.answers.map(
												(answer, index) => (
													<li key={answer.id}>
														<div className="flex gap-2 items-center">
															<p className="text-md font-semibold">
																{index + 1}.{' '}
																{
																	answer.questionStatement
																}
															</p>
															<Badge variant="neutral">
																{answer.score}{' '}
																pts.
															</Badge>
														</div>
														<p className="text-n-500">
															R:{' '}
															{answer.optionLabel}
														</p>
													</li>
												),
											)}
										</ul>
									</div>
								)
							},
						)}
					</div>
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
