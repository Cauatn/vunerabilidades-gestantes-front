import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import aplicacaoIllustration from '@/assets/illustrations/login-gestante.svg'
import { Page } from '@/components/Layout/Page'
import { Button } from '@/components/ui/button'
import { Divider } from '@/components/ui/divider'
import { AvaliacaoStepper } from '@/features/avaliacao/components/AvaliacaoStepper'
import { ConfirmarCalculoModal } from '@/features/avaliacao/components/ConfirmarCalculoModal'
import { ConfirmarFinalizacaoModal } from '@/features/avaliacao/components/ConfirmarFinalizacaoModal'
import { EtapaGestante } from '@/features/avaliacao/components/EtapaGestante'
import { EtapaPerguntas } from '@/features/avaliacao/components/EtapaPerguntas'
import { GestanteResumoCard } from '@/features/avaliacao/components/GestanteResumoCard'
import { RecomendacoesGestante } from '@/features/avaliacao/components/RecomendacoesGestante'
import { ResultadoAvaliacao } from '@/features/avaliacao/components/ResultadoAvaliacao'
import { usePerguntas } from '@/features/avaliacao/composables/usePerguntasStore'
import type { Classificacao } from '@/features/avaliacao/constants'
import type { RecomendacaoGestante } from '@/features/avaliacao/types/recomendacaoGestante'
import { calcularPontuacao, classificar } from '@/features/avaliacao/utils/calcularPontuacao'
import { useGetGestantes } from '@/features/gestantes/composables/useGetGestantes'

const ETAPA_RESULTADO_LABEL = 'Resultado e recomendações'

function AvisoInicial({ onIniciar }: { onIniciar: () => void }) {
	return (
		<Page
			title="Avaliação da Escala Brasileira de Vulnerabilidade Social no Pré-Natal"
			description="Aplique o formulário da Escala Brasileira de Vulnerabilidade Social no Pré-Natal em sua consulta."
		>
			<div className="flex flex-1 flex-col items-center justify-center gap-10 text-center">
				<img src={aplicacaoIllustration} alt="" className="h-auto w-full max-w-md" />

				<div className="flex max-w-2xl flex-col gap-3">
					<p className="text-xl font-semibold text-n-900">
						Leia cada pergunta juntamente com a gestante e selecione a alternativa que melhor
						representa sua situação atual.
					</p>
					<p className="text-sm text-n-600">
						O formulário aceita somente uma resposta por pergunta. O resultado auxilia na tomada
						de decisão clínica e não substitui o julgamento profissional.
					</p>
				</div>

				<Button size="lg" onClick={onIniciar}>
					Iniciar
				</Button>
			</div>
		</Page>
	)
}

