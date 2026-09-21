import { useParams } from 'react-router-dom'
import { formatarDataHoraBr } from '@/features/core/utils/date'

import { Logo } from '@/components/Logo'
import { useSession } from '@/features/auth/composables/useSession'
import { usePatientAssessments } from '@/features/avaliacao/composables/useAssessments'
import { AvaliacoesTimeline } from '@/features/gestantes/components/AvaliacoesTimeline'
import { DadosPessoaisCard } from '@/features/gestantes/components/DadosPessoaisCard'
import { SectionDivider } from '@/features/gestantes/components/SectionDivider'
import { useGetGestante } from '@/features/gestantes/composables/useGetGestante'
import type { AvaliacaoTimelineItem } from '@/features/gestantes/data/mock'
import { toVulnerabilidade } from '@/features/gestantes/utils/vulnerabilidade'
import { useGetHealthUnits } from '@/features/healthUnits/composables/useGetHealthUnits'

export function GestantesImprimirPage() {
	const { id } = useParams<{ id: string }>()
	const { data } = useGetGestante(id)
	const { data: historico } = usePatientAssessments(id)
	const { user } = useSession()
	const { data: healthUnits } = useGetHealthUnits()

	const dataEmissao = formatarDataHoraBr(new Date())
	const emissorNome = user?.name ?? '—'
	const ubsNome =
		healthUnits?.items.find((unit) => unit.id === user?.currentHealthUnitId)
			?.name ?? '—'

	const avaliacoes: AvaliacaoTimelineItem[] = (
		historico?.data.assessments.items ?? []
	).map((assessment) => {
		const result = assessment.result
		return {
			id: assessment.id,
			data: formatarDataHoraBr(assessment.appliedAt),
			titulo: `Avaliação #${assessment.id}`,
			vulnerabilidade: toVulnerabilidade(
				result.vulnerabilityLevel ?? 'BAIXA',
			),
			descricao: `Pontuação: ${result.totalScore ?? 0}.`,
		}
	})

	return (
		<div className="min-h-screen bg-n-0 text-n-800">
			<div className="mx-auto flex max-w-[1440px] flex-col px-10 py-10">
				<div className="flex justify-center">
					<Logo className="h-[122px] w-[162px]" />
				</div>

				<h1 className="mt-24 text-[44px] leading-[44px] font-semibold tracking-[0.15px] text-n-900">
					{data ? `Perfil de ${data.name}` : 'Perfil'}
				</h1>

				<div className="mt-14 flex flex-col gap-4">
					<section className="flex flex-col gap-3">
						<SectionDivider label="Dados pessoais" />
						{data ? <DadosPessoaisCard gestante={data} /> : null}
					</section>

					<section className="flex flex-col gap-3">
						<SectionDivider label="Histórico de avaliações" />
						<AvaliacoesTimeline items={avaliacoes} />
					</section>
				</div>

				<footer className="mt-16 flex justify-end">
					<div className="text-right text-sm leading-6 text-n-600">
						<p>Emitido em: {dataEmissao}</p>
						<p>Emissor: {emissorNome}</p>
						<p>UBS: {ubsNome}</p>
					</div>
				</footer>
			</div>
		</div>
	)
}
