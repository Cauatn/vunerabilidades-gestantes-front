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
import { useStartAssessment, useSubmitAssessment, useUpdateAssessmentRecommendations } from '@/features/avaliacao/composables/useAssessments'
import type { Classificacao } from '@/features/avaliacao/constants'
import type { Pergunta } from '@/features/avaliacao/types/pergunta'
import type { RecomendacaoGestante } from '@/features/avaliacao/types/recomendacaoGestante'
import { useGetGestantes } from '@/features/gestantes/composables/useGetGestantes'
import { useSession } from '@/features/auth/composables/useSession'

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

//TODO: formulário criado no backend só é mostrado quando seleciona uma gestante (antes de selecionar fica mostrando o mock)
export function FormularioPage() {
	const navigate = useNavigate()
	const { perguntas: perguntasConfiguradas } = usePerguntas()
	const { user } = useSession()
	const iniciarAvaliacao = useStartAssessment()
	const enviarAvaliacao = useSubmitAssessment()
	const atualizarRecomendacoes = useUpdateAssessmentRecommendations()
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
	const [assessmentId, setAssessmentId] = useState<string | null>(null)
	const [perguntasAplicacao, setPerguntasAplicacao] = useState<Pergunta[] | null>(null)
	const [erro, setErro] = useState<string | null>(null)
	const perguntas = perguntasAplicacao ?? perguntasConfiguradas
	const perguntasVisiveis = useMemo(
		() => perguntas.filter((pergunta) => !pergunta.visibleWhenQuestionId || respostas[pergunta.visibleWhenQuestionId] === pergunta.visibleWhenOptionId),
		[perguntas, respostas],
	)

	const categorias = useMemo(() => {
		const vistas = new Set<string>()
		const ordem: string[] = []
		for (const pergunta of perguntasVisiveis) {
			if (!vistas.has(pergunta.categoria)) {
				vistas.add(pergunta.categoria)
				ordem.push(pergunta.categoria)
			}
		}
		return ordem
	}, [perguntasVisiveis])

	const etapasStepper = useMemo(() => [...categorias, ETAPA_RESULTADO_LABEL], [categorias])
	const totalEtapasPerguntas = categorias.length
	const isEtapaResultado = etapa >= totalEtapasPerguntas
	const isPrimeiraEtapa = etapa === 0
	const isUltimaEtapaPerguntas = etapa === totalEtapasPerguntas - 1

	const categoriaAtual = categorias[etapa]
	const perguntasDaEtapa = useMemo(
		() => perguntasVisiveis.filter((pergunta) => pergunta.categoria === categoriaAtual),
		[perguntasVisiveis, categoriaAtual],
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
			if (!user?.currentHealthUnitId) {
				setErro('Selecione uma UBS atual no seu perfil antes de calcular o resultado.')
				return
			}
			setConfirmarCalculoAberto(true)
			return
		}
		setEtapa((atual) => atual + 1)
	}

	async function handleConfirmarCalculo() {
		if (!gestanteId || !user?.currentHealthUnitId) {
			setConfirmarCalculoAberto(false)
			setErro('Selecione uma UBS atual no seu perfil antes de calcular o resultado.')
			return
		}
		try {
			const { data } = await enviarAvaliacao.mutateAsync({
				patientId: gestanteId,
				healthUnitId: user.currentHealthUnitId,
				answers: Object.entries(respostas)
					.filter(([questionId]) => perguntasVisiveis.some((pergunta) => pergunta.id === questionId))
					.map(([questionId, optionId]) => ({ questionId, optionId })),
			})
			const result = data.result
			setResultado({
				pontuacao: result.totalScore ?? 0,
				classificacao: toClassificacao(result.vulnerabilityLevel ?? 'BAIXA'),
			})
			setRecomendacoes(data.recommendations.map((item) => ({ id: item.id, titulo: item.text, observacoes: '' })))
			setAssessmentId(data.id)
			setConfirmarCalculoAberto(false)
			setEtapa(totalEtapasPerguntas)
		} catch {
			setErro('Não foi possível salvar a avaliação. Confira a UBS selecionada e tente novamente.')
		}
	}

	function handleConfirmarFinalizacao() {
		setConfirmarFinalizarAberto(false)
		navigate('/historico')
	}

	function persistRecomendacoes(next: RecomendacaoGestante[]) {
		if (!assessmentId) return
		void atualizarRecomendacoes.mutateAsync({
			id: assessmentId,
			recommendations: next.map((item, order) => ({ id: /^[a-f\d]{24}$/i.test(item.id) ? item.id : undefined, text: [item.titulo, item.observacoes].filter(Boolean).join('\n'), order })),
		})
	}

	function handleAddRecomendacao(dados: { titulo: string; observacoes: string }) {
		setRecomendacoes((atual) => {
			const next = [...atual, { id: crypto.randomUUID(), ...dados }]
			persistRecomendacoes(next)
			return next
		})
	}

	function handleUpdateRecomendacao(id: string, dados: { titulo: string; observacoes: string }) {
		setRecomendacoes((atual) => {
			const next = atual.map((item) => (item.id === id ? { ...item, ...dados } : item))
			persistRecomendacoes(next)
			return next
		})
	}

	function handleRemoveRecomendacao(id: string) {
		setRecomendacoes((atual) => {
			const next = atual.filter((item) => item.id !== id)
			persistRecomendacoes(next)
			return next
		})
	}

	async function handleGestanteChange(id: string) {
		setGestanteId(id)
		setErro(null)
		if (!user?.currentHealthUnitId) {
			setErro('Selecione uma UBS atual no seu perfil antes de aplicar o formulário.')
			return
		}
		try {
			const { data } = await iniciarAvaliacao.mutateAsync({ patientId: id, healthUnitId: user.currentHealthUnitId })
			setPerguntasAplicacao(
				data.questionnaire.questions.map((question) => ({
					id: question.id,
					categoria: question.section,
					texto: question.statement,
					opcoes: question.options.map((option) => ({ id: option.id, texto: option.label, pontuacao: option.score })),
					visibleWhenQuestionId: question.visibleWhenQuestionId,
					visibleWhenOptionId: question.visibleWhenOptionId,
				})),
			)
			setRespostas({})
			setEtapa(0)
		} catch {
			setErro('Não foi possível carregar o formulário publicado para esta aplicação.')
		}
	}

	return (
		<Page
			title="Avaliação da Escala Brasileira de Vulnerabilidade Social no Pré-Natal"
			description="Aplique o formulário da Escala Brasileira de Vulnerabilidade Social no Pré-Natal em sua consulta."
			className="flex-1"
		>
			<div className="flex flex-1 flex-col gap-4 overflow-hidden">
				{erro ? <p className="rounded-md bg-r-100 px-4 py-3 text-sm text-r-500">{erro}</p> : null}
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
								<EtapaGestante gestantes={gestantes} gestanteId={gestanteId} onGestanteChange={handleGestanteChange} />
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
							<Button disabled={!podeAvancar || iniciarAvaliacao.isPending || enviarAvaliacao.isPending} onClick={handleProxima}>
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

function toClassificacao(level: string): Classificacao {
	const normalized = level.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase()
	if (normalized.includes('ALTA')) return 'ALTA'
	if (normalized.includes('MODERADA') || normalized.includes('MEDIA')) return 'MODERADA'
	return 'BAIXA'
}
