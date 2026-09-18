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

export function AvaliacaoImprimirVisaoGeralPage() {
	const { id } = useParams<{ id: string }>()
	const { data: avaliacao, isLoading, isError } = useAssessment(id)

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

			<div className="flex flex-col gap-3">
				<Divider text="Resultado" />
				<div className="flex flex-col gap-10 py-3">
					<ResultadoAvaliacao
						nomeGestante={avaliacao.patient.name}
						pontuacao={avaliacao.result.totalScore}
						vulnerabilityLevel={avaliacao.result.vulnerabilityLevel}
						vulnerabilityBandId={avaliacao.result.vulnerabilityBandId}
						bands={avaliacao.snapshot.props.vulnerabilityBands}
					/>

					<div className="flex flex-col gap-3">
						<Divider text="Respostas" />
						{/*
							Cada resposta do back não referência a categoria que a
							pergunta se encontra. Com isso, não dá pra organizar as
							perguntas por categoria, como no Figma.
						*/}
						<div className="flex w-full max-w-[900px] flex-col gap-4">
							{avaliacao.answers.map((resposta, index) => (
								<div
									key={resposta.id}
									className="flex w-full flex-col"
								>
									<p className="pb-2 text-sm font-semibold text-n-700">
										{index + 1}. {resposta.questionStatement}
									</p>
									<p className="text-sm text-n-600">
										<span className="font-semibold">
											Resposta:{' '}
										</span>
										{resposta.optionLabel}
									</p>
								</div>
							))}
						</div>
					</div>

					<div className="flex flex-col gap-3">
						<Divider text="Recomendações à gestante" />
						<AvaliacaoRecomendacoesGestante
							recomendacoes={avaliacao.recommendations}
						/>
					</div>
				</div>
			</div>
		</AvaliacaoImpressaoLayout>
	)
}
