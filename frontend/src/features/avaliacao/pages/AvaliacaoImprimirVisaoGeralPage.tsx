import { useParams } from 'react-router-dom'

import { Divider } from '@/components/ui/divider'
import { AvaliacaoImpressaoLayout } from '@/features/avaliacao/components/AvaliacaoImpressaoLayout'
import { AvaliacaoRecomendacoesGestante } from '@/features/avaliacao/components/AvaliacaoRecomendacoesGestante'
import { AvaliacaoRespostas } from '@/features/avaliacao/components/AvaliacaoRespostas'
import { DadosGestanteCard } from '@/features/avaliacao/components/DadosGestanteCard'
import { ResultadoAvaliacao } from '@/features/avaliacao/components/ResultadoAvaliacao'
import { ResumoAplicacaoCard } from '@/features/avaliacao/components/ResumoAplicacaoCard'
import { criarAvaliacaoDetalheMock, formatarEmitidoEm } from '@/features/avaliacao/utils/avaliacaoMock'

export function AvaliacaoImprimirVisaoGeralPage() {
	const { id = '' } = useParams<{ id: string }>()
	const avaliacao = criarAvaliacaoDetalheMock(id)

	return (
		<AvaliacaoImpressaoLayout
			avaliacaoId={avaliacao.id}
			emitidoEm={formatarEmitidoEm(new Date())}
			emissor={avaliacao.resumo.aplicador}
			ubs={avaliacao.resumo.ubs}
		>
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
		</AvaliacaoImpressaoLayout>
	)
}
