import { Page } from "@/components/Layout/Page";
import { Divider } from "@/components/ui/divider";
import { ResultadoAvaliacao } from "@/features/avaliacao/components/ResultadoAvaliacao";
import { useAssessment } from "@/features/avaliacao/composables/useAssessments";
import { toClassificacao } from "@/features/avaliacao/utils/classificacao";
import { useParams } from "react-router-dom";
import { AvaliacaoRecomendacoesGestante } from "../components/AvaliacaoRecomendacoesGestante";
import { GestanteResumoCard } from "../components/GestanteResumoCard";
import { ResumoAplicacaoCard } from "../components/ResumoAplicacaoCard";
import { CATEGORIA_PROFISSIONAL_LABEL } from "@/features/usuarios/constants/categoriaProfissional";
import { ROLE_TO_CATEGORIA } from "@/features/usuarios/types/usuario";

export function AvaliacaoDetalhePage() {
	const { id } = useParams<{ id: string }>();
	const { data: assessment, isLoading, isError } = useAssessment(id);

	if (isLoading)
		return <Page title="Avaliação" description="Carregando avaliação..." />;
	if (isError || !assessment)
		return (
			<Page
				title="Avaliação"
				description="Não foi possível carregar esta avaliação."
			/>
		);

	return (
		<Page
			title={`Avaliação #${assessment.id}`}
			description="Dados registrados no momento da aplicação."
		>
			<div className="flex flex-col gap-6">
				<section className="flex flex-col gap-3">
					<Divider text="Resumo da aplicação" />
					<ResumoAplicacaoCard
						appliedAt={assessment.appliedAt}
						ubs={assessment.healthUnit.name}
						aplicador={assessment.appliedByUser.name}
						categoriaProfissional={CATEGORIA_PROFISSIONAL_LABEL[ROLE_TO_CATEGORIA[assessment.appliedByUser.role]]}
						crmCoren={assessment.appliedByUser.professionalRegistration}
						email={assessment.appliedByUser.email}
					/>
				</section>

				<section className="flex flex-col gap-3">
					<Divider text="Gestante" />
					<GestanteResumoCard gestante={assessment.patient} />
				</section>

				<section className="flex flex-col gap-3">
					<Divider text="Resultado" />
					<ResultadoAvaliacao
						nomeGestante={assessment.patient.name}
						pontuacao={assessment.result.totalScore}
						classificacao={toClassificacao(assessment.result.vulnerabilityLevel)}
					/>
				</section>

				{/*
					Cada resposta do back não referência a categoria que a pergunta se encontra.
					Com isso, não dá pra organizar as perguntas por categoria, como no Figma.
				*/}
				<section className="flex flex-col gap-3">
					<Divider text="Respostas" />
					<ul className="space-y-2 text-sm text-n-700">
						{assessment.answers.map((answer) => (
							<li key={answer.id} className="rounded-md border border-n-40 p-3">
								<p className="font-medium">{answer.questionStatement}</p>
								<p>{answer.optionLabel}</p>
							</li>
						))}
					</ul>
				</section>

				<section className="flex flex-col gap-3">
					<Divider text="Recomendações" />
					<AvaliacaoRecomendacoesGestante
						recomendacoes={assessment.recommendations}
					/>
				</section>
			</div>
		</Page>
	);
}
