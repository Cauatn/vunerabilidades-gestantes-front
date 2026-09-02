import { isAxiosError } from 'axios'
import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import aplicacaoIllustration from '@/assets/illustrations/login-gestante.svg'
import { Page } from '@/components/Layout/Page'
import { Button } from '@/components/ui/button'
import { Divider } from '@/components/ui/divider'
import { AvaliacaoStepper } from '@/features/avaliacao/components/AvaliacaoStepper'
import { ConfirmarCalculoModal } from '@/features/avaliacao/components/ConfirmarCalculoModal'
import { ConfirmarFinalizacaoModal } from '@/features/avaliacao/components/ConfirmarFinalizacaoModal'
import { EtapaGestante } from '@/features/avaliacao/components/EtapaGestante'
import { GestanteResumoCard } from '@/features/avaliacao/components/GestanteResumoCard'
import { PerguntasEtapa } from '@/features/avaliacao/components/PerguntasEtapa'
import { RecomendacoesGestante } from '@/features/avaliacao/components/RecomendacoesGestante'
import { ResultadoAvaliacao } from '@/features/avaliacao/components/ResultadoAvaliacao'
import { useStartAssessment } from '@/features/avaliacao/composables/useStartAssessment'
import { useSubmitAssessment } from '@/features/avaliacao/composables/useSubmitAssessment'
import { useUpdateAssessmentRecommendations } from '@/features/avaliacao/composables/useUpdateAssessmentRecommendations'
import { classificarNivel } from '@/features/avaliacao/utils/vulnerabilidade'
import type { Assessment, StartAssessmentResponse } from '@/features/avaliacao/types/assessment'
import type { Question } from '@/features/instrumentos/types/questionnaire'
import type { RecomendacaoGestante } from '@/features/avaliacao/types/recomendacaoGestante'
import { useSession } from '@/features/auth/composables/useSession'
import { useGetGestantes } from '@/features/gestantes/composables/useGetGestantes'
import { useGetHealthUnits } from '@/features/healthUnits/composables/useGetHealthUnits'

const ETAPA_RESULTADO_LABEL = 'Resultado e recomendações'

function mensagemErro(erro: unknown, fallback: string): string {
	if (isAxiosError(erro)) {
		const corpo = erro.response?.data as { message?: string | string[] } | undefined
		const msg = Array.isArray(corpo?.message) ? corpo?.message.join(' ') : corpo?.message
		return msg || fallback
	}
	return fallback
}

function AvisoInicial({
	onIniciar,
	carregando,
	erro,
}: {
	onIniciar: () => void
	carregando: boolean
	erro: string | null
}) {
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

				{erro ? <p className="max-w-2xl text-sm text-r-600">{erro}</p> : null}

				<Button size="lg" onClick={onIniciar} disabled={carregando}>
					{carregando ? 'Carregando…' : 'Iniciar'}
				</Button>
			</div>
		</Page>
	)
}

