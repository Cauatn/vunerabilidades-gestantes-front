import { useParams } from 'react-router-dom'

import { Divider } from '@/components/ui/divider'
import { Page } from '@/components/Layout/Page'
import { ResultadoAvaliacao } from '@/features/avaliacao/components/ResultadoAvaliacao'
import { useAssessment } from '@/features/avaliacao/composables/useAssessments'
import { assessmentResult } from '@/features/avaliacao/services/assessments'
import type { Classificacao } from '@/features/avaliacao/constants'
import { useGetGestante } from '@/features/gestantes/composables/useGetGestante'

export function AvaliacaoDetalhePage() {
	const { id } = useParams<{ id: string }>()
	const { data: assessment, isLoading, isError } = useAssessment(id)
	const { data: patient } = useGetGestante(assessment?.patientId)

	if (isLoading) return <Page title="Avaliação" description="Carregando avaliação..." />
	if (isError || !assessment) return <Page title="Avaliação" description="Não foi possível carregar esta avaliação." />

	const result = assessmentResult(assessment.result)
	const classification = toClassificacao(result.vulnerabilityLevel ?? 'BAIXA')

	return (
		<Page title={`Avaliação #${assessment.id}`} description="Dados registrados no momento da aplicação.">
			<div className="flex flex-col gap-6">
				<section className="flex flex-col gap-3">
					<Divider text="Gestante" />
					<p className="text-sm text-n-700">{patient?.name ?? assessment.patientId}</p>
				</section>
				<section className="flex flex-col gap-3">
					<Divider text="Resultado" />
					<ResultadoAvaliacao nomeGestante={patient?.name ?? 'Gestante'} pontuacao={result.totalScore ?? 0} classificacao={classification} />
				</section>
				<section className="flex flex-col gap-3">
					<Divider text="Respostas" />
					<ul className="space-y-2 text-sm text-n-700">
						{assessment.answers.map((answer) => (
							<li key={answer.id} className="rounded-md border border-n-40 p-3">
								<p className="font-medium">{answer.questionStatement}</p>
								<p>{answer.optionLabel}</p>
							</li>
						))}
					</ul>
				</section>
				<section className="flex flex-col gap-3">
					<Divider text="Recomendações" />
					<ul className="list-disc pl-5 text-sm text-n-700">
						{assessment.recommendations.map((recommendation) => <li key={recommendation.id}>{recommendation.text}</li>)}
					</ul>
				</section>
			</div>
		</Page>
	)
}

function toClassificacao(level: string): Classificacao {
	const normalized = level.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase()
	if (normalized.includes('ALTA')) return 'ALTA'
	if (normalized.includes('MODERADA') || normalized.includes('MEDIA')) return 'MODERADA'
	return 'BAIXA'
}
