import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";

import aplicacaoIllustration from "@/assets/illustrations/login-gestante.svg";
import { Page } from "@/components/Layout/Page";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { useSession } from "@/features/auth/composables/useSession";
import { AvaliacaoStepper } from "@/features/avaliacao/components/AvaliacaoStepper";
import { ConfirmarCalculoModal } from "@/features/avaliacao/components/ConfirmarCalculoModal";
import { ConfirmarFinalizacaoModal } from "@/features/avaliacao/components/ConfirmarFinalizacaoModal";
import { EtapaGestante } from "@/features/avaliacao/components/EtapaGestante";
import { EtapaPerguntas } from "@/features/avaliacao/components/EtapaPerguntas";
import { GestanteResumoCard } from "@/features/avaliacao/components/GestanteResumoCard";
import { RecomendacoesGestante } from "@/features/avaliacao/components/RecomendacoesGestante";
import { ResultadoAvaliacao } from "@/features/avaliacao/components/ResultadoAvaliacao";
import {
	useSubmitAssessment,
	useUpdateAssessmentRecommendations,
} from "@/features/avaliacao/composables/useAssessments";
import type { SavedAssessment } from "@/features/avaliacao/types/assessment";
import type { Pergunta } from "@/features/avaliacao/types/pergunta";
import type { RecomendacaoGestante } from "@/features/avaliacao/types/recomendacaoGestante";
import { toClassificacao } from "@/features/avaliacao/utils/classificacao";
import { apiErrorMessage } from "@/features/core/utils/apiError";
import { useGetGestantes } from "@/features/gestantes/composables/useGetGestantes";
import { useGetQuestionarioAtivo } from "@/features/instrumentos/composables/useGetQuestionarioAtivo";
import { toast } from "sonner";

const ETAPA_RESULTADO_LABEL = "Resultado e recomendações";
const PERGUNTAS_VAZIAS: Pergunta[] = [];

function AvisoInicial({
	onInit,
	carregando,
}: {
	onInit: () => void;
	carregando: boolean;
}) {
	return (
		<Page
			title="Avaliação da Escala Brasileira de Vulnerabilidade Social no Pré-Natal"
			description="Aplique o formulário da Escala Brasileira de Vulnerabilidade Social no Pré-Natal em sua consulta."
		>
			<div className="flex flex-1 flex-col items-center gap-10 py-10 text-center">
				<img
					src={aplicacaoIllustration}
					alt=""
					className="h-auto w-full max-w-sm"
				/>

				<div className="flex max-w-2xl flex-col gap-3">
					<p className="text-xl font-semibold text-n-900">
						Leia cada pergunta juntamente com a gestante e selecione a
						alternativa que melhor representa sua situação atual.
					</p>
					<p className="text-sm text-n-600">
						O formulário aceita somente uma resposta por pergunta. O resultado
						auxilia na tomada de decisão clínica e não substitui o julgamento
						profissional.
					</p>
				</div>

				<Button size="lg" onClick={onInit} isLoading={carregando}>
					Iniciar
				</Button>
			</div>
		</Page>
	);
}

