import { useParams } from 'react-router-dom'

import { Divider } from '@/components/ui/divider'
import { AvaliacaoImpressaoLayout } from '@/features/avaliacao/components/AvaliacaoImpressaoLayout'
import { AvaliacaoRecomendacoesGestante } from '@/features/avaliacao/components/AvaliacaoRecomendacoesGestante'
import { GestanteResumoCard } from '@/features/avaliacao/components/GestanteResumoCard'
import { ResultadoAvaliacao } from '@/features/avaliacao/components/ResultadoAvaliacao'
import { ResumoAplicacaoCard } from '@/features/avaliacao/components/ResumoAplicacaoCard'
import { useAssessment } from '@/features/avaliacao/composables/useAssessments'
import { formatarDataHoraBr } from '@/features/core/utils/date'
import { CATEGORIA_PROFISSIONAL_LABEL } from '@/features/usuarios/constants/categoriaProfissional'
import { ROLE_TO_CATEGORIA } from '@/features/usuarios/types/usuario'
import { useEffect } from 'react'

export function AvaliacaoImprimirVisaoGestantePage() {
	const { id } = useParams<{ id: string }>()
	const { data: avaliacao, isLoading, isError } = useAssessment(id)

	useEffect(() => {
		const timer = setTimeout(() => window.print(), 300)
		return () => clearTimeout(timer)
	}, [])

	if (isLoading) {
		return (
			<p className="p-10 text-sm text-n-600">Carregando avaliação...</p>
		)
	}

	if (isError || !avaliacao) {
		return (
			<p className="p-10 text-sm text-n-600">
				Não foi possível carregar esta avaliação.
			</p>
		)
	}

	return (
		<AvaliacaoImpressaoLayout
			avaliacaoId={avaliacao.id}
			emitidoEm={formatarDataHoraBr(new Date())}
			emissor={avaliacao.appliedByUser.name}
			ubs={avaliacao.healthUnit.name}
		>
			<div className="flex flex-col gap-3">
				<Divider text="Resumo da avaliação" />
				<ResumoAplicacaoCard
					appliedAt={avaliacao.appliedAt}
					ubs={avaliacao.healthUnit.name}
					aplicador={avaliacao.appliedByUser.name}
					categoriaProfissional={
						CATEGORIA_PROFISSIONAL_LABEL[
							ROLE_TO_CATEGORIA[avaliacao.appliedByUser.role]
						]
					}
					crmCoren={avaliacao.appliedByUser.professionalRegistration}
					email={avaliacao.appliedByUser.email}
				/>
			</div>

			<div className="flex flex-col gap-3">
				<Divider text="Dados da gestante" />
				<GestanteResumoCard gestante={avaliacao.patient} />
			</div>

			<div className="flex flex-col gap-3 break-inside-avoid">
				<Divider text="Resultado" />
				<div className="py-3">
					<ResultadoAvaliacao
						nomeGestante={avaliacao.patient.name}
						pontuacao={avaliacao.result.totalScore}
						vulnerabilityLevel={avaliacao.result.vulnerabilityLevel}
						vulnerabilityBandId={
							avaliacao.result.vulnerabilityBandId
						}
						bands={avaliacao.snapshot.props.vulnerabilityBands}
					/>
				</div>
			</div>

			<div className="flex flex-col gap-3 break-inside-avoid">
				<Divider text="Recomendações à gestante" />
				<AvaliacaoRecomendacoesGestante
					recomendacoes={avaliacao.recommendations}
				/>
			</div>
		</AvaliacaoImpressaoLayout>
	)
}
