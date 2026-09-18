import { useNavigate, useParams } from 'react-router-dom'
import { ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { Page } from '@/components/Layout/Page'
import { AvaliacoesTimeline } from '@/features/gestantes/components/AvaliacoesTimeline'
import { DadosPessoaisCard } from '@/features/gestantes/components/DadosPessoaisCard'
import { SectionDivider } from '@/features/gestantes/components/SectionDivider'
import { useGetGestante } from '@/features/gestantes/composables/useGetGestante'
import { usePatientAssessments } from '@/features/avaliacao/composables/useAssessments'
import { normalizeText } from '@/features/core/utils/text'
import { formatarDataHoraBr } from '@/features/core/utils/date'
import type {
	AvaliacaoTimelineItem,
	Vulnerabilidade,
} from '@/features/gestantes/data/mock'

export function GestantesPerfilPage() {
	const navigate = useNavigate()
	const { id } = useParams<{ id: string }>()
	const { data } = useGetGestante(id)
	const {
		data: historico,
		isPending: carregandoHistorico,
		isError: erroHistorico,
		isFetching: atualizandoHistorico,
		refetch: recarregarHistorico,
	} = usePatientAssessments(id)
	const avaliacoes: AvaliacaoTimelineItem[] = (
		historico?.data.assessments.items ?? []
	).map((assessment) => {
		const result = assessment.result
		const band = assessment.snapshot.props.vulnerabilityBands.find(
			(item) => item.id === result.vulnerabilityBandId,
		)
		return {
			id: assessment.id,
			vulnerabilityLevel: result.vulnerabilityLevel,
			color: band?.color,
			data: formatarDataHoraBr(assessment.appliedAt),
			titulo: `Avaliação #${assessment.id}`,
			vulnerabilidade: toVulnerabilidade(
				result.vulnerabilityLevel ?? 'BAIXA',
			),
			descricao: `Pontuação: ${result.totalScore ?? 0}.`,
		}
	})

	return (
		<Page
			title={data ? `Perfil de ${data.name}` : 'Perfil'}
			description={
				data
					? `Acesse os dados e o histórico de aplicações da gestante ${data.name}.`
					: 'Carregando…'
			}
			withButton
			buttonText="Imprimir"
			buttonProps={{
				onClick: () => navigate(`/gestantes/${id}/imprimir`),
			}}
		>
			<div className="flex flex-col gap-4">
				<section className="flex flex-col gap-3">
					<SectionDivider label="Dados pessoais" />
					{data ? <DadosPessoaisCard gestante={data} /> : null}
				</section>

				<section className="flex flex-col gap-3">
					<SectionDivider label="Histórico de avaliações" />
					{carregandoHistorico ? (
						<p
							role="status"
							className="rounded-xl border border-n-30 bg-n-0 p-10 text-center text-sm text-n-500"
						>
							Carregando histórico de avaliações...
						</p>
					) : erroHistorico ? (
						<div
							role="alert"
							className="rounded-xl border border-n-30 bg-n-0 p-10 text-center"
						>
							<p className="text-sm text-n-700">
								Não foi possível carregar o histórico de
								avaliações.
							</p>
							<Button
								type="button"
								variant="outline"
								className="mt-3"
								isLoading={atualizandoHistorico}
								onClick={() => void recarregarHistorico()}
							>
								Tentar novamente
							</Button>
						</div>
					) : avaliacoes.length === 0 ? (
						<div
							role="status"
							className="flex flex-col items-center rounded-xl border border-n-30 bg-n-0 p-10 text-center"
						>
							<ClipboardList
								aria-hidden="true"
								className="mb-3 size-10 text-n-400"
							/>
							<p className="text-base font-medium text-n-700">
								Nenhuma avaliação registrada.
							</p>
							<p className="mt-1 text-sm text-n-500">
								Esta gestante ainda não possui avaliações. As
								avaliações realizadas aparecerão aqui.
							</p>
						</div>
					) : (
						<AvaliacoesTimeline
							items={avaliacoes}
							onViewDetails={(assessmentId) =>
								navigate(`/historico/${assessmentId}`)
							}
						/>
					)}
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