export function FormularioPage() {
	const navigate = useNavigate();
	const { user } = useSession();
	const enviarAvaliacao = useSubmitAssessment();
	const atualizarRecomendacoes = useUpdateAssessmentRecommendations();
	const { data: gestantesPage } = useGetGestantes();
	const gestantes = gestantesPage?.items ?? [];

	const {
		data: activeQuestionnaire,
		isFetching: carregandoQuestionario,
		refetch: refetchActiveQuestionnaire,
	} = useGetQuestionarioAtivo({ enabled: false });

	const [iniciado, setIniciado] = useState(false);
	const [gestanteId, setGestanteId] = useState<string | null>(null);
	const [respostas, setRespostas] = useState<Record<string, string>>({});
	const [etapa, setEtapa] = useState(0);
	const [confirmarCalculoAberto, setConfirmarCalculoAberto] = useState(false);
	const [confirmarFinalizarAberto, setConfirmarFinalizarAberto] =
		useState(false);
	const [assessment, setAssessment] = useState<SavedAssessment | null>(null);
	const [recomendacoes, setRecomendacoes] = useState<RecomendacaoGestante[]>(
		[],
	);

	const containerRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);

	const perguntasAplicacao = useMemo<Pergunta[] | null>(() => {
		if (!activeQuestionnaire) return null;
		return activeQuestionnaire.questions.map((question) => ({
			id: question.id,
			categoria: question.section,
			texto: question.statement,
			opcoes: question.options.map((option) => ({
				id: option.id,
				texto: option.label,
				pontuacao: option.score,
			})),
			visibleWhenQuestionId: question.visibleWhenQuestionId,
			visibleWhenOptionId: question.visibleWhenOptionId,
		}));
	}, [activeQuestionnaire]);
	const perguntas = perguntasAplicacao ?? PERGUNTAS_VAZIAS;
	const perguntasVisiveis = useMemo(
		() =>
			perguntas.filter(
				(pergunta) =>
					!pergunta.visibleWhenQuestionId ||
					respostas[pergunta.visibleWhenQuestionId] ===
						pergunta.visibleWhenOptionId,
			),
		[perguntas, respostas],
	);

	const categorias = useMemo(() => {
		const vistas = new Set<string>();
		const ordem: string[] = [];
		for (const pergunta of perguntasVisiveis) {
			if (!vistas.has(pergunta.categoria)) {
				vistas.add(pergunta.categoria);
				ordem.push(pergunta.categoria);
			}
		}
		return ordem;
	}, [perguntasVisiveis]);

	const etapasStepper = useMemo(
		() => [...categorias, ETAPA_RESULTADO_LABEL],
		[categorias],
	);
	const totalEtapasPerguntas = categorias.length;
	const isEtapaResultado =
		perguntasAplicacao !== null && etapa >= totalEtapasPerguntas;
	const isPrimeiraEtapa = etapa === 0;
	const isUltimaEtapaPerguntas = etapa === totalEtapasPerguntas - 1;

	const categoriaAtual = categorias[etapa];
	const perguntasDaEtapa = useMemo(
		() =>
			perguntasVisiveis.filter(
				(pergunta) => pergunta.categoria === categoriaAtual,
			),
		[perguntasVisiveis, categoriaAtual],
	);
	const gestanteSelecionada = gestantes.find(
		(gestante) => gestante.id === gestanteId,
	);

	const todasRespondidasNaEtapa = perguntasDaEtapa.every(
		(pergunta) => !!respostas[pergunta.id],
	);
	const podeAvancar =
		perguntasDaEtapa.length > 0 &&
		(!isPrimeiraEtapa || !!gestanteId) &&
		todasRespondidasNaEtapa;

	function scrollToTop(behavior: ScrollBehavior = 'smooth') {
		const mainElement =
			containerRef.current?.closest('main') ?? document.querySelector('main');
		if (mainElement) {
			mainElement.scrollTo({
				top: 0,
				behavior,
			});
		}
		if (contentRef.current) {
			contentRef.current.scrollTo({
				top: 0,
				behavior,
			});
		}
		window.scrollTo({
			top: 0,
			behavior,
		});
	}

	useEffect(() => {
		scrollToTop();
	}, [etapa, iniciado]);

	async function handleInit() {
		if (carregandoQuestionario) return;
		if (perguntasAplicacao) {
			setIniciado(true);
			return;
		}
		const { data, error } = await refetchActiveQuestionnaire();
		const title = 'Houve um erro ao carregar o questionário';
		let description;
		if (error) {
			description =
				'Não foi possível carregar o questionário publicado. Tente iniciar novamente.';
			toast.error(title, { description });
			return;
		}
		if (!data?.questions.length) {
			description =
				'O questionário publicado não possui perguntas disponíveis.';
			toast.error(title, { description });
			return;
		}
		setIniciado(true);
	}

	if (!iniciado) {
		return (
			<AvisoInicial onInit={handleInit} carregando={carregandoQuestionario} />
		);
	}

	function handleAnterior() {
		if (etapa === 0) {
			setIniciado(false);
			scrollToTop();
			return;
		}
		setEtapa((atual) => atual - 1);
	}

	function handleProxima() {
		if (isUltimaEtapaPerguntas) {
			if (!user?.currentHealthUnitId) {
				toast.error(
					'Selecione uma UBS atual no seu perfil antes de calcular o resultado.',
				);
				return;
			}
			setConfirmarCalculoAberto(true);
			return;
		}
		setEtapa((atual) => atual + 1);
	}

	async function handleConfirmarCalculo() {
		if (enviarAvaliacao.isPending || assessment) return;
		if (!gestanteId || !user?.currentHealthUnitId) {
			setConfirmarCalculoAberto(false);
			const msg =
				"Selecione uma UBS atual no seu perfil antes de calcular o resultado.";
			toast.error(msg);
			return;
		}
		try {
			const { data } = await enviarAvaliacao.mutateAsync({
				patientId: gestanteId,
				healthUnitId: user.currentHealthUnitId,
				answers: Object.entries(respostas)
					.filter(([questionId]) =>
						perguntasVisiveis.some((pergunta) => pergunta.id === questionId),
					)
					.map(([questionId, optionId]) => ({ questionId, optionId })),
			});
			setAssessment(data);
			setRecomendacoes(
				data.recommendations.map((item) => ({
					id: item.id,
					titulo: item.text,
					observacoes: "",
				})),
			);
			setConfirmarCalculoAberto(false);
			setEtapa(totalEtapasPerguntas);
			toast.success("Formulário aplicado com sucesso.");
		} catch (error) {
			const fallbackMsg =
				"Não foi possível salvar a avaliação. Confira a UBS selecionada e tente novamente.";
			toast.error("Houve um erro ao calcular a avaliação", {
				description: apiErrorMessage(error, fallbackMsg),
			});
		}
	}

	function handleConfirmarFinalizacao() {
		setConfirmarFinalizarAberto(false);
		toast.success("Avaliação finalizada com sucesso.");
		navigate("/historico");
	}

	function syncRecomendacoes(
		next: RecomendacaoGestante[],
		serverRecs?: Array<{ id: string; order: number }>,
	): RecomendacaoGestante[] {
		if (!serverRecs || serverRecs.length !== next.length) {
			return next;
		}
		return next.map((item, idx) => {
			const serverItem =
				serverRecs.find((r) => r.order === idx) ?? serverRecs[idx];
			return serverItem ? { ...item, id: serverItem.id } : item;
		});
	}

	async function persistRecomendacoes(next: RecomendacaoGestante[]) {
		if (!assessment) return;
		return await atualizarRecomendacoes.mutateAsync({
			id: assessment.id,
			recommendations: next.map((item, order) => ({
				id: /^[a-f\d]{24}$/i.test(item.id) ? item.id : undefined,
				text: [item.titulo, item.observacoes].filter(Boolean).join("\n"),
				order,
			})),
		});
	}

	async function handleAddRecomendacao(dados: {
		titulo: string;
		observacoes: string;
	}) {
		const novaRecomendacao: RecomendacaoGestante = {
			id: crypto.randomUUID(),
			...dados,
		};
		const next = [...recomendacoes, novaRecomendacao];
		try {
			const response = await persistRecomendacoes(next);
			setRecomendacoes(
				syncRecomendacoes(next, response?.data?.recommendations),
			);
			toast.success("Recomendação adicionada com sucesso.");
		} catch (error) {
			toast.error("Houve um erro ao adicionar a recomendação", {
				description: apiErrorMessage(
					error,
					"Por favor tente novamente. Se o erro persistir, entre em contato com o suporte.",
				),
			});
			throw error;
		}
	}

	async function handleUpdateRecomendacao(
		id: string,
		dados: { titulo: string; observacoes: string },
	) {
		const next = recomendacoes.map((item) =>
			item.id === id ? { ...item, ...dados } : item,
		);
		try {
			const response = await persistRecomendacoes(next);
			setRecomendacoes(
				syncRecomendacoes(next, response?.data?.recommendations),
			);
			toast.success("Recomendação atualizada com sucesso.");
		} catch (error) {
			toast.error("Houve um erro ao atualizar a recomendação", {
				description: apiErrorMessage(
					error,
					"Por favor tente novamente. Se o erro persistir, entre em contato com o suporte.",
				),
			});
			throw error;
		}
	}

	async function handleRemoveRecomendacao(id: string) {
		const next = recomendacoes.filter((item) => item.id !== id);
		try {
			const response = await persistRecomendacoes(next);
			setRecomendacoes(
				syncRecomendacoes(next, response?.data?.recommendations),
			);
			toast.success("Recomendação removida com sucesso.");
		} catch (error) {
			toast.error("Houve um erro ao remover a recomendação", {
				description: apiErrorMessage(
					error,
					"Por favor tente novamente. Se o erro persistir, entre em contato com o suporte.",
				),
			});
		}
	}

	function handleGestanteChange(id: string) {
		if (id === gestanteId) return;
		setGestanteId(id);
		setRespostas({});
		setEtapa(0);
	}

	return (
		<div ref={containerRef}>
			<Page
				title="Avaliação da Escala Brasileira de Vulnerabilidade Social no Pré-Natal"
				description="Aplique o formulário da Escala Brasileira de Vulnerabilidade Social no Pré-Natal em sua consulta."
				className="flex-1 pt-10 px-10"
			>
				<div className="flex flex-1 flex-col gap-4 overflow-hidden">
					<AvaliacaoStepper steps={etapasStepper} activeIndex={etapa} />

					<div
						ref={contentRef}
						className="flex-1 space-y-10 overflow-y-auto py-3"
					>
						{isEtapaResultado ? (
							<>
								<div className="flex flex-col gap-3">
									<Divider text="Dados da gestante" />
									{gestanteSelecionada && (
										<GestanteResumoCard gestante={gestanteSelecionada} />
									)}
								</div>

								<div className="flex flex-col gap-3">
									<Divider text="Resultado" />
									{assessment && (
										<ResultadoAvaliacao
											nomeGestante={gestanteSelecionada?.name ?? ""}
											pontuacao={assessment.result.totalScore}
											vulnerabilityLevel={assessment.result.vulnerabilityLevel}
											vulnerabilityBandId={
												assessment.result.vulnerabilityBandId
											}
											bands={assessment.snapshot.props.vulnerabilityBands}
										/>
									)}
								</div>

								<RecomendacoesGestante
									classificacao={
										assessment
											? toClassificacao(assessment.result.vulnerabilityLevel)
											: "BAIXA"
									}
									recomendacoes={recomendacoes}
									onAdd={handleAddRecomendacao}
									onUpdate={handleUpdateRecomendacao}
									onRemove={handleRemoveRecomendacao}
									isSubmitting={atualizarRecomendacoes.isPending}
								/>
							</>
						) : (
							<>
								{isPrimeiraEtapa && (
									<EtapaGestante
										gestantes={gestantes}
										gestanteId={gestanteId}
										onGestanteChange={handleGestanteChange}
									/>
								)}
								<EtapaPerguntas
									perguntas={perguntasDaEtapa}
									respostas={respostas}
									onResponder={(perguntaId, opcaoId) =>
										setRespostas((atual) => ({
											...atual,
											[perguntaId]: opcaoId,
										}))
									}
								/>
							</>
						)}
					</div>
				</div>
			</Page>

			<div className="sticky bottom-0 z-10 mt-auto bg-n-0 flex items-center justify-end gap-3 border-t border-n-30 px-10 py-4">
				{!isEtapaResultado && (
					<>
						<Button variant="outline" onClick={handleAnterior}>
							Anterior
						</Button>
						<Button
							disabled={!podeAvancar || enviarAvaliacao.isPending}
							onClick={handleProxima}
						>
							{isUltimaEtapaPerguntas ? "Calcular" : "Próxima"}
						</Button>
					</>
				)}
				{isEtapaResultado && (
					<Button
						variant="warning"
						onClick={() => setConfirmarFinalizarAberto(true)}
					>
						Finalizar
					</Button>
				)}
			</div>

			<ConfirmarCalculoModal
				isLoading={enviarAvaliacao.isPending}
				open={confirmarCalculoAberto}
				onOpenChange={setConfirmarCalculoAberto}
				onConfirmar={handleConfirmarCalculo}
			/>
			<ConfirmarFinalizacaoModal
				open={confirmarFinalizarAberto}
				onOpenChange={setConfirmarFinalizarAberto}
				onConfirmar={handleConfirmarFinalizacao}
			/>
		</div>
	);
}