export function FormularioPage() {
	const navigate = useNavigate()
	const { user } = useSession()
	const { data: gestantesPage } = useGetGestantes()
	const { data: healthUnitsPage } = useGetHealthUnits()
	const gestantes = gestantesPage?.items ?? []

	const start = useStartAssessment()
	const submit = useSubmitAssessment()

	const [atendimentoId, setAtendimentoId] = useState('')
	const atualizarRecomendacoes = useUpdateAssessmentRecommendations(atendimentoId)

	const [gestanteId, setGestanteId] = useState<string | null>(null)
	const [dadosInicio, setDadosInicio] = useState<StartAssessmentResponse | null>(null)
	const [respostas, setRespostas] = useState<Record<string, string>>({})
	const [etapa, setEtapa] = useState(0)
	const [confirmarCalculoAberto, setConfirmarCalculoAberto] = useState(false)
	const [confirmarFinalizarAberto, setConfirmarFinalizarAberto] = useState(false)
	const [atendimento, setAtendimento] = useState<Assessment | null>(null)
	const [recomendacoes, setRecomendacoes] = useState<RecomendacaoGestante[]>([])
	const [erroInicio, setErroInicio] = useState<string | null>(null)
	const [erroSubmit, setErroSubmit] = useState<string | null>(null)

	const healthUnitId = user?.currentHealthUnitId ?? null
	const ubsAtual = healthUnitsPage?.items.find((unit) => unit.id === healthUnitId)

	const perguntas = useMemo(
		() => [...(dadosInicio?.questionnaire.questions ?? [])].sort((a, b) => a.order - b.order),
		[dadosInicio],
	)

	const perguntaVisivel = useCallback(
		(pergunta: Question) =>
			!pergunta.visibleWhenQuestionId ||
			respostas[pergunta.visibleWhenQuestionId] === pergunta.visibleWhenOptionId,
		[respostas],
	)

	const secoes = useMemo(() => {
		const ordem: string[] = []
		for (const pergunta of perguntas) {
			if (!ordem.includes(pergunta.section)) ordem.push(pergunta.section)
		}
		return ordem
	}, [perguntas])

	const etapasStepper = useMemo(() => [...secoes, ETAPA_RESULTADO_LABEL], [secoes])
	const totalEtapasPerguntas = secoes.length
	const isEtapaResultado = etapa >= totalEtapasPerguntas
	const isUltimaEtapaPerguntas = etapa === totalEtapasPerguntas - 1

	const secaoAtual = secoes[etapa]
	const perguntasDaEtapa = useMemo(
		() => perguntas.filter((pergunta) => pergunta.section === secaoAtual && perguntaVisivel(pergunta)),
		[perguntas, secaoAtual, perguntaVisivel],
	)

	const todasRespondidasNaEtapa = perguntasDaEtapa.every(
		(pergunta) => !pergunta.required || !!respostas[pergunta.id],
	)
	const podeAvancar = todasRespondidasNaEtapa

	if (!dadosInicio) {
		return (
			<AvisoInicial
				carregando={start.isPending}
				erro={erroInicio}
				onIniciar={() => {
					setErroInicio(null)
					if (!gestanteId) {
						setErroInicio('Selecione a gestante antes de iniciar.')
						return
					}
					if (!healthUnitId) {
						setErroInicio('Defina a UBS de atendimento na barra lateral antes de iniciar.')
						return
					}
					start.mutate(
						{ patientId: gestanteId, healthUnitId },
						{
							onSuccess: ({ data }) => {
								setDadosInicio(data)
								setRespostas({})
								setEtapa(0)
							},
							onError: (erro) =>
								setErroInicio(
									mensagemErro(erro, 'Não foi possível abrir o atendimento.'),
								),
						},
					)
				}}
			/>
		)
	}

	function handleAnterior() {
		if (etapa === 0) {
			setDadosInicio(null)
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
		setConfirmarCalculoAberto(false)
		setErroSubmit(null)
		const visiveis = new Set(
			perguntas.filter((pergunta) => perguntaVisivel(pergunta)).map((pergunta) => pergunta.id),
		)
		const answers = Object.entries(respostas)
			.filter(([questionId]) => visiveis.has(questionId))
			.map(([questionId, optionId]) => ({ questionId, optionId }))

		submit.mutate(
			{ patientId: gestanteId as string, healthUnitId: healthUnitId as string, answers },
			{
				onSuccess: ({ data }) => {
					setAtendimento(data)
					setAtendimentoId(data.id)
					setRecomendacoes(
						data.recommendations.map((rec) => ({
							id: rec.id,
							titulo: rec.text,
							observacoes: '',
						})),
					)
					setEtapa(totalEtapasPerguntas)
				},
				onError: (erro) =>
					setErroSubmit(mensagemErro(erro, 'Não foi possível calcular o resultado.')),
			},
		)
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

	const classificacao = atendimento
		? classificarNivel(
				atendimento.result.vulnerabilityLevel,
				atendimento.snapshot.vulnerabilityBands,
				atendimento.result.vulnerabilityBandId,
			)
		: 'BAIXA'

	return (
		<Page
			title="Avaliação da Escala Brasileira de Vulnerabilidade Social no Pré-Natal"
			description="Aplique o formulário da Escala Brasileira de Vulnerabilidade Social no Pré-Natal em sua consulta."
			className="flex-1"
		>
			<div className="flex flex-1 flex-col gap-4 overflow-hidden">
				<AvaliacaoStepper steps={etapasStepper} activeIndex={etapa} />

				<div className="flex-1 space-y-10 overflow-y-auto py-3">
					{isEtapaResultado && atendimento ? (
						<>
							<div className="flex flex-col gap-3">
								<Divider text="Dados da gestante" />
								<GestanteResumoCard gestante={dadosInicio.patient} />
							</div>

							<div className="flex flex-col gap-3">
								<Divider text="Resultado" />
								<ResultadoAvaliacao
									nomeGestante={dadosInicio.patient.name}
									pontuacao={atendimento.result.totalScore}
									classificacao={classificacao}
								/>
							</div>

							<RecomendacoesGestante
								classificacao={classificacao}
								recomendacoes={recomendacoes}
								onAdd={handleAddRecomendacao}
								onUpdate={handleUpdateRecomendacao}
								onRemove={handleRemoveRecomendacao}
							/>
						</>
					) : (
						<>
							{etapa === 0 && (
								<>
									<EtapaGestante
										gestantes={gestantes}
										gestanteId={gestanteId}
										onGestanteChange={setGestanteId}
									/>
									<p className="text-sm text-n-600">
										<span className="font-semibold">UBS de atendimento: </span>
										{ubsAtual?.name ?? '—'}
									</p>
								</>
							)}
							<PerguntasEtapa
								perguntas={perguntasDaEtapa}
								respostas={respostas}
								onResponder={(questionId, optionId) =>
									setRespostas((atual) => ({ ...atual, [questionId]: optionId }))
								}
							/>
						</>
					)}

					{erroSubmit ? <p className="text-sm text-r-600">{erroSubmit}</p> : null}
				</div>

				<div className="mt-auto flex items-center justify-end gap-3 border-t border-n-30 pt-6">
					{!isEtapaResultado && (
						<>
							<Button variant="outline" onClick={handleAnterior}>
								Anterior
							</Button>
							<Button disabled={!podeAvancar || submit.isPending} onClick={handleProxima}>
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
				onConfirmar={() => {
					if (!atendimento) {
						setConfirmarFinalizarAberto(false)
						navigate('/historico')
						return
					}
					const payload = {
						recommendations: recomendacoes
							.map((rec, index) => ({
								id: /^[0-9a-f]{24}$/i.test(rec.id) ? rec.id : undefined,
								text: rec.titulo.trim(),
								order: index,
							}))
							.filter((rec) => rec.text),
					}
					atualizarRecomendacoes.mutate(payload, {
						onSuccess: () => {
							setConfirmarFinalizarAberto(false)
							navigate(`/historico/${atendimento.id}`)
						},
						onError: (erro) => {
							setConfirmarFinalizarAberto(false)
							setErroSubmit(
								mensagemErro(erro, 'Não foi possível salvar as recomendações.'),
							)
						},
					})
				}}
			/>
		</Page>
	)
}
