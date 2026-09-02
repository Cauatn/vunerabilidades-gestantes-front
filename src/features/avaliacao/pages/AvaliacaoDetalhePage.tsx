import { useParams } from 'react-router-dom'

import { Divider } from '@/components/ui/divider'
import { Page } from '@/components/Layout/Page'
import { AvaliacaoExportarMenu } from '@/features/avaliacao/components/AvaliacaoExportarMenu'
import { AvaliacaoRecomendacoesGestante } from '@/features/avaliacao/components/AvaliacaoRecomendacoesGestante'
import { AvaliacaoRespostas } from '@/features/avaliacao/components/AvaliacaoRespostas'
import { DadosGestanteCard } from '@/features/avaliacao/components/DadosGestanteCard'
import { ResultadoAvaliacao } from '@/features/avaliacao/components/ResultadoAvaliacao'
import { ResumoAplicacaoCard } from '@/features/avaliacao/components/ResumoAplicacaoCard'
import { useGetAssessment } from '@/features/avaliacao/composables/useGetAssessment'
import { montarAvaliacaoDetalhe } from '@/features/avaliacao/utils/avaliacaoDetalhe'
import { useGetGestante } from '@/features/gestantes/composables/useGetGestante'
import { useGetHealthUnits } from '@/features/healthUnits/composables/useGetHealthUnits'
import { useGetUsuario } from '@/features/usuarios/composables/useGetUsuario'

export function AvaliacaoDetalhePage() {
	const { id = '' } = useParams<{ id: string }>()
	const { data: atendimento, isLoading, isError } = useGetAssessment(id)
	const { data: gestante } = useGetGestante(atendimento?.patientId)
	const { data: aplicador } = useGetUsuario(atendimento?.appliedByUserId)
	const { data: healthUnitsPage } = useGetHealthUnits()

	if (isLoading) {
		return <Page title="Avaliação" description="Carregando atendimento…" />
	}

	if (isError || !atendimento) {
		return <Page title="Avaliação" description="Atendimento não encontrado." />
	}

	const ubsNome = healthUnitsPage?.items.find((unit) => unit.id === atendimento.healthUnitId)?.name
	const avaliacao = montarAvaliacaoDetalhe(atendimento, { gestante, aplicador, ubsNome })

	return (
		<Page
			title={`Avaliação #${avaliacao.id}`}
			description="Verifique os dados de uma avaliação."
			headingSize="display"
			headerActions={<AvaliacaoExportarMenu avaliacaoId={avaliacao.id} />}
		>
			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-3">
					<Divider text="Resumo da avaliação" />
					<ResumoAplicacaoCard resumo={avaliacao.resumo} />
				</div>

				<div className="flex flex-col gap-3">
					<Divider text="Dados da gestante" />
					<DadosGestanteCard gestante={avaliacao.gestante} />
				</div>

				<div className="flex flex-col gap-3">
					<Divider text="Resultado" />
					<div className="flex flex-col gap-10 py-3">
						<ResultadoAvaliacao
							nomeGestante={avaliacao.gestante.nome}
							pontuacao={avaliacao.pontuacao}
							classificacao={avaliacao.classificacao}
						/>

						<div className="flex flex-col gap-3">
							<Divider text="Respostas" />
							<AvaliacaoRespostas categorias={avaliacao.categorias} />
						</div>

						<div className="flex flex-col gap-3">
							<Divider text="Recomendações à gestante" />
							<AvaliacaoRecomendacoesGestante recomendacoes={avaliacao.recomendacoesGestante} />
						</div>
					</div>
				</div>
			</div>
		</Page>
	)
}
