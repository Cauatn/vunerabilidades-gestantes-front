import type {
	AnswerOption,
	QuestionConfig,
	SectionConfig,
	QuestionType,
} from '@/features/instrumentos/types/questionnaire'
import type {
	AnswerOptionApi,
	QuestionApi,
	QuestionApiType,
	ReplaceQuestionPayload,
	ReplaceQuestionsPayload,
	QuestionnaireVersionApi,
} from '@/features/instrumentos/types/questionnaireApi'

function toQuestionType(type: QuestionApiType): QuestionType {
	return type === 'YES_NO' ? 'dicotomica' : 'multipla'
}

function toQuestionApiType(type: QuestionType): QuestionApiType {
	return type === 'dicotomica' || type === 'dicotomica_complementar'
		? 'YES_NO'
		: 'MULTIPLE_CHOICE'
}

function toAnswerOption(option: AnswerOptionApi): AnswerOption {
	return {
		id: option.id,
		text: option.label,
		scorable: option.score !== 0,
		score: option.score,
	}
}

function toQuestionConfig(question: QuestionApi): QuestionConfig {
	return {
		id: question.id,
		statement: question.statement,
		type: toQuestionType(question.type),
		options: question.options.map(toAnswerOption),
	}
}

export function toSections(version: QuestionnaireVersionApi): SectionConfig[] {
	const questionsById = new Map(
		version.questions.map((question) => [
			question.id,
			toQuestionConfig(question),
		]),
	)

	for (const question of version.questions) {
		if (!question.visibleWhenQuestionId) continue
		const parent = questionsById.get(question.visibleWhenQuestionId)
		const child = questionsById.get(question.id)
		if (!parent || !child) continue
		parent.type = 'dicotomica_complementar'
		parent.subQuestions = [...(parent.subQuestions ?? []), child]
	}

	const sections = new Map<string, SectionConfig>()
	for (const question of version.questions) {
		if (question.visibleWhenQuestionId) continue
		const section = sections.get(question.section) ?? {
			id: question.section,
			name: question.section,
			questions: [],
		}
		section.questions.push(questionsById.get(question.id)!)
		sections.set(question.section, section)
	}
	return [...sections.values()]
}

function findTriggeringOption(
	question: QuestionConfig,
): AnswerOption | undefined {
	return question.options.find(
		(option) => option.text.trim().toLowerCase() === 'sim',
	)
}

function toReplaceQuestionPayload(
	question: QuestionConfig,
	section: string,
	order: number,
	parent?: QuestionConfig,
): ReplaceQuestionPayload {
	const triggeringOption = parent ? findTriggeringOption(parent) : undefined

	return {
		// O lote substitui o rascunho inteiro. IDs da versão de origem servem
		// apenas como clientId: a clonagem gera novos IDs no backend.
		clientId: question.id,
		section,
		statement: question.statement.trim(),
		type: toQuestionApiType(question.type),
		order,
		required: true,
		visibleWhenClientId: parent?.id,
		visibleWhenOptionClientId: triggeringOption?.id,
		options: question.options.map((option, index) => ({
			clientId: option.id,
			label: option.text.trim(),
			score: option.scorable ? (option.score ?? 0) : 0,
			order: index,
		})),
	}
}

function flattenQuestions(
	questions: QuestionConfig[],
	section: string,
	parent: QuestionConfig | undefined,
	payloads: ReplaceQuestionPayload[],
): void {
	questions.forEach((question, order) => {
		payloads.push(
			toReplaceQuestionPayload(question, section, order, parent),
		)
		flattenQuestions(
			question.subQuestions ?? [],
			section,
			question,
			payloads,
		)
	})
}

export function toReplaceQuestionsPayload(
	sections: SectionConfig[],
): ReplaceQuestionsPayload {
	const questions: ReplaceQuestionPayload[] = []
	for (const section of sections) {
		flattenQuestions(
			section.questions,
			section.name.trim(),
			undefined,
			questions,
		)
	}
	return { questions }
}
