import type { Classificacao } from "@/features/avaliacao/constants";
import type { Gestante } from "@/features/gestantes/types/gestante";
import type { HealthUnit } from "@/features/healthUnits/types/healthUnit";
import type { VulnerabilityBand } from "@/features/instrumentos/types/escala";
import type { Usuario } from "@/features/usuarios/types/usuario";

export interface ResumoAplicacao {
	dataAplicacao: string;
	ubs: string;
	aplicador: string;
	categoriaProfissional: string;
	crmCoren: string;
	email: string;
}

export interface DadosGestante {
	nome: string;
	dataNascimento: string;
	idade: number;
	cpf: string;
	cns: string;
}

export interface RespostaPergunta {
	id: string;
	pergunta: string;
	resposta: string;
}

export interface CategoriaRespostas {
	id: string;
	titulo: string;
	respostas: RespostaPergunta[];
}

export interface RecomendacaoGestante {
	id: string;
	titulo: string;
	observacoes: string;
}

export interface AvaliacaoDetalhe {
	id: string;
	resumo: ResumoAplicacao;
	gestante: DadosGestante;
	pontuacao: number;
	classificacao: Classificacao;
	categorias: CategoriaRespostas[];
	recomendacoesGestante: RecomendacaoGestante[];
}

export interface AssessmentQuestion {
	id: string;
	section: string;
	statement: string;
	required: boolean;
	//TODO: mudar para tipos aceitos
	type: string;
	order: number;
	options: Array<{ id: string; label: string; score: number; order: number }>;
	visibleWhenOptionId?: string | null;
	visibleWhenQuestionId?: string | null;
}

export interface AssessmentRecommendation {
	id: string;
	text: string;
	order: number;
	fromSnapshot: boolean;
}

export interface AssessmentResult {
	totalScore: number;
	vulnerabilityLevel: string;
	vulnerabilityBandId: string;
	calculatedAt: string;
}

interface AssessmentAnswer {
	id: string;
	questionId: string;
	questionStatement: string;
	optionId: string;
	optionLabel: string;
	score: number;
}

export interface QuestionnaireSnapshot {
	questionnaireVersionId: string;
	versionNumber: number;
	capturedAt: string;
	questions: AssessmentQuestion[];
	vulnerabilityBands: VulnerabilityBand[];
}

export interface Assessment {
	id: string;
	patient: Gestante;
	appliedAt: string;
	appliedByUser: Usuario;
	healthUnit: HealthUnit;
	snapshot: { props: QuestionnaireSnapshot };
	answers: AssessmentAnswer[];
	result: AssessmentResult;
	recommendations: AssessmentRecommendation[];
	createdAt: string;
	updatedAt: string;
}
