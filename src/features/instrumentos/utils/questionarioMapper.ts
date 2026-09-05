import type { OpcaoResposta, PerguntaConfig, SecaoConfig, TipoPergunta } from '@/features/instrumentos/types/questionario'
import type {
	AnswerOptionApi,
	QuestionApi,
	QuestionApiType,
	ReplaceQuestionPayload,
	ReplaceQuestionsPayload,
	QuestionnaireVersionApi,
} from '@/features/instrumentos/types/questionnaireApi'

const MONGO_ID_PATTERN = /^[a-f\d]{24}$/i

function isPersistedId(id: string): boolean {
	return MONGO_ID_PATTERN.test(id)
}

function toTipoPergunta(type: QuestionApiType): TipoPergunta {
	return type === 'YES_NO' ? 'dicotomica' : 'multipla'
}

function toQuestionApiType(tipo: TipoPergunta): QuestionApiType {
	return tipo === 'dicotomica' || tipo === 'dicotomica_complementar' ? 'YES_NO' : 'MULTIPLE_CHOICE'
}

function toOpcaoResposta(option: AnswerOptionApi): OpcaoResposta {
	return {
		id: option.id,
		texto: option.label,
		pontuavel: option.score !== 0,
		pontuacao: option.score,
	}
}

function toPerguntaConfig(question: QuestionApi): PerguntaConfig {
	return {
		id: question.id,
		codigo: '',
		enunciado: question.statement,
		tipo: toTipoPergunta(question.type),
		opcoes: question.options.map(toOpcaoResposta),
	}
}

export function toSections(version: QuestionnaireVersionApi): SecaoConfig[] {
	const perguntasPorId = new Map(version.questions.map((question) => [question.id, toPerguntaConfig(question)]))

	for (const question of version.questions) {
		if (!question.visibleWhenQuestionId) continue
		const parent = perguntasPorId.get(question.visibleWhenQuestionId)
		const child = perguntasPorId.get(question.id)
		if (!parent || !child) continue
		parent.tipo = 'dicotomica_complementar'
		parent.subPerguntas = [...(parent.subPerguntas ?? []), child]
	}

	const secoes = new Map<string, SecaoConfig>()
	for (const question of version.questions) {
		if (question.visibleWhenQuestionId) continue
		const secao = secoes.get(question.section) ?? { id: question.section, nome: question.section, perguntas: [] }
		secao.perguntas.push(perguntasPorId.get(question.id)!)
		secoes.set(question.section, secao)
	}
	return [...secoes.values()]
}

function opcaoQueDisparaCondicional(pergunta: PerguntaConfig): OpcaoResposta | undefined {
	return pergunta.opcoes.find((opcao) => opcao.texto.trim().toLowerCase() === 'sim')
}

function toReplaceQuestionPayload(
	pergunta: PerguntaConfig,
	section: string,
	order: number,
	parent?: PerguntaConfig,
): ReplaceQuestionPayload {
	const triggeringOption = parent ? opcaoQueDisparaCondicional(parent) : undefined

	return {
		questionId: isPersistedId(pergunta.id) ? pergunta.id : undefined,
		clientId: pergunta.id,
		section,
		statement: pergunta.enunciado.trim(),
		type: toQuestionApiType(pergunta.tipo),
		order,
		required: true,
		visibleWhenClientId: parent?.id,
		visibleWhenOptionClientId: triggeringOption?.id,
		options: pergunta.opcoes.map((opcao, index) => ({
			optionId: isPersistedId(opcao.id) ? opcao.id : undefined,
			clientId: opcao.id,
			label: opcao.texto.trim(),
			score: opcao.pontuavel ? (opcao.pontuacao ?? 0) : 0,
			order: index,
		})),
	}
}

function flattenPerguntas(
	perguntas: PerguntaConfig[],
	section: string,
	parent: PerguntaConfig | undefined,
	payloads: ReplaceQuestionPayload[],
): void {
	perguntas.forEach((pergunta, order) => {
		payloads.push(toReplaceQuestionPayload(pergunta, section, order, parent))
		flattenPerguntas(pergunta.subPerguntas ?? [], section, pergunta, payloads)
	})
}

export function toReplaceQuestionsPayload(secoes: SecaoConfig[]): ReplaceQuestionsPayload {
	const questions: ReplaceQuestionPayload[] = []
	for (const secao of secoes) {
		flattenPerguntas(secao.perguntas, secao.nome.trim(), undefined, questions)
	}
	return { questions }
}