export function FormularioPage() {
	const navigate = useNavigate()
	const { perguntas } = usePerguntas()
	const { data: gestantesPage } = useGetGestantes()
	const gestantes = gestantesPage?.items ?? []

	const [iniciado, setIniciado] = useState(false)
	const [gestanteId, setGestanteId] = useState<string | null>(null)
	const [respostas, setRespostas] = useState<Record<string, string>>({})
	const [etapa, setEtapa] = useState(0)
	const [confirmarCalculoAberto, setConfirmarCalculoAberto] = useState(false)
	const [confirmarFinalizarAberto, setConfirmarFinalizarAberto] = useState(false)
	const [resultado, setResultado] = useState<{ pontuacao: number; classificacao: Classificacao } | null>(null)
	const [recomendacoes, setRecomendacoes] = useState<RecomendacaoGestante[]>([])

	const categorias = useMemo(() => {
		const vistas = new Set<string>()
		const ordem: string[] = []
		for (const pergunta of perguntas) {
			if (!vistas.has(pergunta.categoria)) {
				vistas.add(pergunta.categoria)
				ordem.push(pergunta.categoria)
			}
		}
		return ordem
	}, [perguntas])

	const etapasStepper = useMemo(() => [...categorias, ETAPA_RESULTADO_LABEL], [categorias])
	const totalEtapasPerguntas = categorias.length
	const isEtapaResultado = etapa >= totalEtapasPerguntas
	const isPrimeiraEtapa = etapa === 0
	const isUltimaEtapaPerguntas = etapa === totalEtapasPerguntas - 1

	const categoriaAtual = categorias[etapa]
	const perguntasDaEtapa = useMemo(
		() => perguntas.filter((pergunta) => pergunta.categoria === categoriaAtual),
		[perguntas, categoriaAtual],
	)
	const gestanteSelecionada = gestantes.find((gestante) => gestante.id === gestanteId)

	const todasRespondidasNaEtapa = perguntasDaEtapa.every((pergunta) => !!respostas[pergunta.id])
	const podeAvancar = (!isPrimeiraEtapa || !!gestanteId) && todasRespondidasNaEtapa

	if (!iniciado) {
		return <AvisoInicial onIniciar={() => setIniciado(true)} />
	}

	function handleAnterior() {
		if (etapa === 0) {
			setIniciado(false)
			return
		}
		setEtapa((atual) => atual - 1)
	}

	function handleProxima() {
		if (isUltimaEtapaPerguntas) {
			setConfirmarCalculoAberto(true)
			return
		}
		setEtapa((atual) => atual + 1)
	}

	function handleConfirmarCalculo() {
		const pontuacao = calcularPontuacao(respostas, perguntas)
		setResultado({ pontuacao, classificacao: classificar(pontuacao) })
		setConfirmarCalculoAberto(false)
		setEtapa(totalEtapasPerguntas)
	}

	function handleConfirmarFinalizacao() {
		setConfirmarFinalizarAberto(false)
		navigate('/historico')
	}

	function handleAddRecomendacao(dados: { titulo: string; observacoes: string }) {
		setRecomendacoes((atual) => [...atual, { id: crypto.randomUUID(), ...dados }])
	}

	function handleUpdateRecomendacao(id: string, dados: { titulo: string; observacoes: string }) {
		setRecomendacoes((atual) => atual.map((item) => (item.id === id ? { ...item, ...dados } : item)))
	}

	function handleRemoveRecomendacao(id: string) {
		setRecomendacoes((atual) => atual.filter((item) => item.id !== id))
	}

	return (
		<Page
			title="Avaliação da Escala Brasileira de Vulnerabilidade Social no Pré-Natal"
			description="Aplique o formulário da Escala Brasileira de Vulnerabilidade Social no Pré-Natal em sua consulta."
			className="flex-1"
		>
			<div className="flex flex-1 flex-col gap-4 overflow-hidden">
				<AvaliacaoStepper steps={etapasStepper} activeIndex={etapa} />

				<div className="flex-1 space-y-10 overflow-y-auto py-3">
					{isEtapaResultado ? (
						<>
							<div className="flex flex-col gap-3">
								<Divider text="Dados da gestante" />
								{gestanteSelecionada && <GestanteResumoCard gestante={gestanteSelecionada} />}
							</div>

							<div className="flex flex-col gap-3">
								<Divider text="Resultado" />
								{resultado && (
									<ResultadoAvaliacao
										nomeGestante={gestanteSelecionada?.name ?? ''}
										pontuacao={resultado.pontuacao}
										classificacao={resultado.classificacao}
									/>
								)}
							</div>

							<RecomendacoesGestante
								classificacao={resultado?.classificacao ?? 'BAIXA'}
								recomendacoes={recomendacoes}
								onAdd={handleAddRecomendacao}
								onUpdate={handleUpdateRecomendacao}
								onRemove={handleRemoveRecomendacao}
							/>
						</>
					) : (
						<>
							{isPrimeiraEtapa && (
								<EtapaGestante gestantes={gestantes} gestanteId={gestanteId} onGestanteChange={setGestanteId} />
							)}
							<EtapaPerguntas
								perguntas={perguntasDaEtapa}
								respostas={respostas}
								onResponder={(perguntaId, opcaoId) =>
									setRespostas((atual) => ({ ...atual, [perguntaId]: opcaoId }))
								}
							/>
						</>
					)}
				</div>

				<div className="mt-auto flex items-center justify-end gap-3 border-t border-n-30 pt-6">
					{!isEtapaResultado && (
						<>
							<Button variant="outline" onClick={handleAnterior}>
								Anterior
							</Button>
							<Button disabled={!podeAvancar} onClick={handleProxima}>
								{isUltimaEtapaPerguntas ? 'Calcular' : 'Próxima'}
							</Button>
						</>
					)}
					{isEtapaResultado && (
						<Button variant="warning" onClick={() => setConfirmarFinalizarAberto(true)}>
							Finalizar
						</Button>
					)}
				</div>
			</div>

			<ConfirmarCalculoModal
				open={confirmarCalculoAberto}
				onOpenChange={setConfirmarCalculoAberto}
				onConfirmar={handleConfirmarCalculo}
			/>
			<ConfirmarFinalizacaoModal
				open={confirmarFinalizarAberto}
				onOpenChange={setConfirmarFinalizarAberto}
				onConfirmar={handleConfirmarFinalizacao}
			/>
		</Page>
	)
}
